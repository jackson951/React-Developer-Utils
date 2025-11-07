/**
 * classNames - Join class names conditionally.
 *
 * Supports:
 *  - Strings: 'btn primary'
 *  - Objects: { 'btn-active': isActive, 'disabled': isDisabled }
 *  - Arrays: ['btn', condition && 'btn-large']
 *  - Nested arrays
 *
 * Example:
 *   classNames('btn', { 'btn-active': isActive }, ['extra', 'classes'])
 *   => "btn btn-active extra classes"
 *
 * @param  {...any} args - Strings, objects, arrays
 * @returns {string} - Space-separated class string
 */
export function classNames(...args) {
  return args
    .flatMap((arg) => {
      if (!arg) return [];
      if (typeof arg === "string") return arg.split(" ");
      if (Array.isArray(arg)) return arg.flatMap((a) => classNames(a));
      if (typeof arg === "object") {
        return Object.entries(arg)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return [];
    })
    .join(" ");
}

// Example Usage:
// const btnClass = classNames('btn', { 'btn-active': isActive }, ['extra', 'classes']);
// Result: "btn btn-active extra classes"
export default classNames;
