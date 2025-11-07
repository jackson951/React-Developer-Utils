/**
 * debounce - Returns a debounced version of a function
 *
 * Usage:
 *   const handleResize = debounce(() => { console.log(window.innerWidth); }, 300);
 *   window.addEventListener('resize', handleResize);
 *
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;

  return function (...args) {
    const context = this;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
