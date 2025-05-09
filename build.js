const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Build the React app
esbuild.build({
  entryPoints: ['src/popup/index.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'dist/index.js',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  loader: { 
    '.tsx': 'tsx', 
    '.ts': 'ts',
    '.css': 'css'  // Add explicit CSS loader
  },
}).catch(() => process.exit(1));

// Build the background script
esbuild.build({
  entryPoints: ['src/background.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'dist/background.js',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  loader: { '.ts': 'ts' },
}).catch(() => process.exit(1));

// Copy the HTML file as popup.html
fs.copyFileSync('src/popup/index.html', 'dist/popup.html');

// Copy the manifest
fs.copyFileSync('src/manifest.json', 'dist/manifest.json');

// Copy the icon
fs.copyFileSync('icon.png', 'dist/icon.png');

// Extract CSS from popup.css and save it separately
esbuild.build({
  entryPoints: ['src/popup/popup.css'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'dist/index.css',
}).catch(() => process.exit(1));

// Create icon sizes for Chrome
const sharp = require('sharp');
try {
  // Check if sharp module exists
  // If not, we'll skip icon resizing
  sharp(fs.readFileSync('icon.png'))
    .resize(16, 16)
    .toFile('dist/icon16.png')
    .then(() => {
      console.log('Created icon16.png');
    })
    .catch(err => {
      console.warn('Could not create icon16.png:', err);
    });

  sharp(fs.readFileSync('icon.png'))
    .resize(48, 48)
    .toFile('dist/icon48.png')
    .then(() => {
      console.log('Created icon48.png');
    })
    .catch(err => {
      console.warn('Could not create icon48.png:', err);
    });

  sharp(fs.readFileSync('icon.png'))
    .resize(128, 128)
    .toFile('dist/icon128.png')
    .then(() => {
      console.log('Created icon128.png');
    })
    .catch(err => {
      console.warn('Could not create icon128.png:', err);
    });
} catch (e) {
  console.warn('Icon resizing skipped. Install sharp package for icon resizing.');
}

// Copy any other assets if they exist
if (fs.existsSync('src/assets')) {
  if (!fs.existsSync('dist/assets')) {
    fs.mkdirSync('dist/assets');
  }
  
  const assets = fs.readdirSync('src/assets');
  assets.forEach(asset => {
    fs.copyFileSync(
      path.join('src/assets', asset),
      path.join('dist/assets', asset)
    );
  });
}

console.log('Build complete! Files are in the dist/ directory.'); 