import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon not loading in some bundlers
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function MapComponent() {
  return (
    <MapContainer
      center={[10.0485, 76.3274]}
      zoom={16}
      scrollWheelZoom={false}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[10.0482921, 76.330898]}>
        <Popup>Cochin University of Science and Technology (CUSAT)</Popup>
      </Marker>
    </MapContainer>
  );
}