
-- AlterTable
ALTER TABLE "journal_entries" ADD COLUMN IF NOT EXISTS "currency_id" UUID;
ALTER TABLE "journal_entries" ADD COLUMN IF NOT EXISTS "amount_in_company_currency" DECIMAL(18,6);
ALTER TABLE "journal_entries" ADD COLUMN IF NOT EXISTS "fx_rate" DECIMAL(18,6);
ALTER TABLE "journal_entries" ADD COLUMN IF NOT EXISTS "journal_id" UUID;
