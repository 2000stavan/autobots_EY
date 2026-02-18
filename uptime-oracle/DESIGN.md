# Design System: Uptime Oracle
**Project ID:** uptime-oracle-local

## 1. Visual Theme & Atmosphere
**"Cyberpunk Industrial"**
The interface feels like a high-end diagnostic tool for advanced machinery. It uses a deep, dark canvas populated by glowing, glass-like panels and precise instrumentation. The mood is "Technical," "Precision-oriented," and "Futuristic." It relies heavily on translucency (glassmorphism) to layer information without clutter.

## 2. Color Palette & Roles
*   **Deep Space Black (#080c10):** The primary background color. Creates a high-contrast void for content.
*   **Electric Blue (#0d7ff2):** The primary brand and action color. Used for active states, key highlights, and primary gauge arcs.
*   **Emerald Signal (#10b981):** Functional color for "Healthy" or "Normal" states. Used in status pills and indicators.
*   **Critical Red (#ef4444):** Functional color for "Alert" or "Error" states. Used for critical notifications and simulating failures.
*   **Obsidian Glass (rgba(16, 25, 34, 0.6)):** The standard background for panels and containers, providing depth and context.
*   **Starlight Border (rgba(255, 255, 255, 0.1)):** Subtle borders for defining edges of glass panels.

## 3. Typography Rules
**Font Family:** `Space Grotesk`
A monospaced-inspired geometric sans-serif that reinforces the technical/industrial aesthetic.
*   **Headings:** Bold (700) or Semi-Bold (600). tight tracking (`tracking-tight`).
*   **Body:** Regular (400) or Light (300).
*   **Numbers/Data:** Often Monospaced behavior implicitly via the font choice, critical for readability in gauges.

## 4. Component Stylings
*   **Glass Panels:** The core container style.
    *   Background: `rgba(16, 25, 34, 0.6)` with `backdrop-filter: blur(16px)`.
    *   Border: `1px solid rgba(255, 255, 255, 0.1)`.
*   **Control Buttons (Sidebar):**
    *   **Primary:** `rounded-xl`, `bg-[#0d7ff2]`, `shadow-lg shadow-[#0d7ff2]/20`. Hover scales up (`scale-105`).
    *   **Secondary:** `rounded-xl`, `bg-white/5`, text `white/60`. Hover becomes `bg-white/10` and text `white`.
*   **Status Pills:** `rounded-full`, `bg-white/5`, `border border-white/10`. Used for displaying Unit ID and Health status.
*   **Gauges:** Radial visualization with distinct colored arcs (Blue for normal, Red potential). High contrast values.

## 5. Layout Principles
*   **Sidebar Navigation:** Fixed left sidebar (`w-20`) for primary tool switching.
*   **Top Bar:** Fixed header (`h-20`) for global context (Unit ID, User Profile).
*   **Z-Indexing:** Careful management of layers. Video/3D background is lowest, Glass panels sit above, Floating assistants sit on top (`z-50`).
*   **Flex centered:** Main stage content is deeply centered `flex items-center justify-center`.
