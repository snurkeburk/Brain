let cubeSize = 5;
let missingSize = 75;
let cellSize = 20;
let cubies = [];
let brokenCubes = [];
let originalRemovedCubies = [];  // New global variable to store the removed cubies
let selectedCubeIndex = -1;
let correctCubeIndex = -1;
let enterPressed = false;
let isCorrectSelection = false;  // New variable to track if the correct cube is selected

let rotationX;
let rotationY;

let timer;
let timeLeft = 300; // 5 minutes in seconds
let correctAttempts = 0;
let incorrectAttempts = 0;

 /* TODO: 
 Add an option to randomly rotate the cubes below to make it harder.
 A "dont show colors" option would be nice.
 */

function setup() {
  createCanvas(windowWidth/2, windowHeight/1.25, WEBGL).parent('canvas-container');  // Attach canvas to the container
  smooth();

  rotationX = radians(-25);  // Initialize rotationX to -30 degrees in radians
  rotationY = radians(-45);  // Initialize rotationY to -45 degrees in radians
  ortho(-width/2, width/2, -height/2, height/2, -5000, 5000);
  resetCubes();  // Initialize the cubes

  timer = setInterval(updateTimer, 1000); // Start the timer
}

function draw() {
  background(255);
  lights();
  fill(150);  // Set fill color to gray
  stroke(0);
  rotateX(rotationX);
  rotateY(rotationY);

  // Draw remaining cubies of the original cube
  for (let pos of cubies) {
    push();
    translate(pos.x, pos.y, pos.z);
    box(cellSize);
    pop();
  }

  // Draw broken cubes
  for (let i = 0; i < brokenCubes.length; i++) {
    let brokenCube = brokenCubes[i];
    for (let pos of brokenCube) {
      push();
      translate(pos.x + (i - 1.5) * (cubeSize * cellSize + 150), pos.y + (cubeSize * cellSize + 100), pos.z);  // Shift by (i + 1) * (cubeSize * cellSize + 50) units on the x-axis and down on the y-axis

      if (i == selectedCubeIndex) {
        if (enterPressed) {
          if (isCorrectSelection) {
            fill(0, 255, 0);    // Green if correct
          } else {
            fill(255, 0, 0);    // Red if incorrect
          }
        } else {
          fill(255, 255, 0);  // Yellow if selected
        }
      } else {
        fill(150);  // Gray
      }

      box(cellSize);
      pop();
    }
  }
}

function resetCubes() {
  cubies = [];
  brokenCubes = [];
  selectedCubeIndex = -1;
  correctCubeIndex = -1;
  enterPressed = false;
  isCorrectSelection = false;

  initializeCubies();
  removeRandomCubies(missingSize);
  generateBrokenCubes(missingSize, 3);  // Generate 3 more broken cubes with 75 missing cubies each
  shuffleArray(brokenCubes);     // Shuffle the order of the broken cubes
  correctCubeIndex = 0;  // Initialize but not used until ENTER is pressed
}

function initializeCubies() {
  cubies = [];
  for (let x = 0; x < cubeSize; x++) {
    for (let y = 0; y < cubeSize; y++) {
      for (let z = 0; z < cubeSize; z++) {
        let xpos = x * cellSize - (cubeSize * cellSize) / 2;
        let ypos = y * cellSize - (cubeSize * cellSize) / 2;
        let zpos = z * cellSize - (cubeSize * cellSize) / 2;
        cubies.push(createVector(xpos, ypos, zpos));
      }
    }
  }
}

function removeRandomCubies(count) {
  shuffleArray(cubies);
  originalRemovedCubies = [];  // Initialize the variable
  for (let i = 0; i < count; i++) {
    if (cubies.length > 0) {
      let removed = cubies.pop();
      originalRemovedCubies.push(removed);  // Store the removed cubies
    }
  }
  brokenCubes.push(originalRemovedCubies);  // Add the removed cubies to the broken cubes list
}

function generateBrokenCubes(count, numberOfCubes) {
  for (let i = 0; i < numberOfCubes; i++) {
    let newCubies = [];
    for (let x = 0; x < cubeSize; x++) {
      for (let y = 0; y < cubeSize; y++) {
        for (let z = 0; z < cubeSize; z++) {
          let xpos = x * cellSize - (cubeSize * cellSize) / 2;
          let ypos = y * cellSize - (cubeSize * cellSize) / 2;
          let zpos = z * cellSize - (cubeSize * cellSize) / 2;
          newCubies.push(createVector(xpos, ypos, zpos));
        }
      }
    }
    shuffleArray(newCubies);
    let newBrokenCube = [];
    for (let j = 0; j < count; j++) {
      if (newCubies.length > 0) {
        let removed = newCubies.pop();
        newBrokenCube.push(removed);
      }
    }
    brokenCubes.push(newBrokenCube);
  }
}

function keyPressed() {
  if (key >= '1' && key <= '4') {
    let index = key - '1';
    if (index < brokenCubes.length) {
      selectedCubeIndex = index;
    }
  } else if (keyCode === ENTER) {
    if (enterPressed) {
      resetCubes();  // Reset the cubes if ENTER is pressed again
    } else {
      enterPressed = true;
      isCorrectSelection = (brokenCubes[selectedCubeIndex] === originalRemovedCubies);  // Check if the selected cube is correct
      updateCounters();
    }
  }
}

function mouseDragged() {
  // Update rotationX and rotationY based on mouse movement
  let deltaX = (pmouseX - mouseX) * 0.01;
  let deltaY = (pmouseY - mouseY) * 0.01;
  rotationX += deltaY;
  rotationY += deltaX;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  } else {
    clearInterval(timer);
    document.getElementById('timer').textContent = "Time's up!";
  }
}

function updateCounters() {
  if (isCorrectSelection) {
    correctAttempts++;
    document.getElementById('correct-attempts').textContent = `Correct attempts: ${correctAttempts}`;
  } else {
    incorrectAttempts++;
    document.getElementById('incorrect-attempts').textContent = `Incorrect attempts: ${incorrectAttempts}`;
  }
}
