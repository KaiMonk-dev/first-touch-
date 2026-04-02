/**
 * Trigger the GHL (GoHighLevel) Voice AI widget.
 * Searches shadow DOM first, then fallback selectors.
 */
export function triggerGHLWidget() {
  const trigger =
    document.querySelector('chat-widget')?.shadowRoot?.querySelector('button')
    || document.querySelector('[class*="chat-widget"] button')
    || document.querySelector('iframe[src*="leadconnectorhq"]')?.parentElement?.querySelector('button')
  if (trigger) trigger.click()
}
