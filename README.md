# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Deploy on shared hosting (FTP + Apache)

This project uses React Router with `BrowserRouter`, so deep links like `/chart?metal=24k` need an SPA fallback.

What is already configured:
- `public/.htaccess` is included and copied to `dist/.htaccess` during build.
- It rewrites unknown routes to `index.html` so React can handle routing.

Deploy steps:
1. Run a production build (`npm run build`).
2. Upload the **contents of `dist/`** to your host web root (for example `public_html/`).
3. Do not upload `src/` as your live site.
4. Verify by opening:
	- `/`
	- `/chart`
	- `/chart?metal=24k`

If the host still returns 404:
- Ensure Apache `mod_rewrite` is enabled.
- Ensure `.htaccess` files are allowed (`AllowOverride All` on server config).
