### 📘 **File:** `notes/ecosystem/tanstack-query.md`

````markdown
# ⚡ TanStack Query (React Query) — Ultimate Guide

> TanStack Query (formerly React Query) is a powerful data-fetching and state management library for React that makes server-state management effortless.

---

## 🚀 1. Installation

```bash
npm install @tanstack/react-query
npm install axios
```
````

Optional Devtools:

```bash
npm install @tanstack/react-query-devtools
```

---

## 🧱 2. Basic Setup

Create a **React Query Client** and wrap your app:

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

## 🌐 3. Fetching Data with `useQuery`

```jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUsers = async () => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return data;
};

export default function UsersList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

✅ **Features:**

- Automatic caching
- Stale-while-revalidate
- Refetch on focus/reconnect

---

## 🧠 4. Query Keys (Best Practice)

Query keys uniquely identify each data source.

```jsx
useQuery({ queryKey: ["user", userId], queryFn: () => fetchUser(userId) });
```

| Example Key                       | Represents     |
| --------------------------------- | -------------- |
| `["users"]`                       | All users      |
| `["user", id]`                    | Specific user  |
| `["posts", { filter: "active" }]` | Filtered posts |

---

## 💾 5. Mutations (POST / PUT / DELETE)

```jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const addUser = async (newUser) => {
  return await axios.post("/api/users", newUser);
};

export default function AddUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); // refresh list
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ name: "Jackson" })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Adding..." : "Add User"}
    </button>
  );
}
```

✅ **Mutation Lifecycle:**

- `onMutate` → Optimistic update
- `onError` → Rollback
- `onSuccess` → Invalidate cache

---

## ♻️ 6. Cache & Invalidation

### Invalidate:

```js
queryClient.invalidateQueries(["users"]);
```

### Refetch manually:

```js
queryClient.refetchQueries(["users"]);
```

### Remove cache:

```js
queryClient.removeQueries(["users"]);
```

### Prefetch (for next route):

```js
queryClient.prefetchQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
});
```

---

## 📆 7. Refetch Behavior

| Option                 | Description                                   |
| ---------------------- | --------------------------------------------- |
| `refetchOnWindowFocus` | Default `true` — refresh when tab gains focus |
| `refetchOnReconnect`   | Default `true`                                |
| `refetchInterval`      | Polling interval in ms                        |
| `staleTime`            | Time data stays fresh (in ms)                 |

Example:

```jsx
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  refetchOnWindowFocus: false,
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

---

## 📜 8. Pagination Example

```jsx
const fetchUsers = async (page) => {
  const { data } = await axios.get(`/api/users?page=${page}`);
  return data;
};

export default function PaginatedUsers() {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
    keepPreviousData: true,
  });

  return (
    <div>
      {data?.users.map((u) => (
        <p key={u.id}>{u.name}</p>
      ))}
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
        Prev
      </button>
      <button onClick={() => setPage((p) => p + 1)} disabled={!data?.hasMore}>
        Next
      </button>
      {isFetching && <span> Loading...</span>}
    </div>
  );
}
```

✅ `keepPreviousData` keeps old data visible during refetch.

---

## 🔁 9. Infinite Scroll Example

```jsx
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchPosts = async ({ pageParam = 1 }) => {
  const { data } = await axios.get(`/api/posts?page=${pageParam}`);
  return data;
};

function InfinitePosts() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
    });

  return (
    <>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map((p) => (
            <div key={p.id}>{p.title}</div>
          ))}
        </React.Fragment>
      ))}
      <button
        onClick={fetchNextPage}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading..."
          : hasNextPage
          ? "Load More"
          : "No More Posts"}
      </button>
    </>
  );
}
```

---

## 🪄 10. Optimistic Updates Example

```jsx
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (updatedUser) => {
    await queryClient.cancelQueries(["users"]);
    const previousUsers = queryClient.getQueryData(["users"]);
    queryClient.setQueryData(["users"], (old) =>
      old.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    return { previousUsers };
  },
  onError: (err, _, context) => {
    queryClient.setQueryData(["users"], context.previousUsers);
  },
  onSettled: () => {
    queryClient.invalidateQueries(["users"]);
  },
});
```

✅ Smooth UI even before server confirmation!

---

## 🧰 11. Devtools

```jsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>;
```

> 💡 Use Devtools to inspect cache, invalidate queries, and debug states.

---

## ⚙️ 12. QueryClient Configuration

```js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute
    },
  },
});
```

---

## 💡 13. Common Patterns

✅ Prefetch data on route hover
✅ Use `enabled: false` for conditional fetching
✅ Use query keys consistently
✅ Separate query functions into `api/` folder
✅ Combine React Query with **Zustand or Context** for local state

---

## 🧱 14. Directory Example

```
src/
├── api/
│   └── users.js
├── hooks/
│   ├── useUsers.js
│   └── useAddUser.js
├── components/
│   ├── UsersList.jsx
│   └── AddUser.jsx
└── main.jsx
```

---

## 🚨 15. Common Issues

| Problem                                      | Cause / Fix                                           |
| -------------------------------------------- | ----------------------------------------------------- |
| "Query not re-fetching"                      | Wrong query key or no invalidation                    |
| "Infinite loop"                              | `queryFn` not memoized (wrap in arrow or useCallback) |
| "Error: Cannot read properties of undefined" | `data` may be undefined before fetch finishes         |

---

## 🧭 16. Best Practices

✅ Always use **unique and descriptive** query keys
✅ **Group queries** logically (`["todos", userId]`)
✅ **Invalidate** only necessary queries after mutations
✅ Use **`staleTime`** wisely to balance freshness vs performance
✅ Avoid `useEffect` for fetching — use `useQuery` instead
✅ Use **Devtools** in development for debugging

---

## 🔗 17. Resources

- [Official Docs](https://tanstack.com/query/latest/docs/react/overview)
- [TanStack Query GitHub](https://github.com/TanStack/query)
- [React Query Patterns](https://tkdodo.eu/blog/practical-react-query)
- [TanStack Query YouTube Playlist](https://www.youtube.com/@tannerlinsley)
- [Axios + React Query Guide](https://react-query.tanstack.com/guides/axios)

---

✅ **Summary**

> TanStack Query = effortless server state.
> Fetch, cache, and sync your backend with React — without Redux or context bloat.
> Perfect for scalable, production-ready React apps.
