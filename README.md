# CSTD Admin Dashboard Frontend

A robust and intuitive React-based Content Management System (CMS) frontend, empowering authorized personnel—Webmasters, Administrators, and Media Managers—to efficiently control and publish website content, manage user access, oversee projects, publish news, and coordinate events. Seamlessly built with modern web technologies, this application provides a dynamic and responsive user experience for comprehensive website administration.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone git@github.com:Damiieibikun/CSTD-frontend-ui.git
    cd CSTD-frontend-ui
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of the project and add the following variable:

-   `REACT_APP_ENDPOINT`: The base URL of your backend API server.
    *   Example: `REACT_APP_ENDPOINT=http://localhost:5000/api/v1`

### Running the Application

1.  **Start the Development Server**:
    ```bash
    npm start
    ```
    This will run the app in development mode.\
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

2.  **Build for Production**:
    ```bash
    npm run build
    ```
    Builds the app for production to the `build` folder.\
    It correctly bundles React in production mode and optimizes the build for the best performance.

## 📖 Usage

Upon launching the application, you will be directed to the login page (`/`). After successful authentication, users are redirected to their respective dashboards based on their assigned roles: Webmaster, Admin, or Media.

### Login

Access the application via the root path (`/`) and provide your credentials.

### Role-Based Dashboards

The application features distinct dashboards tailored to different administrative roles:

-   **Webmaster Dashboard (`/dashboardwebmaster`)**:
    *   **User Management**: Approve, deny, or remove other admin users.
    *   **Navigation & Footer**: Configure website navigation links and footer content.
    *   **Page Management**: Create, update, and delete dynamic pages and their sections.
    *   **Content Management**: Oversee all projects (upcoming and past), academic publications, news articles, and events.
    *   **Feedback**: Review client feedback.

-   **Admin Dashboard (`/dashboardadmin`)**:
    *   **Content Management**: Manage projects (upcoming and past), academic publications, and non-media-specific dynamic page content.
    *   **Change Password**: Update personal password.

-   **Media Dashboard (`/dashboardmedia`)**:
    *   **News Management**: Create, edit, and publish news articles, including image and video media uploads.
    *   **Event Management**: Schedule, modify, and promote events with flyers.
    *   **Media Gallery**: Browse and manage uploaded images and videos.
    *   **Change Password**: Update personal password.

Each dashboard provides an intuitive interface for content creation, editing, and organization, leveraging a rich text editor and robust form validation.

## ✨ Features

*   **Role-Based Authentication & Authorization**: Secure access control for Webmaster, Admin, and Media roles.
*   **Admin User Management**: Comprehensive tools for Webmasters to approve, deny, and remove administrator accounts.
*   **Dynamic Page Content Management**: Create, update, and delete custom page sections with flexible content types including text and images.
*   **Intuitive Navigation & Footer Configuration**: Easily manage website navigation links and customize footer content, including social media links and copyright information.
*   **Comprehensive Project Management**: Organize and display both upcoming and past projects with detailed objectives, importance, technologies used, partners, and outputs.
*   **Academic Publication Repository**: Maintain a structured list of research papers and publications with titles, summaries, authors, links, and dates.
*   **Event Scheduling & Promotion**: Create and manage events, including dates, times, locations, descriptions, and flyer uploads.
*   **News Article Management**: Publish and edit news articles with titles, brief summaries, rich content, and integrated media (images/videos).
*   **Client Feedback System**: A dedicated section to review and manage incoming feedback messages.
*   **Responsive User Interface**: Built with Tailwind CSS for a seamless experience across various devices.
*   **Rich Text Editing**: Powered by `react-quilljs` for advanced content creation.
*   **Robust Form Validation**: Implemented using `Zod` and `React Hook Form` to ensure data integrity.

## 🛠️ Technologies Used

| Technology             | Description                                   |
| :--------------------- | :-------------------------------------------- |
| **React.js**           | Frontend JavaScript library                   |
| **React Router DOM**   | Declarative routing for React                 |
| **Tailwind CSS**       | Utility-first CSS framework                   |
| **Axios**              | Promise-based HTTP client for the browser     |
| **React Hook Form**    | Performant, flexible, and extensible forms    |
| **Zod**                | TypeScript-first schema declaration and validation library |
| **react-quilljs**      | React component for Quill.js rich text editor |
| **React Icons**        | Customizable SVG React icons                  |
| **dotenv**             | Loads environment variables from a `.env` file |

## 📄 License

This project is currently unlicensed and proprietary.

## ✍️ Author Info

**[Your Name Here]**

-   LinkedIn: [Your LinkedIn Profile]
-   Portfolio: [Your Portfolio URL]
-   Email: [Your Email Address]

---

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Validated with Zod](https://img.shields.io/badge/Validated%20with-Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)](https://zod.dev/)
[![Form Handling with React Hook Form](https://img.shields.io/badge/Forms%20with-React%20Hook%20Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white)](https://react-hook-form.com/)
[![API Client Axios](https://img.shields.io/badge/API%20Client-Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)](https://axios-http.com/)
[![Rich Text Editor Quill.js](https://img.shields.io/badge/Editor-Quill.js-006400?style=flat-square&logo=quill&logoColor=white)](https://quilljs.com/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)