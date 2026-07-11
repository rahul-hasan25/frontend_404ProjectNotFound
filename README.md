# 🚀 404 Project Not Found - Frontend (Next.js & TypeScript)

> Welcome to the frontend of the 2-in-1 ultimate web application! This platform seamlessly fuses a fast-paced, intuitive Kanban Task Manager with an advanced Image Annotation Workbench. Built with style, aesthetics, and pixel-perfect precision.

---

## 🎭 The Villains Faced & The Power of Friendship (Difficulties & Solutions)

Every great anime arc features formidable villains. During the assembly of this terminal, our state managers and hooks faced absolute chaos, but we emerged victorious through the power of documentation and precise engineering:

### 1. The Phantom Profile Endpoint Void (404 Error)
* **The Villain:** After crafting a high-end, diagnostic-themed top Navbar, we attempted to pull user profile data (`full_name` and `profile_picture`) dynamically from the backend[cite: 10, 17]. The browser immediately threw a critical `404 Not Found` Axios error during layout initialization, threatening to break our aesthetic synchronization.
* **How We Overcame It:** We realized that our API routing structure was missing a dedicated profile-resolution pathway. With the power of an **AI Sidekick** and rigorous console tracing, we introduced a secure asynchronous retrieval mechanism inside a `useEffect` hook linked to `/api/auth/me/`. We added an immediate fallback clause to securely set the state to `"Hello User"` and revert to a beautifully rendered fallback Lucide icon if no profile data exists, preventing client-side crashes.

### 2. The Form Submission Disappearance (Empty Date String Payloads)
* **The Villain:** When editing an ongoing task node using the `TaskModal`, the application structure frequently triggered database integrity complaints from the Django server. Unselected HTML date pickers were sending empty string values (`""`) instead of blank/null objects, choking the backend API.
* **How We Overcame It:** We consulted the **Next.js State Documentation** and implemented an explicit interceptor function inside our global React Context Manager (`TaskContext.tsx`). Before firing any `PATCH` requests to the API, we programmatically audited the update payload and dynamically deleted any keys containing empty strings (`task_date` or `due_date`)[cite: 11]. 

### 3. The Uncontrolled Array Mutator (Tag Extraction Core)
* **The Villain:** Adding descriptive metadata tags inside our task creation suite caused data-type exceptions. The Django API demanded a strict serialized array, but the reactive text buffer occasionally leaked string structures during rapid multi-component updates.
* **How We Overcame It:** We deployed an explicit runtime normalization layer inside the context action dispatchers[cite: 11]. By utilizing the structural integrity of **MDN JavaScript Specs**, we added: `if (cleanedUpdates.tags && !Array.isArray(cleanedUpdates.tags)) { cleanedUpdates.tags = [cleanedUpdates.tags]; }`[cite: 11]. This instantly guaranteed array safety before submission.

### 4. The Zoom & Coordinate Alignment Boss 🎯
* **The Villain:** When users zoomed in or out (`zoom in`, `zoom out`, `reset zoom`) on the canvas, the mouse drawing coordinates didn't scale dynamically. Clicking on a magnified region placed nodes in completely wrong pixel locations!
* **How We Overcame It:** Defeated by applying linear transformation matrices. We intercepted the raw bounding client rectangle coordinates and mathematically reverse-engineered them using the canvas center point and zoom ratio:
  $$\text{clickX} = \frac{\text{baseClickX} - \frac{W}{2}}{\text{zoom}} + \frac{W}{2}$$
  This bound the drawing matrix perfectly to the visual state!

### 5. The Multi-Input Canvas Scroll Conflict 🛒
* **The Villain:** Implementing dual-sided clicks (Left click for Back, Right click for Next) along with Mouse Wheel scrolling caused serious interaction conflicts. It would accidentally trigger a slice change while a user was mid-way through drawing a polygon node.
* **How We Overcame It:** We introduced a strict **State Guard Layer**. Slice switching via canvas click is now completely deactivated when `isDrawMode` is true. We also integrated `.preventDefault()` on mouse wheel events to isolate canvas rolling from general page scrolling.

---

## 🛠️ Tech Stack & Environment

* **Framework:** Next.js 15 (App Router Architecture)
* **Language:** TypeScript (Strict Mode)
* **Styling:** Tailwind CSS (Aesthetic & Responsive Minimalist UI)
* **State Orchestration:** React Context API (`useContext`)[cite: 11]
* **Icons & Notifications:** Lucide React & React Hot Toast[cite: 13, 15, 17]
* **Icons:** React Icons (`fa` suite)
* **Toasts:** React-Toastify

### Prerequisites
* **Node.js:** `v18.x` or `v20.x` (Recommended)
* **Package Manager:** `npm` 

---

## Verify API Configuration:
* **Ensure that your custom Axios instance (src/utils/api.ts) points directly to your locally running Django server endpoint (usually http://127.0.0.1:8000 ) [cite: 11].**

---

## Access the Web Terminal:
* **Open your browser and navigate to http://localhost:3000. Welcome aboard!**

---

## 🚀 Installation & Setup Steps

Follow these steps to ignite the frontend engine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rahul-hasan25/frontend_404ProjectNotFound

2. **Install Core System Dependencies:**
    ```bash
    npm install

3. **Boot Up the Next.js Development Server:**
   ```bash
   npm run dev

4. **Production Build:**
   ```bash
   npm run build
   npm run start