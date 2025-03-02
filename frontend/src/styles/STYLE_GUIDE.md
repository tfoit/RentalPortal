# Rental Portal Style Guide

This guide provides detailed instructions for maintaining a consistent, natural earthy design across the Rental Portal application.

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Components](#components)
5. [Layout & Spacing](#layout-spacing)
6. [Responsiveness](#responsiveness)
7. [Dark Mode](#dark-mode)
8. [Icons & Imagery](#icons-imagery)
9. [Form Elements](#form-elements)
10. [Development Guidelines](#development-guidelines)

<a id="design-principles"></a>

## 1. Design Principles

Our application follows these core principles:

- **Natural & Calming**: Earthy tones, gentle contrasts, and organic textures
- **Minimalist**: Remove visual noise, focus on essential elements
- **Consistent**: Maintain visual harmony across all pages and components
- **Accessible**: Ensure good contrast and readable text
- **Responsive**: Optimize for all device sizes

<a id="color-system"></a>

## 2. Color System

### Primary Colors

| Color Name  | Hex       | Tailwind       | Usage                                        |
| ----------- | --------- | -------------- | -------------------------------------------- |
| Sage Green  | `#4D6A59` | `bg-[#4D6A59]` | Primary buttons, active states, main accents |
| Dark Sage   | `#3A5145` | `bg-[#3A5145]` | Pressed states, text color                   |
| Light Sage  | `#607B6B` | `bg-[#607B6B]` | Secondary accents, hover states              |
| Cream       | `#EFE9D9` | `bg-[#EFE9D9]` | Secondary backgrounds, cards                 |
| Light Cream | `#F5F2E9` | `bg-[#F5F2E9]` | Page backgrounds, hover states               |
| Tan         | `#D8CCAD` | `bg-[#D8CCAD]` | Borders, dividers, warning states            |
| Brown       | `#A18167` | `bg-[#A18167]` | Error states, destructive actions            |

### Semantic Colors

| Color Name | Hex       | Tailwind       | Usage                                |
| ---------- | --------- | -------------- | ------------------------------------ |
| Success    | `#4D6A59` | `bg-[#4D6A59]` | Success messages, positive status    |
| Warning    | `#D8CCAD` | `bg-[#D8CCAD]` | Warning messages, caution status     |
| Error      | `#A18167` | `bg-[#A18167]` | Error messages, negative status      |
| Info       | `#607B6B` | `bg-[#607B6B]` | Information messages, neutral status |

### Color Usage Guidelines

- Use sage green (#4D6A59) as the primary action color (buttons, links)
- Use semantic colors only for their intended meaning
- Maintain sufficient contrast for accessibility
- Background colors should use the cream tones (#F5F2E9, #EFE9D9)
- Use tan (#D8CCAD) for borders and subtle accents
- Text should primarily use dark sage (#3A5145) for optimal readability

<a id="typography"></a>

## 3. Typography

### Font Family

- Primary font: `Inter` for all text
- Fallbacks: `ui-sans-serif`, `system-ui`, `-apple-system`, `sans-serif`

### Font Weights

- Headings (h1, h2): Bold (700)
- Subheadings (h3, h4): Semi-bold (600)
- UI elements (h5, h6, buttons): Medium (500)
- Body text: Regular (400)

### Font Sizes

```jsx
// Heading 1
<Typography variant="h1" className="text-2xl md:text-3xl lg:text-4xl">
  Page Title
</Typography>

// Heading 2
<Typography variant="h2" className="text-xl md:text-2xl">
  Section Title
</Typography>

// Heading 3
<Typography variant="h3" className="text-lg">
  Subsection Title
</Typography>

// Body text
<Typography variant="body1" className="text-base">
  Regular paragraph text
</Typography>

// Small text
<Typography variant="body2" className="text-sm">
  Secondary information
</Typography>
```

### Text Colors

- Primary text: `text-gray-800` (dark mode: `dark:text-gray-200`)
- Secondary text: `text-gray-600` (dark mode: `dark:text-gray-300`)
- Tertiary text: `text-gray-500` (dark mode: `dark:text-gray-400`)
- Disabled text: `text-gray-400` (dark mode: `dark:text-gray-500`)

<a id="components"></a>

## 4. Components

### Buttons

Use our `Button` component with the following variants:

```jsx
// Primary button
<Button variant="primary">Primary Action</Button>

// Secondary button
<Button variant="secondary">Secondary Action</Button>

// Outline button
<Button variant="outline">Tertiary Action</Button>

// Text button
<Button variant="text">Text Link</Button>

// With icon
<Button variant="primary" startIcon={<SearchIcon />}>
  Search
</Button>

// Loading state
<Button variant="primary" loading>
  Processing
</Button>
```

### Cards

Cards should be lightweight with subtle shadows:

```jsx
<Card elevation={0} className="hover:shadow-md transition-shadow duration-300 rounded-xl">
  <CardContent>Card content here</CardContent>
</Card>
```

### Alert Messages

Use color-coded alerts for status messages:

```jsx
<Alert severity="success">Success message</Alert>
<Alert severity="warning">Warning message</Alert>
<Alert severity="error">Error message</Alert>
<Alert severity="info">Information message</Alert>
```

### Status Indicators

Use consistent pill-shaped indicators:

```jsx
<span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-medium">
  Available
</span>

<span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs font-medium">
  Rented
</span>

<span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
  Maintenance
</span>
```

<a id="layout-spacing"></a>

## 5. Layout & Spacing

### Container Widths

- Default container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Narrow container: `max-w-3xl mx-auto px-4 sm:px-6 lg:px-8`
- Wide container: `max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8`

### Spacing System

Follow these spacing values consistently:

- Extra small: 0.5rem (2px) - `p-0.5`, `m-0.5`
- Small: 1rem (4px) - `p-1`, `m-1`
- Medium: 1.5rem (6px) - `p-1.5`, `m-1.5`
- Base: 2rem (8px) - `p-2`, `m-2`
- Large: 3rem (12px) - `p-3`, `m-3`
- Extra large: 4rem (16px) - `p-4`, `m-4`
- 2x Large: 6rem (24px) - `p-6`, `m-6`
- 3x Large: 8rem (32px) - `p-8`, `m-8`

### Page Structure

Always use our `PageLayout` component to ensure consistent page structure:

```jsx
<PageLayout title="Page Title" subtitle="Descriptive text about this page" variant="default" bgColor="bg-gray-50">
  {/* Page content */}
</PageLayout>
```

<a id="responsiveness"></a>

## 6. Responsiveness

### Breakpoints

- Small (sm): 640px
- Medium (md): 768px
- Large (lg): 1024px
- Extra Large (xl): 1280px
- 2x Extra Large (2xl): 1536px

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">{/* Content */}</div>
```

### Touch Targets

Ensure all interactive elements are at least 44px×44px for touch devices.

<a id="dark-mode"></a>

## 7. Dark Mode

All components should support dark mode. Follow these patterns:

```jsx
<div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
  <p className="text-gray-600 dark:text-gray-300">This content adapts to dark mode</p>
</div>
```

Always test both light and dark mode when developing new components.

<a id="icons-imagery"></a>

## 8. Icons & Imagery

### Icons

Use Material UI icons consistently throughout the application:

```jsx
import SearchIcon from "@mui/icons-material/Search";

// Standard icon
<SearchIcon />

// Colored icon
<SearchIcon className="text-rose-500" />

// Icon with background
<div className="p-2 rounded-full bg-rose-50 text-rose-500">
  <SearchIcon />
</div>
```

### Images

- Use consistent aspect ratios for similar content (property images, avatars)
- Always include alt text for accessibility
- Optimize images for performance
- Use responsive image techniques (`object-cover`, `object-fit`)

<a id="form-elements"></a>

## 9. Form Elements

### Text Fields

```jsx
const textFieldStyles = combineStyles("bg-white dark:bg-gray-800", {});

<TextField label="Field Label" className={textFieldStyles.className} sx={textFieldStyles.sx} fullWidth variant="outlined" />;
```

### Select Menus

```jsx
<FormControl fullWidth>
  <InputLabel>Select Option</InputLabel>
  <Select value={value} onChange={handleChange} className={selectStyles.className} sx={selectStyles.sx}>
    <MenuItem value={10}>Option One</MenuItem>
    <MenuItem value={20}>Option Two</MenuItem>
    <MenuItem value={30}>Option Three</MenuItem>
  </Select>
</FormControl>
```

### Radio Buttons & Checkboxes

```jsx
<FormControlLabel
  control={<Radio checked={selected === 'option'} />}
  label="Option"
/>

<FormControlLabel
  control={<Checkbox checked={isChecked} />}
  label="Checkbox option"
/>
```

<a id="development-guidelines"></a>

## 10. Development Guidelines

### Consistent Styling Approach

Always use the `combineStyles` utility to ensure consistency between Material UI and Tailwind:

```jsx
import { combineStyles } from "../utils/styleUtils";

const myStyles = combineStyles("bg-white rounded-xl shadow-sm", {
  // Optional MUI sx props
});

<Component className={myStyles.className} sx={myStyles.sx} />;
```

### Component JSDoc

Document all components with JSDoc comments:

```jsx
/**
 * Component description
 *
 * @param {Object} props - Component props
 * @param {string} props.someProp - Description of prop
 * @returns {JSX.Element}
 */
```

### Code Organization

- Keep related files together
- Use the UI components library (`/components/ui/`)
- Update the style guide when creating new patterns
- Ensure all new components follow existing conventions

### Quality Checklist

Before submitting new components, ensure they:

- [x] Work correctly in both light and dark mode
- [x] Are responsive across all breakpoints
- [x] Are accessible (keyboard navigation, screen readers)
- [x] Use existing color/typography patterns
- [x] Use the `combineStyles` utility
- [x] Are documented with JSDoc comments
