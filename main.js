const board = document.querySelector('#board')
const ctx = board.getContext('2d')

const btn = document.getElementById('start')

//Mine variables
let x = board.width / 2 - 15
let y = board.height - 150
let dx = 2.5
let dy = -2.5
//Block variables
const blockRow = 3
const blockColumns = 7
const blockWidth = 100
const blockHeight = 20
const blockPadd = 20
const blockMargTop = 30
const blockMargLeft = 70
let blocks = []
for(let c = 0; c < blockColumns; c++) {
  blocks[c] = []
  for(let r = 0; r < blockRow; r++) {
    blocks[c][r] = { 
      x: 0, 
      y: 0, 
      status: 1 
    }
  }
}
//Score variable
let score = 0

//Classes for game components
class Board {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = board.width
    this.height = board.height
    this.img = new Image()
    this.img.src = './Images/undersea.png'
    this.img.onload = () => {
      this.draw()
    }
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
    this.x = 5
    this.y = board.height - 10
  }
  draw() {
    ctx.font = "22px Arial"
    ctx.fillStyle = "white"
    ctx.fillText(`Score: ${score}`, this.x, this.y)
  }
}

function drawBlocks() {
  for(let c = 0; c < blockColumns; c++) {
    for(let r = 0; r < blockRow; r++) {
      if(blocks[c][r].status === 1) {
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
      if(b.status === 1) {
        if(mine.x > b.x && mine.x < b.x + blockWidth && mine.y > b.y && mine.y < b.y + blockHeight) {
          dy = -dy
          b.status = 0
          score++
          if(score === blockColumns * blockRow) {
            alert('You win Willy is free!!!')
            clearInterval(interval)
          }
        }
      }  
    }
  }
}

const bgboard = new Board()
const ship = new Ship()
const mine = new Mine()
const points = new Score()

function update() {
  ctx.clearRect(0, 0, board.width, board.height)
  bgboard.draw()
  mine.draw()
  ship.draw()
  drawBlocks()
  collisionDetect()
  points.draw()
}

document.addEventListener('keydown', (e) => {
  if(e.keyCode === 39) {
     ship.moveRight()
  } else if (e.keyCode === 37) {
    ship.moveLeft()
  } 
})

// btn.onclick = () => {
//   let interval = setInterval(update, 10)
// }
let interval = setInterval(update, 10)






