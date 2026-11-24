import { cpSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const projectRoot = import.meta.dirname;
const pageNames = [
  'index',
  'home',
  'about',
  'works',
  'achievements',
  'contact',
  'budget',
];

const pageInputs = Object.fromEntries(
  pageNames.map((pageName) => [
    pageName,
    resolve(projectRoot, `${pageName}.html`),
  ]),
);

const copyPortfolioAssets = {
  name: 'copy-portfolio-assets',
  closeBundle() {
    const outputDirectory = resolve(projectRoot, 'dist');

    for (const assetFolder of ['images', 'music']) {
      cpSync(
        resolve(projectRoot, assetFolder),
        resolve(outputDirectory, assetFolder),
        {
          recursive: true,
          filter: (sourcePath) => sourcePath !== resolve(projectRoot, 'images', 'butterfly.png'),
        },
      );
    }
  },
};

export default defineConfig({
  base: './',
  plugins: [react(), copyPortfolioAssets],
  build: {
    rollupOptions: {
      input: pageInputs,
    },
  },
});
