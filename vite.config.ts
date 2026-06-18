import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'sample-hold-lab-visual-modules',
      transformIndexHtml(html) {
        return html.replace(
          '</body>',
          '    <script type="module" src="/src/destination-selector.ts"></script>\n    <script type="module" src="/src/patch-summary.ts"></script>\n    <script type="module" src="/src/audio-safety-controls.ts"></script>\n  </body>',
        );
      },
    },
  ],
});
