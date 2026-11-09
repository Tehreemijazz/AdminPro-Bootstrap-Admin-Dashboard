document.addEventListener("DOMContentLoaded", () => {

    // Storage helpers
    function readStorage(key, fallback = {}) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value && typeof value === "object" ? value : fallback;
        } catch {
            return fallback;
        }
    }

    function saveStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Storage error:", error);
            showToast("Unable to save settings. Browser storage may be full.", "error");
            return false;
        }
    }

    // Toast notification
    function showToast(message, type = "success") {
        const toastElement = document.getElementById("appToast");

        document.getElementById("toastTitle").textContent =
            type === "success" ? "Success" : "Error";

        document.getElementById("toastMessage").textContent = message;

        const icon = toastElement.querySelector(".toast-header i");

        icon.className = type === "success"
            ? "bi bi-check-circle-fill text-success me-2"
            : "bi bi-exclamation-circle-fill text-danger me-2";

        bootstrap.Toast.getOrCreateInstance(toastElement).show();
    }

    // Profile elements
    const profileForm = document.getElementById("profileForm");
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhone = document.getElementById("profilePhone");
    const profileLocation = document.getElementById("profileLocation");

    const settingsImage = document.getElementById("settingsImage");
    const imagePreview = document.getElementById("settingsImagePreview");
    const imageError = document.getElementById("settingsImageError");

    const defaultImage =
        "https://placehold.co/100x100/e9eaf0/777?text=Admin";

    let selectedImage = "";

    // Load profile
    const savedProfile = readStorage("adminProProfile", {
        name: "Admin User",
        email: "admin@example.com",
        phone: "",
        location: "",
        image: ""
    });

    profileName.value = savedProfile.name || "";
    profileEmail.value = savedProfile.email || "";
    profilePhone.value = savedProfile.phone || "";
    profileLocation.value = savedProfile.location || "";

    if (savedProfile.image) {
        imagePreview.src = savedProfile.image;
        selectedImage = savedProfile.image;
    }

    // Profile image preview
    settingsImage.addEventListener("change", () => {
        const file = settingsImage.files[0];

        imageError.textContent = "";
        selectedImage = savedProfile.image || "";
        settingsImage.setCustomValidity("");

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            settingsImage.value = "";
            imageError.textContent = "Select a JPG, PNG, or WEBP image.";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            settingsImage.value = "";
            imageError.textContent = "Image size must be less than 2 MB.";
            return;
        }

        const reader = new FileReader();

        reader.onload = event => {
            selectedImage = event.target.result;
            imagePreview.src = selectedImage;
        };

        reader.readAsDataURL(file);
    });

    // Save profile
    profileForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!profileForm.checkValidity()) {
            profileForm.classList.add("was-validated");
            profileForm.reportValidity();
            return;
        }

        const profile = {
            name: profileName.value.trim(),
            email: profileEmail.value.trim(),
            phone: profilePhone.value.trim(),
            location: profileLocation.value.trim(),
            image: selectedImage
        };

        if (saveStorage("adminProProfile", profile)) {
            showToast("Profile information saved successfully.");
            profileForm.classList.remove("was-validated");
        }
    });

    // Account preferences
    const accountForm = document.getElementById("accountForm");

    const accountFields = [
        "accountDepartment",
        "language",
        "timezone"
    ];

    const savedAccount = readStorage("adminProAccount", {
        accountDepartment: "Development",
        language: "English",
        timezone: "Asia/Karachi"
    });

    accountFields.forEach(id => {
        const field = document.getElementById(id);
        field.value = savedAccount[id] || field.value;
    });

    accountForm.addEventListener("submit", event => {
        event.preventDefault();

        const account = {};

        accountFields.forEach(id => {
            account[id] = document.getElementById(id).value;
        });

        if (saveStorage("adminProAccount", account)) {
            showToast("Account preferences saved.");
        }
    });

    // Password validation
    const passwordForm = document.getElementById("passwordForm");

    const currentPassword = document.getElementById("currentPassword");
    const newPassword = document.getElementById("newPassword");
    const confirmNewPassword = document.getElementById("confirmNewPassword");

    function validateNewPassword() {
        const valid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPassword.value);

        newPassword.setCustomValidity(valid ? "" : "Invalid password");

        newPassword.classList.toggle("is-invalid", !valid);
        newPassword.classList.toggle("is-valid", valid);

        validatePasswordMatch();
    }

    function validatePasswordMatch() {
        const matches =
            confirmNewPassword.value.length > 0 &&
            confirmNewPassword.value === newPassword.value;

        confirmNewPassword.setCustomValidity(
            matches ? "" : "Passwords do not match"
        );

        confirmNewPassword.classList.toggle(
            "is-invalid",
            confirmNewPassword.value.length > 0 && !matches
        );

        confirmNewPassword.classList.toggle("is-valid", matches);
    }

    newPassword.addEventListener("input", validateNewPassword);
    confirmNewPassword.addEventListener("input", validatePasswordMatch);

    passwordForm.addEventListener("submit", event => {
        event.preventDefault();

        validateNewPassword();
        validatePasswordMatch();

        if (!passwordForm.checkValidity()) {
            passwordForm.classList.add("was-validated");
            passwordForm.reportValidity();
            return;
        }

        if (currentPassword.value === newPassword.value) {
            showToast("Your new password must be different.", "error");
            return;
        }

        // Demo only: do not store or verify real passwords in browser storage.
        showToast(
            "Password validation passed. Connect a secure backend to change it."
        );

        passwordForm.reset();
        passwordForm.classList.remove("was-validated");

        [newPassword, confirmNewPassword].forEach(field => {
            field.classList.remove("is-valid", "is-invalid");
            field.setCustomValidity("");
        });
    });

    // Notification preferences
    const notificationForm = document.getElementById("notificationForm");

    const notificationIds = [
        "emailNotifications",
        "systemNotifications",
        "activityNotifications",
        "weeklyReports"
    ];

    const savedNotifications = readStorage("adminProNotifications", {
        emailNotifications: true,
        systemNotifications: true,
        activityNotifications: false,
        weeklyReports: true
    });

    notificationIds.forEach(id => {
        document.getElementById(id).checked =
            savedNotifications[id] === true;
    });

    notificationForm.addEventListener("submit", event => {
        event.preventDefault();

        const preferences = {};

        notificationIds.forEach(id => {
            preferences[id] = document.getElementById(id).checked;
        });

        if (saveStorage("adminProNotifications", preferences)) {
            showToast("Notification preferences saved.");
        }
    });

});