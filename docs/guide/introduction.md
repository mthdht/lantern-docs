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

Components are split into two independent layers that work together:

**Primitives (Headless)** provide the foundation:
- State management and reactive logic
- Accessibility (ARIA attributes, keyboard navigation)
- Event handling and behavior
- Completely unstyled. work with any design system

**Styled Components** add the visuals:
- Consume the theme configuration
- Apply component specs
- Merge with custom classes
- Built on top of primitives (optional)

```vue
<script setup>
// Import from primitives for full control
//import { Button } from 'lantern-ui/primitives/button'

// Or from components for styled versions
//import { Button } from 'lantern-ui/components/button'
</script>

<template>
  <!-- Primitive: bring your own styles -->
  <Button @click="submit" disabled class="my-custom-styles">
    Submit
  </Button>

  <!-- Styled: uses theme automatically -->
  <Button color="primary" @click="submit" disabled>
    Submit
  </Button>
</template>
```

This architecture means you can:
- **Start fast** with styled components and sensible defaults
- **Go deep** by using primitives when you need pixel-perfect control
- **Mix both** approaches in the same project

### 2. Hierarchical Customization

Lantern resolves styling through a **three-level priority system**. Each level can override the previous one, giving you precise control at every stage:

<div style="padding: 1.5rem; border-left: 4px solid #3b82f6; background: #eff6ff; border-radius: 0.5rem; margin: 1rem 0;">

**Level 1: Global Theme** (Foundation)  
Define your design system's base values. colors, sizes, spacing. These apply everywhere.

↓

**Level 2: Component Specs** (Refinement)  
Override specific components that need different defaults or custom styling.

↓

**Level 3: Props** (Final Word)  
Instance-level customization for one-off variations.

</div>

:::warning Critical Concept
This hierarchy is **always enforced**. Props beat specs, specs beat theme. There are no exceptions. Understanding this flow is essential for effective customization.
:::

The beauty of this system is **progressive enhancement**: start with global defaults, refine per-component, tweak per-instance. You only customize what needs to be different.

### 3. Framework-Agnostic Class System

At its core, Lantern is a **class application system**. The theme maps semantic concepts to CSS class strings. Nothing more, nothing less.

The system is built around three concepts:

**Colors** → Semantic color schemes (primary, secondary, danger, etc.)  
**Variants** → Visual styles (filled, outline, ghost, etc.)  
**Keys** → Properties to style (background, foreground, hover, border, etc.)

Each key maps to a **string of CSS classes**. Any classes you want:

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

:::tip Framework-Agnostic
At its core, Lantern is a **class application system**. The theme maps semantic concepts to CSS class strings. Nothing more, nothing less. Lantern doesn't process CSS. It just applies the class strings you define. The actual styling is entirely up to you.
:::

## Architecture Overview

Let's dive deeper into how Lantern actually works. Understanding these concepts will unlock the full power of the system.

### The Theme System

The global theme serves as the foundation for all styling in your application. Think of it as your design system's source of truth.

It's structured in two distinct parts:

**1. Colors** .  The semantic styling system

```typescript
theme = {
  colors: {
    primary: {
      filled: {
        background: 'bg-blue-600',
        foreground: 'text-white',
        hover: 'hover:bg-blue-700',
        focus: 'focus:ring-2 focus:ring-blue-500'
      },
      outline: {
        background: 'bg-transparent',
        foreground: 'text-blue-600',
        border: 'border-2 border-blue-600',
        hover: 'hover:bg-blue-50'
      }
    }
  }
}
```

Colors work through a three-level hierarchy: **color → variant → keys**.

- **Color** (e.g., `primary`, `danger`) represents the semantic meaning
- **Variant** (e.g., `filled`, `outline`) defines the visual style
- **Keys** (e.g., `background`, `hover`) map to actual CSS classes

When you use `<Button color="primary" variant="outline">`, Lantern looks up `colors.primary.outline` and applies the classes from the keys that the button needs (defined in its spec).

**2. Props** .  Simple key-value mappings

```typescript
theme = {
  size: {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg'
  },
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    full: 'rounded-full'
  },
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }
}
```

Everything else (size, radius, spacing, shadow, etc.) are straightforward presets. When a component **receives a prop** like `size="lg"`, Lantern retrieves `theme.size.lg` and applies those classes.

:::warning Important Distinction
Theme props are only applied if the component **accepts that prop**. Adding `spacing` to your theme doesn't automatically make it available. You need to add `spacing?: string` to your component's props first.

```vue
<!-- This works if Button has a 'size' prop -->
<Button size="lg">Click me</Button>

<!-- This won't work unless Button explicitly accepts 'spacing' -->
<Button spacing="comfortable">Click me</Button>
```
:::

**You're not limited to size and radius**. Add whatever your design system needs: `spacing`, `elevation`, `typography`, etc. Just remember to add the corresponding props to components that should use them.

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

**The `apply` array** determines which styling keys are extracted from the color/variant combination. For example, `['hover', 'focus']` means only the `hover` and `focus` classes will be applied, even if the color variant defines additional keys like `border` or `shadow`. This gives precise control over which styles each component uses.

:::tip Auto-Applied Keys
`background` and `foreground` are always included automatically as they're considered essential base styles. No need to add them to the `apply` array.
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
Mix and match: use styled components where they fit, primitives where you need custom designs. Override at any level. global, component, or instance.

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