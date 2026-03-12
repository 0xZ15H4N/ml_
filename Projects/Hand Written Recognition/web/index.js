
let grid = [];
let rows = 28;
let cols = 28;
let cellSize = 15;

function setup() {
  let canvas = createCanvas(cols * cellSize, rows * cellSize);
  canvas.parent("canvas-container");

  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
    }
  }
}

function draw() {
  background(0);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      fill(grid[i][j]);
      stroke(40);
      rect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}

function mouseDragged() {
  let col = floor(mouseX / cellSize);
  let row = floor(mouseY / cellSize);

  if (row >= 0 && row < rows && col >= 0 && col < cols) {
    drawBrush(row, col, 60);
  }
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    let col = floor(mouseX / cellSize);
    let row = floor(mouseY / cellSize);
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      grid[row][col] = 0;
    }
  }
}

function drawBrush(row, col, strength) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let r = row + i;
      let c = col + j;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        grid[r][c] += strength - (abs(i) + abs(j)) * 20;
        grid[r][c] = constrain(grid[r][c], 0, 255);
      }
    }
  }
}

function clearGrid() {
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      grid[i][j] = 0;
   document.getElementById("Result").innerText = "?";
}

function getLabeledInput() {
  let obj = {};
  let index = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      obj["pixel_" + index] = grid[i][j] / 255;  // normalized
      index++;
    }
  }

  return obj;
}

async function request_result() {
    const url ="https://ml-8q8k.onrender.com/guess";
    const result = getLabeledInput();
    console.log(result)
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result)
        });

        const data = await response.json();
        document.getElementById("Result").innerText = data.prediction;
        console.log(data.prediction);

    } catch (error) {
        console.error("Error fetching prediction:", error);
    }
}

document.oncontextmenu = () => false;



const BACKEND_URL = "https://ml-8q8k.onrender.com/health";

async function fetchWithTimeout(url, timeout = 2000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function waitForBackend() {
  const startTime = Date.now();

  while (true) {
    try {
      const response = await fetchWithTimeout(BACKEND_URL, 2000);
      if (response.ok) {

        const message = document.getElementById("message")
        message.style.color="#00ff88"
        message.innerText= "BACKEND : LIVE"
        const spinner = document.querySelector(".spinner");
        spinner.classList.remove("animate");
        spinner.style.borderTop="none"
        spinner.style.border="4px solid #00ff88";
        return;
      }
    } catch (_) {}

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}



waitForBackend();
