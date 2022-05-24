let video;
let poseNet;
let pose;
let skeleton;
let count = -1 , prev = 'Y';

let brain;
let poseLabel = "Stand";

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'model2/model.json',
    metadata: 'model2/model_meta.json',
    weights: 'model2/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  }
  //console.log(results[0].confidence);
  classifyPose();
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();
  
    if(poseLabel== 'Y'){
      if(prev != 'Y') {
        // count += 1;
        prev = 'Y';
      }
      fill(255, 255, 255);
    noStroke();
    textSize(40);
    textAlign(CENTER, CENTER);
      console.log(count);
      text(`Standing - ${count}`, width / 2, height / 1.1);
    } else {
      if(prev == 'Y') {
        count += 1;
        prev = 'A';
      }
      fill(255, 255, 255);
    noStroke();
    textSize(40);
    textAlign(CENTER, CENTER);
     console.log(count);
      text(`Sitting - ${count}`, width / 2, height/ 1.1);
      
   }


   if(count==10){
    asgar({ 
      title: "Congrats ", 
      right: "Okay" 
    }).then(() => {
      console.log("OK");
    });
   }
 
}