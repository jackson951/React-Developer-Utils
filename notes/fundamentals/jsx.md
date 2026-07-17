# ✨ JSX — JavaScript XML in React

> JSX is a syntax extension for JavaScript that lets you write HTML‑like code directly in your JavaScript files.  
> It’s transformed by tools like Babel into `React.createElement` calls, and it’s the foundation of every React component.

---

## 🚀 1. Basic JSX

```jsx
const element = <h1>Hello, world!</h1>;
```

JSX must have a **single parent element**:

```jsx
const element = (
  <div>
    <h1>Hello</h1>
    <p>World</p>
  </div>
);
```

Use **Fragments** (`<>…</>`) to avoid adding unnecessary DOM nodes:

```jsx
const element = (
  <>
    <h1>Hello</h1>
    <p>World</p>
  </>
);
```

---

## ⚙️ 2. Embedding Expressions

Wrap any valid JavaScript expression in curly braces `{}`:

```jsx
const name = "Jackson";
const element = <h1>Hello, {name}!</h1>;

const x = 5;
const element2 = <p>{x + 10}</p>;
```

Conditional rendering with ternary operator:

```jsx
const isLoggedIn = true;
const greeting = <p>{isLoggedIn ? "Welcome!" : "Please log in"}</p>;
```

---

## 🧩 3. Attributes in JSX

JSX uses **camelCase** for HTML attributes:

```jsx
<img src="logo.png" alt="Logo" />
<input type="text" maxLength={10} />
<button className="btn">Click</button>   // class → className
<label htmlFor="email">Email</label>     // for → htmlFor
```

Boolean attributes:

```jsx
<input type="checkbox" checked={true} />
```

Spread props with the spread operator:

```jsx
const props = { type: "text", placeholder: "Enter name" };
<input {...props} />;
```

---

## 🌐 4. Children

Components can receive nested content via the special `children` prop:

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Title</h2>
  <p>Some description</p>
</Card>
```

`children` can be a string, number, single element, or an array of elements.

---

## 🔄 5. JSX Is an Expression

JSX can be assigned to variables, passed as arguments, or returned from functions:

```jsx
const title = <h1>Hello JSX</h1>;

function renderTitle() {
  return <h2>Another Title</h2>;
}

const element = <div>{renderTitle()}</div>;
```

---

## 🧪 6. Comments in JSX

JavaScript comments (`//`, `/* */`) don’t work inside JSX tags.  
Use block comments inside curly braces instead:

```jsx
{
  /* This is a comment */
}
{
  /*
    Multi‑line
    comment
  */
}
```

---

## ⚡ 7. Rendering Lists

Map over arrays and always provide a **stable, unique key**:

```jsx
const items = ["Apple", "Banana", "Cherry"];
const list = (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
      // use item.id when available instead of index
    ))}
  </ul>
);
```

---

## 🧱 8. Conditional Rendering Patterns

- **Ternary operator**:
  ```jsx
  <p>{isOnline ? "Online" : "Offline"}</p>
  ```

- **Short‑circuit evaluation** (`&&`):
  ```jsx
  {isOnline && <p>User is online</p>}
  ```

- **Early return** in components (cleaner for complex logic):
  ```jsx
  if (!data) return <p>Loading…</p>;
  return <UserProfile user={data} />;
  ```

---

## 🔧 9. Styling in JSX

- **Inline styles** – object with camelCase properties:
  ```jsx
  const style = { color: "red", fontSize: "20px" };
  <p style={style}>Styled text</p>
  ```

- **Class names** – `className` instead of `class`:
  ```jsx
  <div className="container">Content</div>
  ```

- **Dynamic classes** (template literals or `clsx`/`cn`):
  ```jsx
  const isActive = true;
  <div className={`card ${isActive ? "active" : ""}`}>Content</div>
  ```

---

## 🧭 10. JSX vs HTML – Quick Differences

| HTML          | JSX               |
| ------------- | ----------------- |
| `class`       | `className`       |
| `for`         | `htmlFor`         |
| `tabindex`    | `tabIndex`        |
| `onclick`     | `onClick`         |
| `maxlength`   | `maxLength`       |
| `style="..."` | `style={{ … }}`   |

Self‑closing tags are **mandatory** in JSX:

```jsx
<img src="logo.png" alt="Logo" />
<br />
<hr />
```

---

## 💡 11. Best Practices

- Always wrap adjacent JSX in a **single parent or Fragment**.
- Use **camelCase** for attributes.
- Embed expressions with **curly braces `{}`**.
- Provide **unique keys** for list items.
- Keep JSX **readable** – extract complex logic into variables or components.
- Avoid defining functions/objects directly in JSX props when they may break memoisation (pass stable references).

---

## 🔗 12. Resources

- [React Docs: Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- [React Docs: JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)
- [React Docs: Rendering Lists](https://react.dev/learn/rendering-lists)
- [React TypeScript Cheatsheet – JSX](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/jsx/)

---

✅ **Summary**

> JSX makes React component code look like the UI it describes – HTML‑like syntax combined with JavaScript’s full power.  
> Remember: JSX is syntactic sugar for `React.createElement()` (or the newer JSX transform), and it’s the bedrock of every React view.
```
