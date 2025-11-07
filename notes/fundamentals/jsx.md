### 📘 **File:** `notes/fundamentals/jsx.md`

````markdown
# ✨ JSX — JavaScript XML in React

> JSX is a syntax extension for JavaScript. It allows writing **HTML-like code** inside JavaScript and is transformed to `React.createElement` calls by Babel.

---

## 🚀 1. Basic JSX

```jsx
const element = <h1>Hello, world!</h1>;
```
````

- JSX must have a **single parent element**:

```jsx
const element = (
  <div>
    <h1>Hello</h1>
    <p>World</p>
  </div>
);
```

- Use **Fragments** to avoid extra DOM nodes:

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

Use `{}` to embed JavaScript expressions:

```jsx
const name = "Jackson";
const element = <h1>Hello, {name}!</h1>;
```

- You can use any valid JS expression:

```jsx
const x = 5;
const element = <p>{x + 10}</p>;
```

- Conditional rendering:

```jsx
const isLoggedIn = true;
const greeting = <p>{isLoggedIn ? "Welcome!" : "Please log in"}</p>;
```

---

## 🧩 3. Attributes in JSX

- JSX uses **camelCase** for HTML attributes:

```jsx
<img src="logo.png" alt="Logo" />
<input type="text" maxLength={10} />
<button className="btn">Click</button>
```

- Boolean attributes:

```jsx
<input type="checkbox" checked={true} />
```

- Spread props:

```jsx
const props = { type: "text", placeholder: "Enter name" };
<input {...props} />;
```

---

## 🌐 4. Children

Components can have **nested content**:

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card>
  <h2>Title</h2>
  <p>Some description</p>
</Card>;
```

- `children` can be **string, number, element, array of elements**.

---

## 🔄 5. JSX is an Expression

- JSX can be stored in variables, passed as arguments, or returned from functions:

```jsx
const title = <h1>Hello JSX</h1>;

function renderTitle() {
  return <h2>Another Title</h2>;
}

const element = <div>{renderTitle()}</div>;
```

---

## 🧪 6. Comments in JSX

- Single-line:

```jsx
{
  /* This is a comment */
}
```

- Multi-line:

```jsx
{
  /*
  This is a 
  multi-line comment
*/
}
```

> Regular JS comments (`//`) do **not** work inside JSX.

---

## ⚡ 7. Rendering Lists in JSX

```jsx
const items = ["Apple", "Banana", "Cherry"];
const list = (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

✅ Always provide a **unique `key`** for list items to optimize rendering.

---

## 🧱 8. Conditional Rendering

- **Ternary Operator:**

```jsx
const isOnline = true;
<p>{isOnline ? "Online" : "Offline"}</p>;
```

- **Short-circuit Operator:**

```jsx
{
  isOnline && <p>User is online</p>;
}
```

---

## 🔧 9. Styling in JSX

- **Inline styles** (camelCase):

```jsx
const style = { color: "red", fontSize: "20px" };
<p style={style}>Styled text</p>;
```

- **Class name** uses `className` instead of `class`:

```jsx
<div className="container">Content</div>
```

- **Dynamic classes**:

```jsx
const isActive = true;
<div className={`card ${isActive ? "active" : ""}`}>Content</div>;
```

---

## 🧭 10. JSX vs HTML Differences

| HTML        | JSX             |
| ----------- | --------------- |
| class       | className       |
| for         | htmlFor         |
| tabindex    | tabIndex        |
| onclick     | onClick         |
| maxlength   | maxLength       |
| style="..." | style={{ ... }} |

- **Self-closing tags are required**:

```jsx
<img src="logo.png" alt="Logo" />
<br />
<hr />
```

---

## 💡 11. Best Practices

- Always **wrap adjacent JSX** in a single parent or fragment
- Use **camelCase** for attributes
- Use **curly braces `{}`** for dynamic expressions
- Provide **unique keys** for lists
- Keep JSX **readable** and break into smaller components
- Avoid inline functions in render for heavy components (performance tip)

---

## 🔗 12. Resources

- [React Docs – JSX](https://reactjs.org/docs/introducing-jsx.html)
- [React Docs – Rendering Elements](https://reactjs.org/docs/rendering-elements.html)
- [React Docs – Lists and Keys](https://reactjs.org/docs/lists-and-keys.html)
- [React JSX FAQ](https://reactjs.org/docs/faq-internals.html)

---

✅ **Summary**

> JSX allows you to write HTML-like syntax inside JavaScript, making React development intuitive and expressive.
> Remember: JSX is **just syntactic sugar** for `React.createElement()`.
