let pieces = []

let map = L.map('map').setView([53.430127, 14.564802], 18)
L.tileLayer.provider('Esri.WorldImagery').addTo(map)
let marker = L.marker([53.430127, 14.564802]).addTo(map)
marker.bindPopup('<strong>Hello!</strong><br>This is a popup.')

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

function splitImage(hiddenCanvas) {
  // Ask for notification permission
  Notification.requestPermission()

  const dropArea = document.getElementById('dropArea')
  // Remove border from dropArea
  dropArea.style.border = 'none'

  const puzzleTable = document.getElementById('puzzleTable')

  const tileWidth = hiddenCanvas.width / 4
  const tileHeight = hiddenCanvas.height / 4

  puzzleTable.addEventListener('dragover', function (e) {
    e.preventDefault()
  })
  pieces = []

  puzzleTable.addEventListener('drop', function (e) {
    e.preventDefault()
    const draggedData = e.dataTransfer.getData('text/plain')
    const draggedElement = pieces.find(
      (p) => p.canvas.dataset.position === draggedData
    ).canvas
    const currentDropSpot = draggedElement.parentElement

    console.log('dragged back to table', draggedData)

    if (currentDropSpot.classList.contains('dropSpot')) {
      currentDropSpot.dataset.occupied = 'false'
    }

    // draggedElement.dataset.position = pieces.findIndex(p => p.canvas === draggedElement).toString();

    puzzleTable.appendChild(draggedElement)
    updateOccupiedAttributes()
  })

  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      const pieceCanvas = document.createElement('canvas')
      pieceCanvas.width = tileWidth
      pieceCanvas.height = tileHeight
      const pieceContext = pieceCanvas.getContext('2d')

      pieceContext.drawImage(
        hiddenCanvas,
        x * tileWidth,
        y * tileHeight,
        tileWidth,
        tileHeight,
        0,
        0,
        tileWidth,
        tileHeight
      )

      pieceCanvas.draggable = true
      pieceCanvas.classList.add('puzzlePiece')
      pieceCanvas.setAttribute('is-on-drop-area', 'false')
      pieceCanvas.setAttribute('data-position', `${x * 4 + y}`)

      pieces.push({ canvas: pieceCanvas, onBoard: false, position: 4 * y + x })
      puzzleTable.appendChild(pieceCanvas)

      // Create dropSpot element and push it to dropArea as child
      const dropSpot = document.createElement('div')
      dropSpot.classList.add('dropSpot')
      dropSpot.setAttribute('data-position', `${y * 4 + x}`)
      dropSpot.setAttribute('data-occupied', 'false')
      dropSpot.style.height = `${tileHeight - 0.5}px`
      dropSpot.style.width = `${tileWidth}px`
      document.getElementById('dropArea').appendChild(dropSpot)
    }
  }
  setUpDragAndDrop()
}

function setUpDragAndDrop() {
  const dropArea = document.getElementById('dropArea')

  pieces.forEach((piece) => {
    piece.canvas.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', piece.canvas.dataset.position)
    })
  })

  dropArea.addEventListener('dragover', function (e) {
    e.preventDefault()
  })

  dropArea.addEventListener('drop', function (e) {
    e.preventDefault()
    const target = e.target.closest('.dropSpot')
    if (target && target.dataset.occupied === 'false') {
      const draggedData = e.dataTransfer.getData('text/plain')
      const piece = pieces.find(
        (p) => p.canvas.dataset.position === draggedData
      )
      console.log(draggedData)
      if (piece) {
        const draggedElement = piece.canvas
        const previousDropSpot = draggedElement.parentElement
        if (previousDropSpot.classList.contains('dropSpot')) {
          previousDropSpot.dataset.occupied = 'false'
        }

        target.appendChild(draggedElement)

        draggedElement.setAttribute('is-on-drop-area', 'true')

        updateOccupiedAttributes()

        checkCompletion()
      } else {
        console.error('Dragged piece not found in the pieces array!')
      }
    }
  })
}

function updateOccupiedAttributes() {
  const dropSpots = document.querySelectorAll('.dropSpot')
  dropSpots.forEach((dropSpot) => {
    if (dropSpot.childNodes.length > 0) {
      dropSpot.dataset.occupied = 'true'
      dropSpot.style.border = 'none'
    } else {
      dropSpot.dataset.occupied = 'false'
      dropSpot.style.border = '1px solid black'
    }
  })
}

function checkCompletion() {
  const allPlacedCorrectly = pieces.every((piece) => {
    const currentDropSpot = piece.canvas.parentElement
    if (currentDropSpot.classList.contains('dropSpot')) {
      return piece.canvas.dataset.position === currentDropSpot.dataset.position
    }
    return false
  })

  if (allPlacedCorrectly) {
    setTimeout(() => {
      window.alert('Congratulations! Puzzle completed successfully.')
      // Send system notification
      new Notification('Puzzle completed!', {
        body: 'Congratulations! You completed the puzzle successfully. (system notification)',
      })
    }, 1000)
  }
}

document.getElementById('saveButton').addEventListener('click', function () {
  leafletImage(map, function (err, canvas) {
    if (err) throw err

    const hiddenCanvas = document.createElement('canvas')
    hiddenCanvas.width = canvas.width
    hiddenCanvas.height = canvas.height
    const hiddenContext = hiddenCanvas.getContext('2d')
    hiddenContext.drawImage(canvas, 0, 0)

    splitImage(hiddenCanvas)
  })
})
