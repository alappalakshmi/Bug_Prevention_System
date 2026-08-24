/* =========================================================
   BUG PREVENTION SYSTEM
   Main JavaScript
   ========================================================= */


/* =========================================================
   SAMPLE BUG DATA
   ========================================================= */

let bugs = [
    {
        id: "BUG-1001",
        module: "Authentication",
        severity: "Critical",
        status: "Resolved",
        date: "2026-01-12"
    },
    {
        id: "BUG-1002",
        module: "Dashboard",
        severity: "High",
        status: "Resolved",
        date: "2026-01-18"
    },
    {
        id: "BUG-1003",
        module: "Payment",
        severity: "Critical",
        status: "In Progress",
        date: "2026-02-03"
    },
    {
        id: "BUG-1004",
        module: "Reports",
        severity: "Medium",
        status: "Resolved",
        date: "2026-02-15"
    },
    {
        id: "BUG-1005",
        module: "Authentication",
        severity: "High",
        status: "Open",
        date: "2026-03-01"
    },
    {
        id: "BUG-1006",
        module: "Dashboard",
        severity: "Low",
        status: "Resolved",
        date: "2026-03-14"
    },
    {
        id: "BUG-1007",
        module: "API",
        severity: "Critical",
        status: "Resolved",
        date: "2026-04-04"
    },
    {
        id: "BUG-1008",
        module: "Payment",
        severity: "High",
        status: "Open",
        date: "2026-04-20"
    },
    {
        id: "BUG-1009",
        module: "Reports",
        severity: "Medium",
        status: "In Progress",
        date: "2026-05-07"
    },
    {
        id: "BUG-1010",
        module: "API",
        severity: "Low",
        status: "Resolved",
        date: "2026-05-22"
    },
    {
        id: "BUG-1011",
        module: "Dashboard",
        severity: "High",
        status: "Resolved",
        date: "2026-06-05"
    },
    {
        id: "BUG-1012",
        module: "Authentication",
        severity: "Medium",
        status: "Open",
        date: "2026-06-19"
    },
    {
        id: "BUG-1013",
        module: "Payment",
        severity: "Critical",
        status: "Resolved",
        date: "2026-07-02"
    },
    {
        id: "BUG-1014",
        module: "Reports",
        severity: "High",
        status: "Resolved",
        date: "2026-07-10"
    },
    {
        id: "BUG-1015",
        module: "API",
        severity: "Medium",
        status: "In Progress",
        date: "2026-07-21"
    }
];


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");
const pageTitle = document.getElementById("pageTitle");
const sidebar = document.getElementById("sidebar");
const mobileMenu = document.getElementById("mobileMenu");


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

const pageNames = {
    home: "Bug Prevention System",
    dashboard: "Dashboard",
    report: "Bug Report",
    checklist: "Prevention Checklist",
    history: "Bug History",
    analytics: "Analytics",
    settings: "Settings"
};


function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    const targetPage = document.getElementById(pageId);

    if (targetPage) {
        targetPage.classList.add("active-page");
    }

    navItems.forEach(item => {
        item.classList.remove("active");

        if (item.dataset.page === pageId) {
            item.classList.add("active");
        }
    });

    pageTitle.textContent = pageNames[pageId] || "Bug Prevention System";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    sidebar.classList.remove("mobile-open");

    if (pageId === "analytics") {
        setTimeout(initializeCharts, 100);
    }

    if (pageId === "history") {
        renderBugTable();
    }
}


/* Sidebar navigation */

navItems.forEach(item => {

    item.addEventListener("click", () => {
        showPage(item.dataset.page);
    });

});


/* Buttons with data-go */

document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.go);
    });

});


/* Mobile menu */

mobileMenu.addEventListener("click", () => {
    sidebar.classList.toggle("mobile-open");
});


/* =========================================================
   BUG REPORT FORM
   ========================================================= */

const bugForm = document.getElementById("bugForm");
const formMessage = document.getElementById("formMessage");

bugForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const bugId = document.getElementById("bugId").value.trim();
    const title = document.getElementById("bugTitle").value.trim();
    const description =
        document.getElementById("bugDescription").value.trim();
    const priority = document.getElementById("priority").value;
    const module = document.getElementById("module").value.trim();
    const reporter = document.getElementById("reporter").value.trim();


    /* Validation */

    if (
        !bugId ||
        !title ||
        !description ||
        !priority ||
        !module ||
        !reporter
    ) {

        formMessage.innerHTML = `
            <div class="form-error">
                <i class="fa-solid fa-circle-exclamation"></i>
                Please complete all required fields.
            </div>
        `;

        return;
    }


    if (!/^BUG-\d+$/i.test(bugId)) {

        formMessage.innerHTML = `
            <div class="form-error">
                Bug ID must use the format BUG-1234.
            </div>
        `;

        return;
    }


    /* Prevent duplicate Bug IDs */

    const duplicate = bugs.some(
        bug => bug.id.toLowerCase() === bugId.toLowerCase()
    );

    if (duplicate) {

        formMessage.innerHTML = `
            <div class="form-error">
                This Bug ID already exists.
            </div>
        `;

        return;
    }


    /* Convert priority into severity */

    let severity = "Low";

    if (priority === "Medium") {
        severity = "Medium";
    }

    if (priority === "High") {
        severity = "High";
    }


    /* Add new bug */

    bugs.unshift({
        id: bugId.toUpperCase(),
        module: module,
        severity: severity,
        status: "Open",
        date: new Date().toISOString().split("T")[0]
    });


    formMessage.innerHTML = `
        <div class="form-success">
            <i class="fa-solid fa-circle-check"></i>
            Bug ${bugId.toUpperCase()} was submitted successfully.
        </div>
    `;

    showToast(
        "Bug Submitted",
        `${bugId.toUpperCase()} has been added to bug history.`
    );

    bugForm.reset();

    updateDashboardStats();

});


/* =========================================================
   DASHBOARD STATISTICS
   ========================================================= */

function updateDashboardStats() {

    const total = bugs.length;

    const critical = bugs.filter(
        bug => bug.severity === "Critical"
    ).length;

    const resolved = bugs.filter(
        bug => bug.status === "Resolved"
    ).length;


    document.getElementById("totalBugs").textContent = total;

    document.getElementById("criticalBugs").textContent = critical;

    document.getElementById("resolvedBugs").textContent = resolved;
}


/* =========================================================
   CHECKLIST
   ========================================================= */

const checkboxes = document.querySelectorAll(
    ".check-item input"
);

const progressBar =
    document.getElementById("checkProgressBar");

const checklistStatus =
    document.getElementById("checklistStatus");


function updateChecklist() {

    const completed = [...checkboxes].filter(
        checkbox => checkbox.checked
    ).length;

    const total = checkboxes.length;

    const percentage =
        Math.round((completed / total) * 100);

    progressBar.style.width = `${percentage}%`;

    checklistStatus.textContent =
        `${completed} of ${total} tasks completed`;

    if (percentage === 100) {

        showToast(
            "Checklist Complete",
            "All prevention checks have been completed."
        );

    }

}


checkboxes.forEach(checkbox => {

    checkbox.addEventListener(
        "change",
        updateChecklist
    );

});


/* =========================================================
   BUG HISTORY
   ========================================================= */

const bugTableBody =
    document.getElementById("bugTableBody");

const bugSearch =
    document.getElementById("bugSearch");

const severityFilter =
    document.getElementById("severityFilter");

const statusFilter =
    document.getElementById("statusFilter");

const noResults =
    document.getElementById("noResults");


function getSeverityClass(severity) {

    return severity.toLowerCase();

}


function getStatusClass(status) {

    if (status === "In Progress") {
        return "progress";
    }

    return status.toLowerCase();
}


function renderBugTable() {

    let filteredBugs = [...bugs];

    const searchValue =
        bugSearch.value.toLowerCase().trim();

    const severityValue =
        severityFilter.value;

    const statusValue =
        statusFilter.value;


    /* Search */

    if (searchValue) {

        filteredBugs = filteredBugs.filter(bug => {

            return (
                bug.id.toLowerCase().includes(searchValue) ||
                bug.module.toLowerCase().includes(searchValue) ||
                bug.severity.toLowerCase().includes(searchValue) ||
                bug.status.toLowerCase().includes(searchValue)
            );

        });

    }


    /* Severity */

    if (severityValue !== "All") {

        filteredBugs = filteredBugs.filter(
            bug => bug.severity === severityValue
        );

    }


    /* Status */

    if (statusValue !== "All") {

        filteredBugs = filteredBugs.filter(
            bug => bug.status === statusValue
        );

    }


    bugTableBody.innerHTML = "";


    if (filteredBugs.length === 0) {

        noResults.style.display = "block";

        return;

    }


    noResults.style.display = "none";


    filteredBugs.forEach(bug => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${bug.id}</td>

            <td>${bug.module}</td>

            <td>
                <span class="severity severity-${getSeverityClass(bug.severity)}">
                    ${bug.severity}
                </span>
            </td>

            <td>
                <span class="status status-${getStatusClass(bug.status)}">
                    ${bug.status}
                </span>
            </td>

            <td>${formatDate(bug.date)}</td>
        `;

        bugTableBody.appendChild(row);

    });

}


function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


/* Search and filters */

bugSearch.addEventListener(
    "input",
    renderBugTable
);

severityFilter.addEventListener(
    "change",
    renderBugTable
);

statusFilter.addEventListener(
    "change",
    renderBugTable
);


/* =========================================================
   TABLE SORTING
   ========================================================= */

let sortDirection = 1;

document.querySelectorAll(
    "#bugTable th[data-sort]"
).forEach(header => {

    header.addEventListener("click", () => {

        const sortKey =
            header.dataset.sort;

        bugs.sort((a, b) => {

            let valueA = a[sortKey];
            let valueB = b[sortKey];

            if (sortKey === "date") {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            }

            if (valueA < valueB) {
                return -1 * sortDirection;
            }

            if (valueA > valueB) {
                return 1 * sortDirection;
            }

            return 0;

        });

        sortDirection *= -1;

        renderBugTable();

    });

});


/* =========================================================
   CHARTS
   ========================================================= */

let severityChart;
let moduleChart;
let trendChart;


function initializeCharts() {

    createSeverityChart();
    createModuleChart();
    createTrendChart();

}


function createSeverityChart() {

    const canvas =
        document.getElementById("severityChart");

    if (!canvas) return;


    if (severityChart) {
        severityChart.destroy();
    }


    const severityCounts = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0
    };


    bugs.forEach(bug => {

        if (severityCounts[bug.severity] !== undefined) {
            severityCounts[bug.severity]++;
        }

    });


    severityChart = new Chart(canvas, {

        type: "doughnut",

        data: {
            labels: [
                "Critical",
                "High",
                "Medium",
                "Low"
            ],

            datasets: [
                {
                    data: [
                        severityCounts.Critical,
                        severityCounts.High,
                        severityCounts.Medium,
                        severityCounts.Low
                    ],

                    backgroundColor: [
                        "#ef4444",
                        "#f97316",
                        "#f59e0b",
                        "#10b981"
                    ],

                    borderWidth: 0
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            cutout: "68%",

            plugins: {
                legend: {
                    position: "bottom",

                    labels: {
                        color: getChartTextColor(),
                        padding: 18,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }

    });

}


function createModuleChart() {

    const canvas =
        document.getElementById("moduleChart");

    if (!canvas) return;


    if (moduleChart) {
        moduleChart.destroy();
    }


    const moduleCounts = {};


    bugs.forEach(bug => {

        if (!moduleCounts[bug.module]) {
            moduleCounts[bug.module] = 0;
        }

        moduleCounts[bug.module]++;

    });


    moduleChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: Object.keys(moduleCounts),

            datasets: [
                {
                    label: "Bugs",

                    data: Object.values(moduleCounts),

                    backgroundColor: [
                        "#2563eb",
                        "#06b6d4",
                        "#8b5cf6",
                        "#10b981",
                        "#f59e0b"
                    ],

                    borderRadius: 7
                }
            ]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {

                x: {
                    grid: {
                        display: false
                    },

                    ticks: {
                        color: getChartTextColor()
                    }
                },

                y: {
                    beginAtZero: true,

                    ticks: {
                        color: getChartTextColor(),
                        stepSize: 1
                    },

                    grid: {
                        color: getChartGridColor()
                    }
                }

            }

        }

    });

}


function createTrendChart() {

    const canvas =
        document.getElementById("trendChart");

    if (!canvas) return;


    if (trendChart) {
        trendChart.destroy();
    }


    trendChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug"
            ],

            datasets: [

                {
                    label: "Reported",

                    data: [
                        18,
                        22,
                        15,
                        25,
                        19,
                        28,
                        21,
                        24
                    ],

                    borderColor: "#2563eb",

                    backgroundColor:
                        "rgba(37, 99, 235, 0.08)",

                    fill: true,

                    tension: 0.4,

                    pointRadius: 4,

                    pointBackgroundColor:
                        "#2563eb"
                },

                {
                    label: "Resolved",

                    data: [
                        15,
                        19,
                        14,
                        21,
                        18,
                        24,
                        20,
                        22
                    ],

                    borderColor: "#10b981",

                    backgroundColor:
                        "rgba(16, 185, 129, 0.06)",

                    fill: true,

                    tension: 0.4,

                    pointRadius: 4,

                    pointBackgroundColor:
                        "#10b981"
                }

            ]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {

                legend: {
                    position: "bottom",

                    labels: {
                        color: getChartTextColor(),
                        padding: 18,
                        font: {
                            size: 11
                        }
                    }
                }

            },

            scales: {

                x: {
                    ticks: {
                        color: getChartTextColor()
                    },

                    grid: {
                        display: false
                    }
                },

                y: {
                    beginAtZero: true,

                    ticks: {
                        color: getChartTextColor()
                    },

                    grid: {
                        color: getChartGridColor()
                    }
                }

            }

        }

    });

}


function getChartTextColor() {

    return document.body.classList.contains("dark-mode")
        ? "#94a3b8"
        : "#6b7280";

}


function getChartGridColor() {

    return document.body.classList.contains("dark-mode")
        ? "rgba(148, 163, 184, 0.1)"
        : "rgba(107, 114, 128, 0.1)";

}


/* =========================================================
   DARK / LIGHT MODE
   ========================================================= */

const themeToggle =
    document.getElementById("themeToggle");


const savedTheme =
    localStorage.getItem("bugguard-theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeToggle.checked = true;

}


themeToggle.addEventListener("change", () => {

    document.body.classList.toggle(
        "dark-mode",
        themeToggle.checked
    );

    localStorage.setItem(
        "bugguard-theme",
        themeToggle.checked
            ? "dark"
            : "light"
    );


    /* Recreate charts with correct colors */

    if (
        document
            .getElementById("analytics")
            .classList.contains("active-page")
    ) {

        setTimeout(initializeCharts, 100);

    }

});


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

const notificationToggle =
    document.getElementById("notificationToggle");

const notificationBtn =
    document.getElementById("notificationBtn");


notificationBtn.addEventListener("click", () => {

    if (notificationToggle.checked) {

        showToast(
            "Notifications",
            "You have no new notifications."
        );

    } else {

        showToast(
            "Notifications Disabled",
            "Enable notifications from Settings."
        );

    }

});


notificationToggle.addEventListener("change", () => {

    showToast(
        "Preferences Updated",
        notificationToggle.checked
            ? "Notifications enabled."
            : "Notifications disabled."
    );

});


/* =========================================================
   TOAST
   ========================================================= */

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const closeToast =
    document.getElementById("closeToast");


let toastTimer;


function showToast(title, message) {

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


closeToast.addEventListener(
    "click",
    () => {
        toast.classList.remove("show");
    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

updateDashboardStats();

renderBugTable();

updateChecklist();
