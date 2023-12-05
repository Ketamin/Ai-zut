// Create class weather app
const kelvinToCelsius = (kelvin) => {
  return Math.round(kelvin - 273.15)
}

// Get weather data
const getWeather = async (location) => {
  // Make xml request
  const request = new XMLHttpRequest()
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=7ded80d91f2b280ec979100cc8bbba94`
  request.open('GET', url, true)
  request.send()

  let data = null
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(this.responseText)
      // Now make second request using this
      const request2 = new XMLHttpRequest()
      const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=7ded80d91f2b280ec979100cc8bbba94`
      request2.open('GET', url2, true)
      request2.send()

      request2.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          data = JSON.parse(this.responseText)
          console.log(data)
          // Draw weather

          drawWeather(
            data.dt,
            kelvinToCelsius(data.main.temp),
            kelvinToCelsius(data.main.feels_like),
            data.weather[0].description,
            '.currentWeather'
          )
        }
      }
    }
  }
}

const getWeatherFetch = async (location) => {
  // get geo data
  const geoData = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=7ded80d91f2b280ec979100cc8bbba94`
  )
  const geoDataJson = await geoData.json()

  // get weather data
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${geoDataJson[0].lat}&lon=${geoDataJson[0].lon}&appid=7ded80d91f2b280ec979100cc8bbba94`
  )

  const weatherDataJson = await weatherData.json()
  //github.com/Ketamin/Ai-zut/tree/lab-f
  // Draw weather
  https: weatherDataJson.list.forEach((element) => {
    drawWeather(
      element.dt,
      kelvinToCelsius(element.main.temp),
      kelvinToCelsius(element.main.feels_like),
      element.weather[0].description,
      '.forecast'
    )
  })

  console.log(weatherDataJson)
}

const drawWeather = (date, temperature, feelsLike, weather, htmlBox) => {
  const weatherBox = document.querySelector(htmlBox)
  // Make children for weatherBox
  const dateHTML = document.createElement('h2')
  const temperatureHTML = document.createElement('h2')
  const feelsLikeHTML = document.createElement('h2')
  const weatherHTML = document.createElement('h2')

  // Convert date to readable format
  const dateObject = new Date(date * 1000)
  const humanDateFormat = dateObject.toLocaleString()

  // Add text to children
  dateHTML.textContent = humanDateFormat
  temperatureHTML.textContent = 'Temperature ' + temperature + '°C'
  feelsLikeHTML.textContent = 'Feels Like ' + feelsLike + '°C'
  weatherHTML.textContent = weather

  // Append children to weatherBox
  const wrapper = document.createElement('div')
  // append class to wrapper
  wrapper.classList.add('weatherWrapper')

  wrapper.appendChild(dateHTML)
  wrapper.appendChild(temperatureHTML)
  wrapper.appendChild(feelsLikeHTML)
  wrapper.appendChild(weatherHTML)

  weatherBox.appendChild(wrapper)
}

// Get button
const button = document.querySelector('.btn')

button.addEventListener('click', function () {
  console.log('click')
  const location = document.querySelector('.location').value
  getWeather(location)
  getWeatherFetch(location)
})
