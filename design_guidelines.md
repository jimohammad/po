# Design Guidelines: Purchase Order Register Application

## Design Approach
**System Selected**: Material Design principles adapted for enterprise productivity
**Rationale**: Information-dense business application requiring clarity, consistency, and efficient data entry workflows. Focus on usability over visual flair.

## Typography System

**Font Family**: 
- Primary: Outfit (modern geometric sans-serif), fallback to system fonts
- Font weights: 300 (light), 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)
- Monospace: `"SF Mono", Monaco, "Cascadia Code"` for invoice numbers, amounts

**Color Theme**: Ocean Blue & Coral
- Primary: Ocean blue (HSL 205, 75%, 40% light / 50% dark)
- Secondary/Accent: Coral (HSL 16, 85%, 58% light / 62% dark)
- Sidebar: Deep ocean blue (HSL 205, 65%, 18%) with coral highlights
- Background: Cool blue-tinted gray (HSL 200, 25%, 97% light / HSL 205, 55%, 8% dark)
- Cards: Subtle blue-gray (HSL 200, 20%, 98% light / HSL 205, 50%, 11% dark)

**Hierarchy**:
- Page Headers: `text-2xl md:text-3xl font-bold` (Purchase Order Register)
- Section Headers: `text-lg font-semibold` (New Purchase Entry, Reporting)
- Form Labels: `text-xs font-medium` (uppercase tracking-wide for emphasis)
- Input Fields: `text-sm` for data entry fields
- Table Headers: `text-[11px] uppercase tracking-wide`
- Table Data: `text-sm` for readability
- Button Text: `text-sm font-medium`
- Helper Text: `text-xs` or `text-[11px]`
- Numeric Displays (totals): `text-lg md:text-xl font-semibold tabular-nums`

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 3, 4, 6** for consistency
- Component padding: `p-4 md:p-6`
- Section gaps: `space-y-4` or `space-y-6`
- Form field gaps: `gap-3` or `gap-4`
- Inline element gaps: `gap-2`
- Page margins: `px-4 py-6`

**Container Strategy**:
- Max width: `max-w-7xl mx-auto` for main content
- Forms: Full-width within container with responsive grids
- Tables: `overflow-x-auto` wrapper for mobile responsiveness

**Grid Patterns**:
- Two-column forms: `grid md:grid-cols-2 gap-3`
- Invoice entry: Single column for complex nested forms
- Item table: Full-width scrollable table
- Reporting filters: Flex wrap with adaptive layout

## Component Library

### Form Components

**Input Fields**:
- Consistent height: `h-13` (3.25rem as in current design)
- Rounded corners: `rounded-xl`
- Border: `border border-slate-200`
- Focus state: `focus:ring-2 focus:ring-sky-500/60 focus:outline-none`
- Padding: `px-3 py-2`

**Select Dropdowns**:
- Large supplier select: `text-lg` for prominence
- Standard selects: `text-sm`
- Same styling as input fields

**File Upload Buttons**:
- Pill-shaped: `rounded-full`
- Browse button styled with Tailwind's `file:` pseudo-element modifiers
- Position browse button on LEFT inside field
- Height matches other inputs: `h-13`

**Action Buttons**:
- Primary (Save): `rounded-xl bg-sky-600 text-white px-4 py-2 shadow-sm hover:bg-sky-700`
- Secondary (Add): `rounded-xl bg-emerald-500 text-white px-3 py-1.5 hover:bg-emerald-600`
- Edit: `rounded-xl bg-amber-500 text-white px-3 py-1.5 hover:bg-amber-600`
- Tertiary: `rounded-xl border border-slate-300 hover:bg-slate-50`
- Small buttons: `text-xs` or `text-[11px]` for tight spaces
- Active state: `active:scale-[0.99]` for tactile feedback

### Data Display

**Tables**:
- Outer container: `border border-slate-200 rounded-2xl overflow-hidden`
- Header row: Light background, smaller uppercase text
- Alternating rows: Optional subtle `odd:bg-slate-50/50`
- Cell padding: `px-3 py-2` (headers), `px-3 py-3` (data)
- Sticky header on scroll: `sticky top-0` for long tables
- Column widths: Explicitly set with `w-[%]` for data alignment

**Cards/Panels**:
- Wrapper: `bg-white shadow-sm rounded-2xl`
- Padding: `p-4 md:p-6`
- Nested sections: `space-y-4` vertical rhythm

**Status Badges**:
- Small pills: `px-2 py-1 rounded-full text-xs`
- Example: "Storage: Browser (local)" badge in header

### Interactive Components

**Currency Toggle**:
- Segmented control: `inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5`
- Active state: Distinct background treatment
- Buttons: `px-3 py-1.5 rounded-full`

**Modal Dialogs** (for Add/Edit Supplier, Add/Edit Item):
- Overlay: Semi-transparent backdrop `bg-black/50`
- Dialog: `bg-white rounded-2xl shadow-2xl max-w-md mx-auto p-6`
- Header: `text-lg font-semibold mb-4`
- Form: Same input styling as main form
- Actions: Right-aligned button group with `gap-2`

**Dynamic Item Rows**:
- Inline form fields within table cells
- Remove button: Icon-only, small, `text-red-500 hover:text-red-700`
- Add row button: Below table, tertiary style

### Reporting Dashboard

**Filter Bar**:
- Horizontal layout: `flex gap-2 flex-wrap`
- Compact selects: `text-xs px-3 py-1.5 rounded-xl`
- Right-aligned on desktop

**Summary Cards**:
- Grid layout: `grid md:grid-cols-3 gap-4`
- Large numeric values: `text-2xl md:text-3xl font-bold tabular-nums`
- Labels below: `text-xs uppercase tracking-wide`
- Icons: Use Heroicons (outline) from CDN for currency, calendar, document symbols

**Results Table**:
- Similar styling to item entry table
- Action column: Icons for View, Edit, Delete
- Expandable rows for document previews (optional advanced feature)

**Charts** (if implementing analytics):
- Use Chart.js as already included
- Container: `bg-white rounded-2xl p-6 shadow-sm`
- Height: `h-64` or `h-80` for visibility
- Responsive canvas wrapper

## Accessibility & Interactions

- All form fields have explicit labels
- Required fields: Visual indicator (asterisk or "required" text)
- Error states: `border-red-500 focus:ring-red-500/60` with error message below
- Success feedback: Toast notification or inline success message
- Loading states: Button shows spinner, disabled state during submission
- Keyboard navigation: Logical tab order through forms
- Screen reader labels for icon-only buttons

## Animations

**Minimal approach**:
- Button hover: Subtle color shift (already specified)
- Button active: `active:scale-[0.99]`
- Modal entrance: Optional `fade-in` with backdrop
- Loading spinner: Simple circular spin
- NO scroll animations, parallax, or decorative motion

## Print Styling

- `.no-print` class hides UI controls (buttons, filters) when printing
- Forms and data tables remain visible
- Simplified layout with full-width content
- Remove shadows and backgrounds for clean print output

## Advanced Features Implementation Notes

**File Preview**:
- Thumbnail grid below upload field showing uploaded files
- Click to open in modal or new tab
- Delete option per file

**Search & Autocomplete**:
- Supplier/Item search: Floating suggestions below input field
- Dropdown styling: `bg-white border border-slate-200 rounded-xl shadow-lg`

**Notifications**:
- Toast position: Top-right corner, `fixed top-4 right-4 z-50`
- Auto-dismiss after 3-5 seconds
- Types: Success (green), Error (red), Info (blue)

**Empty States**:
- Centered in container
- Icon + message: `text-slate-400 text-sm`
- Call-to-action button below

## Responsive Behavior

- Mobile-first approach
- Forms stack to single column: `grid md:grid-cols-2`
- Tables scroll horizontally on mobile
- Button groups wrap: `flex-wrap gap-2`
- Compact spacing on mobile: `p-4` vs desktop `md:p-6`
- Hide less critical columns on mobile (use responsive table patterns)