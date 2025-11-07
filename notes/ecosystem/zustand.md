# 🧩 Zustand — Complete Guide for React State Management

> Zustand is a small, fast, and scalable state management library for React.  
> It provides a simple API for global state without boilerplate like Redux.

---

## 🚀 1. Installation

```bash
npm install zustand
```

Optional for **middleware features**:

```bash
npm install zustand-middleware
```

---

## ⚙️ 2. Basic Store Setup

```jsx
// src/store/useStore.js
import { create } from "zustand";

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;
```

**Usage in a component:**

```jsx
import useStore from "../store/useStore";

function Counter() {
  const { count, increment, decrement } = useStore();
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

---

## 🧠 3. Selecting State

Avoid re-renders by selecting only the state you need:

```jsx
const count = useStore((state) => state.count);
const increment = useStore((state) => state.increment);
```

✅ Improves performance in large components.

---

## 🧩 4. Middleware

Zustand supports middleware like **devtools, persist, and immer**.

### Devtools

```bash
npm install zustand/middleware
```

```jsx
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useStore = create(
  devtools((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
);
```

### Persist State (LocalStorage)

```jsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    { name: "theme-storage" }
  )
);
```

✅ The state will persist across page reloads.

---

## 🔧 5. Combining Middleware

```jsx
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      { name: "counter-storage" }
    )
  )
);
```

---

## 🌐 6. Async Actions / API Calls

Zustand works seamlessly with **async operations**.

```jsx
import { create } from "zustand";
import axios from "axios";

const useUserStore = create((set) => ({
  user: null,
  loading: false,
  fetchUser: async (id) => {
    set({ loading: true });
    const res = await axios.get(`/api/user/${id}`);
    set({ user: res.data, loading: false });
  },
}));
```

**Usage:**

```jsx
function User() {
  const { user, loading, fetchUser } = useUserStore();
  useEffect(() => {
    fetchUser(1);
  }, []);

  if (loading) return <p>Loading...</p>;
  return <p>{user?.name}</p>;
}
```

---

## 🔗 7. Integrating with React Query

Combine Zustand (local state) with **React Query** (server state):

```jsx
import { useQuery } from "@tanstack/react-query";
import useStore from "../store/useStore";
import axios from "axios";

function Todos() {
  const setTodos = useStore((state) => state.setTodos);

  const { data } = useQuery(
    ["todos"],
    () => axios.get("/api/todos").then((res) => res.data),
    {
      onSuccess: (todos) => setTodos(todos),
    }
  );

  return (
    <div>
      {data?.map((t) => (
        <p key={t.id}>{t.title}</p>
      ))}
    </div>
  );
}
```

✅ Zustand for local/global UI state, React Query for server-side caching.

---

## 🧱 8. Splitting Stores

```jsx
// store/counterStore.js
export const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// store/themeStore.js
export const useThemeStore = create(
  persist((set) => ({
    theme: "light",
    toggleTheme: () =>
      set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  }))
);
```

✅ Keeps stores modular and maintainable.

---

## 🧭 9. Best Practices

✅ Use **selectors** to prevent unnecessary re-renders  
✅ Split large stores into **feature-based slices**  
✅ Persist only **critical state** (like theme or auth token)  
✅ Combine with **React Query** for async server state  
✅ Avoid storing derived state — compute it in components  
✅ Use **middleware** for devtools and persistence  
✅ Keep store functions small and pure  

---

## 🔗 10. Resources

- [Official Docs](https://zustand-demo.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Middleware & Persist Guide](https://github.com/pmndrs/zustand#persist-middleware)
- [Zustand + React Query Pattern](https://tkdodo.eu/blog/zustand-with-react-query)

---

## ✅ Summary

> Zustand = lightweight, scalable state management.  
> Perfect for **global UI state** and **small apps**, while **React Query** handles server state.  
> Simple API, minimal boilerplate, and excellent TypeScript support.

