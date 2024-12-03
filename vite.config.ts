import { crx, defineManifest } from '@nico-martin/crxjs-vite-plugin';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

import { version, title, description } from './package.json';

const [major, minor, patch, label = '0'] = version
  .replace(/[^\d.-]+/g, '')
  .split(/[.-]/);

const manifest = defineManifest(async (env) => ({
  name: (env.mode === 'staging' ? '[INTERNAL] ' : '') + title,
  description,
  manifest_version: 3,
  background: {
    service_worker: 'src/serviceWorker/serviceWorker.ts',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/contentScript/contentScript.ts'],
    },
  ],
  permissions: ['aiLanguageModelOriginTrial', 'activeTab'],
  trial_tokens: [
    'AhQwihN/6tvpHCMPUcXE/k4eEmugYRr5RNRr16r9zixTUDqtVhnIVopBz3JpT63umN/Ih2hPWnLjBzIAy7oUjQcAAAB4eyJvcmlnaW4iOiJjaHJvbWUtZXh0ZW5zaW9uOi8vamxrampramFhbHBvZG5nZGlmYWZpamttbW1rZmJuZmUiLCJmZWF0dXJlIjoiQUlQcm9tcHRBUElGb3JFeHRlbnNpb24iLCJleHBpcnkiOjE3NjA0ODYzOTl9',
  ],
  action: {
    default_title: 'Ask my Website',
    default_popup: 'src/popup.html',
    default_icon: {
      '16': 'src/icons/16x.png',
      '32': 'src/icons/32x.png',
      '48': 'src/icons/48x.png',
      '128': 'src/icons/128x.png',
    },
  },
  icons: {
    '16': 'src/icons/16x.png',
    '32': 'src/icons/32x.png',
    '48': 'src/icons/48x.png',
    '128': 'src/icons/128x.png',
  },
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
}));

export default defineConfig((config) => {
  console.log('CONFIG', config);
  return {
    plugins: [preact(), crx({ manifest })],
    ...(config.mode === 'development'
      ? {
          build: {
            rollupOptions: {
              output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
              },
            },
          },
        }
      : {}),
  };
});
