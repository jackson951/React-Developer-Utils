# 🧠 `redux-toolkit.md`  
*Redux Toolkit (RTK) — The Modern, Efficient Way to Manage State (2025 Edition)*

> ✅ **Last Updated**: November 7, 2025  
> 🎯 **For**: Developers building medium-to-large React apps with shared state  
> 📌 **Assumes**: Familiarity with React hooks, basic Redux concepts  
> 🔑 **Key Insight**: *RTK isn’t just “Redux with less code” — it’s “Redux with better defaults.”*

---

## 🚀 Why Redux Toolkit?

Redux Toolkit (RTK) is the **official, recommended approach** to Redux — built by the core Redux team. It solves the biggest pain points of classic Redux:

| Problem in Classic Redux | RTK Solution |
|--------------------------|--------------|
| Verbose boilerplate (action types, switch statements) | ✅ `createSlice` auto-generates actions & reducers |
| Manual immutable updates (`...`, `Object.assign`) | ✅ **Immer** built-in — write “mutative” logic safely |
| Complex store setup | ✅ `configureStore` with sensible defaults (DevTools, middleware) |
| Async logic scattered across thunks, sagas, etc. | ✅ `createAsyncThunk` + `extraReducers` pattern |
| Poor TypeScript support | ✅ First-class TS — zero `any`, strong typing out of the box |

> 💡 **When to use RTK (2025 rule of thumb)**:  
> - You have **cross-cutting state** (auth, cart, filters, notifications)  
> - You need **dev-time debugging** (Redux DevTools time travel)  
> - Your team values **predictability over magic**  
> - ⚠️ *Don’t use RTK for local UI state — prefer `useState`, `useReducer`, or Zustand.*

---

## ⚙️ Installation

```bash
npm install @reduxjs/toolkit react-redux
```

**TypeScript users** (strongly recommended):
```bash
npm install --save-dev @types/react-redux
```

> 📦 `@reduxjs/toolkit` includes:
> - `@reduxjs/toolkit` core  
> - `redux` (peer dependency, auto-installed)  
> - `immer`  
> - `redux-thunk`

---

## 🗂️ Folder Structure (Feature-Sliced, 2025 Standard)

```
src/
├── app/
│   └── store.ts                # Store config
│   └── hooks.ts                # Typed useDispatch/useSelector
├── features/
│   ├── auth/
│   │   ├── authSlice.ts        # Reducer + thunks
│   │   ├── authApi.ts          # RTK Query API (optional)
│   │   └── types.ts            # Auth-specific types
│   │
│   ├── cart/
│   │   ├── cartSlice.ts
│   │   └── CartButton.tsx
│   │
│   └── todos/
│       ├── todosSlice.ts
│       ├── todosApi.ts
│       └── components/
│           └── TodoList.tsx
│
├── shared/
│   └── types/                  # Global types (User, Todo)
│
└── main.tsx
```

✅ **Principles**:  
- Group by **feature**, not file type  
- Keep slices self-contained (`slice.ts` = state + logic)  
- Use `app/hooks.ts` to avoid repeating `useDispatch`/`useSelector` types

---

## 🧩 Creating a Slice (`createSlice`)

Each slice defines state shape, reducers, and action creators — **in one file**.

```ts
// src/features/counter/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  lastUpdated?: Date;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // Immer allows "mutative" syntax — safe & readable
    increment: (state) => {
      state.value += 1;
      state.lastUpdated = new Date();
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // PayloadAction<T> gives full TS safety
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Export actions (for dispatching)
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Export reducer (for store config)
export default counterSlice.reducer;
```

✅ **Key benefits**:  
- No action types (`counter/increment` auto-generated)  
- No `switch` statements  
- Full TypeScript inference — `action.payload` is typed  
- Immutable under the hood (Immer freezes state in dev)

---

## 🧠 Configuring the Store

`configureStore` = Redux setup with batteries included.

```ts
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import todosReducer from '../features/todos/todosSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
  },
  // Dev-only middleware (auto-disabled in prod)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable fields (e.g., Date, Map)
        ignoredActions: ['counter/increment'],
        ignoredPaths: ['counter.lastUpdated'],
      },
    }),
});

// Infer types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

✅ **What’s included by default**:  
- Redux DevTools Extension support  
- `redux-thunk` middleware  
- Immutability & serializability checks (dev-only)  
- Automatic code splitting (in production builds)

---

## ⚛️ Connecting to React

### 1. Provide the store
```tsx
// main.tsx
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### 2. Typed hooks (avoid repeating types)
```ts
// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 3. Component usage
```tsx
// src/features/counter/Counter.tsx
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { increment, decrement, incrementByAmount } from './counterSlice';

export default function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(decrement())}>–</button>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

---

## 🔁 Async Logic: `createAsyncThunk`

For data fetching, mutations — with automatic loading/error states.

```ts
// src/features/todos/todosSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Thunk: handles async lifecycle
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  if (!res.ok) throw new Error('Failed to fetch');
  return (await res.json()) as Todo[];
});

interface TodosState {
  list: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodosState = {
  list: [],
  status: 'idle',
  error: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Optional: sync helpers (e.g., toggleTodo)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export default todosSlice.reducer;
```

✅ **Pro Tips**:  
- Use **discriminated unions** for complex states (e.g., `{ status: 'idle' } | { status: 'loading' } | ...`)  
- Avoid `any` — always type `PayloadAction<T>`  
- Handle errors in `.rejected`, not in `.fulfilled`

---

## 🌐 RTK Query: The Data Fetching Superpower

> ✅ **Use RTK Query instead of `createAsyncThunk` for 80% of data needs** — it handles caching, revalidation, and codegen.

```ts
// src/features/todos/todosApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  tagTypes: ['Todo'], // For cache invalidation
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => 'todos?_limit=5',
      providesTags: ['Todo'],
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (todo) => ({
        url: 'todos',
        method: 'POST',
        body: todo,
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation } = todosApi;
```

### Store setup (add API reducer + middleware):
```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { todosApi } from '../features/todos/todosApi';

export const store = configureStore({
  reducer: {
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todosApi.middleware),
});
```

### Component usage:
```tsx
import { useGetTodosQuery } from './todosApi';

export default function TodoList() {
  const { data: todos, error, isLoading, isFetching } = useGetTodosQuery();

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error!</div>;

  return (
    <ul>
      {/* 🚀 Auto-refetch on window focus, network reconnect */}
      {todos?.map(todo => <li key={todo.id}>{todo.title}</li>)}
    </ul>
  );
}
```

✅ **RTK Query advantages**:  
- Automatic caching & background refetching  
- Request deduping (same query = one network call)  
- Pagination, infinite scroll, optimistic updates built-in  
- Codegen support for OpenAPI/swagger  

---

## 🛠️ Debugging & DevX

### 🔍 Redux DevTools
- **Install**: [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)  
- **Features**:  
  - Time-travel debugging (undo/redo actions)  
  - Action inspector (`type`, `payload`, `meta`)  
  - State diff viewer  
  - Export/import state  

### 📊 Custom Middleware (logging, analytics)
```ts
// app/middleware.ts
const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  console.group(action.type);
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
```

---

## 🧱 Best Practices (2025)

| Practice | Why |
|---------|-----|
| **Prefer RTK Query over `createAsyncThunk`** | Less boilerplate, better caching, built-in hooks |
| **Normalize state shape** | `entities: { [id]: Todo }`, `ids: number[]` — avoids duplication |
| **Use selectors for derived data** | `const selectCompletedTodos = (state) => state.todos.list.filter(t => t.completed)` |
| **Avoid deep nesting** | Flatten state (`users.byId`, `users.ids`), not `users: { list: [{...}] }` |
| **Write tests for slices** | `import { increment } from './counterSlice';` → test reducer logic |
| **Use `redux-persist` sparingly** | Only for auth tokens, theme — avoid caching server state |

---

## 📦 Common Add-ons

| Library | Purpose | When to Use |
|--------|---------|-------------|
| `@reduxjs/toolkit/query` | Data fetching/caching | ✅ Default choice for APIs |
| `redux-persist` | Persist to localStorage | Auth, user prefs (not server data) |
| `reselect` | Memoized selectors | Complex derived data (`getVisibleTodos`) |
| `redux-logger` | Action logging | Dev only — avoid in prod |

Install all:
```bash
npm install @reduxjs/toolkit/query redux-persist reselect
```

---

## 🔗 Essential Resources

| Resource | Link |
|---------|------|
| **RTK Official Docs** | [redux-toolkit.js.org](https://redux-toolkit.js.org) |
| **RTK Query Tutorial** | [redux.js.org/rtk-query/overview](https://redux.js.org/rtk-query/overview) |
| **Immer Deep Dive** | [immerjs.github.io/immer](https://immerjs.github.io/immer) |
| **Redux Essentials Course** | [redux.js.org/tutorials/essentials](https://redux.js.org/tutorials/essentials) |
| **React-Redux Hooks API** | [react-redux.js.org/api/hooks](https://react-redux.js.org/api/hooks) |

---

> ✅ **Summary**:  
> *Redux Toolkit is not “Redux with less code” — it’s Redux rebuilt for the modern era: type-safe, dev-friendly, and focused on real-world ergonomics. Use it for global state that needs structure, debugging, and cross-component sharing — and pair it with RTK Query for data.*  

> 🔮 **2025 Forecast**: RTK Query + Server Components (Next.js) = the future of full-stack data management.

