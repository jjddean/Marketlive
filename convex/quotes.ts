import { internalMutation, mutation, query } from "./_generated/server"
import { internal, api } from "./_generated/api"
import { v } from "convex/values"
import { calculateShippingPrice, estimateTransitTime } from "./pricing";

export const createQuote = mutation({
  args: {
    request: v.object({
      origin: v.string(),
      destination: v.string(),
      serviceType: v.string(),
      cargoType: v.string(),
      weight: v.string(),
      dimensions: v.object({ length: v.string(), width: v.string(), height: v.string() }),
      value: v.string(),
      incoterms: v.string(),
      urgency: v.string(),
      additionalServices: v.array(v.string()),
      contactInfo: v.object({ name: v.string(), email: v.string(), phone: v.string(), company: v.string() }),
    }),
    response: v.object({
      quoteId: v.string(),
      status: v.string(),
      quotes: v.array(v.object({
        carrierId: v.string(),
        carrierName: v.string(),
        serviceType: v.string(),
        transitTime: v.string(),
        price: v.object({
          amount: v.number(),
          currency: v.string(),
          breakdown: v.object({ baseRate: v.number(), fuelSurcharge: v.number(), securityFee: v.number(), documentation: v.number() }),
        }),
        validUntil: v.string(),
      })),
    }),
  },
  handler: async (ctx, { request, response }) => {
    // Link to current user when available (map Clerk subject -> users.externalId)
    const identity = await ctx.auth.getUserIdentity();
    let linkedUserId: any = null;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
        .unique();
      if (user) linkedUserId = user._id as any;
    }

    const quoteDoc: any = {
      ...request,
      ...response,
      createdAt: Date.now(),
    };
    if (linkedUserId) quoteDoc.userId = linkedUserId;

    const docId = await ctx.db.insert("quotes", quoteDoc);

    return docId;
  },
});

export const createInstantQuoteAndBooking = mutation({
  args: {
    request: v.object({
      origin: v.string(),
      destination: v.string(),
      serviceType: v.string(),
      cargoType: v.string(),
      weight: v.string(),
      dimensions: v.object({ length: v.string(), width: v.string(), height: v.string() }),
      value: v.string(),
      incoterms: v.string(),
      urgency: v.string(),
      additionalServices: v.array(v.string()),
      contactInfo: v.object({ name: v.string(), email: v.string(), phone: v.string(), company: v.string() }),
    }),
  },
  handler: async (ctx, { request }) => {
    // Calculate real price based on route, weight, and service type
    const pricing = calculateShippingPrice({
      origin: request.origin,
      destination: request.destination,
      weight: request.weight,
      serviceType: request.serviceType,
      cargoType: request.cargoType,
    });

    const transitTime = estimateTransitTime(request.origin, request.destination, request.serviceType);

    // Define a long list of carriers based on service type
    const carrierTemplates = request.serviceType === 'sea'
      ? [
        { id: "MAERSK", name: "Maersk Line", multiplier: 1.0, logo: "🚢" },
        { id: "MSC", name: "MSC Mediterranean Shipping", multiplier: 1.05, logo: "🚢" },
        { id: "COSCO", name: "COSCO Shipping", multiplier: 0.95, logo: "🚢" },
        { id: "HAPAG", name: "Hapag-Lloyd", multiplier: 1.02, logo: "🚢" },
        { id: "MAERSK", name: "Maersk Line", multiplier: 1.0 },
        { id: "MSC", name: "MSC Mediterranean Shipping", multiplier: 1.08 },
        { id: "COSCO", name: "COSCO Shipping", multiplier: 0.95 }
      ]
      : [
        { id: "DHL", name: "DHL Express", multiplier: 1.0 },
        { id: "FEDEX", name: "FedEx Express", multiplier: 1.12 },
        { id: "UPS", name: "UPS Worldwide", multiplier: 1.05 }
      ];

    // Generate real calculated quotes for each carrier
    const quotes = carrierTemplates.map(carrier => {
      const carrierPrice = Math.round(pricing.total * carrier.multiplier * 100) / 100;
      return {
        carrierId: carrier.id,
        carrierName: carrier.name,
        serviceType: request.serviceType || "air",
        transitTime: transitTime,
        price: {
          amount: carrierPrice,
          currency: "USD",
          breakdown: {
            baseRate: Math.round(pricing.baseRate * carrier.multiplier * 100) / 100,
            fuelSurcharge: Math.round(pricing.fuelSurcharge * carrier.multiplier * 100) / 100,
            securityFee: pricing.securityFee,
            documentation: pricing.documentation,
          },
        },
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
    });

    // Link to current user when available
    const identity = await ctx.auth.getUserIdentity();
    let linkedUserId: any = null;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
        .unique();
      if (user) linkedUserId = user._id as any;
    }

    const quoteId = `QT-${Date.now()}`;
    const docId = await ctx.db.insert("quotes", {
      ...request,
      quoteId,
      status: "success",
      quotes,
      userId: linkedUserId,
      createdAt: Date.now(),
    } as any);

    return { quoteId, docId };
  },
});

export const listQuotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quotes").order("desc").collect();
  },
});

export const getQuote = query({
  args: { quoteId: v.string() },
  handler: async (ctx, { quoteId }) => {
    return await ctx.db
      .query("quotes")
      .withIndex("byQuoteId", (q) => q.eq("quoteId", quoteId))
      .unique();
  },
});

// New: list quotes for the current authenticated user
export const listMyQuotes = query({
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
      .query("quotes")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});