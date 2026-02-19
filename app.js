// Step 1: Put your Render URL here
const API_BASE = "https://YOUR-RENDER-URL.onrender.com";

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

// Step 5: Render button UI
function renderButtons() {
  ledButtons.forEach((btn) => {
    const idx = Number(btn.dataset.led);
    if (ledState[idx]) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

// Step 6: Send to backend
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

// Step 7: LED individual toggles (NOW auto-send)
ledButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const idx = Number(btn.dataset.led);
    ledState[idx] = !ledState[idx];
    renderButtons();
    await sendToBackend(); // ✅ auto send
  });
});

// Step 8: All ON (NOW auto-send)
el("btnAllOn").addEventListener("click", async () => {
  ledState = Array(8).fill(true);
  renderButtons();
  await sendToBackend(); // ✅ auto send
});

// Step 9: All OFF (NOW auto-send)
el("btnAllOff").addEventListener("click", async () => {
  ledState = Array(8).fill(false);
  renderButtons();
  await sendToBackend(); // ✅ auto send
});

// Step 10: Color change (optional auto-send)
// Si quieres que al cambiar color se mande solo, descomenta esto:
/*
colorInput.addEventListener("input", async () => {
  await sendToBackend();
});
*/

// Step 11: Keep "Send to ESP32" button working (optional)
el("btnSend").addEventListener("click", sendToBackend);

// Step 12: Init
renderButtons();
log("Ready.");
