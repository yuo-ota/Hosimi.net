"use client";

import { useMap, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { GeoLocation } from "@/type/GeoLocation";

type MapContainerProps = {
  userPosition: GeoLocation;
  onMapClick?: (position: GeoLocation) => void;
};

const MapController = ({ userPosition, onMapClick }: MapContainerProps) => {
  const map = useMap();
  const [prevUserPosition, setPrevUserPosition] = useState(userPosition);

  if (userPosition !== prevUserPosition) {
    setPrevUserPosition(userPosition);
    if (userPosition.latitude && userPosition.longitude) {
      map.panTo([userPosition.latitude, userPosition.longitude]);
    }
  }

  useMapEvents({
    click: (e) => {
      onMapClick?.({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  return null;
};

export default MapController;
