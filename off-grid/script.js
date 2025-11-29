/****************************************************
 * V-SUSTAIN SOLAR SOLUTIONS – OFF-GRID BILLING ENGINE
 ****************************************************/

/*----------------------------------------------
  1. DATASETS (Off-grid Inverters, Batteries, Panels, ACDB, DCDB)
-----------------------------------------------*/

// OFFGRID INVERTER LIST
const offGridInverters = [
  { model: "NXG 850E (NXG PWM)", voc: "18V–25V", price: 4135 },
  { model: "NXG 1150E (NXG PWM)", voc: "18V–25V", price: 5274 },
  { model: "NXG 1450E (NXG PWM)", voc: "18V–25V", price: 6375 },
  { model: "NXG 1850E (NXG PWM)", voc: "36V–60V", price: 7515 },
  { model: "NXG 2350 (NXG PWM)", voc: "36V–60V", price: 9527 },
  { model: "NXP 3500 (NXG PWM)", voc: "36V–60V", price: 13701 },
  { model: "NXP PRO 3500 (NXP PRO MPPT)", voc: "36V–60V", price: 22507 },
  { model: "SOLAR NXE 5KVA/48V (NXE PWM)", voc: "130V–220V", price: 30592 },
  { model: "NXG PRO 1KVA/12V (NXG MPPT)", voc: "35V–55V", price: 8946 },
  { model: "NXG PRO 1KVA/24V (NXG MPPT)", voc: "35V–55V", price: 8946 },
  { model: "SOLARVERTER 2KVA/24V (PWM)", voc: "36V–60V", price: 11177 },
  { model: "SOLARVERTER 3KVA/36V (PWM)", voc: "72V–120V", price: 16286 },
  { model: "SOLARVERTER 5KVA/48V (PWM)", voc: "130V–220V", price: 30592 },
  { model: "SOLARVERTER PRO 2KVA ECO (MPPT)", voc: "55V–107V", price: 16159 },
  { model: "SOLARVERTER PRO 3KVA ECO (MPPT)", voc: "75V–150V", price: 23778 },
  { model: "SOLARVERTER PRO 3.5KVA (MPPT)", voc: "130V–220V", price: 30701 },
  { model: "SOLARVERTER PRO 5KVA (MPPT)", voc: "130V–220V", price: 40666 },
  { model: "SOLARVERTER PRO 6KVA (MPPT)", voc: "180V–250V", price: 47247 },
  { model: "SOLARVERTER PRO 7.5KVA (MPPT)", voc: "250V–400V", price: 64266 },
  { model: "SOLARVERTER PRO 10.1KVA (MPPT)", voc: "200V–400V", price: 82817 }
];

// SOLAR BATTERIES
const batteryList = [
  { model: "LPT 1240L (40Ah)", capacity: "40AH", price: 4300 },
  { model: "LPT 1240H (40Ah)", capacity: "40AH", price: 4765 },
  { model: "LPT 1280H (80Ah)", capacity: "80AH", price: 7587 },
  { model: "LPTT 12100H (100Ah)", capacity: "100AH", price: 9370 },
  { model: "LPTT 12120H (120Ah)", capacity: "120AH", price: 10006 },
  { model: "LPTT 12150L (150Ah)", capacity: "150AH", price: 11526 },
  { model: "LPTT 12150H (150Ah)", capacity: "150AH", price: 12554 },
  { model: "LPTT 12200L (200Ah)", capacity: "200AH", price: 15561 },
  { model: "LPTT 12200H (200Ah)", capacity: "200AH", price: 16311 }
];

// SOLAR PANELS (same list as on-grid, but using accurate data)
const panelList = [
  { model: "POLY 170W/12V", watt: 170, price: 3815 },
  { model: "PV MOD LUM24550M DCR BI-TS EXWH31 (550W)", watt: 550, price: 14025 },
  { model: "PV MOD LUM 24585T144 TCHC 144C EXWH31 (585W)", watt: 585, price: 9694 },
  { model: "PV MOD LUM 24590T144 BI-TS-31 (590W)", watt: 590, price: 9694 }
];

// ACDB / DCDB (same as on-grid for now, simple label)
const acdbList = [
  "TSAD0AC32PH1 – Single Phase 32A (0–5kW)",
  "TSAD0AC63PH1 – Single Phase 63A (7kW)",
  "TSAD0AC40PH1 – Single Phase 40A (9kW)",
  "TSAD0AC80PH1 – Single Phase 80A (11kW)",
  "TSADAC100PH1 – Single Phase 100A",
  "TSAD0AC32PH3 – Three Phase 32A"
];

const dcdbList = [
  "TSADDC600V11 – 1 In 1 Out MCB",
  "TSADDC600V22 – 2 In 2 Out Fuse",
  "TSADDC600V21 – 2 In 1 Out MCB",
  "TSADDC600V31 – 3 In 1 Out MCB",
  "TSADDC600V41 – 4 In 1 Out MCB",
  "TSADDC600V11F – 1 In 1 Out Fuse",
  "TSADC600V21F – 2 In 1 Out Fuse",
  "TSADC600V31F – 3 In 1 Out Fuse",
  "TSADC600V41F – 4 In 1 Out Fuse"
];

/*----------------------------------------------
  2. HELPERS
-----------------------------------------------*/

const fmt = (n) => {
  if (isNaN(n) || n == null) return "₹0";
  return "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

const parseNum = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

/*----------------------------------------------
  3. INITIALIZATION
-----------------------------------------------*/

window.addEventListener("DOMContentLoaded", () => {
  loadOffGridInverters();
  loadBatteries();
  loadPanels();
  loadACDB();
  loadDCDB();

  setupPanelAutoQty();
  setupInstallStructureAuto();
  setupEnableDisable();
  setupCustomProducts();
  setupQuoteButtons();
});

/*--- Populate selects ---*/

function loadOffGridInverters() {
  const sel = document.getElementById("inverterSelect");
  offGridInverters.forEach((inv) => {
    const opt = document.createElement("option");
    opt.value = inv.price;
    opt.textContent = `${inv.model} – VOC ${inv.voc} – ${fmt(inv.price)}`;
    sel.appendChild(opt);
  });
}

function loadBatteries() {
  const sel = document.getElementById("batterySelect");
  batteryList.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b.price;
    opt.textContent = `${b.model} – ${b.capacity} – ${fmt(b.price)}`;
    sel.appendChild(opt);
  });
}

function loadPanels() {
  const sel = document.getElementById("panelSelect");
  panelList.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.price;
    opt.textContent = `${p.model} – ${p.watt}W – ${fmt(p.price)}`;
    opt.dataset.watt = p.watt;
    sel.appendChild(opt);
  });
}

function loadACDB() {
  const sel = document.getElementById("acdbSelect");
  acdbList.forEach((v) => {
    const opt = document.createElement("option");
    opt.textContent = v;
    sel.appendChild(opt);
  });
}

function loadDCDB() {
  const sel = document.getElementById("dcdbSelect");
  dcdbList.forEach((v) => {
    const opt = document.createElement("option");
    opt.textContent = v;
    sel.appendChild(opt);
  });
}

/*----------------------------------------------
  4. PANEL QUANTITY AUTOCALC (kW → qty)
-----------------------------------------------*/
function setupPanelAutoQty() {
  const kwInput = document.getElementById("systemKW");
  const panelSel = document.getElementById("panelSelect");

  const calc = () => {
    const kw = parseNum(kwInput.value);
    const selected = panelSel.selectedOptions[0];
    if (!kw || !selected || !selected.dataset.watt) {
      document.getElementById("panelQty").value = "";
      return;
    }
    const watt = parseNum(selected.dataset.watt);
    const totalWatt = kw * 1000;
    const qty = Math.ceil(totalWatt / watt);
    document.getElementById("panelQty").value = qty;
  };

  kwInput.addEventListener("input", calc);
  panelSel.addEventListener("change", calc);
}

/*----------------------------------------------
  5. INSTALLATION & STRUCTURE AUTOCALC
-----------------------------------------------*/
function setupInstallStructureAuto() {
  const kwInput = document.getElementById("systemKW");
  const installField = document.getElementById("installationCost");
  const structureField = document.getElementById("structureCost");

  const calc = () => {
    const kw = parseNum(kwInput.value);
    installField.value = kw ? kw * 5000 : "";
    structureField.value = kw ? kw * 8000 : "";
  };

  kwInput.addEventListener("input", calc);
}

/*----------------------------------------------
  6. ENABLE / DISABLE CARDS (grey-out)
-----------------------------------------------*/
function setupEnableDisable() {
  document
    .querySelectorAll("input[type='checkbox'][data-target]")
    .forEach((chk) => {
      chk.addEventListener("change", function () {
        const card = this.closest(".card");
        if (!card) return;
        if (this.checked) {
          card.classList.remove("disabled");
        } else {
          card.classList.add("disabled");
        }
      });
    });
}

/*----------------------------------------------
  7. CUSTOM PRODUCTS HANDLER
-----------------------------------------------*/
function setupCustomProducts() {
  const addBtn = document.getElementById("addCustomProduct");
  const container = document.getElementById("customProducts");

  addBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "custom-row";
    row.innerHTML = `
      <input type="text" placeholder="Product Name" class="cp-name" />
      <input type="number" placeholder="Qty" class="cp-qty" />
      <input type="number" placeholder="Price" class="cp-price" />
      
      <label>Enable</label>
      <input type="checkbox" class="cp-enable" checked />

      <label>Use Global Margin</label>
      <input type="checkbox" class="cp-margin-global" checked />

      <input type="number" placeholder="Custom Margin %" class="cp-custom-margin" />
    `;
    container.appendChild(row);
  });
}

/*----------------------------------------------
  8. MARGIN ENGINE (Global + Custom)
-----------------------------------------------*/
function applyMargin(basePrice, sectionId) {
  const globalMargin = parseNum(document.getElementById("globalMargin").value);

  const marginToggle = document.querySelector(
    `.margin-toggle[data-target='${sectionId}']`
  );
  const customMarginInput = document.querySelector(
    `.custom-margin[data-target='${sectionId}']`
  );
  const customMargin = customMarginInput ? parseNum(customMarginInput.value) : 0;

  // Priority:
  // 1) If margin toggle ON → use global margin
  // 2) Else if custom margin > 0 → use custom margin
  // 3) Else → no margin
  if (marginToggle && marginToggle.checked) {
    return basePrice + (basePrice * globalMargin) / 100;
  } else if (customMargin > 0) {
    return basePrice + (basePrice * customMargin) / 100;
  } else {
    return basePrice;
  }
}

/*----------------------------------------------
  9. GST ENGINE (Off-grid rules)
-----------------------------------------------*/
/*
  Off-grid GST rules:

  - Solar panels → 5% GST always.
  - If inverter + battery + panels are ALL enabled:
        → 5% GST on inverter + battery + panels.
  - Else:
        → Inverter & battery = 18% GST
        → Panels remain 5% GST.
  - All other items (ACDB, DCDB, cables, structure, etc.) = 18%.
*/

function computeGst(amount, sectionId, ctx) {
  let gstPercent = 18;

  if (sectionId === "panels") {
    gstPercent = 5;
  } else if (sectionId === "inverter" || sectionId === "battery") {
    if (ctx.inverter && ctx.battery && ctx.panels) {
      gstPercent = 5;
    } else {
      gstPercent = 18;
    }
  } else if (sectionId === "custom") {
    // Assume 18% GST for custom items by default
    gstPercent = 18;
  } else {
    gstPercent = 18;
  }

  const gstAmount = (amount * gstPercent) / 100;
  const totalWithGST = amount + gstAmount;

  return { gstPercent, gstAmount, totalWithGST };
}

/*----------------------------------------------
  10. QUOTATION BUILDERS
-----------------------------------------------*/
function setupQuoteButtons() {
  document
    .getElementById("generateDetailed")
    .addEventListener("click", generateDetailedQuote);
  document
    .getElementById("generateSummary")
    .addEventListener("click", generateSummaryQuote);
}

/*---------- DETAILED ----------*/
function generateDetailedQuote() {
  const out = document.getElementById("quotationOutput");
  out.innerHTML = "";

  // Determine combo condition flags for GST:
  const inverterEnabled =
    document.querySelector("input[data-target='inverter']").checked &&
    document.getElementById("inverterSelect").selectedIndex >= 0;
  const batteryEnabled =
    document.querySelector("input[data-target='battery']").checked &&
    document.getElementById("batterySelect").selectedIndex >= 0 &&
    parseNum(document.getElementById("batteryQty").value) > 0;
  const panelEnabled =
    document.querySelector("input[data-target='panels']").checked &&
    document.getElementById("panelSelect").selectedIndex >= 0 &&
    parseNum(document.getElementById("panelQty").value) > 0;

  const ctx = {
    inverter: inverterEnabled,
    battery: batteryEnabled,
    panels: panelEnabled
  };

  let html = `
    <div class="quote">
      <h1>Quotation – V-Sustain Solar Solutions</h1>
      <table>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Rate (₹)</th>
          <th>Amount (₹)</th>
          <th>GST%</th>
          <th>GST Amt (₹)</th>
          <th>Total (₹)</th>
        </tr>
  `;

  let grandTotal = 0;

  function addRow(sectionId, name, desc, qty, rate) {
    if (!qty || qty <= 0) return;
    const amount = qty * rate;
    const gst = computeGst(amount, sectionId, ctx);
    grandTotal += gst.totalWithGST;

    html += `
      <tr>
        <td>${name}</td>
        <td>${desc || ""}</td>
        <td>${qty}</td>
        <td>${fmt(rate)}</td>
        <td>${fmt(amount)}</td>
        <td>${gst.gstPercent}%</td>
        <td>${fmt(gst.gstAmount)}</td>
        <td>${fmt(gst.totalWithGST)}</td>
      </tr>
    `;
  }

  /* Inverter */
  if (inverterEnabled) {
    const sel = document.getElementById("inverterSelect");
    const price = parseNum(sel.value);
    const rate = applyMargin(price, "inverter");
    addRow(
      "inverter",
      "Off-Grid Inverter",
      sel.selectedOptions[0].textContent,
      1,
      rate
    );
  }

  /* Battery */
  if (batteryEnabled) {
    const sel = document.getElementById("batterySelect");
    const qty = parseNum(document.getElementById("batteryQty").value);
    const price = parseNum(sel.value);
    const rate = applyMargin(price, "battery");
    addRow(
      "battery",
      "Solar Battery",
      sel.selectedOptions[0].textContent,
      qty,
      rate
    );
  }

  /* Panels */
  if (panelEnabled) {
    const sel = document.getElementById("panelSelect");
    const qty = parseNum(document.getElementById("panelQty").value);
    const price = parseNum(sel.value);
    const rate = applyMargin(price, "panels");
    addRow(
      "panels",
      "Solar PV Modules",
      sel.selectedOptions[0].textContent,
      qty,
      rate
    );
  }

  /* ACDB */
  if (document.querySelector("input[data-target='acdb']").checked) {
    const sel = document.getElementById("acdbSelect");
    const base = 2000; // mock base
    const rate = applyMargin(base, "acdb");
    addRow("acdb", "ACDB", sel.value, 1, rate);
  }

  /* DCDB */
  if (document.querySelector("input[data-target='dcdb']").checked) {
    const sel = document.getElementById("dcdbSelect");
    const base = 2000; // mock base
    const rate = applyMargin(base, "dcdb");
    addRow("dcdb", "DCDB", sel.value, 1, rate);
  }

  /* AC Cable */
  if (document.querySelector("input[data-target='accable']").checked) {
    const gauge = document.getElementById("acGauge").value;
    const qty = parseNum(document.getElementById("acQty").value);
    const price = parseNum(document.getElementById("acPrice").value);
    if (qty && price) {
      const rate = applyMargin(price, "accable");
      addRow("accable", "AC Cable", gauge, qty, rate);
    }
  }

  /* Earthing Cable */
  if (document.querySelector("input[data-target='earthing']").checked) {
    const gauge = document.getElementById("earthGauge").value;
    const qty = parseNum(document.getElementById("earthQty").value);
    const price = parseNum(document.getElementById("earthPrice").value);
    if (qty && price) {
      const rate = applyMargin(price, "earthing");
      addRow("earthing", "Earthing Cable", gauge, qty, rate);
    }
  }

  /* Installation */
  if (document.querySelector("input[data-target='installation']").checked) {
    const kw = parseNum(document.getElementById("systemKW").value);
    const pricePerKw = 5000;
    const rate = pricePerKw; // per kW rate; margin typically in-built or can be controlled later
    addRow(
      "installation",
      "Installation & Commissioning",
      "Installation @ 5000/kW",
      kw,
      rate
    );
  }

  /* Structure */
  if (document.querySelector("input[data-target='structure']").checked) {
    const kw = parseNum(document.getElementById("systemKW").value);
    const pricePerKw = 8000;
    const rate = pricePerKw;
    addRow(
      "structure",
      "Module Mounting Structure",
      "Structure @ 8000/kW",
      kw,
      rate
    );
  }

  /* Lightning Arrestor */
  if (document.querySelector("input[data-target='lightning']").checked) {
    const qty = parseNum(document.getElementById("lightQty").value);
    const price = parseNum(document.getElementById("lightPrice").value);
    if (qty && price) {
      const rate = applyMargin(price, "lightning");
      addRow("lightning", "Lightning Arrestor", "", qty, rate);
    }
  }

  /* Custom Products */
  document.querySelectorAll(".custom-row").forEach((row) => {
    const enabled = row.querySelector(".cp-enable").checked;
    if (!enabled) return;

    const name = row.querySelector(".cp-name").value || "Custom Item";
    const qty = parseNum(row.querySelector(".cp-qty").value);
    const basePrice = parseNum(row.querySelector(".cp-price").value);
    if (!qty || !basePrice) return;

    const useGlobal = row.querySelector(".cp-margin-global").checked;
    const customMargin = parseNum(row.querySelector(".cp-custom-margin").value);
    let rate = basePrice;

    const globalMargin = parseNum(document.getElementById("globalMargin").value);
    if (useGlobal) {
      rate = basePrice + (basePrice * globalMargin) / 100;
    } else if (customMargin > 0) {
      rate = basePrice + (basePrice * customMargin) / 100;
    }

    addRow("custom", name, "", qty, rate);
  });

  html += `
        <tr>
          <td colspan="7" style="text-align:right;font-weight:bold;">Grand Total (incl. GST)</td>
          <td>${fmt(grandTotal)}</td>
        </tr>
      </table>
      <button class="pdf-btn" onclick="window.print()">Download / Print PDF</button>
    </div>
  `;

  out.innerHTML = html;
}

/*---------- SUMMARY ----------*/
function generateSummaryQuote() {
  const out = document.getElementById("quotationOutput");
  out.innerHTML = "";

  let html = `
    <div class="quote">
      <h1>Summary Quotation – V-Sustain Solar Solutions</h1>
      <table>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Qty</th>
        </tr>
  `;

  function addRow(name, desc, qty) {
    if (!qty || qty <= 0) return;
    html += `
      <tr>
        <td>${name}</td>
        <td>${desc || ""}</td>
        <td>${qty}</td>
      </tr>
    `;
  }

  /* Inverter */
  if (document.querySelector("input[data-target='inverter']").checked) {
    const sel = document.getElementById("inverterSelect");
    addRow("Off-Grid Inverter", sel.selectedOptions[0].textContent, 1);
  }

  /* Battery */
  if (document.querySelector("input[data-target='battery']").checked) {
    const sel = document.getElementById("batterySelect");
    const qty = parseNum(document.getElementById("batteryQty").value);
    addRow("Solar Battery", sel.selectedOptions[0].textContent, qty);
  }

  /* Panels */
  if (document.querySelector("input[data-target='panels']").checked) {
    const sel = document.getElementById("panelSelect");
    const qty = parseNum(document.getElementById("panelQty").value);
    addRow("Solar PV Modules", sel.selectedOptions[0].textContent, qty);
  }

  /* ACDB */
  if (document.querySelector("input[data-target='acdb']").checked) {
    const sel = document.getElementById("acdbSelect");
    addRow("ACDB", sel.value, 1);
  }

  /* DCDB */
  if (document.querySelector("input[data-target='dcdb']").checked) {
    const sel = document.getElementById("dcdbSelect");
    addRow("DCDB", sel.value, 1);
  }

  /* AC Cable */
  if (document.querySelector("input[data-target='accable']").checked) {
    const gauge = document.getElementById("acGauge").value;
    const qty = parseNum(document.getElementById("acQty").value);
    addRow("AC Cable", gauge, qty);
  }

  /* Earthing Cable */
  if (document.querySelector("input[data-target='earthing']").checked) {
    const gauge = document.getElementById("earthGauge").value;
    const qty = parseNum(document.getElementById("earthQty").value);
    addRow("Earthing Cable", gauge, qty);
  }

  /* Installation */
  if (document.querySelector("input[data-target='installation']").checked) {
    const kw = parseNum(document.getElementById("systemKW").value);
    addRow("Installation & Commissioning", "Based on kW", kw);
  }

  /* Structure */
  if (document.querySelector("input[data-target='structure']").checked) {
    const kw = parseNum(document.getElementById("systemKW").value);
    addRow("Module Mounting Structure", "Based on kW", kw);
  }

  /* Lightning Arrestor */
  if (document.querySelector("input[data-target='lightning']").checked) {
    const qty = parseNum(document.getElementById("lightQty").value);
    addRow("Lightning Arrestor", "", qty);
  }

  /* Custom Products */
  document.querySelectorAll(".custom-row").forEach((row) => {
    const enabled = row.querySelector(".cp-enable").checked;
    if (!enabled) return;
    const name = row.querySelector(".cp-name").value || "Custom Item";
    const qty = parseNum(row.querySelector(".cp-qty").value);
    addRow(name, "", qty);
  });

  html += `
      </table>
      <button class="pdf-btn" onclick="window.print()">Download / Print PDF</button>
    </div>
  `;

  out.innerHTML = html;
}
