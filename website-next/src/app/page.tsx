import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import {
  Win31Background,
  Win31Panel,
  Win31Button,
  Win31GroupBox,
  Win31StatusBar,
  StatusBarSection,
} from "@/components/win31";
import { WindowDemo } from "./WindowDemo";
import { InteractiveDemo } from "./InteractiveDemo";

export default function Home() {
  return (
    <Win31Background className="flex flex-col items-center justify-start p-[var(--win31-desktop-padding)] min-h-screen gap-6">
      {/* Component Gallery */}
      <Win31Panel className="p-0 max-w-[640px] w-full shadow-[4px_4px_0_var(--color-black)]">
        {/* Title bar */}
        <div className="bg-[var(--color-titlebar-active)] h-[var(--win31-titlebar-height)] flex items-center px-2">
          <span className="text-[var(--color-text-on-titlebar)] font-[family-name:var(--font-system)] text-xs font-bold">
            Win31 Component Gallery
          </span>
        </div>

        {/* Window body */}
        <div className="p-4 flex flex-col gap-4">
          {/* Theme switcher row */}
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-system)] text-xs text-[var(--color-text-primary)]">
              Theme:
            </span>
            <ThemeSwitcher />
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-display)] text-[var(--color-text-accent)] text-sm leading-relaxed">
            Win31 Design System
          </h1>

          <p className="font-[family-name:var(--font-body)] text-[var(--color-text-primary)] text-base leading-relaxed">
            Eight components with CVA variants and design tokens.
            Switch themes above to verify token resolution.
          </p>

          {/* Inset panel demo */}
          <Win31Panel variant="inset" className="p-3">
            <code className="font-[family-name:var(--font-code)] text-[var(--color-text-code)] text-sm">
              Win31Panel variant=&quot;inset&quot; -- sunken text field
            </code>
          </Win31Panel>

          {/* Flat panel demo */}
          <Win31Panel variant="flat" className="p-3">
            <code className="font-[family-name:var(--font-code)] text-[var(--color-text-primary)] text-sm">
              Win31Panel variant=&quot;flat&quot; -- flat bordered region
            </code>
          </Win31Panel>

          {/* Button variants */}
          <Win31GroupBox label="Button Variants">
            <div className="flex flex-wrap gap-2">
              <Win31Button>Default</Win31Button>
              <Win31Button variant="primary">Primary</Win31Button>
              <Win31Button variant="danger">Danger</Win31Button>
              <Win31Button variant="ghost">Ghost</Win31Button>
              <Win31Button disabled>Disabled</Win31Button>
            </div>
          </Win31GroupBox>

          {/* Button sizes */}
          <Win31GroupBox label="Button Sizes">
            <div className="flex flex-wrap items-end gap-2">
              <Win31Button size="sm">Small</Win31Button>
              <Win31Button size="md">Medium</Win31Button>
              <Win31Button size="lg">Large</Win31Button>
            </div>
          </Win31GroupBox>

          {/* Nested panels demo */}
          <Win31GroupBox label="Nested Panels">
            <div className="flex gap-2">
              <Win31Panel className="flex-1 p-2">
                <span className="font-[family-name:var(--font-system)] text-xs text-[var(--color-text-primary)]">
                  Raised
                </span>
              </Win31Panel>
              <Win31Panel variant="inset" className="flex-1 p-2">
                <span className="font-[family-name:var(--font-system)] text-xs text-[var(--color-text-primary)]">
                  Inset
                </span>
              </Win31Panel>
              <Win31Panel variant="flat" className="flex-1 p-2">
                <span className="font-[family-name:var(--font-system)] text-xs text-[var(--color-text-primary)]">
                  Flat
                </span>
              </Win31Panel>
            </div>
          </Win31GroupBox>

          {/* Status indicators */}
          <div className="flex gap-4 font-[family-name:var(--font-system)] text-xs">
            <span className="text-[var(--color-success)]">OK</span>
            <span className="text-[var(--color-warning)]">WARN</span>
            <span className="text-[var(--color-error)]">ERR</span>
            <span className="text-[var(--color-info)]">INFO</span>
          </div>
        </div>

        {/* Status bar at bottom */}
        <Win31StatusBar>
          <StatusBarSection>Ready</StatusBarSection>
          <StatusBarSection width="120px">8 components</StatusBarSection>
          <StatusBarSection width="80px">v0.2.0</StatusBarSection>
        </Win31StatusBar>
      </Win31Panel>

      {/* Interactive Radix-backed components demo */}
      <InteractiveDemo />

      {/* Window Demo - interactive draggable window */}
      <WindowDemo />
    </Win31Background>
  );
}
