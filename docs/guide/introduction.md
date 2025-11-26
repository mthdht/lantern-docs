# Introduction

## What is Lantern UI?

Lantern UI is a Vue 3 component library built on a unique **framework-agnostic theming system**. Unlike traditional component libraries that lock you into a specific styling approach, Lantern provides both headless primitives for maximum control and pre-styled components for rapid development, all powered by a flexible color/variant/key architecture.

Whether you want to use our carefully crafted themes or build something completely custom, Lantern adapts to your needs through a clear hierarchy of customization: **props → component specs → global theme**.

## Key Features

- **🎨 Framework-Agnostic Theming** - Define colors, variants, and properties independently of any CSS framework
- **🧩 Dual Architecture** - Choose between headless primitives or styled components (or mix both)
- **⚡ Granular Customization** - Override at any level: component instance, component spec, or global theme
- **🎯 Type-Safe** - Full TypeScript support with intelligent autocompletion
- **♿ Accessible by Default** - WCAG-compliant primitives with proper ARIA attributes
- **🔧 Composable Logic** - Reusable composables for complex component behaviors
- **📦 Tree-Shakeable** - Import only what you need

## Design Philosophy

Lantern is built on three core principles:

### 1. Separation of Concerns

Components are split into two layers:

```
┌─────────────────────────────────────────┐
│  Styled Components (Optional)           │
│  └─ Apply theme, specs, custom classes  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Primitives (Headless)                  │
│  └─ Logic, state, a11y, behavior        │
└─────────────────────────────────────────┘
```

**Primitives** handle logic, state management, accessibility, and keyboard interactions. They're completely unstyled and work with any design system.

**Styled Components** wrap primitives and apply your theme configuration, component specs, and custom classes through a unified system.

### 2. Hierarchical Customization

Lantern uses a clear priority system for styling:

```
Props (highest priority)
  ↓
Component Specs
  ↓
Global Theme (fallback)
```

:::warning Priority System
This hierarchy is **always respected**. Props override specs, specs override theme. Understanding this flow is crucial for effective customization.
:::

This means you can:
- Set sensible defaults in your **global theme**
- Override specific components via **specs**
- Fine-tune individual instances with **props**

### 3. Framework-Agnostic Class System

At its core, Lantern is a **class application system**. The theme maps semantic concepts to CSS class strings—nothing more, nothing less.

The system is built around three concepts:

**Colors** → Semantic color schemes (primary, secondary, danger, etc.)  
**Variants** → Visual styles (filled, outline, ghost, etc.)  
**Keys** → Properties to style (background, foreground, hover, border, etc.)

Each key maps to a **string of CSS classes**—any classes you want:

```typescript
{
  colors: {
    primary: {
      filled: {
        background: 'bg-blue-600',           // Tailwind
        foreground: 'text-white',            // Tailwind
        hover: 'hover:bg-blue-700'           // Tailwind
      },
      outline: {
        background: 'button-transparent',    // Custom class
        foreground: 'primary-text',          // Custom class
        border: 'border-primary border-2'    // Mix of both
      }
    }
  }
}
```

**Use whatever you want:**
- Tailwind utility classes
- CSS Modules classes
- BEM classes
- Your own custom classes
- Mix and match multiple approaches

:::info Key Concept
Lantern doesn't process CSS—it just applies the class strings you define. The actual styling is entirely up to you.
:::

## Architecture Overview

Lantern's architecture revolves around two key concepts: the **global theme** and **component specs**. Understanding how they work together is essential to mastering customization.

### The Theme System

The global theme serves as the foundation for all styling in your application. It's structured in two parts:

```typescript
theme = {
  colors: {
    primary: {
      filled: { /* ... */ },
      outline: { /* ... */ }
    },
    danger: { /* ... */ }
  },
  
  size: { sm: '...', md: '...', lg: '...' },
  radius: { none: '...', sm: '...', full: '...' },
  spacing: { /* ... */ },
  shadow: { /* ... */ }
}
```

**Colors** is special—it defines semantic color schemes (primary, danger, success, etc.) with their variants (filled, outline, ghost, etc.) and the specific styling keys for each combination.

**Everything else** (size, radius, spacing, shadow, etc.) are simply key-value mappings of reusable class presets. You can add any property you need—Lantern doesn't impose restrictions.

When a component needs styling, it looks up the appropriate color/variant combination and applies the classes from the specified keys. For other properties like size or radius, it simply retrieves the matching preset.

→ **[Explore the Theme System in depth](./theme-system)**

### Component Specs

Each component has a spec that controls how it consumes the theme:

```typescript
buttonSpec = {
  apply: ['hover', 'focus'],
  class: 'inline-flex items-center gap-2',
  defaultProps: {
    color: 'primary',
    variant: 'filled',
    size: 'md',
    radius: 'md'
  },
  override: {
    colors: {
      primary: {
        filled: {
          background: 'custom-primary-bg'
        }
      }
    },
    size: {
      lg: 'custom-large-size'
    }
  }
}
```

**The `apply` array** determines which styling keys are extracted from the color/variant combination. For example, `['hover', 'focus']` means only the `hover` and `focus` classes will be applied—even if the color variant defines additional keys like `border` or `shadow`. This gives precise control over which styles each component uses.

:::tip Auto-Applied Keys
`background` and `foreground` are always included automatically as they're considered essential base styles—no need to add them to the `apply` array.
:::

**The `class` property** defines base classes applied to every instance of the component, regardless of props.

**The `defaultProps` object** sets fallback values when props aren't provided. These become the component's defaults.

**The `override` section** allows you to define component-specific styling that takes precedence over the global theme. This is useful when a component needs a unique color treatment or custom sizing that doesn't fit the global scheme.

→ **[Master Component Specs](./component-specs)**

### Resolution Flow

When you render a component:

1. **Global theme** provides base values
2. **Component spec** can override colors, sizes, etc.
3. **Props** have the final word

```vue
<!-- Uses spec defaults -->
<Button>Click me</Button>

<!-- Override at instance level -->
<Button color="danger" variant="outline" size="lg">
  Delete
</Button>
```

## Who is Lantern For?

### You want pre-built themes
Use our styled components with default themes for rapid development. Customize colors and spacing through the global theme, and you're ready to ship.

### You need full control
Use primitives directly and bring your own styling system. Lantern primitives handle the hard parts (state, a11y, keyboard nav) while you maintain complete control over appearance.

### You want flexibility
Mix and match: use styled components where they fit, primitives where you need custom designs. Override at any level—global, component, or instance.

## Comparison with Other Libraries

| Feature | Lantern UI | Headless UI | shadcn/ui |
|---------|------------|-------------|-----------|
| **Primitives** | ✅ Full headless components | ✅ Headless only | ❌ Styled only |
| **Styled Components** | ✅ Optional pre-styled | ❌ BYO styling | ✅ Pre-styled |
| **Theme System** | ✅ Framework-agnostic | ❌ No theme system | ⚠️ Tailwind-specific |
| **Customization Levels** | ✅ Props/Spec/Global | ⚠️ Props only | ⚠️ Modify source |
| **Distribution** | 📦 npm package | 📦 npm package | 📋 Copy-paste |
| **Framework** | Vue 3 | Vue 3 & React | React |

## What's Next?

Ready to get started? Here's your path:

1. **[Installation](./installation)** - Set up Lantern in your project
2. **[Quick Start](./quick-start)** - Build your first component
3. **[Theme System](./theme-system)** - Understand the theming architecture
4. **[Component Specs](./component-specs)** - Learn to customize components
5. **[Components](../components/button)** - Explore available components

---

:::tip Need Help?
Join our [GitHub Discussions](https://github.com/pharos-lab/lantern/discussions) or [open an issue](https://github.com/pharos-lab/lantern/issues) if you need assistance.
:::