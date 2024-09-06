import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
function CropPrediction() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch locations from the API
    axios.get("http://localhost:5000/api/locations")
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  return (
    <MapContainer center={[7.8731, 80.7718]} zoom={7} style={{ height: "500px", width: "50%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, index) => (
        <CircleMarker
          key={index}
          center={location.coordinates}
          fillColor="green"
          color="black"
          fillOpacity={0.4}
        >
          <Popup>
            <div>
              <strong>Province:</strong> {location.province}<br />
              <strong>District:</strong> {location.district}<br />
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default CropPrediction