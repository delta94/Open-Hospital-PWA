module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    "**/*.{svg,ico,png,html,webmanifest,css,js}"
  ],
  "globIgnores": [
    "**/sw*.js"     //DO NOT precache any versioning of the service worker file!
  ],
  "swDest": "public/sw.js",
  "swSrc": "src/sw-inject.js",
  
  //"navigateFallback": "index.html",
  //"cleanupOutdatedCaches": true,
  "maximumFileSizeToCacheInBytes": 5 * 1024 * 1024 //do not precache files bigger than 5MB
};