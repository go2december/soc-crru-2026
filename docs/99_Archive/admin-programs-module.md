# Admin Programs Module Enhancement

## Overview
This task tracks the implementation of the complete `/admin/programs` dashboard feature and necessary DB extensions as requested by the user.

## Features Requested
1. **Dedicated Form Page (Layout B):** Complex arrays (highlights, careers, structure) demand a full-screen editing experience instead of a popup modal. 
2. **File Uploads:** Support direct server uploads for `banner_url` and `curriculum_url` (PDF).
3. **Publishing State:** Add `isActive` (boolean) to the `programs` table to control visibility.
4. **Program Instructors:** Introduce a new relation pointing to `staff_profiles` with specific roles (`CHAIR` (ประธาน), `MEMBER` (อาจารย์)).

## Phase 1: Database Schema & Migrations
- [ ] Add `isActive: boolean('is_active').default(true)` to `programs` table.
- [ ] Create `programInstructorRoleEnum` ('CHAIR', 'MEMBER').
- [ ] Create new table `program_instructors` linking `program_id` and `staff_id`.
- [ ] Generate standard `drizzle-kit generate` migration and apply to DB.

## Phase 2: Backend API
- [ ] Update `ProgramsService` to fetch and attach `program_instructors` relations.
- [ ] Update `ProgramsService` `update` and `create` methods to handle syncing `instructors` array, replacing existing records.

## Phase 3: Frontend Dashboard UI
- [ ] **Data Table:** Create `frontend/app/admin/(dashboard)/programs/page.tsx`. Table showing code, name, degree level, status (`isActive`), with Add/Edit/Delete actions.
- [ ] **Editor Form:** Create `frontend/app/admin/(dashboard)/programs/[id]/page.tsx`. This includes tabs or distinct card sections for Basic Info, Curriculums PDF, Banners, Highlights, Instructors Selector, Careers, and Structure.
- [ ] **Staff Integration:** The Instructors selector should query `/api/staff` and attach Roles dynamically.
- [ ] **Upload Handling:** Call `POST /api/upload` endpoint for image/docs and append returned paths to the Drizzle update payload.

## Phase 4: Final QA Test
- [ ] Use `.agent/scripts/checklist.py` or manual validation.
- [ ] Ensure `frontend` lints cleanly and APIs map perfectly.
