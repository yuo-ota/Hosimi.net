import Leaflet from "leaflet";

const DefaultIcon = Leaflet.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconAnchor: [12, 41],
  popupAnchor: [0, -32],
});
Leaflet.Marker.prototype.options.icon = DefaultIcon;
