export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-desktop)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--win31-desktop-padding)',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderTop: '2px solid var(--color-border-raised-light)',
          borderLeft: '2px solid var(--color-border-raised-light)',
          borderBottom: '2px solid var(--color-border-raised-dark)',
          borderRight: '2px solid var(--color-border-raised-dark)',
          padding: 'var(--space-8)',
          minWidth: 'var(--win31-window-min-width)',
          maxWidth: '600px',
          boxShadow: '4px 4px 0 var(--color-black)',
        }}
      >
        {/* Titlebar */}
        <div
          style={{
            background: 'var(--color-titlebar-active)',
            height: 'var(--win31-titlebar-height)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 'var(--space-2)',
            paddingRight: 'var(--space-2)',
          }}
        >
          <span
            style={{
              color: 'var(--color-text-on-titlebar)',
              fontFamily: 'var(--font-system)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 700,
            }}
          >
            Token Test
          </span>
        </div>

        {/* Content */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-accent)',
            fontSize: 'var(--font-size-sm)',
            lineHeight: 2,
            marginBottom: 'var(--space-4)',
          }}
        >
          Win31 Design System - Tokens Loaded
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-base)',
            lineHeight: 1.6,
            marginBottom: 'var(--space-6)',
          }}
        >
          If you see teal desktop, gray panel, pixel font, and monospace body
          text - the token system is working.
        </p>

        {/* Inset field to test inset borders */}
        <div
          style={{
            background: 'var(--color-surface-inset)',
            borderTop: '2px solid var(--color-border-inset-light)',
            borderLeft: '2px solid var(--color-border-inset-light)',
            borderBottom: '2px solid var(--color-border-inset-dark)',
            borderRight: '2px solid var(--color-border-inset-dark)',
            padding: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <code
            style={{
              fontFamily: 'var(--font-code)',
              color: 'var(--color-text-code)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            3 tiers: primitives → semantic → components
          </code>
        </div>

        {/* Status indicators */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            fontFamily: 'var(--font-system)',
            fontSize: 'var(--font-size-xs)',
          }}
        >
          <span style={{ color: 'var(--color-success)' }}>OK</span>
          <span style={{ color: 'var(--color-warning)' }}>WARN</span>
          <span style={{ color: 'var(--color-error)' }}>ERR</span>
          <span style={{ color: 'var(--color-info)' }}>INFO</span>
        </div>
      </div>
    </div>
  );
}
