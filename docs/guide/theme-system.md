# Theme System

The theme is the heart of Lantern UI. It defines your design system's visual language and makes it available to all components through a unified, framework-agnostic class application system.

## Understanding the Theme Structure

Lantern's theme is divided into two distinct parts, each serving a different purpose:

### 1. Colors - The Semantic System

The `colors` section defines **semantic color schemes** with their visual variants and styling properties:

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

This follows a **three-level hierarchy**: `color → variant → keys`

- **Color** (`primary`, `danger`, `success`) = Semantic meaning
- **Variant** (`filled`, `outline`, `ghost`) = Visual style
- **Keys** (`background`, `foreground`, `hover`) = Specific styling properties

When a component uses `color="primary" variant="outline"`, Lantern looks up `colors.primary.outline` and applies the classes from the keys that the component needs.

:::tip Framework Agnostic
Keys map to **strings of CSS classes**—any classes you want. Use Tailwind, CSS Modules, BEM, your own custom classes, or mix them all. Lantern doesn't process CSS, it just applies the strings.
:::

### 2. Props - Simple Presets

Everything else is a straightforward key-value mapping:

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
  }
}
```

When a component receives `size="lg"`, it simply retrieves `theme.size.lg` and applies those classes.

**You can add any prop you need**: `spacing`, `shadow`, `elevation`, `typography`, etc. Lantern doesn't impose limits.

:::warning Component Props Required
Theme props are only applied if the component **accepts that prop**. Adding `spacing` to your theme doesn't automatically make it available—you need to add `spacing?: string` to component props first.

See [Component Specs](./component-specs) to learn how components consume the theme.
:::

## The Color System Deep Dive

Let's understand how the color system works in detail.

### Color Anatomy

Each color in your theme follows this structure:

<Demo title="Color Structure">
<template #preview>
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <Button color="primary" variant="filled">Filled</Button>
  <Button color="primary" variant="outline">Outline</Button>
  <Button color="primary" variant="ghost">Ghost</Button>
</div>
</template>
<template #code>

```vue
<template>
  <Button color="primary" variant="filled">Filled</Button>
  <Button color="primary" variant="outline">Outline</Button>
  <Button color="primary" variant="ghost">Ghost</Button>
</template>
```

</template>
<template #spec>

```typescript
// buttonSpec.ts
export const buttonSpec: ComponentSpec = {
    apply: ['hover', 'focus'],
    // ↑ Only these keys are extracted from the variant
    
    class: 'inline-flex items-center gap-2 transition-colors',
    defaultProps: {
        color: 'primary',
        variant: 'filled'
    }
}
```

</template>
<template #theme>

```typescript
// theme.ts
theme = {
    colors: {
        primary: {
            filled: {
                background: 'bg-blue-600',
                foreground: 'text-white',
                hover: 'hover:bg-blue-700',
                focus: 'focus:ring-2 focus:ring-blue-500',
                border: 'border-blue-600'  // Not used by button
            },
            outline: {
                background: 'bg-transparent',
                foreground: 'text-blue-600',
                border: 'border-2 border-blue-600',
                hover: 'hover:bg-blue-50',
                focus: 'focus:ring-2 focus:ring-blue-500'
            },
            ghost: {
                background: 'bg-transparent',
                foreground: 'text-blue-600',
                hover: 'hover:bg-blue-50',
                focus: 'focus:ring-2 focus:ring-blue-500'
            }
        }
    }
}
```

</template>
</Demo>

**Key takeaways:**

1. **`background` and `foreground` are always applied automatically**—they're considered essential base styles
2. Other keys are applied **only if listed in the component's `apply` array**
3. Different variants can have different keys—`outline` needs `border`, `ghost` doesn't
4. You define which classes apply to each key—Lantern just applies the strings

### Defining Custom Keys

You're not limited to predefined keys. Define whatever makes sense for your design:

```typescript
theme = {
    colors: {
        brand: {
            gradient: {
                background: 'bg-gradient-to-r from-purple-600 to-pink-600',
                foreground: 'text-white',
                hover: 'hover:from-purple-700 hover:to-pink-700',
                shadow: 'shadow-lg shadow-purple-500/50',
                glow: 'ring-4 ring-purple-300/50'
            },
            neon: {
                background: 'bg-black',
                foreground: 'text-cyan-400',
                border: 'border-2 border-cyan-400',
                glow: 'shadow-[0_0_20px_rgba(34,211,238,0.6)]',
                pulse: 'animate-pulse'
            }
        }
    }
}
```

Then in your component spec, specify which keys to use:

```typescript
buttonSpec = {
    apply: ['hover', 'shadow', 'glow'],  // Custom keys!
    // ...
}
```

:::info Advanced: Conditional Keys
You can apply keys conditionally per variant:

```typescript
apply: ['hover', 'focus', 'outline:border', 'gradient:shadow']
// border only when variant="outline"
// shadow only when variant="gradient"
```

This gives pixel-perfect control over which styles apply to which variants.
:::

### Color Variants Strategy

Here's a common pattern for organizing variants:

```typescript
theme = {
    colors: {
        primary: {
            // Solid background
            filled: {
                background: 'bg-blue-600',
                foreground: 'text-white',
                hover: 'hover:bg-blue-700'
            },
            
            // Transparent with border
            outline: {
                background: 'bg-transparent',
                foreground: 'text-blue-600',
                border: 'border-2 border-blue-600',
                hover: 'hover:bg-blue-50'
            },
            
            // Transparent, no border
            ghost: {
                background: 'bg-transparent',
                foreground: 'text-blue-600',
                hover: 'hover:bg-blue-50'
            },
            
            // Light background
            soft: {
                background: 'bg-blue-50',
                foreground: 'text-blue-700',
                hover: 'hover:bg-blue-100'
            }
        }
    }
}
```

Apply this pattern consistently across all colors for a cohesive design system.

## Props System Deep Dive

Props are simpler than colors—they're just preset values you want to reuse.

### Common Props

Here are props most design systems need:

<Demo title="Size Presets">
<template #preview>
<div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
  <Button size="xl">Extra Large</Button>
</div>
</template>
<template #code>

```vue
<template>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
  <Button size="xl">Extra Large</Button>
</template>
```

</template>
<template #spec>

```typescript
// buttonSpec.ts
export const buttonSpec: ComponentSpec = {
    defaultProps: {
        size: 'md'  // Default to medium
    }
}
```

</template>
<template #theme>

```typescript
// theme.ts
theme = {
    size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl'  // Custom size
    }
}
```

</template>
</Demo>

```typescript
theme = {
    // Sizing
    size: {
        xs: 'h-6 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl'
    },
    
    // Border radius
    radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
    },
    
    // Shadows
    shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
    },
    
    // Spacing (if you have spacing-aware components)
    spacing: {
        tight: 'gap-2',
        normal: 'gap-4',
        relaxed: 'gap-6',
        loose: 'gap-8'
    }
}
```

### Adding Custom Props

Need something unique to your design system? Just add it:

```typescript
theme = {
    // Elevation system
    elevation: {
        flat: 'shadow-none',
        raised: 'shadow-md hover:shadow-lg transition-shadow',
        floating: 'shadow-xl hover:shadow-2xl transition-shadow'
    },
    
    // Animation speeds
    speed: {
        instant: 'transition-none',
        fast: 'transition-all duration-150',
        normal: 'transition-all duration-300',
        slow: 'transition-all duration-500'
    },
    
    // Typography weights
    weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold'
    }
}
```

Then use them in components:

```vue
<Button elevation="floating" speed="fast" weight="bold">
  Elevated Button
</Button>
```

:::danger Don't Forget Component Props
Remember: adding props to the theme doesn't automatically make them available to components. You must add the corresponding prop to the component's TypeScript interface:

```typescript
interface ButtonProps extends BaseProps {
    elevation?: string;  // ← Add this
    speed?: string;      // ← And this
    weight?: string;     // ← And this
}
```
:::

## Creating Your Theme

Let's build a complete theme from scratch.

### Step 1: Define Your Color Palette

Start with semantic colors and their variants:

```typescript
// theme.ts
export const myTheme: Theme = {
    colors: {
        // Neutral
        default: {
            filled: {
                background: 'bg-gray-100',
                foreground: 'text-gray-900',
                hover: 'hover:bg-gray-200',
                focus: 'focus:ring-2 focus:ring-gray-300'
            },
            outline: {
                background: 'bg-transparent',
                foreground: 'text-gray-700',
                border: 'border-2 border-gray-300',
                hover: 'hover:bg-gray-50',
                focus: 'focus:ring-2 focus:ring-gray-300'
            }
        },
        
        // Brand color
        brand: {
            filled: {
                background: 'bg-indigo-600',
                foreground: 'text-white',
                hover: 'hover:bg-indigo-700',
                focus: 'focus:ring-2 focus:ring-indigo-500'
            },
            outline: {
                background: 'bg-transparent',
                foreground: 'text-indigo-600',
                border: 'border-2 border-indigo-600',
                hover: 'hover:bg-indigo-50',
                focus: 'focus:ring-2 focus:ring-indigo-500'
            }
        },
        
        // Feedback colors
        success: {
            filled: {
                background: 'bg-green-600',
                foreground: 'text-white',
                hover: 'hover:bg-green-700',
                focus: 'focus:ring-2 focus:ring-green-500'
            },
            soft: {
                background: 'bg-green-50',
                foreground: 'text-green-800',
                border: 'border-green-200',
                hover: 'hover:bg-green-100'
            }
        },
        danger: {
            filled: {
                background: 'bg-red-600',
                foreground: 'text-white',
                hover: 'hover:bg-red-700',
                focus: 'focus:ring-2 focus:ring-red-500'
            },
            soft: {
                background: 'bg-red-50',
                foreground: 'text-red-800',
                border: 'border-red-200',
                hover: 'hover:bg-red-100'
            }
        }
    },
    
    // Props...
}
```

### Step 2: Define Your Props

Add size, radius, and other reusable presets:

```typescript
export const myTheme: Theme = {
    colors: { /* ... from above */ },
    
    size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg'
    },
    
    radius: {
        none: 'rounded-none',
        sm: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
    },
    
    shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
    }
}
```

### Step 3: Use Your Theme

Register it with the Lantern plugin:

```typescript
// main.ts
import { createApp } from 'vue'
import { lantern } from '@pharos-labo/lantern/plugin'
import { myTheme } from './theme'
import App from './App.vue'

createApp(App)
    .use(lantern, {
        theme: myTheme
    })
    .mount('#app')
```

Now all components use your custom theme!

## Extending Themes

Don't want to start from scratch? Extend any existing theme using the `createTheme` helper.

### Using createTheme

The `createTheme` helper performs a **deep merge**, ensuring nested properties are combined correctly:

```typescript
import { createTheme, defaultTheme } from '@pharos-labo/lantern/theme'
import type { Theme } from '@pharos-labo/lantern/types'

export const myTheme = createTheme(defaultTheme, {
    // Add new colors
    colors: {
        brand: {
            filled: {
                background: 'bg-purple-600',
                foreground: 'text-white',
                hover: 'hover:bg-purple-700',
                focus: 'focus:ring-2 focus:ring-purple-500'
            },
            outline: {
                background: 'bg-transparent',
                foreground: 'text-purple-600',
                border: 'border-2 border-purple-600',
                hover: 'hover:bg-purple-50'
            }
        }
    },
    
    // Add new sizes
    size: {
        xs: 'h-6 px-2 text-xs',
        xl: 'h-14 px-8 text-xl'
    },
    
    // Add custom props
    elevation: {
        flat: 'shadow-none',
        raised: 'shadow-md',
        floating: 'shadow-xl'
    }
})
```

This preserves all default colors and sizes while adding your new ones.

:::warning Why createTheme?
JavaScript's spread operator (`...`) only does **shallow merge**. For nested structures like `colors.primary.filled`, you need deep merge to avoid losing properties:

```typescript
// ❌ Bad - shallow merge loses existing colors
const myTheme = {
    ...defaultTheme,
    colors: {
        brand: { /* ... */ }  // defaultTheme.colors is completely replaced!
    }
}

// ✅ Good - deep merge preserves everything
const myTheme = createTheme(defaultTheme, {
    colors: {
        brand: { /* ... */ }  // Adds to existing colors
    }
})
```
:::

### Extending Any Theme

`createTheme` works with **any theme**, not just the default. This is useful when:
- A community member shares a theme you want to customize
- You're building theme variants for different contexts
- You want to create theme presets based on a base theme

```typescript
import { createTheme } from '@pharos-labo/lantern/theme'
import { communityTheme } from 'awesome-lantern-theme'

// Extend someone else's theme
export const myCustomTheme = createTheme(communityTheme, {
    colors: {
        // Tweak their primary color
        primary: {
            filled: {
                background: 'bg-indigo-600',  // Override just this property
                // Other properties from communityTheme.colors.primary.filled are preserved
            }
        }
    }
})
```

Or create theme variants:

```typescript
import { baseTheme } from './themes/base'

// Dark mode variant
export const darkTheme = createTheme(baseTheme, {
    colors: {
        default: {
            filled: {
                background: 'bg-gray-800',
                foreground: 'text-gray-100'
            }
        }
    }
})

// High contrast variant
export const highContrastTheme = createTheme(baseTheme, {
    colors: {
        primary: {
            filled: {
                background: 'bg-black',
                foreground: 'text-white',
                border: 'border-4 border-white'
            }
        }
    }
})
```

## Best Practices

### 1. Consistency is Key

Apply the same variant names across all colors for a predictable, cohesive design system:

```typescript
// ✅ Good - consistent variants
colors: {
    primary: {
        filled: { /* ... */ },
        outline: { /* ... */ },
        soft: { /* ... */ }
    },
    danger: {
        filled: { /* ... */ },
        outline: { /* ... */ },
        soft: { /* ... */ }
    }
}

// ❌ Bad - inconsistent variants
colors: {
    primary: {
        solid: { /* ... */ },
        bordered: { /* ... */ }
    },
    danger: {
        filled: { /* ... */ },
        outline: { /* ... */ }
    }
}
```

Users should be able to use any `color` with any `variant` and get consistent results.

### 2. Naming Conventions

**For colors**, choose what fits your design system:
- **Semantic names** (`primary`, `danger`, `success`) work well for component libraries
- **Color names** (`blue`, `red`, `green`) work well for design systems with fixed palettes
- **Both** can coexist—have semantic colors for components and color names for utilities

```typescript
colors: {
    // Semantic (for components)
    primary: { /* ... */ },
    danger: { /* ... */ },
    
    // Named (for flexibility)
    blue: { /* ... */ },
    red: { /* ... */ }
}
```

**For props**, use clear, recognizable names:
- Size: `xs`, `sm`, `md`, `lg`, `xl` OR `small`, `medium`, `large`
- Radius: `none`, `sm`, `md`, `lg`, `full` OR `square`, `rounded`, `circular`
- Both approaches are valid—choose what's clearer for your team

:::tip Consistency Over Convention
What matters most is **consistency within your system**, not following any particular naming convention. If your team prefers `tiny/small/medium/large/huge` over `xs/sm/md/lg/xl`, that's perfectly fine!
:::

### 3. Document Custom Keys

If you add custom keys beyond the standard ones, document what they're for:

```typescript
theme = {
    colors: {
        neon: {
            electric: {
                background: 'bg-black',
                foreground: 'text-cyan-400',
                border: 'border-2 border-cyan-400',
                glow: 'shadow-[0_0_20px_rgba(34,211,238,0.6)]',  // Custom: neon glow effect
                pulse: 'animate-pulse'  // Custom: pulsing animation
            }
        }
    }
}

// Document usage in component spec
buttonSpec = {
    apply: ['hover', 'glow', 'pulse'],
    // Note: 'glow' adds neon shadow effect, 'pulse' adds animation
}
```

This helps other developers (and future you) understand special keys.

### 4. Keep Props Cohesive

Make sure preset values follow a logical, predictable scale:

```typescript
// ✅ Good - logical progression
size: {
    xs: 'h-6 px-2 text-xs',
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
    xl: 'h-14 px-8 text-xl'
}

// ❌ Bad - inconsistent jumps
size: {
    tiny: 'h-4 px-1 text-xs',
    medium: 'h-10 px-4 text-base',
    huge: 'h-20 px-12 text-3xl'  // Way too big compared to medium
}
```

Users should be able to predict what `lg` looks like if they've seen `md` and `sm`.

## What's Next?

You now understand Lantern's theme system! Continue learning:

- **[Component Specs](./component-specs)** - Learn how components consume the theme
- **[Customization Guide](./customization)** - Master the priority hierarchy
- **[Components](../components/button)** - See the theme in action

---

:::tip Questions?
Join our [GitHub Discussions](https://github.com/pharos-lab/lantern/discussions) for help with theme customization.
:::