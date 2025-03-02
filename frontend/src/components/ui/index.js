/**
 * UI Components Library
 *
 * This file exports all the reusable UI components for easy imports.
 * Example usage: import { Button, Card, Badge } from "../components/ui";
 */

import Button from "./Button";
import Card from "./Card";
import Badge from "./Badge";
import DarkModeToggle from "./DarkModeToggle";

// Export individual components
export { Button, Card, Badge, DarkModeToggle };

// Export as default object
export default {
  Button,
  Card,
  Badge,
  DarkModeToggle,
};

// Export all UI components for easy imports
export { default as Alert } from "./Alert";
export { default as Checkbox } from "./Checkbox";
export { default as Input } from "./Input";
export { default as Modal } from "./Modal";
export { default as Select } from "./Select";

// Add more component exports as they are created
