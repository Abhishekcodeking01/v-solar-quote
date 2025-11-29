/****************************************************
 * V-SUSTAIN SOLAR SOLUTIONS – ON GRID BILLING ENGINE
 ****************************************************/

/*----------------------------------------------
  1. DATASETS (Inverters, Panels, ACDB, DCDB)
-----------------------------------------------*/
const inverterList = [
    { model: "NXI 120 (2KW)", price: 16882 },
    { model: "NXI 130 (3KW) EXC DONGLE", price: 17915 },
    { model: "NXI 130 (3KW) INC DONGLE", price: 18022 },
    { model: "NXI T130 (3KW) + DONGLE", price: 18022 },
    { model: "NXI 140 (4KW)", price: 28509 },
    { model: "NXI 150 (5KW)", price: 30508 },
    { model: "NXI 305 (5KW)", price: 45696 },
    { model: "NXI 306 (6KW)", price: 51206 },
    { model: "NXI 308 (8KW)", price: 57641 },
    { model: "NXI 310 (10KW)", price: 59110 },
    { model: "NXI 312 (12KW)", price: 63560 },
    { model: "NXI 315 (15KW)", price: 66339 },
    { model: "NXI 320 (20KW)", price: 79429 },
    { model: "NXI 325 (25KW)", price: 97180 },
    { model: "NXI 330 (30KW)", price: 110076 },
    { model: "NXI 350 (50KW)", price: 150912 },
    { model: "NXI 360 (60KW)", price: 161198 },
    { model: "NXI 380 (80KW)", price: 251588 },
    { model: "NXI 3100 (100KW)", price: 268801 },
    { model: "NXI W3125 (125KW)", price: 317042 },
    { model: "NXI W3150 (150KW)", price: 344553 },
    { model: "NXI A3250-HV (250KW)", price: 417806 },
    { model: "NXI A3250-HV (350KW)", price: 555492 }
];

const panelList = [
    { model: "POLY 170W", watt: 170, price: 3815 },
    { model: "550W DCR BI-TS", watt: 550, price: 14025 },
    { model: "585W TCHC 144C", watt: 585, price: 9694 },
    { model: "590W BI-TS-31", watt: 590, price: 9694 }
];

const acdbList = [
    "TSAD0AC32PH1 – Single Phase 32A",
    "TSAD0AC63PH1 – Single Phase 63A",
    "TSAD0AC40PH1 – Single Phase 40A",
    "TSAD0AC80PH1 – Single Phase 80A",
    "TSADAC100PH1 – Single Phase 100A",
    "TSAD0AC32PH3 – Three Phase 32A"
];

const dcdbList = [
    "DCDB 1 IN 1 OUT MCB",
    "DCDB 2 IN 2 OUT Fuse",
    "DCDB 2 IN 1 OUT MCB",
    "DCDB 3 IN 1 OUT MCB",
    "DCDB 4 IN 1 OUT MCB",
    "DCDB 1 IN 1 OUT Fuse",
    "DCDB 2 IN 1 OUT Fuse",
    "DCDB 3 IN 1 OUT Fuse",
    "DCDB 4 IN 1 OUT Fuse"
];

/*----------------------------------------------
  2. LOAD DATA INTO DROPDOWNS
-----------------------------------------------*/
window.onload = function () {
    loadInverters();
    loadPanels();
    loadACDB();
    loadDCDB();
};

/*--- Inverters ---*/
function loadInverters() {
    const sel = document.getElementById("inverterSelect");
    inverterList.forEach(inv => {
        const opt = document.createElement("option");
        opt.value = inv.price;
        opt.textContent = `${inv.model} – ₹${inv.price}`;
        sel.appendChild(opt);
    });
}

/*--- Panels ---*/
function loadPanels() {
    const sel = document.getElementById("panelSelect");
    panelList.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.price;
        opt.textContent = `${p.model} – ${p.watt}W – ₹${p.price}`;
        opt.dataset.watt = p.watt;
        sel.appendChild(opt);
    });
}

/*--- ACDB ---*/
function loadACDB() {
    const sel = document.getElementById("acdbSelect");
    acdbList.forEach(v => {
        const opt = document.createElement("option");
        opt.textContent = v;
        sel.appendChild(opt);
    });
}

/*--- DCDB ---*/
function loadDCDB() {
    const sel = document.getElementById("dcdbSelect");
    dcdbList.forEach(v => {
        const opt = document.createElement("option");
        opt.textContent = v;
        sel.appendChild(opt);
    });
}

/****************************************************
 * 3. PANEL QUANTITY AUTOCALC
 ****************************************************/
document.getElementById("panelSelect").addEventListener("change", autoPanelQty);
document.getElementById("systemKW").addEventListener("input", autoPanelQty);

function autoPanelQty() {
    const kw = parseFloat(document.getElementById("systemKW").value);
    const selected = document.getElementById("panelSelect").selectedOptions[0];

    if (!kw || !selected) return;

    const watt = parseFloat(selected.dataset.watt);
    const totalWatt = kw * 1000;
    const qty = Math.ceil(totalWatt / watt);

    document.getElementById("panelQty").value = qty;
}

/****************************************************
 * 4. INSTALLATION & STRUCTURE AUTO FORMULA
 ****************************************************/
document.getElementById("systemKW").addEventListener("input", function () {
    const kw = parseFloat(this.value);

    document.getElementById("installationCost").value = kw ? kw * 5000 : "";
    document.getElementById("structureCost").value = kw ? kw * 8000 : "";
});

/****************************************************
 * 5. ENABLE / DISABLE FIELDS (Grey-out logic)
 ****************************************************/
document.querySelectorAll("input[type='checkbox'][data-target]").forEach(chk => {
    chk.addEventListener("change", function () {
        const target = this.dataset.target;
        const card = document.querySelector(`[data-sec='${target}']`) || this.closest(".card");

        if (this.checked) {
            card.classList.remove("disabled");
        } else {
            card.classList.add("disabled");
        }
    });
});

/****************************************************
 * 6. ADD CUSTOM PRODUCTS
 ****************************************************/
document.getElementById("addCustomProduct").addEventListener("click", function () {
    const box = document.getElementById("customProducts");

    const div = document.createElement("div");
    div.className = "custom-row";

    div.innerHTML = `
        <input type="text" placeholder="Product Name" class="cp-name">
        <input type="number" placeholder="Qty" class="cp-qty">
        <input type="number" placeholder="Price" class="cp-price">
        
        <label>Enable</label>
        <input type="checkbox" class="cp-enable" checked>

        <label>Use Global Margin</label>
        <input type="checkbox" class="cp-margin-global" checked>

        <input type="number" placeholder="Custom Margin %" class="cp-custom-margin">
    `;

    box.appendChild(div);
});

/****************************************************
 * 7. MARGIN CALCULATION ENGINE
 ****************************************************/

function applyMargin(basePrice, sectionId) {
    const globalMargin = parseFloat(document.getElementById("globalMargin").value) || 0;
    const sectionCard = document.querySelector(`input.margin-toggle[data-target='${sectionId}']`);

    // Custom margin input
    const customMarginInput = document.querySelector(`.custom-margin[data-target='${sectionId}']`);
    const customMargin = customMarginInput ? parseFloat(customMarginInput.value) : 0;

    // Priorities:
    // 1. If product margin toggle = ON → use global margin
    // 2. Else → use custom margin
    // 3. Else → no margin
    if (sectionCard && sectionCard.checked) {
        return basePrice + (basePrice * globalMargin / 100);
    } else if (customMargin > 0) {
        return basePrice + (basePrice * customMargin / 100);
    } else {
        return basePrice;
    }
}

/****************************************************
 * 8. GST ENGINE
 ****************************************************/
function applyGST(price, sectionId) {
    // On-grid rules:
    // Panels + inverter → 5%
    // Everything else → 18%
    let gst = 18;
    if (sectionId === "panels" || sectionId === "inverter") gst = 5;

    return {
        gstPercent: gst,
        gstAmount: price * gst / 100,
        totalWithGST: price + (price * gst / 100)
    };
}

/****************************************************
 * 9. BUILD DETAILED QUOTATION
 ****************************************************/
document.getElementById("generateDetailed").addEventListener("click", function () {
    const output = document.getElementById("quotationOutput");
    output.innerHTML = "";

    let html = `
    <div class='quote'>
        <h1>Quotation – V-Sustain Solar Solutions</h1>
        <table>
            <tr>
                <th>Product</th><th>Qty</th><th>Rate</th>
                <th>Amount</th><th>GST%</th><th>GST Amt</th><th>Total</th>
            </tr>
    `;

    function addRow(name, qty, rate, id) {
        const amt = qty * rate;
        const gst = applyGST(amt, id);

        html += `
            <tr>
                <td>${name}</td>
                <td>${qty}</td>
                <td>₹${rate}</td>
                <td>₹${amt}</td>
                <td>${gst.gstPercent}%</td>
                <td>₹${gst.gstAmount.toFixed(2)}</td>
                <td>₹${gst.totalWithGST.toFixed(2)}</td>
            </tr>
        `;
    }

    /*----------------------
     INVERTER
    -----------------------*/
    if (document.querySelector("input[data-target='inverter']").checked) {
        const selected = document.getElementById("inverterSelect");
        const price = parseFloat(selected.value);
        const finalPrice = applyMargin(price, "inverter");

        addRow("Inverter – " + selected.selectedOptions[0].textContent, 1, finalPrice, "inverter");
    }

    /*----------------------
     PANELS
    -----------------------*/
    if (document.querySelector("input[data-target='panels']").checked) {
        const sel = document.getElementById("panelSelect");
        const qty = parseInt(document.getElementById("panelQty").value);
        const price = parseFloat(sel.value);
        const finalPrice = applyMargin(price, "panels");

        addRow("Solar Panel – " + sel.selectedOptions[0].textContent, qty, finalPrice, "panels");
    }

    /*----------------------
     ACDB / DCDB
    -----------------------*/
    if (document.querySelector("input[data-target='acdb']").checked) {
        addRow("ACDB – " + document.getElementById("acdbSelect").value, 1, 2000, "acdb");
    }

    if (document.querySelector("input[data-target='dcdb']").checked) {
        addRow("DCDB – " + document.getElementById("dcdbSelect").value, 1, 2000, "dcdb");
    }

    /*----------------------
     CUSTOM PRODUCTS
    -----------------------*/
    const rows = document.querySelectorAll(".custom-row");
    rows.forEach(r => {
        if (!r.querySelector(".cp-enable").checked) return;

        const name = r.querySelector(".cp-name").value;
        const qty = parseFloat(r.querySelector(".cp-qty").value);
        const price = parseFloat(r.querySelector(".cp-price").value);

        // Margin toggle
        const useGlobal = r.querySelector(".cp-margin-global").checked;
        const customMargin = parseFloat(r.querySelector(".cp-custom-margin").value);

        let finalPrice = price;

        if (useGlobal) {
            const globalMargin = parseFloat(document.getElementById("globalMargin").value);
            finalPrice = price + price * globalMargin / 100;
        } else if (customMargin > 0) {
            finalPrice = price + price * customMargin / 100;
        }

        addRow(name, qty, finalPrice, "custom");
    });

    html += `</table><button onclick="window.print()" class="pdf-btn">Download PDF</button></div>`;

    output.innerHTML = html;
});

/****************************************************
 * 10. SUMMARY QUOTATION
 ****************************************************/
document.getElementById("generateSummary").addEventListener("click", function () {
    const output = document.getElementById("quotationOutput");
    output.innerHTML = "";

    let html = `
    <div class='quote'>
        <h1>Summary Quotation – V-Sustain Solar Solutions</h1>
        <table>
            <tr>
                <th>Product</th><th>Qty</th>
            </tr>
    `;

    function addRow(name, qty) {
        html += `
            <tr>
                <td>${name}</td><td>${qty}</td>
            </tr>
        `;
    }

    if (document.querySelector("input[data-target='inverter']").checked) {
        const inv = document.getElementById("inverterSelect").selectedOptions[0].textContent;
        addRow(inv, 1);
    }

    if (document.querySelector("input[data-target='panels']").checked) {
        const p = document.getElementById("panelSelect").selectedOptions[0].textContent;
        const q = document.getElementById("panelQty").value;
        addRow(p, q);
    }

    html += `</table><button onclick="window.print()" class="pdf-btn">Download PDF</button></div>`;
    output.innerHTML = html;
});
