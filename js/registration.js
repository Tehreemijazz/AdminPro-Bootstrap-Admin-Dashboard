document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");

    if (!form) return;

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const gender = document.getElementById("gender");
    const department = document.getElementById("department");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");

    const profileImage = document.getElementById("profileImage");
    const imagePreview = document.getElementById("imagePreview");
    const imageError = document.getElementById("imageError");

    const defaultImage =
        "https://placehold.co/120x120/e9eaf0/777?text=Photo";

    let selectedImage = "";

    // Read existing users from localStorage
    function getUsers() {
        try {
            const users = JSON.parse(localStorage.getItem("adminProUsers"));
            return Array.isArray(users) ? users : [];
        } catch {
            return [];
        }
    }

    // Toast notification
    function notify(message, type = "success") {
        const toastElement = document.getElementById("appToast");
        const toastMessage = document.getElementById("toastMessage");
        const toastTitle = document.getElementById("toastTitle");

        if (!toastElement || !window.bootstrap) {
            alert(message);
            return;
        }

        toastMessage.textContent = message;
        toastTitle.textContent =
            type === "success" ? "Success" : "Notice";

        const icon = toastElement.querySelector(".toast-header i");
        icon.className = type === "success"
            ? "bi bi-check-circle-fill text-success me-2"
            : "bi bi-exclamation-circle-fill text-danger me-2";

        bootstrap.Toast.getOrCreateInstance(toastElement).show();
    }

    // Password validation
    function validatePassword() {
        const value = password.value;
        const strongPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

        if (!strongPassword.test(value)) {
            password.setCustomValidity("Invalid password");
        } else {
            password.setCustomValidity("");
        }

        password.classList.toggle("is-invalid", !password.checkValidity());
        password.classList.toggle(
            "is-valid",
            password.checkValidity() && value.length > 0
        );

        validateConfirmPassword();
    }

    // Confirm password validation
    function validateConfirmPassword() {
        const matches = confirmPassword.value === password.value &&
                        confirmPassword.value.length > 0;

        confirmPassword.setCustomValidity(matches ? "" : "Passwords do not match");

        confirmPassword.classList.toggle(
            "is-invalid",
            confirmPassword.value.length > 0 && !matches
        );

        confirmPassword.classList.toggle("is-valid", matches);
    }

    password.addEventListener("input", validatePassword);
    confirmPassword.addEventListener("input", validateConfirmPassword);

    email.addEventListener("input", () => {
    email.setCustomValidity("");

    const feedback = email.parentElement.querySelector(".invalid-feedback");

    if (feedback) {
        feedback.textContent = "Please enter a valid email address.";
    }

    email.classList.remove("is-invalid");
});
    // Show/hide password
    document.querySelectorAll(".password-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const target = document.getElementById(button.dataset.target);
            const icon = button.querySelector("i");

            const showPassword = target.type === "password";
            target.type = showPassword ? "text" : "password";

            icon.classList.toggle("bi-eye", !showPassword);
            icon.classList.toggle("bi-eye-slash", showPassword);

            button.setAttribute(
                "aria-label",
                showPassword ? "Hide password" : "Show password"
            );
        });
    });

    // Profile image preview
    profileImage.addEventListener("change", () => {
        const file = profileImage.files[0];

        imageError.textContent = "";
        selectedImage = "";

        if (!file) {
            imagePreview.src = defaultImage;
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            profileImage.value = "";
            imagePreview.src = defaultImage;
            imageError.textContent = "Please select a JPG, PNG, or WEBP image.";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            profileImage.value = "";
            imagePreview.src = defaultImage;
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

    // Validate fields when the user leaves them
    [fullName, email, phone, gender, department, terms].forEach(field => {
        field.addEventListener("change", () => {
            field.classList.toggle("is-invalid", !field.checkValidity());
            field.classList.toggle("is-valid", field.checkValidity());
        });
    });

    // Reset form and custom validation states
    form.addEventListener("reset", () => {
        setTimeout(() => {
            form.querySelectorAll(".is-valid, .is-invalid").forEach(field => {
                field.classList.remove("is-valid", "is-invalid");
            });

            password.setCustomValidity("");
            confirmPassword.setCustomValidity("");

            selectedImage = "";
            imagePreview.src = defaultImage;
            imageError.textContent = "";
        }, 0);
    });

    // Submit registration form
    form.addEventListener("submit", event => {
        event.preventDefault();

        validatePassword();
        validateConfirmPassword();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            form.reportValidity();
            return;
        }

        const users = getUsers();

        // Prevent duplicate email addresses
        const emailExists = users.some(user =>
            user.email?.toLowerCase() === email.value.trim().toLowerCase()
        );

        if (emailExists) {
            email.setCustomValidity("Email already exists");
            email.classList.add("is-invalid");

            const feedback = email.parentElement.querySelector(".invalid-feedback");
            if (feedback) {
                feedback.textContent = "This email is already registered.";
            }

            email.focus();
            return;
        }

        email.setCustomValidity("");

        const newUser = {
            id: Date.now(),
            name: fullName.value.trim(),
            email: email.value.trim().toLowerCase(),
            phone: phone.value.trim(),
            gender: gender.value,
            department: department.value,
            password: password.value,
            role: "User",
            status: "Active",
            image: selectedImage,
            date: new Date().toISOString().slice(0, 10)
        };

        users.push(newUser);

        try {
            localStorage.setItem("adminProUsers", JSON.stringify(users));
        } catch (error) {
            notify("Unable to save user. The browser storage may be full.", "error");
            console.error("Registration storage error:", error);
            return;
        }

        notify("User registered successfully!");

        form.reset();
        form.classList.remove("was-validated");

        // Return to user management after a short delay
        setTimeout(() => {
            window.location.href = "users.html";
        }, 1200);
    });
});