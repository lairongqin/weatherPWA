
1. 添加已经选择的城市到localStorage，这个方法可靠新过太弱初步考虑换indexDB等其他方法

2. 修改butAddCity的监听方法 => 前端先获取需要添加的城市数据 => 调用getForecast方法来获取更新数据 => 更新前端显示

3. 注册 service Worker `navigator.serviceWorker`

4. 缓存appshell的数据 => window上监听install事件，打开CacheStorage(caches)对象找到对应cache => 缓存URL ARRAY

5. 更新删除缓存

6. 监听fetch事件，如果请求内容在缓存中存在，则从缓存中返回数据。

7. 缓存天气数据，先显示缓存后用最新数据

8. push notificathion , learning Push API