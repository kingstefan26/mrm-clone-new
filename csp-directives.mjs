
// https://rodneylab.com/sveltekit-node-app-deploy/
const cspDirectives = {
  'base-uri': ["'self'"],
  'child-src': ["'self'"],
  'connect-src': ["'self'", 'ws://localhost:*'],
  // 'connect-src': ["'self'", 'ws://localhost:*', 'https://hcaptcha.com', 'https://*.hcaptcha.com'],
  'img-src': ["'self'", 'data:', 'blob:', 'https://*.kokoniara.software'],
  'font-src': ["'self'", 'data:', 'https://*.googleapis.com', 'https://fonts.gstatic.com'],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
  'frame-src': [
    "'self'"
    // "https://*.stripe.com",
    // "https://*.facebook.com",
    // "https://*.facebook.net",
    // 'https://hcaptcha.com',
    // 'https://*.hcaptcha.com',
  ],
  'manifest-src': ["'self'"],
  'media-src': ["'self'", 'data:'],
  'object-src': ["'none'"],
  'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
  // 'style-src': ["'self'", "'unsafe-inline'", 'https://hcaptcha.com', 'https://*.hcaptcha.com'],
  'default-src': [
    'self'
    // 'https://*.google.com',
    // 'https://*.googleapis.com',
    // 'https://*.firebase.com',
    // 'https://*.gstatic.com',
    // 'https://*.cloudfunctions.net',
    // 'https://*.algolia.net',
    // 'https://*.facebook.com',
    // 'https://*.facebook.net',
    // 'https://*.stripe.com',
    // 'https://*.sentry.io',
  ],
  'script-src': [
    'self'
    // 'https://*.stripe.com',
    // 'https://*.facebook.com',
    // 'https://*.facebook.net',
    // 'https://hcaptcha.com',
    // 'https://*.hcaptcha.com',
    // 'https://*.sentry.io',
    // 'https://polyfill.io',
  ],
  'worker-src': ["'self'"]
};
export default cspDirectives;

