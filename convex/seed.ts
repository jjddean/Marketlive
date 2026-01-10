import { mutation } from "./_generated/server";

// Seed function to create test shipments with real location data
export const seedTestShipments = mutation({
    args: {},
    handler: async (ctx) => {
        // Get current user
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Must be logged in to seed data");

        const user = await ctx.db
            .query("users")
            .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const testShipments = [
            {
                shipmentId: `SH-${Date.now()}-001`,
                status: "in_transit",
                carrier: "Maersk Line",
                trackingNumber: "MSKU1234567",
                service: "Ocean Freight",
                estimatedDelivery: new Date(Date.now() + 7 * 86400000).toISOString(),
                currentLocation: {
                    city: "Hamburg",
                    state: "Hamburg",
                    country: "Germany",
                    coordinates: { lat: 53.5511, lng: 9.9937 }
                },
                shipmentDetails: {
                    weight: "2500 kg",
                    dimensions: "40ft Container",
                    origin: "London, UK",
                    destination: "New York, USA",
                    value: "£125,000"
                },
                userId: user._id,
                createdAt: Date.now(),
                lastUpdated: Date.now(),
            },
            {
                shipmentId: `SH-${Date.now()}-002`,
                status: "in_transit",
                carrier: "DHL Express",
                trackingNumber: "DHL9876543",
                service: "Air Freight Express",
                estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString(),
                currentLocation: {
                    city: "Frankfurt",
                    state: "Hesse",
                    country: "Germany",
                    coordinates: { lat: 50.1109, lng: 8.6821 }
                },
                shipmentDetails: {
                    weight: "75 kg",
                    dimensions: "120x80x60 cm",
                    origin: "Tokyo, Japan",
                    destination: "Paris, France",
                    value: "£45,000"
                },
                userId: user._id,
                createdAt: Date.now(),
                lastUpdated: Date.now(),
            },
            {
                shipmentId: `SH-${Date.now()}-003`,
                status: "delivered",
                carrier: "COSCO Shipping",
                trackingNumber: "COSCO7654321",
                service: "Ocean Freight Standard",
                estimatedDelivery: new Date(Date.now() - 2 * 86400000).toISOString(),
                currentLocation: {
                    city: "Rotterdam",
                    state: "South Holland",
                    country: "Netherlands",
                    coordinates: { lat: 51.9225, lng: 4.4792 }
                },
                shipmentDetails: {
                    weight: "5000 kg",
                    dimensions: "2x 20ft Containers",
                    origin: "Shanghai, China",
                    destination: "Rotterdam, NL",
                    value: "£250,000"
                },
                userId: user._id,
                createdAt: Date.now() - 10 * 86400000,
                lastUpdated: Date.now(),
            },
        ];

        const insertedIds = [];
        for (const shipment of testShipments) {
            const id = await ctx.db.insert("shipments", shipment as any);
            insertedIds.push(id);
        }

        return { message: `Created ${insertedIds.length} test shipments`, ids: insertedIds };
    },
});
