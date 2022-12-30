self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('static').then(cache => {
            return cache.addAll([
                "./",
                "images/favicon.png",
                "main.js",
                "style.css",
                "manifest.json",
                "index.html",
                "sw.js",
                "stack.js",
                "favicon.ico"
                ])
        })
    )
})

self.addEventListener("fetch",e =>{
    e.respondWith(
        caches.match(e.request).then(res =>{
            return res || fetch(e.request)
        })
        )
})
