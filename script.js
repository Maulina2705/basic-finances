// ========================================
// DATA
// ========================================

const YEARLY_TARGET = 60000000;
const members = [

    {
        id: 1,
        name: "Maulina",
        initials: "MH",
        total: 4500000,
        status: "green",

        months: [
            "green",
            "green",
            "green",
            "yellow",
            "red",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green"
        ]
    },

    {
        id: 2,
        name: "Aisyah",
        initials: "AS",
        total: 3000000,
        status: "yellow",

        months: [
            "green",
            "green",
            "yellow",
            "yellow",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green"
        ]
    },

    {
        id: 3,
        name: "Budi",
        initials: "BD",
        total: 1500000,
        status: "red",

        months: [
            "green",
            "red",
            "red",
            "yellow",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green",
            "green"
        ]
    }

];

// ========================================
// DASHBOARD CALCULATION
// ========================================

function updateDashboard() {

    // total uang
    let totalMoney = 0;

    // total status
    let paid = 0;
    let late = 0;

    members.forEach(member => {

        totalMoney += member.total;

        if (member.status === "green") {
            paid++;
        }

        if (
            member.status === "yellow" ||
            member.status === "red"
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

updateDashboard();

// ========================================
// SMART ALERT SYSTEM
// ========================================

const alertList =
    document.getElementById("alertList");

function renderAlerts() {

    let yellowCount = 0;
    let redCount = 0;

    members.forEach(member => {

        if (member.status === "yellow") {
            yellowCount++;
        }

        if (member.status === "red") {
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

function renderMembers() {

    memberList.innerHTML = "";

    members.forEach(member => {

        let statusText = "Aman";

        if (member.status === "yellow") {
            statusText = "Pending";
        }

        if (member.status === "red") {
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
            <p>Tabungan Rp ${member.total.toLocaleString("id-ID")}</p>
          </div>

        </div>

        <div class="member-actions">

  <div class="member-status ${member.status}">
    ${statusText}
  </div>

  <button
  class="edit-btn hidden"
  data-id="${member.id}">

  Edit

</button>

</div>

      </div>
    `;

        memberList.innerHTML += card;

    });

}

renderMembers();


// ========================================
// CHECKLIST RENDER
// ========================================

const checklistBody =
    document.getElementById("checklistBody");

function renderChecklist() {

    checklistBody.innerHTML = "";

    members.forEach(member => {

        let monthCells = "";

        member.months.forEach((status, index) => {

            monthCells += `
        <td>

  <span
    class="status-dot ${status}"
    data-member="${member.id}"
    data-month="${index}">
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

});


// ========================================
// RECEIPT OPEN
// ========================================

document.addEventListener("click", (e) => {

    // prevent edit button triggering receipt
    if (e.target.closest(".edit-btn")) return;

    const memberCard =
        e.target.closest(".member-card");

    if (!memberCard) return;

    const memberName =
        memberCard.dataset.member;

    const member =
        members.find(m => m.name === memberName);

    if (!member) return;

    // bulan sekarang
    const now = new Date();

    const month =
        now.toLocaleString("id-ID", {
            month: "long"
        });

    const year =
        now.getFullYear();

    // fake transaction id
    const transactionId =
        "TF-" +
        Math.floor(
            Math.random() * 99999999
        );

    // inject receipt
    document.getElementById("receiptName")
        .textContent =
        member.name;

    document.getElementById("receiptMonth")
        .textContent =
        `${month} ${year}`;

    document.getElementById("receiptAmount")
        .textContent =
        "Rp 500.000";

    document.getElementById("receiptId")
        .textContent =
        transactionId;

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

let isAdmin = false;

const loginBtn =
    document.querySelector(".login-btn");

const adminBanner =
    document.getElementById("adminBanner");

const logoutBtn =
    document.getElementById("logoutBtn");

loginBtn.addEventListener("click", () => {

    const username =
        document.querySelector(
            'input[type="text"]'
        ).value;

    const password =
        document.querySelector(
            'input[type="password"]'
        ).value;

    // demo auth
    if (
        username === "admin" &&
        password === "123"
    ) {

        isAdmin = true;

        adminModal.style.display = "none";

        // show banner
        adminBanner.style.display = "flex";

        // show edit buttons
        document
            .querySelectorAll(".edit-btn")
            .forEach(btn => {

                btn.classList.remove("hidden");

            });

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
let selectedStatus = null;


// OPEN EDIT MODAL

document.addEventListener("click", (e) => {

    const editBtn =
        e.target.closest(".edit-btn");

    if (!editBtn) return;

    const memberId =
        Number(editBtn.dataset.id);

    selectedMember =
        members.find(m => m.id === memberId);

    if (!selectedMember) return;

    editModal.style.display = "flex";

});


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

    selectedMember.status =
        selectedStatus;

    // rerender
    renderMembers();

    renderChecklist();

    renderAlerts();

    updateDashboard();

    // restore admin buttons
    if (isAdmin) {

        document
            .querySelectorAll(".edit-btn")
            .forEach(btn => {

                btn.classList.remove("hidden");

            });

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

    if (!member) return;

    const current =
        member.months[monthIndex];

    // cycle status
    if (current === "green") {
        member.months[monthIndex] = "yellow";
    }

    else if (current === "yellow") {
        member.months[monthIndex] = "red";
    }

    else {
        member.months[monthIndex] = "green";
    }

    // sync overall status
    if (
        member.months.includes("red")
    ) {
        member.status = "red";
    }

    else if (
        member.months.includes("yellow")
    ) {
        member.status = "yellow";
    }

    else {
        member.status = "green";
    }

    // rerender everything
    renderChecklist();

    renderMembers();

    renderAlerts();

    updateDashboard();

    // restore admin edit buttons
    if (isAdmin) {

        document
            .querySelectorAll(".edit-btn")
            .forEach(btn => {

                btn.classList.remove("hidden");

            });

    }

});

// ========================================
// LOGOUT SYSTEM
// ========================================

logoutBtn.addEventListener("click", () => {

    isAdmin = false;

    // hide banner
    adminBanner.style.display = "none";

    // hide edit buttons
    document
        .querySelectorAll(".edit-btn")
        .forEach(btn => {

            btn.classList.add("hidden");

        });

});