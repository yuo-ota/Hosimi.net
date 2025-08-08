"use client";

import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";

type MapContainerProps = {
  userPosition: GeoLocation;
};

const MapController = ({ userPosition }: MapContainerProps) => {
  const map = useMap();
  const [prevUserPosition, setPrevUserPosition] = useState(userPosition);

  if (userPosition !== prevUserPosition) {
    setPrevUserPosition(userPosition);
    if (userPosition.latitude && userPosition.longitude) {
      map.panTo([userPosition.latitude, userPosition.longitude]);
    }
  }

  return null;
};

export default MapController;
