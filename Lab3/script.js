let map = L.map('map').setView([53.430127, 14.564802], 18)
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map)
let marker = L.marker([53.430127, 14.564802]).addTo(map)
marker.bindPopup('<strong>Hello!</strong><br>This is a popup.')

document.getElementById('saveButton').addEventListener('click', function () {
  leafletImage(map, function (err, canvas) {
    // here we have the canvas
    let rasterMap = document.getElementById('rasterMap')
    let rasterContext = rasterMap.getContext('2d')

    rasterContext.drawImage(canvas, 0, 0, 300, 150)
  })
})

document
  .getElementById('getLocation')
  .addEventListener('click', function (event) {
    if (!navigator.geolocation) {
      console.log('No geolocation.')
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        let lat = position.coords.latitude
        let lon = position.coords.longitude

        map.setView([lat, lon])
      },
      (positionError) => {
        console.error(positionError)
      }
    )
  })
