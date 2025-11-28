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

<Demo title="Colors">
<template #preview>
<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <Button color="primary">Primary</Button>
  <Button color="danger">Danger</Button>
  <Button color="success">Success</Button>
</div>
</template>
<template #code>

```vue
<template>
  <Button color="primary">Primary</Button>
  <Button color="danger">Danger</Button>
  <Button color="success">Success</Button>
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
        color: 'primary',  // ← Default color
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

<Demo title="Variants">
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
</Demo>

<Demo title="Sizes">
<template #preview>
<div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</div>
</template>
<template #code>

```vue
<template>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</template>
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

Lantern doesn't hardcode these values—it's all driven by your theme.
:::

## Component States

Buttons support common interactive states:

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
  <div style="display: flex; gap: 1rem; padding: 2rem;">
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

When `disabled` or `loading` is true, the button automatically:
- Becomes non-interactive
- Shows visual feedback (reduced opacity)
- Adds proper `aria-disabled` or `aria-busy` attributes
- Prevents click events

## Composing Components

Real applications need more than buttons. Let's compose multiple components together:

```vue
<script setup>
import { ref } from 'vue'
import { Button } from '@pharos-labo/lantern/components/button'
import { Alert, AlertClose } from '@pharos-labo/lantern/components/alert'
import { Card } from '@pharos-labo/lantern/components/card'

const showAlert = ref(false)
</script>

<template>
  <div style="max-width: 600px; margin: 2rem auto; display: flex; flex-direction: column; gap: 1.5rem;">
    <!-- Card containing a form -->
    <Card color="default" variant="outline">
      <h2 style="margin: 0 0 1rem 0;">Sign Up</h2>
      
      <form @submit.prevent="showAlert = true" style="display: flex; flex-direction: column; gap: 1rem;">
        <input 
          type="email" 
          placeholder="Email" 
          style="padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.375rem;"
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          style="padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.375rem;"
        />
        
        <Button type="submit" color="primary" variant="filled" size="lg">
          Create Account
        </Button>
      </form>
    </Card>
    
    <!-- Success alert (shown after form submission) -->
    <Alert 
      v-if="showAlert" 
      color="success" 
      variant="soft"
      @dismiss="showAlert = false"
    >
      <p style="margin: 0;">Account created successfully! Check your email to verify.</p>
      <AlertClose />
    </Alert>
  </div>
</template>
```

**What's happening here:**

1. **Card** provides a container with themed styling
2. **Button** submits the form with appropriate visual weight
3. **Alert** appears conditionally with a dismiss button
4. All components share the same theme and work together seamlessly

:::tip Component Composition
Lantern components are designed to compose naturally. They don't enforce specific layouts or structures—you have full control over how components are arranged and nested.
:::

## Custom Styling

Sometimes you need to add custom styles beyond what the theme provides. Use the `class` prop:

```vue
<script setup>
import { Button } from '@pharos-labo/lantern/components/button'
</script>

<template>
  <!-- Add custom classes -->
  <Button 
    color="primary" 
    variant="filled"
    class="my-custom-button"
  >
    Custom Styled
  </Button>
</template>

<style scoped>
.my-custom-button {
  /* Your custom CSS that extends theme styles */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.my-custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
</style>
```

The `class` prop has the **highest priority** in Lantern's style hierarchy. Your custom classes will merge with theme classes, and any conflicts are resolved in favor of your custom classes (thanks to [tailwind-merge](https://github.com/dcastil/tailwind-merge) under the hood).

```vue
<template>
  <!-- Theme says bg-blue-600, your class says bg-purple-600 -->
  <!-- Result: bg-purple-600 wins -->
  <Button color="primary" class="bg-purple-600">
    Custom Color
  </Button>
</template>
```

## Working with Primitives

When you need complete control over styling, use primitives instead of styled components:

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

```vue
<script setup>
import { Button } from '@pharos-labo/lantern/components/button'
import { Alert } from '@pharos-labo/lantern/components/alert'

const handleClick = (event) => {
  console.log('Button clicked!', event)
}

const handleDismiss = () => {
  console.log('Alert dismissed')
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1rem; padding: 2rem;">
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
    </Alert>
  </div>
</template>
```

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