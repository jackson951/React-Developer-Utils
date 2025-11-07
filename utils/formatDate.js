/**
 * formatDate - Format a date into a readable string
 *
 * Usage:
 *   formatDate(new Date(), { locale: 'en-US', options: { dateStyle: 'medium' } })
 *   => "Nov 7, 2025"
 *
 *   formatDate('2025-11-07T12:00:00Z', { relative: true })
 *   => "2 hours ago" (if relative option is true)
 *
 * @param {Date | string | number} date - Input date
 * @param {Object} options
 * @param {string} options.locale - Locale string, default 'en-US'
 * @param {Object} options.options - Intl.DateTimeFormat options
 * @param {boolean} options.relative - Whether to return relative time (e.g., "2 hours ago")
 * @returns {string}
 */
export function formatDate(
  date,
  { locale = "en-US", options = {}, relative = false } = {}
) {
  const d = new Date(date);
  if (isNaN(d)) return "";

  if (relative) {
    const now = Date.now();
    const diff = now - d.getTime(); // milliseconds
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    ...options,
  }).format(d);
}

// Example Usage:
// formatDate(new Date(), { relative: true }) => "just now" or "2 hours ago"
// formatDate('2025-11-07T12:00:00Z') => "Nov 7, 2025"
export default formatDate;
