/**
 * Sanitizes rich-text HTML from CMS/database before rendering with dangerouslySetInnerHTML.
 * Strips executable tags, inline event handlers, and unsafe URI schemes.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  return (
    html
      // Remove script, object, embed, applet, base, meta, link, form tags and their contents where applicable
      .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
      .replace(/<(script|object|embed|applet|base|meta|link|form)\b[^>]*>/gi, '')
      .replace(/<\/(script|object|embed|applet|base|meta|link|form)\s*>/gi, '')
      // Remove iframes except trusted video embeds (YouTube / Vimeo)
      .replace(/<iframe\b([^>]*)>[\s\S]*?<\/iframe\s*>/gi, (match, attrs) => {
        const srcMatch = attrs.match(/\bsrc\s*=\s*(['"])(.*?)\1/i);
        const src = srcMatch?.[2] || '';
        if (
          /^https:\/\/(www\.youtube\.com\/embed\/|player\.vimeo\.com\/video\/)/i.test(
            src,
          )
        ) {
          return match;
        }
        return '';
      })
      // Remove inline event handlers (e.g. onclick=, onerror=, onload=)
      .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      // Neutralize javascript:, vbscript:, and data:text/html URIs in href/src/action
      .replace(
        /\b(href|src|action|formaction|xlink:href)\s*=\s*(['"]?)\s*(?:javascript|vbscript|data\s*:\s*text\/html)\s*:[^'">\s]*/gi,
        '$1=$2#',
      )
  );
}
