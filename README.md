# AdminPro – Bootstrap 5 Admin Management Portal

A modern, responsive admin dashboard built with **HTML5, CSS3, Bootstrap 5, and JavaScript**. AdminPro provides a clean interface for managing users, monitoring dashboard statistics, registering new members, and configuring workspace settings.

## Overview

AdminPro is a frontend admin management portal designed to demonstrate responsive dashboard development, Bootstrap components, form validation, JavaScript interactivity, and browser-based data persistence.

## Features

### Dashboard
- Overview of total, active, pending, and inactive users.
- Dynamic statistics and progress indicators.
- Recent activity section.
- Responsive dashboard cards.
- FAQ accordion.

### User Management
- Display user records in a responsive table.
- Add, edit, and delete users.
- Search users by name or email.
- Filter users by status.
- Pagination for user records.
- Dynamic user statistics.

### User Registration
- Registration form with required fields.
- Name, email, phone, gender, and department inputs.
- Password and confirm-password validation.
- Password visibility toggle.
- Profile image preview and file validation.
- Terms and conditions checkbox.
- Duplicate email validation.

### Settings
- Profile information management.
- Account preferences.
- Password validation interface.
- Notification preferences.
- Bootstrap tab navigation.
- Browser-based settings persistence.

### UI and Responsiveness
- Responsive desktop sidebar.
- Collapsible desktop navigation.
- Mobile offcanvas navigation.
- Light and dark themes.
- Bootstrap dropdowns, modals, toasts, and accordions.
- Responsive layouts for desktop, tablets, and mobile devices.

## Technologies Used

| Technology | Purpose |
| HTML5 | Page structure |
| CSS3 | Custom styling |
| Bootstrap 5.3.8 | Responsive layout and components |
| Bootstrap Icons | Interface icons |
| JavaScript | Interactivity and application logic |
| LocalStorage | Browser-based data persistence |

## Project Structure

day-17-adminpro/
│
├── index.html
├── users.html
├── register.html
├── settings.html
│
├── css/
│   ├── style.css
│   └── responsive.css
│
└── js/
    ├── app.js
    ├── dashboard.js
    ├── users.js
    ├── registration.js
    └── settings.js

## Getting Started

### 1. Clone the repository

git clone https://github.com/....

### 2. Open the project

cd day-17-adminpro

### 3. Run the application

Open index.html in your browser.

For a better development experience, use the Live Server extension in Visual Studio Code.

No backend installation or build process is required.

## Data Storage

AdminPro uses browser LocalStorage to maintain demo data, including:

- User records
- Profile information
- Account preferences
- Notification preferences
- Theme preferences
- Sidebar state

Data is stored locally in the browser and is not synchronized between users or devices.

Security note: This is a frontend demonstration project. It does not provide production authentication or secure server-side password management. Do not use real passwords or sensitive personal information.

## Screenshots

Add your project screenshots to a screenshots/ folder and display them here.

Suggested screenshots:

- Dashboard
- User Management
- User Registration
- Settings
- Dark Theme
- Mobile Responsive Layout

## Learning Outcomes

Through this project, I practiced:

- Bootstrap 5 grid system and responsive breakpoints.
- Bootstrap components and JavaScript interactions.
- CSS customization and dark theme implementation.
- JavaScript DOM manipulation and event handling.
- Client-side form validation.
- CRUD operations using LocalStorage.
- Responsive admin dashboard development.
- Accessibility and user interface improvements.

Author

Tehreem Ijaz

Developed as part of my frontend development internship – Day 17: Bootstrap 5 Admin Management Portal.
