const board = document.querySelector('#board')
const ctx = board.getContext('2d')
const btn = document.getElementById('start')
const reset = document.getElementById('reset')

//Mine variables
let x = board.width / 2 - 15
let y = board.height - 140
let dx = 3
let dy = -3

//Block variables
const blockRow = 3
const blockColumns = 7
const blockWidth = 100
const blockHeight = 20
const blockPadd = 20
const blockMargTop = 30
const blockMargLeft = 65
let blocks = []
for(let c = 0; c < blockColumns; c++) {
  blocks[c] = []
  for(let r = 0; r < blockRow; r++) {
    blocks[c][r] = { 
      x: 0, 
      y: 0, 
      display: 1 
    }
  }
}

//Score variable
let score = 0

//Interval
let interval

//Classes for game components
class Board {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = board.width
    this.height = board.height
    this.img = new Image()
    this.img.src = './Images/undersea.png'
    this.audio = new Audio()
    this.audio.src = 'http://23.237.126.42/ost/pokemon-gold-silver-crystal/zbkuympx/022%20Violet%20City.mp3'

    this.img.onload = () => {
      this.draw()
    }
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
}

class Willy {
  constructor(){
    this.x = board.width / 2 - 80
    this.y = 25
    this.width = 250
    this.height = 100
    this.img = new Image()
    this.img.src = './Images/willy.png'
    this.audio = new Audio()
    this.audio.src = 'https://www.partnersinrhyme.com/files/sounds1/MP3/animal/WhalesDS/dolphin1.mp3'
  }  
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
}

class Mine {
  constructor() {
    this.x = x
    this.y = y
    this.width = 60
    this.height = 60
    this.img = new Image()
    this.img.src = './Images/mine.png'
    this.img.onload = () => {
      this.draw()
    }
  }
  draw() {
    if(this.x + dx > board.width - this.width || this.x + dx < this.width - 60) {
      dx = -dx
    }  
    if(this.y + dy > board.height - this.height || this.y + dy < this.height - 60) {
      dy = -dy
    } else if (this.y + dy > board.height - 68) {
        if(this.x > ship.x - 60 && this.x < ship.x + ship.width) {
          dy = -dy
        } else {
          bgboard.audio.pause()
          alert("GAME OVER");
          clearInterval(interval);
        }
      }
    ctx.drawImage(this.img, this.x += dx , this.y += dy, this.width, this.height)
  }
}

class Ship {
  constructor() {
    this.x = board.width/2 - 25
    this.y = board.height - 80
    this.width = 100
    this.height = 80
    this.img = new Image()
    this.img.src = './Images/yellowsub.png'
    this.img.onload = () => {
      this.draw()
    }
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
  moveRight() {
    if(this.x < board.width - this.width) this.x += 30
  }
  moveLeft() {
    if(this.x > 0) this.x -= 30
  }
}

class Score {
  constructor() {
    this.x = 10
    this.y = board.height - 10
  }
  draw() {
    ctx.font = "22px Arial"
    ctx.fillStyle = "white"
    ctx.fillText(`Score: ${score}`, this.x, this.y)
  }
}

//helper functions
function drawBlocks() {
  for(let c = 0; c < blockColumns; c++) {
    for(let r = 0; r < blockRow; r++) {
      if(blocks[c][r].display === 1) {
        let blockX = (c * (blockWidth + blockPadd)) + blockMargLeft
        let blockY = (r * (blockHeight + blockPadd)) + blockMargTop
        blocks[c][r].x = blockX
        blocks[c][r].y = blockY
        ctx.beginPath()
        ctx.rect(blockX, blockY, blockWidth, blockHeight)
        ctx.fillStyle = "#FF4E50"
        ctx.fill()
        ctx.closePath()
      }  
    }
  }
}

function collisionDetect() {
  for(let c = 0; c < blockColumns; c++) {
    for(let r = 0; r < blockRow; r++) {
      let b = blocks[c][r]
      if(b.display === 1) {
        if(mine.x > b.x + 5 && mine.x < b.x + blockWidth && mine.y > b.y - 50 && mine.y < b.y + blockHeight) {
          dy = -dy
          b.display = 0
          score++
          if(score === blockColumns * blockRow) {
            bgboard.audio.pause()
            alert('You win Willy is free!!!')
            willy.audio.play()
            clearInterval(interval) 
          }
        }
      }  
    }
  }
}

//Instances
const bgboard = new Board()
const ship = new Ship()
const mine = new Mine()
const points = new Score()
const willy = new Willy()

function update() {
  ctx.clearRect(0, 0, board.width, board.height)
  bgboard.draw()
  willy.draw()
  mine.draw()
  ship.draw()
  drawBlocks()
  collisionDetect()
  points.draw()
}


//Listeners
bgboard.audio.addEventListener('ended', function() {
  this.currentTime = 0
  this.play()
}, false)

document.addEventListener('keydown', (e) => {
  if(e.keyCode === 39 || e.keyCode === 68) {
     ship.moveRight()
  } else if (e.keyCode === 37 || e.keyCode === 65) {
    ship.moveLeft()
  } 
})

btn.onclick = () => {
  bgboard.audio.play() 
  interval = setInterval(update, 10)
}

reset.onclick = () => {
  document.location.reload()
}







