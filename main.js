let weatherdata = []
let locdata = []
let locationcoordinates
const body = document.querySelector('body')
const locinput = document.getElementById('locinput')
const suggestionsdiv = document.getElementById('locsuggestionsdiv')
const suggestions = document.getElementsByClassName('locsuggestions')
const lastupdate = document.getElementsByClassName('lastupdate')
const warningsdiv = document.getElementById('currentwarningsdiv')
const closewarning = document.getElementById('closewarning')
const coordselement = document.getElementsByClassName('locationcoords')
const locationtext = document.getElementById('locationtext')
var currentURL = window.location.href;
let timeoutId;


//Got confirmation in TOP's chat and from checking on the API explorer. The inaccuracies and issues ARE NOT MY FAULT. It just problems with the API itself so I am calling it "Good Enough" and moving on despite that core function partially missing.
// async function suggestionssearch() {
//         await fetchLocationData()
//     if (Array.isArray(locdata) && locdata.length > 0) {

//         const updateSuggestion = (index, suggestion) => {
//             if (locdata[index]) {
//                 suggestion.textContent = `${locdata[index].name}, ${locdata[index].region}`
//                 suggestion.value = `${locdata[index].lat}, ${locdata[index].lon}`
//                 suggestion.removeAttribute('hidden')
//             } else {
//                 suggestion.setAttribute('hidden', 'hidden')
//             }
//         }

//         suggestionsdiv.removeAttribute('hidden')
//         for (let i = 0; i < 5; i++) {
//             updateSuggestion(i, document.querySelector(`.suggestion${i + 1}`))
//         }
//     }
// }



locinput.value = localStorage.locsave

 locinput.addEventListener('input', (event) => {
  

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        console.log('test')
        if (window.location.href.includes("future.html")) {updateforecast()}

        if (window.location.href.includes("index.html")) {updateCurrent()}

    } , 500);
       

})

// suggestionsdiv.addEventListener('click', (event) => {
//   
//     locinput.value = event.target.value
//     suggestionsdiv.setAttribute('hidden','hidden')

//     if (window.location.href.includes("future.html")) {updateforecast()}

//     if (window.location.href.includes("index.html")) {updateCurrent()}
// })





closewarning.addEventListener('click', (event) => {
    warningsdiv.setAttribute('hidden', 'hidden')
})

function updateBackground(weatherdata) {

    if (weatherdata.current.condition.text.toUpperCase().indexOf('SUNNY') >= 0) {
    body.style.setProperty('background-image', 'url(images/sunny.jpg)', 'important');

    }      

    if (weatherdata.current.condition.text.toUpperCase().indexOf('CLEAR') >= 0) {
         body.style.setProperty('background-image', 'url(images/clear.jpg)', 'important');

    }   

    if (weatherdata.current.condition.text.toUpperCase().indexOf('RAIN')  >= 0|| weatherdata.current.condition.text.toUpperCase().indexOf('THUNDERSTORM')  >= 0|| weatherdata.current.condition.text.toUpperCase().indexOf('DRIZZLE') >= 0) {
        body.style.setProperty('background-image', 'url(images/rain.jpg)', 'important');

    }

    if (weatherdata.current.condition.text.toUpperCase().indexOf('SNOW') >= 0 || weatherdata.current.condition.text.toUpperCase().indexOf('SLEET')  >= 0|| weatherdata.current.condition.text.toUpperCase().indexOf('FREEZING')  >= 0|| weatherdata.current.condition.text.toUpperCase().indexOf('BLIZZARD')  >= 0|| weatherdata.current.condition.text.toUpperCase().indexOf('FREEZING DRIZZLE')  >= 0|| weatherdata.current.condition.text.toUpperCase().indexOf('ICE')  >= 0) {
        body.style.setProperty('background-image', 'url(images/rain.jpg)', 'important');

    }

    if (weatherdata.current.condition.text.indexOf('MIST') >= 0 || weatherdata.current.condition.text.toUpperCase().indexOf('FOG') >= 0) {
        body.style.setProperty('background-image', 'url(images/fog.jpg)', 'important');

    }

    if (weatherdata.current.condition.text.toUpperCase().indexOf('CLOUDY') >= 0 || weatherdata.current.condition.text.toUpperCase().indexOf('OVERCAST')  >= 0) {
        body.style.setProperty('background-image', 'url(images/clouds.jpg)', 'important');
    }

}

async function fetchLocationData() {
    let createlink

    if (locinput.value !== '') {


        createlink  = 'https://api.weatherapi.com/v1/search.json?key=521ae33e652e47ce82512305240107&q=' + locinput.value  

    } else {
        createlink  = 'https://api.weatherapi.com/v1/search.json?key=521ae33e652e47ce82512305240107&q=12345' 
    }
    
    const response = await fetch(createlink, {mode: 'cors'});
    locdata = await response.json()

    if (await locdata[0] !== undefined) {
        locationcoordinates = locinput.value
        localStorage.setItem('locsave', locationcoordinates)
    }

    
}

async function fetchCurrentWeather() {
    let createlink

   if (locationcoordinates !== '') {
        createlink = 'https://api.weatherapi.com/v1/forecast.json?key=521ae33e652e47ce82512305240107&q=' + locationcoordinates + '&days=3&aqi=yes&alerts=yes'
    } else {
        createlink = 'https://api.weatherapi.com/v1/forecast.json?key=521ae33e652e47ce82512305240107&q=12345&days=3&aqi=yes&alerts=yes'       
    }

    const response = await fetch(createlink, {mode: 'cors'});
    let currentdata = await response.json()
    weatherdata = await currentdata;
}


//function to update current page
async function updateCurrent() {
   await fetchLocationData()
   await fetchCurrentWeather()

   const currentconditiontext = document.getElementById('currentconditiontext')
   const currenticon = document.getElementById('currenticon')
   const actualtemp = document.getElementById('actualtemp')
   const feelslike =  document.getElementById('feelslike')
   const windspeed = document.getElementById('windspeed')
   const gusts = document.getElementById('gusts')
   const dewpoint = document.getElementById('dewpoint')
   const pressure = document.getElementById('pressure')
   const humidity = document.getElementById('humidity')
   const uv = document.getElementById('uv')
   const precipitration = document.getElementById('precipitate')
   const dateformat = new Date(weatherdata.current.last_updated)
   const sunrise = document.getElementById('sunrisetext')
   const sunset = document.getElementById('sunsettext')
   const moonphase = document.getElementById('moonphasetext')
   const moonrise = document.getElementById('moonrisetext')
   const moonset = document.getElementById('moonsettext')


    // let precipitrationaccumul = document.getElementById('precipitateaccumulation')

    if (weatherdata.alerts.alert.length > 0) {
        warningsdiv.removeAttribute('hidden')
        for (const entry of weatherdata.alerts.alert) {
            let createwarning = document.createElement('p')
            createwarning.classList.add('warningcontent')
            createwarning.textContent = entry.desc
            warningsdiv.appendChild(createwarning)
        }
    } else {
        warningsdiv.setAttribute('hidden', 'hidden')
    }
    
    lastupdate[0].textContent = dateformat
    locationtext.textContent = `${weatherdata.location.name}, ${weatherdata.location.region} Lat: ${weatherdata.location.lat}, Lon${weatherdata.location.lon}`

    currentconditiontext.textContent = weatherdata.current.condition.text
    currenticon.src = 'https:' + weatherdata.current.condition.icon
    currenticon.alt = weatherdata.current.condition.text + 'weather icon'
    actualtemp.textContent =  `${weatherdata.current.temp_f}°`
    feelslike.textContent =  `${weatherdata.current.feelslike_f}°`
    windspeed.textContent =  `${weatherdata.current.wind_mph} MP/H`
    gusts.textContent =  `${weatherdata.current.gust_mph} MP/H`
    dewpoint.textContent =  `${weatherdata.current.dewpoint_f}°`
    pressure.textContent =  `${weatherdata.current.pressure_in}`
    humidity.textContent =  `${weatherdata.current.humidity}%`
    uv.textContent =  `${weatherdata.current.uv}`
    precipitration.textContent =  `${weatherdata.current.precip_in}"`
    sunrise.textContent = `${weatherdata.forecast.forecastday[0].astro.sunrise}`
    sunset.textContent = `${weatherdata.forecast.forecastday[0].astro.sunset}`
    moonphase.textContent = `${weatherdata.forecast.forecastday[0].astro.moon_phase}`
    moonrise.textContent = `${weatherdata.forecast.forecastday[0].astro.moonrise}`
    moonset.textContent = `${weatherdata.forecast.forecastday[0].astro.moonset}`
    updateBackground(weatherdata)
}

if (window.location.href.includes("index.html")) {
    updateCurrent()

}

    let updateforecast

    //Checks if page is future.html, if so defines the functions for updating forecast.
    if (window.location.href.includes("future.html")) {
        const forecastdiv = document.getElementById('forecast')
        const hourlydiv = document.getElementById('hourly')
    
        updateforecast = async () => {
            await fetchLocationData()
            await fetchCurrentWeather()
        
            const dateformat = new Date(weatherdata.current.last_updated)
               
            
            if (weatherdata.alerts.alert.length > 0) {
                warningsdiv.removeAttribute('hidden')
                for (const entry of weatherdata.alerts.alert) {
                    let createwarning = document.createElement('p')
                    createwarning.classList.add('warningcontent')
                    createwarning.textContent = entry.desc
                    warningsdiv.appendChild(createwarning)
                }
            } else {
                warningsdiv.setAttribute('hidden', 'hidden')
            }
        
            
            lastupdate[0].textContent = dateformat
            coordselement[0].firstChild.textContent = await `${weatherdata.location.name}, ${weatherdata.location.region} Lat: ${weatherdata.location.lat}, Lon${weatherdata.location.lon}`
        
            const sundayforecast = document.getElementById('sundayforecast')
            const mondayforecast = document.getElementById('mondayforecast')
            const tuesdayforecast = document.getElementById('tuesdayforecast')
            const wednesdayforecast = document.getElementById('wednesdayforecast')
            const thursdayforecast = document.getElementById('thursdayforecast')
            const fridayforecast = document.getElementById('fridayforecast')
            const saturdayforecast = document.getElementById('saturdayforecast')
            let forecastdays = []
            let elementorder = ['first', 'second', 'third', 'fourth', 'fifth', 'six', 'seventh', 'eighth', 'nineth', 'tenth']
        
            for (const child of forecastdiv.children) {
                child.classList.remove('first', 'second','third')
            }
        
        
            for (const entry of weatherdata.forecast.forecastday) {
                const dateformat = new Date(entry.date)
                const whatday = dateformat.getDay()
                forecastdays.push(whatday)
                let RainorSnow

                if (entry.day.daily_chance_of_rain > 0) {
                 RainorSnow =entry.day.daily_chance_of_rain
                } else if(entry.day.daily_chance_of_snow){
                  RainorSnow = entry.day.daily_chance_of_rain  
                } else {RainorSnow = 0}
          
                if (whatday === 0) {

                    sundayforecast.firstElementChild.src = 'https:' + entry.day.condition.icon
                    sundayforecast.firstElementChild.alt = entry.day.condition.text + 'weather icon'


                    sundayforecast.lastElementChild.textContent = `On ${entry.date} High of ${entry.day.maxtemp_f}° Low of:${entry.day.mintemp_f}° With ${entry.day.condition.text} weather and Precipitation Chance of: ${RainorSnow}  for ${entry.day.totalprecip_in}"`               

                    sundayforecast.removeAttribute('hidden')
                    sundayforecast.firstElementChild.classList.add('show', elementorder[0])

                    sundayforecast.classList.add('show', elementorder[0])
                    elementorder.splice(0,1)
        
                } 
        
                if (whatday === 1) {
                    mondayforecast.firstElementChild.src = 'https:' + entry.day.condition.icon
                    mondayforecast.firstElementChild.alt = entry.day.condition.text + 'weather icon'

        
                    mondayforecast.lastElementChild.textContent = `On ${entry.date} High of ${entry.day.maxtemp_f}° Low of:${entry.day.mintemp_f}° With ${entry.day.condition.text} weather and Precipitation Chance of: ${RainorSnow}% for ${entry.day.totalprecip_in}"`
                    mondayforecast.removeAttribute('hidden')
                    mondayforecast.firstElementChild.classList.add('show', elementorder[0])
                    mondayforecast.classList.add('show', elementorder[0])
                    elementorder.splice(0,1)
                    
                }
        
                if (whatday === 2) {
                    tuesdayforecast.firstElementChild.src = 'https:' + entry.day.condition.icon
                    tuesdayforecast.firstElementChild.alt = entry.day.condition.text + 'weather icon'


                    tuesdayforecast.lastElementChild.textContent = `On ${entry.date} High of ${entry.day.maxtemp_f}° Low of:${entry.day.mintemp_f}° With ${entry.day.condition.text} weather and Precipitation Chance of: ${RainorSnow}%  for ${entry.day.totalprecip_in}"`

                    tuesdayforecast.removeAttribute('hidden')
                    tuesdayforecast.firstElementChild.classList.add('show', elementorder[0])
                    tuesdayforecast.classList.add('show', elementorder[0])
                    elementorder.splice(0,1)
               
                }
        
                if (whatday === 3) {
                    wednesdayforecast.firstElementChild.src = 'https:' + entry.day.condition.icon
                    wednesdayforecast.firstElementChild.alt = entry.day.condition.text + 'weather icon'


                    wednesdayforecast.lastElementChild.textContent = `On ${entry.date} High of ${entry.day.maxtemp_f}° Low of:${entry.day.mintemp_f}° With ${entry.day.condition.text} weather and Precipitation Chance of: ${RainorSnow}% for ${entry.day.totalprecip_in}"`
                    wednesdayforecast.removeAttribute('hidden')
                    wednesdayforecast.firstElementChild.classList.add('show', elementorder[0])
                    wednesdayforecast.classList.add('show', elementorder[0])
                    elementorder.splice(0,1)
                }
        
                if (whatday === 4) {
                    thursdayforecast.firstElementChild.src = 'https:' + entry.day.condition.icon
                    thursdayforecast.firstElementChild.alt = entry.day.condition.text + 'weather icon'

        
                    thursdayforecast.lastElementChild.textContent = `On ${entry.date} High of ${entry.day.maxtemp_f}° Low of:${entry.day.mintemp_f}° With ${entry.day.condition.text} weather and Precipitation Chance of: ${RainorSnow}% for ${entry.day.totalprecip_in}"`
                    thursdayforecast.removeAttribute('hidden')
                    thursdayforecast.firstElementChild.classList.add('show', elementorder[0])
                    thursdayforecast.classList.add('show', elementorder[0])
                    elementorder.splice(0,1)
        
                }
        
                if (whatday === 5) {
                    fridayforecast.firstElementChild.src = 'https:' + entry.day.condition.icon
                    fridayforecast.firstElementChild.alt = entry.day.condition.text + 'weather icon'

        
                    fridayforecast.lastElementChild.textContent = `On ${entry.date} High of ${entry.day.maxtemp_f}° Low of:${entry.day.mintemp_f}° With ${entry.day.condition.text} weather and Precipitation Chance of:${RainorSnow}% for ${entry.day.totalprecip_in}"`
                    fridayforecast.removeAttribute('hidden')
                    fridayforecast.firstElementChild.classList.add('show', elementorder[0])
                    fridayforecast.classList.add('show', elementorder[0])
                    elementorder.splice(0,1)
                }
        
                if (whatday === 6) {
                    saturdayforecast.firstElementChild.src = 'https:' + entry.day.condition.icon
                    saturdayforecast.firstElementChild.alt = entry.day.condition.text + 'weather icon'

                    saturdayforecast.lastElementChild.textContent = `On ${entry.date} High of ${entry.day.maxtemp_f}° Low of:${entry.day.mintemp_f}° With ${entry.day.condition.text} weather and Precipitation Chance of: ${RainorSnow}% for ${entry.day.totalprecip_in}"`
                    saturdayforecast.removeAttribute('hidden')
                    saturdayforecast.firstElementChild.classList.add('show', elementorder[0])
                    saturdayforecast.classList.add('show', elementorder[0])
                    elementorder.splice(0,1)
                }
               
        
            }
        
            for (const day of forecastdays) {
        
                if (!sundayforecast.classList.contains(day) && !sundayforecast.classList.contains('show')) {
                    sundayforecast.setAttribute('hidden', 'hidden')
                }
                
                if (!mondayforecast.classList.contains(day) && !mondayforecast.classList.contains('show')) {
        
                    mondayforecast.setAttribute('hidden', 'hidden')
                }
        
                if (!tuesdayforecast.classList.contains(day) && !tuesdayforecast.classList.contains('show')) {
        
                    tuesdayforecast.setAttribute('hidden', 'hidden')
                }
        
                if (!wednesdayforecast.classList.contains(day) && !wednesdayforecast.classList.contains('show')) {
        
                    wednesdayforecast.setAttribute('hidden', 'hidden')
                }
        
                if (!thursdayforecast.classList.contains(day) && !thursdayforecast.classList.contains('show')) {
        
                    thursdayforecast.setAttribute('hidden', 'hidden')
                }
        
                if (!fridayforecast.classList.contains(day) && !fridayforecast.classList.contains('show')) {
        
                    fridayforecast.setAttribute('hidden', 'hidden')
                }
        
                if (!saturdayforecast.classList.contains(day) && !saturdayforecast.classList.contains('show')) {
        
                    saturdayforecast.setAttribute('hidden', 'hidden')
                }
            }
            updateBackground(weatherdata)
        }
                 
        updateforecast()

        forecastdiv.addEventListener('click', (event) => {


            if (event.target.classList.contains('first')) {
                hourlyforecast(0, 'first')
            }
        
            if (event.target.classList.contains('second')) {
                hourlyforecast(1, 'second')
            }
        
            if (event.target.classList.contains('third')) {
                hourlyforecast(2, 'third')
            }
        
            if (event.target.classList.contains('fourth')) {
                hourlyforecast(3)
            }
        
            if (event.target.classList.contains('fifth')) {
                hourlyforecast(4)
            }
        
            if (event.target.classList.contains('sixth')) {
                hourlyforecast(5)
            }
        
            if (event.target.classList.contains('seventh')) {
                hourlyforecast(6)
            }
        
            if (event.target.classList.contains('eighth')) {
                hourlyforecast(7)
            }
        
            if (event.target.classList.contains('nineth')) {
                hourlyforecast(8)
            }
        
            if (event.target.classList.contains('tenth')) {
                hourlyforecast(9)
            }
        
        
        })
    
                
        function hourlyforecast(targetforecastday, orderclass) {
            while (hourlydiv.lastChild) {
                hourlydiv.removeChild(hourlydiv.lastChild)
            }
        





                for (const hour of weatherdata.forecast.forecastday[targetforecastday].hour) {
                    // Get the current time
                    const currentTime = new Date();

                    // Parse the input time (assuming the input format is HH:MM:SS)
                    const inputTime = new Date(hour.time);

                    // Compare the input time with the current time
                    if (inputTime > currentTime) {

                        let newhourlypara = document.createElement('p')
                        newhourlypara.textContent = `${hour.time} Temp:${hour.temp_f}° Condition: ${hour.condition.text} Precip amount: ${hour.precip_in}"`
                        hourlydiv.appendChild(newhourlypara)      

                                  } 
           
                }
            }
        
}



  

