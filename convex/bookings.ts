import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createBooking = mutation({
  args: {
    quoteId: v.string(),
    carrierQuoteId: v.string(),
    customerDetails: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      company: v.string(),
    }),
    pickupDetails: v.object({
      address: v.string(),
      date: v.string(),
      timeWindow: v.string(),
      contactPerson: v.string(),
      contactPhone: v.string(),
    }),
    deliveryDetails: v.object({
      address: v.string(),
      date: v.string(),
      timeWindow: v.string(),
      contactPerson: v.string(),
      contactPhone: v.string(),
    }),
    specialInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Link to current user when available
    const identity = await ctx.auth.getUserIdentity();
    let linkedUserId: any = null;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
        .unique();
      if (user) linkedUserId = user._id;
    }

    // Validate quote exists and carrier option is valid
    const quote = await ctx.db
      .query("quotes")
      .withIndex("byQuoteId", (q) => q.eq("quoteId", args.quoteId))
      .unique();
    if (!quote) {
      throw new Error("Invalid quoteId: quote not found");
    }

    const selected = (quote.quotes as any[] | undefined)?.find((q) => q.carrierId === args.carrierQuoteId);
    if (!selected) {
      throw new Error("Invalid carrierQuoteId for this quote");
    }

    // Optional: enforce validity window if present
    try {
      const validUntil = selected.validUntil ? Date.parse(selected.validUntil) : undefined;
      if (validUntil && Date.now() > validUntil) {
        throw new Error("Selected quote has expired");
      }
    } catch (e) {
      // If parsing fails, do not block; rely on manual override
    }

    // Generate booking ID
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create booking
    const docId = await ctx.db.insert("bookings", {
      bookingId,
      quoteId: args.quoteId,
      carrierQuoteId: args.carrierQuoteId,
      status: "confirmed",
      customerDetails: args.customerDetails,
      pickupDetails: args.pickupDetails,
      deliveryDetails: args.deliveryDetails,
      specialInstructions: args.specialInstructions,
      userId: linkedUserId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as any);

    return { bookingId, docId };
  },
});

export const listMyBookings = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("bookings")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getBooking = query({
  args: { bookingId: v.string() },
  handler: async (ctx, { bookingId }) => {
    return await ctx.db
      .query("bookings")
      .withIndex("byBookingId", (q) => q.eq("bookingId", bookingId))
      .unique();
  },
});

// Admin: list all bookings (for stats/dashboard)
export const listBookings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

export const updateBookingStatus = mutation({
  args: {
    bookingId: v.string(),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { bookingId, status, notes }) => {
    const booking = await ctx.db
      .query("bookings")
      .withIndex("byBookingId", (q) => q.eq("bookingId", bookingId))
      .unique();
    
    if (!booking) {
      throw new Error("Booking not found");
    }

    await ctx.db.patch(booking._id, {
      status,
      notes,
      updatedAt: Date.now(),
    });

    return booking._id;
  },
});