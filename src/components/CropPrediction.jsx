import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { NotFoundImage } from "../assets";
import { Spin } from 'antd';
import { Color } from "antd/es/color-picker";

const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};
const content = <div style={contentStyle} />;
function CropPrediction() {

  const [locations, setLocations] = useState([]);
  const [cropFactor, setCropFactor] = useState(null); // State to store crop factors
  const [crops, setCrops] = useState(null); // State to store
  const [selectedDistrict, setSelectedDistrict] = useState("Colombo"); // Default to Colombo
  const [selectedProvince, setSelectedProvince] = useState("Western"); // Default to Western
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

  // Fetch crop factors for the default district (Colombo) and Fetch crops for the default province (Western)
  useEffect(() => {
    fetchCropFactorsAndCrops(selectedDistrict, selectedProvince);
  }, [selectedDistrict, selectedProvince]);

  // Function to fetch crop factors based on district and crops based on province
  const fetchCropFactorsAndCrops = (district, province) => {
    axios
      .get(`http://localhost:5000/api/cropfactors/getcropfactors/${district}`)
      .then((response) => {
        if (response.data && response.data.cropfactor) {
          setCropFactor(response.data.cropfactor);
          setNotFound(false); // Reset the notFound state
        } else {
          setCropFactor(null);
          setNotFound(true); // Set notFound to true when no data is found
        }
      })
      .catch((error) => {
        console.error("Error fetching crop factors:", error);
        setCropFactor(null);
        setNotFound(true); // Set notFound to true when an error occurs
      });

    axios
      .get(`http://localhost:5000/api/crops/getcropdata/${province}`)
      .then((response) => {
        if (response.data && response.data.crop) {
          setCrops(response.data.crop);
          setNotFound(false); // Reset the notFound state
        } else {
          setCrops(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching crops:", error);
        setCrops(null);
      });
  };

  // Handle marker click and fetch related crop factors
  const handleMarkerClick = (district, province) => {
    setSelectedDistrict(district);  // Update the selected district
    setSelectedProvince(province);  // Update the selected province
    fetchCropFactorsAndCrops(district, province);     // Fetch crop factors for the selected district
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Map Section */}
      <MapContainer center={[7.8731, 80.7718]} zoom={7} style={{ height: "540px", width: "50%", borderRadius: "10px", marginLeft: "15px", marginTop: "10px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map((location, index) => (
          <CircleMarker
            key={index}
            center={location.coordinates}
            fillColor="green"
            color="black"
            fillOpacity={0.4}
            eventHandlers={{
              click: () => handleMarkerClick(location.district, location.province), // Fetch data on marker click
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
        <div className="w-[585px] h-[46px] px-6 mb-3 -mt-5 py-[7px] bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex">
          <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
            <div className="grow shrink basis-0 h-[30px] justify-center items-center gap-2.5 flex">
              <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold font-['Poppins'] leading-[30px]">Crop Factors for <span className="text-[#0c883d]">{selectedDistrict}</span></div>
            </div>
          </div>
        </div>
        {notFound ? (
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        ) : cropFactor ? (
          <div>
            <div className="w-[585px] h-[235px] p-6 bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex">
              <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold font-['Poppins'] leading-[30px]">Soil Properties</div>
              </div>
              <div className="self-stretch h-[126px] flex-col justify-start items-start flex">
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Soil Type :</div>
                    </div>
                  </div>
                  <div className="w-80 text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.soiltype}</div>
                </div>
                <div className="self-stretch h-[0px] border border-gray-200"></div>
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Soil pH :</div>
                    </div>
                  </div>
                  <div className="w-[326px] text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.soilph}</div>
                </div>
                <div className="self-stretch h-[0px] border border-gray-200"></div>
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="self-stretch text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Nutrient Content :</div>
                    </div>
                  </div>
                  <div className="w-[270px] text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.nutrientcontent}</div>
                </div>
              </div>
            </div>

            <div className="w-[585px] h-[235px] p-6 mt-3 bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex">
              <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold font-['Poppins'] leading-[30px]">Weather Conditions</div>
              </div>
              <div className="self-stretch h-[126px] flex-col justify-start items-start flex">
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Temperature :</div>
                    </div>
                  </div>
                  <div className="w-80 text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.temperature} °C</div>
                </div>
                <div className="self-stretch h-[0px] border border-gray-200"></div>
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Rainfall :</div>
                    </div>
                  </div>
                  <div className="w-[326px] text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.rainfall} mm</div>
                </div>
                <div className="self-stretch h-[0px] border border-gray-200"></div>
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="self-stretch text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Humidity :</div>
                    </div>
                  </div>
                  <div className="w-[270px] text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.humidity} %</div>
                </div>
              </div>
            </div>


            <div className="w-[610px] h-[235px] p-6 mt-3 bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex relative right-[630px]">
              <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold font-['Poppins'] leading-[30px]">Geographical Factors</div>
              </div>
              <div className="self-stretch h-[126px] flex-col justify-start items-start flex">
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Altitude :</div>
                    </div>
                  </div>
                  <div className="w-80 text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.altitude} m</div>
                </div>
                <div className="self-stretch h-[0px] border border-gray-200"></div>
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Topography :</div>
                    </div>
                  </div>
                  <div className="w-[326px] text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.topography}</div>
                </div>
              </div>
            </div>

            <div className="w-[585px] h-[235px] p-6 bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex relative bottom-[235px]">
              <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold font-['Poppins'] leading-[30px]">Water Availability</div>
              </div>
              <div className="self-stretch h-[126px] flex-col justify-start items-start flex">
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Irrigation Systems :</div>
                    </div>
                  </div>
                  <div className="w-80 text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.irrigationsystems}</div>
                </div>
                <br />
                <div className="self-stretch h-[0px] border border-gray-200"></div>
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Water Quality :</div>
                    </div>
                  </div>
                  <div className="w-[326px] text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.waterquality}</div>
                </div>
              </div>
            </div>

            <div className="w-[610px] h-[235px] p-6 bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex relative right-[630px] bottom-[220px]">
              <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold font-['Poppins'] leading-[30px]">Crop Type</div>
              </div>
              <div className="self-stretch h-[126px] flex-col justify-start items-start flex">
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Variety Selection :</div>
                    </div>
                  </div>
                  <div className="w-80 text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.varietyselection}</div>
                </div>
                <br />
                <div className="self-stretch h-[0px] border border-gray-200"></div>
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Growth Cycle :</div>
                    </div>
                  </div>
                  <div className="w-[326px] text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.growthcycle}</div>
                </div>
              </div>
            </div>

            <div className="w-[585px] h-[235px] p-6 bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex relative bottom-[455px]">
              <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold font-['Poppins'] leading-[30px]">Pests and Diseases</div>
              </div>
              <div className="self-stretch h-[126px] flex-col justify-start items-start flex">
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Pest Pressure :</div>
                    </div>
                  </div>
                  <div className="w-80 text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.pestpressure}</div>
                </div>
                <div className="self-stretch h-[0px] border border-gray-200"></div>
                <br />
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Disease Incidence :</div>
                    </div>
                  </div>
                  <div className="w-[326px] text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.diseaseincidence}</div>
                </div>
              </div>
            </div>

            <div className="w-[610px] h-[235px] p-6 bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex relative right-[630px] bottom-[440px]">
              <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold font-['Poppins'] leading-[30px]">Farming Practices</div>
              </div>
              <div className="self-stretch h-[126px] flex-col justify-start items-start flex">
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Crop Rotation :</div>
                    </div>
                  </div>
                  <div className="w-80 text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.croprotation}</div>
                </div>
                <div className="self-stretch h-[0px] border border-gray-200"></div>
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Fertilizer Use :</div>
                    </div>
                  </div>
                  <div className="w-[326px] text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.fertilizeruse}</div>
                </div>
              </div>
            </div>

            <div className="w-[585px] h-[235px] p-6 bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex relative bottom-[675px]">
              <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold font-['Poppins'] leading-[30px]">Market Factors</div>
              </div>
              <div className="self-stretch h-[126px] flex-col justify-start items-start flex">
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Demand and Price Trends :</div>
                    </div>
                  </div>
                  <div className="w-80 text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.demandandpricetrends}</div>
                </div>
                <br />
                <div className="self-stretch h-[0px] border border-gray-200"></div>
                <br />
                <div className="self-stretch py-[9px] justify-start items-center inline-flex">
                  <div className="flex items-center justify-start h-6 gap-2 grow shrink basis-0">
                    <div className="inline-flex flex-col items-start justify-start grow shrink basis-0">
                      <div className="w-[136.44px] text-gray-900 text-base font-semibold font-['Poppins'] leading-normal">Supply Chain Efficiency :</div>
                    </div>
                  </div>
                  <div className="w-[326px] text-right text-gray-900 text-base font-normal font-['Poppins'] leading-normal">{cropFactor.supplychainefficiency}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-5">
            <img src={NotFoundImage} alt="Not Found" />
          </div>
        )}
        <div className="w-[1214px] h-[46px] px-6 py-[7px] bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex relative right-[630px] bottom-[650px]">
          <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
            <div className="grow shrink basis-0 h-[30px] justify-center items-center gap-2.5 flex">
              <div className="grow shrink basis-0 text-gray-900 text-xl font-semibold font-['Poppins'] leading-[30px]">Suitable Crops for <span className="text-[#0c883d]">{selectedDistrict}</span></div>
            </div>
          </div>
        </div>
        {/* Crop Data Section */}
        {cropFactor && crops && crops.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-semibold">Crop Data for {selectedProvince}</h3>
            <div className="w-[585px] p-6 bg-white rounded-[9px] flex-col justify-start items-start gap-4 inline-flex">
              <ul>
                {crops.map((crop, index) => (
                  <li key={index}>
                    <strong>{crop.name}</strong> - {crop.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
export default CropPrediction