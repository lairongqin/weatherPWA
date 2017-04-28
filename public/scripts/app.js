(function () {
  'use strict';

  // app对象包含全局变量引用

  var app = {
    isLoading: true,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
  };


  /*****************************************************************************
   *
   *  绑定UI界面的事件处理函数
   *
   ****************************************************************************/

  document.getElementById('butRefresh').addEventListener('click', function () {
    // Refresh all of the forecasts
    app.updateForecasts();
  });

  document.getElementById('butAdd').addEventListener('click', function () {

    //  在省级跟市级下拉选项框中添加选项
    app.addDataList(window.province, '#selectProvince');

    // 开/关 dialog框
    app.toggleAddDialog(true);
  });


  document.getElementById('butAddCity').addEventListener('click', function () {

    // 获取选择的省份城市
    var select = document.getElementById('selectProvince');
    var selected = select.options[select.selectedIndex];
    var key = selected.value;

    // 检查是否是直辖市
    if (!key) {
      select = document.getElementById('selectCity');
      selected = select.options[select.selectedIndex]
      key = selected.value;
    }

    // 检查已选择城市是否存在，不存在就创建
    if (!app.selectedCities) {
      app.selectedCities = [];
    }
    app.getForecast(key);
    app.selectedCities.push({ key: key });
    app.saveSelectedCities(); 
    app.toggleAddDialog(false);
  });

  document.getElementById('butAddCancel').addEventListener('click', function () {
    // Close the add new city dialog
    app.toggleAddDialog(false);
  });

  document.querySelector('#selectProvince').addEventListener('click', function (ev) {
    var selected = this.options[this.selectedIndex];
    if (selected) {
      var cityid = selected.getAttribute('cityid');
      app.addDataList(window.city[cityid], '#selectCity');
    }
  })

  // document.querySelector('')

  /*****************************************************************************
   *
   * methods to update/refresh the UI
   *
   ****************************************************************************/

  // create new city dialog visiblity
  app.toggleAddDialog = function (visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  // AddDataListInProvince
  app.addDataList = function (arr, dataList) {
    if (arr) {
      var fragment = document.createDocumentFragment();

      arr.forEach(function (el) {
        var option = document.createElement('option');
        option.value = el.citycode;
        option.setAttribute('cityid', el.cityid);
        option.innerText = el.city;
        fragment.appendChild(option);
      });

      // var option = document.createElement('option');
      // option.value = arr[4].citycode;
      // option.setAttribute('cityid', arr[4].cityid);
      // option.innerText = arr[4].city;
      // fragment.appendChild(option);

      var selectElement = document.querySelector(dataList);
      // clear data 
      selectElement.innerHTML = '';
      selectElement.appendChild(fragment);
    }
  }


  // updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function (data) {
    var dataLastUpdated = new Date(data.updatetime);
    var sunrise = data.daily[0].sunrise;
    var sunset = data.daily[0].sunset;
    var current = data.temp;
    var humidity = data.humidity;
    var wind = {
      speed: data.windspeed,
      direction: data.winddirct
    };

    // 判断现在需要显示的城市天气信息是否已经有显示,如果没有显示便准备显示
    var card = app.visibleCards[data.citycode];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.location').textContent = data.city;
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[data.citycode] = card;
    }


    // 有可能缓存响应慢于XHR的响应
    var cardLastUpdatedElem = card.querySelector('.card-last-updated');
    var cardLastUpdated = cardLastUpdatedElem.textContent;
    if (cardLastUpdated) {
      cardLastUpdated = new Date(cardLastUpdated);
      // Bail if the card has more recent data then the data
      if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
        return;
      }
    }
    cardLastUpdatedElem.textContent = data.updatetime;

    card.querySelector('.description').textContent = data.index[1].detail;
    card.querySelector('.date').textContent = data.date + ' ' + data.week;
    card.querySelector('.current .icon').classList.add(app.getIconClass(data.img));
    card.querySelector('.current .temperature .value').textContent =
      Math.round(data.temp);
    card.querySelector('.current .sunrise').textContent = sunrise;
    card.querySelector('.current .sunset').textContent = sunset;
    card.querySelector('.current .humidity').textContent =
      Math.round(humidity) + '%';
    card.querySelector('.current .wind .value').textContent =
      Math.round(wind.speed);
    card.querySelector('.current .wind .direction').textContent = wind.direction;
    var nextDays = card.querySelectorAll('.future .oneday');
    var today = new Date();
    today = today.getDay();

    for (var i = 0; i < 7; i++) {
      var nextDay = nextDays[i];
      var daily = data.daily[i];
      if (daily && nextDay) {
        // nextDay.querySelector('.date').textContent =
        // app.daysOfWeek[(i + today) % 7];
        nextDay.querySelector('.date').textContent =
          daily.week;
        nextDay.querySelector('.icon').classList.add(app.getIconClass(daily.day.img));
        nextDay.querySelector('.temp-high .value').textContent =
          Math.round(daily.day.temphigh);
        nextDay.querySelector('.temp-low .value').textContent =
          Math.round(daily.night.templow);
      }
    }

    // cancel the loading animation
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  app.getForecast = function (key) {
    var url = "https://localhost:4000/weather/city/" + key

    // 先检查是否有缓存，有的话就先用缓存内容，等网络有响应了再用最新内容
    if ('caches' in window) {
      /*
       * Check if the service worker has already cached this city's weather
       * data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data.
       */
      caches.match(url).then(function (response) {
        console.log('find cache response :', url)
        if (response) {
          response.json().then(function updateFromCache(json) {
            app.updateForecastCard(json);
          });
        }
      });
    }

    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          console.log(response);

          app.updateForecastCard(response);
        }
      }
    };
    request.open('GET', url);
    request.send();
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateForecasts = function () {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function (key) {
      app.getForecast(key);
    });
  };

  //  将城市列表存入 localStorage.
  app.saveSelectedCities = function () {
    var selectedCities = JSON.stringify(app.selectedCities);
    localStorage.selectedCities = selectedCities;
  };

  app.getIconClass = function (weatherCode) {
    weatherCode = parseInt(weatherCode);
    switch (weatherCode) {
      case 0: 
        return 'clear-day';
      case 7: 
      case 8: 
      case 9: 
      case 10: 
      case 11: 
      case 12: 
        return 'rain';
      case 3: 
      case 4: 
      case 5: 
      case 6: 
        return 'thunderstorms';
      case 13: 
      case 14:
      case 15: 
      case 16: 
      case 17:
        return 'snow';
      case 18: 
        return 'fog';
      case 24: 
      case 23: 
        return 'windy';
      case 1: 
      case 2:
        return 'cloudy';
      case 29: 
      case 30: 
      case 44: 
        return 'partly-cloudy-day';
    }
  };

  /************************************************************************
   * 
   *  APP start on
   *  
   ***********************************************************************/
  app.selectedCities = localStorage.selectedCities;

  if (app.selectedCities) {
    app.selectedCities = JSON.parse(app.selectedCities);
    app.selectedCities.forEach(function (city) {
      app.getForecast(city.key);
    });
  } else {

    // 初始值应由IP定位来查询地址，现在先默认使西安。
    app.selectedCities = [
      { key: '101110101' }
    ];
    app.getForecast(app.selectedCities[0].key);
    app.saveSelectedCities();
  }

  // TODO add service worker code here

  if ('serviceWorker' in navigator) {
    console.log('serviceWorker support , start installing Service Worker');
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => { console.log('Service Worker Registered'); });

    // 注册推送Manager
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {

      // https://developer.mozilla.org/en-US/docs/Web/API/Push_API
      serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
        .then(function (subscription) {
          console.log('pushSubscription.subscriptionId', subscription.subscriptionId);
          console.log('subscription.endpoint', subscription.endpoint);
        }, function (error) {
          console.log(error);
        })
    })
  }

})();
