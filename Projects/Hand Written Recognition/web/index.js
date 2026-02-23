// Grab the container div
const ParentDiv = document.querySelector(".container");
let isMouseDown = false;

// Track mouse up globally
document.addEventListener("mouseup", () => {
    isMouseDown = false;
});

// Create a 28x28 checkbox grid (784 inputs)
for (let i = 0; i < 784; i++) {
    const pixel = document.createElement("input");
    pixel.type = "checkbox";
    pixel.id = `pixel_${i}`;
    const label = document.createElement("label")
    label.htmlFor="agree"

    // Mouse drag painting
    pixel.addEventListener("mousedown", () => {
        isMouseDown = true;
        pixel.checked = true;
    });

    pixel.addEventListener("mouseover", () => {
        if (isMouseDown) {
            pixel.checked = true;
        }
    });

    ParentDiv.appendChild(pixel);
    document.body.appendChild(label);
}

// Object to store checkbox states
let result = {};

// Map grid checkboxes to result object
function grid_mapper() {
    result = {};
    const pixels = ParentDiv.children;
    for (let i = 0; i < pixels.length; i++) {
        const pixel = pixels[i];
        result[pixel.id] = pixel.checked ? 1 : 0;
    }
}

// Send data to Flask backend
async function request_result() {
    grid_mapper();
    const url = "https://ml-8q8k.onrender.com/guess";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result)
        });

        const data = await response.json();
        document.getElementById("result").innerText = data.prediction;

    } catch (error) {
        console.error("Error fetching prediction:", error);
    }
}

function Clear_Grid(){
    const pixels = ParentDiv.children;
     for (let i = 0; i < pixels.length; i++) {
        const pixel = pixels[i];
        pixel.checked = false;
        document.getElementById("result").innerText = "?";

    }
}