import { mutation } from "./_generated/server";

export const moveShipments = mutation({
    args: {},
    handler: async (ctx) => {
        const shipments = await ctx.db.query("shipments").collect();

        for (const ship of shipments) {
            if (ship.status === 'delivered') continue;

            const currentLat = ship.currentLocation.coordinates.lat;
            const currentLng = ship.currentLocation.coordinates.lng;

            // Simple random walk / jitter
            // Move approx 5-10km
            const deltaLat = (Math.random() - 0.5) * 0.1;
            const deltaLng = (Math.random() - 0.5) * 0.1;

            await ctx.db.patch(ship._id, {
                currentLocation: {
                    ...ship.currentLocation,
                    coordinates: {
                        lat: currentLat + deltaLat,
                        lng: currentLng + deltaLng
                    }
                },
                lastUpdated: Date.now()
            });
        }
        return "Moved " + shipments.length + " shipments";
    },
});
