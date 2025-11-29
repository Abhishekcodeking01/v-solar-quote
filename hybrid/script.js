/****************************************************
 * HYBRID BILLING ENGINE – V-SUSTAIN SOLAR SOLUTIONS
 * Draft Version (You will refine Hybrid rules later)
 ****************************************************/

/****************************************************
 * 1. DATASETS (we reuse Off-Grid + On-Grid lists)
 ****************************************************/

// Hybrid inverter list simply reuses Off-grid inverter list
// (You will later provide a special Hybrid list)
const hybridInverters = [
    "Hybrid 3kW – Draft Model",
    "Hybrid 5kW – Draft Model",
    "Hybrid 8kW – Draft Model",
    "Hybrid 10kW – Draft Model"
];

// Batteries
const batteryList = [
    { model: "LPT 1240L (40Ah)", price: 4300 },
    { model: "LPT 1240H (40Ah)", price: 4765 },
    { model: "LPT 1280H (80Ah)", price: 7587 },
    { model: "LPTT 12100H (100Ah)", price: 9370 },
    { model: "LPTT 12120H (120Ah)", price: 10006 },
    { model: "LPTT 12150L (150Ah)", price: 11526 },
    { model: "LPTT 12150H (150Ah)", price: 12554 },
    { model: "LPTT 12200L (200Ah)", price: 15561 },
    { model: "LPTT 12200H (200Ah)", price: 16311 }
];

// Solar panels (same list as off-grid)
const panelList = [
    { model: "POLY 170W/12V", watt: 170, price: 3815 },
    { model: "PV MOD 550W DCR", watt: 550, price: 14025 },
    { model: "PV MOD 585W TCHC", watt: 585, price: 9694 },
    { model: "PV MOD 590W BI-TS", watt: 590, price: 9694 }
];

// ACDB / DCDB lists
const acdbList = [
    "ACDB 32A SP",
    "ACDB 63A SP",
    "ACDB 100A SP",
    "ACDB 32A TP"
];

const dcdbList = [
    "DCDB 1IN1OUT",
    "DCDB 2IN2OUT",
    "DCDB 3IN1OUT"
];

/****************************************************
 * 2. HELPERS
 ****************************************************/
const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const num = (v) => parseFloat(v) || 0;

/****************************************************
 * 3. INITIAL LOAD OF DROPDOWNS
 ****************************************************/
window.addEventListener("DOMContentLoaded", () => {
    loadInverters();
    loadBatteries();
    loadPanels();
    loadACDB();
    loadDCDB();

    setupEnableDisable();
    setupPanelAutoQty();
    setupInstallStructureAuto();
    setupCustomProducts();
    setupQuoteButtons();
});

/*--------- DROPDOWN LOADERS ---------*/

function loadInverters() {
    const sel = document.getElementById("inverterSelect");
    hybridInverters.forEach((v, i) => {
        let opt = document.createElement("option");
        // Temporary inverter prices
        const price = (i + 1) * 15000;
        opt.value = price;
        opt.textContent = `${v} — ₹${price}`;
        sel.appendChild(opt);
    });
}

function loadBatteries() {
    const sel = document.getElementById("batterySelect");
    batteryList.forEach(b => {
        let opt = document.createElement("option");
        opt.value = b.price;
        opt.textContent = `${b.model} — ₹${b.price}`;
        sel.appendChild(opt);
    });
}

function loadPanels() {
    const sel = document.getElementById("panelSelect");
    panelList.forEach(p => {
        let opt = document.createElement("option");
        opt.value = p.price;
        opt.dataset.watt = p.watt;
        opt.textContent = `${p.model} — ${p.watt}W — ₹${p.price}`;
        sel.appendChild(opt);
    });
}

function loadACDB() {
    const sel = document.getElementById("acdbSelect");
    acdbList.forEach(v => {
        let opt = document.createElement("option");
        opt.textContent = v;
        sel.appendChild(opt);
    });
}

function loadDCDB() {
    const sel = document.getElementById("dcdbSelect");
    dcdbList.forEach(v => {
        let opt = document.createElement("option");
        opt.textContent = v;
        sel.appendChild(opt);
    });
}

/****************************************************
 * 4. ENABLE / DISABLE CARDS
 ****************************************************/
function setupEnableDisable() {
    document.querySelectorAll("input[data-target]")
        .forEach(chk => {
            chk.addEventListener("change", function () {
                const card = this.closest(".card");
                if (this.checked) card.classList.remove("disabled");
                else card.classList.add("disabled");
            });
        });
}

/****************************************************
 * 5. AUTO PANEL QUANTITY
 ****************************************************/
function setupPanelAutoQty() {
    const kwInput = document.getElementById("systemKW");
    const panelSelect = document.getElementById("panelSelect");

    function calc() {
        const kw = num(kwInput.value);
        const selected = panelSelect.selectedOptions[0];

        if (!kw || !selected) return;

        const watt = num(selected.dataset.watt);
        const qty = Math.ceil((kw * 1000) / watt);
        document.getElementById("panelQty").value = qty;
    }

    kwInput.addEventListener("input", calc);
    panelSelect.addEventListener("change", calc);
}

/****************************************************
 * 6. INSTALLATION / STRUCTURE AUTOFILL
 ****************************************************/
function setupInstallStructureAuto() {
    const kwInput = document.getElementById("systemKW");
    const install = document.getElementById("installationCost");
    const structure = document.getElementById("structureCost");

    kwInput.addEventListener("input", () => {
        const kw = num(kwInput.value);
        install.value = kw ? kw * 5000 : "";
        structure.value = kw ? kw * 8000 : "";
    });
}

/****************************************************
 * 7. CUSTOM PRODUCT HANDLER
 ****************************************************/
function setupCustomProducts() {
    const addBtn = document.getElementById("addCustomProduct");
    addBtn.addEventListener("click", () => {
        const box = document.getElementById("customProducts");

        const row = document.createElement("div");
        row.className = "custom-row";
        row.innerHTML = `
            <input type="text" placeholder="Product Name" class="cp-name">
            <input type="number" placeholder="Qty" class="cp-qty">
            <input type="number" placeholder="Price" class="cp-price">

            <label>Enable</label>
            <input type="checkbox" class="cp-enable" checked>

            <label>Use Global Margin</label>
            <input type="checkbox" class="cp-margin-global" checked>

            <input type="number" placeholder="Custom Margin%" class="cp-custom-margin">
        `;

        box.appendChild(row);
    });
}

/****************************************************
 * 8. MARGIN ENGINE
 ****************************************************/
function applyMargin(basePrice, sectionId) {
    const globalMargin = num(document.getElementById("globalMargin").value);
    const sectionToggle = document.querySelector(
        `.margin-toggle[data-target='${sectionId}']`
    );

    const customMarginInput = document.querySelector(
        `.custom-margin[data-target='${sectionId}']`
    );
    const customMargin = customMarginInput ? num(customMarginInput.value) : 0;

    if (sectionToggle && sectionToggle.checked) {
        return basePrice + basePrice * globalMargin / 100;
    } else if (customMargin > 0) {
        return basePrice + basePrice * customMargin / 100;
    } else {
        return basePrice;
    }
}

/****************************************************
 * 9. HYBRID GST ENGINE (TEMP LOGIC)
 ****************************************************/
/*
 Hybrid GST (Draft):
  - Panels → 5%
  - Inverter → 12% (temporary value)
  - Battery → 12% (temporary value)
  - All other components → 18%
*/

function gstHybrid(section, amount) {
    let gst = 18;

    if (section === "panels") gst = 5;
    else if (section === "inverter" || section === "battery") gst = 12;

    const gstAmt = (amount * gst) / 100;
    return {
        percent: gst,
        gstAmount: gstAmt,
        total: amount + gstAmt
    };
}

/****************************************************
 * 10. QUOTATION GENERATORS
 ****************************************************/

function setupQuoteButtons() {
    document.getElementById("generateDetailed")
        .addEventListener("click", generateDetailed);

    document.getElementById("generateSummary")
        .addEventListener("click", generateSummary);
}

/******************** DETAILED ********************/
function generateDetailed() {
    const out = document.getElementById("quotationOutput");
    out.innerHTML = "";

    let html = `
    <div class="quote">
    <h1>Hybrid Quotation – V-Sustain Solar Solutions</h1>
    <table>
      <tr>
        <th>Product</th>
        <th>Description</th>
        <th>Qty</th>
        <th>Rate</th>
        <th>Amount</th>
        <th>GST%</th>
        <th>GST Amt</th>
        <th>Total</th>
      </tr>
    `;

    let grand = 0;

    function add(section, name, desc, qty, rate) {
        if (!qty || qty <= 0) return;

        const amount = qty * rate;
        const gst = gstHybrid(section, amount);
        grand += gst.total;

        html += `
        <tr>
            <td>${name}</td>
            <td>${desc || ""}</td>
            <td>${qty}</td>
            <td>${fmt(rate)}</td>
            <td>${fmt(amount)}</td>
            <td>${gst.percent}%</td>
            <td>${fmt(gst.gstAmount)}</td>
            <td>${fmt(gst.total)}</td>
        </tr>
        `;
    }

    /* INVERTER */
    if (document.querySelector(`input[data-target='inverter']`).checked) {
        const sel = document.getElementById("inverterSelect");
        const price = num(sel.value);
        const rate = applyMargin(price, "inverter");
        add(
            "inverter",
            "Hybrid Inverter",
            sel.selectedOptions[0].textContent,
            1,
            rate
        );
    }

    /* BATTERY */
    if (document.querySelector(`input[data-target='battery']`).checked) {
        const sel = document.getElementById("batterySelect");
        const qty = num(document.getElementById("batteryQty").value);
        const price = num(sel.value);
        const rate = applyMargin(price, "battery");
        add(
            "battery",
            "Hybrid Battery",
            sel.selectedOptions[0].textContent,
            qty,
            rate
        );
    }

    /* PANELS */
    if (document.querySelector(`input[data-target='panels']`).checked) {
        const sel = document.getElementById("panelSelect");
        const qty = num(document.getElementById("panelQty").value);
        const price = num(sel.value);
        const rate = applyMargin(price, "panels");
        add(
            "panels",
            "Solar Panels",
            sel.selectedOptions[0].textContent,
            qty,
            rate
        );
    }

    /* ACDB */
    if (document.querySelector(`input[data-target='acdb']`).checked) {
        const sel = document.getElementById("acdbSelect");
        add("acdb", "ACDB", sel.value, 1, applyMargin(2000, "acdb"));
    }

    /* DCDB */
    if (document.querySelector(`input[data-target='dcdb']`).checked) {
        const sel = document.getElementById("dcdbSelect");
        add("dcdb", "DCDB", sel.value, 1, applyMargin(2000, "dcdb"));
    }

    /* AC Cable */
    if (document.querySelector(`input[data-target='accable']`).checked) {
        const gauge = document.getElementById("acGauge").value;
        const qty = num(document.getElementById("acQty").value);
        const price = num(document.getElementById("acPrice").value);
        add("accable", "AC Cable", gauge, qty, applyMargin(price, "accable"));
    }

    /* Earthing */
    if (document.querySelector(`input[data-target='earthing']`).checked) {
        const gauge = document.getElementById("earthGauge").value;
        const qty = num(document.getElementById("earthQty").value);
        const price = num(document.getElementById("earthPrice").value);
        add("earthing", "Earthing Cable", gauge, qty, applyMargin(price, "earthing"));
    }

    /* Installation */
    if (document.querySelector(`input[data-target='installation']`).checked) {
        const kw = num(document.getElementById("systemKW").value);
        add("installation", "Installation", "Installation @5000/kW", kw, 5000);
    }

    /* Structure */
    if (document.querySelector(`input[data-target='structure']`).checked) {
        const kw = num(document.getElementById("systemKW").value);
        add("structure", "Structure", "Structure @8000/kW", kw, 8000);
    }

    /* Lightning */
    if (document.querySelector(`input[data-target='lightning']`).checked) {
        const qty = num(document.getElementById("lightQty").value);
        const price = num(document.getElementById("lightPrice").value);
        add("lightning", "Lightning Arrestor", "", qty, applyMargin(price, "lightning"));
    }

    /* CUSTOM PRODUCTS */
    document.querySelectorAll(".custom-row").forEach(row => {
        if (!row.querySelector(".cp-enable").checked) return;

        const name = row.querySelector(".cp-name").value || "Custom Item";
        const qty = num(row.querySelector(".cp-qty").value);
        const price = num(row.querySelector(".cp-price").value);

        const useGlobal = row.querySelector(".cp-margin-global").checked;
        const globalMargin = num(document.getElementById("globalMargin").value);
        const customMargin = num(row.querySelector(".cp-custom-margin").value);

        let rate = price;
        if (useGlobal) rate = rate + rate * globalMargin / 100;
        else if (customMargin > 0) rate = rate + rate * customMargin / 100;

        add("custom", name, "", qty, rate);
    });

    html += `
      <tr>
        <td colspan="7" style="text-align:right;font-weight:bold;">Grand Total</td>
        <td>${fmt(grand)}</td>
      </tr>
    </table>
    
    <button onclick="window.print()" class="pdf-btn">Download PDF</button>
    </div>
    `;

    out.innerHTML = html;
}

/******************** SUMMARY ********************/
function generateSummary() {
    const out = document.getElementById("quotationOutput");
    out.innerHTML = "";

    let html = `
    <div class="quote">
    <h1>Hybrid Summary Quotation – V-Sustain Solar Solutions</h1>
    <table>
      <tr>
        <th>Product</th>
        <th>Description</th>
        <th>Qty</th>
      </tr>
    `;

    function add(name, desc, qty) {
        if (!qty || qty <= 0) return;
        html += `
        <tr>
            <td>${name}</td>
            <td>${desc || ""}</td>
            <td>${qty}</td>
        </tr>
        `;
    }

    /* inverter */
    if (document.querySelector(`input[data-target='inverter']`).checked) {
        const sel = document.getElementById("inverterSelect");
        add("Hybrid Inverter", sel.selectedOptions[0].textContent, 1);
    }

    /* battery */
    if (document.querySelector(`input[data-target='battery']`).checked) {
        const sel = document.getElementById("batterySelect");
        add("Hybrid Battery", sel.selectedOptions[0].textContent, num(document.getElementById("batteryQty").value));
    }

    /* panels */
    if (document.querySelector(`input[data-target='panels']`).checked) {
        const sel = document.getElementById("panelSelect");
        add("Solar Panels", sel.selectedOptions[0].textContent, num(document.getElementById("panelQty").value));
    }

    /* ACDB / DCDB */
    if (document.querySelector(`input[data-target='acdb']`).checked) {
        add("ACDB", document.getElementById("acdbSelect").value, 1);
    }
    if (document.querySelector(`input[data-target='dcdb']`).checked) {
        add("DCDB", document.getElementById("dcdbSelect").value, 1);
    }

    /* cables */
    if (document.querySelector(`input[data-target='accable']`).checked) {
        add("AC Cable", document.getElementById("acGauge").value, num(document.getElementById("acQty").value));
    }
    if (document.querySelector(`input[data-target='earthing']`).checked) {
        add("Earthing Cable", document.getElementById("earthGauge").value, num(document.getElementById("earthQty").value));
    }

    /* install & structure */
    if (document.querySelector(`input[data-target='installation']`).checked) {
        add("Installation", "Based on kW", num(document.getElementById("systemKW").value));
    }
    if (document.querySelector(`input[data-target='structure']`).checked) {
        add("Structure", "Based on kW", num(document.getElementById("systemKW").value));
    }

    /* lightning */
    if (document.querySelector(`input[data-target='lightning']`).checked) {
        add("Lightning Arrestor", "", num(document.getElementById("lightQty").value));
    }

    /* custom */
    document.querySelectorAll(".custom-row").forEach(row => {
        if (!row.querySelector(".cp-enable").checked) return;
        add(
            row.querySelector(".cp-name").value,
            "",
            num(row.querySelector(".cp-qty").value)
        );
    });

    html += `
    </table>
    <button onclick="window.print()" class="pdf-btn">Download PDF</button>
    </div>
    `;

    out.innerHTML = html;
}
