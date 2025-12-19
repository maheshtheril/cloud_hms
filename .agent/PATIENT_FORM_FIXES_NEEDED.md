# Patient Form - Issues to Fix

## Current Problems (from screenshot):

### 1. Patient Name Field ❌
**Issue:** Name input shows salutation dropdown (Mr, Mrs, Ms, Dr, Md, Smt, Baby, Master, Sri, Kumari, Marital Status) but it seems to be autocomplete suggestions, not a proper dropdown

**Fix Needed:**
- Add a separate small dropdown BEFORE the name input
- Structure: [Dropdown: Title] [Input: Enter Name]
- The dropdown should be 80-100px wide with options: Mr, Mrs, Ms, Dr, Md, Smt, Baby, Master, Sri, Kumari

### 2. Age → DOB Calculation ❌
**Issue:** When user types age (e.g., "25"), the DOB field doesn't show the calculated date

**Current Code:**
```tsx
{useAge ? (
    // Shows Age input + Years dropdown
    // But hides DOB field completely
) : (
    // Shows DOB field
    // But hides Age input
)}
```

**Fix Needed:**
Show BOTH Age and DOB fields ALWAYS:
```
[Age: 25] [Years ▼] [DOB: 1999-12-19]
```
-When user types age → Auto-fill DOB
- When user selects DOB → Auto-fill age
- Both visible at all times

### 3. Missing City Field
**Issue:** City field might be getting hidden or not in the right position

**Fix:**
Ensure fields appear in this order in the basic section:
1. Patient Name (with salutation)
2. Phone Number  
3. Gender (M/F/Other buttons)
4. Age or DOB (both visible)
5. Preferred Language
6. City
7. Address
8. Pin

## Expected Layout (Basic Section):

```
┌─────────────────────────────────┬─────────────────────────────────┐
│  Patient Name* [▼ Title] [Name] │  Phone Number* [📞 Number]      │
│  Enter the Name of the Patient  │                                  │
├─────────────────────────────────┼─────────────────────────────────┤
│  Gender*                        │  Age or DOB*                     │
│  [M] [F] [Other]               │  [25] [Years▼] [📅 1999-12-19]  │
├─────────────────────────────────┴─────────────────────────────────┤
│  Preferred Language                                                │
│  [English ▼]                                                       │
├─────────────────────────────────┬─────────────────────────────────┤
│  City                          │  Address                         │
│  [Enter City]                  │  [Enter Address]                 │
├─────────────────────────────────┴─────────────────────────────────┤
│  Pin                                                               │
│  [Enter Pin]                                                       │
└────────────────────────────────────────────────────────────────────┘
```

## Code Changes Required:

### Patient Name:
```tsx
<div className="flex gap-2">
    <select className="w-24 px-3 py-3 border-2 border-gray-300 rounded-lg...">
        <option value="">Title</option>
        <option>Mr</option>
        <option>Mrs</option>
        <option>Ms</option>
        {/* ... */}
    </select>
    <div className="relative flex-1">
        <User className="..." />
        <input name="first_name" required placeholder="Enter Name" ... />
    </div>
</div>
```

### Age/DOB - Both Always Visible:
```tsx
<div className="flex gap-2">
    <input
        type="number"
        value={age}
        onChange={(e) => handleAgeChange(e.target.value, ageUnit)}
        placeholder="Age"
        className="w-20 px-3 py-3..." 
    />
    <select value={ageUnit} onChange={(e) => handleAgeChange(age, e.target.value)} ...>
        <option>Years</option>
        <option>Months</option>
        <option>Days</option>
    </select>
    <div className="relative flex-1">
        <Calendar className="..." />
        <input
            type="date"
            name="dob"
            value={dob}
            onChange={(e) => handleDobChange(e.target.value)}
            className="w-full pl-10..."
        />
    </div>
</div>
```

## Testing Checklist:

After fixes:
- [ ] Type Age: 25 → DOB shows "1999-12-19"
- [ ] Select DOB: 1995-05-15 → Age shows "29"  
- [ ] Change Years to Months → Recalculates DOB
- [ ] Salutation dropdown shows before name input
- [ ] City field visible in basic section
- [ ] Gender buttons toggle correctly
- [ ] All fields have proper spacing

