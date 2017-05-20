var cacheName = 'weatherPWA';
var dataCacheName = 'weatherData-v1';
var filesToCache = [
    '/',
    '/scripts/app.js',
    '/styles/inline.css',
    '/images/clear.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png'
];

// Service Worker 被注册以后，当用户首次访问页面的时候一个install事件会被触发
self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');

    // event.waitUntil() 方法带有 promise 参数并使用它来判断安装所花费的时间以及安装是否成功。
    // 确保service Worker 不会在waitUntil()里面的代码执行完毕之前安装完成
    // ExtendableEvent.waitUntil() https://developer.mozilla.org/zh-CN/docs/Web/API/ExtendableEvent/waitUntil
    e.waitUntil(

        // 返回一个对cache Object来说已经resolves的Promise对象，这个对象的名字匹配cacheName，如果没有就创建这个对象
        // https://developer.mozilla.org/zh-CN/docs/Web/API/CacheStorage
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');

            // 接受多个URL组成的数组,检索（请求）这些URL并且添加这他们的响应对象到给定的cache对象中
            // This is atomic , if any of the files fail,the entire cache step fail
            return cache.addAll(filesToCache);
        })
    )
})

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(

        // 下面方法返回一个被resolve的Promise对象，并且传递一个包含从CacheStorage中检索出所有Cache对象名字的数组。
        caches.keys().then(
            function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== cacheName && key !== dataCacheName) {
                        console.log('[ServiceWorker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }))
            }
        )
    );

    // When the app is complete, self.clients.claim() fixes a corner case in which the app wasn't returning the 
    // latest data. You can reproduce the corner case by commenting out the line below and then doing the following 
    // steps: 1) load app for first time so that the initial New York City data is shown 2) press the refresh button on the app 
    // 3) go offline 4) reload the app. You expect to see the newer NYC data, but you actually see the initial data. This 
    // happens because the service worker is not yet activated. self.clients.claim() essentially lets you activate 
    // the service worker faster.
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);

    var dataUrl = 'https://localhost:4000/weather/city/';
    if (e.request.url.indexOf(dataUrl) > -1) {
        console.log('fetch weatherAPI:', e.request.url);
        e.respondWith(

            // GlobalFetch https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch/fetch
            // 发起获取资源的请求。它返回一个 promise，这个 promise 会在请求响应后被 resolve，并传回 Response 对象
            // 当遇到网络错误时，fetch() 返回的 promise 会被 reject，并传回 TypeError，虽然这也可能因为权限或其它问题导致。
            // 成功的 fetch() 检查不仅要包括 promise 被 resolve，还要包括 Response.ok 属性为 true。HTTP 404 状态并不被认为是网络错误。
            // https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
            fetch(e.request)
                .then(function (response) {
                    return caches.open(dataCacheName).then(function (cache) {
                        cache.put(e.request.url, response.clone());
                        console.log('[ServiceWorker] Fetched&Cached Data \n weather API response:');
                        return response;
                    });
                })
        );

        // e.respondWith(
        //     caches.open(dataCacheName).then(function (cache) {
        //         return fetch(e.request).then(function (response) {
        //             cache.put(e.request.url, response.clone());
        //             return response;
        //         });
        //     })
        // );

    } else {

        // https://developer.mozilla.org/zh-CN/docs/Web/API/FetchEvent
        // Resolves by returning a Response or a network error  to Fetch.
        e.respondWith(

            // caches.match(event.request) 允许我们对网络请求的资源和 cache 里可获取的资源进行匹配，查看是否缓存中有相应的资源。
            caches.match(e.request).then(function (response) {
                if (response) {
                    console.log('find cache', response.clone().url);
                }
                return response || fetch(e.request);
            })
        );
    }
});

self.addEventListener('push', function (event) {
    var title = "PUSH";
    var body = "push a notification";
    event.waitUntil(
        self.registration.showNotification(title, {
            body: body
        })
    )

})