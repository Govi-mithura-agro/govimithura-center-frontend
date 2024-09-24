import React, { useState, useEffect } from "react";
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
  Steps,
  Typography,
  Table,
  InputNumber,
} from "antd";

const { Option } = Select;
const { Step } = Steps;

const SavedTemplatesWeb = ({ onBackToSidebar, onCalculate, landSize }) => {
  const [mapDetails, setMapDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [mapDetailToDelete, setMapDetailToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedMapDetail, setSelectedMapDetail] = useState(null);
  const [form] = Form.useForm();
  const [fertilizerAmount, setFertilizerAmount] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [currentDetail, setCurrentDetail] = useState(null);
  const [fertilizers, setFertilizers] = useState([]);
  const [cropOptions, setCropOptions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [fertilizerCalculations, setFertilizerCalculations] = useState([]);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [canCalculate, setCanCalculate] = useState(false);
  const { Text } = Typography;

  const columns = [
    {
      title: "Fertilizer Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Soil Type",
      dataIndex: "soilType",
      key: "soilType",
      filters: [
        { text: "Sandy", value: "Sandy" },
        { text: "Loamy", value: "Loamy" },
        { text: "Clay", value: "Clay" },
      ],
      onFilter: (value, record) => record.soilType === value,
    },
    {
      title: "Total Amount Needed (Kg)",
      dataIndex: "totalAmountNeeded",
      key: "totalAmountNeeded",
      sorter: (a, b) =>
        parseFloat(a.totalAmountNeeded) - parseFloat(b.totalAmountNeeded),
      render: (text) => <Text strong>{parseFloat(text).toFixed(2)}</Text>,
    },
  ];

  const fetchFertilizers = () => {
    axios
      .get("http://localhost:5000/api/fertilizers/getfertilizers")
      .then((response) => {
        if (response.data && response.data.fertilizers) {
          setFertilizers(response.data.fertilizers);
        } else {
          setFertilizers([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching fertilizers:", error);
        setFertilizers([]);
      });
  };

  useEffect(() => {
    fetchFertilizers();
  }, []);

  const handleResultModalOk = () => {
    setIsResultModalVisible(false);
    setFertilizerCalculations([]);
  };

  const handleNextStep = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
        if (currentStep === 1) {
          setCanCalculate(true);
        }
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    if (currentStep === 2) {
      setCanCalculate(false);
    }
  };

  const showDeleteConfirm = (detail) => {
    console.log("Deleting detail:", detail);  // Add this line to debug
    setMapDetailToDelete(detail);
    setDeleteModalVisible(true);
  };
  

  const isStepValid = (step) => {
    const fields =
      step === 0 ? ["cropType", "soilType"] : ["landSize", "expectedYield"];
    return form.getFieldsError(fields).every(({ errors }) => errors.length === 0);
  };

  const updateOnClose = () => {
    setUpdateOpen(false);
    setSelectedMapDetail(null);
  };

  const handleCalculate = (detail) => {
    setCurrentDetail(detail);
    form.setFieldsValue({ landSize: detail.area });
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (!isModalVisible) {
      form.resetFields();
      setCurrentStep(0);
      setFertilizerCalculations([...fertilizerCalculations]);
      setCanCalculate(false);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (fertilizerCalculations.length > 0) {
      setIsResultModalVisible(true);
    }
  }, [fertilizerCalculations]);

  const fetchCropData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/crops/getcropdata"
      );
      const crops = response.data.crops;
      setCropOptions(crops);
    } catch (error) {
      console.error("Failed to fetch crop data:", error);
    }
  };

  useEffect(() => {
    fetchCropData();
  }, []);

  const soilTypeFactor = {
    Sandy: 1.2,
    Loamy: 1.0,
    Clay: 0.9,
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { cropType, soilType, expectedYield, landSize } = values;

        // Debug: Check the selected crop type
        console.log("Selected Crop Type:", cropType);
        console.log("Selected Soil Type:", soilType);
        console.log("Land Size (ha):", landSize);
        console.log("Expected Yield (tons):", expectedYield);

        // Filter fertilizers by cropType and soilType
        const relevantFertilizers = fertilizers.filter((fertilizer) => {
          // Split the crops string by commas and trim spaces
          const cropNames = fertilizer.crops[0]
            .split(",")
            .map((crop) => crop.trim().toLowerCase());

          // Check if the cropType matches any of the crop names and soilType matches
          return cropNames.includes(cropType.toLowerCase());
        });

        // If no fertilizers match the crop
        if (relevantFertilizers.length === 0) {
          console.error(
            "No fertilizers found for the selected crop and soil type."
          );
          return;
        }

        // Debug: Log the found fertilizers
        console.log("Relevant Fertilizers:", relevantFertilizers);

        // Get the average yield for the selected crop
        const selectedCropData = cropOptions.find(
          (crop) => crop.cropName === cropType
        );

        if (!selectedCropData) {
          console.error("Crop data not found.");
          return;
        }

        const averageYield = selectedCropData.averageYield;

        // Calculate required fertilizer amounts for each fertilizer
        const calculations = relevantFertilizers.map((fertilizer) => {
          const averageAmount = fertilizer.fertilizerAmount; // kg/ha
          const yieldRatio = expectedYield / averageYield;
          const totalAmountNeeded =
            averageAmount * landSize * yieldRatio * soilTypeFactor[soilType]; // Adjust with soilType factor

          // Return the calculation details for logging
          return {
            name: fertilizer.name, // Fertilizer name
            soilType: fertilizer.soilType,
            totalAmountNeeded: totalAmountNeeded.toFixed(2), // Total amount in kg
          };
        });

        // Log the calculated fertilizer amounts
        console.log("Fertilizer Calculations:");
        calculations.forEach((calc) => {
          console.log(`Fertilizer: ${calc.name}`);
          console.log(`Soil Type: ${calc.soilType}`);
          console.log(`Total Amount Needed (Kg): ${calc.totalAmountNeeded}`);
        });

        // Update state with calculated data
        setFertilizerCalculations(calculations);
        setIsResultModalVisible(true); // Show the results modal if necessary
      })
      .catch((error) => {
        console.error("Error validating form fields:", error);
      });
  };


  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setMapDetailToDelete(null);
    };

    const handleDeleteConfirm = async () => {
      try {
        setDeleteModalVisible(false);
        setLoading(true);
        console.log("Sending DELETE request to:", mapDetailToDelete._id);  // Log ID
        
        const response = await axios.delete(
          `http://localhost:5000/api/mapTemplate/deleteMapDetail/${mapDetailToDelete._id}`
        );
        
        console.log("Delete response:", response);  // Log response to check success
        message.success("Map detail deleted successfully");
    
        // Update the UI after successful deletion
        const updatedMapDetails = mapDetails.filter(
          (detail) => detail._id !== mapDetailToDelete._id
        );
        setMapDetails(updatedMapDetails);
    
      } catch (error) {
        console.error("Failed to delete map detail:", error.response || error);
        message.error("Failed to delete map detail");
      } finally {
        setLoading(false);
        setMapDetailToDelete(null);
      }
    };
    
  

  const handleUpdateCancel = () => {
    setUpdateOpen(false);
    setSelectedMapDetail(null);
  };

  const getAllMapDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/mapTemplate/getAllMapDetails"
      );
      setMapDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch map details:", error);
      message.error("Failed to fetch map details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = async (mapDetail) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/mapTemplate/getMapDetails/${mapDetail._id}`
      );
      setSelectedMapDetail(response.data);
      form.setFieldsValue({
        templateName: response.data.templateName,
        area: response.data.area,
        perimeter: response.data.perimeter,
        location: response.data.location,
        date: new Date(response.data.date).toISOString().split("T")[0],
        imageUrl: response.data.imageUrl,
        description: response.data.description,
        landType: response.data.landType,
      });
      setUpdateOpen(true);
    } catch (error) {
      console.error("Failed to fetch map details by id:", error);
      message.error("Failed to fetch map details by id");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  

  const handleUpdateOk = async () => {
    try {
      setConfirmLoadingUpdate(true);
      const updatedDetails = form.getFieldsValue();

      const response = await axios.put(
        `http://localhost:5000/api/mapTemplate/updateTemplate/${selectedMapDetail._id}`,
        updatedDetails
      );

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
                      area={detail.area}
                      perimeter={detail.perimeter}
                      location={detail.location}
                      date={detail.date}
                      imageUrl={detail.imageUrl}
                      description={detail.description}
                      landType={detail.landType}
                      onCalculate={() => handleCalculate(detail)} // Pass the detail here
                      onDelete={() => showDeleteConfirm(detail)}
                      onEdit={() => handleUpdateClick(detail)}
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
            name="area"
            label="Area"
            rules={[{ required: true, message: "Please enter the area" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="perimeter"
            label="Perimeter"
            rules={[{ required: true, message: "Please enter the perimeter" }]}
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
            <Select>
              <Option value="Urban">Urban</Option>
              <Option value="Rural">Rural</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Fertilizer Amount Calculator"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk} // Will trigger only when all validations are met
        >
          <Steps current={currentStep}>
            <Step title="Crop Selection" />
            <Step title="Land Size" />
            <Step title="Fertilizer Calculation" />
          </Steps>

          {/* Step 1: Crop Selection */}
          {currentStep === 0 && (
            <>
              <Form.Item
                name="cropType"
                label="Select Crop"
                rules={[
                  { required: true, message: "Please select the crop type" },
                ]}
              >
                <Select
                  placeholder="Select a crop"
                  showSearch
                  optionFilterProp="children"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    setSelectedCrop(value); // Update the selected crop
                    const selectedCropData = cropOptions.find(
                      (crop) => crop.cropName === value
                    );
                    if (selectedCropData) {
                      form.setFieldsValue({
                        expectedYield: selectedCropData.averageYield,
                      });
                    }
                  }}
                >
                  {cropOptions.map((crop) => (
                    <Option key={crop.cropName} value={crop.cropName}>
                      {crop.cropName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="soilType"
                label="Soil Type"
                rules={[
                  { required: true, message: "Please select the soil type" },
                ]}
              >
                <Select placeholder="Select soil type">
                  <Option value="Sandy">Sandy</Option>
                  <Option value="Loamy">Loamy</Option>
                  <Option value="Clay">Clay</Option>
                </Select>
              </Form.Item>
            </>
          )}

          {/* Step 2: Land Size and Yield */}
          {currentStep === 1 && (
            <>
              <Form.Item
                label="Land Size (sq meters)"
                name="landSize"
                initialValue={currentDetail?.area}
              >
                <Input placeholder="Land size" />
              </Form.Item>

              <Form.Item
                name="expectedYield"
                label="Expected Yield (kg/ha)"
                rules={[
                  {
                    required: true,
                    message: "Please enter the expected yield",
                  },
                ]}
              >
                <Input type="number" placeholder="Expected yield" disabled />
              </Form.Item>
            </>
          )}

          {/* Step 3: Fertilizer Calculation */}
          {currentStep === 2 && (
            <>
              <div>
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="cropType"
                    label="Crop Type"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select crop type">
                      {cropOptions.map((crop) => (
                        <Option key={crop.cropName} value={crop.cropName}>
                          {crop.cropName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="soilType"
                    label="Soil Type"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select soil type">
                      {Object.keys(soilTypeFactor).map((soil) => (
                        <Option key={soil} value={soil}>
                          {soil}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="landSize"
                    label="Land Size (ha)"
                    rules={[{ required: true }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item
                    name="expectedYield"
                    label="Expected Yield (tons)"
                    rules={[{ required: true }]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Form>

                <Modal
                  title="Fertilizer Calculation Results"
                  visible={isResultModalVisible}
                  onOk={handleResultModalOk}
                  onCancel={handleResultModalOk}
                  >
                  {fertilizerCalculations.length > 0 && (
                    <Table
                      columns={columns}
                      dataSource={fertilizerCalculations}
                      pagination={false}
                      rowKey="name"
                    />
                  )}
                </Modal>
              </div>
            </>
          )}
        </Form>

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <Button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            style={{ marginRight: "10px" }} // Add space to the right
          >
            Back
          </Button>

          <Button
            onClick={handleNextStep}
            disabled={!isStepValid(currentStep)}
            style={{ marginRight: "10px" }} // Add space to the right
          >
            Next
          </Button>

          <Button
            type="primary"
            onClick={handleOk}
            style={{ marginLeft: "auto" }} // Push this button to the right edge
          >
            Calculate
          </Button>
        </div>
      </Modal>
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
            onClick={handleDeleteConfirm} // Correct
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
