'use strict';

import {updateWeather, error404} from "./app";

const defaultLocation = "#/weather?lat=52.237049&lon=21.017532"

const currentLocation = function() {
    window.navigator.geolocation.getCurrentPosition(res => {
        const {latitude, longitude} = res.coords;

        updateWeather(`lat=${latitude}`, `lon=${longitude}`)
    }, err => {
        window.location.hash = defaultLocation;
    })
}

const searchedLocation = query => updateWeather(...query.split("&"))

const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation]
])

const checkHash = function(){
    const requestURL = window.location.hash.slice(1)

    requestURL.includes ? requestURL.split("?") : [requestURL];

    routes.get(route) ? routes.get(rout)(query): error404
}

window.addEventListener('hashchange', checkHash)

window.addEventListener('load', function(){
    if(this.window.location.hash){
        this.window.location.hash = "#/current-location"
    } else {
        checkHash();
    }
})