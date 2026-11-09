
document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------
    // 1. Theme toggle
    // ---------------------------------

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    function applyTheme(theme) {

        document.documentElement.setAttribute(
            "data-bs-theme",
            theme
        );

        if (themeIcon) {
            themeIcon.className = theme === "dark"
                ? "bi bi-sun"
                : "bi bi-moon-stars";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }

        try {
            localStorage.setItem("adminProTheme", theme);
        } catch (error) {
            console.warn("Unable to save theme preference:", error);
        }
    }

    let savedTheme = "light";

    try {
        const storedTheme = localStorage.getItem("adminProTheme");

savedTheme = storedTheme === "dark" ? "dark" : "light";
    } catch (error) {
        console.warn("Unable to read theme preference:", error);
    }

    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {

            const currentTheme =
                document.documentElement.getAttribute("data-bs-theme");

            applyTheme(
                currentTheme === "dark" ? "light" : "dark"
            );

        });
    }
// ---------------------------------
// 2. Desktop sidebar collapse
// ---------------------------------

const desktopSidebar = document.getElementById("desktopSidebar");
const sidebarCollapseBtn = document.getElementById("sidebarCollapseBtn");

function updateSidebarButton(isCollapsed) {
    if (!sidebarCollapseBtn) return;

    sidebarCollapseBtn.setAttribute(
        "aria-expanded",
        String(!isCollapsed)
    );

    sidebarCollapseBtn.setAttribute(
        "aria-label",
        isCollapsed ? "Expand sidebar" : "Collapse sidebar"
    );

    sidebarCollapseBtn.setAttribute(
        "title",
        isCollapsed ? "Expand sidebar" : "Collapse sidebar"
    );
}

if (desktopSidebar && sidebarCollapseBtn) {

    let savedSidebarState = "false";

    try {
        savedSidebarState =
            localStorage.getItem("adminProSidebarCollapsed") || "false";
    } catch (error) {
        console.warn("Unable to read sidebar preference:", error);
    }

    const isMobile = window.innerWidth < 992;
    const shouldCollapse = savedSidebarState === "true" && !isMobile;

    desktopSidebar.classList.toggle("collapsed", shouldCollapse);
    updateSidebarButton(shouldCollapse);

    sidebarCollapseBtn.addEventListener("click", () => {

        if (window.innerWidth < 992) return;

        desktopSidebar.classList.toggle("collapsed");

        const isCollapsed =
            desktopSidebar.classList.contains("collapsed");

        try {
            localStorage.setItem(
                "adminProSidebarCollapsed",
                String(isCollapsed)
            );
        } catch (error) {
            console.warn("Unable to save sidebar preference:", error);
        }

        updateSidebarButton(isCollapsed);
    });
}
    // ---------------------------------
    // 3. Bootstrap tooltips
    // ---------------------------------

    document.querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach(element => {

            bootstrap.Tooltip.getOrCreateInstance(element);

        });


    // ---------------------------------
    // 4. Bootstrap popovers
    // ---------------------------------

    document.querySelectorAll('[data-bs-toggle="popover"]')
        .forEach(element => {

            bootstrap.Popover.getOrCreateInstance(element);

        });


    // ---------------------------------
    // 5. Reusable toast function
    // ---------------------------------

    window.showToast = function(message, type = "success") {

        const toastElement =
            document.getElementById("adminToast") ||
            document.getElementById("appToast");

        if (!toastElement) {
            console.log(message);
            return;
        }

        const messageElement =
            toastElement.querySelector("#toastMessage") ||
            toastElement.querySelector(".toast-body");

        if (messageElement) {
            messageElement.textContent = message;
        }

        const icon = toastElement.querySelector(".toast-header i");

        if (icon) {

            if (type === "success") {
                icon.className =
                    "bi bi-check-circle-fill text-success me-2";
            } else if (type === "error") {
                icon.className =
                    "bi bi-x-circle-fill text-danger me-2";
            } else {
                icon.className =
                    "bi bi-info-circle-fill text-primary me-2";
            }
        }

        bootstrap.Toast.getOrCreateInstance(toastElement, {
            delay: 3500
        }).show();

    };


    // ---------------------------------
    // 6. Notification dropdown
    // ---------------------------------

    const notificationItems =
        document.querySelectorAll(".notification-item");

    notificationItems.forEach(item => {

        item.addEventListener("click", () => {

            item.classList.remove("unread");

            updateNotificationIndicator();

        });

    });

    function updateNotificationIndicator() {

        const unreadCount =
            document.querySelectorAll(
                ".notification-item.unread"
            ).length;

        const notificationDot =
            document.querySelector(".notification-dot");

        if (notificationDot) {

            notificationDot.style.display =
                unreadCount > 0 ? "block" : "none";

        }

    }

    const markAllRead =
        document.getElementById("markAllRead");

    if (markAllRead) {

        markAllRead.addEventListener("click", event => {

            event.stopPropagation();

            document.querySelectorAll(".notification-item.unread")
                .forEach(item => {
                    item.classList.remove("unread");
                });

            updateNotificationIndicator();

            window.showToast("All notifications marked as read.");

        });

    }

    updateNotificationIndicator();


    // ---------------------------------
    // 7. Logout demo
    // ---------------------------------

    document.querySelectorAll(".logout-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                window.showToast(
                    "Logout is a demo action.",
                    "info"
                );

            });

        });


    // ---------------------------------
    // 8. Close mobile sidebar after navigation
    // ---------------------------------

    document.querySelectorAll("#mobileSidebar .sidebar-link")
        .forEach(link => {

            link.addEventListener("click", () => {

                const offcanvasElement =
                    document.getElementById("mobileSidebar");

                if (!offcanvasElement) return;

                const offcanvas =
                    bootstrap.Offcanvas.getInstance(offcanvasElement);

                offcanvas?.hide();

            });

        });


    // ---------------------------------
    // 9. Confirmation modal
    // ---------------------------------

    const confirmButton =
        document.getElementById("confirmActionButton");

    if (confirmButton) {

        confirmButton.addEventListener("click", () => {

            const modalElement =
                document.getElementById("confirmationModal");

            if (!modalElement) return;

            const modal =
                bootstrap.Modal.getInstance(modalElement);

            modal?.hide();

            window.showToast(
                "Action confirmed successfully."
            );

        });

    }


    // ---------------------------------
    // 10. Current year
    // ---------------------------------

    document.querySelectorAll(".current-year")
        .forEach(element => {

            element.textContent = new Date().getFullYear();

        });


    // ---------------------------------
    // 11. Initial notification
    // ---------------------------------

    console.log("AdminPro application initialized successfully.");

});
