/* =====================================================================
   app.js
   A tiny client-side "database" built on localStorage.
   This replaces the PHP + MySQL backend from the original project
   (db.php, process_*.php, db_*.php, view_*.php) so the whole site can
   run as plain HTML/CSS/JS with no server.

   Every "table" is just a JSON array stored under the key
   "squ_<table>" in the browser's localStorage. Records get an
   auto-incrementing "id", just like the original MySQL tables did.
   ===================================================================== */

const DB = {
    _key(table) {
        return "squ_" + table;
    },

    getAll(table) {
        const raw = localStorage.getItem(this._key(table));
        return raw ? JSON.parse(raw) : [];
    },

    _saveAll(table, rows) {
        localStorage.setItem(this._key(table), JSON.stringify(rows));
    },

    insert(table, record) {
        const rows = this.getAll(table);
        const nextId = rows.reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
        const row = Object.assign({ id: nextId }, record);
        rows.push(row);
        this._saveAll(table, rows);
        return row;
    },

    deleteById(table, id) {
        const rows = this.getAll(table);
        const filtered = rows.filter(r => String(r.id) !== String(id));
        const deleted = filtered.length !== rows.length;
        this._saveAll(table, filtered);
        return deleted;
    },

    search(table, predicate) {
        return this.getAll(table).filter(predicate);
    }
};

/* ---------------------------------------------------------------------
   Small helpers shared across pages
   --------------------------------------------------------------------- */

// Build a simple HTML table from an array of row objects.
function renderTable(container, columns, rows) {
    if (!rows || rows.length === 0) {
        container.innerHTML = "<p>No records found.</p>";
        return;
    }
    let html = "<table class='table table-bordered table-striped'><thead class='table-dark'><tr>";
    columns.forEach(col => html += `<th>${col.label}</th>`);
    html += "</tr></thead><tbody>";
    rows.forEach(row => {
        html += "<tr>";
        columns.forEach(col => {
            const val = row[col.key];
            html += `<td>${val === undefined || val === null ? "" : String(val)}</td>`;
        });
        html += "</tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
}

// Read a query-string parameter, e.g. getParam("success") for ?success=1
function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

// Show a dismissible Bootstrap success banner at the top of a container.
function showBanner(container, text) {
    const div = document.createElement("div");
    div.className = "alert alert-success alert-dismissible fade show";
    div.role = "alert";
    div.innerHTML = text + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    container.prepend(div);
}

/* ---------------------------------------------------------------------
   Seed data for the Restaurant page (weekly meal times / open
   restaurants). This stands in for the "meals / meal_times / days /
   restaurants / restaurant_availability" MySQL tables from db.php.
   --------------------------------------------------------------------- */

const RESTAURANT_SEED = {
    weekdayMeals: [
        { meal_name: "Breakfast", start_time: "07:00", end_time: "09:30" },
        { meal_name: "Lunch", start_time: "12:00", end_time: "14:30" },
        { meal_name: "Dinner", start_time: "18:00", end_time: "20:30" }
    ],
    weekendMeals: [
        { meal_name: "Breakfast", start_time: "08:00", end_time: "10:30" },
        { meal_name: "Lunch", start_time: "13:00", end_time: "15:00" },
        { meal_name: "Dinner", start_time: "19:00", end_time: "21:00" }
    ],
    weekdayRestaurants: ["Al Waha Restaurant", "Campus Cafe", "Zad Restaurant", "Green Corner"],
    weekendRestaurants: ["Campus Cafe", "Zad Restaurant"]
};
