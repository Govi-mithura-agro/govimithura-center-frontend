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
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Signup";

function MainLayout() {
  return (
    <div className="App w-screen h-screen overflow-x-hidden">
      <div className="flex flex-1 justify-start items-start bg-[#f5faff]">
        <div className="fixed">
          <ImportedSideMenu />
        </div>
        <div className="flex-1 h-full overflow-x-hidden overflow-y-auto ml-[270px] w-[calc(100%-271px)]">
          <NavBar />
          <div className="content">
            <Routes>
              <Route path="/dashboard" element={<DashBoard />} />
              
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
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/measure" element={<Mesure />} />
        <Route path="/pointAddingWeb" element={<PointAddingWeb />} />
        <Route path="/resizemap" element={<ResizeMap />} />

        {/* Main Application Routes */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
