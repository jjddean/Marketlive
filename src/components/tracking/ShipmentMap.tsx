"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet icon paths for Vite bundling
if (typeof window !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
}

export type ShipmentPoint = {
    shipmentId: string;
    status?: string;
    city?: string;
    country?: string;
    lat: number;
    lng: number;
};

interface ShipmentMapProps {
    shipments: any[];
    focusedId?: string | null;
    className?: string;
    height?: number;
}

export default function ShipmentMap({
    shipments,
    focusedId,
    className,
    height = 360,
}: ShipmentMapProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const points: ShipmentPoint[] = useMemo(() => {
        return (shipments || [])
            .map((s) => {
                const coords = s?.currentLocation?.coordinates;
                if (!coords || typeof coords.lat !== "number" || typeof coords.lng !== "number") return null;
                return {
                    shipmentId: s.shipmentId,
                    status: s.status,
                    city: s?.currentLocation?.city,
                    country: s?.currentLocation?.country,
                    lat: coords.lat,
                    lng: coords.lng,
                } as ShipmentPoint;
            })
            .filter(Boolean) as ShipmentPoint[];
    }, [shipments]);

    const focused = useMemo(
        () => points.find((p) => p.shipmentId === focusedId) || null,
        [points, focusedId]
    );

    const defaultCenter: [number, number] = useMemo(() => {
        if (focused) return [focused.lat, focused.lng];
        return points.length > 0 ? [points[0].lat, points[0].lng] : [51.5074, -0.1278]; // London default
    }, [points, focused]);

    // Don't render on server
    if (!isClient) {
        return (
            <div className={className} style={{ height }}>
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500 rounded-lg">
                    <span className="text-lg">🗺️ Loading map...</span>
                </div>
            </div>
        );
    }

    // No points? Show placeholder
    if (points.length === 0) {
        return (
            <div className={className} style={{ height }}>
                <div className="flex items-center justify-center h-full bg-blue-50 text-blue-600 rounded-lg border-2 border-blue-200">
                    <div className="text-center">
                        <div className="text-4xl mb-2">🗺️</div>
                        <p className="text-sm font-medium">No shipments with location data</p>
                        <p className="text-xs">Shipments will appear here when tracking is available</p>
                    </div>
                </div>
            </div>
        );
    }

    // TEMPORARY FIX: Return safe placeholder to prevent Leaflet context crash
    return (
        <div className={className} style={{ height }}>
            <div className="w-full h-full bg-blue-50 rounded-lg border border-blue-100 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-lg font-semibold text-blue-900">Map Unavailable</h3>
                <p className="text-sm text-blue-700 max-w-sm">
                    Interactive map is temporarily disabled for maintenance.
                    Shipment tracking data is still available in the list below.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs text-gray-600">
                    {points.slice(0, 4).map(p => (
                        <div key={p.shipmentId} className="bg-white p-2 rounded shadow-sm">
                            <strong>{p.shipmentId}</strong>: {p.status} ({p.city})
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
