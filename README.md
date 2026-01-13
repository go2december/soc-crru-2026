# 🏛️ Faculty of Social Sciences, Chiang Rai Rajabhat University (SOC-CRRU)

Welcome to the official web application repository for the Faculty of Social Sciences, Chiang Rai Rajabhat University. This platform is designed to serve students, staff, and the general public with modern, responsive, and user-centric features.

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10.0-E0234E?style=flat-square&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-336791?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)

## 🌟 Project Overview

The **SOC-CRRU Web Application** is a comprehensive platform built to support the faculty's educational mission: **"Siam Innovator & Lifelong Learning"**. It consolidates academic information, student services, and organizational transparency into a single, seamless digital experience.

### Key Features
*   **🎨 Modern Design System**: Built with Tailwind CSS v4 and DaisyUI, featuring the "Scholar" theme (Gold/Deep Blue).
*   **📚 Academic Programs**: Detailed information on Bachelor's, Master's, and Doctoral degrees.
*   **🏢 Organization Info**:
    *   **Strategic Plan**: Interactive strategic map and detailed implementation plans.
    *   **Organizational Structure**: Visual hierarchy of the faculty's administration.
    *   **Staff Directory**: Searchable database of faculty members and staff.
*   **🛠️ E-Service Portal**: Centralized access to student and staff digital services.
*   **📱 Responsive & Accessible**: Fully optimized for mobile, tablet, and desktop devices.

## 🛠️ Technology Stack

This project utilizes a modern Full-Stack Dockerized environment:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15+** | React Framework with App Router & Server Components |
| **Styling** | **Tailwind CSS v4** | Utility-first CSS framework |
| **UI Library** | **DaisyUI 5** | Component library for Tailwind |
| **Backend** | **NestJS** | Progressive Node.js framework for scalable server-side apps |
| **Database** | **PostgreSQL 18** | Powerful, open source object-relational database system |
| **DevOps** | **Docker Compose** | Container orchestration for unified development environment |

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
*   A Git client.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/go2december/soc-crru-2026.git
    cd soc-crru-2026
    ```

2.  **Start the environment**
    Run the following command to build and start all services (Frontend, Backend, DB, pgAdmin):
    ```bash
    docker compose up -d
    ```

3.  **Access the application**
    *   **Frontend**: [http://localhost:3000](http://localhost:3000)
    *   **Backend API**: [http://localhost:3001](http://localhost:3001)
    *   **pgAdmin**: [http://localhost:5050](http://localhost:5050)
        *   *Email*: `admin@soc.crru.ac.th`
        *   *Password*: `admin`

## 📂 Project Structure

```
soc-crru-web/
├── frontend/             # Next.js Application
│   ├── app/              # App Router Pages
│   ├── components/       # Reusable UI Components
│   └── public/           # Static Assets
├── backend/              # NestJS Application
│   ├── src/              # API Source Code
│   └── test/             # E2E Tests
├── database/             # Database initialization & data
├── .agent/               # Agentic Workflows & Docs
└── docker-compose.yml    # Container Configuration
```

## 🤝 Contribution

This project is currently under active development.
*   **Phase 1-5 (Frontend)**: ~90% Complete (Design, Content, Navigation)
*   **Phase 6-7 (Backend)**: In Progress (API Development, DB Integration)

---
*Developed for the Faculty of Social Sciences, Chiang Rai Rajabhat University.*
