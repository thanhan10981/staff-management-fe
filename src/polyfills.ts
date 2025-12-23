/***************************************************************************************************
 * BROWSER POLYFILLS & FIXES
 */

/** Fix lỗi requestAnimationFrame khi chạy sai môi trường (SSR hoặc Node) */
(window as any).requestAnimationFrame = 
  (window as any).requestAnimationFrame || 
  ((callback: Function) => setTimeout(callback, 0));

/** Các polyfill khác nếu cần (mày cứ để nguyên) */
// import 'zone.js/dist/zone';  // Đã được import ở main.ts rồi