
document.addEventListener("DOMContentLoaded", () => {

    // Current date
    const dateElement = document.getElementById("currentDate");

    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    // Safely get users from localStorage
    function getUsers() {
        try {
            const users = JSON.parse(
                localStorage.getItem("adminProUsers")
            );

            return Array.isArray(users) ? users : [];
        } catch (error) {
            console.error("Unable to load users:", error);
            return [];
        }
    }

    // Update statistics
    function updateStatistics() {

        const users = getUsers();

        const total = users.length;

        const active = users.filter(
            user => user.status === "Active"
        ).length;

        const pending = users.filter(
            user => user.status === "Pending"
        ).length;

        const inactive = users.filter(
            user => user.status === "Inactive"
        ).length;

        const statistics = {
            totalUsers: total,
            activeUsers: active,
            pendingUsers: pending,
            inactiveUsers: inactive
        };

        Object.entries(statistics).forEach(([id, value]) => {
            const element = document.getElementById(id);

            if (element) {
                element.textContent = value.toLocaleString();
            }
        });

        // Calculate percentages
        const getPercentage = value => {
            return total === 0
                ? 0
                : Number(((value / total) * 100).toFixed(1));
        };

        updateProgress(
            "active",
            getPercentage(active)
        );

        updateProgress(
            "pending",
            getPercentage(pending)
        );

        updateProgress(
            "inactive",
            getPercentage(inactive)
        );
    }

    // Update progress bars
    function updateProgress(type, percentage) {

        const bar = document.getElementById(
            `${type}ProgressBar`
        );

        const progress = document.getElementById(
            `${type}Progress`
        );

        const label = document.getElementById(
            `${type}Percentage`
        );

        if (bar) {
            bar.style.width = `${percentage}%`;
        }

        if (progress) {
            progress.setAttribute("aria-valuenow", percentage);
        }

        if (label) {
            label.textContent = `${percentage}%`;
        }
    }

    updateStatistics();

    // View activities demo
    const activitiesButton = document.getElementById(
        "viewActivitiesButton"
    );

    if (activitiesButton) {
        activitiesButton.addEventListener("click", () => {
            window.showToast?.(
                "Activity history feature is coming soon.",
                "info"
            );
        });
    }

});
