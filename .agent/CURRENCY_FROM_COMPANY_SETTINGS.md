# 💱 Currency from Company Settings - Implementation Guide

**Request:** Make ALL forms use currency from company settings instead of hardcoded values.

---

## ✅ What Needs to Be Done

### **Current Situation:**
- CRM Deal form has hardcoded currency dropdown (USD, EUR, INR)
- Other forms may also have hardcoded currency fields
- Currency should come from `company_accounting_settings.currency_id`

### **Solution:**
Create a centralized currency system that fetches from company settings.

---

## 📊 Database Structure

```sql
company_accounting_settings {
  id
  company_id
  currency_id  -- References currencies table
  ...
}

currencies {
  id
  code  -- "INR", "USD", etc.
  symbol  -- "₹", "$", etc.
  name  -- "Indian Rupee", etc.
}

company {
  id
  tenant_id
  country_id  -- Fallback for currency
  ...
}
```

### **Priority Logic:**
1. **Company Accounting Settings** → `currency_id`
2. **Company Country** → Default currency for that country
3. **Fallback** → USD

---

## 🛠️ Implementation Steps

### **Step 1: Create Currency Utility Function**

File: `src/lib/currency.ts` (UPDATE existing)

```typescript
/**
 * Get company's default currency from settings
 */
export async function getCompanyDefaultCurrency(companyId?: string): Promise<string> {
    'use server'
    
    const session = await auth()
    if (!session?.user?.tenantId) return 'USD'
    
    // Get accounting settings
    const accountingSettings = await prisma.company_accounting_settings.findFirst({
        where: {
            tenant_id: session.user.tenantId,
            ...(companyId ? { company_id: companyId } : {}),
        },
        include: {
            currencies: {
                select: {
                    code: true,
                }
            }
        }
    })
    
    if (accountingSettings?.currencies?.code) {
        return accountingSettings.currencies.code
    }
    
    // Fall back to country-based currency
    const company = await prisma.company.findFirst({
        where: {
            tenant_id: session.user.tenantId,
            ...(companyId ? { id: companyId } : {}),
        },
        include: {
            countries: { select: { iso2: true } }
        }
    })
    
    const countryCode = company?.countries?.iso2?.toUpperCase()
    return CURRENCY_CODES[countryCode] || 'USD'
}
```

---

### **Step 2: Update CRM Deal Form**

File: `src/app/crm/deals/new/page.tsx`

```typescript
import { getCompanyDefaultCurrency } from '@/lib/currency'

export default async function NewDealPage() {
    const defaultCurrency = await getCompanyDefaultCurrency()
    
    return (
        <div>
            <DealForm defaultCurrency={defaultCurrency} />
        </div>
    )
}
```

File: `src/components/crm/deal-form.tsx`

```typescript
export function DealForm({ defaultCurrency = 'USD' }: { defaultCurrency?: string }) {
    return (
        <select name="currency" defaultValue={defaultCurrency}>
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            ...
        </select>
    )
}
```

---

### **Step 3: Update Other Forms**

#### **Forms That Need Currency:**

1. **CRM Leads Form** (`src/components/crm/lead-form.tsx`)
   - If it has currency field

2. **Sales Invoicing** (`src/app/sales/...`)
   - Should use company currency

3. **Purchase Orders** (`src/app/purchasing/...`)
   - Should use company currency

4. **Billing Module** (`src/app/billing/...`)
   - Should use company currency

---

## 📋 Quick Implementation

### **Option A: Server Component (Recommended)**

```typescript
// In page.tsx
import { getCompanyDefaultCurrency } from '@/lib/currency'

export default async function FormPage() {
    const currency = await getCompanyDefaultCurrency()
    
    return <MyForm defaultCurrency={currency} />
}
```

### **Option B: Client Component with Server Action**

```typescript
'use client'
import { useEffect, useState } from 'react'
import { getCompanyDefaultCurrency } from '@/lib/currency'

export function MyForm() {
    const [currency, setCurrency] = useState('USD')
    
    useEffect(() => {
        getCompanyDefaultCurrency().then(setCurrency)
    }, [])
    
    return <select defaultValue={currency}>...</select>
}
```

---

## 🎯 Files Currently Updated

✅ `src/lib/currency.ts` - Added `getCompanyDefaultCurrency()` function
✅ `src/app/crm/deals/new/page.tsx` - Fetches default currency
✅ `src/components/crm/deal-form.tsx` - Uses default currency

---

## 📝 Remaining Tasks

- [ ] Fix TypeScript errors in `src/lib/currency.ts`
- [ ] Test with company that has currency set in settings
- [ ] Test with company without currency (should fall back to country)
- [ ] Apply to all other forms:
  - [ ] Sales invoicing
  - [ ] Purchase orders
  - [ ] Billing forms
  - [ ] Any other currency fields

---

## 🔧 How to Set Company Currency

### **Via UI (If settings page exists):**
1. Go to Company Settings → Accounting
2. Select default currency
3. Save

### **Via Database:**
```sql
-- First, get currency ID for INR
SELECT id FROM currencies WHERE code = 'INR';

-- Then update company accounting settings
UPDATE company_accounting_settings
SET currency_id = '<INR_currency_id>'
WHERE company_id = '<your_company_id>';
```

---

## ✅ Expected Behavior

**Scenario 1: Currency Set in Settings**
- User signup → India selected
- Admin goes to settings → Sets currency to INR
- **Result:** All forms show INR by default

**Scenario 2: No Currency in Settings**
- User signup → India selected
- No currency set in settings
- **Result:** System falls back to country (India → INR)

**Scenario 3: No Country or Currency**
- No data available
- **Result:** System defaults to USD

---

## 🚀 Testing Checklist

- [ ] User from India sees INR in deal form
- [ ] User from UK sees GBP in deal form
- [ ] User from USA sees USD in deal form
- [ ] Currency can be changed manually in dropdown
- [ ] Setting currency in company settings overrides country default
- [ ] All forms use the same currency

---

## 💡 Future Enhancements

1. **Multi-Currency Support:**
   - Allow transactions in multiple currencies
   - Auto exchange rate conversion

2. **Currency Formatting:**
   - Format numbers according to currency locale
   - Show correct decimal places

3. **Currency Symbol Display:**
   - Show symbol next to input fields
   - Dynamic based on selected currency

---

**Status:** Partially implemented - needs TypeScript fixes and broader application to all forms.

**Next Step:** Fix the lint errors in `src/lib/currency.ts` and apply to remaining forms.
