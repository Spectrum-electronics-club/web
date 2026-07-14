# Requirements Document

## Introduction

NGND is a full-stack club/organization website built with React (Vite) on the frontend and Node/Express on the backend. The platform serves as the public-facing presence of the NGND club, showcasing projects, events, team members, publications, and competitions, while also providing a secure admin panel for content management. The system supports public visitors browsing club content, prospective members applying to join, and administrators managing all content via a protected dashboard.

---

## Glossary

- **System**: The NGND full-stack web application as a whole
- **Frontend**: The React/Vite client-side application served to browsers
- **Backend**: The Node/Express server-side application exposing REST APIs
- **Admin**: An authenticated user with the administrator role who manages content
- **Visitor**: An unauthenticated user browsing the public website
- **Applicant**: A visitor who submits a membership or recruitment application
- **Design_System**: The set of reusable Tailwind tokens, CSS variables, and atomic React components
- **Router**: The React Router instance managing client-side navigation
- **Axios_Instance**: The configured Axios HTTP client with interceptors
- **Auth_Service**: The backend module handling password hashing, JWT signing, and token verification
- **Auth_Context**: The React context providing authentication state to the frontend
- **DB**: The MongoDB database accessed via Mongoose
- **API**: The versioned REST API at `/api/v1/`
- **DataTable**: The reusable admin table component supporting pagination, sort, and search
- **Image_Uploader**: The backend module handling multipart image uploads via Multer or cloud storage
- **Animation_Layer**: The Framer Motion and GSAP animation implementation applied to pages and components
- **Error_Boundary**: The React component that catches rendering errors and displays a fallback UI
- **Rate_Limiter**: The Express middleware that limits the number of requests per IP within a time window
- **Skeleton**: A placeholder loading component shown while data is being fetched
- **Lightbox**: A full-screen image overlay triggered when a gallery image is clicked

---

## Requirements

---

### Requirement 1: Sitemap and Navigation Structure

**User Story:** As a visitor, I want to navigate between all major sections of the website, so that I can find information about the club efficiently.

#### Acceptance Criteria

1. THE Frontend SHALL provide routes for the following pages: Home, About, Team, Projects, Events, Competitions, Gallery, Publications, Contact, Join Club, Admin Login, and Admin Dashboard.
2. THE Router SHALL lazy-load each page route using React `Suspense` with a fallback UI.
3. THE Router SHALL render a 404 page for any route that does not match a defined route.
4. THE Navbar SHALL display navigation links to all public pages and remain accessible on every public page.
5. WHEN a visitor navigates to a protected admin route without a valid session, THE Frontend SHALL redirect the visitor to the Admin Login page.
6. THE Footer SHALL appear on every public page and include links to all major sections, social media profiles, and contact information.

---

### Requirement 2: Design System and Theming

**User Story:** As a developer, I want a centralized design system, so that all pages share consistent visual styles without duplicating CSS.

#### Acceptance Criteria

1. THE Design_System SHALL define a Tailwind configuration with a custom color palette, an 8px-based spacing scale, border-radius values between 10px and 16px, a box-shadow scale, and transition duration tokens.
2. THE Design_System SHALL load Space Grotesk as the heading font and Inter as the body font, both self-hosted as static assets, not loaded from an external CDN.
3. THE Design_System SHALL expose CSS custom properties (variables) for all theme tokens to enable dark mode switching without duplicating Tailwind utility classes.
4. THE Frontend SHALL provide a dark mode toggle that persists the user's preference to `localStorage` and applies it on subsequent visits.
5. THE Design_System SHALL include the following atomic components: Button, Input, Textarea, Select, Card, Badge, Modal, Tooltip, Tabs, Navbar, Footer, Section wrapper, and Container.
6. THE Frontend SHALL include an internal style-guide page that renders every Design_System component in all its variants for visual verification.
7. WHEN the viewport width is below 768px, THE Navbar SHALL collapse into a mobile menu accessible via a hamburger toggle button.

---

### Requirement 3: Frontend Scaffolding and Architecture

**User Story:** As a developer, I want a well-structured frontend codebase, so that features can be added and maintained without architectural confusion.

#### Acceptance Criteria

1. THE Frontend SHALL be scaffolded with Vite and React and SHALL include the following dependencies: `react-router-dom`, `framer-motion`, `gsap`, `react-icons`, `axios`, and `tailwindcss`.
2. THE Frontend SHALL organize source files under the following folder structure: `components/atoms`, `components/molecules`, `components/organisms`, `pages`, `layouts`, `hooks`, `context`, `utils`, and `routes`.
3. THE Axios_Instance SHALL attach the JWT access token from `localStorage` to the `Authorization` header on every outgoing request.
4. WHEN the Backend returns an HTTP 401 response, THE Axios_Instance SHALL attempt a token refresh and, if the refresh fails, SHALL redirect the user to the Admin Login page.
5. THE Frontend SHALL include an Error_Boundary component that catches unhandled rendering errors and displays a user-friendly fallback message.
6. THE Frontend SHALL render a 404 page with a navigation link back to the Home page for any unmatched route.

---

### Requirement 4: Backend Scaffolding and Architecture

**User Story:** As a developer, I want a well-structured backend codebase with consistent middleware, so that all API endpoints behave predictably and securely.

#### Acceptance Criteria

1. THE Backend SHALL be built with Node.js and Express and SHALL organize source files under: `models`, `routes`, `controllers`, `middleware`, `config`, and `utils`.
2. THE Backend SHALL prefix all API endpoints with `/api/v1/`.
3. THE Backend SHALL load the MongoDB connection string, JWT secret, and all environment-specific configuration exclusively from a `.env` file via the `dotenv` package.
4. THE Backend SHALL apply the following middleware globally: CORS headers, Helmet security headers, Morgan HTTP request logging, Rate_Limiter, and a central error-handling middleware.
5. THE Rate_Limiter SHALL allow a maximum of 100 requests per IP address per 15-minute window on public API endpoints.
6. WHEN an unhandled error reaches the central error handler, THE Backend SHALL return a JSON response with a `status`, `message`, and `code` field and SHALL NOT expose internal stack traces in production.
7. WHEN the DB connection fails on startup, THE Backend SHALL log the error and exit the process with a non-zero exit code.

---

### Requirement 5: Database Schemas

**User Story:** As a developer, I want clearly defined database schemas with appropriate indexes, so that queries are efficient and data integrity is enforced.

#### Acceptance Criteria

1. THE DB SHALL contain a `User` collection with fields: `username` (unique, indexed), `email` (unique, indexed), `passwordHash`, `role` (enum: `admin`, `superadmin`), and `createdAt`.
2. THE DB SHALL contain a `Project` collection with fields: `title`, `description`, `techStack` (array of strings), `images` (array of URLs), `status` (enum: `ongoing`, `completed`, `archived`), `githubUrl`, `demoUrl`, `createdAt`, and `updatedAt`.
3. THE DB SHALL contain an `Event` collection with fields: `title`, `description`, `schedule` (array of `{ date, time, activity }`), `speakers` (array of `{ name, bio, photo }`), `registrationUrl`, `galleryRef` (reference to Gallery documents), `isUpcoming` (boolean), and `createdAt`.
4. THE DB SHALL contain a `Gallery` collection with fields: `imageUrl`, `album`, `tags` (array of strings), `caption`, and `uploadedAt`.
5. THE DB SHALL contain a `Publication` collection with fields: `title`, `authors` (array of strings), `abstract`, `publishedDate`, `pdfUrl`, `externalUrl`, and `tags` (array of strings).
6. THE DB SHALL contain an `Announcement` collection with fields: `title`, `body`, `isPinned` (boolean), `createdAt`, and `expiresAt`.
7. THE DB SHALL contain a `Recruitment` collection with fields: `fullName`, `email`, `phone`, `department`, `year`, `motivation`, `linkedinUrl`, `status` (enum: `pending`, `reviewed`, `accepted`, `rejected`), and `submittedAt`.
8. THE DB SHALL contain a `Contact` collection with fields: `fullName`, `email`, `subject`, `message`, `isRead` (boolean), and `submittedAt`.
9. THE DB SHALL contain a `TeamMember` collection with fields: `fullName`, `role`, `photo`, `linkedinUrl`, `githubUrl`, `email`, `skills` (array of strings), `researchInterests` (array of strings), `isActive` (boolean), and `order` (integer for display sorting).
10. THE DB SHALL apply indexes on all fields marked `unique` and on `createdAt` fields for collections queried by date.

---

### Requirement 6: Authentication System

**User Story:** As an admin, I want to securely log in and access protected routes, so that only authorized users can manage website content.

#### Acceptance Criteria

1. WHEN an admin submits valid credentials, THE Auth_Service SHALL return a signed JWT access token (expiry: 15 minutes) and a signed refresh token (expiry: 7 days).
2. THE Auth_Service SHALL hash all passwords using bcrypt with a minimum work factor of 12 before storing them in the DB.
3. WHEN a request carries a valid access token in the `Authorization: Bearer` header, THE Backend SHALL grant access to protected endpoints.
4. WHEN a request carries an expired access token and a valid refresh token, THE Auth_Service SHALL issue a new access token without requiring the user to log in again.
5. WHEN a request carries an invalid or missing token on a protected endpoint, THE Backend SHALL return an HTTP 401 response.
6. THE Auth_Context SHALL expose `login`, `logout`, and `currentUser` to all Frontend components.
7. THE Frontend SHALL include a protected route wrapper that renders child routes only when `Auth_Context` reports an authenticated session.
8. WHEN an admin logs out, THE Frontend SHALL clear the access token and refresh token from storage and SHALL redirect to the Admin Login page.

---

### Requirement 7: Home Page

**User Story:** As a visitor, I want to land on an engaging and informative home page, so that I can quickly understand what NGND does and explore the site further.

#### Acceptance Criteria

1. THE Frontend SHALL render the Home page with the following sections in order: Hero, What We Do, Domains, Achievements, Featured Projects, Upcoming Events, Sponsors, Testimonials, and a Call-to-Action (CTA).
2. THE Hero section SHALL include the club name, a tagline, and two CTA buttons linking to the Projects page and the Join Club page respectively.
3. THE Featured Projects section SHALL fetch and display up to 6 projects from `GET /api/v1/projects?featured=true`.
4. THE Upcoming Events section SHALL fetch and display up to 3 events where `isUpcoming` is `true` from `GET /api/v1/events?upcoming=true`.
5. WHEN the Home page is loading data from the API, THE Frontend SHALL display Skeleton components in place of each data-driven section.
6. IF the API returns an error for any section, THE Frontend SHALL display an inline error message for that section without crashing the rest of the page.

---

### Requirement 8: About Page

**User Story:** As a visitor, I want to read about the history, mission, and values of NGND, so that I can understand the club's purpose.

#### Acceptance Criteria

1. THE Frontend SHALL render the About page with sections covering: club history, mission statement, vision, core values, and club statistics.
2. THE About page SHALL display only verified, real statistics sourced from the database or static content — no placeholder or fake numbers SHALL appear in production.
3. WHEN real statistics are unavailable, THE Frontend SHALL omit the statistics section rather than displaying zero-filled or placeholder values.

---

### Requirement 9: Team Page

**User Story:** As a visitor, I want to browse the team member profiles, so that I can learn about the people behind NGND.

#### Acceptance Criteria

1. THE Frontend SHALL fetch team members from `GET /api/v1/team` and render each as a Card displaying: photo, full name, role, LinkedIn link, GitHub link, email, skills badges, and research interests.
2. THE Team page SHALL sort members by the `order` field ascending.
3. WHEN a team member's photo is unavailable, THE Frontend SHALL display a default avatar placeholder.
4. WHEN the Team page is loading, THE Frontend SHALL display Skeleton card components.

---

### Requirement 10: Projects Page

**User Story:** As a visitor, I want to browse, filter, and search club projects, so that I can find projects relevant to my interests.

#### Acceptance Criteria

1. THE Frontend SHALL fetch projects from `GET /api/v1/projects` and display them in a responsive grid layout.
2. THE Projects page SHALL provide filter controls for `status` (ongoing, completed, archived) and `techStack` tags.
3. THE Projects page SHALL provide a search input that filters the displayed project cards by `title` and `description` on the client side.
4. WHEN a visitor clicks a project card, THE Frontend SHALL navigate to a project detail page displaying the full description, tech stack, images carousel, GitHub link, and demo link.
5. WHEN no projects match the active filters or search query, THE Frontend SHALL display an empty state message.

---

### Requirement 11: Events Page

**User Story:** As a visitor, I want to view upcoming and past events with their details, so that I can attend or learn from club activities.

#### Acceptance Criteria

1. THE Frontend SHALL fetch events from `GET /api/v1/events` and display them in a timeline layout, ordered by date descending.
2. WHEN an event has `isUpcoming` set to `true`, THE Frontend SHALL display a countdown timer showing time remaining until the event date.
3. THE Events page SHALL display for each event: title, description, schedule list, speaker profiles, and a registration link if `registrationUrl` is present.
4. WHEN a visitor clicks a speaker profile, THE Frontend SHALL display a Modal with the speaker's full bio and photo.
5. WHEN events data is loading, THE Frontend SHALL display Skeleton components.

---

### Requirement 12: Competitions Page

**User Story:** As a visitor, I want to view competitions the club has participated in or is organizing, so that I can learn about competitive achievements.

#### Acceptance Criteria

1. THE Frontend SHALL fetch competitions data from `GET /api/v1/competitions` and render each entry with: name, description, date, result/placement, and relevant links.
2. THE Competitions page SHALL visually distinguish between upcoming competitions and past competitions.
3. WHEN competitions data is loading, THE Frontend SHALL display Skeleton components.

---

### Requirement 13: Gallery Page

**User Story:** As a visitor, I want to browse the club's photo gallery, so that I can see visual highlights from events and activities.

#### Acceptance Criteria

1. THE Frontend SHALL fetch gallery images from `GET /api/v1/gallery` and display them in a responsive masonry or uniform grid layout.
2. THE Gallery page SHALL support filtering images by `album` and `tags`.
3. WHEN a visitor clicks a gallery image, THE Frontend SHALL open a Lightbox displaying the full-resolution image, its caption, and navigation controls to move to the previous or next image.
4. WHEN gallery data is loading, THE Frontend SHALL display Skeleton placeholder cells.

---

### Requirement 14: Publications Page

**User Story:** As a visitor, I want to read about research and publications from club members, so that I can follow the club's academic contributions.

#### Acceptance Criteria

1. THE Frontend SHALL fetch publications from `GET /api/v1/publications` and display each entry with: title, authors, abstract excerpt, publication date, and links to the PDF and external URL if available.
2. THE Publications page SHALL support filtering by `tags` and sorting by `publishedDate` descending.
3. WHEN a publication has a `pdfUrl`, THE Frontend SHALL render a button that opens the PDF in a new browser tab.

---

### Requirement 15: Contact Page

**User Story:** As a visitor, I want to send a message to the club, so that I can ask questions or make inquiries.

#### Acceptance Criteria

1. THE Frontend SHALL render a contact form with fields: Full Name, Email, Subject, and Message, all of which are required.
2. WHEN a visitor submits the form with all valid fields, THE Frontend SHALL send a `POST` request to `/api/v1/contact` and display a success confirmation message.
3. WHEN the visitor submits the form with an invalid email format or any empty required field, THE Frontend SHALL display inline validation error messages without submitting the request.
4. THE Backend SHALL validate all contact form fields server-side and SHALL return HTTP 400 with descriptive field errors if validation fails.
5. THE Backend SHALL store the submitted contact query in the `Contact` collection with `isRead` set to `false`.
6. WHEN the API request fails, THE Frontend SHALL display an error message prompting the visitor to try again.

---



---

### Requirement 17: Admin Login

**User Story:** As an admin, I want to log in with my credentials, so that I can access the admin dashboard.

#### Acceptance Criteria

1. THE Frontend SHALL render an Admin Login page with Email and Password fields and a submit button.
2. WHEN an admin submits valid credentials, THE Frontend SHALL store the received access token and refresh token securely and SHALL redirect to the Admin Dashboard.
3. WHEN an admin submits invalid credentials, THE Backend SHALL return HTTP 401 and THE Frontend SHALL display an error message without exposing whether the email or password was incorrect.
4. THE Admin Login page SHALL NOT be accessible via the Navbar on public pages.
5. WHEN an already-authenticated admin navigates to the Admin Login page, THE Frontend SHALL redirect them to the Admin Dashboard.

---

### Requirement 18: Admin Dashboard

**User Story:** As an admin, I want an overview dashboard, so that I can monitor content and site activity at a glance.

#### Acceptance Criteria

1. THE Frontend SHALL render an Admin Dashboard accessible only to authenticated admins, displaying summary widgets for: total projects, upcoming events, pending recruitment applications, unread contact queries, and total team members.
2. THE Admin Dashboard widgets SHALL fetch data from dedicated summary endpoints under `/api/v1/admin/summary`.
3. WHEN widget data is loading, THE Frontend SHALL display Skeleton widgets.

---

### Requirement 19: Admin CRUD — Projects

**User Story:** As an admin, I want to create, read, update, and delete projects, so that the Projects page always reflects current work.

#### Acceptance Criteria

1. THE Frontend SHALL render an admin Projects list using DataTable with columns for title, status, tech stack, and actions (Edit, Delete).
2. WHEN an admin submits the project create or edit form with valid data, THE Frontend SHALL send a `POST` or `PUT` request to `/api/v1/admin/projects` and refresh the DataTable.
3. WHEN an admin clicks Delete on a project, THE Frontend SHALL display a confirmation Modal before sending a `DELETE` request to `/api/v1/admin/projects/:id`.
4. THE Backend SHALL require a valid admin JWT on all `/api/v1/admin/` endpoints and SHALL return HTTP 403 for insufficient permissions.
5. THE Image_Uploader SHALL accept image files up to 10MB, validate MIME type as `image/jpeg`, `image/png`, or `image/webp`, and store the resulting URL in the project's `images` array.

---

### Requirement 20: Admin CRUD — Events

**User Story:** As an admin, I want to manage event records, so that the Events page stays accurate and up to date.

#### Acceptance Criteria

1. THE Frontend SHALL provide an admin Events list and a create/edit form with fields matching the `Event` schema including schedule entries and speaker entries.
2. WHEN an admin saves an event, THE Backend SHALL validate that all schedule entries contain valid date and time values and SHALL return HTTP 400 if any are invalid.
3. WHEN an admin deletes an event, THE Backend SHALL also remove all Gallery document references linked to that event's `galleryRef` field.

---

### Requirement 21: Admin CRUD — Gallery

**User Story:** As an admin, I want to upload and manage gallery images, so that the Gallery page shows current visual content.

#### Acceptance Criteria

1. THE Frontend SHALL provide an admin Gallery manager where an admin can upload images, assign them to an album, add tags and a caption, and delete existing images.
2. THE Image_Uploader SHALL process uploaded images and store them with their URL, album, tags, and caption in the `Gallery` collection.
3. WHEN an admin deletes a gallery image, THE Backend SHALL remove the record from the DB and SHALL delete the corresponding file from storage.

---

### Requirement 22: Admin CRUD — Team Members

**User Story:** As an admin, I want to manage team member profiles, so that the Team page shows current members.

#### Acceptance Criteria

1. THE Frontend SHALL provide an admin Team Members list and a create/edit form supporting all `TeamMember` schema fields including photo upload, skills, and research interests.
2. WHEN an admin updates the `order` field of a team member, THE Team page SHALL reflect the new sort order on the next data fetch.
3. WHEN an admin sets `isActive` to `false` for a team member, THE Frontend SHALL NOT display that member on the public Team page.

---

### Requirement 23: Admin CRUD — Publications

**User Story:** As an admin, I want to manage publications, so that the Publications page reflects the club's latest research output.

#### Acceptance Criteria

1. THE Frontend SHALL provide an admin Publications list and a create/edit form with fields: title, authors, abstract, publishedDate, pdfUrl, externalUrl, and tags.
2. WHEN an admin provides a `pdfUrl` that is not a valid URL format, THE Frontend SHALL display a validation error and SHALL NOT submit the form.

---

### Requirement 24: Admin CRUD — Announcements

**User Story:** As an admin, I want to post and manage announcements, so that visitors are informed about important news.

#### Acceptance Criteria

1. THE Frontend SHALL provide an admin Announcements list and a create/edit form with fields: title, body, isPinned, and expiresAt.
2. WHEN the current date is past an announcement's `expiresAt` value, THE Backend SHALL exclude that announcement from public-facing API responses.
3. WHEN `isPinned` is `true`, THE Frontend SHALL display the announcement prominently at the top of any announcement list on public pages.

---



---

### Requirement 26: Admin — Contact Queries Management

**User Story:** As an admin, I want to view and manage incoming contact messages, so that no visitor inquiry goes unaddressed.

#### Acceptance Criteria

1. THE Frontend SHALL render a contact queries list in a DataTable with columns: full name, email, subject, submission date, and read status.
2. WHEN an admin opens a contact query, THE Frontend SHALL send a `PATCH` request to mark `isRead` as `true` and SHALL display the full message in a Modal.
3. THE DataTable SHALL visually distinguish unread queries from read queries.

---

### Requirement 27: Image Upload System

**User Story:** As an admin, I want to upload images for projects, gallery, and team profiles, so that the site displays rich visual content.

#### Acceptance Criteria

1. THE Image_Uploader SHALL accept multipart form data `POST` requests at `/api/v1/admin/upload`.
2. WHEN an uploaded file's MIME type is not `image/jpeg`, `image/png`, or `image/webp`, THE Image_Uploader SHALL return HTTP 415 and SHALL NOT store the file.
3. WHEN an uploaded file exceeds 10MB, THE Image_Uploader SHALL return HTTP 413 and SHALL NOT store the file.
4. THE Image_Uploader SHALL return the stored image URL in the response body upon successful upload.

---

### Requirement 28: Animation Layer

**User Story:** As a visitor, I want smooth animations and transitions, so that the website feels polished and modern.

#### Acceptance Criteria

1. THE Animation_Layer SHALL implement page transition animations using Framer Motion on all route changes.
2. THE Animation_Layer SHALL implement scroll-reveal animations on section entry for at least the Home, About, and Projects pages using GSAP or Framer Motion.
3. THE Animation_Layer SHALL implement hover micro-interaction animations on all interactive cards and buttons.
4. WHEN a page is awaiting API data, THE Frontend SHALL display Skeleton components rather than empty containers or layout shifts.
5. WHEN a user's operating system has `prefers-reduced-motion` set to `reduce`, THE Animation_Layer SHALL disable or minimize all non-essential animations.

---

### Requirement 29: Responsiveness and Accessibility

**User Story:** As a visitor using any device, I want the website to be fully usable on mobile, tablet, and desktop, so that I have a consistent experience.

#### Acceptance Criteria

1. THE Frontend SHALL render all public pages without horizontal scrolling or layout breakage at viewport widths of 320px, 768px, and 1440px.
2. THE Frontend SHALL use semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>`) on all pages.
3. THE Frontend SHALL provide `alt` text on all `<img>` elements.
4. THE Frontend SHALL ensure all interactive elements (buttons, links, form inputs) are keyboard-navigable and have visible focus indicators.
5. THE Frontend SHALL achieve a minimum contrast ratio of 4.5:1 for normal text against its background in both light and dark modes.

---

### Requirement 30: Performance

**User Story:** As a visitor, I want pages to load quickly, so that I am not frustrated by slow content delivery.

#### Acceptance Criteria

1. THE Frontend SHALL code-split each page route so that the initial JavaScript bundle does not include code for unvisited pages.
2. THE Frontend SHALL serve self-hosted fonts as `woff2` format with `font-display: swap` to prevent invisible text during font load.
3. THE Backend SHALL respond to all `GET /api/v1/` read endpoints within 500ms under normal single-user load on the development environment.
4. THE Frontend SHALL lazy-load all images below the fold using the `loading="lazy"` attribute or an Intersection Observer.

---

### Requirement 31: Security

**User Story:** As a system operator, I want the application to follow security best practices, so that user data and admin access are protected.

#### Acceptance Criteria

1. THE Backend SHALL set HTTP security headers via Helmet on all responses, including `Content-Security-Policy`, `X-Frame-Options`, and `X-Content-Type-Options`.
2. THE Backend SHALL sanitize all user-supplied string inputs before writing them to the DB to prevent NoSQL injection.
3. THE Auth_Service SHALL store only bcrypt-hashed passwords and SHALL NEVER log or return plaintext passwords.
4. THE Backend SHALL enforce HTTPS-only cookie flags (`Secure`, `HttpOnly`, `SameSite=Strict`) when refresh tokens are stored in cookies.
5. THE Rate_Limiter SHALL apply a stricter limit of 10 requests per 15-minute window on the `/api/v1/auth/login` endpoint.

---

### Requirement 32: Developer Experience and Repository Structure

**User Story:** As a developer, I want a clean repository structure with clear setup instructions, so that onboarding and local development are straightforward.

#### Acceptance Criteria

1. THE System SHALL organize the repository with a `/client` directory for the Frontend and a `/server` directory for the Backend.
2. THE System SHALL include a root-level `README.md` with: project overview, prerequisites, environment variable reference, setup steps for client and server, and instructions for running in development and production.
3. THE Backend SHALL include a `.env.example` file listing all required environment variable keys without exposing secret values.
4. THE System SHALL include a root-level `.gitignore` file that excludes `node_modules`, `.env` files, build output directories, and OS-generated files.
