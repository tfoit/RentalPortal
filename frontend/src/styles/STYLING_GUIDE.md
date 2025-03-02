Rental Portal Styling Guide
Introduction
Welcome to the Rental Portal Styling Guide! This document outlines our approach to styling the Rental Portal application, utilizing both Material UI and Tailwind CSS. Our goal is to maintain a consistent visual theme across all components, ensuring a cohesive user experience while leveraging the strengths of both styling systems. Whether you're building complex UI elements or handling layout and spacing, this guide will help you decide when and how to use each tool effectively.
Core Principles
Our styling strategy is built on the following principles to ensure consistency and maintainability:
Consistent Theme
Material UI and Tailwind CSS share the same color palette, typography, and spacing values. This alignment prevents visual discrepancies and creates a unified look across the application.

Component-First Approach
Use Material UI for complex, interactive components with built-in behavior and accessibility, styling them with Tailwind CSS for additional customization where needed.

Utility-Based Styling
Tailwind CSS is preferred for layout, spacing, and basic styling due to its utility classes, which enable rapid development and easy adjustments.

Dark Mode Support
All components must support both light and dark modes, accommodating user preferences seamlessly.

When to Use Each Approach
To maintain a consistent theme, it’s critical to understand the roles of Material UI and Tailwind CSS:
Use Material UI for:
Complex Components: Dialogs, Menus, Tabs, Drawers—components requiring interactivity and accessibility out of the box.

Form Elements: TextField, Select, Checkbox, Radio—where built-in validation and behavior are needed.

Data Display: Tables, Grids, Lists—components with structured data presentation.

Behavioral Props: When component props (e.g., variant, color) are essential for functionality.

Use Tailwind CSS for:
Layout: Flexbox, grid systems, and positioning (e.g., flex, grid, absolute).

Spacing: Margins and padding (e.g., mt-4, p-6).

Responsive Design: Tailwind’s responsive prefixes (e.g., sm:, md:, lg:).

Basic Styling: Colors, typography, borders, shadows (e.g., bg-primary, text-lg, shadow-md).

Transitions and Animations: Smooth effects (e.g., hover:scale-105, transition-all).

Example Scenario
For a multi-step form:
Use Material UI’s TextField and Button for form inputs and submission.

Use Tailwind CSS to style the layout (e.g., grid gap-4 md:grid-cols-2) and add responsive spacing.

Styling Patterns
We’ve established patterns to combine Material UI and Tailwind CSS effectively, ensuring a consistent theme:

1. Component Wrapper Pattern
   Wrap Material UI components with Tailwind classes to customize their appearance without losing functionality.
   jsx

import { TextField } from '@mui/material';

function StyledTextField(props) {
return (
<TextField
className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary"
{...props}
/>
);
}

Why Use This?
This pattern allows you to maintain Material UI’s behavior (e.g., focus states, error handling) while applying global or custom styles via Tailwind. 2. Utility Function Pattern
Use the combineStyles utility (located in utils/styleUtils.js) to merge Tailwind classes and Material UI’s sx prop cleanly.
jsx

import { Button } from '@mui/material';
import { combineStyles } from '../utils/styleUtils';

function MyComponent() {
const buttonStyles = combineStyles(
"mt-4 hover:shadow-lg transition-shadow", // Tailwind classes
{ borderRadius: 8 } // MUI sx prop
);

return (
<Button
      variant="contained"
      className={buttonStyles.className}
      sx={buttonStyles.sx}
    >
Submit
</Button>
);
}

Why Use This?
This keeps your code DRY (Don’t Repeat Yourself) when a component needs both styling systems, improving readability and maintainability. 3. Enhanced Component Pattern
Use pre-styled components from components/ui/ that integrate Material UI and Tailwind CSS for consistency.
jsx

import { Button, Card } from '../components/ui';

function MyComponent() {
return (
<Card variant="primary" shadow="soft" hover>
<h3 className="text-lg font-semibold">Card Title</h3>
<p className="text-charcoal dark:text-darkText">Card content goes here...</p>
<Button variant="primary" size="md">Click Me</Button>
</Card>
);
}

Available Enhanced Components
Button: Customizable button with variants (primary, secondary) and sizes (sm, md, lg).

Card: Flexible container with options for shadows and hover effects.

Badge: Small status indicator with consistent colors.

Input: Styled input with validation states.

PageLayout: Standardized layout for pages with consistent spacing.

Note: Check components/ui/ for detailed documentation and props.
Dark Mode
We support dark mode using Tailwind’s dark: prefix and Material UI’s theming system:
Tailwind CSS
Apply dark mode styles with the dark: prefix.
jsx

<div className="bg-white dark:bg-background-dark text-charcoal dark:text-darkText">
  This content adapts to dark mode.
</div>

Material UI
The ThemeProvider automatically applies dark mode styles when the theme is toggled.
Testing Dark Mode
Toggle the theme via the application settings or use browser dev tools to simulate prefers-color-scheme: dark.
Colors and Theme Values
Our theme uses a shared color palette for consistency:
Color Name

Tailwind Class

Material UI Prop

Primary

bg-primary

color="primary"

Secondary

bg-secondary

color="secondary"

Success

bg-success

color="success"

Error

bg-error

color="error"

Background

bg-background

N/A

Text (Light)

text-charcoal

N/A

Text (Dark)

text-darkText

N/A

Example Usage:
jsx

// Tailwind

<div className="bg-primary text-white">Primary background</div>

// Material UI
<Button color="primary" variant="contained">Primary Button</Button>

Note: Refer to the theme configuration files for the full palette.
Common Components
Use these enhanced components from components/ui/ to ensure a consistent theme:
Button: For all interactive buttons (e.g., <Button variant="primary" size="md">).

Card: For grouping content (e.g., <Card variant="primary" shadow="soft">).

Badge: For status indicators (e.g., <Badge color="success">).

Input: For form inputs (e.g., <Input variant="outlined">).

PageLayout: For page structure (e.g., <PageLayout>).

Documentation: See components/ui/ for usage examples and props.
Helpful Tips
Class Order
Group Tailwind classes by category (e.g., flex items-center gap-4 text-lg font-medium) for readability.

Component Props
Use Material UI props for functionality (e.g., variant="contained") and Tailwind for styling (e.g., className="mt-2").

Responsive Design
Leverage Tailwind’s prefixes: <div className="flex flex-col md:flex-row gap-4">.

Custom Components
For unique UI needs, create new components in components/ui/ following these patterns.

Interactive States
Use hover: and focus: (e.g., hover:bg-primary-dark focus:ring-2) for consistent feedback.

Arbitrary Values
Use Tailwind’s arbitrary syntax for one-offs (e.g., w-[250px], text-[18px]).

Conclusion
By following this styling guide, you’ll contribute to a Rental Portal application that’s visually consistent, user-friendly, and easy to maintain. Material UI provides robust components, while Tailwind CSS offers flexibility—together, they create a powerful styling system. Refer to this guide as you work, and feel free to suggest updates as our needs evolve.
