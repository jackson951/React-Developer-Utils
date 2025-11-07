# 🧪 `atomic-design.md`

_Atomic Design in React: Principles, Practice, and Pragmatism (2025 Edition)_

> ✅ **Last Updated**: November 7, 2025  
> 📌 **TL;DR**:
>
> - Atomic Design is a **methodology**, not a rigid dogma.
> - Use it to **scale design systems**, not to over-engineer small apps.
> - In 2025: Combine with **Component-Driven Development (Storybook)**, **TypeScript**, and **design tokens**.
> - ⚠️ Avoid deep nesting — prefer _flat_, _feature-aligned_ structures for most teams.

---

## 🔬 What Is Atomic Design?

Coined by [Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/), Atomic Design is a **hierarchical methodology** for building design systems:

```
Atoms → Molecules → Organisms → Templates → Pages
```

| Level         | Role                                        | React Analogy          | Example                                       |
| ------------- | ------------------------------------------- | ---------------------- | --------------------------------------------- |
| **Atoms**     | Smallest UI units (no children)             | Stateless primitives   | `<Button>`, `<Input>`, `<Icon>`               |
| **Molecules** | Groups of atoms functioning together        | Composed atoms         | `<SearchBar>` (Input + Button), `<LoginForm>` |
| **Organisms** | Complex sections (molecules + atoms)        | Feature sections       | `<Header>`, `<ProductCard>`, `<CommentFeed>`  |
| **Templates** | Page _structure_ (wireframe + placeholders) | Layouts with slots     | `<ArticleTemplate>`, `<DashboardLayout>`      |
| **Pages**     | Specific instances (real data)              | Route-level components | `<HomePage>`, `<ProductPage id="123">`        |

> 🌐 **Goal**: Build UIs like LEGO — consistent, reusable, scalable.

---

## 🗂️ Practical Folder Structure (2025 React)

> ✅ **Recommended for medium/large apps**  
> ❌ Overkill for prototypes or small SPAs

```bash
src/
├── components/
│   ├── atoms/              # Low-level, unstyled, accessible primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Icon.tsx
│   │   └── index.ts        # Barrel export
│   │
│   ├── molecules/          # Reusable combos (no business logic)
│   │   ├── SearchBar.tsx   # → <Input> + <Button>
│   │   ├── Card.tsx        # → <div> + <Heading> + <Text>
│   │   └── index.ts
│   │
│   ├── organisms/          # Feature-aware, may use hooks, context
│   │   ├── Header.tsx      # → <Logo> + <Nav> + <SearchBar>
│   │   ├── ProductGrid.tsx # → array of <ProductCard>
│   │   └── index.ts
│   │
│   └── layouts/            # Templates (structural, not content-specific)
│       ├── MainLayout.tsx  # → <Header> + <main>{children}</main> + <Footer>
│       └── DashboardLayout.tsx
│
├── features/               # Business logic + page assembly
│   ├── product/
│   │   ├── ui/             # Feature-local components (not global)
│   │   │   ├── ProductDetails.tsx  # → uses organisms + molecules
│   │   │   └── AddToCartButton.tsx
│   │   └── ProductPage.tsx # ← Page (uses layout + feature UI)
│   │
│   └── auth/
│
└── styles/
    ├── tokens/             # Design tokens (colors, spacing, typography)
    │   ├── colors.ts
    │   ├── spacing.ts
    │   └── typography.ts
    └── theme.ts            # `ThemeProvider` config
```

✅ **Key Decisions**:

- `atoms/` are **unstyled** (accept `className`, `style`, or use design tokens)
- `molecules/` and `organisms/` are **reusable across features**
- Feature-specific components live in `features/X/ui/` — _not_ forced into organisms
- Use **barrel files** (`index.ts`) for clean imports:
  ```ts
  // components/index.ts
  export * from "./atoms";
  export * from "./molecules";
  export * from "./organisms";
  ```

---

## 🛠️ Implementation Best Practices

### ✅ Atoms: The Foundation

- **No business logic** — pure presentational
- **Fully accessible** (ARIA, keyboard nav, focus management)
- **TypeScript props** with strict interfaces:

  ```tsx
  // atoms/Button.tsx
  type ButtonProps = {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>;

  export const Button = ({ variant = "primary", ...props }: ButtonProps) => (
    <button
      className={clsx(
        "px-4 py-2 rounded",
        variant === "primary" && "bg-blue-600 text-white"
        // ...
      )}
      {...props}
    />
  );
  ```

### ✅ Molecules: Composition

- **No data fetching** — props-in, JSX-out
- **Test all variants** (e.g., `isLoading`, `error`)
- Prefer **compound components** over fragile prop drilling:
  ```tsx
  // molecules/Card.tsx
  <Card>
    <Card.Header>...</Card.Header>
    <Card.Body>...</Card.Body>
    <Card.Footer>...</Card.Footer>
  </Card>
  ```

### ✅ Organisms: Feature Integration

- May use **context**, **hooks**, **global state**
- Keep **data-fetching minimal** — better in Pages or Server Components
- Avoid “god components” — split if >200 lines

---

## ⚠️ When _Not_ to Use Atomic Design

| Scenario                                | Better Approach                      |
| --------------------------------------- | ------------------------------------ |
| **Small app (<10 screens)**             | Flat `components/` + feature folders |
| **Rapid prototyping**                   | Build pages first, refactor later    |
| **Design-agnostic UI** (internal tools) | Skip atoms — start with molecules    |
| **Heavy customization per client**      | Component-per-feature (no reuse)     |

> 📝 **Brad Frost’s own advice (2023)**:  
> _“Atomic Design is a tool — not a religion. Adapt it. Break the rules. Make it work for you.”_

---

## 🧪 Atomic Design + Modern Tooling (2025)

| Tool             | Role                                    | Integration                              |
| ---------------- | --------------------------------------- | ---------------------------------------- |
| **Storybook**    | Document & test components in isolation | Auto-generate stories for atoms → pages  |
| **Chromatic**    | Visual regression testing               | Catch unintended UI changes              |
| **Figma Tokens** | Sync design ↔ code                      | Export tokens as JSON → `styles/tokens/` |
| **TypeScript**   | Enforce props contracts                 | `Props` interfaces in every component    |
| **Playwright**   | E2E test user flows                     | `<Page>`-level tests in `tests/e2e/`     |

**Example Storybook workflow**:

```bash
# Generate story for Button
npx storybook@8 add-story components/atoms/Button.tsx
```

→ Creates `Button.stories.tsx` with variants (primary, disabled, loading).

---

## 🌐 Atomic Design in the RSC Era

### ✅ Server Components Fit Naturally

- **Atoms/Molecules**: Often Server Components (static, no interactivity)
- **Organisms/Pages**: May mix Server + Client Components

```tsx
// organisms/Header.tsx (Server Component)
export default function Header() {
  const user = await getUser(); // ✅ Safe — runs on server
  return (
    <header>
      <Logo />
      <Nav />
      {user ? <UserMenu user={user} /> : <LoginButton />} {/* Client */}
    </header>
  );
}
```

### ❌ Avoid Anti-Patterns

- Don’t force **all atoms** to be Client Components — most don’t need JS
- Don’t put **Server-only logic** in `atoms/` — keep primitives framework-agnostic

---

## 📚 Recommended Reading

- 📘 [Atomic Design (Book) — Brad Frost](https://atomicdesign.bradfrost.com)
- 🎨 [Design Systems Handbook — InVision](https://www.designbetter.co/design-systems-handbook)
- 🧪 [Storybook: Component-Driven Development](https://storybook.js.org/docs/react/workflows/component-driven-development)
- 📊 [When Atomic Design Goes Wrong (CSS Tricks)](https://css-tricks.com/when-atomic-design-goes-wrong/)

---

> 💡 **Final Thought**:  
> _“Atomic Design isn’t about naming folders — it’s about building a shared language between designers and developers. When your designer says ‘molecule’, your engineer knows exactly where to look.”_

---
