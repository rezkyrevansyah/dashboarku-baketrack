import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BakeTrack Dashboard',
    short_name: 'BakeTrack',
    description: 'Dashboard Penjualan & Stok Bakery',
    start_url: '/input',
    display: 'standalone',
    background_color: '#F5E6EE',
    theme_color: '#F5E6EE',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
