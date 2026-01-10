# MarketLive - Development Roadmap & Status

## ✅ Completed Tasks (Current Session)
1.  **Git Repository Source**: Established `clerk-react2` as the definitive source.
2.  **Server Stabilization**:
    *   Moved port to **8080** to avoid conflicts.
    *   Removed debug banners.
    *   Updated App Title to "MarketLive".
3.  **Crash Fixes**:
    *   **ShipmentMap**: Replaced with safe placeholder to prevent React-Leaflet Context crashes.
    *   **Reports Page**: Fixed missing `downloadRef` ReferenceError.
    *   **Documents Page**: Fixed duplicate state and imports; implemented "Smart Upload".
    *   **Navbar**: Added missing "Payments" link.
4.  **Feature Implementation**:
    *   **Smart Upload (AI)**: Implemented in `DocumentsPage.tsx` using `convex/ai.ts`.
    *   **Payments Integration**: Added navigation link to existing `PaymentsPage`.

## 🚧 Immediate Next Steps

### 1. Verify Payments Page
The "Payments" link is now in the Navbar.
**Action**: Click "Payments" and verify the page loads. If it crashes, check for missing `stripe` keys or Convex `payments` table issues.

### 2. Restore Interactive Map
The Dashboard map is currently a static placeholder.
**Action**: 
*   Re-introduce `react-leaflet` carefully.
*   Ensure `leaflet.css` is loaded correctly.
*   Consider using a different map library (e.g., `google-maps-react`) if `react-leaflet` v4/v5 continues to conflict with React 18 Strict Mode.

### 3. Polish "Smart Upload"
The AI parsing is currently mocked in `convex/ai.ts`.
**Action**:
*   Connect to a real OpenAI / Document Intelligence API in `convex/ai.ts`.
*   Improve the "Analyzing" UI state in `DocumentsPage`.

### 4. Client Portal Features
The keys `ClientQuotesPage` and `ClientBookingsPage` had duplicate props fixed.
**Action**: Verify the "Client Portal" flow (Quotes -> Bookings) works end-to-end.

## 📋 Outstanding Issues / Watchlist
*   **Leaflet Map**: currently disabled.
*   **Convex Sync**: Ensure `npx convex dev` is always running in the background.
*   **Browser Caching**: If old "Red Banner" appears, hard refresh (Ctrl+F5) on Port 8080.

## 🔧 Technical Notes
*   **Port**: 8080
*   **Backend**: Convex (needs `npx convex dev`)
*   **Frontend**: Vite + React 18
*   **Styles**: TailwindCSS (Standard)
