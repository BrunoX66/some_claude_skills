/**
 * Windows 3.1 Design System - Primitive Components
 *
 * All components use semantic design tokens (Tier 2) and
 * class-variance-authority for variant management.
 *
 * Interactive components (Dialog, Menu, Tooltip, Select) are
 * backed by Radix UI primitives for accessibility.
 */

export { Win31Panel } from "./Win31Panel";
export type { Win31PanelProps } from "./Win31Panel";

export { Win31Button } from "./Win31Button";
export type { Win31ButtonProps } from "./Win31Button";

export { Win31GroupBox } from "./Win31GroupBox";
export type { Win31GroupBoxProps } from "./Win31GroupBox";

export { Win31StatusBar, StatusBarSection } from "./Win31StatusBar";
export type {
  Win31StatusBarProps,
  StatusBarSectionProps,
} from "./Win31StatusBar";

export { Win31Background } from "./Win31Background";
export type { Win31BackgroundProps, Win31PatternType } from "./Win31Background";

export { Win31Window } from "./Win31Window";
export type { Win31WindowProps } from "./Win31Window";

export { Win31MDIWindow } from "./Win31MDIWindow";
export type { Win31MDIWindowProps } from "./Win31MDIWindow";

export { Win31Scrollbar } from "./Win31Scrollbar";
export type { Win31ScrollbarProps } from "./Win31Scrollbar";

/* --- Interactive (Radix-backed) --- */

export { Win31Dialog, Win31DialogTrigger } from "./Win31Dialog";
export type { Win31DialogProps } from "./Win31Dialog";

export {
  Win31Menu,
  Win31MenuTrigger,
  Win31MenuContent,
  Win31MenuItem,
  Win31MenuSeparator,
} from "./Win31Menu";
export type {
  Win31MenuProps,
  Win31MenuContentProps,
  Win31MenuItemProps,
  Win31MenuSeparatorProps,
} from "./Win31Menu";

export { Win31Tooltip } from "./Win31Tooltip";
export type { Win31TooltipProps } from "./Win31Tooltip";

export { Win31Select } from "./Win31Select";
export type { Win31SelectProps, Win31SelectOption } from "./Win31Select";
