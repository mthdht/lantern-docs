# Component Specs

Component specs are the bridge between your generic theme and specific component needs. They define how each component consumes the theme, what defaults it uses, and how it can be customized.

## What is a Spec?

A spec is a configuration object that lives alongside each component. It controls:

- **Which styling keys** to extract from color variants
- **Base classes** that always apply
- **Default prop values** when not specified
- **Component-specific overrides** that take precedence over the global theme

Think of specs as **component-level theme configuration**.

## Spec Anatomy

Here's a complete spec with all available options:

```typescript
export const buttonSpec: ComponentSpec = {
    name: 'Button',
    
    apply: ['hover', 'focus'],
    
    class: 'inline-flex items-center gap-2 transition-colors',
    
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
                    background: 'bg-blue-500'
                }
            }
        },
        size: {
            lg: 'h-14 px-8 text-lg'
        }
    }
}
```

Let's break down each property.

## The `name` Property

A human-readable identifier for the component. Used for debugging and error messages:

```typescript
name: 'Button'
```

This is optional but recommended for better developer experience.

## The `apply` Array

Controls **which styling keys** are extracted from the color/variant combination.

<Demo title="Apply Array">
<template #preview>
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <Button color="primary" variant="filled">With Hover & Focus</Button>
  <Button color="primary" variant="outline">Outline Variant</Button>
</div>
</template>
<template #code>

```vue
<template>
  <Button color="primary" variant="filled">With Hover & Focus</Button>
  <Button color="primary" variant="outline">Outline Variant</Button>
</template>
```

</template>
<template #spec>

```typescript
export const buttonSpec: ComponentSpec = {
    apply: ['hover', 'focus'],
    // ↑ Only extract hover and focus from color variants
    // background and foreground are ALWAYS included automatically
    
    defaultProps: {
        color: 'primary',
        variant: 'filled'
    }
}
```

</template>
<template #theme>

```typescript
theme = {
    colors: {
        primary: {
            filled: {
                background: 'bg-blue-600',    // ✅ Always applied
                foreground: 'text-white',     // ✅ Always applied
                hover: 'hover:bg-blue-700',   // ✅ Applied (in apply array)
                focus: 'focus:ring-2 focus:ring-blue-500',  // ✅ Applied (in apply array)
                border: 'border-blue-600',    // ❌ NOT applied (not in apply array)
                shadow: 'shadow-lg'           // ❌ NOT applied (not in apply array)
            },
            outline: {
                background: 'bg-transparent',
                foreground: 'text-blue-600',
                border: 'border-2 border-blue-600',  // ❌ NOT applied
                hover: 'hover:bg-blue-50',    // ✅ Applied
                focus: 'focus:ring-2 focus:ring-blue-500'  // ✅ Applied
            }
        }
    }
}
```

</template>
</Demo>

**Key points:**

- `background` and `foreground` are **always included automatically**—they're considered essential
- Other keys must be **explicitly listed** in `apply` to be used
- Different components can use the same color but extract different keys

:::tip Why Control Keys?
A button might need `hover` and `focus`, but a card might only need `border`. The `apply` array lets each component select exactly what it needs from the shared color palette.
:::

### Conditional Apply

Apply keys **conditionally** based on the variant:

```typescript
apply: ['hover', 'focus', 'outline:border', 'soft:shadow']
```

This means:
- `hover` and `focus` apply to **all variants**
- `border` only applies when `variant="outline"`
- `shadow` only applies when `variant="soft"`

<Demo title="Conditional Apply">
<template #preview>
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <Button color="primary" variant="filled">Filled (no border)</Button>
  <Button color="primary" variant="outline">Outline (with border)</Button>
</div>
</template>
<template #code>

```vue
<template>
  <Button color="primary" variant="filled">Filled (no border)</Button>
  <Button color="primary" variant="outline">Outline (with border)</Button>
</template>
```

</template>
<template #spec>

```typescript
export const buttonSpec: ComponentSpec = {
    apply: ['hover', 'focus', 'outline:border'],
    // ↑ border only applied when variant="outline"
    
    defaultProps: {
        color: 'primary',
        variant: 'filled'
    }
}
```

</template>
<template #theme>

```typescript
theme = {
    colors: {
        primary: {
            filled: {
                background: 'bg-blue-600',
                foreground: 'text-white',
                hover: 'hover:bg-blue-700',
                focus: 'focus:ring-2 focus:ring-blue-500',
                border: 'border-blue-600'  // Defined but NOT used for filled
            },
            outline: {
                background: 'bg-transparent',
                foreground: 'text-blue-600',
                hover: 'hover:bg-blue-50',
                focus: 'focus:ring-2 focus:ring-blue-500',
                border: 'border-2 border-blue-600'  // ✅ Used for outline
            }
        }
    }
}
```

</template>
</Demo>

## The `class` Property

Defines **base classes** applied to every instance of the component, regardless of props or theme:

```typescript
class: 'inline-flex items-center gap-2 transition-colors'
```

Use this for:
- **Structural styles** (layout, display, positioning)
- **Unchanging styles** (transitions, cursor)
- **Typography basics** (font family, line height)

:::warning Keep it Generic
Base classes should work for **all variants and colors**. Avoid color-specific or variant-specific classes here—those belong in the theme or overrides.
:::

## The `defaultProps` Object

Sets **fallback values** when props aren't provided:

<Demo title="Default Props">
<template #preview>
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <Button>Uses Defaults</Button>
  <Button color="danger">Overrides Color</Button>
  <Button size="lg">Overrides Size</Button>
</div>
</template>
<template #code>

```vue
<template>
  <!-- Uses all defaults -->
  <Button>Uses Defaults</Button>
  
  <!-- Overrides just color -->
  <Button color="danger">Overrides Color</Button>
  
  <!-- Overrides just size -->
  <Button size="lg">Overrides Size</Button>
</template>
```

</template>
<template #spec>

```typescript
export const buttonSpec: ComponentSpec = {
    defaultProps: {
        color: 'primary',    // ← Default if not provided
        variant: 'filled',   // ← Default if not provided
        size: 'md',          // ← Default if not provided
        radius: 'md'         // ← Default if not provided
    }
}
```

</template>
<template #theme>

```typescript
theme = {
    colors: {
        primary: { filled: { /* ... */ } },
        danger: { filled: { /* ... */ } }
    },
    size: {
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg'
    },
    radius: {
        md: 'rounded-md'
    }
}
```

</template>
</Demo>

The hierarchy is: **Props > defaultProps > Theme**

If a user doesn't pass `color`, it falls back to `defaultProps.color`. If that's not defined, it could fall back to a global default (if configured in the plugin).

## The `override` Section

Allows **component-specific styling** that takes precedence over the global theme.

### Overriding Colors

When a component needs different colors than the global theme:

<Demo title="Color Override">
<template #preview>
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <Button color="primary">Custom Blue</Button>
  <Card color="primary">Default Blue</Card>
</div>
</template>
<template #code>

```vue
<template>
  <!-- Button uses overridden blue-500 -->
  <Button color="primary">Custom Blue</Button>
  
  <!-- Card uses global blue-600 -->
  <Card color="primary">Default Blue</Card>
</template>
```

</template>
<template #spec>

```typescript
// buttonSpec.ts
export const buttonSpec: ComponentSpec = {
    defaultProps: {
        color: 'primary',
        variant: 'filled'
    },
    override: {
        colors: {
            primary: {
                filled: {
                    background: 'bg-blue-500'  // ← Different shade for buttons
                }
            }
        }
    }
}

// cardSpec.ts  
export const cardSpec: ComponentSpec = {
    defaultProps: {
        color: 'primary',
        variant: 'filled'
    }
    // No override - uses global theme
}
```

</template>
<template #theme>

```typescript
// Global theme
theme = {
    colors: {
        primary: {
            filled: {
                background: 'bg-blue-600',  // ← Default for all components
                foreground: 'text-white',
                hover: 'hover:bg-blue-700'
            }
        }
    }
}
```

</template>
</Demo>

The override does a **deep merge** with the global theme. You only need to specify what changes:

```typescript
override: {
    colors: {
        primary: {
            filled: {
                background: 'bg-blue-500'  // Only override background
                // foreground, hover, etc. come from global theme
            }
        }
    }
}
```

### Overriding Props

When a component needs different size/radius/etc. than the global theme:

```typescript
override: {
    size: {
        lg: 'h-14 px-8 text-lg'  // Custom large size for this component
        // sm, md from global theme
    },
    radius: {
        full: 'rounded-2xl'  // Custom "full" radius for this component
    }
}
```

<Demo title="Props Override">
<template #preview>
<div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
  <Button size="lg">Button Large</Button>
  <Badge size="lg">Badge Large</Badge>
</div>
</template>
<template #code>

```vue
<template>
  <!-- Button uses custom h-14 -->
  <Button size="lg">Button Large</Button>
  
  <!-- Badge uses global h-12 -->
  <Badge size="lg">Badge Large</Badge>
</template>
```

</template>
<template #spec>

```typescript
// buttonSpec.ts
export const buttonSpec: ComponentSpec = {
    override: {
        size: {
            lg: 'h-14 px-8 text-lg'  // ← Custom for buttons
        }
    }
}

// badgeSpec.ts
export const badgeSpec: ComponentSpec = {
    // No override - uses global theme
}
```

</template>
<template #theme>

```typescript
// Global theme
theme = {
    size: {
        lg: 'h-12 px-6 text-lg'  // ← Default for all components
    }
}
```

</template>
</Demo>

## Creating Component Specs

### Step 1: Identify Component Needs

Ask yourself:
- **Which keys** does this component need? (hover, focus, border, shadow?)
- **What are sensible defaults?** (color, variant, size?)
- **Does it need custom styling** different from the global theme?

### Step 2: Write the Spec

```typescript
// components/MyComponent/myComponentSpec.ts
import type { ComponentSpec } from '@pharos-labo/lantern/types'

export const myComponentSpec: ComponentSpec = {
    name: 'MyComponent',
    
    // Extract only what you need
    apply: ['hover', 'border'],
    
    // Base structural classes
    class: 'flex items-center gap-3 p-4',
    
    // Sensible defaults
    defaultProps: {
        color: 'default',
        variant: 'outline',
        radius: 'md'
    },
    
    // Component-specific tweaks (if needed)
    override: {
        colors: {
            primary: {
                outline: {
                    border: 'border-4 border-blue-600'  // Thicker border
                }
            }
        }
    }
}
```

### Step 3: Use in Component

```vue
<script setup lang="ts">
import MyComponentPrimitive from '../../primitives/mycomponent/MyComponent.vue'
import { useComponentClasses } from '../../composables/useComponentClasses'
import { myComponentSpec } from './myComponentSpec'
import type { BaseProps } from '../../types'

interface MyComponentProps extends BaseProps {
    size?: string;
    radius?: string;
}

const props = defineProps<MyComponentProps>()
const classes = useComponentClasses(props, myComponentSpec)
</script>

<template>
    <MyComponentPrimitive :class="classes">
        <slot />
    </MyComponentPrimitive>
</template>
```

## Real-World Examples

### Button Spec

Buttons need hover, focus, and should be primary by default:

```typescript
export const buttonSpec: ComponentSpec = {
    name: 'Button',
    apply: ['hover', 'focus'],
    class: 'inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    defaultProps: {
        color: 'primary',
        variant: 'filled',
        size: 'md',
        radius: 'md'
    }
}
```

### Alert Spec

Alerts need borders and are default/soft by default:

```typescript
export const alertSpec: ComponentSpec = {
    name: 'Alert',
    apply: ['border'],
    class: 'relative flex gap-3 p-4 rounded-lg',
    defaultProps: {
        color: 'default',
        variant: 'soft',
        radius: 'lg'
    }
}
```

### Card Spec

Cards need borders and shadows, neutral by default:

```typescript
export const cardSpec: ComponentSpec = {
    name: 'Card',
    apply: ['border', 'shadow'],
    class: 'p-6 rounded-lg',
    defaultProps: {
        color: 'default',
        variant: 'outline',
        radius: 'lg'
    },
    override: {
        colors: {
            default: {
                outline: {
                    border: 'border border-gray-200',
                    shadow: 'shadow-sm'
                }
            }
        }
    }
}
```

### Avatar Spec

Avatars don't need color keys, just sizing:

```typescript
export const avatarSpec: ComponentSpec = {
    name: 'Avatar',
    apply: [],  // No color keys needed
    class: 'relative inline-flex items-center justify-center overflow-hidden',
    defaultProps: {
        color: 'default',
        variant: 'soft',
        size: 'md',
        radius: 'full'
    }
}
```

## Best Practices

### 1. Minimal Overrides

Only override when **truly necessary**. The global theme should handle most cases:

```typescript
// ✅ Good - override only what's needed
override: {
    colors: {
        primary: {
            filled: {
                background: 'bg-blue-500'  // Just this one property
            }
        }
    }
}

// ❌ Bad - overriding everything defeats the purpose
override: {
    colors: {
        primary: {
            filled: {
                background: 'bg-blue-500',
                foreground: 'text-white',
                hover: 'hover:bg-blue-600',
                focus: 'focus:ring-2 focus:ring-blue-400'
            }
        }
    }
}
```

If you're overriding many things, consider adjusting the global theme instead.

### 2. Appropriate Defaults

Choose defaults that make sense for **most use cases**:

```typescript
// ✅ Good - buttons are often primary
defaultProps: {
    color: 'primary',
    variant: 'filled'
}

// ❌ Bad - most buttons aren't destructive
defaultProps: {
    color: 'danger',
    variant: 'outline'
}
```

### 3. Apply Only What's Needed

Don't extract keys the component doesn't use:

```typescript
// ✅ Good - card doesn't need hover states
apply: ['border', 'shadow']

// ❌ Bad - extracting unused keys
apply: ['hover', 'focus', 'border', 'shadow', 'glow', 'pulse']
```

Unused keys bloat the final class string unnecessarily.

### 4. Document Custom Keys

If using conditional apply or custom keys, add comments:

```typescript
export const buttonSpec: ComponentSpec = {
    // Apply border only for outline variant, shadow only for elevated variant
    apply: ['hover', 'focus', 'outline:border', 'elevated:shadow'],
    
    defaultProps: {
        color: 'primary',
        variant: 'filled'
    }
}
```

## What's Next?

You now understand how component specs work! Continue learning:

- **[Customization Guide](./customization)** - Master the full priority hierarchy
- **[Theme System](./theme-system)** - Understand how themes feed into specs
- **[Components](../components/button)** - See specs in action

---

:::tip Questions?
Join our [GitHub Discussions](https://github.com/pharos-lab/lantern/discussions) for help with component specs.
:::