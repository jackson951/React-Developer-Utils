/**
 * throttle - Limits how often a function can run
 *
 * Usage:
 *   const throttled = throttle(() => console.log('Called!'), 1000);
 *   window.addEventListener('resize', throttled);
 *
 * @param {Function} fn - Function to throttle
 * @param {number} wait - Minimum time (ms) between calls
 * @returns {Function} - Throttled function
 */
export function throttle(fn, wait = 1000) {
  let lastTime = 0;
  let timeoutId = null;

  return function (...args) {
    const now = Date.now();

    const remaining = wait - (now - lastTime);
    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// Example Usage:
// window.addEventListener('scroll', throttle(() => console.log('scrolling'), 200));
export default throttle;
