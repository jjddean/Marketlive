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

    return (
        <div className={className} style={{ height }}>
            <MapContainer
                center={defaultCenter}
                zoom={focused ? 8 : 4}
                style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {points.map((p) => (
                    <Marker key={p.shipmentId} position={[p.lat, p.lng]}>
                        <Popup>
                            <div className="text-sm">
                                <div className="font-semibold">{p.shipmentId}</div>
                                <div className="text-gray-500">{p.status}</div>
                                <div>
                                    {p.city}{p.city && p.country ? ", " : ""}{p.country}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
