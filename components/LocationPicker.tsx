"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// Import مستقیم استایل leaflet (فقط در این کامپوننت)
import "leaflet/dist/leaflet.css";

// رفع مشکل آیکون‌های پیش‌فرض با CDN
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  center: [number, number];       // [lat, lng]
  onLocationChange?: (lat: number, lng: number) => void;
  height?: string;
  zoom?: number;
  readOnly?: boolean;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export function LocationPicker({
  center,
  onLocationChange,
  height = "300px",
  zoom = 15,
  readOnly = false,
}: LocationPickerProps) {
  const [currentPosition, setCurrentPosition] = useState<[number, number]>(center);

  const handleClick = (lat: number, lng: number) => {
    if (readOnly) return;
    setCurrentPosition([lat, lng]);
    if (onLocationChange) {
      onLocationChange(lat, lng);
    }
  };

  return (
    <MapContainer
      center={currentPosition}
      zoom={zoom}
      style={{ height, width: "100%", borderRadius: "0.75rem" }}
      scrollWheelZoom={false}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenterUpdater center={currentPosition} />
      {!readOnly && <MapClickHandler onClick={handleClick} />}
      <Marker position={currentPosition} />
    </MapContainer>
  );
}