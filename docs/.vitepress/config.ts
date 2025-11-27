import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  title: 'Lantern UI',
  description: 'A headless Vue 3 component library with Tailwind CSS',
  base: '/',
  lang: 'en-US', // ou 'fr-FR' si tu veux en français

  head: [
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Components', link: '/components/button' },
      { 
        text: 'Examples',
        items: [
          { text: 'Playground', link: '/examples/playground' },
          { text: 'Templates', link: '/examples/templates' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ]
        },
        {
          text: 'Concepts',
          items: [
            { text: 'Theme System', link: '/guide/theme-system' },
            { text: 'Component Specs', link: '/guide/component-specs' },
            { text: 'Primitives vs Styled', link: '/guide/primitives' },
            { text: 'Customization', link: '/guide/customization' },
          ]
        }
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Button', link: '/components/button' },
            { text: 'Alert', link: '/components/alert' },
            { text: 'Card', link: '/components/card' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pharos-lab/lantern' }
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/pharos-lab/lantern/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Lantern UI'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
  },

  vite: {
    resolve: {
      alias: {
        // '@': fileURLToPath(new URL('../src', import.meta.url)),
        // 'lantern-ui': fileURLToPath(new URL('../src', import.meta.url))
      }
    }
  }
})