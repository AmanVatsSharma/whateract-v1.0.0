# Component Flow & Architecture

**Project:** WhatsApp Marketing Platform  
**Version:** 1.0.0  
**Last Updated:** 2025-10-12

---

## Application Structure Flowchart

```
┌─────────────────────────────────────────────────────────────────┐
│                         Application Root                         │
│                         (RootLayout)                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Providers                            │  │
│  │  - ThemeProvider (next-themes)                           │  │
│  │  - QueryClientProvider (TanStack Query)                  │  │
│  │  - ToastProvider (sonner)                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Header                               │  │
│  │  Fixed Top (z-50)                                        │  │
│  │  Height: 64px                                            │  │
│  │                                                           │  │
│  │  Components:                                              │  │
│  │  ├── Logo                                                │  │
│  │  ├── Search Bar (Desktop)                                │  │
│  │  ├── Search Button (Mobile)                              │  │
│  │  ├── Create New Button                                   │  │
│  │  ├── Notifications Popover                               │  │
│  │  └── User Profile Dropdown                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────┐  ┌────────────────────────────────────────┐  │
│  │   Sidebar    │  │        Main Content Area               │  │
│  │              │  │        (Children Pages)                │  │
│  │  Desktop:    │  │                                        │  │
│  │  Fixed Left  │  │  Responsive Padding:                   │  │
│  │  240px wide  │  │  - Mobile: px-4                        │  │
│  │              │  │  - Tablet: px-6                        │  │
│  │  Mobile:     │  │  - Desktop: px-8                       │  │
│  │  Sheet/      │  │                                        │  │
│  │  Drawer      │  │  Margin:                               │  │
│  │  (280px)     │  │  - Mobile: ml-0                        │  │
│  │              │  │  - Desktop: ml-[240px]                 │  │
│  │  Components: │  │                                        │  │
│  │  ├── Search  │  │  ┌──────────────────────────────────┐ │  │
│  │  ├── Nav     │  │  │         Page Content             │ │  │
│  │  │   Items   │  │  │  (Dashboard, Campaigns, etc.)    │ │  │
│  │  ├── User    │  │  │                                  │ │  │
│  │  │   Profile │  │  │  Max Width: 1600px               │ │  │
│  │  ├── Storage │  │  │  Centered: mx-auto               │ │  │
│  │  └── Upgrade │  │  └──────────────────────────────────┘ │  │
│  │      Button  │  │                                        │  │
│  └──────────────┘  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### 1. Root Layout (`src/app/layout.tsx`)

```
RootLayout
├── <html>
│   ├── <head> (Theme script)
│   └── <body>
│       └── Providers
│           ├── Header
│           ├── Sidebar
│           └── <main>
│               └── {children}
```

### 2. Header Component (`src/components/Header.tsx`)

```
Header
├── Container
│   ├── Logo Section
│   │   └── Link to Home
│   ├── Search Section
│   │   ├── Desktop Search Input
│   │   └── Mobile Search Button → CommandDialog
│   └── Actions Section
│       ├── Create New Button (Tooltip)
│       ├── Notifications Popover
│       │   ├── PopoverTrigger (Bell Icon + Badge)
│       │   └── PopoverContent
│       │       ├── Header (Title + Mark All Read)
│       │       ├── Notification List
│       │       └── Footer (View All Button)
│       └── User Dropdown
│           ├── DropdownMenuTrigger (Avatar)
│           └── DropdownMenuContent
│               ├── User Info
│               ├── Profile MenuItem
│               ├── Settings MenuItem
│               ├── Help & Feedback MenuItem
│               ├── Upgrade MenuItem
│               ├── Theme Toggle Switch
│               └── Logout MenuItem
└── Dialogs
    ├── CommandDialog (Mobile Search)
    └── FeedbackDialog
```

### 3. Sidebar Component (`src/components/Sidebar.tsx`)

```
Sidebar
├── Mobile Version (< md breakpoint)
│   └── Sheet
│       ├── SheetTrigger (Hamburger Menu Button)
│       └── SheetContent
│           ├── SheetHeader (Logo)
│           └── Sidebar Content
│               ├── Search Input
│               ├── Navigation Items List
│               │   └── [Item] → Link + Tooltip
│               └── Bottom Section
│                   ├── User Profile Popover
│                   ├── Storage Progress
│                   └── Upgrade Button
└── Desktop Version (≥ md breakpoint)
    └── Fixed Sidebar
        ├── Collapse Toggle Button
        └── Sidebar Content
            ├── Search Input
            ├── Navigation Items List
            │   └── [Item] → Link + Tooltip
            └── Bottom Section
                ├── User Profile Popover
                ├── Storage Progress
                └── Upgrade Button
```

### 4. Dashboard Page (`src/app/(main)/dashboard/page.tsx`)

```
Dashboard
├── Header Section
│   ├── Title + Description
│   └── Action Buttons
│       ├── Date Picker (Popover + Calendar)
│       ├── Filter Button
│       ├── Refresh Button
│       └── Customize Button
├── KPI Cards Grid (Responsive)
│   ├── Total Subscribers Card
│   ├── Messages Sent Card
│   ├── Response Rate Card
│   └── Active Campaigns Card
├── Charts Grid (Responsive)
│   ├── Campaign Performance (Bar Chart)
│   │   ├── Header (Title + Metric Selector)
│   │   └── ResponsiveContainer → BarChart
│   └── Audience Growth (Area Chart)
│       ├── Header (Title + Description)
│       └── ResponsiveContainer → AreaChart
├── Bottom Grid (Responsive)
│   ├── Message Types (Pie Chart)
│   │   └── ResponsiveContainer → PieChart
│   └── Recent Activity (Feed)
│       └── Activity List Items
└── Customize Dialog
    ├── DialogHeader
    ├── Widget Toggle Switches
    └── DialogFooter (Cancel + Save Buttons)
```

---

## Data Flow

### Theme Management

```
User Action (Toggle Theme)
    ↓
Header/Sidebar Theme Toggle
    ↓
useTheme hook (next-themes)
    ↓
Update localStorage
    ↓
Update document class (dark/light)
    ↓
CSS Variables Update
    ↓
Re-render with new theme
```

### Navigation Flow

```
User Clicks Nav Item
    ↓
Check if Mobile (useMediaQuery)
    ↓
If Mobile: Close Sidebar Drawer
    ↓
Next.js Router (useRouter)
    ↓
Navigate to Route
    ↓
Update pathname
    ↓
Update Active State (usePathname)
    ↓
Re-render Nav Items with active styles
```

### Responsive Layout Flow

```
Window Resize / Initial Load
    ↓
Check Breakpoint
    ↓
├── Mobile (< 768px)
│   ├── Hide Sidebar (fixed)
│   ├── Show Hamburger Menu
│   ├── Full Width Content (ml-0)
│   └── Compact Header
├── Tablet (768px - 1024px)
│   ├── Show Sidebar (240px)
│   ├── Content with left margin
│   └── Responsive Grids (2 columns)
└── Desktop (≥ 1024px)
    ├── Show Sidebar (240px)
    ├── Content with left margin
    └── Full Grid Layout (3-4 columns)
```

---

## State Management

### Component-Level State

```typescript
// Header Component
const [isSearchOpen, setIsSearchOpen] = useState(false)
const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
const [isScrolled, setIsScrolled] = useState(false)
const [mounted, setMounted] = useState(false)

// Sidebar Component
const [isCollapsed, setIsCollapsed] = useState(false)
const [searchTerm, setSearchTerm] = useState('')
const [isMobileOpen, setIsMobileOpen] = useState(false)
const [mounted, setMounted] = useState(false)

// Dashboard Component
const [date, setDate] = useState<Date | undefined>(new Date())
const [isCustomizing, setIsCustomizing] = useState(false)
const [selectedMetric, setSelectedMetric] = useState('sent')
const [mounted, setMounted] = useState(false)
```

### Global State (via Context/Providers)

```typescript
// Theme State (next-themes)
ThemeProvider
├── theme: 'light' | 'dark' | 'system'
└── setTheme: (theme: string) => void

// Query State (TanStack Query)
QueryClientProvider
├── Caching
├── Refetching
└── Background updates
```

---

## Event Flow

### User Interactions

```
1. Navigation Click
   User clicks sidebar item
   → onClick handler
   → Next.js navigation
   → URL update
   → Page render
   → Update active state

2. Theme Toggle
   User toggles theme switch
   → onChange handler
   → setTheme called
   → localStorage update
   → Document class update
   → CSS variables change
   → Component re-render

3. Search Action
   User types in search
   → onChange handler
   → Update searchTerm state
   → Filter sidebar items
   → Re-render filtered list

4. Notification Click
   User clicks notification
   → onClick handler
   → Console log (debug)
   → Mark as read (TODO)
   → Update UI state

5. Sidebar Toggle (Desktop)
   User clicks collapse button
   → onClick handler
   → Toggle isCollapsed state
   → Framer Motion animation
   → Width transition (240px ↔ 72px)
   → Re-render with new width

6. Mobile Menu Open
   User clicks hamburger menu
   → onClick handler
   → Set isMobileOpen to true
   → Sheet component opens
   → Drawer slides in from left
   → Overlay appears
```

---

## Render Flow

### Initial Page Load

```
1. Server-Side
   ├── Generate HTML
   ├── Include theme script
   ├── Load fonts
   └── Return to browser

2. Client-Side Hydration
   ├── React hydrates components
   ├── Initialize state
   ├── Attach event listeners
   ├── Check theme preference
   ├── Apply theme
   └── Render complete

3. Component Mount
   ├── useEffect runs
   ├── Console logs (debug)
   ├── Fetch initial data
   ├── Set mounted state
   └── Trigger re-render
```

### Navigation Between Pages

```
User clicks nav link
    ↓
Next.js Router intercepts
    ↓
Client-side navigation (SPA)
    ↓
Unmount current page
    ↓
Mount new page
    ↓
Run useEffect hooks
    ↓
Fetch page data
    ↓
Render new content
    ↓
Update browser URL
```

---

## Error Handling Flow

```
Component Error
    ↓
Caught by Error Boundary (if exists)
    ↓
Display Fallback UI
    ↓
Log to Console
    ↓
Optional: Send to Error Tracking Service

OR

Promise Rejection
    ↓
Caught by React Query (if API call)
    ↓
Update query state (error)
    ↓
Display error UI
    ↓
Retry logic (automatic or manual)
```

---

## Performance Optimization Flow

```
1. Code Splitting
   Dynamic imports
   → Lazy load components
   → Reduce initial bundle size

2. Image Optimization
   Next.js Image component
   → Automatic optimization
   → Lazy loading
   → Responsive images

3. Caching Strategy
   TanStack Query
   → Cache API responses
   → Stale-while-revalidate
   → Background refetch

4. Animation Performance
   Framer Motion
   → GPU-accelerated transforms
   → RAF-based animations
   → Optimized re-renders
```

---

## Debugging Flow

### Console Log Strategy

All components include strategic console logs:

```typescript
// Component mount
useEffect(() => {
    console.log('ComponentName: Component mounted', { prop1, prop2 })
}, [])

// User actions
const handleAction = () => {
    console.log('ComponentName: Action performed', { data })
    // ... action logic
}

// State changes
useEffect(() => {
    console.log('ComponentName: State changed', { state })
}, [state])
```

**Log Format:**
```
ComponentName: Action/Event, { contextData }
```

**Examples:**
```
Header: Theme toggled, { from: 'light', to: 'dark' }
Sidebar: Navigation clicked, { href: '/dashboard' }
Dashboard: Data refresh triggered
```

---

## Future Enhancements

### Planned Component Additions

1. **Error Boundary Component**
   - Catch and handle React errors
   - Display user-friendly error messages
   - Log errors to monitoring service

2. **Loading States**
   - Skeleton screens
   - Progress indicators
   - Suspense boundaries

3. **Advanced Animations**
   - Page transitions
   - Micro-interactions
   - Loading animations

4. **Accessibility Improvements**
   - Keyboard shortcuts
   - Screen reader announcements
   - Focus management

---

## References

- **Next.js Documentation:** https://nextjs.org/docs
- **React Documentation:** https://react.dev/
- **Framer Motion:** https://www.framer.com/motion/
- **TanStack Query:** https://tanstack.com/query/latest

---

**Note:** This flow documentation should be updated whenever significant architectural changes are made to the application.
