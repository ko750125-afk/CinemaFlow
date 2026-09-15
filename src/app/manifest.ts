import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CinemaFlow',
    short_name: 'CinemaFlow',
    description: '실시간 영화탐색과 shadcn 컴포넌트 학습을 위한 플랫폼',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/icon-512x512.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
