import { defineConfig } from 'vite'
import { crx, defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
  manifest_version: 3,
  name: 'search-shortcut',
  description: 'search-shortcut imitation',
  version: '0.0.1',
  icons: {
    16: 'public/icon/16.png',
    48: 'public/icon/48.png',
    128: 'public/icon/128.png',
  },
  action: {
    default_icon: {
      16: 'public/icon/16.png',
      48: 'public/icon/48.png',
      128: 'public/icon/128.png',
    },
  },
  content_scripts: [
    {
      matches: ['*://*.google.com/search?*', '*://*.google.co.jp/search?*'],
      js: ['src/content.ts'],
      run_at: 'document_end',
    },
  ],
  permissions: ['activeTab'],
  host_permissions: ['*://*.google.com/*', '*://*.google.co.jp/*'],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'",
  },
})

export default defineConfig({
  base: './',
  plugins: [crx({ manifest })],
})
