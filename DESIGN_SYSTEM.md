# Vendty POS Design System

## Context & Goals

**Purpose**: Create implementation-ready, token-driven UI guidance for Vendty POS optimized for consistency, accessibility, and fast delivery across the dashboard web app.

**Product**: Vendty POS - Point of Sale system for Colombian market
**URL**: https://pos.vendty.com/index.php/frontend/index
**Audience**: Authenticated users and operators (POS operators, administrators, managers)
**Surface**: Dashboard web application with dark sidebar navigation, light content area

**Intent**: Establish a structured, tokenized, content-first visual language that ensures WCAG 2.2 AA compliance across all interactive elements.

---

## Design Tokens & Foundations

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `font.family.primary` | Montserrat | Primary font stack |
| `font.family.stack` | Montserrat, sans-serif | Font-family declaration |
| `font.size.base` | 14px | Base body text |
| `font.weight.base` | 300 | Light weight - body text |
| `font.lineHeight.base` | 28px | Default line height |
| `font.size.xs` | 13px | Small labels, captions |
| `font.size.sm` | 14px | Standard body text |

**Implementation Requirement**:
```css
/* All body text must use these tokens */
font-family: var(--font-family-stack); /* Montserrat, sans-serif */
font-size: var(--font-size-base); /* 14px */
font-weight: var(--font-weight-base); /* 300 */
line-height: var(--font-lineHeight-base); /* 28px */
```

**Tailwind Extension**:
```ts
// tailwind.config.ts - extend theme
fontFamily: {
  sans: ['Montserrat', 'sans-serif'],
},
fontSize: {
  xs: ['13px', { lineHeight: '28px' }],
  sm: ['14px', { lineHeight: '28px' }],
  base: ['14px', { lineHeight: '28px' }],
  lg: ['16px', { lineHeight: '28px' }],
},
fontWeight: {
  light: '300',
  normal: '400',
  medium: '500',
  bold: '700',
  black: '900',
},
```

### Color Palette

#### Semantic Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `color.text.primary` | #f3f7f9 | Primary text on dark surfaces |
| `color.text.secondary` | #a3afb7 | Secondary/muted text |
| `color.text.tertiary` | #6a6c6f | Tertiary/placeholder text |
| `color.text.inverse` | #34495e | Text on light surfaces |
| `color.surface.base` | #000000 | Base dark surface (sidebar) |
| `color.surface.muted` | #333333 | Muted dark (sidebar submenus) |
| `color.surface.raised` | #ffffff | Raised/light surface |
| `color.surface.strong` | #25d366 | Brand green (WhatsApp, success) |
| `color.brand.primary` | #62cb31 | Primary brand green |
| `color.brand.dark` | #333333 | Brand dark color |
| `color.brand.darker` | #2d2d2d | Darker variant |
| `color.border.default` | rgba(0,0,0,0) rgb(243, 247, 249) | Light border on light surface |
| `color.border.muted` | rgb(64, 63, 63) rgba(163, 175, 183, 0.9) rgba(163, 175, 183, 0.9) | Muted borders |
| `color.status.error` | #e74c3c | Error states |
| `color.status.warning` | #f1c40f | Warning states |
| `color.status.info` | #5dade2 | Info states |

**CSS Variables Structure**:
```css
:root {
  /* Text Colors */
  --color-text-primary: #f3f7f9;
  --color-text-secondary: #a3afb7;
  --color-text-tertiary: #6a6c6f;
  --color-text-inverse: #34495e;
  
  /* Surface Colors */
  --color-surface-base: #000000;
  --color-surface-muted: #333333;
  --color-surface-raised: #ffffff;
  --color-surface-strong: #25d366;
  
  /* Brand Colors */
  --color-brand-primary: #62cb31;
  --color-brand-dark: #333333;
  --color-brand-darker: #2d2d2d;
  --color-brand-sidebar: #505050;
  
  /* Borders */
  --color-border-default: #f3f7f9;
  --color-border-muted: rgba(163, 175, 183, 0.9);
  
  /* Status */
  --color-status-error: #e74c3c;
  --color-status-warning: #f1c40f;
  --color-status-info: #5dade2;
  --color-status-success: #62cb31;
}
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space.1` | 10px | Compact spacing |
| `space.2` | 15px | Default gap |
| `space.3` | 20px | Section spacing |
| `space.4` | 22px | Component padding |
| `space.5` | 30px | Section gaps |
| `space.6` | 40px | Large section spacing |
| `space.7` | 100px | Page-level spacing |

**Tailwind Extension**:
```ts
spacing: {
  1: '10px',
  2: '15px',
  3: '20px',
  4: '22px',
  5: '30px',
  6: '40px',
  7: '100px',
},
```

### Radius & Shadow & Motion

| Token | Value | Usage |
|-------|-------|-------|
| `radius.xs` | 25px | Pills, avatars |
| `radius.sm` | 4px | Buttons, inputs |
| `radius.md` | 8px | Cards, dropdowns |
| `radius.lg` | 12px | Modals |
| `shadow.1` | rgb(153, 153, 153) 2px 2px 3px 0px | Subtle elevation |
| `shadow.2` | rgba(0, 0, 0, 0.08) 0px 2px 4px 0px | Card shadow |
| `shadow.3` | rgba(0, 0, 0, 0.15) 0px 4px 12px 0px | Dropdown shadow |
| `motion.duration.instant` | 200ms | Transitions |
| `motion.duration.fast` | 300ms | Animations |
| `motion.easing.default` | ease-in-out | Standard easing |

**Tailwind Extension**:
```ts
borderRadius: {
  xs: '25px',
  sm: '4px',
  md: '8px',
  lg: '12px',
},
boxShadow: {
  1: '2px 2px 3px 0px rgb(153, 153, 153)',
  2: '0px 2px 4px 0px rgba(0, 0, 0, 0.08)',
  3: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
  4: '0 6px 12px rgba(0,0,0,.175)',
},
transitionDuration: {
  instant: '200ms',
  fast: '300ms',
},
```

---

## Component Standards

### Button Component

**Anatomy**: Container + Label + Optional Icon + Loading Indicator

**Variants**:

| Variant | Background | Text Color | Border | Usage |
|---------|------------|------------|--------|-------|
| `primary` | `color.brand.primary` (#62cb31) | white | none | Main actions |
| `secondary` | transparent | `color.text.inverse` | `color.border.muted` | Secondary actions |
| `ghost` | transparent | `color.text.tertiary` | none | Tertiary actions |
| `danger` | `color.status.error` | white | none | Destructive actions |
| `demo` | `color.surface.muted` (#333) | white | none | Demo mode |

**States**:

| State | Visual Change | Implementation |
|-------|---------------|----------------|
| Default | Base variant styles | Background, text, border as defined |
| Hover | `opacity-90` or darker shade | `background-color: darken(10%)` |
| Active/Pressed | `scale-95` + darker shade | `transform: scale(0.95)` |
| Focus-visible | 2px outline, 2px offset, `color.brand.primary` | Must have visible focus ring |
| Disabled | `opacity-50`, `cursor-not-allowed` | `pointer-events: none` |
| Loading | Spinner visible, text shows loading state | Show Loader2 icon |

**Keyboard Behavior**:
- `Enter` / `Space`: Activate button
- `Tab`: Move focus to next focusable element
- `Shift+Tab`: Move focus to previous

**Pointer/Touch Behavior**:
- Minimum touch target: 44x44px
- Hover effects only on devices that support hover

**Tailwind Class Pattern**:
```tsx
// Primary Button
className={`
  inline-flex items-center justify-center gap-2
  bg-[#62cb31] text-white
  px-4 py-2 rounded
  font-medium text-[14px]
  transition-all duration-200
  hover:bg-[#56b62c] active:scale-95
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62cb31] focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
`}
```

**Anti-pattern**: Never use `<div>` or `<span>` as button substitute. Must use `<button>` or `<a>` with proper roles.

### MetricCard Component

**Anatomy**: Icon Container + Content (Title + Value) + Optional Badge

**Props Interface**:
```tsx
interface MetricCardProps {
  icon: LucideIcon;
  title: string;          // e.g., "Ventas de hoy"
  value: number | string; // Formatted or raw
  type: 'currency' | 'count' | 'percentage';
  color?: string;         // Icon color token
  loading?: boolean;
  error?: boolean;
}
```

**States**:

| State | Visual |
|-------|--------|
| Default | White bg, subtle border, shadow-sm |
| Loading | Skeleton pulse animation, value shows "..." |
| Error | Red border accent, error icon |
| Empty | 0 or null value displayed as "$ 0" or "# 0" |

**Implementation**:
```tsx
<div className={`
  bg-white rounded border border-gray-100 shadow-sm 
  flex items-center p-6 flex-1 min-w-[220px]
  ${loading ? 'animate-pulse' : ''}
`}>
  <div className="mr-6">
    <Icon className={color} size={48} strokeWidth={1} />
  </div>
  <div>
    <p className="text-[14px] text-gray-400 font-medium mb-1">{title}</p>
    <p className="text-2xl font-medium text-gray-700 tracking-tight">
      {loading ? '...' : (type === "count" ? `# ${value}` : formatCOP(value))}
    </p>
  </div>
</div>
```

### Input Component

**Anatomy**: Label + Input Field + Helper/Error Text + Optional Icon

**States**:

| State | Visual Change |
|-------|---------------|
| Default | Border `color.border.muted`, bg white |
| Hover | Border slightly darker |
| Focus | Border `color.brand.primary`, subtle glow |
| Focus-visible | Ring outline (same as button) |
| Disabled | `opacity-50`, bg gray-50, `cursor-not-allowed` |
| Error | Border `color.status.error`, error message shown |
| Loading | Loading spinner inside input (right side) |

**Keyboard Behavior**:
- `Tab`: Focus input
- `Escape`: Blur and reset to original value
- Standard text input keyboard navigation

**Tailwind Pattern**:
```tsx
<input
  className={`
    w-full px-3 py-2
    border rounded
    text-[14px] text-gray-700
    placeholder:text-gray-400
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-[#62cb31] focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}
  `}
  placeholder="Placeholder text"
/>
```

**Accessibility**:
- Must have associated `<label>` with `htmlFor` matching input `id`
- `aria-describedby` for error messages
- `aria-invalid="true"` when in error state

### Sidebar Navigation Item

**Anatomy**: Icon + Label + Active Indicator + Submenu Trigger

**States**:

| State | Visual Change |
|-------|---------------|
| Default | `color.text.secondary` (#a3afb7), transparent bg |
| Hover | `color.text.primary` (#f3f7f9), bg `rgba(0,0,0,0.1)` |
| Active | `color.text.primary`, bg `#1a1a1a` |
| Focus-visible | 2px left outline in `color.brand.primary` |
| Has-submenu | Chevron icon visible |

**Implementation**:
```tsx
<button
  className={`
    w-full py-4 flex flex-col items-center justify-center
    border-b border-white/5 transition-colors relative min-h-[90px]
    ${active 
      ? "bg-[#1a1a1a] text-white" 
      : "text-gray-400 hover:bg-black/10 hover:text-white"
    }
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62cb31] focus-visible:ring-inset
  `}
>
  <Icon size={26} strokeWidth={1.5} />
  <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
  {active && <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#62cb31]" />}
</button>
```

### Topbar Action Button

**Anatomy**: Icon Button + Optional Badge + Dropdown Panel

**States**:

| State | Visual |
|-------|--------|
| Default | `text-gray-400`, transparent bg |
| Hover | `text-green-500`, bg `green-50` |
| Active/Open | Dropdown panel visible with shadow |
| Focus-visible | Ring outline |
| Has-notification | Red badge with count |

**Dropdown Panel States**:

| State | Visual |
|-------|--------|
| Closed | `display: none`, animate out |
| Open | `display: block`, animate in from top |
| Loading | Content skeleton |

### Card Component

**Anatomy**: Header (Title + Actions) + Content + Optional Footer

**States**:

| State | Visual |
|-------|--------|
| Default | White bg, border-gray-100, shadow-sm |
| Hover | Slight shadow increase (if interactive) |
| Focus | Ring outline (if interactive/clickable) |
| Loading | Skeleton overlay |

**Responsive Behavior**:
- Grid cards: `grid-cols-1` mobile, `grid-cols-2` tablet, `grid-cols-3` desktop
- Minimum card width: 220px (used in MetricCard)

### Empty State Component

**Anatomy**: Icon Container + Message + Optional Action Button

**Required Props**:
```tsx
interface EmptyStateProps {
  label: string;      // e.g., "Sin ventas registradas hoy"
  action?: string;    // Optional CTA text
  onAction?: () => void;
}
```

**Visual**: Centered layout, muted icon (48px), text-14, text-gray-400

---

## Accessibility Requirements

### WCAG 2.2 AA Compliance

**Target**: All interactive elements must meet WCAG 2.2 Level AA

**Contrast Requirements**:

| Element | Minimum Ratio | Target |
|---------|--------------|--------|
| Body text on white | 4.5:1 | 7:1 |
| Large text (18px+) on white | 3:1 | 4.5:1 |
| Text on dark backgrounds | 4.5:1 | 7:1 |
| UI components and graphics | 3:1 | 4.5:1 |

**Implementation**: Use semantic color tokens - never raw hex values that don't meet contrast.

### Focus Management

**Rule**: Every interactive element must have a visible focus indicator.

**Implementation**:
```tsx
/* CSS for focus-visible */
.focus-visible:outline-none.focus-visible\:ring-2 {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
}
```

**Keyboard Navigation**:
- All functionality available via keyboard
- Logical tab order following visual layout
- Skip links for main content areas
- Focus trap in modals

### Screen Reader Support

| Component | ARIA Pattern |
|-----------|--------------|
| Buttons | `role="button"`, `aria-pressed` for toggles |
| Dropdowns | `aria-expanded`, `aria-haspopup` |
| Navigation | `role="navigation"`, `aria-label` |
| Charts | `aria-label` with data summary |
| Loading | `aria-busy="true"`, `aria-live="polite"` |
| Errors | `aria-invalid`, `aria-describedby` |

### Touch & Pointer Handling

| Input Type | Pointer Events | Touch Events |
|------------|----------------|--------------|
| Buttons | Hover + Active | Active only |
| Dropdowns | Hover open | Tap toggle |
| Tooltips | Hover show | Long-press show |
| Context menus | Right-click | Long-press |

**Minimum Touch Target**: 44x44px for all interactive elements

---

## Content & Tone Standards

### Writing Tone

- **Concise**: Get to the point quickly
- **Confident**: Clear, direct statements
- **Implementation-focused**: Use actionable language

### Label Conventions

| Pattern | Example | Usage |
|---------|---------|-------|
| Action verbs | "Guardar", "Cancelar", "Eliminar" | Buttons, links |
| Noun phrases | "Ventas de hoy", "Histórico de Ventas" | Navigation, section headers |
| Sentence case | "Configurar medio de pago" | Descriptions, help text |
| ALL CAPS | "MODO DEMO", "MODO PRUEBA" | System status indicators |

### Error Messages

| Context | Format | Example |
|---------|--------|---------|
| Validation | "[Field] es requerido" | "Email es requerido" |
| Network | "Error de conexión. Verifica tu internet." | - |
| Auth | "Credenciales inválidas" | - |
| Generic | "Algo salió mal. Intenta de nuevo." | - |

### Empty States

| Context | Message Pattern | Example |
|---------|-----------------|---------|
| No data | "No hay [data type] para mostrar" | "No hay ventas registradas hoy" |
| No results | "Sin resultados para '[query]'" | - |
| New user | "Comienza creando tu primer [item]" | "Comienza creando tu primer producto" |

---

## Anti-Patterns & Prohibited Implementations

### Color Usage

**PROHIBITED**:
- Raw hex values for brand colors (must use CSS variables)
- Inline styles for colors
- One-off color exceptions without design approval
- Low-contrast text combinations

**CORRECT**:
```tsx
// Wrong
<div className="text-[#6a6c6f]">Text</div>

// Correct
<div className="text-[var(--color-text-tertiary)]">Text</div>
// Or with Tailwind
<div className="text-gray-500">Text</div> // Only if mapped to semantic token
```

### Spacing

**PROHIBITED**:
- `margin: 0` without purpose
- Arbitrary spacing values (7px, 13px, 17px)
- Padding exceptions without design approval

**CORRECT**:
Use only the defined spacing scale: 10px, 15px, 20px, 22px, 30px, 40px, 100px

### Typography

**PROHIBITED**:
- Font sizes not in the defined scale (13px, 14px)
- Font weights other than 300, 400, 500, 700, 900
- Line heights other than 28px
- Google Fonts loaded via `<link>` tags (use next/font)

### Components

**PROHIBITED**:
- `<div onClick>` as button substitute
- Missing focus-visible states on interactive elements
- Non-descriptive labels ("Click here", "More")
- Disabled buttons without clear next action
- Loading states without feedback

### Accessibility

**PROHIBITED**:
- Hidden focus indicators
- Missing alt text on meaningful images
- Non-unique IDs
- Missing form labels
- Modal without focus trap

---

## QA Checklist

### Pre-Implementation Verification

- [ ] Design tokens defined for all colors, typography, spacing
- [ ] Tailwind config extended with semantic tokens
- [ ] Component anatomy documented
- [ ] All states defined (default, hover, focus, active, disabled, loading, error)
- [ ] Accessibility requirements documented

### Component Testing

- [ ] All buttons have working click handlers
- [ ] All buttons respond to Enter/Space keyboard activation
- [ ] All buttons have visible focus-visible states
- [ ] Disabled states prevent interaction
- [ ] Loading states show spinner/indicator
- [ ] Error states display error messages
- [ ] Touch targets are minimum 44x44px

### Accessibility Testing

- [ ] All images have alt text
- [ ] All forms have associated labels
- [ ] Color contrast meets WCAG 2.2 AA (4.5:1 minimum)
- [ ] Focus order is logical
- [ ] Modals trap focus
- [ ] Screen reader announces state changes
- [ ] Keyboard navigation works end-to-end

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Visual Regression

- [ ] Components match design specs
- [ ] Spacing consistent with token system
- [ ] No unintended visual regressions
- [ ] Responsive layouts work at all breakpoints

### Performance

- [ ] No layout shifts during load
- [ ] Loading states appear within 100ms
- [ ] Animations use hardware acceleration
- [ ] Font loading optimized with next/font

---

## Migration Notes

### From Legacy (Vendty 2.x)

1. **Remove**: Bootstrap 3 dependencies, jQuery
2. **Remove**: Inline styles for layout
3. **Extract**: All colors to CSS variables
4. **Migrate**: Font loading to next/fontMontserrat
5. **Implement**: Focus-visible states everywhere
6. **Add**: ARIA labels to navigation and interactive elements
7. **Replace**: `<div>` buttons with `<button>` elements
8. **Add**: Error states to all form inputs

### Known Technical Debt

| Issue | Priority | Estimate |
|-------|----------|----------|
| Tailwind config needs token extension | High | 2h |
| Add focus-visible to all buttons | High | 4h |
| Extract raw hex colors to CSS vars | High | 8h |
| Add loading states to async components | Medium | 6h |
| Add empty state components | Medium | 4h |
| ARIA audit and fixes | Medium | 8h |

---

## Implementation Status

### Completed

- [x] Brand token analysis
- [x] Component audit (Dashboard, Sidebar, Topbar, Login)
- [x] Gap analysis between spec and implementation

### In Progress

- [ ] Tailwind config token extension
- [ ] CSS variable extraction
- [ ] Focus-visible state implementation

### Pending

- [ ] Component refactoring per design system
- [ ] Accessibility audit
- [ ] Visual regression testing setup