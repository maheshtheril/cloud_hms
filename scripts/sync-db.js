require('dotenv').config();
const fs = require('fs');
const { Client } = require('pg');

async function sync() {
  // 1. Get database URL from Environment Variables (set by Vercel)
  const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in environment.');
    return;
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Starting Automatic Database Sync...');

    // 2. Parse schema.prisma
    const content = fs.readFileSync('prisma/schema.prisma', 'utf8');
    const lines = content.split('\n');
    const models = {};
    let currentModel = null;

    for (const line of lines) {
      const trimmed = line.trim();
      const modelMatch = trimmed.match(/^model\s+(\w+)\s+\{/);
      if (modelMatch) { currentModel = modelMatch[1]; models[currentModel] = { fields: [] }; continue; }
      if (trimmed === '}' && currentModel) { currentModel = null; continue; }

      if (currentModel && trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('@@')) {
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 2) {
          const name = parts[0];
          let type = parts[1].replace('?', '').replace('[]', '');
          if (trimmed.includes('@relation')) continue;

          let sqlType = 'TEXT';
          if (type === 'Boolean') sqlType = 'BOOLEAN';
          else if (type === 'Int') sqlType = 'INTEGER';
          else if (type === 'Decimal') sqlType = 'DECIMAL(20,4)';
          else if (type === 'DateTime') sqlType = 'TIMESTAMP WITH TIME ZONE';
          else if (type === 'Json') sqlType = 'JSONB';
          else sqlType = 'TEXT';

          if (trimmed.includes('[]')) sqlType += '[]';
          models[currentModel].fields.push({ name, sqlType, isId: trimmed.includes('@id') });
        }
      }
    }

    // 3. Generate SQL
    let sql = 'BEGIN;\n';
    for (const [modelName, model] of Object.entries(models)) {
      const pkField = model.fields.find(f => f.isId);
      let pkDef = '"id" UUID PRIMARY KEY DEFAULT gen_random_uuid()';
      if (pkField) {
        pkDef = `"${pkField.name}" ${pkField.sqlType} PRIMARY KEY`;
        if (pkField.sqlType === 'UUID') pkDef += ' DEFAULT gen_random_uuid()';
      }
      sql += `CREATE TABLE IF NOT EXISTS "${modelName}" (${pkDef});\n`;
      for (const field of model.fields) {
        sql += `ALTER TABLE "${modelName}" ADD COLUMN IF NOT EXISTS "${field.name}" ${field.sqlType};\n`;
      }
    }
    sql += 'COMMIT;\n';

    // 4. THE HAMMER: Extra Repairs for Triggers and UUID Defaults
    sql += `
        BEGIN;
        -- ENSURE EXTENSION
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";

        -- Fix Invoice History Trigger (Explicit ID)
        CREATE OR REPLACE FUNCTION public.hms_invoice_history_trigger() 
        RETURNS trigger AS $$
        DECLARE v_user_id uuid;
        BEGIN
          v_user_id := NULLIF(current_setting('app.current_user_id', true), '')::uuid;
          IF TG_OP = 'UPDATE' THEN
            INSERT INTO public.hms_invoice_history (id, tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at)
            VALUES (gen_random_uuid(), NEW.tenant_id, NEW.company_id, NEW.id, v_user_id, 'update', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)), now());
            RETURN NEW;
          ELSIF TG_OP = 'INSERT' THEN
            INSERT INTO public.hms_invoice_history (id, tenant_id, company_id, invoice_id, changed_by, change_type, delta, changed_at)
            VALUES (gen_random_uuid(), NEW.tenant_id, NEW.company_id, NEW.id, NEW.created_by, 'insert', jsonb_build_object('new', to_jsonb(NEW)), now());
            RETURN NEW;
          ELSE RETURN NEW; END IF;
        END;
        $$ LANGUAGE plpgsql;

        -- Fix Patient Audit Trigger (Explicit ID & Defensive)
        CREATE OR REPLACE FUNCTION public.hms_patient_audit_trigger() RETURNS trigger AS $$
        BEGIN
          IF (TG_OP = 'DELETE') THEN
            INSERT INTO public.hms_patient_audit (id, patient_id, operation, changed_at, row_data)
            VALUES (gen_random_uuid(), OLD.id, TG_OP, now(), row_to_json(OLD));
            RETURN OLD;
          ELSE
            INSERT INTO public.hms_patient_audit (id, patient_id, operation, changed_at, row_data)
            VALUES (gen_random_uuid(), COALESCE(NEW.id, OLD.id), TG_OP, now(), row_to_json(COALESCE(NEW, OLD)));
            RETURN NEW;
          END IF;
        END;
        $$ LANGUAGE plpgsql;

        -- Force Defaults for all ID columns
        DO $$ 
        DECLARE 
            r RECORD;
        BEGIN
            FOR r IN (
                SELECT table_name, column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                  AND column_name = 'id' 
                  AND data_type = 'uuid'
            ) LOOP
                EXECUTE 'ALTER TABLE public.' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' SET DEFAULT gen_random_uuid()';
            END LOOP;
        END $$;

        -- RCM REPAIR: Convert native arrays back to JSONB to match trigger logic
        DO $$ 
        BEGIN
            -- 1. Invoices
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hms_invoice' AND column_name = 'line_items' AND data_type = 'ARRAY') THEN
                ALTER TABLE public.hms_invoice ALTER COLUMN line_items SET DATA TYPE jsonb USING to_jsonb(line_items);
                ALTER TABLE public.hms_invoice ALTER COLUMN line_items SET DEFAULT '[]'::jsonb;
            END IF;
            
            ALTER TABLE public.hms_invoice ALTER COLUMN billing_metadata SET DATA TYPE jsonb USING COALESCE(billing_metadata, '{}'::jsonb);
            ALTER TABLE public.hms_invoice ALTER COLUMN billing_metadata SET DEFAULT '{}'::jsonb;

            -- 2. Clinicians
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hms_clinicians' AND column_name = 'working_days' AND data_type != 'ARRAY') THEN
                ALTER TABLE public.hms_clinicians ALTER COLUMN working_days SET DATA TYPE text[] USING ('{Monday,Tuesday,Wednesday,Thursday,Friday}'::text[]);
                ALTER TABLE public.hms_clinicians ALTER COLUMN working_days SET DEFAULT '{Monday,Tuesday,Wednesday,Thursday,Friday}'::text[];
            END IF;

            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hms_clinicians' AND column_name = 'document_urls' AND data_type = 'ARRAY') THEN
                ALTER TABLE public.hms_clinicians ALTER COLUMN document_urls SET DATA TYPE jsonb USING to_jsonb(document_urls);
                ALTER TABLE public.hms_clinicians ALTER COLUMN document_urls SET DEFAULT '[]'::jsonb;
            END IF;

            -- 3. Global Scanner: Fix ANY column that Prisma thinks is JSON but DB says is ARRAY
            -- This is the ultimate "malformed array literal" killer.
            DO $fix$ 
            DECLARE 
                r RECORD;
            BEGIN
                FOR r IN (
                    SELECT table_name, column_name 
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                      AND data_type = 'ARRAY'
                      AND column_name IN ('metadata', 'line_items', 'billing_metadata', 'document_urls', 'extra_data', 'config')
                ) LOOP
                    EXECUTE 'ALTER TABLE public.' || quote_ident(r.table_name) || ' ALTER COLUMN ' || quote_ident(r.column_name) || ' SET DATA TYPE jsonb USING to_jsonb(' || quote_ident(r.column_name) || ')';
                END LOOP;
            END $fix$;

            -- UOM MASTER REPAIR: Ensure unique constraints exist for upserts
            -- Category
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ux_hms_uom_category_name') THEN
                ALTER TABLE public.hms_uom_category ADD CONSTRAINT ux_hms_uom_category_name UNIQUE (tenant_id, company_id, name);
            END IF;

            -- UOM
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ux_hms_uom_name') THEN
                ALTER TABLE public.hms_uom ADD CONSTRAINT ux_hms_uom_name UNIQUE (tenant_id, company_id, category_id, name);
            END IF;

        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'RCM Repair failed: %', SQLERRM;
        END $$;

        -- RCM REPAIR: Fix triggers that expect JSONB but might hit nulls or remnants
        CREATE OR REPLACE FUNCTION public.hms_sync_invoice_lines_on_upsert() 
        RETURNS trigger AS $$
        DECLARE
          lines jsonb; i int := 0; l jsonb; nid uuid;
        BEGIN
          -- Defensive check for RCM
          IF (NEW.id IS NULL) THEN RETURN NEW; END IF;
          
          DELETE FROM hms_invoice_lines WHERE invoice_id = NEW.id;
          lines := NEW.line_items;
          
          -- Fix: If lines is NOT a jsonb array (or null), skip sync but allow the save
          IF lines IS NULL OR jsonb_typeof(lines) != 'array' THEN RETURN NEW; END IF;
          
          FOR i IN 0 .. jsonb_array_length(lines) - 1 LOOP
            l := lines->i;
            nid := COALESCE((l->>'line_id')::uuid, gen_random_uuid());
            INSERT INTO hms_invoice_lines(id, tenant_id, company_id, invoice_id, line_idx, line_ref, product_id, description, quantity, uom, unit_price, discount_amount, tax_amount, net_amount, metadata, created_at)
            VALUES (nid, NEW.tenant_id, NEW.company_id, NEW.id, i, l->>'service_code', NULLIF(l->>'product_id','')::uuid, l->>'description', COALESCE((l->>'quantity')::numeric,1), l->>'unit', COALESCE((l->>'unit_price')::numeric,0), COALESCE((l->'discount'->>'amount')::numeric,0), COALESCE((l->'taxes'->0->>'amount')::numeric,0), COALESCE((l->>'net_amount')::numeric,0), l->'metadata', now());
          END LOOP;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        COMMIT;
        `;

    // 4. Execute
    await client.connect();
    await client.query(sql);
    console.log('✅ Database Structure Synced Successfully.');

  } catch (err) {
    console.error('❌ Sync Failed:', err.message);
  } finally {
    await client.end();
  }
}

sync();
