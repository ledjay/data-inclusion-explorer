# Research: Side Panel Navigation

**Feature**: Side Panel Navigation  
**Date**: 2025-10-23  
**Status**: Complete

## Overview

This document consolidates research findings for implementing a side panel that slides in from the right, taking 50% of screen width, while keeping the filter bar fixed and the card list responsive.

---

## 1. Panel Animation Patterns in Next.js/React

### Decision: CSS Transitions with Tailwind

**Rationale**:
- Project already uses Tailwind CSS 4 extensively
- CSS transitions are performant (GPU-accelerated)
- No additional dependencies needed (aligns with Minimalism principle)
- Tailwind provides `transition-transform` and `duration-300` utilities
- Simpler than Framer Motion for this use case

**Implementation Approach**:
```tsx
// Panel slides in from right
className={`
  fixed right-0 top-0 h-full w-1/2
  transform transition-transform duration-300 ease-in-out
  ${isOpen ? 'translate-x-0' : 'translate-x-full'}
`}
```

**Alternatives Considered**:
- **Framer Motion**: More powerful but adds 50KB+ dependency, overkill for simple slide animation
- **React Spring**: Similar to Framer Motion, unnecessary complexity
- **CSS Animations (@keyframes)**: Less flexible than transitions, harder to control programmatically

**Performance**: CSS transitions complete in < 300ms (meets requirement)

---

## 2. Responsive Layout with Fixed Sidebar

### Decision: CSS Grid with Fixed Columns

**Rationale**:
- CSS Grid provides precise control over column widths
- Can define fixed width for filter bar, flexible width for cards, conditional width for panel
- Tailwind's `grid` utilities make implementation straightforward
- Maintains filter bar position without JavaScript

**Implementation Approach**:
```tsx
// Main container
<div className={`grid ${isOpen ? 'grid-cols-[auto_1fr_50%]' : 'grid-cols-[auto_1fr]'} gap-10`}>
  {/* Filter bar - auto width (fixed) */}
  <ServiceFilters />
  
  {/* Card list - 1fr (flexible) */}
  <div className="col-span-1">
    {/* cards */}
  </div>
  
  {/* Panel - 50% width (conditional) */}
  {isOpen && <ServiceDetailPanel />}
</div>
```

**Key Points**:
- Filter bar uses `auto` width (sized by content, doesn't change)
- Card list uses `1fr` (takes remaining space after filter and panel)
- Panel uses `50%` when open
- Grid automatically handles layout recalculation

**Alternatives Considered**:
- **Flexbox**: Harder to maintain exact 50% panel width while keeping filter fixed
- **Absolute Positioning**: Would require manual width calculations, more complex
- **CSS calc()**: Possible but less elegant than Grid's fractional units

**Responsive Strategy**:
- Desktop (> 768px): 3-column grid as described
- Mobile (< 768px): Panel becomes full-screen overlay (100% width, fixed position)

---

## 3. Client-Side State Management

### Decision: React State + Optional URL Parameter

**Rationale**:
- React `useState` for panel open/close and selected service ID
- Optional URL parameter for deep linking (e.g., `?service=abc123`)
- Supports browser back button if URL parameter used
- Simple implementation, no external state library needed

**Implementation Approach**:
```tsx
// In page.tsx
const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
const isOpen = selectedServiceId !== null;

// Optional: Sync with URL
const searchParams = useSearchParams();
const router = useRouter();

useEffect(() => {
  const serviceId = searchParams.get('service');
  if (serviceId) {
    setSelectedServiceId(serviceId);
  }
}, [searchParams]);

const handleCardClick = (serviceId: string) => {
  setSelectedServiceId(serviceId);
  // Optional: Update URL
  const params = new URLSearchParams(searchParams);
  params.set('service', serviceId);
  router.push(`/?${params.toString()}`, { scroll: false });
};
```

**URL Parameter Benefits**:
- Back button closes panel (browser history)
- Shareable links to specific service in panel
- Preserves filter state + panel state in URL

**Alternatives Considered**:
- **Context API**: Overkill for single-page state
- **Zustand/Redux**: Unnecessary dependency for simple state
- **Local Storage**: Not needed, state can be ephemeral

**Decision**: Implement URL parameter support for better UX (back button, sharing)

---

## 4. Component Reusability

### Decision: Extract Shared `ServiceDetail` Component

**Rationale**:
- Current `/services/[id]/page.tsx` is a client component with fetch logic
- Panel needs the same display logic but different data source
- Extract display logic into reusable `ServiceDetail` component
- Both page and panel can use the same component

**Implementation Approach**:

**Step 1**: Create `src/components/ServiceDetail.tsx`
```tsx
interface ServiceDetailProps {
  service: Service;
  showRawData: boolean;
  onToggleRawData: () => void;
}

export function ServiceDetail({ service, showRawData, onToggleRawData }: ServiceDetailProps) {
  // All the display logic from page.tsx (lines 94-256)
  // No fetch logic, just presentation
}
```

**Step 2**: Update `/services/[id]/page.tsx` to use `ServiceDetail`
```tsx
export default function ServicePage() {
  const [service, setService] = useState<Service | null>(null);
  const [showRawData, setShowRawData] = useState(false);
  // ... fetch logic ...
  
  return (
    <div className="min-h-screen p-8">
      <ServiceDetail 
        service={service} 
        showRawData={showRawData}
        onToggleRawData={() => setShowRawData(!showRawData)}
      />
    </div>
  );
}
```

**Step 3**: Use `ServiceDetail` in panel
```tsx
export function ServiceDetailPanel({ serviceId, onClose }: Props) {
  const [service, setService] = useState<Service | null>(null);
  const [showRawData, setShowRawData] = useState(false);
  // ... fetch logic ...
  
  return (
    <div className="fixed right-0 top-0 h-full w-1/2 bg-white overflow-y-auto">
      <ServiceDetail 
        service={service} 
        showRawData={showRawData}
        onToggleRawData={() => setShowRawData(!showRawData)}
      />
    </div>
  );
}
```

**Benefits**:
- DRY principle: display logic in one place
- Maintains existing "Show Raw Data" functionality
- Easy to test and maintain
- Consistent UI between page and panel

**Alternatives Considered**:
- **Duplicate Code**: Violates DRY, harder to maintain
- **Render Page Component**: Complex, page component has routing logic
- **Higher-Order Component**: Unnecessary abstraction

---

## 5. Mobile Responsiveness Strategy

### Decision: Full-Screen Overlay on Mobile

**Rationale**:
- 50/50 split impractical on narrow screens (< 768px)
- Full-screen panel provides better UX on mobile
- Uses `fixed` positioning instead of grid column
- Maintains same component, just different styling

**Implementation Approach**:
```tsx
<div className={`
  fixed inset-0 z-50
  md:relative md:z-auto
  md:w-1/2
  bg-white dark:bg-gray-950
  transform transition-transform duration-300
  ${isOpen ? 'translate-x-0' : 'translate-x-full'}
`}>
  {/* Panel content */}
</div>
```

**Breakpoint**: `md:` (768px) - Tailwind's medium breakpoint
- Mobile (< 768px): `fixed inset-0` (full screen)
- Desktop (≥ 768px): `relative w-1/2` (50% grid column)

---

## 6. Accessibility Considerations

### Decision: Keyboard Navigation + Focus Management

**Implementation Requirements**:
1. **Escape Key**: Close panel
2. **Tab Key**: Navigate within panel, trap focus when open
3. **Focus Management**: Move focus to panel when opened, restore when closed
4. **ARIA Attributes**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

**Implementation Approach**:
```tsx
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [isOpen, onClose]);

// Focus trap using shadcn/ui Dialog primitive (optional)
// Or manual implementation with focus-trap-react
```

---

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Animations** | CSS Transitions with Tailwind | Simple, performant, no dependencies |
| **Layout** | CSS Grid (3-column) | Precise control, fixed filter bar |
| **State** | React State + URL params | Simple, supports back button |
| **Component** | Extract `ServiceDetail` | DRY, reusable, maintainable |
| **Mobile** | Full-screen overlay | Better UX on narrow screens |
| **Accessibility** | Keyboard nav + focus trap | WCAG compliance, better UX |

---

## Implementation Checklist

- [ ] Create `ServiceDetail.tsx` component (extracted from page)
- [ ] Create `ServiceDetailPanel.tsx` with slide animation
- [ ] Update `page.tsx` with CSS Grid layout
- [ ] Add panel state management (React + URL)
- [ ] Modify `ServiceCard.tsx` to accept onClick prop
- [ ] Implement keyboard navigation (Escape, Tab)
- [ ] Add mobile responsive styles (full-screen overlay)
- [ ] Test filter bar remains fixed during all animations
- [ ] Test with various service data (edge cases)
- [ ] Verify performance (< 300ms animations, < 2s load)

---

## Technical Stack Confirmation

✅ **Next.js 15.5.5** - App Router, Server Components  
✅ **React 19.1.0** - Client components for interactivity  
✅ **TypeScript 5** - Type safety  
✅ **Tailwind CSS 4** - Styling and animations  
✅ **shadcn/ui (Radix UI)** - UI components (Button, etc.)  
✅ **Lucide React** - Icons  

**No new dependencies required** - All decisions use existing stack.

