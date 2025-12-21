# 🎨 MANDATORY UI DESIGN STANDARDS - ALWAYS FOLLOW

## ⚠️ CRITICAL RULE
**EVERY new page, form, or component MUST follow these standards automatically. NO EXCEPTIONS.**

---

## 🎯 Design Philosophy

**World-Class • Futuristic • Premium • Professional**

Every UI element should look like it belongs in a top-tier SaaS product (Stripe, Linear, Vercel quality).

---

## 📐 Standard Page Layout Template

```tsx
export default function YourPage() {
    return (
        <div className="min-h-screen bg-futuristic">
            {/* Animated Background - ALWAYS INCLUDE */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />
            </div>

            <div className="relative container mx-auto py-8 space-y-8">
                {/* Header Section - ALWAYS INCLUDE */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-gradient-primary">
                            <Icon className="h-8 w-8 text-cyan-400 dark:text-cyan-300" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gradient-primary">
                                Page Title
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">
                                Description text
                            </p>
                        </div>
                    </div>
                    {/* Action buttons */}
                </div>

                {/* Stats Cards (if applicable) - 3 or 4 cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="card-stat-purple p-6 rounded-2xl shadow-xl hover-glow-purple transition-all duration-300">
                        {/* stat content */}
                    </div>
                    {/* more cards */}
                </div>

                {/* Main Content */}
                <div className="card-futuristic">
                    {/* Your content here */}
                </div>
            </div>
        </div>
    )
}
```

---

## 🎨 Form Design Standards

### Standard Form Layout

```tsx
export function YourForm() {
    return (
        <div className="card-futuristic max-w-4xl mx-auto">
            {/* Form Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-500/30">
                    <FormIcon className="h-6 w-6 text-purple-400 dark:text-purple-300" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Form Title
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Form description
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Sections */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/30 dark:to-transparent border border-purple-200/50 dark:border-purple-700/30">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Section Title
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Form fields */}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    <Button type="submit" className="btn-futuristic-primary">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    )
}
```

---

## 🎨 Color Themes by Module

**ALWAYS use these color combinations:**

### CRM Module
- **Primary**: Purple → Cyan
- **Secondary**: Emerald → Teal
- **Accent**: Pink → Purple
- Background blobs: Purple, Cyan, Pink

### HMS Module
- **Primary**: Blue → Cyan
- **Secondary**: Purple → Indigo
- **Accent**: Teal → Blue
- Background blobs: Blue, Cyan, Purple

### Inventory Module
- **Primary**: Orange → Amber
- **Secondary**: Yellow → Orange
- **Accent**: Emerald → Green
- Background blobs: Orange, Amber, Green

### Settings Module
- **Primary**: Slate → Gray
- **Secondary**: Purple → Violet
- **Accent**: Cyan → Blue
- Background blobs: Purple, Cyan, Slate

---

## 🎨 Component Standards

### Buttons

**Primary Action:**
```tsx
<Button className="btn-futuristic-primary">
    <Icon className="w-4 h-4 mr-2" />
    Button Text
</Button>
```

**Secondary Action:**
```tsx
<Button className="btn-futuristic-secondary">
    <Icon className="w-4 h-4 mr-2" />
    Button Text
</Button>
```

**Accent Action:**
```tsx
<Button className="btn-futuristic-accent">
    <Icon className="w-4 h-4 mr-2" />
    Button Text
</Button>
```

### Cards

**Data Cards (items in grid):**
```tsx
<div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl hover:border-purple-500/30 dark:hover:border-purple-400/30 transition-all duration-300 hover:-translate-y-1">
    {/* Card content */}
</div>
```

**Stat Cards:**
```tsx
<div className="card-stat-purple p-6 rounded-2xl shadow-xl hover-glow-purple transition-all duration-300">
    <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Label</p>
        <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
    </div>
    <div className="text-4xl font-bold text-slate-900 dark:text-white">
        Value
    </div>
</div>
```

**Section Cards:**
```tsx
<div className="card-futuristic">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Section Title
    </h2>
    {/* Content */}
</div>
```

### Badges

**Status Badges:**
```tsx
<Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/30">
    Active
</Badge>

<Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/30">
    Inactive
</Badge>
```

**Info Badges:**
```tsx
<Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/30">
    Info
</Badge>
```

### Icons with Backgrounds

**Always wrap icons in gradient containers:**
```tsx
<div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-500/30">
    <Icon className="h-6 w-6 text-purple-400 dark:text-purple-300" />
</div>
```

---

## 🎨 Typography Standards

**Page Headers:**
```tsx
<h1 className="text-4xl font-bold text-gradient-primary">
    Page Title
</h1>
```

**Section Headers:**
```tsx
<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
    Section Title
</h2>
```

**Subsection Headers:**
```tsx
<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
    Subsection Title
</h3>
```

**Body Text:**
```tsx
<p className="text-slate-600 dark:text-slate-400">
    Regular text
</p>
```

**Muted Text:**
```tsx
<p className="text-slate-500 dark:text-slate-500 text-sm">
    Secondary information
</p>
```

---

## 🎨 Empty States

**ALWAYS make empty states premium:**
```tsx
<div className="card-futuristic text-center py-16">
    <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-purple-500/20 mb-6">
        <Icon className="h-16 w-16 text-purple-400 mx-auto" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        No Items Found
    </h3>
    <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg max-w-md mx-auto">
        Description of what the user should do
    </p>
    <Button className="btn-futuristic-primary">
        <Plus className="w-4 h-4 mr-2" />
        Create First Item
    </Button>
</div>
```

---

## 🎨 Dialog/Modal Standards

**Always use glassmorphism for dialogs:**
```tsx
<DialogContent className="max-w-3xl max-h-[90vh] flex flex-col border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-800 dark:to-slate-900 text-white shadow-2xl">
    <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Dialog Title
        </DialogTitle>
        <DialogDescription>
            Dialog description
        </DialogDescription>
    </DialogHeader>
    
    <form className="flex flex-col flex-1 min-h-0">
        <div className="space-y-6 flex-1 overflow-y-auto px-1">
            {/* Content */}
        </div>
        
        <DialogFooter className="mt-6">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" className="btn-futuristic-primary">Save</Button>
        </DialogFooter>
    </form>
</DialogContent>
```

---

## 🎨 Data Tables

**Table Header:**
```tsx
<div className="flex items-center gap-3 mb-6">
    <Icon className="h-6 w-6 text-cyan-400 dark:text-cyan-300" />
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Table Title</h2>
    <Badge variant="outline" className="ml-auto border-cyan-500/30 bg-cyan-950/20 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300">
        {items.length} items
    </Badge>
</div>
```

**Table Rows (if not using shadcn table):**
```tsx
<div className="space-y-3">
    {items.map(item => (
        <div key={item.id} className="group p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 hover:border-purple-500/30 dark:hover:border-purple-400/30 transition-all duration-300">
            {/* Row content */}
        </div>
    ))}
</div>
```

---

## 🎨 Loading States

**Full Page Loading:**
```tsx
<div className="min-h-screen bg-futuristic flex items-center justify-center">
    <div className="text-center">
        <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-purple-500/20 mb-4">
            <Loader2 className="h-16 w-16 text-purple-400 animate-spin" />
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">Loading...</p>
    </div>
</div>
```

**Inline Loading:**
```tsx
<Button disabled className="btn-futuristic-primary">
    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
    Processing...
</Button>
```

---

## 🎨 Error States

**Error Messages:**
```tsx
<div className="card-futuristic border-red-500/20 bg-gradient-to-br from-red-950/50 to-red-900/30">
    <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-red-500/20 backdrop-blur-sm">
            <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <div className="flex-1">
            <h3 className="text-2xl font-bold text-red-100 mb-2">Error Title</h3>
            <p className="text-red-200/80 text-lg">Error description</p>
        </div>
    </div>
</div>
```

---

## 🔥 Mandatory Checklist for Every New Page/Form

- [ ] Animated gradient background (3 blobs)
- [ ] Page header with icon in gradient box
- [ ] Gradient text for main title (text-gradient-primary/secondary)
- [ ] Description text (slate-600 dark:slate-400)
- [ ] Stats cards (if applicable) with hover glow
- [ ] Main content in card-futuristic
- [ ] All buttons use .btn-futuristic-* classes
- [ ] Hover effects (-translate-y-1) on cards
- [ ] Border glow on hover (border-purple-500/30)
- [ ] Icons wrapped in gradient containers
- [ ] Glassmorphism (backdrop-blur-xl)
- [ ] Dual theme support (light/dark classes)
- [ ] Smooth transitions (duration-300)
- [ ] Premium empty states
- [ ] Responsive grid layouts

---

## 📱 Responsive Design

**Always include:**
```tsx
// Mobile-first grid
className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"

// Flexible header
className="flex items-center justify-between flex-wrap gap-4"

// Container
className="container mx-auto py-8 space-y-8"
```

---

## 🎯 Module-Specific Color Coding

### CRM
- Leads: Purple/Pink
- Deals: Emerald/Cyan
- Contacts: Blue/Purple
- Dashboard: Multi-color

### HMS
- Patients: Blue/Cyan
- Appointments: Purple/Indigo
- Billing: Emerald/Green
- Pharmacy: Orange/Amber

### Inventory
- Items: Orange/Amber
- Stock: Green/Emerald
- Transfers: Cyan/Blue

---

## ⚠️ NEVER DO THIS

❌ Plain white backgrounds
❌ Basic gray borders
❌ Flat buttons without gradients
❌ No hover effects
❌ Missing dark mode support
❌ No animations
❌ Plain icons without backgrounds
❌ Generic empty states
❌ Hard-coded colors instead of utility classes

---

## ✅ ALWAYS DO THIS

✅ Gradient backgrounds
✅ Glassmorphism effects
✅ Smooth hover animations
✅ Colored glow shadows
✅ Dual theme support
✅ Icon gradient containers
✅ Premium empty states
✅ Proper spacing (space-y-8, gap-6)
✅ Rounded corners (rounded-2xl, rounded-xl)
✅ Shadow effects (shadow-xl, hover:shadow-2xl)

---

## 🎨 Quick Reference: Utility Class Combos

**Card:**
`card-futuristic` or `glass rounded-2xl p-6 shadow-xl hover-glow-purple`

**Button:**
`btn-futuristic-primary` or `btn-futuristic-secondary`

**Header:**
`text-4xl font-bold text-gradient-primary`

**Section:**
`text-2xl font-bold text-slate-900 dark:text-white`

**Body:**
`text-slate-600 dark:text-slate-400`

**Icon Box:**
`p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30`

---

## 🚀 Remember

**This is the NEW STANDARD. Every page, form, and component must look PREMIUM.**

No more basic UIs. Everything should be WORLD-CLASS from now on! 🎨✨
