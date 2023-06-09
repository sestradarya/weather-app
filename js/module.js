'use strict';

export const weekDayNames = [
    'Sunday',
    'Monday',
    'Tuesday', 
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

export const monthNames = [
    'Jan',
    'Feb', 
    'Mar',
    'Apr',
    'May',
    'Jun', 
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

export const getData = function(dateUnix, timezone){
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName} ${date.getUTCDate()}, ${monthName}`
}

export const getTime = function(timeUnix, timezone){
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();

    return `${hours}:00`
}

export const mps_to_kmh = mps => {
    return mps * 3600 / 1000
}

export const aqiText = {
    1: {
        level: 'Good',
        message: "Air quality is considered satisfactory, and air pollution poses little or no risk"
    },
    2: {
        level: "Fair",
        message: "Air quality is aacceptable; howewer, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution"
    },
    3: {
        level: "Moderate",
        message: "Members of sensitive groups may experience health effecs. The general publics is not likely to be affected"
    },
    4: {
        level: "Poor",
        message: "Everyone may begin to experience health effects; members of sencitive groups mey expeience more serious health effected"
    },
    5: {
        level: "Very Poor",
        message: "Health warnings of emergency conditions. The entire population is more likely to be affected"
    }
}