function inShadow(pVals, lgt, skipPlayer){
  let winner = null
  let dir = [pVals[0]-lgt[0], pVals[1]-lgt[1], pVals[2]-lgt[2]]

  let start = 0

  if(skipPlayer) start = 1

  for(let j=start; j<shapes.length; j++){
    let test = shapes[j].checkIntersect(lgt, pVals, dir)
    if(test == null)return true
  }

  return false
}

function getShadows(){
  let l = Math.floor(cam.x)
  let r = Math.floor(cam.x + scrW)
  let t = Math.floor(cam.y)
  let b = Math.floor(cam.y + scrH)


  let newFrame = []
  for(let y=t; y < b; y++){
    for(let x=l; x<r; x++){
      let i = 4 * (x + y * levelw)
      let pData = [pixelData[i], pixelData[i+1], pixelData[i+2]]


      if(x<0||y<0||x>=roomArray[0][0].length||y>=roomArray[0].length){
        newFrame.push(0)
        newFrame.push(0)
        newFrame.push(0)
        newFrame.push(255)

        continue
      }

      let arr = roomArray[0][y][x]


      if(x >= player1.x - 1 && x < player1.x + 1 &&
      y >= (player1.y - 4 - player1.z) && y < player1.y - player1.z){
        if(arr[1] <= player1.y){
          arr = [x + 0.5, player1.y, player1.y - y, 0, 1, 0]
          pData = [255, 255, 255]
        }
      }

      let rness = 0
      let gness = 0
      let bness = 0

      let cVals
      for(let j=0; j<lights.length; j++){
        cVals = lights[j].getColVals(arr)

        rness += cVals[0]
        gness += cVals[1]
        bness += cVals[2]
      }

      newFrame.push(rness * pData[0])
      newFrame.push(gness * pData[1])
      newFrame.push(bness * pData[2])
      newFrame.push(255)
    }
  }
  return newFrame
}

lights.push(new Light(40, 76, 25, [255, 0, 0], 10))
lights.push(new Light(120, 76, 25, [255, 0, 0], 10))

//shape
[48,56,0,32,8,64],

//Light
// getColVals(pVals){
//   let lit = [this.x, this.y, this.z]
//   let brness = brightness(lit, pVals, this.brt)
//
//   if(brness < 0.01){
//     return([0, 0, 0])
//   }
//
//   if(inShadow(pVals, lit, false)){
//     brness = brness * 0.7
//   }
//
//   return([
//     brness * (this.col[0]/255),
//     brness * (this.col[1]/255),
//     brness * (this.col[2]/255)
//   ])
// }

// getColVals(pVals){
//   let dist = 100000
//   let winner = null
//   let dir = [pVals[0]-this.x, pVals[1]-this.y, pVals[2]-this.z]
//
//   let lit = [this.x, this.y, this.z]
//   let brness = brightness(lit, pVals, this.brt)
//   let val = [pVals[3], pVals[4], pVals[5]]
//
//   for(let j=0; j<shapes.length; j++){
//     let test = shapes[j].checkIntersect(lit, pVals, dir)
//     if(test==null) continue
//
//     if((
//       ((this.x < test[0] && pVals[0] > test[0]) ||
//       (this.x > test[0] && pVals[0] < test[0])) ||
//       ((this.y < test[1] && pVals[1] > test[1]) ||
//       (this.y > test[1] && pVals[1] < test[1])) ||
//       ((this.z < test[2] && pVals[2] > test[2]) ||
//       (this.z > test[2] && pVals[2] < test[2]))
//     )){
//       winner = test
//     }
//   }
//
//   if(winner != null){
//     brness = brness * 0.2
//   }
//
//   return([
//     brness * (this.col[0]/255),
//     brness * (this.col[1]/255),
//     brness * (this.col[2]/255)
//   ])
// }

checkIntersect2(pt1, pt2, dir){
  if(this.minx > pt1[0] && this.minx > pt2[0] ||
    this.maxx < pt1[0] && this.maxx < pt2[0] ||
    this.miny > pt1[1] && this.miny > pt2[1] ||
    this.maxy < pt1[1] && this.maxy < pt2[1] ||
    this.minz > pt1[2] && this.minz > pt2[2] ||
    this.maxz < pt1[2] && this.maxz < pt2[2]){
      return null;
  }

  let new_pos
  let ratio
  let winner = null
  let dist
  let min_dist = 100000

  for(let i=0; i<3; i++){
    for(let j=0; j<2; j++){
      ratio =((this.bounds[i * 2 + j] - pt1[i])/dir[i])
      new_pos = [pt1[0]+ratio * dir[0], pt1[1]+ratio * dir[1], pt1[2]+ratio * dir[2]]

      if(this.checkForPt(new_pos)){
        dist = ptDist(pt1, new_pos)
        if(dist < min_dist){
          winner = new_pos
          min_dist = dist
        }
      }
    }
  }
  return winner
}
