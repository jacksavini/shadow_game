class Camera{
  constructor(){
    this.w = canvas.width
    this.h = canvas.height

    this.x = 0
    this.y = 0

    this.tracked = null
  }

  follow(){
    this.w = canvas.width
    this.h = canvas.height

    this.x = this.tracked.x - this.w * xCenter
    this.y = this.tracked.y - this.h * yCenter

    if(this.x < 0) this.x = 0;
    if(this.y < 0) this.y = 0;
    if(this.x >= Math.abs(levelw - scrW)) this.x = Math.abs(levelw - scrW);
    if(this.y >= Math.abs(levelh - scrH)) this.y = Math.abs(levelh - scrH);
  }

  update(){
    this.follow()
  }
}

class Character{
  constructor(x, y, color){
    this.x = x
    this.y = y
    this.z = 10

    this.planted = true

    this.pix = []
    this.makePixels()

    this.warped = false

    this.col = color

    this.switch = true

    this.grav = -0.05
    this.zSpd = 0

    this.hSpd = 0
    this.vSpd = 0
  }

  makePixels(){
    for(let y=0; y<4; y++){
      for(let x=-1; x<1; x++){
        this.pix.push(
          new Pixel(
            this.x + x, this.y, this.z - y,
            [255, 255, 255],
            [0, 1, 0], 1
          )
        )
      }
    }
  }

  updatePixels(){
    for(let y=3.5; y>=0; y--){
      for(let x=-0.5; x<1; x++){

        let pixl = this.pix[(3.5-y)*2+x+0.5]

        pixl.x = this.x + x
        pixl.y = this.y
        pixl.z = this.z + y
      }
    }
    logg("P", )
  }

  newCoords(){
    this.hSpd = (ctr["D"] - ctr["A"])
    this.vSpd = (ctr["S"] - ctr["W"])

    if(ctr["J"] && this.planted){
      this.zSpd = 4
      ctr["J"] = false
      this.planted = false
    }

    this.zSpd -= 0.5

    if(this.zSpd < -4){
      this.zSpd = -4;
    }

    this.oldx = this.x
    this.oldy = this.y
    this.oldz = this.z

    this.x += this.hSpd
    this.y += this.vSpd
    this.z += this.zSpd
  }

  shapeCheck(){
    for(let i=0; i<game.s.length; i++){
      let shape = game.s[i]

      if(shape.checkPlane(this.oldx, this.oldy, 0, 1) &&
         shape.checkPlane(this.x, this.y, 0, 1)){
        if(this.oldz >= shape.maxz && this.z < shape.maxz){
          this.z = shape.maxz
          this.planted = true
        }
      }

      if(shape.checkPlane(this.oldx, this.oldz + 0.1, 0, 2) &&
         shape.checkPlane(this.x, this.z + 0.1, 0, 2)){
        if(!this.switch && this.oldy >= shape.maxy && this.y < shape.maxy){
          this.y = shape.maxy
        }

        if(this.switch && this.oldy > shape.maxy && this.y <= shape.maxy){
          this.y = shape.maxy + 1
        }

        if(this.oldy < shape.miny && this.y >= shape.miny){
          this.y = shape.miny - 1
        }
      }

      if(shape.checkPlane(this.oldy + 0.1, this.oldz + 0.1, 1, 2) &&
         shape.checkPlane(this.y + 0.1, this.z + 0.1, 1, 2)){

        if(this.oldx > shape.maxx && this.x <= shape.maxx){
          this.x = shape.maxx + 1
        }

        if(this.oldx < shape.minx && this.x >= shape.minx){
          this.x = shape.minx - 1
        }
      }
    }
  }

  toggleLight(){
    if(ptDist(this, lights[0]) < 3){
      this.switch = !this.switch
      return
    }
  }

  moveSillhouette(){
    if(this.switch){
      lights[0].follow()
    }

    if(this.switch){
      game.s[0].minx = 0
      game.s[0].maxx = 0
      game.s[0].miny = 0
      game.s[0].maxy = 0
      game.s[0].minz = 0
      game.s[0].maxz = 0
    }

    else{
      game.s[0].minx = this.x-1
      game.s[0].maxx = this.x+1
      game.s[0].miny = this.y-1
      game.s[0].maxy = this.y
      game.s[0].minz = this.z
      game.s[0].maxz = this.z + 4
    }

    game.s[0].bounds = [
      game.s[0].minx,
      game.s[0].maxx,
      game.s[0].miny,
      game.s[0].maxy,
      game.s[0].minz,
      game.s[0].maxz
    ]
  }

  moveShadow(){
    let p=0
    for(let d=0; d<2; d++){
      while(p<game.pixels.length){
        let pix = game.pixels[p]

        if(pix.axis != 1){
          p++
          continue
        }

        if(
          this.pix[6+d].y == pix.y &&
          this.pix[6+d].x == pix.x &&
          Math.floor(this.pix[7+d].z) - 1 == Math.floor(pix.z) &&
          pix.shaded
        ){
          this.z = Math.ceil(this.z) + 0.5
          this.zSpd = 0
          this.planted = true
          this.updatePixels()
          p = Math.max(0, p - levelw * 2)
        }

        else{
          p++
        }
      }
    }
    console.log(this.pix[7].z)
  }

  update(){
      if(ctr["K"]){
      this.toggleLight()
      ctr["K"]=false
    }

    this.newCoords()

    this.updatePixels()

    this.shapeCheck()

    this.moveShadow()

    this.updatePixels()

    this.moveSillhouette()


  }

  draw(){

  }

}

class Shape{
  constructor(points){
    this.minx = points[0]
    this.maxx = points[0] + points[3]

    this.miny = points[1]
    this.maxy = points[1] + points[4]

    this.minz = points[2]
    this.maxz = points[2] + points[5]

    this.bounds = []
    this.updateBounds()
  }

  updateBounds(){
    this.bounds = [this.minx, this.maxx, this.miny, this.maxy, this.minz, this.maxz]
  }

  checkIntersect(pt1, pt2){
    let dir = {
      x:pt2.x-pt1.x,
      y:pt2.y-pt1.y,
      z:pt2.z-pt1.z
    }

    if(
      this.minx > pt1.x && this.minx > pt2.x ||
      this.maxx < pt1.x && this.maxx < pt2.x ||
      this.miny > pt1.y && this.miny > pt2.y ||
      this.maxy < pt1.y && this.maxy < pt2.y ||
      this.minz > pt1.z && this.minz > pt2.z ||
      this.maxz < pt1.z && this.maxz < pt2.z
    ){
        return null;
    }

    this.updateBounds()

    let new_pos1
    let ratio1

    let new_pos2
    let ratio2

    let winner = null
    let dist
    let min_dist = 10000

    let ax = ["x", "y", "z"]
    let ix

    for(let i=2; i>-1; i--){
      for(let j=0; j<2; j++){
        ix = ax[i]

        ratio1 =((this.bounds[i * 2 + j] - pt1[ix])/dir[ix])
        new_pos1 = {
          x: pt1.x+ratio1 * dir.x,
          y: pt1.y+ratio1 * dir.y,
          z: pt1.z+ratio1 * dir.z
        }

        ratio2 =((this.bounds[i * 2 + j] - pt2[ix])/dir[ix])
        new_pos2 = {
          x: pt2.x+ratio2 * dir.x,
          y: pt2.y+ratio2 * dir.y,
          z: pt2.z+ratio2 * dir.z
        }

        if(this.checkForPt(new_pos1) || this.checkForPt(new_pos2)){
          dist = Math.min(ptDist(pt1, new_pos1), ptDist(pt1, new_pos2))
          if(dist < min_dist){
            winner = new_pos1
            min_dist = dist
          }
        }
      }
    }
    return winner
  }

  checkForPt(pt){
    if(pt.x>=this.minx && pt.x<=this.maxx && pt.y>=this.miny &&
    pt.y<=this.maxy && pt.z>=this.minz && pt.z<=this.maxz){
      return true
    }
    return false
  }

  checkPlane(num1, num2, axis1, axis2){
    if(
      num1 < this.bounds[axis1*2] ||
      num1 > this.bounds[axis1*2+1] ||
      num2 < this.bounds[axis2*2] ||
      num2 > this.bounds[axis2*2+1]
    ){
      return(false)
    }

    return(true)
  }
}

class Light{
  constructor(x, y, z, color, brightness){
    this.x = x
    this.y = y
    this.z = z

    this.col = color

    this.brt = brightness
  }

  getCoords(){
    return [this.x, this.y, this.z]
  }

  follow(){
    this.x = player1.x
    this.y = player1.y
    this.z = player1.z + 1
  }

  update(){}

  draw(){
    let i = ((this.y - this.z - cam.y) * scrW + this.x - cam.x)*4
    if(i>=game.frame.length) return
    if(game.pixels[Math.floor(this.y - this.z) * game.w + Math.floor(this.x)].y < this.y){
      game.frame[i] = this.col[0]
      game.frame[i + 1] = this.col[1]
      game.frame[i + 2] = this.col[2]
    }
  }
}

class Pixel{
  constructor(x, y, z, color, normal, axis){
    this.x = x;
    this.y = y;
    this.z = z;

    this.shadowAmt = 0.5

    this.axis = axis

    this.r = color[0];
    this.g = color[1],
    this.b = color[2],

    this.normal = normal;

    this.shaded = false
  }

  getBrightness(light){

    this.shaded = false


    let t = {x:this.normal[0], y:this.normal[1], z:this.normal[2]}
    let l = {x:this.x - light.x, y:this.y - light.y, z:this.z - light.z}

    let dist = Math.pow(this.x - light.x, 2) +
               Math.pow(this.y - light.y, 2) +
               Math.pow(this.z - light.z, 2)

    let angle = (t.x * l.x + t.y * l.y + t.z * l.z)
    angle = angle / Math.sqrt(t.x*t.x+t.y*t.y+t.z*t.z)
    angle = angle / Math.sqrt(l.x*l.x+l.y*l.y+l.z*l.z)
    angle = 1 - angle

    if(angle < this.shadowAmt){
      angle = this.shadowAmt
      this.shaded = true
    }

    else{
      let winner = null;
      for(let j=0; j<game.s.length; j++){
        let test = game.s[j].checkIntersect(light, this)

        if(test==null) continue

        if((
          ((light.x < test.x && this.x > test.x) ||
          (light.x > test.x && this.x < test.x)) ||
          ((light.y < test.y && this.y > test.y) ||
          (light.y > test.y && this.y < test.y)) ||
          ((light.z < test.z && this.z > test.z) ||
          (light.z > test.z && this.z < test.z))
        )){
          winner = test
        }
      }

      if(winner != null){
        angle = this.shadowAmt
        this.shaded = true
      }
    }

    return(Math.min(angle * light.brt/(light.brt+dist), 1))
  }

  get2DCoords(){
    let x = Math.floor(this.x)
    let y = this.y - Math.floor(this.z - 0.5) - 1

    return {x:x, y:y}
  }

  getColVal(){
    let rness = 0
    let gness = 0
    let bness = 0

    for(let l=0; l<game.l.length; l++){
      let light = game.l[l]
      let brness = this.getBrightness(light)

      rness += brness * (light.col[0]/255)
      gness += brness * (light.col[1]/255)
      bness += brness * (light.col[2]/255)

    }

    return([rness, gness, bness])
  }
}

class Game{
  constructor(player, shapes, lights, camera, width, height){
    this.p = player
    this.s = shapes
    this.l = lights

    this.cam = camera

    this.w = width
    this.h = height

    this.pixCols = this.getPixelColors()
    this.frame = []
    this.pixels = []
    this.makePixels()
  }

  getPixelColors(){
    canvas.width = levelw;
    canvas.height = levelh;

    ctx.drawImage(img.room2, 0, 0, levelw, 160);
    let pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    canvas.width = scrW
    canvas.height = scrH

    return pixelData
  }

  getFrontShape(x, y){
    let i = 4 * (x + y * this.w)

    let winner = this.s[1]

    for(let j=this.s.length - 1; j>=1; j--){
      if(this.s[j].maxy - this.s[j].minz> y && this.s[j].miny - this.s[j].maxz<= y &&
        this.s[j].minx <= x && this.s[j].maxx > x){
        winner = this.s[j]
        return winner
      }
    }
  }

  makePixels(){
    for(let y=0; y<levelh; y++){
      for(let x=0; x<levelw; x++){

        let i = 4 * (x + y * this.w)

        let fShape = this.getFrontShape(x, y)

        if(fShape == undefined){
          this.pixels.push(
            new Pixel(x+0.5, y, -128,
            [255, 255, 255],
            [0, 0, 1], 2)
          )
          continue
        }

        if(y >= fShape.maxy - fShape.maxz){
          this.pixels.push(
            new Pixel(x+0.5, fShape.maxy, fShape.maxy - (y+0.5),
            [this.pixCols[i], this.pixCols[i+1], this.pixCols[i+2]],
            [0, 1, 0], 1)
          )
        }

        else{
          this.pixels.push(
            new Pixel(x+0.5, y + fShape.maxz + 0.5, fShape.maxz,
              [this.pixCols[i], this.pixCols[i+1], this.pixCols[i+2]],
              [0, 0, 1], 2)
          )
        }
      }
    }
  }

  addToFrame(r, g, b, a){
    this.frame.push(r)
    this.frame.push(g)
    this.frame.push(b)
    this.frame.push(a)
  }

  outOfBounds(x, y){
    return (x<0 || y<0 || x>=game.w || y>=game.h)
  }

  getShadows(){
    let l = Math.floor(cam.x)
    let r = Math.floor(cam.x + this.w)
    let t = Math.floor(cam.y)
    let b = Math.floor(cam.y + this.h)

    let darken = false

    this.frame = []
    for(let y=t; y < b; y++){
      for(let x=l; x<r; x++){

        if(this.outOfBounds(x, y)){
          addToFrame(0, 0, 0, 255)
          continue
        }

        let i = x + y * levelw
        let pix = this.pixels[i]

        let dx = x - this.p.x
        let dy = y - (this.p.y - Math.floor(this.p.z) - 4)

        if( -1 <= dx && 1  > dx && 0  <= dy && 4  > dy ){
          if(pix.y < this.p.y){
            pix = this.p.pix[dy * 2 + dx + 1]
          }

          else if(pix.y == this.p.y){
            darken = true
          }
        }

        let cVals = pix.getColVal()

        if(pix.shaded){
          darken = false
        }

        if(darken){
          cVals[0]*=0.3
          cVals[1]*=0.3
          cVals[2]*=0.3

          darken = false
        }

        this.addToFrame(
          cVals[0] * pix.r,
          cVals[1] * pix.g,
          cVals[2] * pix.b,
          255
        )
      }
    }
  }
}

function logg(key, prompt){
  if(key == ""){
    console.log(prompt)
  }

  if(ctr[key]){
    console.log(prompt)
    ctr[key] = false
  }
}

function sameArr(a1, a2){
  if(a1.length != a2.length){return false}

  for(let i=0; i<a1.length; i++){
    if(a1[i] != a2[i]){
      return [a1[i], a2[i]]
    }
  }
  return true
}

function ptDist(pt1, pt2){
  return Math.sqrt(
    Math.pow(pt2.x-pt1.x, 2) +
    Math.pow(pt2.y-pt1.y, 2) +
    Math.pow(pt2.z-pt1.z, 2)
  )
}

function animate(){

  ctx.clearRect(0,0,canvas.width, canvas.height)

  player1.update()
  cam.update()

  for(let i=0; i<lights.length; i++){
    lights[i].update()
  }

  game.getShadows()

  if(!player1.switch){
    lights[0].draw()
  }

  player1.draw()

  ctx.putImageData(new ImageData(Uint8ClampedArray.from(game.frame), scrW, scrH), 0, 0)
}
