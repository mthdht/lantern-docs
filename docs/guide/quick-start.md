# Quick Start

Build your first Lantern UI component in under 5 minutes. This guide will walk you through creating a simple button, customizing it, and composing multiple components together.

:::tip Prerequisites
This guide assumes you've already [installed Lantern](./installation) and set up the plugin. If not, complete the installation first.
:::

## Your First Component

Let's start with the simplest possible example—a button.

Create a new Vue component or add this to your existing one:

<Demo title="Basic Button">
<template #preview>
<Button>Click me</Button>
</template>
<template #code>

```vue
<script setup>
import { Button } from '@pharos-labo/lantern/components/button'
</script>

<template>
  <Button>Click me</Button>
</template>
```

</template>
</Demo>

That's it! You have a fully functional button with:
- ✅ Default styling from your theme
- ✅ Proper accessibility attributes
- ✅ Hover and focus states
- ✅ Keyboard support

The button automatically uses the defaults from its component spec. No configuration needed for basic usage.

## Customizing with Props

Now let's make it more interesting. Lantern components accept props that map to your theme configuration:

<Demo title="Colors & variants">
  <template #preview>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <Button color="primary">Primary</Button>
      <Button color="danger">Danger</Button>
      <Button color="success">Success</Button>
      <Button color="primary" variant="outline">Primary Outline</Button>
    <Button color="success" variant="ghost">Success Ghost</Button>
    </div>
  </template>

  <template #code>

  ```vue
  <template>
    <Button color="primary">Primary</Button>
    <Button color="danger">Danger</Button>
    <Button color="success">Success</Button>
    <Button color="primary" variant="outline">Primary Outline</Button>
    <Button color="success" variant="ghost">Success Ghost</Button>
  </template>
  ```
  </template>

  <template #spec>

  ```typescript
  // buttonSpec.ts
  export const buttonSpec: ComponentSpec = {
      apply: ['hover', 'focus'],
      class: 'inline-flex items-center gap-2 transition-colors',
      defaultProps: {
          color: 'primary', 
          variant: 'filled',
          size: 'md',
          radius: 'md'
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
                  focus: 'focus:ring-2 focus:ring-blue-500'
              }
          },
          danger: {
              filled: {
                  background: 'bg-red-600',
                  foreground: 'text-white',
                  hover: 'hover:bg-red-700',
                  focus: 'focus:ring-2 focus:ring-red-500'
              }
          },
          success: {
              filled: {
                  background: 'bg-green-600',
                  foreground: 'text-white',
                  hover: 'hover:bg-green-700',
                  focus: 'focus:ring-2 focus:ring-green-500'
              }
          }
      }
  }
  ```

  </template>
</Demo>

**Understanding the props:**

- **`color`** - Maps to your theme's color schemes (`primary`, `danger`, `success`, etc.)
- **`variant`** - Selects the visual style (`filled`, `outline`, `ghost`, etc.)
- **`size`** - Applies size presets from your theme (`sm`, `md`, `lg`, etc.)
- **`radius`** - Controls border radius (`none`, `sm`, `md`, `lg`, `full`)

:::info Theme-Driven Props
The available values for these props depend entirely on **your theme configuration**. If you define a custom color called `brand` in your theme, you can use `color="brand"`. If you add a size called `xl`, you can use `size="xl"`.

Lantern doesn't hardcode these values, it's all driven by your theme.

To understand how props connect to the theme, see the [Theme System](./theme-system)
 documentation.
:::

## Component States

Buttons support common interactive states:

<Demo title="Component states">
  <template #preview><!-- Disabled --> 
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <Button disabled>Disabled</Button>
      <!-- Loading -->
      <Button :loading="true">Loading…</Button>
    </div>
  </template>

  <template #code>

  ```vue
  <script setup>
  import { ref } from 'vue'
  import { Button } from '@pharos-labo/lantern/components/button'

  const isLoading = ref(false)

  const handleClick = () => {
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 2000)
  }
  </script>

  <template>
    <div class="flex gap-4 p-8">
      <!-- Disabled state -->
      <Button disabled>Disabled</Button>
      
      <!-- Loading state -->
      <Button :loading="isLoading" @click="handleClick">
        {{ isLoading ? 'Loading...' : 'Click me' }}
      </Button>

      <!-- Different button types -->
      <Button type="button">Button</Button>
      <Button type="submit">Submit</Button>
      <Button type="reset">Reset</Button>
    </div>
  </template>
  ```

  </template>

  <template #spec>

  ```ts
  // buttonSpec.ts
  export const buttonSpec: ComponentSpec = {
    apply: ['hover', 'focus', 'disabled', 'loading'],
    class: 'inline-flex items-center gap-2 transition-all',
    
    defaultProps: {
      color: 'primary',
      variant: 'filled',
      disabled: false,
      loading: false
    },
    disabled: {
      class: 'opacity-50 pointer-events-none'
    },
    loading: {
      class: 'pointer-events-none opacity-70 cursor-wait'
    }
  }
  ```

  </template>

  <template #theme>

  ```ts
  // theme.ts
  theme = {
    states: {
      disabled: {
        opacity: 'opacity-50',
        cursor: 'cursor-not-allowed'
      },
      loading: {
        spinner: 'animate-spin',
        opacity: 'opacity-70'
      }
    }
  }
  ```

  </template>
</Demo>

When `disabled` or `loading` is true, the button automatically:
- Becomes non-interactive
- Shows visual feedback (reduced opacity)
- Adds proper `aria-disabled` or `aria-busy` attributes
- Prevents click events

## Working with Primitives

When you need complete control over styling, use primitives instead of styled components:

<Demo title="Working with primitives">
  <template #preview>
      <button class="my-completely-custom-button" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: transform 0.2s; ">
        Primitive Button
      </button>
  </template>

  <template #code>

  ```vue
  <script setup>
  import { Button } from '@pharos-labo/lantern/primitives/button'

  const handleClick = () => {
    console.log('Button clicked!')
  }
  </script>

  <template>
    <Button 
      @click="handleClick"
      class="my-completely-custom-button"
    >
      Primitive Button
    </Button>
  </template>

  <style scoped>
  .my-completely-custom-button {
    /* Full control - no theme classes applied */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .my-completely-custom-button:hover {
    transform: scale(1.05);
  }

  .my-completely-custom-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  ```

  </template>

  <template #spec>
    <div>
      <p>Primitives do not use a component spec. They provide only:</p>
      <ul>
        <li>✅ ARIA accessibility</li>
        <li>✅ State handling (disabled, loading)</li>
        <li>✅ Event handling</li>
        <li>⚠️ No theme integration</li>
      </ul>
    </div>
  </template> 

  <template #theme>
  <div>
    <p>Primitives ignore the theme entirely.</p>
    <p>You are responsible for <strong>100% of the styling</strong>.</p>
  </div>
  </template>

</Demo>

**Primitives still provide:**
- ✅ Accessibility (ARIA attributes)
- ✅ State management (disabled, loading)
- ✅ Event handling
- ✅ Keyboard support

But **zero theme integration**. You're responsible for all styling.

:::warning When to Use Primitives
Use primitives when:
- You need pixel-perfect custom design that doesn't fit your theme
- You're building a one-off component with unique styling
- You want to use a different CSS approach (CSS-in-JS, Emotion, etc.)

For most cases, styled components with the `class` prop offer enough flexibility without losing theme integration.
:::

## Handling Events

Lantern components emit standard Vue events. No special event handling required:

<Demo title="Handling Events">
  <template #preview>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <Button @click="() => alert('Button clicked!')">
        Click me
      </Button>
      <Alert
        color="info"
        variant="soft"
        @dismiss="() => alert('Alert dismissed')">
        <p style="margin: 0;">This alert can be dismissed</p>
        <AlertClose />
      </Alert>
    </div>
  </template>
  <template #code>

  ```vue
  <script setup>
  import { Button } from '@pharos-labo/lantern/components/button'
  import { Alert, AlertClose } from '@pharos-labo/lantern/components/alert'
  const handleClick = (event) => {
  console.log('Button clicked!', event)
  }
  const handleDismiss = () => {
  console.log('Alert dismissed')
  }
  </script>
  <template>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <!-- Button events -->
      <Button 
        @click="handleClick"
        @mouseenter="() => console.log('Mouse entered')"
        @focus="() => console.log('Button focused')"
      >
        Interactive Button
      </Button>
  <!-- Alert events -->
  <Alert 
    color="info" 
    variant="soft"
    @dismiss="handleDismiss"
  >
    <p>This alert can be dismissed</p>
    <AlertClose />
  </Alert>
    </div>
  </template>
  ```

  </template>
  <template #spec>

  ```typescript
  // buttonSpec.ts
  export const buttonSpec: ComponentSpec = {
      apply: ['hover', 'focus'],
      class: 'inline-flex items-center gap-2 transition-colors cursor-pointer',
      defaultProps: {
          color: 'primary',
          variant: 'filled'
      }
  }
  // alertSpec.ts
  export const alertSpec: ComponentSpec = {
      apply: ['border'],
      class: 'relative flex gap-3 p-4 rounded-lg',
      defaultProps: {
        color: 'slate',
        variant: 'soft'
      }
  }
  ```

  </template>

  <template #theme>

  ```typescript
  // theme.ts
  theme = {
    colors: {
      info: {
        soft: {
          background: 'bg-blue-50',
          foreground: 'text-blue-900',
          border: 'border-blue-200'
        }
        }
    }
  }
  ```

  </template>
</Demo>

## Next Steps

You now know the basics of working with Lantern! Here's where to go next:

### Learn the System

- **[Theme System](./theme-system)** - Understand how colors, variants, and props work
- **[Component Specs](./component-specs)** - Learn to customize component defaults
- **[Customization Guide](./customization)** - Master the priority hierarchy

### Explore Components

- **[Button](../components/button)** - Detailed button documentation
- **[Alert](../components/alert)** - Notifications and messages
- **[Card](../components/card)** - Container component
- **[Avatar](../components/avatar)** - User profile images
- **[Badge](../components/badge)** - Labels and tags

### See Examples

- **[Playground](../examples/playground)** - Interactive component demos
- **[Templates](../examples/templates)** - Real-world usage examples

---

:::tip Questions?
Join our [GitHub Discussions](https://github.com/pharos-lab/lantern/discussions) or [Discord community](https://discord.gg/lantern) to get help from the community.
:::