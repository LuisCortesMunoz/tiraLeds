// Step 1: Put your Render URL here
const API_BASE = "https://docker-flask-servidor-render.onrender.com";

const el = (id) => document.getElementById(id);

const log = (msg) => {
  el("log").textContent =
    `${new Date().toLocaleTimeString()}  ${msg}\n` + el("log").textContent;
};

// Step 2: Build URL
function makeUrl(path) {
  return `${API_BASE}${path}`;
}

// Step 3: State: 8 LEDs (false=off, true=on)
let ledState = Array(8).fill(false);

// Step 4: UI references
const colorInput = el("color");
const ledButtons = document.querySelectorAll(".led-btn");

// Step 5: Toggle button UI + state
function renderButtons() {
  ledButtons.forEach((btn) => {
    const idx = Number(btn.dataset.led);
    if (ledState[idx]) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

ledButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const idx = Number(btn.dataset.led);
    ledState[idx] = !ledState[idx];
    renderButtons();
  });
});

// Step 6: All ON / All OFF
el("btnAllOn").addEventListener("click", () => {
  ledState = Array(8).fill(true);
  renderButtons();
});

el("btnAllOff").addEventListener("click", () => {
  ledState = Array(8).fill(false);
  renderButtons();
});

// Step 7: Send to backend
async function sendToBackend() {
  const payload = {
    hex: colorInput.value,  // color for any LED that is ON
    leds: ledState          // [true/false x8]
  };

  try {
    const res = await fetch(makeUrl("/api/set_leds"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Request failed");

    log(`OK -> color=${data.state.hex}, leds=${JSON.stringify(data.state.leds)}`);
  } catch (err) {
    log(`ERROR -> ${err.message}`);
  }
}

el("btnSend").addEventListener("click", sendToBackend);

// Step 8: Initial render
renderButtons();
log("Ready.");
