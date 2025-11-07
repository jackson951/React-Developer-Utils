### 📘 **File:** `notes/ecosystem/redux-toolkit.md`

````markdown
# 🧠 Redux Toolkit (RTK) — Complete Guide

> Redux Toolkit (RTK) is the official, recommended way to write Redux logic — cleaner, faster, and with less boilerplate.

---

## 🚀 1. Why Redux Toolkit?

Redux Toolkit simplifies Redux by:

- ✅ Automatically configuring the store
- ✅ Reducing boilerplate (no more switch cases)
- ✅ Built-in **Immer** for immutable updates
- ✅ Built-in **Thunk middleware** for async logic
- ✅ Supports **TypeScript** out of the box

---

## ⚙️ 2. Installation

```bash
npm install @reduxjs/toolkit react-redux
```
````

If using TypeScript:

```bash
npm install @types/react-redux --save-dev
```

---

## 🏗️ 3. Folder Structure (Recommended)

```
src/
├── app/
│   └── store.js
├── features/
│   ├── counter/
│   │   ├── counterSlice.js
│   │   └── Counter.jsx
│   └── todos/
│       ├── todosSlice.js
│       └── Todos.jsx
└── index.jsx
```

---

## 🧩 4. Create a Slice

Each “slice” represents a domain of your app (e.g., counter, user, posts).

```js
// src/features/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

> 💡 Redux Toolkit uses **Immer** under the hood — so you can “mutate” state safely.

---

## 🧠 5. Configure the Store

```js
// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
```

---

## ⚛️ 6. Provide the Store to React

```jsx
// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

---

## 🎛️ 7. Use Redux State and Actions in Components

```jsx
// src/features/counter/Counter.jsx
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from "./counterSlice";

export default function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

---

## 🔁 8. Async Logic with createAsyncThunk

```js
// src/features/todos/todosSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=5"
  );
  return await res.json();
});

const todosSlice = createSlice({
  name: "todos",
  initialState: { list: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default todosSlice.reducer;
```

### Using it in a component:

```jsx
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos } from "./todosSlice";
import { useEffect } from "react";

export default function Todos() {
  const { list, status } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") dispatch(fetchTodos());
  }, [status, dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  return (
    <ul>
      {list.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

---

## 🧰 9. Combine Multiple Reducers

```js
// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import todosReducer from "../features/todos/todosSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
  },
});
```

---

## 🧩 10. Middleware & DevTools

`configureStore()` automatically includes:

- Redux Thunk
- Redux DevTools
- Serializability & immutability checks

Custom middleware example:

```js
export const store = configureStore({
  reducer: { counter: counterReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      console.log("Action:", action.type);
      return next(action);
    }),
});
```

---

## 🧠 11. TypeScript Example (Optional)

```ts
// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: { counter: counterReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 🔍 12. Debugging Tips

- Use **Redux DevTools Extension** in your browser
- Wrap console logs inside middleware
- Log async thunk lifecycle with `.pending`, `.fulfilled`, `.rejected`
- Use `store.subscribe()` for global state watchers (for debugging only)

---

## 🧱 13. Best Practices

✅ Group logic by **feature**, not file type
✅ Keep **state normalized** (avoid deeply nested data)
✅ Use `createAsyncThunk` for all async requests
✅ Keep selectors simple and reusable
✅ Never mutate props or non-slice state manually
✅ Use `redux-persist` if you need localStorage persistence

---

## 🧩 14. Common Add-ons

| Library         | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `redux-persist` | Persist Redux state to localStorage/sessionStorage |
| `redux-logger`  | Logs all actions in the console                    |
| `reselect`      | Memoized selectors for performance                 |
| `react-redux`   | Connects Redux to React components                 |

Example:

```bash
npm install redux-persist redux-logger reselect
```

---

## 🔗 15. Useful Resources

- [Redux Toolkit Official Docs](https://redux-toolkit.js.org/)
- [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
- [Immer Documentation](https://immerjs.github.io/immer/)
- [React-Redux Hooks API](https://react-redux.js.org/api/hooks)
- [Redux Essentials Tutorial](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)

---

✅ **Summary**

> Redux Toolkit = Modern Redux.
> Fewer lines, less boilerplate, safer state management.
> Perfect for medium-to-large React apps that need predictable global state and async control.

```

```
