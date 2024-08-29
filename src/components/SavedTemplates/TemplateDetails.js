import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import "./TemplateDetails.css";
import { TbContainer } from "react-icons/tb";
import { HiChartPie } from "react-icons/hi2";
import { TbVector } from "react-icons/tb";
import { ImLocation2 } from "react-icons/im";
import { Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";

const TemplateDetails = ({
  onBackToSidebar,
  template,
  handleEditTemplateClick,
}) => {
  const id = template._id;
  const [currentPage, setCurrentPage] = useState(null);
  const [animatePage, setAnimatePage] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation();
    handleEditTemplateClick(template);
  };
  const [currentLocation, setCurrentLocation] = useState(null);
  const [points, setPoints] = useState([]);
  const [region, setRegion] = useState(null);

  const handleBackClick = () => {
    setAnimatePage(false);
    setTimeout(() => {
      setCurrentPage(null);
    }, 300);
  };

  const navigateToRegister = () => {
    navigate(`/Managemap/${id}`); // Navigate to ManageMap page with template ID
  };

  

  const handleResizeMapClick = () => {
    navigate("/resizemap", {
      state: {
        templateId: template._id,
        templateArea: template.area,
        templatePerimeter: template.perimeter,
      },
    });
  };

  return (
    <div>
      {!currentPage && (
        <div className="main-div">
          <div className="outer-div">
            <div className="div-01">
              <MdArrowBack onClick={onBackToSidebar} className="backBtn" />
              <p className="templateName-text">{template.templateName}</p>
              <div className="edit-icon-container">
                <BiEdit className="edit-icon" onClick={handleEdit} />
              </div>
            </div>
            <div className="div-02">
              <div className="map-img-container">
                <img
                  src={template.imageUrl}
                  alt="mapImage"
                  className="map-img"
                />
              </div>
              <div className="button-container">
                
                <Button
                  type="primary"
                  className="action-btn"
                  onClick={handleResizeMapClick}
                >
                  Resize Map
                </Button>
              </div>
              <hr className="breaker" />
            </div>
            <div className="div-04">
              <p className="bold-text">Land Info</p>
              <div className="info-grid">
                <div className="info-container">
                  <TbContainer className="info-icon" />
                  <div>
                    <p>Type</p>
                    <p className="bold-text">{template.landType}</p>
                  </div>
                </div>
                <div className="info-container">
                  <HiChartPie className="info-icon" />
                  <div>
                    <p>Area</p>
                    <p className="bold-text">{parseFloat(template.area).toFixed(2)} perch</p>
                  </div>
                </div>
                <div className="info-container">
                  <TbVector className="info-icon" />
                  <div>
                    <p>Perimeter</p>
                    <p className="bold-text">{parseFloat(template.perimeter).toFixed(2)} km</p>
                  </div>
                </div>
                <div className="info-container">
                  <ImLocation2 className="info-icon" />
                  <div>
                    <p>Location</p>
                    <p className="bold-text">{template.location}</p>
                  </div>
                </div>
              </div>
              <hr className="breaker" />
              <div className="description-div">
                <p className="bold-text">Description</p>
                <p className="description-text">{template.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          transform: animatePage ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          backgroundColor: "whitesmoke",
          overflow: "auto",
        }}
      >
        
        
      </div>
    </div>
  );
};

export default TemplateDetails;
