import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
function CropPrediction() {

  const [locations, setLocations] = useState([]);
  const [cropFactor, setCropFactor] = useState(null); // State to store crop factors
  const [selectedDistrict, setSelectedDistrict] = useState("Colombo"); // Default to Colombo
  const [notFound, setNotFound] = useState(false); // State to track if crop factors are not found


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

  // Fetch crop factors for the default district (Colombo)
  useEffect(() => {
    fetchCropFactors(selectedDistrict);
  }, [selectedDistrict]);

  // Function to fetch crop factors based on district
  const fetchCropFactors = (district) => {
    axios.get(`http://localhost:5000/api/cropfactors/getcropfactors/${district}`)
      .then(response => {
        if (response.data && response.data.cropfactor) {
          setCropFactor(response.data.cropfactor);
          setNotFound(false);  // Reset the notFound state
        } else {
          setCropFactor(null);
          setNotFound(true);  // Set notFound to true when no data is found
        }
      })
      .catch(error => {
        console.error("Error fetching crop factors:", error);
        setCropFactor(null);
        setNotFound(true);  // Set notFound to true when an error occurs
      });
  };

  // Handle marker click and fetch related crop factors
  const handleMarkerClick = (district) => {
    setSelectedDistrict(district);  // Update the selected district
    fetchCropFactors(district);     // Fetch crop factors for the selected district
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Map Section */}
      <MapContainer center={[7.8731, 80.7718]} zoom={7} style={{ height: "500px", width: "50%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map((location, index) => (
          <CircleMarker
            key={index}
            center={location.coordinates}
            fillColor="green"
            color="black"
            fillOpacity={0.4}
            eventHandlers={{
              click: () => handleMarkerClick(location.district), // Fetch data on marker click
            }}
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

      {/* Crop Factor Details Section */}
      <div style={{ width: "50%", padding: "20px" }}>
        <h3>Crop Factors for {selectedDistrict}</h3>
        {notFound ? (
          <p>Result not found</p>
        ) : cropFactor ? (
          <div>
            <p><strong>Soil Type:</strong> {cropFactor.soiltype}</p>
            <p><strong>Soil pH:</strong> {cropFactor.soilph}</p>
            <p><strong>Nutrient Content:</strong> {cropFactor.nutrientcontent}</p>
            <p><strong>Temperature:</strong> {cropFactor.temperature} °C</p>
            <p><strong>Rainfall:</strong> {cropFactor.rainfall} mm</p>
            <p><strong>Humidity:</strong> {cropFactor.humidity} %</p>
            <p><strong>Altitude:</strong> {cropFactor.altitude} m</p>
            <p><strong>Topography:</strong> {cropFactor.topography}</p>
            <p><strong>Irrigation Systems:</strong> {cropFactor.irrigationsystems}</p>
            <p><strong>Water Quality:</strong> {cropFactor.waterquality}</p>
            <p><strong>Variety Selection:</strong> {cropFactor.varietyselection}</p>
            <p><strong>Growth Cycle:</strong> {cropFactor.growthcycle}</p>
            <p><strong>Pest Pressure:</strong> {cropFactor.pestpressure}</p>
            <p><strong>Disease Incidence:</strong> {cropFactor.diseaseincidence}</p>
            <p><strong>Crop Rotation:</strong> {cropFactor.croprotation}</p>
            <p><strong>Fertilizer Use:</strong> {cropFactor.fertilizeruse}</p>
            <p><strong>Demand & Price Trends:</strong> {cropFactor.demandandpricetrends}</p>
            <p><strong>Supply Chain Efficiency:</strong> {cropFactor.supplychainefficiency}</p>
          </div>
        ) : (
          <p>Loading crop factors...</p>
        )}
      </div>
    </div>
  );
}

export default CropPrediction