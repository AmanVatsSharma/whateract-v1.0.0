# 🎨 Color Palette & Theme Guide
## WhatsApp Marketing Platform v2.0

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Light Theme Palette](#light-theme-palette)
3. [Dark Theme Palette](#dark-theme-palette)
4. [Color Usage Guidelines](#color-usage-guidelines)
5. [Accessibility](#accessibility)
6. [Implementation](#implementation)
7. [Examples](#examples)

---

## 🌟 Overview

The color system for WhatsApp Marketing Platform is built on **HSL (Hue, Saturation, Lightness)** values, providing flexibility for theme variations while maintaining consistent brand identity.

### Design Goals:
- ✨ **Professional & Modern** - Clean, contemporary aesthetic
- 🎯 **Purposeful** - Each color serves a specific function
- ♿ **Accessible** - WCAG 2.1 AA compliant contrast ratios
- 🌓 **Theme-Ready** - Seamless light/dark mode support
- 🎨 **Scalable** - Easy to extend and customize

---

## ☀️ Light Theme Palette

### Primary Brand Colors

#### **Purple/Blue Gradient** (Primary)

The main brand color - modern, professional, and energetic.

| Shade | HSL | HEX | RGB | Usage |
|-------|-----|-----|-----|-------|
| 50 | `270 100% 98%` | `#f5f3ff` | `245, 243, 255` | Background tints |
| 100 | `269 100% 95%` | `#ede9fe` | `237, 233, 254` | Subtle backgrounds |
| 200 | `268 100% 91%` | `#ddd6fe` | `221, 214, 254` | Light backgrounds |
| 300 | `270 95% 84%` | `#c4b5fd` | `196, 181, 253` | Disabled states |
| 400 | `270 91% 77%` | `#a78bfa` | `167, 139, 250` | Hover states |
| **500** | **270 78% 67%** | **`#8b5cf6`** | **`139, 92, 246`** | **Main brand** |
| 600 | `271 76% 57%` | `#7c3aed` | `124, 58, 237` | Active states |
| 700 | `271 70% 51%` | `#6d28d9` | `109, 40, 217` | Pressed states |
| 800 | `272 72% 42%` | `#5b21b6` | `91, 33, 182` | Dark variants |
| 900 | `274 74% 34%` | `#4c1d95` | `76, 29, 149` | Darkest variant |

**Color Preview:**
```
████████ #f5f3ff   50
████████ #ede9fe   100
████████ #ddd6fe   200
████████ #c4b5fd   300
████████ #a78bfa   400
████████ #8b5cf6   500 ⭐ MAIN
████████ #7c3aed   600
████████ #6d28d9   700
████████ #5b21b6   800
████████ #4c1d95   900
```

---

#### **Teal** (Accent)

Secondary brand color - fresh, balanced, and trustworthy.

| Shade | HSL | HEX | RGB | Usage |
|-------|-----|-----|-----|-------|
| 50 | `172 48% 96%` | `#f0fdfa` | `240, 253, 250` | Light backgrounds |
| 100 | `169 84% 89%` | `#ccfbf1` | `204, 251, 241` | Subtle highlights |
| 200 | `168 84% 81%` | `#99f6e4` | `153, 246, 228` | Light accents |
| 300 | `171 77% 73%` | `#5eead4` | `94, 234, 212` | Soft accents |
| 400 | `172 66% 63%` | `#2dd4bf` | `45, 212, 191` | Hover states |
| **500** | **173 80% 40%** | **`#14b8a6`** | **`20, 184, 166`** | **Main accent** |
| 600 | `175 84% 32%` | `#0d9488` | `13, 148, 136` | Active states |

**Color Preview:**
```
████████ #f0fdfa   50
████████ #ccfbf1   100
████████ #99f6e4   200
████████ #5eead4   300
████████ #2dd4bf   400
████████ #14b8a6   500 ⭐ MAIN
████████ #0d9488   600
```

---

### Semantic Colors

#### **Success** (Green)

Positive actions, confirmations, successful states.

| Name | HSL | HEX | RGB |
|------|-----|-----|-----|
| **Success** | `142 76% 36%` | `#10b981` | `16, 185, 129` |
| Success Light | `141 77% 52%` | `#34d399` | `52, 211, 153` |
| Success Dark | `151 89% 38%` | `#059669` | `5, 150, 105` |

**Usage:**
- ✅ Success messages
- ✓ Completed actions
- ↑ Positive trends
- ● Active status indicators

---

#### **Warning** (Orange)

Caution, important notices, pending states.

| Name | HSL | HEX | RGB |
|------|-----|-----|-----|
| **Warning** | `38 92% 50%` | `#f59e0b` | `245, 158, 11` |
| Warning Light | `43 96% 56%` | `#fbbf24` | `251, 191, 36` |
| Warning Dark | `32 95% 44%` | `#d97706` | `217, 119, 6` |

**Usage:**
- ⚠️ Warnings
- ⏸ Paused states
- ⏰ Pending actions
- 📊 Moderate metrics

---

#### **Error/Destructive** (Red)

Errors, destructive actions, critical alerts.

| Name | HSL | HEX | RGB |
|------|-----|-----|-----|
| **Destructive** | `0 84% 60%` | `#ef4444` | `239, 68, 68` |
| Destructive Light | `0 86% 67%` | `#f87171` | `248, 113, 113` |
| Destructive Dark | `0 71% 51%` | `#dc2626` | `220, 38, 38` |

**Usage:**
- ❌ Error messages
- 🗑️ Delete actions
- ⛔ Critical alerts
- ↓ Negative trends

---

#### **Info** (Blue)

Informational messages, neutral states.

| Name | HSL | HEX | RGB |
|------|-----|-----|-----|
| **Info** | `221 83% 60%` | `#3b82f6` | `59, 130, 246` |
| Info Light | `221 91% 69%` | `#60a5fa` | `96, 165, 250` |
| Info Dark | `221 89% 53%` | `#2563eb` | `37, 99, 235` |

---

### Neutral Colors

#### **Grays** (Slate)

Foundation for text, borders, and backgrounds.

| Name | HSL | HEX | RGB | Usage |
|------|-----|-----|-----|-------|
| **Foreground** | `222 47% 11%` | `#0f172a` | `15, 23, 42` | Primary text |
| Slate 600 | `215 19% 35%` | `#475569` | `71, 85, 105` | Secondary text |
| **Muted FG** | `215 16% 47%` | `#64748b` | `100, 116, 139` | Tertiary text |
| Slate 300 | `214 32% 77%` | `#cbd5e1` | `203, 213, 225` | Light borders |
| **Border** | `214 32% 91%` | `#e2e8f0` | `226, 232, 240` | Borders |
| **Muted BG** | `214 32% 95%` | `#f1f5f9` | `241, 245, 249` | Subtle backgrounds |
| **Background** | `0 0% 100%` | `#ffffff` | `255, 255, 255` | Page background |

---

### Chart Colors

Professional palette for data visualization.

| Name | HEX | RGB | Usage |
|------|-----|-----|-------|
| **Chart 1** (Purple) | `#8b5cf6` | `139, 92, 246` | Primary data series |
| **Chart 2** (Teal) | `#14b8a6` | `20, 184, 166` | Secondary data series |
| **Chart 3** (Orange) | `#f59e0b` | `245, 158, 11` | Tertiary data series |
| **Chart 4** (Red) | `#ef4444` | `239, 68, 68` | Warning/negative data |
| **Chart 5** (Blue) | `#3b82f6` | `59, 130, 246` | Info/neutral data |

**Chart Example:**
```
████ Purple (Primary metric)
████ Teal (Secondary metric)
████ Orange (Warning metric)
████ Red (Error metric)
████ Blue (Info metric)
```

---

## 🌙 Dark Theme Palette

### Background Colors

| Name | HSL | HEX | RGB |
|------|-----|-----|-----|
| **Background** | `222 47% 11%` | `#0f172a` | `15, 23, 42` |
| **Card** | `217 33% 17%` | `#1e293b` | `30, 41, 59` |
| **Muted** | `217 33% 17%` | `#1e293b` | `30, 41, 59` |
| **Border** | `217 33% 20%` | `#334155` | `51, 65, 85` |

### Text Colors

| Name | HSL | HEX | RGB |
|------|-----|-----|-----|
| **Foreground** | `210 40% 98%` | `#f8fafc` | `248, 250, 252` |
| **Muted FG** | `215 20% 65%` | `#94a3b8` | `148, 163, 184` |

### Brand Colors (Adjusted)

| Name | HSL | HEX | RGB | Notes |
|------|-----|-----|-----|-------|
| **Primary** | `270 91% 77%` | `#a78bfa` | `167, 139, 250` | Brighter for dark mode |
| **Accent** | `173 80% 40%` | `#14b8a6` | `20, 184, 166` | Same as light |

---

## 📐 Color Usage Guidelines

### 1. **Text on Backgrounds**

#### Light Theme
```
✅ GOOD - High Contrast
Primary text (#0f172a) on White (#ffffff)
Contrast Ratio: 16.2:1

✅ GOOD - Medium Contrast
Secondary text (#64748b) on White (#ffffff)
Contrast Ratio: 5.8:1

❌ BAD - Low Contrast
Light gray (#cbd5e1) on White (#ffffff)
Contrast Ratio: 1.8:1
```

#### Dark Theme
```
✅ GOOD - High Contrast
Primary text (#f8fafc) on Dark (#0f172a)
Contrast Ratio: 15.4:1

✅ GOOD - Medium Contrast
Secondary text (#94a3b8) on Dark (#0f172a)
Contrast Ratio: 6.2:1
```

---

### 2. **Button Colors**

#### Primary Button
```css
/* Light theme */
background: linear-gradient(to right, #8b5cf6, #7c3aed)
color: #ffffff
hover: darken 10%

/* Dark theme */
background: linear-gradient(to right, #a78bfa, #8b5cf6)
color: #0f172a
hover: darken 10%
```

#### Secondary/Outline Button
```css
/* Light theme */
background: transparent
border: 1px solid #e2e8f0
color: #0f172a
hover: background #f1f5f9

/* Dark theme */
background: transparent
border: 1px solid #334155
color: #f8fafc
hover: background #1e293b
```

#### Destructive Button
```css
background: #ef4444
color: #ffffff
hover: #dc2626
```

---

### 3. **Card Gradients**

Modern, subtle gradients for KPI cards:

```css
/* Blue Card */
background: linear-gradient(to bottom right, #eff6ff, #ffffff, #ffffff)

/* Purple Card */
background: linear-gradient(to bottom right, #faf5ff, #ffffff, #ffffff)

/* Green Card */
background: linear-gradient(to bottom right, #f0fdf4, #ffffff, #ffffff)

/* Orange Card */
background: linear-gradient(to bottom right, #fff7ed, #ffffff, #ffffff)
```

---

### 4. **Status Indicators**

| Status | Background | Text | Border | Badge Color |
|--------|------------|------|--------|-------------|
| **Active** | `#dcfce7` | `#15803d` | `#bbf7d0` | Green |
| **Scheduled** | `#dbeafe` | `#1e40af` | `#bfdbfe` | Blue |
| **Completed** | `#f3f4f6` | `#374151` | `#d1d5db` | Gray |
| **Draft** | `#fef3c7` | `#92400e` | `#fde68a` | Yellow |
| **Paused** | `#fed7aa` | `#c2410c` | `#fdba74` | Orange |
| **Failed** | `#fee2e2` | `#991b1b` | `#fecaca` | Red |

---

## ♿ Accessibility

### WCAG 2.1 Compliance

All color combinations meet **WCAG 2.1 Level AA** standards:

- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18pt+):** Minimum 3:1 contrast ratio
- **UI components:** Minimum 3:1 contrast ratio

### Contrast Ratios

| Combination | Ratio | WCAG Level | Pass |
|-------------|-------|------------|------|
| Primary text on white | 16.2:1 | AAA | ✅ |
| Secondary text on white | 5.8:1 | AA | ✅ |
| Primary button | 4.8:1 | AA | ✅ |
| Border on white | 2.8:1 | - | ⚠️ (UI only) |

### Color Blindness Considerations

The color palette is designed to be distinguishable for:
- ✅ **Deuteranopia** (red-green)
- ✅ **Protanopia** (red-green)
- ✅ **Tritanopia** (blue-yellow)

**Key strategies:**
- Don't rely solely on color
- Use icons and labels
- Provide text alternatives
- Ensure sufficient contrast

---

## 💻 Implementation

### CSS Variables (Tailwind v4)

```css
@theme {
  /* Primary */
  --color-primary: #8b5cf6;
  --color-primary-50: #f5f3ff;
  --color-primary-500: #8b5cf6;
  --color-primary-foreground: #ffffff;
  
  /* Accent */
  --color-accent: #14b8a6;
  --color-accent-foreground: #ffffff;
  
  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-destructive: #ef4444;
  
  /* Neutrals */
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-border: #e2e8f0;
  
  /* Chart */
  --color-chart-1: #8b5cf6;
  --color-chart-2: #14b8a6;
  --color-chart-3: #f59e0b;
  --color-chart-4: #ef4444;
  --color-chart-5: #3b82f6;
}
```

### Tailwind Classes

```tsx
// Background colors
bg-primary         // #8b5cf6
bg-accent          // #14b8a6
bg-success         // #10b981
bg-warning         // #f59e0b
bg-destructive     // #ef4444
bg-muted           // #f1f5f9

// Text colors
text-primary       // #8b5cf6
text-foreground    // #0f172a
text-muted-foreground  // #64748b

// Border colors
border-primary     // #8b5cf6
border-border      // #e2e8f0

// Gradient backgrounds
bg-gradient-to-r from-primary to-primary/80
```

### React/TypeScript

```typescript
// Using theme colors
import { cn } from '@/lib/utils'

<Button className={cn(
  "bg-primary text-primary-foreground",
  "hover:bg-primary/90",
  "focus:ring-2 focus:ring-primary"
)}>
  Primary Action
</Button>

// Dynamic status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700 border-green-200'
    case 'paused': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'failed': return 'bg-red-100 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}
```

---

## 🎨 Examples

### KPI Card
```tsx
<Card className="hover:shadow-xl transition-all rounded-2xl border-primary/10 bg-gradient-to-br from-purple-50 via-white to-white">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-semibold text-muted-foreground">
      Total Users
    </CardTitle>
    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center">
      <Users className="h-6 w-6 text-purple-600" />
    </div>
  </CardHeader>
  <CardContent className="space-y-2">
    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
      2,265
    </div>
    <Badge className="bg-green-100 text-green-700 border-green-200">
      +15%
    </Badge>
  </CardContent>
</Card>
```

### Status Badge
```tsx
<Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
  Active
</Badge>
```

### Gradient Button
```tsx
<Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg shadow-primary/25 rounded-xl">
  Create Campaign
</Button>
```

---

## 🎓 Quick Reference

### Color Selection Flowchart

```
Need a color?
│
├─ Is it a brand element?
│  └─ Use PRIMARY (#8b5cf6)
│
├─ Is it a secondary action?
│  └─ Use ACCENT (#14b8a6)
│
├─ Is it a status indicator?
│  ├─ Success → GREEN (#10b981)
│  ├─ Warning → ORANGE (#f59e0b)
│  └─ Error → RED (#ef4444)
│
├─ Is it informational?
│  └─ Use INFO BLUE (#3b82f6)
│
└─ Is it neutral/structural?
   ├─ Text → FOREGROUND (#0f172a)
   ├─ Border → BORDER (#e2e8f0)
   └─ Background → MUTED (#f1f5f9)
```

---

## 📚 Resources

- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Color Blindness Simulator:** https://www.color-blindness.com/coblis-color-blindness-simulator/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Tailwind Color Palette:** https://tailwindcss.com/docs/customizing-colors

---

**Last Updated:** December 2024  
**Maintainer:** WhatsApp Marketing Team
