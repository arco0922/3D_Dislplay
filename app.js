let facemesh;
let video;
let predictions = [];

let cx,cy,oldx,oldy;
let sx,sy,sz;
const spherenum = 100;

let msg;

function setup() {
  const mycnv = createCanvas(innerWidth,innerHeight,WEBGL);
  mycnv.parent('#wrapper');
  video = createCapture(VIDEO);
  video.size(640, 480);

  facemesh = ml5.facemesh(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", results => {
    predictions = results;
    //console.log(predictions);
  });

  // Hide the video element, and just show the canvas
  video.hide();
  cx = 0;
  cy = 0;
  oldx = 0;
  oldy = 0;

  sx = Array(spherenum);
  sy = Array(spherenum);
  sz = Array(spherenum);
  for (let i=0; i<spherenum; i++) {
    sx[i] = random(-700,700);
    sy[i] = random(-300,300);
    sz[i] = random(0,1700);
  }
  //console.log(sx,sy,sz);
  msg = document.getElementById("loadexp");
}

function modelReady() {
  //console.log("Model ready!");
  msg.textContent = 'Ready!';
}

function draw() {
  background(0);

  //image(video, 0, 0, width, height);

  // We call function to draw all keypoints
  drawBoundingBox();
}

// A function to draw ellipses over the detected keypoints
function drawBoundingBox() {
  if (predictions.length>0) {
    if (msg.textContent!=='') {
      msg.textContent = '';
    }
    const topLeft = predictions[0].boundingBox.topLeft[0];
    const bottomRight = predictions[0].boundingBox.bottomRight[0];
    cx = (-(topLeft[0]+bottomRight[0])/2+320)*width/640;
    cy = ((7*topLeft[1]+5*bottomRight[1])/12-240)*height/480;  
    cx = oldx * 0.2 + cx * 0.8;
    cy = oldy * 0.2 + cy * 0.8;
    oldx = cx;
    oldy = cy;
  }
  //console.log(cx,cy);
  camera(cx,cy,2000,cx,cy,0,0,1,0);
  frustum((-cx-width/2)/10.0,(width/2-cx)/10.0,(height/2-cy)/10.0,-(cy+height/2)/10.0,104,5000);
  
  lights();
  for(let i = 0; i < spherenum; i++) {
    g = (sz[i]%2000)/5.0;
    fill(g);
    noStroke();
    translate(sx[i], sy[i], sz[i]%2000);
    sphere(30);
    translate(-sx[i], -sy[i], -sz[i]%2000);
  }

  t = 100;
  for(let j = 0; j < 80; j++) {
    strokeWeight(100);
    stroke(t);
    line(-width/2,height/2,960-j*50,width/2,height/2,960-j*50);
    line(-width/2,height/2,960-j*50,-width/2,-height/2,960-j*50);
    line(-width/2,-height/2,960-j*50,width/2,-height/2,960-j*50);
    line(width/2,-height/2,960-j*50,width/2,height/2,960-j*50);
    t = t * 0.9;
  }
}

function windowResized() {
  resizeCanvas(innerWidth,innerHeight);
}