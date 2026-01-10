import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const cacheRoute = mutation({
  args: {
    origin: v.string(),
    dest: v.string(),
    profile: v.optional(v.string()),
    points: v.array(v.object({ lat: v.number(), lng: v.number() })),
    distance: v.optional(v.number()),
    duration: v.optional(v.number()),
    ttlMs: v.optional(v.number()),
  },
  handler: async (ctx, { origin, dest, profile, points, distance, duration, ttlMs }) => {
    const key = `${(profile||'car')}::${origin}=>${dest}`
    const now = Date.now()
    const expiresAt = now + (ttlMs ?? 7 * 24 * 60 * 60 * 1000)
    const existing = await ctx.db.query('geoRoutes').withIndex('byKey', q => q.eq('key', key)).unique()
    if (existing) {
      await ctx.db.patch(existing._id, { points, distance, duration, updatedAt: now, expiresAt })
      return existing._id
    }
    return await ctx.db.insert('geoRoutes', { key, origin, dest, profile: profile||'car', points, distance, duration, createdAt: now, updatedAt: now, expiresAt })
  },
})

export const getCachedRoute = query({
  args: { origin: v.string(), dest: v.string(), profile: v.optional(v.string()) },
  handler: async (ctx, { origin, dest, profile }) => {
    const key = `${(profile||'car')}::${origin}=>${dest}`
    const row = await ctx.db.query('geoRoutes').withIndex('byKey', q => q.eq('key', key)).unique()
    if (!row) return null
    if (row.expiresAt && row.expiresAt < Date.now()) return null
    return row
  }
})

