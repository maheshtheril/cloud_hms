# 💰 Sale Price - TAX INCLUDED OR EXCLUDED?

## ❓ Your Question:
**"Where you are taking sale price. Is it tax included?"**

---

## ✅ **ANSWER: Sale Price is TAX-EXCLUDED**

### **How It Works in Your System:**

**Sale Price = Base Price (Without Tax)**

When customer buys:
```
Sale Price:     ₹100  (Tax-excluded)
Tax (18%):      ₹ 18
--------------------------
Customer Pays:  ₹118  (Total)
```

---

## 📊 **Example:**

### **Purchase Receipt:**
```
Item: Paracetamol
Purchase Cost: ₹50
MRP: ₹100
Sale Price (calculated): ₹95  (MRP - 5%)
Tax Rate: 5%
```

### **Sale Bill:**
```
Item: Paracetamol
Sale Price: ₹95  (tax-excluded)
Tax (5%): ₹4.75
--------------------------
Customer Pays: ₹99.75
```

---

## 🎯 **GST Standard Practice:**

In India GST billing:
- **Sale Price** = Price WITHOUT tax
- **Tax** = Calculated separately
- **Bill Amount** = Sale Price + Tax

This is the **standard GST practice**.

---

## 📝 **In Your Database:**

Looking at purchase receipt:
```sql
-- When you receive goods
sale_price = 95      -- Tax-excluded
tax_rate = 5         -- Percentage
```

When customer buys:
```
Taxable Value = Sale Price × Qty = 95 × 1 = ₹95
Tax Amount = 95 × 0.05 = ₹4.75
Total = 95 + 4.75 = ₹99.75
```

---

## ⚠️ **If You Want Tax-INCLUDED Price:**

You would need to:
1. Store "display_price" (tax-included)
2. Calculate backwards:
   ```
   Sale Price = Display Price / (1 + Tax Rate)
   Tax = Display Price - Sale Price
   ```

**Example:**
```
Display Price (MRP): ₹100 (tax-included)
Tax Rate: 5%
Sale Price = 100 / 1.05 = ₹95.24
Tax = 100 - 95.24 = ₹4.76
```

---

## 💡 **Current System is CORRECT**

Your current implementation is the **standard GST way**:
- ✅ Sale price is tax-excluded
- ✅ Tax calculated visibly
- ✅ Customer sees breakdown
- ✅ GST compliant

---

## 🎯 **MRP vs Sale Price:**

**MRP (Maximum Retail Price):**
- Usually includes tax
- Legal limit you can charge
- Printed on package

**Sale Price:**
- Your actual selling price
- Can be less than MRP  
- Tax-excluded in billing

**Example:**
```
MRP: ₹100 (includes tax)
Your Sale Price: ₹95 (excludes tax)
Tax (5%): ₹4.75
Customer Pays: ₹99.75 ✓ (Less than MRP ✓)
```

---

## ✅ **Summary:**

**Your System:**
- Sale Price = Tax-EXCLUDED ✓
- Tax shown separately ✓
- Customer pays: Price + Tax ✓
- GST compliant ✓

**This is CORRECT and standard!**
