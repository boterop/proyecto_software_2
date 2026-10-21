import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const LocationMarker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      const location = {
        latitude: lat,
        longitude: lng,
      };

      setPosition(event.latlng);
      onSelect(location);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({ value, onChange }) => {
  const defaultPosition = value
    ? [value.latitude, value.longitude]
    : [4.5339, -75.6811];

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{
        height: 400,
        width: "100%",
        borderRadius: 8,
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker onSelect={onChange} />
    </MapContainer>
  );
};

export default LocationPicker;
