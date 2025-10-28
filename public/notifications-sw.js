// Service Worker temporal para PWA
// Este archivo evita el error 404 de notifications-sw.js

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activado')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  // Pasar todas las requests sin modificar
  event.respondWith(fetch(event.request))
})
