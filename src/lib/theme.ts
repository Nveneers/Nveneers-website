export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "nveneer-theme";
// Runs before paint; storage may be unavailable in private/restricted contexts.
export const themeInitScript = `(function(){var t='light';try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');if(s==='dark')t='dark'}catch(e){}document.documentElement.dataset.theme=t})()`;
