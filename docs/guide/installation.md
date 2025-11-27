# Installation

Get Lantern UI up and running in your Vue 3 project in minutes.

## Prerequisites

Before installing Lantern, make sure your project meets these requirements:

- **Vue 3.3+** - Lantern is built for Vue 3 and uses Composition API
- **Node.js 18+** - Required for package management
- **TypeScript (recommended)** - Full type safety and autocompletion

:::tip Project Setup
If you're starting fresh, we recommend using [Vite](https://vitejs.dev/) with the Vue template:

```bash
npm create vite@latest my-app -- --template vue-ts
```
:::

## Package Installation

Install Lantern UI via your preferred package manager:

::: code-group

```bash [npm]
npm install @pharos-labo/lantern
```

```bash [pnpm]
pnpm add @pharos-labo/lantern
```

```bash [yarn]
yarn add @pharos-labo/lantern
```

```bash [bun]
bun add @pharos-labo/lantern
```

:::

## Plugin Setup

Lantern uses a Vue plugin to provide the theme globally to all components. This is a **required step**—without it, styled components won't have access to your theme configuration.

### Basic Setup

In your application's entry point (usually `main.ts` or `main.js`), register the Lantern plugin:

```typescript
import { createApp } from 'vue'
import { lantern } from '@pharos-labo/lantern/plugin'
import { defaultTheme } from '@pharos-labo/lantern/theme'
import App from './App.vue'

createApp(App)
  .use(lantern, {
    theme: defaultTheme
  })
  .mount('#app')
```

That's it! Your app now has access to the Lantern theme system.

### With Custom Theme

Customizing the Lantern theme

Most projects will want to adapt the theme to match their brand.
Lantern provides a createTheme helper that lets you extend, override, or even add entirely new keys on top of any existing theme.

```typescript
import { createApp } from 'vue'
import { lantern } from '@pharos-labo/lantern/plugin'
import { defaultTheme, createTheme } from '@pharos-labo/lantern/theme'
import App from './App.vue'

// Extend the default theme with your own values
const myTheme = createTheme(defaultTheme, {
  colors: {
    brand: {
      filled: {
        background: 'some-bg-class',
        focus: 'some-focus-class',
      },
      outline: {
        border: 'some-border-class',
        hover: 'some-hover-class',
      },
    },
  },
  size: {
    sm: '',              
    xl: 'some-size-class',    
  },
})

createApp(App)
  .use(lantern, {
    theme: myTheme,
  })
  .mount('#app')
```

:::warning Deep Merge Recommended
`createTheme` is fully flexible. You can pass any theme object from any source, not just Lantern’s defaultTheme.
This makes it easy to integrate third-party themes or company-wide design systems.
:::

### Plugin Options

The plugin accepts several configuration options:

```typescript
createApp(App)
  .use(lantern, {
    theme: myTheme,           // Required: Your theme configuration
    defaultColor: 'brand',    // Optional: Default color for all components
    defaultVariant: 'filled'  // Optional: Default variant for all components
  })
  .mount('#app')
```

**Available Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `Theme` | **Required** | Your theme configuration with colors, sizes, and props |
| `defaultColor` | `string` | `undefined` | Global fallback color when components don't specify one |
| `defaultVariant` | `string` | `undefined` | Global fallback variant when components don't specify one |

:::tip When to Use Global Defaults
Set `defaultColor` and `defaultVariant` if you want **every component** in your app to use the same color scheme by default.
:::

## Importing Components

Lantern provides two ways to import components, depending on whether you want primitives or styled versions.

### Styled Components (Recommended)

For most use cases, import styled components that automatically use your theme:

```vue
<script setup>
import { Button } from '@pharos-labo/lantern/components/button'
import { Alert, AlertClose } from '@pharos-labo/lantern/components/alert'
import { Card } from '@pharos-labo/lantern/components/card'
</script>

<template>
  <Button color="primary" variant="filled" size="lg">
    Click me
  </Button>
  
  <Alert color="success" variant="soft">
    <p>Operation completed successfully!</p>
    <AlertClose />
  </Alert>
  
  <Card color="default" variant="outline">
    <h3>Card Title</h3>
    <p>Card content goes here.</p>
  </Card>
</template>
```

### Primitives (Advanced)

Import primitives when you need full control over styling:

```vue
<script setup>
import { Button } from '@pharos-labo/lantern/primitives/button'
</script>

<template>
  <Button class="my-custom-button-styles" @click="handleClick">
    Submit
  </Button>
</template>

<style scoped>
.my-custom-button-styles {
  /* Your custom CSS */
}
</style>
```

:::info Primitives vs Styled
**Primitives** provide behavior and accessibility without any theme integration. They accept a `class` prop for your own styling.

**Styled components** wrap primitives and add theme integration, handling `color`, `variant`, `size`, `radius`, and other theme props automatically.

Both have the same name and API—the only difference is which import path you use.
:::

## TypeScript Support

Lantern is built with TypeScript and provides full type definitions out of the box. No additional setup required!

### Type Imports

Access Lantern's types for advanced customization:

```typescript
import type { Theme, ComponentSpec } from '@pharos-labo/lantern/types'

const myTheme: Theme = {
  colors: { /* ... */ },
  size: { /* ... */ },
  radius: { /* ... */ }
}

const buttonSpec: ComponentSpec = {
  apply: ['hover', 'focus'],
  class: 'my-button',
  defaultProps: {
    color: 'primary',
    variant: 'filled'
  }
}
```

### Prop Autocomplete

When using styled components, TypeScript will autocomplete available props:

```vue
<script setup lang="ts">
import { Button } from '@pharos-labo/lantern/components/button'
</script>

<template>
  <!-- TypeScript suggests: color, variant, size, radius, class, disabled, loading, type -->
  <Button color="primary" variant="filled" size="lg">
    Click me
  </Button>
</template>
```

## Styling Setup (Optional)

Lantern doesn't impose any CSS framework, but here are common setups:

### With Tailwind CSS

If you're using Tailwind utility classes in your theme (recommended):

1. **Install Tailwind** (if not already):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. **Configure Tailwind** to scan Lantern components:

```javascript
// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@pharos-labo/lantern/**/*.{vue,js,ts}' // ← Add this
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

3. **Import Tailwind** in your CSS:

```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

:::tip Why Scan Lantern?
Tailwind needs to scan Lantern's source to detect which utility classes are used in the default theme and component specs. Without this, those classes won't be included in your production CSS.
:::

### With Custom CSS

If you're using custom CSS classes:

```typescript
// Define your theme with your own class names
const myTheme: Theme = {
  colors: {
    primary: {
      filled: {
        background: 'button-primary',
        foreground: 'text-light',
        hover: 'button-primary-hover'
      }
    }
  },
  size: {
    md: 'button-size-medium'
  }
}
```

Then define those classes in your CSS:

```css
.button-primary {
  background-color: #3b82f6;
}

.text-light {
  color: white;
}

.button-primary-hover:hover {
  background-color: #2563eb;
}

.button-size-medium {
  height: 40px;
  padding: 0 16px;
}
```

## Verification

Let's verify your installation is working correctly. Create a simple test component:

```vue
<script setup>
import { Button } from '@pharos-labo/lantern/components/button'
</script>

<template>
  <div style="padding: 2rem;">
    <Button color="primary" variant="filled" size="lg">
      Test Button
    </Button>
  </div>
</template>
```

If you see a styled button, congratulations! Lantern is installed and configured correctly.

:::danger Installation Issues?
If the button appears but without styles:
- ✅ Verify the plugin is registered in `main.ts`
- ✅ Check that you're passing a `theme` to the plugin
- ✅ If using Tailwind, confirm Lantern is in your `content` array
- ✅ Restart your dev server after config changes

Still stuck? Check our [Troubleshooting Guide](./troubleshooting) or [open an issue](https://github.com/pharos-lab/lantern/issues).
:::

## What's Next?

Now that Lantern is installed, you're ready to build!

- **[Quick Start](./quick-start)** - Build your first component in 5 minutes
- **[Theme System](./theme-system)** - Deep dive into theme customization
- **[Components](../components/button)** - Explore available components
- **[Examples](../examples/playground)** - See Lantern in action

---

:::tip Need Help?
Join our [GitHub Discussions](https://github.com/pharos-lab/lantern/discussions) or [Discord community](https://discord.gg/lantern) for support.
:::