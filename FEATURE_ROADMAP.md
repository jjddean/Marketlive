# Feature Implementation Roadmap
*Aligned with `convex-dashboard2` reference standards.*

This roadmap outlines the path to upgrading `clerk-react2` (MarketLive) into a "Top-Class" FreightOps platform, matching the reference architecture.

## 🚀 Phase 1: Core Intelligence (Smart Upload)
**Goal:** Transform "Documents" from simple storage to an intelligent data entry point.
- [x] **UI Integration**: `SmartUploadButton` in Documents Page. (Done)
- [ ] **Real AI Parsing**: Connect `convex/ai.ts` to OpenAI/Document Intelligence.
    - *Current State*: Mocked data based on filename.
    - *Next Step*: Implement actual PDF text extraction or GPT-4o vision analysis.
- [ ] **Data Extraction**: Automatically fill `Booking` and `Shipment` forms from uploaded BOLs.

## 💸 Phase 2: Financial Operations
**Goal:** Robust invoicing and payment collection.
- [x] **Navigation**: Added Payments page. (Done)
- [ ] **Convex Backend**: Ensure `paymentAttempts` logic mirrors the reference app's robust schema.
- [ ] **Stripe/Clerk Billing**: Implement real payment processing (or robust Stripe Checkout simulation) to replace the current "Pay Now" placeholder.
- [ ] **Invoicing**: Generate PDF invoices dynamically.

## 🗺️ Phase 3: Interactive Operations (Map)
**Goal:** Real-time visibility.
- [ ] **Map Restoration**: Replace the maintenance placeholder with a working Leaflet map.
- [ ] **Live Tracking**: Animate shipment markers based on "Real-time" convex updates (simulated movement).

## 🔍 Phase 4: Global Search & Navigation
**Goal:** Enterprise-grade usability.
- [ ] **Cmd+K Palette**: Implement a global command menu to jump to Shipments, Bookings, or Customers.
- [ ] **Vector Search**: Use Convex to search shipment manifests semantically.

## 📡 Phase 5: Client Portal
**Goal:** External customer experience.
- [ ] **Quote-to-Booking Flow**: Ensure external clients can request a quote and convert it to a booking seamlessly.
- [ ] **Status Updates**: Email notifications via SendGrid/Resend when Shipment status changes.

---

### Recommended Next Step
**Restoring the Interactive Map** or **Enhancing Smart Upload** are the two highest impact items.
