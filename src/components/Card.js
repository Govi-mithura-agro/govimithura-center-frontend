import React, { useState } from "react";
import { RiDeleteBin6Line, RiCalculatorLine } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import { FaMapMarkerAlt, FaCalendarAlt, FaRuler } from "react-icons/fa";
import { GiField } from "react-icons/gi";

const Card = ({
  templateName,
  location,
  date,
  area,
  imageUrl,
  onClick,
  onDelete,
  onEdit,
  description,
  landType,
  perimeter,
  onCalculate,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCalculate = (e) => {
    e.stopPropagation();
    onCalculate();
  };

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
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out" onClick={onClick}>
      <div className="relative">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={imageUrl}
          className={`w-full h-48 object-cover ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          alt="Map"
          onLoad={handleImageLoad}
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          >
            <BiEdit className="text-blue-500" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          >
            <RiDeleteBin6Line className="text-red-500" />
          </button>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-gray-800">{templateName}</div>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex flex-wrap -mx-2">
          <div className="w-1/2 px-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              {location}
            </div>
          </div>
          <div className="w-1/2 px-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              {date}
            </div>
          </div>
          <div className="w-1/2 px-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <FaRuler className="mr-2 text-blue-500" />
              Area: {area}
            </div>
          </div>
          <div className="w-1/2 px-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <FaRuler className="mr-2 text-blue-500" />
              Perimeter: {perimeter}
            </div>
          </div>
          <div className="w-full px-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <GiField className="mr-2 text-blue-500" />
              Land Type: {landType}
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50">
        <button
          onClick={handleCalculate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition-colors duration-200"
        >
          <RiCalculatorLine className="mr-2" />
          Calculate
        </button>
      </div>
    </div>
  );
};

export default Card;