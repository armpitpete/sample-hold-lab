import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'sample-hold-lab-destination-selector',
      transformIndexHtml(html) {
        return html.replace(
          '</body>',
          '    <script type="module" src="/src/destination-selector.ts"></script>\n  </body>',
        );
      },
    },
  ],
});
