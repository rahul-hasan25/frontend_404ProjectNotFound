# 404 Project Not Found — Frontend (Next.js 15)

> "Believe in the code that believes in you!" 🕶️🔥
Welcome to the front line of the 404 Project. This is an exceptionally aesthetic, modular, and pixel-perfect Next.js application built with TypeScript, Tailwind CSS, and Lucide Icons. It bridges the gap between clinical task coordination via an ultra-sleek Kanban layout and advanced data engineering via a canvas-based Image Annotation suite.

---

## 🌋 The Chronology of Difficulties: Villains Defeated

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

---

## ⚙️ Tech Stack & Technical Specifications

* **Runtime Environment:** Node.js v20.x or higher (LTS)
* **Framework:** Next.js 15 (App Router Architecture)
* **Language:** TypeScript (Strict Mode)
* **Styling Engine:** Tailwind CSS
* **State Orchestration:** React Context API (`useContext`)[cite: 11]
* **Icons & Notifications:** Lucide React & React Hot Toast[cite: 13, 15, 17]

---

## Verify API Configuration:
* **Ensure that your custom Axios instance (src/utils/api.ts) points directly to your locally running Django server endpoint (usually http://127.0.0.1:8000 ) [cite: 11].**

---

## Access the Web Terminal:
* **Open your browser and navigate to http://localhost:3000. Welcome aboard!**

---

## 🚀 Step-by-Step Installation

Follow these steps to ignite the frontend engine:

1. **Install Core System Dependencies:**
    ```bash
    npm install

2. **Boot Up the Next.js Development Server:**
   ```bash
   npm run dev