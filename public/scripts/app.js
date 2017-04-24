(function () {
  'use strict';

  // app对象包含一些引用
  // An app object that contains some of the key information necessary for the app.
  var app = {
    isLoading: true,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butRefresh').addEventListener('click', function () {
    // Refresh all of the forecasts
    app.updateForecasts();
  });

  document.getElementById('butAdd').addEventListener('click', function () {

    //  add option in dataList
    app.addDataList(window.province,'#selectProvince');

    // Open/show the add new city dialog
    app.toggleAddDialog(true);
  });

  // document.getElementById('butAddCity').addEventListener('click', function () {
  //   // Add the newly selected city
  //   var select = document.getElementById('selectCityToAdd');
  //   var selected = select.options[select.selectedIndex];
  //   var key = selected.value;
  //   var label = selected.textContent;
  //   // TODO init the app.selectedCities array here
  //   app.getForecast(key, label);
  //   // TODO push the selected city to the array and save here
  //   app.toggleAddDialog(false);
  // });

  document.getElementById('butAddCity').addEventListener('click', function () {
    // Add the newly selected city
    var select = document.getElementById('selectCityToAdd');
    var selected = select.options[select.selectedIndex];
    var key = selected.value;
    var label = selected.textContent;
    if (!app.selectedCities) {
      app.selectedCities = [];
    }
    app.getForecast(key, label);
    app.selectedCities.push({ key: key, label: label });
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
      app.addDataList(window.city[cityid],'#selectCity');
    }
  })

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function (visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  // AddDataListInProvince
  app.addDataList = function (arr,dataList) {
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


  // Updates a weather card with the latest weather forecast. If the card
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

    // Verifies the data provide is newer than what's already visible
    // on the card, if it's not bail, if it is, continue and update the
    // time saved in the card
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

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * getForecast() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, getForecast() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */
  app.getForecast = function (key) {
    var url = "https://localhost:4000/weather/city/" + key

    // TODO add cache logic here
    // 先检查是否有缓存，有的话就先用缓存内容，等网络有响应了再用最新内容
    // if ('caches' in window) {
    //   /*
    //    * Check if the service worker has already cached this city's weather
    //    * data. If the service worker has the data, then display the cached
    //    * data while the app fetches the latest data.
    //    */
    //   caches.match(url).then(function (response) {
    //     console.log('find cache response :', url)
    //     if (response) {
    //       response.json().then(function updateFromCache(json) {
    //         var results = json.query.results;
    //         results.key = key;
    //         results.label = label;
    //         results.created = json.query.created;
    //         app.updateForecastCard(results);
    //       });
    //     }
    //   });
    // }

    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          console.log(response);
          // var results = response.query.results;
          // results.key = key;
          // results.label = label;
          // results.created = response.query.created;
          app.updateForecastCard(response);
        }
      } else {
        // Return the initial weather forecast since no data is available.
        // app.updateForecastCard(initialWeatherForecast);
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

  // TODO add saveSelectedCities function here
  //  将城市列表存入 localStorage.
  app.saveSelectedCities = function () {
    var selectedCities = JSON.stringify(app.selectedCities);
    localStorage.selectedCities = selectedCities;
  };

  app.getIconClass = function (weatherCode) {
    // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
    weatherCode = parseInt(weatherCode);
    switch (weatherCode) {
      case 0: // cold
        return 'clear-day';
      case 7: // tornado
      case 8: // tropical storm
      case 9: // hurricane
      case 10: // mixed rain and sleet
      case 11: // freezing drizzle
      case 12: // drizzle
        return 'rain';
      case 3: // severe thunderstorms
      case 4: // thunderstorms
      case 5: // isolated thunderstorms
      case 6: // scattered thunderstorms
        return 'thunderstorms';
      case 13: // mixed rain and snow
      case 14: // mixed snow and sleet
      case 15: // snow flurries
      case 16: // light snow showers
      case 17: // snow
        return 'snow';
      case 18: // blowing snow
        return 'fog';
      case 24: // windy
      case 23: // blustery
        return 'windy';
      case 1: // cloudy
      case 2:
        return 'cloudy';
      case 29: // partly cloudy (night)
      case 30: // partly cloudy (day)
      case 44: // partly cloudy
        return 'partly-cloudy-day';
    }
  };

  /*
   * Fake weather data that is presented when the user first uses the app,
   * or when the user has not saved any cities. See startup code for more
   * discussion.
   */
  // var initialWeatherForecast = {
  //   key: '2459115',
  //   label: 'New York, NY',
  //   created: '2016-07-22T01:00:00Z',
  //   channel: {
  //     astronomy: {
  //       sunrise: "5:43 am",
  //       sunset: "8:21 pm"
  //     },
  //     item: {
  //       condition: {
  //         text: "Windy",
  //         date: "Thu, 21 Jul 2016 09:00 PM EDT",
  //         temp: 56,
  //         code: 24
  //       },
  //       forecast: [
  //         { code: 44, high: 86, low: 70 },
  //         { code: 44, high: 94, low: 73 },
  //         { code: 4, high: 95, low: 78 },
  //         { code: 24, high: 75, low: 89 },
  //         { code: 24, high: 89, low: 77 },
  //         { code: 44, high: 92, low: 79 },
  //         { code: 44, high: 89, low: 77 }
  //       ]
  //     },
  //     atmosphere: {
  //       humidity: 56
  //     },
  //     wind: {
  //       speed: 25,
  //       direction: 195
  //     }
  //   }
  // };
  // TODO uncomment line below to test app with fake data
  // app.updateForecastCard(initialWeatherForecast);

  // TODO add startup code here
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
  /*
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
  */
})();
