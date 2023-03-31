"use strict";

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
};

// Toogle search in mobile
const searchView = document.querySelector("[data-search-view]");
const searhcTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searhcTogglers, "click", toggleSearch);

//Search machanism
const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", function () {
  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchField.value) {
    searchResult.classList.remove("active");
    searchResult.innerHTML = "";
    searchField.classList.remove("searching");
  } else {
    searchField.classList.add("searching");
  }

  if (searchField.value) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchField.value), function (locations) {
        searchField.classList.remove("searching");
        searchResult.classList.add("active");
        searchResult.innerHTML = `
                <ul class="view-list" data-search-list>
                    
                </ul>
                `;

        const items = [];

        for (const {name, lat, lon, country, state} of locations){
            const searchItem = document.createElement("li")
            searchItem.classList.add('view-item')

            searchItem.innerHTML = `
                <i class="fa-solid fa-location-dot"></i>

                <div>
                    <p class="item-title">${name}</p>

                    <p class="item-subtitle label-2">${state || ""}, ${country}</p>
                </div>

                <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label='${name} weather' data-search-toggler></a>
            `

            searchResult.querySelector("[data-search-list]").appendChild(searchItem)
            items.push(searchItem.querySelector("[data-search-toggler]"))
        }

        addEventOnElements(items, 'click', function(){
            toggleSearch()
            searchResult.classList.remove('active')
        })
      });
    }, searchTimeoutDuration);
  }
});





const container = document.querySelector('[data-container]')
const loading = document.querySelector('[data-loading]')
const currentLocationBtn = document.querySelector('[data-current-location-btn]')
const errorContent = document.querySelector('[data-error-content]')

export const updateWeather = function(lat, lon){

    // loading.style.display = 'grid'
    // container.style.overflowY = 'hidden'
    // container.classList.contains('fade-in') ?? container.classList.remove('fade-in')
    errorContent.style.display = 'none'

    const currentWeatherSection = document.querySelector('[data-current-weather')
    const highlightSection = document.querySelector('[data-highlights]')
    const hourlySection = document.querySelector('[data-hourly-forecast]')
    const forecastSection = document.querySelector('[data-5-day-forecast]')

    currentWeatherSection.innerHTML = ''
    highlightSection.innerHTML = ''
    hourlySection.innerHTML = ''
    forecastSection.innerHTML = ''


    if(window.location.hash === "#/current-location"){
        currentLocationBtn.setAttribute('disabled', '')
    } else {
        currentLocationBtn.removeAttribute('disabled')
    }


    fetchData(url.currentWeather(lat, lon), function(currentWeather){

        const {
            weather,
            dt: dateUnix,
            sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
            main: {temp, feels_like, pressure, humidity},
            visibility,
            timezone
        } = currentWeather

        const [{description, icon}] = weather

        const card = document.createElement('div')
        card.classList.add('card', 'card-lg', 'current-weather-card')

        card.innerHTML = `
        <h2 class="title-2 card-title">Now</h2>

        <div class="wrapper">
          <div class="heading">${parseInt(temp)}&deg;c</div>

          <img
            src="assets/weather_icons/${icon}.png"
            alt="${description}"
            width="64"
            height="64"
            class="weather-icon"
          />
        </div>

        <p class="body-3">${description}</p>

        <ul class="meta-list">
          <li class="meta-item">
            <i class="fa-regular fa-calendar"></i>

            <p class="title-3 meta-text">${module.getData(dateUnix, timezone)}</p>
          </li>
          <li class="meta-item">
            <i class="fa-solid fa-location-dot"></i>

            <p class="title-3 meta-text" data-location></p>
          </li>
        </ul>
        `;


        fetchData(url.reverseGeo(lat, lon), function([{name, country}]){
            card.querySelector('[data-location]').innerHTML = `${name}, ${country}`
        })
        currentWeatherSection.appendChild(card)






        fetchData(url.airPollution(lat, lon), function(airPollution){
            const [{
                main: {aqi},
                components: {no2, o3, so2, pm2_5}
            }] = airPollution.list

            const card = document.createElement('div')
            card.classList.add('card', 'card-lg')

            card.innerHTML = `
            <h2 class="title-2" id="highlights-label">Today highlights</h2>

            <div class="highlight-list">
              <div class="card card-sm highlight-card one">
                <h3 class="title-3">Air Quality Index</h3>

                <div class="wrapper">
                  <i class="fa-solid fa-wind"></i>

                  <ul class="card-list">
                    <li class="card-item">
                      <p class="title-1">${pm2_5.toPrecision(3)}</p>
                      <p class="label-1">PM <sub>2.5</sub></p>
                    </li>
                    <li class="card-item">
                      <p class="title-1">23.3</p>
                      <p class="label-1">SO <sub>${so2.toPrecision(3)}</sub></p>
                    </li>
                    <li class="card-item">
                      <p class="title-1">23.3</p>
                      <p class="label-1">NO <sub>${no2.toPrecision(3)}</sub></p>
                    </li>
                    <li class="card-item">
                      <p class="title-1">23.3</p>
                      <p class="label-1">O <sub>${o3.toPrecision(3)}</sub></p>
                    </li>
                  </ul>
                </div>

                <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}">
                  ${module.aqiText[aqi].level}
                </span>
              </div>

              <div class="card card-sm highlight-card two">
                <h3 class="title-3">Sunrise and sunset</h3>
                <div class="card-list">
                  <div class="card-item">
                    <i class="fa-regular fa-sun"></i>
                    <div>
                      <p class="label-1">Sunrise</p>
                      <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
                    </div>
                  </div>

                  <div class="card-item">
                    <i class="fa-regular fa-moon"></i>

                    <div>
                      <p class="label-1">Sunset</p>
                      <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-sm highlight-card">
                <h3 class="title-3">Humidity</h3>

                <div class="wrapper">
                  <i class="fa-solid fa-droplet"></i>

                  <p class="title-1">${humidity} %</p>
                </div>
              </div>

              <div class="card-sm highlight-card">
                <h3 class="title-3">Pressure</h3>

                <div class="wrapper">
                  <i class="fa-solid fa-tower-cell"></i>

                  <p class="title-1">${pressure} hPa</p>
                </div>
              </div>

              <div class="card-sm highlight-card">
                <h3 class="title-3">Visibility</h3>

                <div class="wrapper">
                  <i class="fa-solid fa-eye-slash"></i>

                  <p class="title-1">${visibility / 1000} km</p>
                </div>
              </div>

              <div class="card-sm highlight-card">
                <h3 class="title-3">Feels Like</h3>

                <div class="wrapper">
                  <i class="fa-solid fa-temperature-three-quarters"></i>

                  <p class="title-1">${parseInt(feels_like)}&deg;C</p>
                </div>
              </div>
            </div>
            `

            highlightSection.appendChild(card)
        })


        fetchData(url.forecast(lat, lon), function (forecast) {

            const {
                list: forecastList,
                city: {timezone}
            } = forecast

            hourlySection.innerHTML = `
            <h2 class="title-2">Today at</h2>

            <div class="slider-container">
              <ul class="slider-list" data-temp>
                
              </ul>

              <ul class="slider-list" data-wind>
                
              </ul>
            </div>
            `

            for (const [i, data] of forecastList.entries()){

                if(i > 7) break;

                const {
                    dt: dataTimeUnix,
                    main: {temp},
                    weather,
                    wind: {deg: windDirection, speed: windSpeed}
                } = data

                const [{icon, description}] = weather

                const tempLi = document.createElement('li');
                tempLi.classList.add('slider-item')

                tempLi.innerHTML = `
                  <div class="card card-sm slider-card">
                    <p class="body-3">${module.getTime(dataTimeUnix, timezone)}</p>

                    <img
                      src="./assets/weather_icons/${icon}.png"
                      alt="${description}"
                      width="48"
                      height="48"
                      loading="lazy"
                      class="weather-icon"
                      title="${description}"
                    />

                    <p class="body-3">${parseInt(temp)}&deg;</p>
                  </div>
                `

                hourlySection.querySelector('[data-temp]').appendChild(tempLi)

                const windLi = document.createElement('li')
                windLi.classList.add('slider-item')
                windLi.innerHTML = `
                <div class="card card-sm slider-card">
                    <p class="body-3">${module.getHours(dataTimeUnix, timezone)}</p>

                    <img
                    src="./assets/weather_icons/send.png"
                    alt="direction"
                    width="48"
                    height="48"
                    loading="lazy"
                    class="weather-icon"
                    style="transform: rotate(${windDirection - 180}deg)"
                    />

                    <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>
                </div>
                `
                hourlySection.querySelector('[data-wind]').appendChild(windLi)
            }
        })

    })
 
}

export const error404 = function(){

}