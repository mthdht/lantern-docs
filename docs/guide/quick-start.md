# 🚀 Quick Start: Build Your First Component

Congratulations\! Now that Lantern UI is installed and your theme is configured, you are ready to build your first interface.

This page will guide you through using **Styled Components** for rapid development, and then show you how to gain full control with **Primitives**.

## 1\. Fast Start with Styled Components

Styled Components (found in `/components/`) are the simplest way to use Lantern UI. They automatically inherit from your global `theme` and apply the `defaultProps` defined in their **Component Spec**.

### Basic Usage

Let's start with the styled `Button`, which uses your default theme values (e.g., `color: 'brand'`, `variant: 'filled'` if you set them in your plugin options).

```vue
<script setup lang="ts">
// Import the styled component
import { Button } from '@pharos-labo/lantern/components/button'
</script>

<template>
  <Button>Submit Form</Button> 

  <Button disabled>Loading...</Button> 
</template>
```

-----

## 2\. Customization via Props (The Final Word)

The power of Lantern lies in how easily you can override styles via props. Remember: **Props always have absolute priority** over the Component Spec and the Global Theme.

### Overriding Semantic Styles

Use the `color`, `variant`, `size`, and `radius` props to apply style combinations that are predefined in your theme.

```vue
<template>
  <div class="flex space-x-4">
    <Button color="danger" variant="filled">Delete</Button> 

    <Button color="danger" variant="outline" size="md">Cancel</Button> 

    <Button color="success" size="lg" radius="full">Finish</Button>
  </div>
</template>
```

### Injecting Custom Classes

The `class` prop is passed directly to the primitive component and is merged last via `tailwind-merge`. This ensures your custom classes **will override** any theme-generated classes if there are conflicts.

```vue
<template>
  <Button 
    color="primary" 
    variant="filled"
    size="lg"
    // Custom classes that will be merged or override (e.g., setting a different shadow)
    class="uppercase font-extrabold shadow-xl hover:shadow-2xl"
  >
    My Unique Style
  </Button>
</template>
```

> **How does this work?**
> The `twMerge(..., props.class)` call inside your `useComponentClasses` guarantees that if your theme defines a `background: 'bg-blue-500'` and you pass `class="bg-purple-600"`, the button will be **purple**.

-----

## 3\. Primitives: Headless Control

If you need to apply styles that don't exist in your theme (or if you are integrating with an external CSS system), import the **Primitive** directly for complete styling control.

### Primitive Usage

The Primitive component manages only behavior and A11y. It accepts only its behavioral props (like `disabled`, `loading`, `type`) and the `class` prop.

```vue
<script setup lang="ts">
// Import the Primitive component
import { Button as ButtonPrimitive } from '@pharos-labo/lantern/primitives/button'
</script>

<template>
  <ButtonPrimitive 
    type="submit" 
    :disabled="isSubmitting"
    // 💡 All Tailwind classes are injected here
    class="bg-indigo-600 text-white p-3 rounded-xl shadow-lg transition-colors hover:bg-indigo-700"
  >
    Send
  </ButtonPrimitive>
</template>
```

| Feature | Styled Component | Primitive Component |
| :--- | :--- | :--- |
| **Import Path** | `@pharos-labo/lantern/components/...` | `@pharos-labo/lantern/primitives/...` |
| **Style Props** | `color`, `variant`, `size`, `radius`, etc. | ❌ Not accepted |
| **Logic/A11y** | ✅ Inherited from Primitive | ✅ Handled directly |
| **Styling Method**| Via Props (Semantic Style) | Via `class` (Direct Style) |
| **Theme Integration** | Automatic | None |

-----

## 4\. Understanding the Theme Cascade

To solidify your understanding of the system, here is a reminder of the logic applied when you render a styled component:

When resolving the `color` for a button:

1.  Lantern checks for `props.color`. If `$props.color` is `'danger'`, that color is used.
2.  If `$props.color` is undefined, Lantern uses `buttonSpec.defaultProps.color` (e.g., `'primary'`).
3.  If neither is defined, the global `defaultColor` from the plugin options is used.
4.  Once the color is resolved, classes are extracted, using any `override` defined in the Component Spec first, followed by the Global Theme classes.

:::tip Key Concept
Your library is a **class resolution engine** based on semantics. The dual architecture allows you to choose where to inject this engine: into the **Styled component** (via `useComponentClasses`) or directly into the **Primitive component** (via the `class` prop).
:::

## What's Next?

You now have the tools to use and customize Lantern. Dive deeper into the concepts that interest you most:

  - **[Theme System](https://www.google.com/search?q=./theme-system)** - Understand the Color/Variant/Key architecture in depth.
  - **[Component Specs](https://www.google.com/search?q=./component-specs)** - Learn how to create your own specs and *override* the theme for a specific component.
  - **[Components](https://www.google.com/search?q=../components/button)** - Explore the full documentation for every available component.