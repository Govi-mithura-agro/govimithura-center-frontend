import React from "react";
import { GoogleMap, useLoadScript, Polygon } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 7.8731,
  lng: 80.7718,
};

const provinces = [
  {
    name: "Central Province",
    paths: [
      { lat: 7.29, lng: 80.63 },
      { lat: 7.34, lng: 80.67 },
      { lat: 7.42, lng: 80.61 },
    ],
    color: "#ff9999",
  },
  {
    name: "Western Province",
    paths: [
      { lat: 6.93, lng: 79.84 },
      { lat: 7.02, lng: 79.94 },
      { lat: 7.04, lng: 80.0 },
    ],
    color: "#99ccff",
  },
  {
    name: "North Central Province",
    paths: [
      { lat: 8.3114, lng: 80.4037 },
      { lat: 8.34, lng: 80.45 },
      { lat: 8.37, lng: 80.5 },
    ],
    color: "#ff0000",
  },
  // Add other provinces as needed
];

function SriLankaMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Use your actual API key here
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={7}
      center={center}
      options={{
        disableDefaultUI: true,
        zoomControl: true, // Enable zoom control
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {provinces.map((province, index) => (
        <Polygon
          key={index}
          paths={province.paths}
          options={{
            fillColor: province.color,
            fillOpacity: 0.4,
            strokeColor: province.color,
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      ))}
    </GoogleMap>
  );
}

export default SriLankaMap;
