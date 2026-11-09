/* =========================================
   AdminPro - User Management
========================================= */

// DOM Elements

const userTableBody = document.getElementById("userTableBody");

const searchInput = document.getElementById("searchInput");

const statusFilter = document.getElementById("statusFilter");

const pagination = document.getElementById("pagination");

const paginationInfo = document.getElementById("paginationInfo");

const userForm = document.getElementById("userForm");

const userModalElement = document.getElementById("userModal");

const deleteModalElement = document.getElementById("deleteModal");

const userModal = bootstrap.Modal.getOrCreateInstance(userModalElement);

const deleteModal = bootstrap.Modal.getOrCreateInstance(deleteModalElement);


// Pagination settings

const USERS_PER_PAGE = 5;

let currentPage = 1;

let deleteUserId = null;


// Default users

const defaultUsers = [

    {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "Admin",
        date: "2026-01-12",
        status: "Active",
        image: "https://i.pravatar.cc/100?img=12"
    },

    {
        id: 2,
        name: "Michael Smith",
        email: "michael@example.com",
        role: "Editor",
        date: "2026-01-18",
        status: "Active",
        image: "https://i.pravatar.cc/100?img=33"
    },

    {
        id: 3,
        name: "Emily Davis",
        email: "emily@example.com",
        role: "User",
        date: "2026-02-05",
        status: "Pending",
        image: "https://i.pravatar.cc/100?img=44"
    },

    {
        id: 4,
        name: "James Wilson",
        email: "james@example.com",
        role: "Manager",
        date: "2026-02-12",
        status: "Inactive",
        image: "https://i.pravatar.cc/100?img=68"
    },

    {
        id: 5,
        name: "Olivia Brown",
        email: "olivia@example.com",
        role: "User",
        date: "2026-02-20",
        status: "Active",
        image: "https://i.pravatar.cc/100?img=47"
    },

    {
        id: 6,
        name: "William Taylor",
        email: "william@example.com",
        role: "Editor",
        date: "2026-03-02",
        status: "Pending",
        image: "https://i.pravatar.cc/100?img=11"
    },

    {
        id: 7,
        name: "Sophia Anderson",
        email: "sophia@example.com",
        role: "User",
        date: "2026-03-08",
        status: "Active",
        image: "https://i.pravatar.cc/100?img=49"
    },

    {
        id: 8,
        name: "Benjamin Thomas",
        email: "benjamin@example.com",
        role: "Manager",
        date: "2026-03-15",
        status: "Inactive",
        image: "https://i.pravatar.cc/100?img=60"
    },

    {
        id: 9,
        name: "Ava Martinez",
        email: "ava@example.com",
        role: "User",
        date: "2026-04-01",
        status: "Active",
        image: "https://i.pravatar.cc/100?img=32"
    },

    {
        id: 10,
        name: "Lucas Garcia",
        email: "lucas@example.com",
        role: "Editor",
        date: "2026-04-12",
        status: "Pending",
        image: "https://i.pravatar.cc/100?img=15"
    },

    {
        id: 11,
        name: "Isabella Clark",
        email: "isabella@example.com",
        role: "Admin",
        date: "2026-04-20",
        status: "Active",
        image: "https://i.pravatar.cc/100?img=23"
    },

    {
        id: 12,
        name: "Henry Lewis",
        email: "henry@example.com",
        role: "User",
        date: "2026-05-01",
        status: "Inactive",
        image: "https://i.pravatar.cc/100?img=52"
    }

];


// Load users from localStorage


function loadUsers() {

    try {

        const savedUsers = localStorage.getItem("adminProUsers");

        // First-time initialization
        if (savedUsers === null) {

            const initialUsers = [...defaultUsers];

            localStorage.setItem(
                "adminProUsers",
                JSON.stringify(initialUsers)
            );

            return initialUsers;
        }

        const parsedUsers = JSON.parse(savedUsers);

        if (!Array.isArray(parsedUsers)) {
            throw new Error("Invalid saved user data");
        }

        return parsedUsers;

    } catch (error) {

        console.error("Unable to load users:", error);

        // Recover with default users
        try {
            localStorage.setItem(
                "adminProUsers",
                JSON.stringify(defaultUsers)
            );
        } catch (storageError) {
            console.warn("Unable to restore default users:", storageError);
        }

        return [...defaultUsers];

    }

}
let users = loadUsers();


// Save users

function saveUsers() {

    localStorage.setItem(
        "adminProUsers",
        JSON.stringify(users)
    );

}


// Toast notification

function notifyUser(message) {

    const toastElement = document.getElementById("adminToast");

    document.getElementById("toastMessage").textContent = message;

    bootstrap.Toast.getOrCreateInstance(toastElement, {
        delay: 3000
    }).show();

}


// Status badge

function getStatusBadge(status) {

    const classes = {

        Active: "text-bg-success",

        Pending: "text-bg-warning",

        Inactive: "text-bg-danger"

    };

    return `
        <span class="badge ${classes[status] || "text-bg-secondary"}">
            ${status}
        </span>
    `;

}


// Escape user-provided text before inserting it into HTML.

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


// Safe avatar URL

function getAvatar(user) {

    const fallback = "https://i.pravatar.cc/100?img=1";

    try {

        const url = new URL(user.image || fallback);

        if (url.protocol === "https:" || url.protocol === "http:") {
            return escapeHTML(url.href);
        }

    } catch (error) {

        return fallback;

    }

    return fallback;

}


// Format registration date

function formatDate(date) {

    const parsedDate = new Date(date + "T00:00:00");

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

}


// Update summary cards

function updateSummary() {

    document.getElementById("totalCount").textContent =
        users.length;

    document.getElementById("activeCount").textContent =
        users.filter(user => user.status === "Active").length;

    document.getElementById("pendingCount").textContent =
        users.filter(user => user.status === "Pending").length;

    document.getElementById("inactiveCount").textContent =
        users.filter(user => user.status === "Inactive").length;

}


// Filter users

function getFilteredUsers() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    const selectedStatus = statusFilter.value;

    return users.filter(user => {

        const matchesSearch =
            user.name.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            user.status === selectedStatus;

        return matchesSearch && matchesStatus;

    });

}


// Render table

function renderUsers() {

    const filteredUsers = getFilteredUsers();

    const totalPages = Math.ceil(
        filteredUsers.length / USERS_PER_PAGE
    );

    // Keep current page valid after filtering/deleting.

    if (totalPages === 0) {
        currentPage = 1;
    } else {
        currentPage = Math.min(currentPage, totalPages);
    }

    const startIndex = (currentPage - 1) * USERS_PER_PAGE;

    const endIndex = startIndex + USERS_PER_PAGE;

    const visibleUsers = filteredUsers.slice(
        startIndex,
        endIndex
    );


    // Empty state

    if (visibleUsers.length === 0) {

        userTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">

                    <i class="bi bi-search fs-2 text-muted"></i>

                    <p class="mt-2 mb-0 text-muted">
                        No users found.
                    </p>

                </td>
            </tr>
        `;

    } else {

        userTableBody.innerHTML = visibleUsers.map(user => `

            <tr>

                <td>

                    <div class="d-flex align-items-center gap-2">

                        <img
                            src="${getAvatar(user)}"
                            alt=""
                            class="user-avatar"
                            loading="lazy"
                        >

                        <span class="fw-semibold">
                            ${escapeHTML(user.name)}
                        </span>

                    </div>

                </td>

                <td>
                    ${escapeHTML(user.email)}
                </td>

                <td>
                    <span class="role-badge">
                        ${escapeHTML(user.role)}
                    </span>
                </td>

                <td>
                    ${formatDate(user.date)}
                </td>

                <td>
                    ${getStatusBadge(user.status)}
                </td>

                <td>

                    <div class="d-flex justify-content-end gap-1">

                        <button
                            class="btn btn-sm btn-light text-primary"
                            data-action="edit"
                            data-id="${user.id}"
                            aria-label="Edit ${escapeHTML(user.name)}"
                            title="Edit user">

                            <i class="bi bi-pencil-square"></i>

                        </button>

                        <button
                            class="btn btn-sm btn-light text-danger"
                            data-action="delete"
                            data-id="${user.id}"
                            aria-label="Delete ${escapeHTML(user.name)}"
                            title="Delete user">

                            <i class="bi bi-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>

        `).join("");

    }


    // Pagination information

    const showingStart = filteredUsers.length === 0
        ? 0
        : startIndex + 1;

    const showingEnd = Math.min(
        endIndex,
        filteredUsers.length
    );

    paginationInfo.textContent =
        `Showing ${showingStart}-${showingEnd} of ${filteredUsers.length} users`;


    renderPagination(totalPages);

    updateSummary();

}


// Render pagination

function renderPagination(totalPages) {

    pagination.innerHTML = "";

    if (totalPages <= 1) return;


    // Previous

    pagination.innerHTML += `

        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">

            <button
                class="page-link"
                data-page="${currentPage - 1}"
                aria-label="Previous page"
                ${currentPage === 1 ? "disabled" : ""}>

                <i class="bi bi-chevron-left"></i>

            </button>

        </li>

    `;


    // Page numbers

    for (let page = 1; page <= totalPages; page++) {

        pagination.innerHTML += `

            <li class="page-item ${currentPage === page ? "active" : ""}">

                <button
                    class="page-link"
                    data-page="${page}"
                    aria-current="${currentPage === page ? "page" : "false"}">

                    ${page}

                </button>

            </li>

        `;

    }


    // Next

    pagination.innerHTML += `

        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">

            <button
                class="page-link"
                data-page="${currentPage + 1}"
                aria-label="Next page"
                ${currentPage === totalPages ? "disabled" : ""}>

                <i class="bi bi-chevron-right"></i>

            </button>

        </li>

    `;

}


// Search event

searchInput.addEventListener("input", () => {

    currentPage = 1;

    renderUsers();

});


// Filter event

statusFilter.addEventListener("change", () => {

    currentPage = 1;

    renderUsers();

});


// Pagination event delegation

pagination.addEventListener("click", event => {

    const button = event.target.closest("[data-page]");

    if (!button || button.disabled) return;

    currentPage = Number(button.dataset.page);

    renderUsers();

});


// Reset form

function resetUserForm() {

    userForm.reset();

    userForm.classList.remove("was-validated");

    document.getElementById("userId").value = "";

}


// Open Add User Modal

document.getElementById("addUserButton").addEventListener(
    "click",
    () => {

        resetUserForm();

        document.getElementById("userModalTitle").textContent =
            "Add New User";

        document.getElementById("saveUserButton").textContent =
            "Add User";

        userModal.show();

    }
);


// Edit user

function editUser(id) {

    const user = users.find(item => item.id === id);

    if (!user) return;

    resetUserForm();

    document.getElementById("userId").value = user.id;

    document.getElementById("userName").value = user.name;

    document.getElementById("userEmail").value = user.email;

    document.getElementById("userRole").value = user.role;

    document.getElementById("userStatus").value = user.status;

    document.getElementById("userImage").value = user.image || "";

    document.getElementById("userModalTitle").textContent =
        "Edit User";

    document.getElementById("saveUserButton").textContent =
        "Update User";

    userModal.show();

}


// Delete user

function prepareDelete(id) {

    const user = users.find(item => item.id === id);

    if (!user) return;

    deleteUserId = id;

    deleteModal.show();

}


// Table action delegation

userTableBody.addEventListener("click", event => {

    const button = event.target.closest("[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.dataset.action === "edit") {

        editUser(id);

    }

    if (button.dataset.action === "delete") {

        prepareDelete(id);

    }

});


// Add / Update User Form

userForm.addEventListener("submit", event => {

    event.preventDefault();

    event.stopPropagation();

    userForm.classList.add("was-validated");

    if (!userForm.checkValidity()) return;


    const idValue = document.getElementById("userId").value;

    const name = document.getElementById("userName").value.trim();

    const email = document.getElementById("userEmail").value.trim();

    const role = document.getElementById("userRole").value;

    const status = document.getElementById("userStatus").value;

    const image = document.getElementById("userImage").value.trim();


    // Validate URL if supplied

    if (image) {

        try {

            const imageURL = new URL(image);

            if (!["http:", "https:"].includes(imageURL.protocol)) {
                throw new Error("Invalid image URL");
            }

        } catch {

            const imageInput = document.getElementById("userImage");

            imageInput.setCustomValidity("Please enter a valid HTTP or HTTPS image URL.");

            imageInput.reportValidity();

            return;

        }

    }


    // Duplicate email validation

    const duplicateEmail = users.some(user => {

        return user.email.toLowerCase() === email.toLowerCase() &&
            user.id !== Number(idValue);

    });

    if (duplicateEmail) {

        const emailInput = document.getElementById("userEmail");

        emailInput.setCustomValidity("This email is already registered.");

        emailInput.reportValidity();

        return;

    }


    // Save new or edited user

    if (idValue) {

        const index = users.findIndex(
            user => user.id === Number(idValue)
        );

        if (index === -1) return;

        users[index] = {

            ...users[index],

            name,
            email,
            role,
            status,
            image

        };

        notifyUser("User updated successfully.");

    } else {

        const newUser = {

            id: Date.now(),

            name,
            email,
            role,
            status,

            date: new Date().toISOString().slice(0, 10),

            image: image || "https://i.pravatar.cc/100?img=1"

        };

        users.unshift(newUser);

        notifyUser("New user added successfully.");

    }


    saveUsers();

    currentPage = 1;

    renderUsers();

    userModal.hide();

    resetUserForm();

});


// Clear custom email validation when changed

document.getElementById("userEmail").addEventListener(
    "input",
    event => {

        event.target.setCustomValidity("");

    }
);


// Clear custom URL validation when changed

document.getElementById("userImage").addEventListener(
    "input",
    event => {

        event.target.setCustomValidity("");

    }
);


// Confirm delete

document.getElementById("confirmDeleteButton").addEventListener(
    "click",
    () => {

        if (deleteUserId === null) return;

        users = users.filter(user => user.id !== deleteUserId);

        saveUsers();

        deleteUserId = null;

        renderUsers();

        deleteModal.hide();

        notifyUser("User deleted successfully.");

    }
);


// Clear deletion state when modal closes

deleteModalElement.addEventListener("hidden.bs.modal", () => {

    deleteUserId = null;

});


// INITIALIZE

renderUsers();