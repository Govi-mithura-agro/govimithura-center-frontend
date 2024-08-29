import React, { useState, useEffect } from 'react';
import { MdArrowBack } from 'react-icons/md';
import '../SavedTemplates/SavedTemplatesWeb.css';
import Card from './Card';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { message, Empty, Modal, Button, Spin } from 'antd';

const SavedTemplatesWeb = ({
  onBackToSidebar,
  onCardClick,
  handleEditTemplateClick,
}) => {
  const [mapDetails, setMapDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [mapDetailToDelete, setMapDetailToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllMapDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/mapTemplate/getAllMapDetails");
      console.log('API Response:', response.data); // Debugging line
      setMapDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch map details:', error);
      message.error('Failed to fetch map details');
      setLoading(false); // Ensure loading is turned off even if there’s an error
    }
  };

  const showDeleteConfirm = (mapDetail) => {
    setMapDetailToDelete(mapDetail);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (mapDetailToDelete) {
      axios.delete(
        `http://localhost:5000/api/map/deleteMapDetail/${mapDetailToDelete._id}`
      )
        .then(() => {
          message.success('Map detail deleted successfully');
          setMapDetails(
            mapDetails.filter(
              (detail) => detail._id !== mapDetailToDelete._id
            )
          );
          setDeleteModalVisible(false);
          setMapDetailToDelete(null);
        })
        .catch((error) => {
          console.error('Failed to delete map detail:', error);
          message.error('Failed to delete map detail');
        });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setMapDetailToDelete(null);
  };

  useEffect(() => {
    getAllMapDetails();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMapDetails = mapDetails.filter((detail) =>
    detail.templateName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  console.log('Filtered Map Details:', filteredMapDetails); // Debugging line

  return (
    <>
      <div className='innerDiv'>
        <div className='backBtnDiv'>
          <MdArrowBack onClick={onBackToSidebar} className='backBtn' />
        </div>
        <div className='headingDiv'>
          <div className='search-container'>
            <input
              type='text'
              className='search-bar'
              placeholder='Search map details'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className='search-icon' />
          </div>

          <div className='cardsDiv'>
            {loading ? (
              <div className='spin-container'>
                <Spin size='large'>
                  <div className='content' />
                </Spin>
                <div className='loading-text'>Loading map details...</div>
              </div>
            ) : (
              <>
                {filteredMapDetails.length > 0 ? (
                  filteredMapDetails.map((detail) => (
                    <Card
                      key={detail._id}
                      templateName={detail.name}
                      location={detail.location}
                      date={detail.date}
                      imageUrl={detail.imageUrl}
                      onClick={() => onCardClick(detail)}
                      onDelete={() => showDeleteConfirm(detail)}
                      onEdit={() => handleEditTemplateClick(detail)}
                    />
                  ))
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>No map details available</span>}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        title='Confirm Delete'
        visible={deleteModalVisible}
        onCancel={handleDeleteCancel}
        centered
        footer={[
          <Button key='cancel' onClick={handleDeleteCancel}>
            Cancel
          </Button>,
          <Button
            key='delete'
            type='primary'
            danger
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this map detail?</p>
      </Modal>
    </>
  );
};

export default SavedTemplatesWeb;
