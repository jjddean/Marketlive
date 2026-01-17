# 🚀 Project Implementation Plan

## 📋 Quote & Booking
> Instant quotes for air/land shipping lanes with direct booking capability.
- [ ] **Instant Quotes**: Implement logic for real-time Air & Land rate calculations.
- [ ] **Direct Booking**: Connect "Book This Rate" to a confirmed booking state in the DB.
- [ ] **Validation**: Ensure all 5 steps of the Quote Wizard validate correctly before submission.
  - [ ] Add `zod` schema validation for QuoteRequestForm.
  - [ ] Prevent empty API calls (only fetch rates if weight/dims exist).
- [ ] **Notifications**: Implement Booking Confirmation Email.
  - [ ] Trigger `sendEmail` internal action upon successful `createBooking`.
  - [ ] Design email template with booking details (Origin, Dest, Price).

## 📄 Digital Documentation
> Streamlined creation and exchange of Bills of Lading, Air Waybills, and commercial invoices.
- [ ] **Template Management**: Create standard HTML/CSS templates for B/L, AWB, and Invoice.
- [ ] **PDF Generation**: Implement logic (or mock) to render these templates to PDF for download.
- [ ] **Auto-Generation**: Trigger document creation automatically when a Booking is confirmed.
- [ ] **External Sharing**: Ensure the `generateShareLink` functionality works for public access to these docs.
- [ ] **Bill of Lading (B/L)**: Auto-generate PDF based on booking data.
- [ ] **Air Waybill (AWB)**: Auto-generate PDF for air freight.
- [ ] **Commercial Invoice**: Create template and population logic.
- [ ] **Exchange Workflow**: Allow users/admins to view and easy-share these documents.

## 📍 Real-Time Tracking
> Live shipment updates integrated with carrier APIs for complete visibility.
- [ ] **Carrier Integration**: Connect to carrier tracking endpoints (or mock for dev).
- [ ] **Simulation Mode**: Create a dev tool/admin action to manually advance shipment status/locations.
- [ ] **Unified Timeline**: Ensure the UI displays the full event history (Origin -> Transit -> Dest) from `trackingEvents`.
- [ ] **Data-Driven Map**: Link `LiveVesselMap` to the actual `currentLocation` coordinates in the DB.
- [ ] **Exception Handling**: Visual alerts for shipments with "Risk Factors" or delayed ETAs.

## 💳 Secure Payments
> Integrated payment processing with transparent invoicing and billing management.
- [ ] **Automated Invoicing**: Ensure `createBooking` creates a `paymentAttempt` record (pending invoice).
- [ ] **Payment Flow**: Implement a "Pay Now" action that simulates a Stripe/Paddle checkout.
- [ ] **Strict Linkage**: Ensure invoices are tightly coupled to the `bookingId` and `shipmentId`.
- [ ] **Billing Dashboard**: Verify `PaymentsPage.tsx` correctly displays real data from `paymentAttempts`.
