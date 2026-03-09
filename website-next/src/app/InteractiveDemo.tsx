"use client";

import { useState } from "react";
import {
  Win31Button,
  Win31GroupBox,
  Win31Panel,
  Win31Dialog,
  Win31Menu,
  Win31MenuTrigger,
  Win31MenuContent,
  Win31MenuItem,
  Win31MenuSeparator,
  Win31Tooltip,
  Win31Select,
  Win31StatusBar,
  StatusBarSection,
} from "@/components/win31";

/**
 * Interactive demo of the four Radix-backed Win31 components.
 * Mounted as a client component from the server-rendered page.
 */
export function InteractiveDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuChoice, setMenuChoice] = useState("(none)");
  const [selectValue, setSelectValue] = useState("file-manager");

  const selectOptions = [
    { value: "file-manager", label: "File Manager" },
    { value: "program-manager", label: "Program Manager" },
    { value: "control-panel", label: "Control Panel" },
    { value: "notepad", label: "Notepad" },
    { value: "paintbrush", label: "Paintbrush" },
    { value: "terminal", label: "Terminal" },
  ];

  return (
    <Win31Panel className="p-0 max-w-[640px] w-full shadow-[4px_4px_0_var(--color-black)]">
      {/* Titlebar */}
      <div className="bg-[var(--color-titlebar-active)] h-[var(--win31-titlebar-height)] flex items-center px-2">
        <span className="text-[var(--color-text-on-titlebar)] font-[family-name:var(--font-system)] text-xs font-bold">
          Interactive Components (Radix UI)
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <p className="font-[family-name:var(--font-body)] text-[var(--color-text-primary)] text-sm leading-relaxed">
          Four Radix-backed components with full keyboard navigation,
          focus management, and ARIA attributes.
        </p>

        {/* Dialog demo */}
        <Win31GroupBox label="Dialog">
          <div className="flex items-center gap-3">
            <Win31Tooltip content="Opens a modal dialog (Esc to close)">
              <Win31Button onClick={() => setDialogOpen(true)}>
                Open Dialog
              </Win31Button>
            </Win31Tooltip>
          </div>
          <Win31Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="About Win31 Design System"
            width="max-w-md"
          >
            <div className="flex flex-col gap-3">
              <p>
                This dialog is backed by <strong>@radix-ui/react-dialog</strong>.
                It provides a focus trap, Escape key handling, and proper
                <code> role=&quot;dialog&quot;</code> ARIA semantics.
              </p>
              <div className="flex justify-end gap-2">
                <Win31Button onClick={() => setDialogOpen(false)}>
                  OK
                </Win31Button>
                <Win31Button
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Win31Button>
              </div>
            </div>
          </Win31Dialog>
        </Win31GroupBox>

        {/* Menu demo */}
        <Win31GroupBox label="Dropdown Menu">
          <div className="flex items-center gap-3">
            <Win31Menu>
              <Win31MenuTrigger asChild>
                <Win31Button>File</Win31Button>
              </Win31MenuTrigger>
              <Win31MenuContent>
                <Win31MenuItem onSelect={() => setMenuChoice("New")}>
                  New
                </Win31MenuItem>
                <Win31MenuItem onSelect={() => setMenuChoice("Open...")}>
                  Open...
                </Win31MenuItem>
                <Win31MenuItem onSelect={() => setMenuChoice("Save")}>
                  Save
                </Win31MenuItem>
                <Win31MenuSeparator />
                <Win31MenuItem onSelect={() => setMenuChoice("Print")}>
                  Print
                </Win31MenuItem>
                <Win31MenuSeparator />
                <Win31MenuItem disabled>
                  Network... (disabled)
                </Win31MenuItem>
                <Win31MenuSeparator />
                <Win31MenuItem onSelect={() => setMenuChoice("Exit")}>
                  Exit
                </Win31MenuItem>
              </Win31MenuContent>
            </Win31Menu>

            <Win31Panel variant="inset" className="px-2 py-0.5 min-w-[140px]">
              <span className="font-[family-name:var(--font-system)] text-xs text-[var(--color-text-primary)]">
                Last choice: {menuChoice}
              </span>
            </Win31Panel>
          </div>
        </Win31GroupBox>

        {/* Tooltip demo */}
        <Win31GroupBox label="Tooltips">
          <div className="flex flex-wrap gap-2">
            <Win31Tooltip content="Creates a new document" side="bottom">
              <Win31Button size="sm">New</Win31Button>
            </Win31Tooltip>
            <Win31Tooltip content="Opens an existing document" side="bottom">
              <Win31Button size="sm">Open</Win31Button>
            </Win31Tooltip>
            <Win31Tooltip content="Saves the current document" side="bottom">
              <Win31Button size="sm">Save</Win31Button>
            </Win31Tooltip>
            <Win31Tooltip content="Prints the current document" side="top">
              <Win31Button size="sm" variant="primary">Print</Win31Button>
            </Win31Tooltip>
            <Win31Tooltip content="This action cannot be undone" side="top">
              <Win31Button size="sm" variant="danger">Delete</Win31Button>
            </Win31Tooltip>
          </div>
          <p className="mt-2 font-[family-name:var(--font-system)] text-[10px] text-[var(--color-text-muted)]">
            Hover or focus each button to see the tooltip.
          </p>
        </Win31GroupBox>

        {/* Select demo */}
        <Win31GroupBox label="Select (Combo Box)">
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-system)] text-xs text-[var(--color-text-primary)]">
              Application:
            </span>
            <Win31Select
              value={selectValue}
              onValueChange={setSelectValue}
              options={selectOptions}
              placeholder="Choose app..."
            />
          </div>
          <Win31Panel variant="inset" className="mt-2 px-2 py-1">
            <span className="font-[family-name:var(--font-system)] text-xs text-[var(--color-text-primary)]">
              Selected: {selectOptions.find((o) => o.value === selectValue)?.label}
            </span>
          </Win31Panel>
        </Win31GroupBox>
      </div>

      <Win31StatusBar>
        <StatusBarSection>12 components loaded</StatusBarSection>
        <StatusBarSection width="100px">Radix UI</StatusBarSection>
      </Win31StatusBar>
    </Win31Panel>
  );
}
