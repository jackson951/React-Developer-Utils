# 🧼 `clean-code-patterns.md`

_Clean Code in React: Readability, Maintainability, and Team Scalability (2025 Edition)_

> ✅ **Last Updated**: November 7, 2025  
> 📌 **TL;DR**:
>
> - **Code is read 10x more than written** — optimize for humans first.
> - Prefer **explicit over clever**, **composable over monolithic**, **tested over “works on my machine.”**
> - In 2025: Enforce with **Biome**, **TypeScript strict mode**, and **Playwright E2E**.
> - Clean code ≠ minimal code — it’s _intentional_ code.

---

## 🧭 Core Principles (React-Specific)

| Principle                  | Anti-Pattern                                             | Clean Alternative                                       |
| -------------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| **Single Responsibility**  | `<UserCard>` fetches data, formats dates, handles delete | Split: `<UserCard>` (UI), `useUser(id)`, `formatDate()` |
| **Explicit over Implicit** | Magic strings: `status === 'active'`                     | Enums/const: `UserStatus.ACTIVE`                        |
| **Fail Fast**              | Silent `catch { }`                                       | `catch (err) { logAndRethrow(err, 'fetchUser') }`       |
| **No Surprises**           | Side effects in render                                   | Move to `useEffect`, `useAction`, or event handler      |
| **Testability**            | `useEffect` with `fetch` + no mocks                      | Isolate data layer: `api.getUser()` → mock in tests     |

> ✅ From [React Docs](https://react.dev/learn):  
> _“Components should do one thing well, and compose to form complex UIs.”_

---

## 📦 File & Folder Structure

### ✅ Recommended (Feature-Sliced Design + Atomic)

```bash
src/
├── features/
│   └── cart/
│       ├── ui/              # CartButton, CartModal (reusable)
│       ├── model/           # useCart.ts, types.ts, api.ts
│       └── CartPage.tsx    # Page: composes ui + model
│
├── shared/
│   ├── ui/                  # Atoms: Button, Input, Card
│   ├── lib/                 # formatDate, debounce, storage
│   └── types/               # User, Product (global domain types)
│
├── app/
│   ├── layout.tsx           # App shell (Server Component)
│   └── page.tsx             # Home page
│
└── tests/
    ├── unit/                # helpers, hooks
    ├── integration/         # components + mocks
    └── e2e/                 # Playwright user flows
```

✅ **Rules**:

- **1 component = 1 file** (no `components/index.tsx` dumping ground)
- **Barrel files only for public APIs**:
  ```ts
  // features/cart/index.ts
  export { CartPage } from "./CartPage";
  export { useCart } from "./model/useCart";
  // ❌ Never: export * from './lib/internalUtils';
  ```

---

## ✍️ Naming Conventions (TypeScript + React)

| What           | Good                                  | Bad                           | Why                                |
| -------------- | ------------------------------------- | ----------------------------- | ---------------------------------- |
| **Components** | `UserAvatar`, `SearchBar`             | `Avatar`, `Search`            | Noun + specificity                 |
| **Hooks**      | `useLocalStorage`, `useDebounce`      | `withStorage`, `debounceHook` | `use` prefix, verb-noun            |
| **Utils**      | `formatCurrency`, `isEmailValid`      | `helper`, `utils`             | Action-oriented, self-documenting  |
| **Props**      | `isLoading`, `onSubmit`               | `loading`, `submit`           | Boolean: `is/has`; Callback: `on*` |
| **Types**      | `UserStatus = 'active' \| 'inactive'` | `string`                      | Narrow + explicit                  |

✅ **Enforce with ESLint**:

```json
{
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "function",
        "format": ["camelCase"],
        "leadingUnderscore": "allow"
      },
      { "selector": "variable", "format": ["camelCase", "UPPER_CASE"] },
      { "selector": "typeLike", "format": ["PascalCase"] }
    ]
  }
}
```

---

## 🧩 Component Patterns

### ✅ Small, Focused Components

```tsx
// ❌ Monolithic
function UserProfile({ user }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const save = async () => {
    /* fetch + validation + toast */
  };
  return (
    <div>
      {editing ? (
        <input value={name} onChange={(e) => setName(e.target.value)} />
      ) : (
        <h1>{user.name}</h1>
      )}
      <button onClick={editing ? save : () => setEditing(true)}>
        {editing ? "Save" : "Edit"}
      </button>
    </div>
  );
}

// ✅ Clean: Split concerns
const UserNameDisplay = ({ name }: { name: string }) => <h1>{name}</h1>;
const UserNameEdit = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => <input value={value} onChange={(e) => onChange(e.target.value)} />;
const EditButton = ({
  isEditing,
  onClick,
}: {
  isEditing: boolean;
  onClick: () => void;
}) => <button onClick={onClick}>{isEditing ? "Save" : "Edit"}</button>;

function UserProfile({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const save = useActionState(async () => {
    await updateUser({ name });
    setIsEditing(false);
  }, user.name);

  return (
    <div>
      {isEditing ? (
        <UserNameEdit value={name} onChange={setName} />
      ) : (
        <UserNameDisplay name={name} />
      )}
      <EditButton
        isEditing={isEditing}
        onClick={isEditing ? save : () => setIsEditing(true)}
      />
    </div>
  );
}
```

✅ **Benefits**:

- Each component has **one reason to change**
- Reusable (`UserNameDisplay` in `<Header>`, `<Card>`)
- Testable in isolation

---

## 🧪 Testing as Design Tool

> “If it’s hard to test, it’s poorly designed.” — Kent C. Dodds

### ✅ Testable Code Traits

| Trait                             | Example                                             |
| --------------------------------- | --------------------------------------------------- |
| **Pure functions**                | `formatDate(date: Date): string`                    |
| **Hooks with no side effects**    | `useCounter()` → test with `renderHook`             |
| **Components with mockable deps** | `<UserList users={...} />` (not `useEffect(fetch)`) |
| **Explicit dependencies**         | `api.getUser = jest.fn()`                           |

**Test structure** (AAA: Arrange-Act-Assert):

```tsx
// hooks/useCart.test.ts
test("adds item to cart", () => {
  // Arrange
  const { result } = renderHook(() => useCart());

  // Act
  act(() => result.current.addItem({ id: "1", name: "Book" }));

  // Assert
  expect(result.current.items).toHaveLength(1);
  expect(result.current.items[0].id).toBe("1");
});
```

✅ **Coverage targets**:

- ≥80% for **utils/hooks**
- ≥70% for **components** (focus on behavior, not implementation)
- 100% for **critical paths** (auth, payments)

---

## 🛠️ Tooling for Clean Code (2025 Stack)

| Tool                    | Role                      | Setup                                               |
| ----------------------- | ------------------------- | --------------------------------------------------- |
| **Biome**               | Linting + Formatting + TS | `npm create @biomejs/biome@latest`                  |
| **TypeScript**          | Type safety               | `strict: true`, `noUncheckedIndexedAccess: true`    |
| **Playwright**          | E2E tests                 | `npx playwright init`                               |
| **Husky + lint-staged** | Pre-commit checks         | `npx husky add .husky/pre-commit "npx lint-staged"` |
| **Commitlint**          | Conventional commits      | Enforce `feat:`, `fix:`, `chore:`                   |

**`.biome.json` (minimal strict config)**:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.8.3/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": { "noNonNullAssertion": "error" },
      "correctness": { "noUnusedVariables": "error" }
    }
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

---

## 🚫 Common Anti-Patterns

| Anti-Pattern                                 | Why Bad                          | Fix                                           |
| -------------------------------------------- | -------------------------------- | --------------------------------------------- |
| **Prop drilling past 2 levels**              | Fragile, hard to refactor        | → Context (sparingly), Zustand, or colocation |
| **Large `useEffect` with multiple concerns** | Unmaintainable, race conditions  | → Split into focused effects or custom hooks  |
| **`any` or `// @ts-ignore`**                 | Type safety erosion              | → Use `unknown` + validation, or `zod` schema |
| **Inline styles/strings**                    | Unmaintainable theming           | → Extract to `styles/` or design tokens       |
| **Silent error swallowing**                  | Debugging nightmares             | → Log + rethrow or show toast                 |
| **Over-memoization**                         | Cognitive overhead, no perf gain | → Profile first; use React Compiler (2025+)   |

---

## 📚 Recommended Reading

- 📘 [Clean Code (Robert C. Martin)](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) — _The classic_
- 🧪 [Epic React: Clean Code Module](https://epicreact.dev/modules/react-fundamentals) — _React-specific_
- 📊 [React Docs: Thinking in React](https://react.dev/learn/thinking-in-react)
- 🛠️ [Biome Rules Reference](https://biomejs.dev/linter/rules/)

---

> 💡 **Final Thought**:  
> _“Clean code is not written by following a checklist — it emerges from empathy: for your future self, your teammates, and your users.”_
