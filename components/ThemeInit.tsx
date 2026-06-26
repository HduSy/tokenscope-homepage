// Inline script run before paint to set data-theme="dark|light" on <html>,
// using a persisted value if any, otherwise the system preference. Rendered
// inside <head> via dangerouslySetInnerHTML so it executes synchronously and
// avoids the theme-flash on first paint.

const SCRIPT = `(function(){try{var s=localStorage.getItem('tokenscope-theme');if(s==='dark'||s==='light'){document.documentElement.setAttribute('data-theme',s);return}}catch(e){}var sys=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',sys)})();`;

export function ThemeInit() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
