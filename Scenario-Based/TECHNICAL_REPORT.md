# SKILL DEVELOPMENT LABORATORY ASSESSMENT - SCENARIO-BASED TECHNICAL REPORT

**Institution:** Saveetha School of Engineering (SSE)  
**Course Title:** Web Technology  
**Course Code:** ITA02  
**Unit II:** Cascading Style Sheets (CSS) & Interactive Web Design  
**Topic:** Responsive Event Registration Portal with Aurora WebGL Hero, Image Cards & Floating Modal  
**Student Name:** Akash S
**Register No:** 718122CS001  
**Class / Section:** III Year B.Tech CSE  

---

## 1. Executive Summary & Scenario Interpretation
The objective of this assessment is to design, implement, and test a responsive, accessible, and visually captivating **College Event Registration Portal** ("Horizon '26") for **Saveetha School of Engineering (SSE)**. The project demonstrates core CSS concepts, document flow, box-model mathematics, multi-column grid/flexbox layouts, positioning techniques, visual effects, **Unsplash high-resolution photography**, a **full-height (100vh) WebGL Aurora shader background**, and an **interactive floating Registration Modal**, all built natively without external frameworks like Tailwind or Bootstrap.

---

## 2. Mandatory CSS Methods Justification

### A. Demonstration of CSS Methods in Source Code
1. **Inline CSS:** Applied to the title accent in `index.html` (`line 71`):
   ```html
   <span class="gradient-text" style="color: #818cf8; text-decoration: underline cubic-bezier(0.4, 0, 0.2, 1) 3px;">HORIZON '26</span>
   ```
2. **Internal CSS:** Defined in `<style id="internal-css-demo">` in `index.html` (`lines 18-32`) to style the Keynote Speakers Section (`.speakers-section`).
3. **External CSS:** Main website styles encapsulated cleanly in `style.css` linked via `<link rel="stylesheet" href="style.css" />`.

### B. Technical Justification
* **External CSS** is the most suitable method for multi-page college applications because:
  * **Maintainability & Reusability:** A single CSS file can style hundreds of pages across the portal (e.g., event catalogues, registration forms, student dashboards).
  * **Browser Caching:** Browsers download the external `.css` file once and store it in cache, significantly reducing page load latency on subsequent navigation.
  * **Separation of Concerns:** Keeps HTML markup purely semantic while style definitions remain modular and organized.

---

## 3. CSS Selectors Inventory

| Selector Category | Example Selector in `style.css` | Target HTML Element / Purpose |
| :--- | :--- | :--- |
| **Element Selector** | `h1, h2, h3`, `p`, `body`, `select`, `details` | Applies baseline typography, details accordion resets. |
| **Class Selector** | `.event-card`, `.modal-card`, `.speaker-card` | Styles re-usable UI components and modal dialogs. |
| **ID Selector** | `#hero`, `#catalogue`, `#registration-modal` | Targets specific section wrappers and modal overlays. |
| **Group Selector** | `h1, h2, h3, h4, h5, h6` | Shared font family and line heights. |
| **Descendant Selector** | `.nav-list .nav-link`, `.card-content .card-title` | Styles nested nav links and card titles. |
| **Child Selector (`>`)** | `.nav-list > li`, `.events-grid > .event-card` | Direct list item layout within header. |
| **Attribute Selector** | `input[type="text"]`, `button[data-category]`, `details[open]` | Targets form fields, filter controls, and active accordions. |
| **Pseudo-Class (`:hover`, `:focus`, `:nth-child`)** | `.btn-submit:hover`, `input:focus`, `.event-card:nth-child(n)` | Provides interactive focus rings and staggered entry delays. |
| **Pseudo-Element (`::before`, `::after`)** | `.event-card::before`, `.nav-list .nav-link::after` | Creates animated shimmer sweep & gradient underlines. |

---

## 4. CSS Box Model Analysis & Total Width Calculation

### A. Box Model Dimensions of Event Card (`.event-card`)
Each event card has the following explicit CSS properties:
* **Content Width ($W_{\text{content}}$):** $350\text{ px}$ (in a 3-column grid container of $1200\text{ px}$ max-width).
* **Padding ($P$):** $24\text{ px}$ on top, right, bottom, left.
* **Border ($B$):** $1\text{ px}$ solid on all four sides.
* **Margin ($M$):** $0\text{ px}$ (spacing managed via CSS Grid `gap: 28px`).

### B. Total Width Calculation Under Default `content-box` Model
Under `box-sizing: content-box` (browser default):
$$\text{Total Horizontal Width} = W_{\text{content}} + P_{\text{left}} + P_{\text{right}} + B_{\text{left}} + B_{\text{right}} + M_{\text{left}} + M_{\text{right}}$$
$$\text{Total Horizontal Width} = 350\text{ px} + 24\text{ px} + 24\text{ px} + 1\text{ px} + 1\text{ px} + 0\text{ px} + 0\text{ px} = \mathbf{400\text{ px}}$$

### C. Comparison with `box-sizing: border-box`
When `box-sizing: border-box` is applied:
* The padding ($24\text{ px} \times 2 = 48\text{ px}$) and border ($1\text{ px} \times 2 = 2\text{ px}$) are **absorbed inside** the specified card width ($350\text{ px}$).
* The actual content area shrinks to $350 - 50 = 300\text{ px}$.
* The outer element width remains **exactly $350\text{ px}$**, preventing unintended layout breaks, wrapping errors, or grid overflow.

---

## 5. Layout & Beyond-Normal-Flow Positioning

1. **Normal Flow & Flexbox/Grid Layout:**
   * `.events-grid` uses **CSS Grid** (`grid-template-columns: repeat(3, 1fr)`) on desktop screens to align event cards symmetrically into 3 equal columns.
   * `.gallery-grid` and `.speakers-grid` use responsive CSS Grid with `repeat(auto-fit, minmax(280px, 1fr))`.
   * `.nav-container` and `.hero-cta-group` use **Flexbox** for dynamic alignment.

2. **Beyond-Normal-Flow Positioning Techniques & Non-Interference:**
   * **Floating Modal Overlay (`position: fixed; inset: 0; z-index: 1000;`):** `.modal-backdrop` dims the background with `backdrop-filter: blur(12px)` and presents the student registration form centered in the viewport.
   * **Sticky Positioning (`position: sticky; top: 0; z-index: 100;`):** Applied to `.site-header`. Keeps the navigation menu fixed at the top of the viewport as the user scrolls.
   * **Fixed Positioning (`position: fixed; bottom: 28px; right: 28px; z-index: 999;`):** Applied to `.fixed-help-widget`. Keeps a persistent "Need Help?" floating button visible over all content.
   * **Absolute Positioning (`position: absolute; top: 14px; right: 14px; z-index: 4;`):** Applied to `.card-badge-wrap` to position event registration status badges over card header images. Applied to `#aurora-canvas` for non-blocking WebGL background rendering.
   * **Relative Positioning (`position: relative;`):** Applied to `.event-card` and `.hero-section` to establish a positioning context for absolute children and particle glows.

---

## 6. Advanced CSS Properties & Visual Aesthetics

1. **High-Resolution Photography & Zoom:** Unsplash photography with hover scale (`transform: scale(1.08)` on `.card-img`).
2. **Aurora WebGL Shader Background:** Real-time GLSL Simplex Noise shader rendered on `#aurora-canvas` with color stops `['#5227FF', '#7cff67', '#5227FF']`.
3. **Gradients:** `linear-gradient(135deg, hsl(252, 90%, 65%), hsl(190, 95%, 50%))` for buttons and badges.
4. **Border-Radius:** Rounded corners (`var(--radius-lg)` = 20px) for modern glassmorphism aesthetic.
5. **Box-Shadow:** Multi-layered glow shadow (`0 20px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.25)`).
6. **Transitions & Transforms:** Smooth hover card elevation (`transform: translateY(-12px) scale(1.02); transition: all 0.4s ease;`).
7. **Details / Summary Accordion:** Custom-styled FAQ accordion with pure CSS open state (`details[open]`).

---

## 7. Responsive Design & Testing Evidence

### A. Viewport Testing
* **Desktop Viewport (1200px+):** 3-column event grid, multi-column gallery, centered registration modal.
* **Mobile Viewport (375px iPhone SE / Android):** 1-column event grid, stacked modal form inputs, mobile hamburger navigation menu drawer, 0px horizontal scroll.

### B. Multi-Browser Compatibility Testing

| Browser Tested | Version | Status | Observed Alignment & Rendering |
| :--- | :--- | :--- | :--- |
| **Mozilla Firefox** | 128.0 (Linux/Win) | PASS | Flexbox, Grid, backdrop-filter blur, WebGL Aurora Canvas, Modal pop render perfectly. |
| **Chromium / Google Chrome** | 126.0 (Win) | PASS | CSS gradients, WebGL2 noise shader, absolute badges, and form focus rings rendered cleanly. |

### C. Documented Layout Issues Identified & Corrected During Testing

1. **Issue 1: Horizontal Scrollbar on Mobile Viewport (375px)**
   * *Root Cause:* The `.hero-dates-card` had a fixed minimum width and horizontal padding that exceeded 375px width.
   * *Correction Applied:* Converted `.hero-dates-card` to `flex-direction: column` at `@media (max-width: 768px)` and set `width: 100%; box-sizing: border-box; overflow-x: hidden;`.

2. **Issue 2: Fixed Help Button Covered Registration Submit Button on Small Screens**
   * *Root Cause:* `.fixed-help-widget` overlapped the bottom right of the registration card.
   * *Correction Applied:* Converted the form to a focused centered floating modal dialog with backdrop scroll locking and adjusted `.help-text` to `display: none` on screens $< 375\text{ px}$.

---

## 8. Student Submission Checklist

- [x] `index.html` file included and opens correctly in any modern web browser.
- [x] `style.css` file linked correctly and contains all primary external CSS rules.
- [x] Technical note and event-card width calculation included in `TECHNICAL_REPORT.md`.
- [x] Positioning methods (`sticky`, `fixed`, `absolute`, `relative`) demonstrated.
- [x] Mandatory CSS methods (Inline, Internal, External) demonstrated.
- [x] Responsive layout tested at 1200px desktop and 375px mobile viewports without horizontal scrolling.
- [x] Code integrity verified (No framework dependencies, pure HTML5/CSS3/WebGL2).

---
**Academic Integrity Declaration:**  
*I declare that the submitted source code, layout decisions, and documentation are my own original work.*  
**Student Signature:** Akash K &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Date:** 11-08-2026
