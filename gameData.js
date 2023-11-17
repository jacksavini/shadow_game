const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d");

const levelw = 128
const levelh = 160

const scrW = 128
const scrH = 160

var scr_ratio = 4

const fps = 30;

const scale = 2

const xCenter = 0.5
const yCenter = 0.8

var room4 = [[0, 0, 0, 0, 0, 0],
            [-16, 48, -16, 160, 16, 80],
            [-16, 64, -64, 160, 64, 64],
            [41, 95, 0, 3, 1, 3],
            [44, 95, 0, 3, 1, 6],
            [47, 95, 0, 3, 1, 9],
            [50, 95, 0, 3, 1, 12],
            [53, 95, 0, 3, 1, 15]
            ]

// var room4 = [[0, 0, 0, 0, 0, 0],
//             [-1, -1, -2, 130, 194, 2],
//             [0, 12, -2, 48, 44, 66],
//             [80, 12, -2, 48, 44, 66],
//             [61, 95, 0, 2, 1, 2],
//             [63, 95, 0, 2, 1, 4],
//             [65, 95, 0, 2, 1, 6],
//             [0,56,0,16,8,48],
//             [16,56,0,16,8,24],
//             [32,56,0,16,8,48],
//             [80,56,0,16,8,48],
//             [96,56,0,16,8,24],
//             [112,56,0,16,8,48],
//             [0,56,48,48,8,16],
//             [80,56,48,48,8,16],
//             [48,12,0,32,52,64],
//             [-16, -16, 0, 16, 224, 64],
//             [128, -16, 0, 16, 224, 64],
//             [0, 192, 0, 128, 16, 64]
//             ]

var shapes = [];
for(let i=0; i<room4.length; i++){
  room4[i][0]+=16
  room4[i][1]+=16
  shapes.push(new Shape(room4[i]));
}

var game

var lights = []
lights.push(new Light(72, 120, 2, [255, 255, 255], 1000))

var cam
cam = new Camera();

var player1
player1 = new Character(100, 100, "#FFFF00")

cam.tracked = player1

canvas.width = scrW;
canvas.height = scrH;

canvas.style = "width:" + canvas.width * scr_ratio + "px;" +
              "height:" + canvas.height * scr_ratio + "px;";

const img = {};
img.room2 = new Image();
img.room2.crossOrigin = "Anonymous";
img.room2.src = 'images/room4.png';

const ctr = {}
window.addEventListener("keydown", function(event){
  ctr[String.fromCharCode(event.keyCode)] = 1;

  if (event.keyCode == 16){
    ctr["SHFT"] = 1;
  }

  if (event.keyCode == 32){
    ctr["SPACE"] = 1;
  }

  if (event.keyCode == 13){
    ctr["ENT"] = 1;
  }
});
window.addEventListener("keyup", function(event){
  ctr[String.fromCharCode(event.keyCode)] = 0;

  if (event.keyCode == 16){
    ctr["SHFT"] = 0;
  }

  if (event.keyCode == 32){
    ctr["SPACE"] = 0;
  }

  if (event.keyCode == 13){
    ctr["ENT"] = 0;
  }
});

ctr["W"] = false
ctr["A"] = false
ctr["S"] = false
ctr["D"] = false

window.onload = function(){
  game = new Game(player1, shapes, lights, cam, scrW, scrH)
  setInterval(animate, 1000/fps);
}
