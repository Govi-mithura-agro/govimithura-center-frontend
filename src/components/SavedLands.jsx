import React, { useState, useEffect } from "react";
import "../styles/Cardhome.css";
import Card from "./Card";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import {
  message,
  Empty,
  Modal,
  Button,
  Spin,
  Drawer,
  Space,
  Form,
  Input,
  Select,
} from "antd";

const { Option } = Select;

const SavedTemplatesWeb = ({
  onBackToSidebar,
  onCardClick,
  handleEditTemplateClick,
}) => {
  const [mapDetails, setMapDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [mapDetailToDelete, setMapDetailToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedMapDetail, setSelectedMapDetail] = useState(null); // Store the selected map detail for update
  const [form] = Form.useForm(); // Ant Design form instance

  const updateOnClose = () => {
    setUpdateOpen(false);
    setSelectedMapDetail(null); // Clear selected map detail
  };

  const handleUpdateCancel = () => {
    setUpdateOpen(false);
    setSelectedMapDetail(null); // Clear selected map detail
  };

  const getAllMapDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/mapTemplate/getAllMapDetails"
      );
      console.log("API Response:", response.data); // Debugging line
      setMapDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch map details:", error);
      message.error("Failed to fetch map details");
      setLoading(false); // Ensure loading is turned off even if there’s an error
    }
  };

  const showDeleteConfirm = (mapDetail) => {
    setMapDetailToDelete(mapDetail);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (mapDetailToDelete) {
      axios
        .delete(
          `http://localhost:5000/api/mapTemplate/deleteTemplate/${mapDetailToDelete._id}`
        )

        .then(() => {
          message.success("Map detail deleted successfully");
          setMapDetails(
            mapDetails.filter((detail) => detail._id !== mapDetailToDelete._id)
          );
          setDeleteModalVisible(false);
          setMapDetailToDelete(null);
        })
        .catch((error) => {
          console.error("Failed to delete map detail:", error);
          message.error("Failed to delete map detail");
        });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setMapDetailToDelete(null);
  };

  const handleUpdateClick = (mapDetail) => {
    setSelectedMapDetail(mapDetail);
    form.setFieldsValue(mapDetail); // Set form values to the selected map detail
    setUpdateOpen(true);
  };

  const handleUpdateOk = async () => {
    try {
      setConfirmLoadingUpdate(true);
      const updatedDetails = form.getFieldsValue(); // Get updated form values

      console.log("Updating with details:", updatedDetails);

      const response = await axios.put(
        `http://localhost:5000/api/mapTemplate/updateTemplate/${selectedMapDetail._id}`,
        updatedDetails
      );

      console.log("Server Response:", response.data);

      message.success("Map detail updated successfully");
      const updatedMapDetails = mapDetails.map((detail) =>
        detail._id === selectedMapDetail._id
          ? { ...detail, ...updatedDetails }
          : detail
      );
      setMapDetails(updatedMapDetails);
      setUpdateOpen(false);
      setSelectedMapDetail(null);
    } catch (error) {
      console.error("Failed to update map detail:", error);
      message.error("Failed to update map detail");
    } finally {
      setConfirmLoadingUpdate(false);
    }
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

  console.log("Filtered Map Details:", filteredMapDetails); // Debugging line

  return (
    <>
      <div className="innerDiv">
        <div className="headingDiv">
          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search map details"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="cardsDiv grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <div className="spin-container">
                <Spin size="large">
                  <div className="content" />
                </Spin>
                <div className="loading-text">Loading map details...</div>
              </div>
            ) : (
              <>
                {filteredMapDetails.length > 0 ? (
                  filteredMapDetails.map((detail) => (
                    <Card
                      key={detail._id}
                      templateName={detail.templateName}
                      location={detail.location}
                      date={detail.date}
                      imageUrl={detail.imageUrl}
                      description={detail.description}
                      landType={detail.landType}
                      onClick={() => onCardClick(detail)}
                      onDelete={() => showDeleteConfirm(detail)}
                      onEdit={() => handleUpdateClick(detail)} // Use handleUpdateClick
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

      <Drawer
        title="Update Map Details"
        width={720}
        onClose={updateOnClose}
        open={updateOpen}
        extra={
          <Space>
            <Button onClick={handleUpdateCancel}>Cancel</Button>
            <Button
              onClick={handleUpdateOk}
              type="primary"
              loading={confirmLoadingUpdate}
              className="bg-[#0c6c41]"
            >
              Update
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" name="update_map_details">
          <Form.Item
            name="templateName"
            label="Template Name"
            rules={[
              { required: true, message: "Please enter the template name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter the location" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please enter the date" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Image URL"
            rules={[{ required: true, message: "Please enter the image URL" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="landType"
            label="Land Type"
            rules={[{ required: true, message: "Please select the land type" }]}
          >
            <Select placeholder="Select Land Type">
              <Option value="Residential">Residential</Option>
              <Option value="Commercial">Commercial</Option>
              <Option value="Industrial">Industrial</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Confirm Delete"
        visible={deleteModalVisible}
        onCancel={handleDeleteCancel}
        centered
        footer={[
          <Button key="cancel" onClick={handleDeleteCancel}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
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
