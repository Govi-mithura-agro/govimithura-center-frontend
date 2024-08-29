import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";

const Card = ({
  templateName,
  location,
  date,
  imageUrl,
  onClick,
  onDelete,
  onEdit,
  description,
  landType,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="card-container" onClick={onClick}>
      <BiEdit className="edit-icon" onClick={handleEdit} />
      <RiDeleteBin6Line className="delete-icon" onClick={handleDelete} />
      <div className="card-flex">
        <div className="card-image-container">
          {!imageLoaded && <div className="image-loader"></div>}
          <img
            src={imageUrl}
            className={`card-image ${imageLoaded ? "loaded" : ""}`}
            alt="mapImg"
            onLoad={handleImageLoad}
          />
        </div>
        <div className="card-content">
          <div className="templateName">{templateName}</div>
          <p className="templateLocation">Location : {location}</p>
          <p className="dateText">Date : {date}</p>
          <p className="landType"> landType : {landType} </p>
          <p className="Description"> Description : {description} </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
