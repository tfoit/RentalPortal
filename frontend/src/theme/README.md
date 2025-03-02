# Rental Portal Style Guide

This document outlines our application's design system, built to ensure consistency across all components with a natural, earthy design.

## Color Palette

Our application uses a calming, natural color palette inspired by earthy tones:

| Name                 | Color Code | Tailwind Class | Description                                         |
| -------------------- | ---------- | -------------- | --------------------------------------------------- |
| Sage Green (Primary) | `#4D6A59`  | `bg-[#4D6A59]` | Main brand color for primary actions and accents    |
| Cream (Secondary)    | `#EFE9D9`  | `bg-[#EFE9D9]` | Secondary elements, backgrounds, subtle UI elements |
| Tan                  | `#D8CCAD`  | `bg-[#D8CCAD]` | Warnings, pending states, decorative accents        |
| Brown                | `#A18167`  | `bg-[#A18167]` | Errors, alerts, destructive actions                 |
| Dark Sage            | `#3A5145`  | `bg-[#3A5145]` | Text colors, active states                          |
| Light Sage           | `#607B6B`  | `bg-[#607B6B]` | Informational elements, help content                |
| Light Cream          | `#F5F2E9`  | `bg-[#F5F2E9]` | Page backgrounds, subtle UI elements                |

## Typography

- **Font Family**: `Inter` for all text
- **Font Weights**:
  - Headings (h1, h2): `font-bold` (700)
  - Subheadings (h3, h4): `font-semibold` (600)
  - UI elements (h5, h6, buttons): `font-medium` (500)
  - Body text: `font-normal` (400)

## Spacing

Follow these spacing values consistently:

- **Extra small**: 0.5rem (2px) - `p-0.5`, `m-0.5`
- **Small**: 1rem (4px) - `p-1`, `m-1`
- **Medium**: 1.5rem (6px) - `p-1.5`, `m-1.5`
- **Base**: 2rem (8px) - `p-2`, `m-2`
- **Large**: 3rem (12px) - `p-3`, `m-3`
- **Extra large**: 4rem (16px) - `p-4`, `m-4`
- **2x Large**: 6rem (24px) - `p-6`, `m-6`
- **3x Large**: 8rem (32px) - `p-8`, `m-8`

## Components

### Buttons

```jsx
import { Button } from '../components/ui';

// Primary button (sage green)
<Button variant="primary" size="md">Click Me</Button>

// Secondary button (cream)
<Button variant="secondary" size="md">Secondary Action</Button>

// Outline button
<Button variant="outline">Outline Button</Button>

// Text button
<Button variant="text">Text Button</Button>

// With icon
<Button variant="primary" startIcon={<SearchIcon />}>Search</Button>
```

### Cards

```jsx
import { Card } from '../components/ui';

// Basic card
<Card>Content</Card>

// With header and footer
<Card
  title="Card Title"
  subheader="Card Subtitle"
  footer={<Button>Action</Button>}
>
  Card content
</Card>

// With hover effect
<Card hover>Hoverable card</Card>

// With image
<Card
  imageUrl="/path/to/image.jpg"
  imageAlt="Description"
>
  Card with image
</Card>
```

### Form Fields

For all form fields:

- Use consistent styling with white backgrounds (`bg-white`)
- Apply rounded corners (`rounded-lg`)
- Maintain consistent spacing between fields (1.5rem - `space-y-6`)

```jsx
// Text fields with combineStyles utility
const textFieldStyles = combineStyles("bg-white dark:bg-gray-800", {});

<TextField label="Field Label" className={textFieldStyles.className} sx={textFieldStyles.sx} />;
```

## Layout Patterns

### Page Layout

Use the `PageLayout` component for consistent page structure:

```jsx
<PageLayout title="Page Title" subtitle="Page subtitle text" variant="default" bgColor="bg-[#F5F2E9]">
  {/* Page content */}
</PageLayout>
```

Options:

- `variant`: "default" (standard width), "centered" (centered content), "full" (full width)
- `bgColor`: Background color class (default: bg-white)
- `withPaper`: Whether to wrap content in a Paper component (default: false)

### Cards and Containers

- Use cards with consistent elevation (prefer `elevation={0}` with subtle shadows)
- Maintain generous whitespace between elements
- Use rounded corners for all containers (`rounded-xl`)

## Styling Utilities

### combineStyles

Always use `combineStyles` to ensure consistency between Material UI and Tailwind:

```jsx
import { combineStyles } from "../utils/styleUtils";

const myStyles = combineStyles("tailwind-classes", {
  /* MUI sx styles */
});

<Component className={myStyles.className} sx={myStyles.sx} />;
```

### Conditional Classes

For conditional styling:

```jsx
const statusClasses = {
  available: "bg-[#607B6B] text-white",
  rented: "bg-[#4D6A59] text-white",
  maintenance: "bg-[#D8CCAD] text-[#3A5145]",
};

<div className={statusClasses[status]}>Status: {status}</div>;
```

## Dark Mode

Our application supports dark mode:

- Use `dark:` prefix for dark mode specific styles
- Use semantic color references rather than specific colors
- Test all components in both light and dark modes

```jsx
<div className="bg-white dark:bg-gray-800 text-[#3A5145] dark:text-gray-200">Content that works in both modes</div>
```

## Icons

- Prefer Material UI icons for consistency
- Use icon containers with subtle backgrounds for emphasis:

```jsx
<div className="p-2 rounded-full bg-[#EFE9D9] text-[#4D6A59]">
  <SearchIcon />
</div>
```

## Responsive Design

- Use responsive classes for all components
- Test on small (mobile), medium (tablet), and large (desktop) screens
- Use consistent breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)

## Adding New Components

When creating new components:

1. Follow existing naming conventions
2. Use the `combineStyles` utility for styling
3. Include JSDoc documentation with all props explained
4. Support dark mode with appropriate styles
5. Export from the appropriate index file
