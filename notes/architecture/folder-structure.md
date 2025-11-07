# React Project Folder Structure Guide

## Small to Medium Projects

```
src/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.test.jsx
│   │   │   └── Button.module.css
│   │   ├── Input/
│   │   └── Modal/
│   └── layout/
│       ├── Header/
│       ├── Footer/
│       └── Sidebar/
├── pages/
│   ├── Home/
│   │   ├── Home.jsx
│   │   └── Home.module.css
│   ├── About/
│   └── Dashboard/
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useLocalStorage.js
├── utils/
│   ├── formatters.js
│   ├── validators.js
│   └── helpers.js
├── services/
│   ├── api.js
│   └── auth.js
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── styles/
│   ├── globals.css
│   └── variables.css
├── App.jsx
├── main.jsx
└── routes.jsx
```

## Large-Scale Enterprise Projects

```
src/
├── assets/
│   ├── images/
│   ├── fonts/
│   ├── icons/
│   └── videos/
├── components/
│   ├── common/         # Shared across entire app
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   └── Loader/
│   ├── layout/         # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── Navigation/
│   └── forms/          # Form-specific components
│       ├── LoginForm/
│       └── SignupForm/
├── features/           # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── store/
│   └── orders/
├── pages/              # Route-level components
│   ├── Home/
│   ├── Dashboard/
│   ├── Profile/
│   └── NotFound/
├── hooks/              # Global custom hooks
│   ├── useAuth.js
│   ├── useDebounce.js
│   └── useMediaQuery.js
├── store/              # State management (Redux/Zustand)
│   ├── slices/
│   │   ├── authSlice.js
│   │   └── userSlice.js
│   ├── middleware/
│   └── store.js
├── services/           # API calls and external services
│   ├── api/
│   │   ├── client.js
│   │   ├── auth.js
│   │   └── products.js
│   └── analytics/
├── utils/              # Utility functions
│   ├── formatters.js
│   ├── validators.js
│   ├── constants.js
│   └── helpers.js
├── config/             # App configuration
│   ├── routes.js
│   ├── env.js
│   └── theme.js
├── types/              # TypeScript types/interfaces
│   ├── user.ts
│   └── product.ts
├── styles/             # Global styles
│   ├── globals.css
│   ├── variables.css
│   └── mixins.css
├── tests/              # Test utilities and setup
│   ├── mocks/
│   ├── fixtures/
│   └── setup.js
├── App.jsx
├── main.jsx
└── router.jsx
```

## Feature-Based Architecture (Recommended for Large Apps)

```
src/
├── features/
│   ├── authentication/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── store/
│   │   │   └── authSlice.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   └── index.js        # Public API
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── store/
│   └── cart/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── core/
│   ├── api/
│   ├── config/
│   └── router/
└── App.jsx
```

## Component Structure Guidelines

### Option 1: Co-located Files

```
Button/
├── Button.jsx
├── Button.test.jsx
├── Button.module.css
├── Button.stories.jsx
└── index.js
```

### Option 2: Separate Test Directory

```
components/
├── Button/
│   ├── Button.jsx
│   ├── Button.module.css
│   └── index.js
└── __tests__/
    └── Button.test.jsx
```

## Best Practices

### 1. **Component Organization**

- Keep components in their own folders
- Include tests, styles, and stories alongside components
- Use `index.js` for clean imports

### 2. **Naming Conventions**

- Components: PascalCase (`Button.jsx`, `UserProfile.jsx`)
- Utilities/Hooks: camelCase (`useAuth.js`, `formatDate.js`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### 3. **Import Structure**

```javascript
// External dependencies
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Internal dependencies (absolute imports)
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatters";

// Relative imports
import styles from "./Component.module.css";
```

### 4. **Path Aliases (jsconfig.json / tsconfig.json)**

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/components/*": ["components/*"],
      "@/hooks/*": ["hooks/*"],
      "@/utils/*": ["utils/*"],
      "@/services/*": ["services/*"],
      "@/assets/*": ["assets/*"]
    }
  }
}
```

### 5. **Public Folder**

```
public/
├── favicon.ico
├── robots.txt
├── manifest.json
└── locales/
    ├── en.json
    └── es.json
```

## Architecture Patterns

### Pages vs Features

- **Pages**: Route-level components that compose features
- **Features**: Self-contained business logic modules

### When to Use What Structure

- **Small projects** (<10 components): Flat structure
- **Medium projects** (10-50 components): Grouped by type
- **Large projects** (50+ components): Feature-based or domain-driven

## Common Pitfalls to Avoid

1. **Too deep nesting** - Keep folders max 3-4 levels deep
2. **Mixing concerns** - Don't put business logic in components
3. **Unclear naming** - Use descriptive, consistent names
4. **No index files** - Use index.js for cleaner imports
5. **Large components** - Split into smaller, reusable pieces

## Recommended File Extensions

- `.jsx` for React components with JSX
- `.js` for utilities, configs, and plain JavaScript
- `.ts/.tsx` for TypeScript projects
- `.module.css` for CSS Modules
- `.test.js` or `.spec.js` for tests
