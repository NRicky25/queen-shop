# Queen Shop E-commerce Platform

## Project Overview

**Queen Shop** is a full-stack e-commerce application designed to provide a seamless online shopping experience. This project demonstrates robust backend development, a dynamic frontend, secure payment processing, and scalable cloud deployment. It showcases a complete e-commerce workflow from product Browse to order fulfillment.

## Key Features

- **User Authentication:** Secure user registration, login, and session management.
- **Product Catalog:** Browse products by categories, search functionality, and detailed product pages.
- **Shopping Cart:** Add, update, and remove items from the cart.
- **Secure Checkout:** Integrated **Stripe** for secure and efficient payment processing.
- **Order Management:** Users can view their order history and order details.
- **Image Management:** Utilizes **Cloudinary** for efficient and scalable product image hosting and delivery.
- **Responsive Design:** Ensures optimal viewing and interaction across various devices (desktops, tablets, smartphones).
- **Admin Panel (Optional - confirm if implemented):** Functionality for managing products, orders, and users.

## Technologies Used

- **Frontend:**
  - **React.js:** JavaScript library for building user interfaces.
  - **Redux:** State management for predictable application state.
  - **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
  - **Vite:** Next-generation frontend tooling for fast development.
  - **HTML5, CSS3:** For structuring and styling.
- **Backend:**
  - **Node.js:** JavaScript runtime environment.
  - **Express.js:** Web application framework for Node.js APIs.
  - **RESTful APIs:** Designed for efficient communication between frontend and backend.
- **Database:**
  - **MongoDB:** NoSQL database for flexible data storage.
- **Payment Processing:**
  - **Stripe:** For secure credit card transactions.
- **Image Storage:**
  - **Cloudinary:** Cloud-based image and video management.
- **Deployment:**
  - **AWS EC2:** Virtual servers for hosting the application.
  - **AWS S3:** (Confirm if used for other assets beyond Cloudinary)
  - **AWS Route 53:** (Confirm if used for domain management)
- **Version Control:**
  - **Git & GitHub**

## Setup and Running the Application

### Prerequisites

- **Node.js** (LTS version recommended)
- **npm** (Node Package Manager) or **Yarn**
- **MongoDB Atlas URI** (or a local MongoDB instance running)
- **Stripe Account** (for API keys)
- **Cloudinary Account** (for API keys)

### Environment Variables

Create a `.env` file in the `server/` directory and populate it with your credentials:
