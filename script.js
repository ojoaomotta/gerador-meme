// script.js

// obtém referências aos elementos do DOM
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const imageLoader = document.getElementById('imageLoader')
const topTextInput = document.getElementById('topText')
const bottomTextInput = document.getElementById('bottomText')
const fontSizeInput = document.getElementById('fontSize')
const fontColorInput = document.getElementById('fontColor')
const fontFamilySelect = document.getElementById('fontFamily')
const saveMemeButton = document.getElementById('saveMeme')
const shareMemeButton = document.getElementById('shareMeme')
const drawRectButton = document.getElementById('drawRect')
const drawCircleButton = document.getElementById('drawCircle')
const freeDrawButton = document.getElementById('freeDraw')

// variáveis para armazenar o estado atual
let image = new Image()
let isDrawing = false
let drawMode = null
let startX, startY

// carrega a imagem selecionada pelo usuário
imageLoader.addEventListener('change', function(e) {
  const reader = new FileReader()
  reader.onload = function(event) {
    image = new Image()
    image.onload = function() {
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0)
      drawText()
    }
    image.src = event.target.result
  }
  reader.readAsDataURL(e.target.files[0])
})

// desenha o texto no canvas
function drawText() {
  ctx.drawImage(image, 0, 0)
  ctx.fillStyle = fontColorInput.value
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.textAlign = 'center'
  ctx.font = `${fontSizeInput.value}px ${fontFamilySelect.value}`
  ctx.fillText(topTextInput.value, canvas.width / 2, fontSizeInput.value)
  ctx.strokeText(topTextInput.value, canvas.width / 2, fontSizeInput.value)
  ctx.fillText(bottomTextInput.value, canvas.width / 2, canvas.height - 10)
  ctx.strokeText(bottomTextInput.value, canvas.width / 2, canvas.height - 10)
}

// atualiza o texto quando os inputs mudam
[topTextInput, bottomTextInput, fontSizeInput, fontColorInput, fontFamilySelect].forEach(input => {
  input.addEventListener('input', drawText)
})

// salva o meme como imagem
saveMemeButton.addEventListener('click', function() {
  const link = document.createElement('a')
  link.download = 'meme.png'
  link.href = canvas.toDataURL()
  link.click()
})

// compartilha o meme nas redes sociais
shareMemeButton.addEventListener('click', function() {
  const dataUrl = canvas.toDataURL()
  const blob = dataURLToBlob(dataUrl)
  const file = new File([blob], 'meme.png', { type: 'image/png' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      files: [file],
      title: 'meu meme',
      text: 'olha só esse meme que eu criei!'
    })
  } else {
    alert('compartilhamento não suportado neste navegador.')
  }
})

// converte dataURL para Blob
function dataURLToBlob(dataURL) {
  const parts = dataURL.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}

// funções para desenho
canvas.addEventListener('mousedown', function(e) {
  if (!drawMode) return
  isDrawing = true
  startX = e.offsetX
  startY = e.offsetY
})

canvas.addEventListener('mousemove', function(e) {
  if (!isDrawing) return
  if (drawMode === 'free') {
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
  }
})

canvas.addEventListener('mouseup', function(e) {
  if (!drawMode) return
  isDrawing = false
  const endX = e.offsetX
  const endY = e.offsetY
  if (drawMode === 'rect') {
    const width = endX - startX
    const height = endY - startY
    ctx.strokeRect(startX, startY, width, height)
  } else if (drawMode === 'circle') {
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
    ctx.beginPath()
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
    ctx.stroke()
  }
  drawMode = null
})

// botões de desenho
drawRectButton.addEventListener('click', function() {
  drawMode = 'rect'
})

drawCircleButton.addEventListener('click', function() {
  drawMode = 'circle'
})

freeDrawButton.addEventListener('click', function() {
  drawMode = 'free'
  ctx.beginPath()
})
