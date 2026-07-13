# Project Guardrails: Astro, Tailwind v4, and React 19

These instructions outline how we handle migration, design cloning, styling, and framework integration in the Guayaquil Tourism app. Refer to these rules whenever translating component code from legacy reference projects.

## 1. Astro Hydration (Islands Architecture)
To keep the site performing at maximum speed, Astro compiles components to static zero-JS HTML by default. We must apply hydration directives selectively:

* **Static Components:** Keep container grids, simple cards, texts, and structural wrappers as native `.astro` components. Do not import React unless interactivity is required.
* **Interactive Components:** Wrap stateful layouts (dropdowns, mobile navigation menus, carousels, maps, tabs, search inputs) in React.
* **Hydration Directives:**
  * Use `client:visible` for sections positioned below the fold (e.g., testimonials, statistics count-ups, slider cards). This delays loading the React code until the user scrolls to it.
  * Use `client:load` for critical elements visible immediately on load (e.g., header menus, navigation, hero selectors).
  * Do not use client directives if a component only renders static text or images without state changes.

## 2. Tailwind v3 to Tailwind v4 Translation
When copying design code from reference projects built with Tailwind v3, translate v3 patterns to v4:

* **Themes and Configurations:** Do not create or edit `tailwind.config.js` or `tailwind.config.mjs`. All theme extensions must be written directly in the CSS entrypoint (`src/styles/global.css` or equivalent) using the `@theme` directive:
  ```css
  @theme {
    --color-brand-primary: #0073e6;
    --font-heading: 'Outfit', sans-serif;
  }
  ```
* **CSS Imports:** Use `@import "tailwindcss";` in the CSS entry point. Do not use `@tailwind base; @tailwind components; @tailwind utilities;`.
* **Deprecations:** Ensure custom utility modifications align with v4's CSS-first syntax. Avoid PostCSS and Autoprefixer dependencies.

## 3. React 19 Upgrade Rules (from React 18)
When cloning React 18 code, refactor deprecated elements to match React 19 standards:

* **Ref Passing:** Do not wrap child components in `forwardRef()`. In React 19, `ref` is a standard prop. Simply destruct it like any other prop:
  ```tsx
  // React 19 approach
  function MyInput({ ref, ...props }) {
    return <input ref={ref} {...props} />;
  }
  ```
* **Context Providers:** Do not use `<Context.Provider>`. Use the context directly as a provider:
  ```tsx
  // React 19 approach
  return <MyContext value={value}>{children}</MyContext>;
  ```
* **Cleanup Functions in useEffect:** Ensure `useEffect` returns either a function or `undefined` (do not return other types implicitly).
* **Package Mismatches:** If third-party UI libraries warn about React 18 peer dependencies, install with `--legacy-peer-deps` or replace them with native React elements.
