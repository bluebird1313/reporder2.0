/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed deprecated appDir setting - Next.js 15 uses App Router by default
  
  // Allow ngrok and other development origins
  allowedDevOrigins: [
    '4dc5-67-79-54-151.ngrok-free.app',
    '.ngrok-free.app',
    '.ngrok.io'
  ]
}

module.exports = nextConfig 