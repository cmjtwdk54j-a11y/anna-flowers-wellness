import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const securityHeaders = [
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // HSTS — force HTTPS for 2 years
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Limit referrer info sent to third parties
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features not used by this site
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://www.paypal.com")' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js needs unsafe-inline for styles; PayPal needs its own script domain.
      // unsafe-eval is only needed in dev (React Fast Refresh / devtools), never in production.
      `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV !== 'production' ? "'unsafe-eval'" : ''} https://*.paypal.com https://*.paypalobjects.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      // Allow images from all known sources
      "img-src 'self' data: blob: https://images.unsplash.com https://*.public.blob.vercel-storage.com https://vgbujcuwptvheqijyjbe.supabase.co https://*.paypal.com",
      // API calls: own backend + PayPal
      "connect-src 'self' https://*.paypal.com https://api-m.sandbox.paypal.com https://api-m.paypal.com https://*.public.blob.vercel-storage.com",
      // PayPal popup/iframe
      "frame-src https://*.paypal.com",
      // Block plugins (Flash etc.)
      "object-src 'none'",
      // Lock down <base> tag
      "base-uri 'self'",
      // Only allow forms to submit to same origin
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'vgbujcuwptvheqijyjbe.supabase.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
