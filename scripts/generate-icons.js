const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#006d67" />
      <stop offset="100%" stop-color="#004a46" />
    </linearGradient>
    <linearGradient id="leaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#79e27c" />
      <stop offset="100%" stop-color="#22c55e" />
    </linearGradient>
    <linearGradient id="cyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>

  <!-- Background rounded squircle -->
  <rect width="512" height="512" rx="112" fill="url(#bg)" />

  <!-- Inner subtle glow circle -->
  <circle cx="256" cy="256" r="190" fill="#ffffff" fill-opacity="0.04" />

  <!-- Kemenkes / SKDR Stylized Logo Elements -->
  <g transform="translate(256, 230) scale(1.6)">
    <!-- Cyan upper left petal -->
    <path d="M -35 -45 C -55 -45 -70 -30 -70 -10 C -70 15 -45 25 -25 25 C -5 25 5 10 5 -10 C 5 -30 -15 -45 -35 -45 Z" fill="url(#cyan)" opacity="0.95" />
    
    <!-- Deep teal lower petal -->
    <path d="M -45 10 C -65 10 -75 25 -75 45 C -75 65 -50 80 -30 80 C -5 80 10 65 10 45 C 10 25 -20 10 -45 10 Z" fill="#00a39e" opacity="0.9" />

    <!-- Bright green right wing -->
    <path d="M 20 -40 C 50 -40 75 -15 75 20 C 75 55 45 80 15 80 C -5 80 0 65 15 50 C 35 30 35 -10 15 -25 C 5 -32 5 -40 20 -40 Z" fill="url(#leaf)" />

    <!-- Center pulse dot -->
    <circle cx="-10" cy="18" r="10" fill="#ffffff" />
  </g>

  <!-- Text badge SKDR -->
  <text x="256" y="420" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">SKDR</text>
  <text x="256" y="450" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" fill="#79e27c" text-anchor="middle" letter-spacing="2">MOBILE PWA</text>
</svg>
`;

async function generate() {
  const publicIconsDir = path.join(__dirname, '..', 'public', 'icons');
  if (!fs.existsSync(publicIconsDir)) {
    fs.mkdirSync(publicIconsDir, { recursive: true });
  }

  // Save SVG
  fs.writeFileSync(path.join(publicIconsDir, 'icon.svg'), svgIcon.trim());

  // Generate 192x192
  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicIconsDir, 'icon-192x192.png'));

  // Generate 512x512
  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicIconsDir, 'icon-512x512.png'));

  // Generate apple-touch-icon 180x180
  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicIconsDir, 'apple-touch-icon.png'));

  // Generate favicon 32x32
  await sharp(Buffer.from(svgIcon))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicIconsDir, 'favicon-32x32.png'));

  console.log('PWA icons generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});

