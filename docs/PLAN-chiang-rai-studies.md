# Chiang Rai Studies Center Web Development Plan

This document outlines the development plan for the **Chiang Rai Studies Center (ศูนย์เชียงรายศึกษา)** website, implemented as a microservice within the existing Social Sciences Faculty ecosystem.

## 1. System Architecture

The system will leverage the existing technology stack while ensuring separation of concerns:

-   **Database (PostgreSQL):**
    -   Utilize the existing PostgreSQL instance.
    -   Create a dedicated **Schema** (e.g., `chiang_rai_identities`, `chiang_rai_artifacts`) to isolate data.
    -   **Dedicated Staff Table:** Create `chiang_rai_staff` to manage personnel specific to the center, separating them from the main faculty staff directory.
    -   Tables will store data related to the "5 Chiang Rai Identities", research papers, activities, and staff.
-   **Backend (Payload CMS / Nest.js):**
    -   Integrate as a new **Collection** or **Module** within the existing Payload CMS (or Nest.js backend) to serve as the Content Management System.
    -   Expose RESTful/GraphQL APIs for the frontend.
-   **Frontend (Next.js):**
    -   Develop as a distinct part of the Next.js application (e.g., under `/chiang-rai-studies` route or a separate sub-domain).
    -   Focus on **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** for optimal SEO, as the content is knowledge-heavy.
    -   **Design Theme:** "Modern Lanna" - reflecting Chiang Rai's culture with a modern UI.

## 2. Sitemap & Information Architecture

The website will consist of the following key sections:

1.  **Home (หน้าแรก):** Highlights, latest news, upcoming activities, and an introduction.
2.  **About Us (เกี่ยวกับศูนย์ฯ):**
    -   History & Objectives.
    -   Organizational Structure (Director, Academic, Network, Dissemination divisions).
    -   Steering Committee.
3.  **Digital Archive (คลังข้อมูลดิจิทัล):** *Core Feature*. Categorized by the "5 Chiang Rai Identities":
    -   History (ประวัติศาสตร์)
    -   Archaeology (โบราณคดี)
    -   Culture, Beliefs & Traditions (วัฒนธรรม ความเชื่อ และประเพณี)
    -   Performing Arts (ศิลปะการแสดง)
    -   Local Wisdom & Livelihood (ภูมิปัญญาท้องถิ่น อาชีพ และวิถีชีวิต)
4.  **Academic & Research (งานวิชาการและวิจัย):** Research papers, articles, and publications.
5.  **Activities & Training (กิจกรรมและอบรม):** News on seminars, training workshops, and exhibitions.
6.  **Networks (ภาคีเครือข่าย):** Partnerships with government, private sector, and communities.
7.  **Contact (ติดต่อเรา):** Location and contact channels.


## 3. Brand Identity & Design System

### Corporate Identity (CI)
- **Primary Color:** **Chiang Rai Purple (สีม่วงบัวสาย)**
  - *Hex:* `#702963` (Byzantium) or `#6B21A8` (Purple-800)
  - *Meaning:* Wanthong Chai (Saturday), the birth day of King Mangrai the Great. Represents prosperity, peace, and elegance.
  - *Usage:* Headers, Hero Backgrounds, Primary Buttons.
- **Accent Color:** **Puang Said Orange (สีส้มพวงแสด)**
  - *Hex:* `#F97316` (Orange-500)
  - *Meaning:* Provincial Flower (Pyrostegia venusta). Represents vitality and local flora.
  - *Usage:* Highlights, Calls to Action (CTA), Decorative lines.
- **Base Color:** **Mist White (สีขาวหมอก/ช้างเผือก)**
  - *Hex:* `#F8FAFC` (Slate-50)
  - *Meaning:* White Elephant under the clouds (Provincial Seal). Represents purity and auspiciousness.
  - *Usage:* Backgrounds, Cards, Typography on dark backgrounds.

### Symbols & Motifs
- **Provincial Seal:** White Elephant under clouds.
- **Flora:** Kasalong Kham (Tree of Gold) & Puang Said (Orange Trumpet).
- **Pattern:** Chiang Saen Hong Dam (Black Swan on Purple).

## 4. Development Phases

### Phase 1: Database & Content Modeling
-   **Analyze Data:** Define fields for the "5 Identities" to structure the Digital Archive.
-   **Schema Design:** Design PostgreSQL tables for:
    -   `chiang_rai_identities` (Main Categories)
    -   `chiang_rai_artifacts` (Digital Archive items)
    -   `chiang_rai_articles` (Research/Academic articles)
    -   `chiang_rai_staff` (Center Personnel - Separated from main staff)
    -   `chiang_rai_activities` (Events)

### Phase 2: Backend Development
-   **API Implementation:** Develop endpoints for CRUD operations on the new schemas.
-   **Search Functionality:** Implement filtering logic to allow searching artifacts by category (the 5 identities).

### Phase 3: Frontend Development
-   **UI/UX Design:** Create the "Modern Lanna" visual identity.
-   **Page Implementation:**
    -   Develop public-facing pages with SEO optimization.
    -   Create specific layouts for the Digital Archive to handle multimedia (images, video, audio).
    -   Create specific layouts for the Digital Archive to handle multimedia (images, video, audio).
    -   **Admin Dashboard:**
        -   Develop a separate Admin Interface at `/chiang-rai-studies/admin`.
        -   **Staff Management System:** Implement an "Import from Faculty" feature to allow selecting existing faculty staff and assigning them roles within the Center (Director, Academic, etc.) without duplicating data maintenance efforts.

### Phase 4: Integration & Deployment
-   **Testing:** Verify data flow between Backend and Frontend.
-   **Deployment:** Deploy content changes to the production environment, ensuring proper routing.
