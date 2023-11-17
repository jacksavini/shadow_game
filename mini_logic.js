const scrW=128,scrH=96;var pixelData;canvas.width=128,canvas.height=96;var scr_ratio=6;canvas.style="width:"+canvas.width*scr_ratio+"px;height:"+canvas.height*scr_ratio+"px;";var fps=30;function getIntersect(t,e,s,h){let a=(e[1]-t[1])/(e[0]-t[0]),i=(h[1]-s[1])/(h[0]-s[0]),r=t[1]-a*t[0],c=(s[1]-i*s[0]-r)/(a-i),n=a*c+r;return t[0]==e[0]&&(c=t[0],n=0),[c,n]}var ctr=constructController();function getShadows(t){let e=Math.floor(player1.x-canvas.width/2),s=Math.floor(player1.x+canvas.width/2),h=Math.floor(player1.y-3*canvas.height/4),a=Math.floor(player1.y+3*canvas.height/4),i=[];for(let r=h;r<a;r++)for(let h=e;h<s;h++)if(h<0||r<0||h>=roomArray[0][0].length||r>=roomArray[0].length)i.push(255),i.push(255),i.push(255),i.push(255);else{let e=roomArray[0][r][h],s=0,a=0,c=0;for(let h=0;h<t.length;h++)cVals=t[h].getColVals(e),s+=cVals[0],a+=cVals[1],c+=cVals[2];let n=4*(h+256*r);i.push(s*pixelData[n]),i.push(a*pixelData[n+1]),i.push(c*pixelData[n+2]),i.push(255)}ctx.putImageData(new ImageData(Uint8ClampedArray.from(i),s-e,a-h),0,0)}function brightness(t,e,s){return s/(s+(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2)+Math.pow(e[2]-t[2],2)))}window.addEventListener("keydown",function(t){87==t.keyCode&&(ctr.w=1),65==t.keyCode&&(ctr.a=1),83==t.keyCode&&(ctr.s=1),68==t.keyCode&&(ctr.d=1),16==t.keyCode&&(ctr.shft=1),74==t.keyCode&&(ctr.j=1),75==t.keyCode&&(ctr.k=1),13==t.keyCode&&(ctr.ent=1)}),window.addEventListener("keyup",function(t){87==t.keyCode&&(ctr.w=0),65==t.keyCode&&(ctr.a=0),83==t.keyCode&&(ctr.s=0),68==t.keyCode&&(ctr.d=0),16==t.keyCode&&(ctr.shft=0),74==t.keyCode&&(ctr.j=0),75==t.keyCode&&(ctr.k=0),13==t.keyCode&&(ctr.ent=0)});class Camera{constructor(){this.w=canvas.width,this.h=canvas.height,this.x=0,this.y=0,this.tracked=null}follow(){this.w=canvas.width,this.h=canvas.height,this.x=this.tracked.x-this.w/2,this.y=this.tracked.y-3*this.h/4}update(){this.follow()}drawShape(t,e,s){ctx.fillStyle=s;for(let h=0;h<e.length;h++){ctx.beginPath();for(let s=0;s<e[h].length;s++){if("string"==typeof e[h][s]){ctx.fillStyle=e[h][s];break}let a=t[e[h][s]][0],i=t[e[h][s]][1],r=t[e[h][s]][2];ctx.lineTo(a-this.x,i-r-this.y)}ctx.closePath(),ctx.fill(),ctx.fillStyle=s}}}class Character{constructor(t,e,s){this.x=t,this.y=e,this.z=0,this.col=s,this.plns=[[0,1,2,3]],this.switch=!0}update(){let t=ctr.d-ctr.a,e=ctr.s-ctr.w;this.x+=t,this.y+=e,ctr.k&&(player1.switch=!player1.switch,ctr.k=!1),this.pts=[[this.x-1,this.y,this.z+4],[this.x+1,this.y,this.z+4],[this.x+1,this.y,this.z],[this.x-1,this.y,this.z]]}draw(){cam.drawShape(this.pts,this.plns,this.col)}}var cam=new Camera,player1=new Character(96,48,"#FFFFFF");function animate(){player1.update(),cam.update(),getShadows(lights),player1.draw()}function ptDist(t,e){return Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2)+Math.pow(e[2]-t[2],2))}let frame;cam.tracked=player1;class Shape{constructor(t){this.minx=t[0],this.maxx=t[1],this.miny=t[2],this.maxy=t[3],this.minz=t[4],this.maxz=t[5],this.bounds=[];for(let e=0;e<6;e++)this.bounds.push(t[e])}checkIntersect(t,e,s){let h,a,i,r=null,c=1e5;for(let e=0;e<3;e++)for(let n=0;n<2;n++)a=(this.bounds[2*e+n]-t[e])/s[e],h=[t[0]+a*s[0],t[1]+a*s[1],t[2]+a*s[2]],this.checkForPt(h)&&(i=ptDist(t,h))<c&&(r=h,c=i);return r}checkForPt(t){return t[0]>=this.minx&&t[0]<=this.maxx&&t[1]>=this.miny&&t[1]<=this.maxy&&t[2]>=this.minz&&t[2]<=this.maxz}}var shapes=[new Shape([64,81,112,128,-64,0]),new Shape([128,145,128,144,-48,0]),new Shape([96,113,64,80,-112,0]),new Shape([70,179,104,108,-2,0]),new Shape([70,75,108,112,-2,0]),new Shape([102,107,80,104,-2,0]),new Shape([134,139,108,128,-2,0]),new Shape([174,179,64,104,-2,0]),new Shape([160,193,48,64,-128,0]),new Shape([0,257,0,-4,-192,0])];class Light{constructor(t,e,s,h,a){this.x=t,this.y=e,this.z=s,this.wavelength=5,this.col=h,this.brt=a}flicker(){this.col}getColVals(t){let e=null,s=[t[0]-this.x,t[1]-this.y,t[2]-this.z],h=[this.x,this.y,this.z],a=brightness(h,t,this.brt);t[3],t[4],t[5];for(let a=0;a<shapes.length;a++){let i=shapes[a].checkIntersect(h,t,s);null!=i&&((this.x<i[0]&&t[0]>i[0]||this.x>i[0]&&t[0]<i[0]||this.y<i[1]&&t[1]>i[1]||this.y>i[1]&&t[1]<i[1]||this.z<i[2]&&t[2]>i[2]||this.z>i[2]&&t[2]<i[2])&&(e=i))}return null!=e&&(a*=.5),[a*(this.col[0]/255),a*(this.col[1]/255),a*(this.col[2]/255)]}}var lights=[new Light(72,120,2,[0,0,255],200),new Light(136,136,2,[0,0,255],200),new Light(104,72,2,[0,0,255],200),new Light(176,48,12,[255,0,0],400)];const roomArray=[];window.onload=function(){roomArray.push(load()),setInterval(animate,1e3/fps)};