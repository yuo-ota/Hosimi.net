"use client";

import { LatLng } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MapController from "./MapController";
import "leaflet/dist/leaflet.css";
import "@/utils/initLeaflet";
import { GeoLocation } from "@/type/GeoLocation";

import marker from '@/assets/marker-icon-2x.png';
import { Icon } from 'leaflet'
const myIcon = new Icon({
  iconUrl: marker.src,
  iconSize: [25, 41]
})

type MapProps = {
  userPosition: GeoLocation;
  className?: string;
};

const Map = ({ userPosition, className = "" }: MapProps) => {
  if (userPosition.latitude === null || userPosition.longitude === null) {
    return <></>;
  }
  return (
    <>
      <MapContainer
        center={new LatLng(userPosition.latitude, userPosition.longitude)}
        zoom={13}
        scrollWheelZoom={true}
        className={`${className} flex-1 rounded-lg h-full w-full`}
      >
        <MapController userPosition={userPosition} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userPosition.latitude !== null && userPosition.longitude !== null && (
          <Marker position={[userPosition.latitude, userPosition.longitude]}  icon={myIcon} />
        )}
      </MapContainer>
    </>
  );
};

export default Map;
