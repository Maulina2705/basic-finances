// ========================================
// MONTHS
// ========================================

const months = [
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
    "Jan",
    "Feb"
];

// ========================================
// CURRENT MONTH INDEX
// ========================================

function getCurrentMonthIndex() {

    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();

    // mapping Maret 2026 - Februari 2027

    const mapping = {
        2: 0, // Mar
        3: 1, // Apr
        4: 2, // Mei
        5: 3, // Jun
        6: 4, // Jul
        7: 5, // Agu
        8: 6, // Sep
        9: 7, // Okt
        10: 8, // Nov
        11: 9, // Des
        0: 10, // Jan
        1: 11 // Feb
    };

    return mapping[currentMonth];

}

// ========================================
// DASHBOARD STATUS ENGINE
// ========================================

function calculateDashboardStatus(member) {

    const currentIndex = getCurrentMonthIndex();

    const today = new Date();

    const currentDay = today.getDate();

    // status bulan aktif
    const currentStatus = member.months[currentIndex];

    // ========================================
    // MENUNGGAK
    // cek bulan sebelumnya unpaid
    // ========================================

    if (currentIndex > 0) {

        const previousStatus =
            member.months[currentIndex - 1];

        if (previousStatus === "unpaid") {

            return "red";

        }

    }

    // ========================================
    // PENDING
    // ========================================

    if (
        currentStatus === "unpaid" &&
        currentDay > 10
    ) {

        return "yellow";

    }

    // ========================================
    // AMAN
    // ========================================

    return "green";

}

// ========================================
// DATA
// ========================================

const YEARLY_TARGET = 60000000;
const defaultMembers = [

    {
        id: 1,
        name: "Maulina",
        initials: "MH",

        months: [
            "paid",
            "paid",
            "unpaid",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none"
        ],

        receiptHistory: []
    },

    {
        id: 2,
        name: "Aisyah",
        initials: "AS",

        months: [
            "paid",
            "paid",
            "paid",
            "paid",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none"
        ],

        receiptHistory: []
    },

    {
        id: 3,
        name: "Budi",
        initials: "BD",

        months: [
            "paid",
            "paid",
            "unpaid",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none",
            "none"
        ],

        receiptHistory: []
    }

];

// ambil localStorage
const savedMembers =
    localStorage.getItem("tabunganMembers");

// pakai data localStorage kalau ada
const members =
    savedMembers
        ? JSON.parse(savedMembers)
        : defaultMembers;

// ========================================
// SAVE DATA
// ========================================

function saveData() {

    localStorage.setItem(
        "tabunganMembers",
        JSON.stringify(members)
    );

}

// ========================================
// MEMBER TOTAL
// ========================================

function calculateMemberTotal(member) {

    let paidCount = 0;

    member.months.forEach(month => {

        if (month === "paid") {
            paidCount++;
        }

    });

    return paidCount * 500000;

}


// ========================================
// DASHBOARD CALCULATION
// ========================================

function generateReceiptHistory() {

    members.forEach(member => {

        member.receiptHistory = [];

        member.months.forEach((status, index) => {

            if (status === "none") return;

            const monthName = months[index];

            const year =
                index <= 9 ? 2026 : 2027;

            if (status === "paid") {

                member.receiptHistory.push({

                    month:
                        `${monthName} ${year}`,

                    status: "paid",

                    transactionId:
                        "TF-" +
                        Math.floor(
                            Math.random() * 99999999
                        )

                });

            }

            else {

                member.receiptHistory.push({

                    month:
                        `${monthName} ${year}`,

                    status: "unpaid",

                    transactionId: null

                });

            }

        });

    });

}

function updateDashboard() {

    // ========================================
    // TOTAL UANG
    // ========================================

    let totalMoney = 0;

    // ========================================
    // TOTAL STATUS
    // ========================================

    let paid = 0;
    let late = 0;

    members.forEach(member => {

        // total tabungan member
        totalMoney += calculateMemberTotal(member);

        const dashboardStatus =
            calculateDashboardStatus(member);

        // aman
        if (dashboardStatus === "green") {
            paid++;
        }

        // pending + menunggak
        if (
            dashboardStatus === "yellow" ||
            dashboardStatus === "red"
        ) {
            late++;
        }

    });

    // persen target
    const percent =
        Math.floor(
            (totalMoney / YEARLY_TARGET) * 100
        );

    // total uang
    document.getElementById("totalMoney")
        .textContent =
        `Rp ${totalMoney.toLocaleString("id-ID")}`;

    // progress persen
    document.getElementById("progressPercent")
        .textContent =
        `${percent}%`;

    // progress target
    document.getElementById("progressTarget")
        .textContent =
        `Rp ${totalMoney.toLocaleString("id-ID")} / Rp ${YEARLY_TARGET.toLocaleString("id-ID")}`;

    // total member
    document.getElementById("totalMembers")
        .textContent =
        members.length;

    // paid
    document.getElementById("paidMembers")
        .textContent =
        paid;

    // late
    document.getElementById("lateMembers")
        .textContent =
        late;

    // progress bar
    document.querySelector(".progress-fill")
        .style.width =
        `${percent}%`;

}

generateReceiptHistory();
updateDashboard();
saveData();

// ========================================
// SMART ALERT SYSTEM
// ========================================

const alertList =
    document.getElementById("alertList");

function renderAlerts() {

    let yellowCount = 0;
    let redCount = 0;

    members.forEach(member => {

        const dashboardStatus =
            calculateDashboardStatus(member);

        if (dashboardStatus === "yellow") {
            yellowCount++;
        }

        if (dashboardStatus === "red") {
            redCount++;
        }

    });

    let html = "";

    // pending
    if (yellowCount > 0) {

        html += `
      <div class="alert-card yellow">

        <div>
          <h4>Belum Bayar Bulan Ini</h4>
          <p>${yellowCount} anggota belum melakukan pembayaran</p>
        </div>

        <span>⚠️</span>

      </div>
    `;

    }

    // red
    if (redCount > 0) {

        html += `
      <div class="alert-card red">

        <div>
          <h4>Menunggak 2 Bulan</h4>
          <p>${redCount} anggota perlu ditindaklanjuti</p>
        </div>

        <span>🚨</span>

      </div>
    `;

    }

    // jika aman semua
    if (yellowCount === 0 && redCount === 0) {

        html += `
      <div class="alert-card">

        <div>
          <h4>Semua Pembayaran Aman</h4>
          <p>Tidak ada anggota yang menunggak</p>
        </div>

        <span>✅</span>

      </div>
    `;

    }

    alertList.innerHTML = html;

}

renderAlerts();

// ========================================
// MEMBER CARD RENDER
// ========================================

const memberList = document.getElementById("memberList");
const searchMemberInput = document.getElementById("searchMemberInput");
const filterButtons = document.querySelectorAll(".filter-btn");
let currentFilter = "all";
const sortSelect = document.getElementById("sortSelect");
let currentSort = "name";

function renderMembers() {

    memberList.innerHTML = "";

    const keyword =
        searchMemberInput.value
            .toLowerCase();

    const filteredMembers =
        members.filter(member => {

            const matchSearch =
                member.name
                    .toLowerCase()
                    .includes(keyword);

            const dashboardStatus =
                calculateDashboardStatus(member);

            const matchFilter =
                currentFilter === "all"
                ||
                dashboardStatus === currentFilter;

            return (
                matchSearch &&
                matchFilter
            );

        });

    // ========================================
    // SORT MEMBER
    // ========================================

    filteredMembers.sort((a, b) => {

        // sort nama
        if (currentSort === "name") {

            return a.name.localeCompare(b.name);

        }

        // sort tabungan terbesar
        if (currentSort === "money") {

            return (
                calculateMemberTotal(b)
                -
                calculateMemberTotal(a)
            );

        }

        // sort status
        if (currentSort === "status") {

            const statusOrder = {
                red: 0,
                yellow: 1,
                green: 2
            };

            return (
                statusOrder[
                calculateDashboardStatus(a)
                ]
                -
                statusOrder[
                calculateDashboardStatus(b)
                ]
            );

        }

    });

    if (filteredMembers.length === 0) {

        let title =
            "Tidak Ada Anggota";

        let description =
            "Tambah anggota baru untuk memulai tabungan";

        // search aktif
        if (
            searchMemberInput.value
                .trim() !== ""
        ) {

            title =
                "Member Tidak Ditemukan";

            description =
                "Coba gunakan kata kunci lain";

        }

        // filter aktif
        else if (
            currentFilter !== "all"
        ) {

            if (currentFilter === "green") {

                title =
                    "Tidak Ada Member Aman";

            }

            if (currentFilter === "yellow") {

                title =
                    "Tidak Ada Member Pending";

            }

            if (currentFilter === "red") {

                title =
                    "Tidak Ada Member Menunggak";

            }

            description =
                "Semua status terlihat aman";

        }

        memberList.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-users"></i>

            <h3>${title}</h3>

            <p>${description}</p>

        </div>

    `;

        return;

    }

    filteredMembers.forEach(member => {

        const dashboardStatus =
            calculateDashboardStatus(member);

        let statusText = "Aman";

        if (dashboardStatus === "yellow") {
            statusText = "Pending";
        }

        if (dashboardStatus === "red") {
            statusText = "Menunggak";
        }

        const card = `
      <div class="member-card"
     data-member="${member.name}">

        <div class="member-left">

          <div class="avatar">
            ${member.initials}
          </div>

          <div>
            <h4>${member.name}</h4>
            <p>Tabungan Rp ${calculateMemberTotal(member)
                .toLocaleString("id-ID")}</p>
          </div>

        </div>

        <div class="member-actions">

  <div class="member-status ${dashboardStatus}">
    ${statusText}
  </div>

  <button
    class="payment-btn hidden"
    data-id="${member.id}">

    <i class="fa-solid fa-dollar-sign"></i>

  </button>

  <button
    class="edit-btn hidden"
    data-id="${member.id}">

    <i class="fa-solid fa-pen"></i>

  </button>

  <button
    class="delete-btn hidden"
    data-id="${member.id}">

    <i class="fa-solid fa-trash"></i>

  </button>

</div>

      </div>
    `;

        memberList.innerHTML += card;

    });

}

renderMembers();

// ========================================
// DELETE MEMBER SYSTEM
// ========================================

document.addEventListener("click", (e) => {

    const deleteBtn =
        e.target.closest(".delete-btn");

    if (!deleteBtn) return;

    const memberId =
        Number(deleteBtn.dataset.id);

    memberToDelete = memberId;

    deleteModal.style.display = "flex";

    return;

    const memberIndex =
        members.findIndex(
            member => member.id === memberId
        );

    if (memberIndex === -1) return;

    members.splice(memberIndex, 1);
    saveData();

    // rerender
    renderMembers();
    renderChecklist();
    renderAlerts();
    updateDashboard();
    saveData();

    // restore admin buttons
    if (isAdmin) {
        showAdminControls();
    }
});

// ========================================
// CHECKLIST RENDER
// ========================================

const checklistBody =
    document.getElementById("checklistBody");

function renderChecklist() {

    checklistBody.innerHTML = "";

    members.forEach(member => {

        let monthCells = "";

        member.months.forEach((status, monthIndex) => {

            monthCells += `
    
    <td>

        <span 
            class="
                status-dot
                ${status}
            "

            data-member="${member.id}"
            data-month="${monthIndex}"

        >
        </span>

    </td>

    `;

        });
        const row = `
      <tr>

        <td class="name-cell">

          <div class="table-user">

            <div class="table-avatar">
              ${member.initials}
            </div>

            <span>${member.name}</span>

          </div>

        </td>

        ${monthCells}

      </tr>
    `;

        checklistBody.innerHTML += row;

    });

}

renderChecklist();


// ========================================
// PAGE SWITCH
// ========================================

const navButtons =
    document.querySelectorAll(".nav-btn");

const pages =
    document.querySelectorAll(".page");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetPage = button.dataset.page;

        if (!targetPage) return;

        navButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        pages.forEach(page => {
            page.classList.remove("active");
        });

        document
            .getElementById(targetPage)
            .classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});


// ========================================
// ADMIN MODAL
// ========================================

const adminBtn =
    document.getElementById("adminBtn");

const adminModal =
    document.getElementById("adminModal");

adminBtn.addEventListener("click", () => {

    adminModal.style.display = "flex";

});


// ========================================
// RECEIPT MODAL
// ========================================

const receiptModal =
    document.getElementById("receiptModal");

const deleteModal =
    document.getElementById("deleteModal");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");

let memberToDelete = null;

const addMemberModal =
    document.getElementById("addMemberModal");

const addMemberBtn =
    document.getElementById("addMemberBtn");

const saveMemberBtn =
    document.getElementById("saveMemberBtn");

const newMemberName =
    document.getElementById("newMemberName");

// ========================================
// SAVE NEW MEMBER
// ========================================

saveMemberBtn.addEventListener("click", () => {

    const name =
        newMemberName.value.trim();

    // validasi kosong
    if (name === "") {

        alert("Nama anggota wajib diisi");

        return;

    }

    // buat initials otomatis
    const initials =
        name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();

    const defaultMonths = [];

    // bulan sekarang device
    const realMonth =
        new Date().getMonth();

    // convert ke index checklist
    const currentChecklistMonth =
        realMonth - 2;

    // paksa selalu 12 bulan
    for (let i = 0; i < 12; i++) {

        // bulan lewat + bulan sekarang
        if (i <= currentChecklistMonth) {

            defaultMonths.push("unpaid");

        }

        // bulan masa depan
        else {

            defaultMonths.push("none");

        }

    }

    // buat member baru
    const newMember = {

        id: Date.now(),

        name: name,

        initials: initials,

        months: defaultMonths,

        receiptHistory: []

    };

    // masukin ke array
    members.push(newMember);
    saveData();

    // generate receipt ulang
    generateReceiptHistory();

    // rerender semua
    renderMembers();
    renderChecklist();
    renderAlerts();
    updateDashboard();
    saveData();

    // restore admin buttons
    if (isAdmin) {
        showAdminControls();
    }

    // reset input
    newMemberName.value = "";

    // close modal
    addMemberModal.style.display = "none";

});

// ========================================
// CLOSE MODAL
// ========================================

window.addEventListener("click", (e) => {

    if (e.target === adminModal) {
        adminModal.style.display = "none";
    }

    if (e.target === receiptModal) {
        receiptModal.style.display = "none";
    }

    if (e.target === editModal) {
        editModal.style.display = "none";
    }

    if (e.target === addMemberModal) {
        addMemberModal.style.display = "none";
    }

});


// ========================================
// RECEIPT OPEN
// ========================================

document.addEventListener("click", (e) => {

    // prevent action buttons triggering receipt
    if (
        e.target.closest(".edit-btn") ||
        e.target.closest(".delete-btn") ||
        e.target.closest(".payment-btn")
    ) return;

    const memberCard =
        e.target.closest(".member-card");

    if (!memberCard) return;

    const memberName =
        memberCard.dataset.member;

    const member =
        members.find(m => m.name === memberName);

    if (!member) return;

    const historyContainer =
        document.getElementById(
            "receiptHistory"
        );

    historyContainer.innerHTML = "";

    member.receiptHistory.forEach(item => {

        const receiptItem = `

    <div class="receipt-item">

        <div class="receipt-left">

            <span class="receipt-month">
                ${item.month}
            </span>

            <span class="receipt-id">

                ${item.transactionId
                ? item.transactionId
                : "Belum Dibayar"}

            </span>

        </div>

        <div class="
            ${item.status === "paid"
                ? "receipt-paid"
                : "receipt-unpaid"}
        ">

            ${item.status === "paid"
                ? "PAID"
                : "UNPAID"}

        </div>

    </div>

    `;

        historyContainer.innerHTML += receiptItem;

    });

    // inject receipt
    document.getElementById("receiptName")
        .textContent =
        member.name;

    // cari pembayaran terakhir
    const latestPaid =
        [...member.receiptHistory]
            .reverse()
            .find(item => item.status === "paid");

    // fallback kalau belum pernah bayar
    if (latestPaid) {

        document.getElementById("receiptMonth")
            .textContent =
            latestPaid.month;

        document.getElementById("receiptId")
            .textContent =
            latestPaid.transactionId;

    }

    else {

        document.getElementById("receiptMonth")
            .textContent =
            "-";

        document.getElementById("receiptId")
            .textContent =
            "-";

    }

    // nominal tetap
    document.getElementById("receiptAmount")
        .textContent =
        "Rp 500.000";

    // open modal
    receiptModal.style.display = "flex";

});


// ========================================
// CLOSE RECEIPT
// ========================================

const closeBtn =
    document.querySelector(".close-btn");

closeBtn.addEventListener("click", () => {

    receiptModal.style.display = "none";

});


// ========================================
// ADMIN LOGIN SYSTEM
// ========================================

let isAdmin =
    localStorage.getItem("isAdmin") === "true";

function showAdminControls() {

    document
        .querySelectorAll(".edit-btn")
        .forEach(btn => {

            btn.classList.remove("hidden");

        });

    document
        .querySelectorAll(".delete-btn")
        .forEach(btn => {

            btn.classList.remove("hidden");

        });

    document
        .querySelectorAll(".payment-btn")
        .forEach(btn => {

            btn.classList.remove("hidden");

        });

    document
        .getElementById("addMemberBtn")
        .classList.remove("hidden");

}

function hideAdminControls() {

    document
        .querySelectorAll(".edit-btn")
        .forEach(btn => {

            btn.classList.add("hidden");

        });

    document
        .querySelectorAll(".delete-btn")
        .forEach(btn => {

            btn.classList.add("hidden");

        });

    document
        .querySelectorAll(".payment-btn")
        .forEach(btn => {

            btn.classList.add("hidden");

        });

    document
        .getElementById("addMemberBtn")
        .classList.add("hidden");

}

const loginBtn =
    document.getElementById(
        "adminLoginBtn"
    );

const adminBanner =
    document.getElementById("adminBanner");

const logoutBtn =
    document.getElementById("logoutBtn");

const editMemberModal =
    document.getElementById("editMemberModal");

const editMemberInput =
    document.getElementById("editMemberInput");

const saveMemberNameBtn =
    document.getElementById("saveMemberNameBtn");

loginBtn.addEventListener("click", () => {

    const username =
        document.getElementById(
            "adminUsername"
        ).value;

    const password =
        document.getElementById(
            "adminPassword"
        ).value;

    // demo auth
    if (
        username === "admin" &&
        password === "123"
    ) {

        isAdmin = true;

        localStorage.setItem(
            "isAdmin",
            "true"
        );

        adminModal.style.display = "none";

        adminBanner.style.display = "flex";

        showAdminControls();

    }

    else {

        alert("Username atau password salah");

    }

});

// ========================================
// EDIT PAYMENT MODAL
// ========================================

const editModal =
    document.getElementById("editModal");

const statusOptions =
    document.querySelectorAll(".status-option");

const saveStatusBtn =
    document.getElementById("saveStatusBtn");

let selectedMember = null;
let editingMemberIndex = null;
let selectedStatus = null;

// SELECT STATUS

statusOptions.forEach(option => {

    option.addEventListener("click", () => {

        selectedStatus =
            option.dataset.status;

        statusOptions.forEach(btn => {
            btn.classList.remove("active");
        });

        option.classList.add("active");

    });

});


// SAVE STATUS

saveStatusBtn.addEventListener("click", () => {

    if (!selectedMember) return;

    if (!selectedStatus) return;

    const currentMonth =
        getCurrentMonthIndex();

    if (selectedStatus === "green") {
        selectedMember.months[currentMonth] =
            "paid";
    }

    else {
        selectedMember.months[currentMonth] =
            "unpaid";
    }

    // rerender
    renderMembers();
    renderChecklist();
    renderAlerts();
    updateDashboard();
    saveData();

    if (isAdmin) {
        showAdminControls();
    }

    // close modal
    editModal.style.display = "none";

});

// ========================================
// INLINE CHECKLIST EDIT
// ========================================

document.addEventListener("click", (e) => {

    const dot =
        e.target.closest(".status-dot");

    if (!dot) return;

    // admin only
    if (!isAdmin) return;

    const memberId =
        Number(dot.dataset.member);

    const monthIndex =
        Number(dot.dataset.month);

    const member =
        members.find(m => m.id === memberId);

    generateReceiptHistory();

    if (!member) return;

    const current =
        member.months[monthIndex];

    // bulan sekarang
    const currentMonthIndex =
        getCurrentMonthIndex();

    // ========================================
    // BULAN MASA LALU / SAAT INI
    // ========================================

    if (monthIndex <= currentMonthIndex) {

        if (current === "paid") {

            member.months[monthIndex] =
                "unpaid";

        }

        else {

            member.months[monthIndex] =
                "paid";

        }

    }

    // ========================================
    // BULAN MASA DEPAN
    // ========================================

    else {

        if (current === "none") {

            member.months[monthIndex] =
                "paid";

        }

        else if (current === "paid") {

            member.months[monthIndex] =
                "unpaid";

        }

        else {

            member.months[monthIndex] =
                "none";

        }

    }

    // rerender everything
    renderChecklist();
    renderMembers();
    renderAlerts();
    updateDashboard();
    saveData();

    if (isAdmin) {
        showAdminControls();
    }

});

// ========================================
// LOGOUT SYSTEM
// ========================================

logoutBtn.addEventListener("click", () => {

    isAdmin = false;
    localStorage.removeItem("isAdmin");

    // hide banner
    adminBanner.style.display = "none";

    hideAdminControls();

});

// ========================================
// OPEN ADD MEMBER MODAL
// ========================================

addMemberBtn.addEventListener("click", () => {

    addMemberModal.style.display = "flex";

});

// ========================================
// DELETE CONFIRM SYSTEM
// ========================================

confirmDeleteBtn.addEventListener("click", () => {

    if (!memberToDelete) return;

    const memberIndex =
        members.findIndex(
            member => member.id === memberToDelete
        );

    if (memberIndex === -1) return;

    members.splice(memberIndex, 1);
    saveData();

    renderMembers();
    renderChecklist();
    renderAlerts();
    updateDashboard();
    saveData();

    // restore admin buttons
    if (isAdmin) {
        showAdminControls();
    }

    deleteModal.style.display = "none";

});

cancelDeleteBtn.addEventListener("click", () => {

    deleteModal.style.display = "none";

});

// ========================================
// EDIT MEMBER NAME
// ========================================

document.addEventListener("click", (e) => {

    const editBtn =
        e.target.closest(".edit-btn");

    if (!editBtn) return;

    const memberId =
        Number(editBtn.dataset.id);

    const memberIndex =
        members.findIndex(
            member => member.id === memberId
        );

    if (memberIndex === -1) return;

    editingMemberIndex =
        memberIndex;

    editMemberInput.value =
        members[memberIndex].name;

    editMemberModal.style.display =
        "flex";

});

saveMemberNameBtn.addEventListener("click", () => {

    if (editingMemberIndex === null)
        return;

    const newName =
        editMemberInput.value.trim();

    if (newName === "") return;

    // update nama
    members[editingMemberIndex].name =
        newName;

    // update initials
    members[editingMemberIndex].initials =
        newName
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();

    // rerender
    renderMembers();
    renderChecklist();
    renderAlerts();
    updateDashboard();
    saveData();

    // restore admin buttons
    if (isAdmin) {
        showAdminControls();
    }

    // close modal
    editMemberModal.style.display =
        "none";

});

document.addEventListener("click", (e) => {

    const paymentBtn =
        e.target.closest(".payment-btn");

    if (!paymentBtn) return;

    const memberId =
        Number(paymentBtn.dataset.id);

    const member =
        members.find(m => m.id === memberId);

    if (!member) return;

    selectedMember = member;
    selectedStatus = null;

    statusOptions.forEach(btn => {
        btn.classList.remove("active");
    });

    editModal.style.display = "flex";

});

// ========================================
// RESTORE ADMIN MODE AFTER REFRESH
// ========================================

if (isAdmin) {
    adminBanner.style.display = "flex";
    showAdminControls();
}

// ========================================
// MEMBER SEARCH
// ========================================

searchMemberInput.addEventListener(
    "input",
    () => {

        renderMembers();

        if (isAdmin) {
            showAdminControls();
        }

    }
);

// ========================================
// MEMBER FILTER
// ========================================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter =
                button.dataset.filter;

            renderMembers();

            if (isAdmin) {
                showAdminControls();
            }

        }
    );

});

// ========================================
// MEMBER SORT
// ========================================

sortSelect.addEventListener(
    "change",
    () => {

        currentSort =
            sortSelect.value;

        renderMembers();

        if (isAdmin) {
            showAdminControls();
        }

    }
);