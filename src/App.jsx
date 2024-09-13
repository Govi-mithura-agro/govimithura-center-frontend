import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { NavBar, SideMenu as ImportedSideMenu } from "./components";
import Farmers from "./components/Farmers";
import CropPrediction from "./components/CropPrediction";
import PredictionFactors from "./components/PredictionFactors";
import CropData from "./components/CropData";
import Mesure from "./components/Mesure";
import SavedLands from "./components/SavedLands";
import RequestFertilizers from "./components/RequestFertilizers";
import ManageFertilizers from "./components/ManageFertilizers";
import Appoinment from "./components/Appoinment";
import AllAppoinemnts from "./components/AllAppoinemnts";
import DashBoard from "./components/DashBoard";
import PointAddingWeb from "./components/PointAddingWeb/PointAddingWeb";
import ResizeMap from "./components/ResizeMap/ResizeMap";
import FertilizerData from "./components/FertilizerData";
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App w-screen h-screen overflow-x-hidden">
      <Routes>
        <Route path="/measure" element={<Mesure />} />
        <Route path="/pointAddingWeb" element={<PointAddingWeb />} />
        <Route path="/resizemap" element={<ResizeMap />} />
      </Routes>
        <div className="flex flex-1 justify-start items-start bg-[#f5faff]">
          <div className="fixed">
            <ImportedSideMenu />
          </div>
          <div className="flex-1 h-full overflow-x-hidden overflow-y-auto ml-[270px] w-[calc(100%-271px)]">
            <NavBar />
            <Routes>
              <Route path="/" element={<DashBoard />} />
              <Route path="/farmers" element={<Farmers />} />
              <Route path="/cropprediction" element={<CropPrediction />} />
              <Route path="/croppredictionfactors" element={<PredictionFactors />} />
              <Route path="/cropdata" element={<CropData />} />
              <Route path="/savedlands" element={<SavedLands />} />
              <Route path="/fertilizerrdata" element={<FertilizerData />} />
              <Route path="/Requestfertilizers" element={<RequestFertilizers />} />
              <Route path="/managefertilizer" element={<ManageFertilizers />} />
              <Route path="/appointmentinsights" element={<Appoinment />} />
              <Route path="/allappointment" element={<AllAppoinemnts />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
