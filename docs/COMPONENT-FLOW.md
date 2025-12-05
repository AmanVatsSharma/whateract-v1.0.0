# 🔄 Component Flow Documentation
## WhatsApp Marketing Platform v2.0

---

## 📋 Table of Contents
1. [Application Architecture](#application-architecture)
2. [Component Hierarchy](#component-hierarchy)
3. [Data Flow](#data-flow)
4. [State Management](#state-management)
5. [Navigation Flow](#navigation-flow)
6. [Component Interactions](#component-interactions)
7. [API Integration](#api-integration)

---

## 🏗️ Application Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────┐
│           Root Layout (layout.tsx)          │
│  ┌───────────────────────────────────────┐  │
│  │     Providers (providers.tsx)         │  │
│  │  ┌──────────────────────────────────┐ │  │
│  │  │   ThemeProvider (next-themes)    │ │  │
│  │  │   QueryClient (React Query)      │ │  │
│  │  │   Toaster (sonner)               │ │  │
│  │  └──────────────────────────────────┘ │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │   Header     │  │   Sidebar    │        │
│  │ (Fixed Top)  │  │(Fixed Left)  │        │
│  └──────────────┘  └──────────────┘        │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │         Main Content Area            │  │
│  │   ┌──────────────────────────────┐   │  │
│  │   │      Page Component          │   │  │
│  │   │  (Dashboard/Campaigns/etc.)  │   │  │
│  │   └──────────────────────────────┘   │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 🎯 Component Hierarchy

### 1. Root Level

```
/workspace/src/app/
├── layout.tsx                 # Root layout wrapper
├── providers.tsx              # Context providers
├── globals.css                # Global styles & theme
└── (main)/                    # Main app routes
    ├── dashboard/
    ├── campaigns/
    ├── analytics/
    ├── inbox/
    └── ...
```

### 2. Shared Components

```
/workspace/src/components/
├── Header.tsx                 # App header (navigation, search, profile)
├── Sidebar.tsx                # Sidebar navigation
├── RichTextEditor.tsx         # Text editing component
└── ui/                        # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── dialog.tsx
    └── ... (40+ components)
```

---

## 🔄 Data Flow

### Component Communication Pattern

```
┌──────────────────────────────────────────────────────┐
│                   User Interaction                   │
└───────────────────┬──────────────────────────────────┘
                    │
                    v
┌──────────────────────────────────────────────────────┐
│            Component State Update                    │
│  (useState, useReducer, React Query)                 │
└───────────────────┬──────────────────────────────────┘
                    │
                    v
┌──────────────────────────────────────────────────────┐
│              API Call (if needed)                    │
│         /api/campaigns, /api/analytics               │
└───────────────────┬──────────────────────────────────┘
                    │
                    v
┌──────────────────────────────────────────────────────┐
│            Update UI / Show Toast                    │
│     (Re-render with new data)                        │
└──────────────────────────────────────────────────────┘
```

### Example: Creating a Campaign

```typescript
// 1. User clicks "New Campaign" button
<Button onClick={() => setIsCreating(true)}>
  New Campaign
</Button>

// 2. Dialog opens (state change)
<Dialog open={isCreating} onOpenChange={setIsCreating}>
  {/* Campaign creation form */}
</Dialog>

// 3. User fills form and submits
const handleSubmit = async (data) => {
  try {
    // 4. API call
    await apiClient.post('/campaigns', data)
    
    // 5. Show success toast
    toast.success('Campaign created!')
    
    // 6. Close dialog and refresh data
    setIsCreating(false)
    refetch()
  } catch (error) {
    // Error handling
    toast.error('Failed to create campaign')
  }
}
```

---

## 📊 State Management

### Local State (useState)

Used for: UI state, forms, local interactions

```typescript
// Example: Sidebar collapse state
const [isCollapsed, setIsCollapsed] = useState(false)

const toggleSidebar = () => {
  console.log('Sidebar: Toggling', { from: isCollapsed, to: !isCollapsed })
  setIsCollapsed(!isCollapsed)
}
```

### Server State (React Query)

Used for: API data, caching, synchronization

```typescript
// Example: Fetching campaigns
const { data, isLoading, refetch } = useQuery({
  queryKey: ['campaigns'],
  queryFn: () => apiClient.get('/campaigns')
})
```

### Global State (Context)

Used for: Theme, authentication (via providers)

```typescript
// Theme context
const { theme, setTheme } = useTheme()

// Toggle dark mode
setTheme(theme === 'dark' ? 'light' : 'dark')
```

---

## 🧭 Navigation Flow

### Route Structure

```
/ (root)
└── /dashboard              # Dashboard overview
└── /campaigns             # Campaign management
    ├── /campaigns/:id     # Campaign details (future)
    └── /campaigns/new     # Create campaign (future)
└── /analytics             # Analytics & reports
└── /inbox                 # Message inbox
└── /audience              # Subscriber management
└── /message-templates     # Template library
└── /scheduler             # Message scheduling
└── /automations           # Workflow automation
└── /notifications         # Notification center
└── /settings              # App settings
└── /support               # Help & support
```

### Navigation Methods

#### 1. **Sidebar Navigation**
```typescript
// Sidebar.tsx
<Link href="/dashboard" className="nav-item">
  <LayoutDashboard /> Dashboard
</Link>
```

#### 2. **Programmatic Navigation**
```typescript
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/campaigns')
```

#### 3. **Header Quick Actions**
```typescript
// Search command palette
<CommandDialog open={isSearchOpen}>
  <CommandItem onSelect={() => router.push('/campaigns')}>
    Search Campaigns
  </CommandItem>
</CommandDialog>
```

---

## 🔗 Component Interactions

### Header ↔ Sidebar

```
┌───────────────────┐      Theme Toggle      ┌────────────────┐
│      Header       │ ←───────────────────→ │    Sidebar     │
│                   │                        │                │
│ - Search          │      User Profile      │ - Navigation   │
│ - Notifications   │ ←───────────────────→ │ - Quick Access │
│ - Profile         │                        │ - Collapse     │
└───────────────────┘                        └────────────────┘
```

### Dashboard Components

```
┌─────────────────────────────────────────────────────┐
│                   Dashboard Page                    │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │         KPI Cards (4 metrics)               │   │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐       │   │
│  │  │ 📊  │  │ 📈  │  │ 💬  │  │ ⚡  │       │   │
│  │  └─────┘  └─────┘  └─────┘  └─────┘       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────┐  ┌──────────────────┐   │
│  │ Campaign Performance │  │ Audience Growth  │   │
│  │     (Bar Chart)      │  │   (Area Chart)   │   │
│  └──────────────────────┘  └──────────────────┘   │
│                                                     │
│  ┌────────────┐  ┌──────────────────────────────┐ │
│  │  Message   │  │    Recent Activity Feed      │ │
│  │   Types    │  │  (Live updates timeline)     │ │
│  │(Pie Chart) │  │                              │ │
│  └────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Campaign Creation Flow

```
1. User clicks "New Campaign" button
   ↓
2. Dialog opens with 3-step wizard
   ↓
3. Step 1: Campaign Details
   - Name, Type, Audience
   ↓
4. Step 2: Message Composition
   - Template selection
   - AI generation option
   - Custom message
   ↓
5. Step 3: Schedule & Settings
   - Send time
   - A/B testing toggle
   ↓
6. Submit → API Call → Success Toast
   ↓
7. Close dialog, refresh campaign list
```

---

## 🔌 API Integration

### API Client Structure

```typescript
// /lib/api-client.ts
const apiClient = {
  get: async (endpoint: string) => {
    console.log(`📡 API: GET ${endpoint}`)
    // Fetch implementation
  },
  post: async (endpoint: string, data: any) => {
    console.log(`📡 API: POST ${endpoint}`, data)
    // Post implementation
  },
  // ... other methods
}
```

### API Endpoints

```
GET    /api/campaigns          # List campaigns
POST   /api/campaigns          # Create campaign
GET    /api/campaigns/:id      # Get campaign details
PUT    /api/campaigns/:id      # Update campaign
DELETE /api/campaigns/:id      # Delete campaign

GET    /api/analytics          # Analytics data
GET    /api/analytics/export   # Export CSV

GET    /api/conversations      # Inbox conversations
POST   /api/ai/reply           # AI reply suggestion
POST   /api/ai/summarize       # AI conversation summary
POST   /api/ai/generate        # AI content generation

GET    /api/settings           # App settings
PUT    /api/settings           # Update settings
```

### React Query Integration

```typescript
// Query (GET)
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['campaigns'],
  queryFn: () => apiClient.get('/campaigns'),
  staleTime: 5 * 60 * 1000, // 5 minutes
})

// Mutation (POST/PUT/DELETE)
const mutation = useMutation({
  mutationFn: (newCampaign) => apiClient.post('/campaigns', newCampaign),
  onSuccess: () => {
    queryClient.invalidateQueries(['campaigns'])
    toast.success('Campaign created!')
  },
  onError: (error) => {
    toast.error('Failed to create campaign')
  },
})
```

---

## 🎨 UI Component Flow

### Button States

```
┌──────────────┐
│   Initial    │
│   (Idle)     │
└──────┬───────┘
       │
       ├─ Hover ──→ Scale(1.02), Color change
       │
       ├─ Focus ──→ Ring outline
       │
       ├─ Active ─→ Scale(0.98)
       │
       └─ Disabled─→ Opacity(0.5), No interaction
```

### Dialog Flow

```
Closed State
     │
     ├─ Trigger (onClick) ──→ open={true}
     │                            │
     │                            v
     │                     ┌──────────────┐
     │                     │   Dialog     │
     │                     │   Content    │
     │                     └──────┬───────┘
     │                            │
     │                            ├─ Submit ──→ API Call
     │                            │                │
     │                            │                v
     │                            │          ┌──────────┐
     │                            │          │ Success  │
     │                            │          │  Toast   │
     │                            │          └──────────┘
     │                            │
     ←──────── Close ─────────────┘
```

---

## 📝 Console Logging Strategy

Every major action logs to console for debugging:

```typescript
console.log('🎨 Component: Mounted')
console.log('📊 Dashboard: Loading data')
console.log('✅ Campaign: Created successfully')
console.log('❌ Error: API call failed', error)
console.log('🔄 State: Updated', { from, to })
```

### Log Prefixes

- `🎨` - Component lifecycle
- `📊` - Data operations
- `✅` - Success actions
- `❌` - Errors
- `🔄` - State changes
- `📡` - API calls
- `🔍` - Search/Filter
- `💬` - Messaging
- `🌓` - Theme changes

---

## 🚀 Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

### Memoization

```typescript
// Memoize expensive computations
const filteredItems = useMemo(() => {
  return items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
}, [items, searchTerm])

// Memoize callbacks
const handleClick = useCallback(() => {
  console.log('Button clicked')
}, [])
```

### React Query Caching

```typescript
// Automatic caching with stale time
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})
```

---

## 🔐 Error Handling

### Try-Catch Pattern

```typescript
const handleAction = async () => {
  try {
    console.log('🔄 Action: Starting')
    
    const result = await apiClient.post('/endpoint', data)
    
    console.log('✅ Action: Success', result)
    toast.success('Action completed!')
    
  } catch (error) {
    console.error('❌ Action: Failed', error)
    toast.error('Action failed. Please try again.')
    
    // Optional: Send to error tracking service
    // logError(error)
  }
}
```

### Form Validation

```typescript
// Using react-hook-form + zod
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
})
```

---

## 📚 Best Practices

### 1. **Component Structure**
```typescript
// Order:
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Component definition
// 5. Hooks
// 6. Event handlers
// 7. Render logic
```

### 2. **State Management**
- Local UI state → `useState`
- Server data → React Query
- Global state → Context/Providers

### 3. **Error Boundaries**
```typescript
// Wrap main content in error boundary
<ErrorBoundary fallback={<ErrorPage />}>
  <MainContent />
</ErrorBoundary>
```

### 4. **Loading States**
```typescript
if (isLoading) return <Skeleton />
if (error) return <ErrorMessage />
return <Content data={data} />
```

---

## ♻️ Automations DnD Flow (Updated)

The automations board now uses `@dnd-kit` to keep compatibility with React 18+ while providing deterministic ordering and verbose logging for each user gesture.

```mermaid
flowchart TD
    Grab[User grabs automation card] --> Drag[DndContext emits drag move]
    Drag --> Drop{Card dropped?}
    Drop -- No --> LogWarn[console.warn: missing drop target] --> Idle[State unchanged]
    Drop -- Yes --> Compare{Position changed?}
    Compare -- No --> LogInfo[console.log: no position change] --> Idle
    Compare -- Yes --> Reorder[arrayMove() creates new order]
    Reorder --> LogOrder[console.log: ordered IDs]
    LogOrder --> Persist[setRules() updates UI]
```

Implementation touch points:

- `src/app/(main)/automations/page.tsx` instantiates `const activeRules = rules.filter(...)` and wires `DndContext` + `SortableContext`.
- `SortableAutomationCard` wraps each card with `useSortable`, applies inline transform styling, and keeps controls (Edit, Analytics, Pause) intact.
- `onDragEnd` guards every edge case, logs successes/warnings, and reorders via `arrayMove` to keep UI + future persistence layers in sync.

Please keep this flow in mind when extending automations (e.g., persisting order, syncing with backend) so console diagnostics remain actionable.

---

**Last Updated:** December 2025  
**Maintainer:** WhatsApp Marketing Team
