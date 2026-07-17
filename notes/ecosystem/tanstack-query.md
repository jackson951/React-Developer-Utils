# ⚡ TanStack Query (React Query) — The Ultimate Guide

> TanStack Query (formerly React Query) is the go‑to data‑fetching and server‑state management library for React. It makes working with asynchronous server data effortless, replacing manual `useEffect`/`fetch` patterns with a declarative, cache‑first API.

---

## 🚀 1. Installation

```bash
npm install @tanstack/react-query
# optional: use your preferred HTTP client (fetch, axios, ky, etc.)
```

Devtools (highly recommended):

```bash
npm install @tanstack/react-query-devtools
```

---

## 🧱 2. Basic Setup

Create a `QueryClient` and wrap your app:

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

---

## 🌐 3. Fetching Data with `useQuery`

```tsx
import { useQuery } from "@tanstack/react-query";

// Separate API functions (e.g., in /api/users.ts)
const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export default function UsersList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading…</p>;
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

✅ **Features built‑in:**
- Automatic caching & background refetching
- Request deduplication
- Stale‑while‑revalidate strategy
- Refetch on window focus / network reconnect (configurable)

---

## 🧠 4. Query Keys (Best Practice)

Query keys uniquely identify each data source and its dependencies.

```tsx
// Simple list
useQuery({ queryKey: ["users"], queryFn: fetchUsers });

// Detail with parameter
useQuery({ queryKey: ["user", userId], queryFn: () => fetchUser(userId) });

// With filters
useQuery({ queryKey: ["posts", { status: "draft" }], queryFn: fetchDraftPosts });
```

✅ **Rules:**
- Use **descriptive, hierarchical arrays**.
- Include all variables that the query depends on.
- `queryFn` receives the key, but it’s usually cleaner to pass via closure.

---

## 💾 5. Mutations (POST / PUT / DELETE)

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addUser = async (newUser: Partial<User>) => {
  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to add user");
  return res.json();
};

export default function AddUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      // Invalidate the users list to refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ name: "Jackson" })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Adding…" : "Add User"}
    </button>
  );
}
```

✅ **Mutation lifecycle hooks:**
- `onMutate` → for optimistic updates
- `onError` → rollback
- `onSuccess` / `onSettled` → invalidate or update cache

---

## ♻️ 6. Cache Management

| Action               | Code                                                                 |
| -------------------- | -------------------------------------------------------------------- |
| Invalidate queries   | `queryClient.invalidateQueries({ queryKey: ["users"] })`             |
| Manual refetch       | `queryClient.refetchQueries({ queryKey: ["users"] })`                |
| Remove from cache    | `queryClient.removeQueries({ queryKey: ["users"] })`                 |
| Prefetch (hover)     | `queryClient.prefetchQuery({ queryKey: ["post", id], queryFn })`     |
| Set cache directly   | `queryClient.setQueryData(["user", id], updatedUser)`                |

> 💡 Prefetch data on link hover to make navigation feel instant.

---

## 📆 7. Refetch Control & Stale Time

| Option                 | Description                                   |
| ---------------------- | --------------------------------------------- |
| `staleTime`            | Time in ms that data is considered fresh      |
| `gcTime`               | Time before inactive data is garbage collected |
| `refetchOnWindowFocus` | Refetch when tab regains focus (default true)  |
| `refetchOnReconnect`   | Refetch on network recovery                    |
| `refetchInterval`      | Polling interval in ms                         |

```tsx
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  refetchOnWindowFocus: false,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 📜 8. Pagination

```tsx
const fetchUsers = async (page: number) => {
  const res = await fetch(`/api/users?page=${page}`);
  return res.json();
};

export default function PaginatedUsers() {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
    placeholderData: keepPreviousData, // V5: use placeholderData instead of keepPreviousData
  });

  return (
    <div>
      {data?.users.map((u) => <p key={u.id}>{u.name}</p>)}
      <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
        Prev
      </button>
      <button onClick={() => setPage((p) => p + 1)} disabled={!data?.hasMore}>
        Next
      </button>
      {isFetching && <span> Loading…</span>}
    </div>
  );
}
```

✅ Use `placeholderData: keepPreviousData` to avoid UI flicker while fetching new page.

---

## 🔁 9. Infinite Scroll

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchPosts = async ({ pageParam = 1 }) => {
  const res = await fetch(`/api/posts?page=${pageParam}`);
  return res.json();
};

function InfinitePosts() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  return (
    <>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map((p) => <div key={p.id}>{p.title}</div>)}
        </React.Fragment>
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? "Loading…" : hasNextPage ? "Load More" : "No More Posts"}
      </button>
    </>
  );
}
```

---

## 🪄 10. Optimistic Updates

```tsx
const updateUser = async (user) => { /* API call */ };

const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (updatedUser) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["users"] });
    // Snapshot previous value
    const previousUsers = queryClient.getQueryData(["users"]);
    // Optimistically update cache
    queryClient.setQueryData(["users"], (old) =>
      old.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    return { previousUsers };
  },
  onError: (err, updatedUser, context) => {
    // Rollback on error
    queryClient.setQueryData(["users"], context?.previousUsers);
  },
  onSettled: () => {
    // Refetch to ensure server state
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
```

✅ The UI updates instantly, and rolls back gracefully if the mutation fails.

---

## 🧰 11. Devtools

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

🔍 Inspect cached data, view query states, and manually trigger refetches during development.

---

## ⚙️ 12. QueryClient Defaults

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

---

## 🧩 13. TypeScript & API Layer

```ts
// api/users.ts
export const fetchUser = async (id: number): Promise<User> => {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
};

// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../api/users";

export function useUser(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id, // only run when id is truthy
  });
}
```

✅ Keep API functions in a dedicated `api/` folder and hook wrappers in `hooks/` for clean separation.

---

## 🌐 14. Server‑Side Rendering (Next.js App Router)

TanStack Query works perfectly with React Server Components and the Next.js App Router. For server‑side prefetching, use:

```tsx
// app/users/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchUsers } from "@/api/users";
import UsersList from "./UsersList";

export default async function UsersPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ["users"], queryFn: fetchUsers });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersList />
    </HydrationBoundary>
  );
}
```

This avoids flash of loading states and delivers fully rendered HTML.

---

## 💡 15. Common Patterns & Best Practices

- **Conditional fetching**: `useQuery({ ..., enabled: !!userId })`
- **Dependent queries**: Chain one query after another using `enabled` based on the first’s data.
- **Avoid `useEffect` for fetching** — always prefer `useQuery`.
- **Separate fetching logic** into dedicated `api/` functions (easier testing & reuse).
- **Combine with Zustand** for client‑only global UI state, and let TanStack Query manage all server state.
- **Suspense support**: Use `useSuspenseQuery` (v5+) to integrate with React Suspense boundaries.

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";

function Users() {
  const { data } = useSuspenseQuery({ queryKey: ["users"], queryFn: fetchUsers });
  // component suspends until data is ready
  return <ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

---

## 🧭 16. Common Pitfalls

| Issue                                       | Cause / Fix                                                        |
| ------------------------------------------- | ------------------------------------------------------------------ |
| "Query not re‑fetching"                     | Query key mismatch or missing invalidation                         |
| "Infinite loop"                             | `queryFn` reference changes on every render — memoize or define outside component |
| "data is undefined"                         | Check `isLoading`/`isSuccess` before accessing `data`              |
| Missing `queryKey` in cache operations      | Use exact same key structure in `invalidateQueries`/`setQueryData` |

---

## 🔗 17. Resources

- [Official Docs](https://tanstack.com/query/latest)
- [TanStack Query GitHub](https://github.com/TanStack/query)
- [Practical React Query (TkDodo’s blog)](https://tkdodo.eu/blog/practical-react-query)
- [Suspense & React Query](https://tanstack.com/query/latest/docs/framework/react/guides/suspense)
- [Next.js + TanStack Query integration](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)

---

## ✅ Summary

> TanStack Query turns complex server‑state management into a declarative, performant, and developer‑friendly experience.  
> **Fetch, cache, synchronise, and update** your backend data without touching `useEffect` or manual loading flags.  
> It’s the backbone of modern, scalable React applications.
```
