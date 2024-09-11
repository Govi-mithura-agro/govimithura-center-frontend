import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  message,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Steps,
  Typography,
  Table,
  Card,
  Tooltip,
  Space
} from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Step } = Steps;
const { Text } = Typography;

const EnhancedFertilizerCalculator = ({ onBackToSidebar, landSize }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fertilizerCalculations, setFertilizerCalculations] = useState([]);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [cropOptions, setCropOptions] = useState([]);
  const [fertilizers, setFertilizers] = useState([]);
  const [loading, setLoading] = useState(false);

  const soilTypeFactor = {
    Sandy: 1.2,
    Loamy: 1.0,
    Clay: 0.9,
  };

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
      filters: Object.keys(soilTypeFactor).map(soil => ({ text: soil, value: soil })),
      onFilter: (value, record) => record.soilType === value,
    },
    {
      title: "Total Amount Needed",
      dataIndex: "totalAmountNeeded",
      key: "totalAmountNeeded",
      sorter: (a, b) => a.totalAmountNeeded - b.totalAmountNeeded,
      render: (text, record) => (
        <Tooltip title={`Application Rate: ${record.applicationRate.toFixed(2)} Kg/ha`}>
          <Text strong>{parseFloat(text).toFixed(2)} Kg</Text>
        </Tooltip>
      ),
    },
    {
      title: "Application Rate",
      dataIndex: "applicationRate",
      key: "applicationRate",
      render: (text) => <Text>{parseFloat(text).toFixed(2)} Kg/ha</Text>,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropResponse, fertilizerResponse] = await Promise.all([
          axios.post("http://localhost:5000/api/crops/getcropdata"),
          axios.get("http://localhost:5000/api/fertilizers/getfertilizers")
        ]);
        setCropOptions(cropResponse.data.crops);
        setFertilizers(fertilizerResponse.data.fertilizers);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        message.error("Failed to load necessary data. Please try again.");
      }
    };
    fetchData();
  }, []);

  const handleCalculate = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        setLoading(true);
        const { cropType, soilType, expectedYield, landSize } = values;
        const landSizeHa = landSize / 10000;

        const relevantFertilizers = fertilizers.filter((fertilizer) => {
          const cropNames = fertilizer.crops[0].split(",").map((crop) => crop.trim().toLowerCase());
          return cropNames.includes(cropType.toLowerCase());
        });

        if (relevantFertilizers.length === 0) {
          throw new Error("No suitable fertilizers found for the selected criteria.");
        }

        const selectedCropData = cropOptions.find((crop) => crop.cropName === cropType);
        if (!selectedCropData) {
          throw new Error("Selected crop data not found. Please try again.");
        }

        const averageYield = selectedCropData.averageYield;
        const calculations = relevantFertilizers.map((fertilizer) => {
          const averageAmount = fertilizer.fertilizerAmount; // kg/ha
          const yieldRatio = expectedYield / averageYield;
          const totalAmountNeeded = averageAmount * landSizeHa * yieldRatio * soilTypeFactor[soilType];
          const applicationRate = totalAmountNeeded / landSizeHa;

          return {
            name: fertilizer.name,
            soilType: fertilizer.soilType,
            totalAmountNeeded: totalAmountNeeded,
            applicationRate: applicationRate,
          };
        });

        setFertilizerCalculations(calculations);
        setIsModalVisible(false);
        setIsResultModalVisible(true);
      })
      .catch((error) => {
        console.error("Calculation error:", error);
        message.error(error.message || "An error occurred during calculation. Please check your inputs and try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    form.validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <Button onClick={handleCalculate} type="primary">
        Calculate Fertilizer
      </Button>

      <Modal
        title="Fertilizer Amount Calculator"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={720}
      >
        <Steps current={currentStep} style={{ marginBottom: 20 }}>
          <Step title="Crop Selection" />
          <Step title="Land Details" />
          <Step title="Calculate" />
        </Steps>

        <Form form={form} layout="vertical">
          {currentStep === 0 && (
            <>
              <Form.Item
                name="cropType"
                label="Select Crop"
                rules={[{ required: true, message: "Please select the crop type" }]}
              >
                <Select
                  placeholder="Select a crop"
                  showSearch
                  optionFilterProp="children"
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
                rules={[{ required: true, message: "Please select the soil type" }]}
              >
                <Select placeholder="Select soil type">
                  {Object.keys(soilTypeFactor).map((soil) => (
                    <Option key={soil} value={soil}>
                      {soil}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item
                name="landSize"
                label="Land Size (sq meters)"
                rules={[{ required: true, message: "Please enter the land size" }]}
                initialValue={landSize}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="expectedYield"
                label="Expected Yield (kg/ha)"
                rules={[{ required: true, message: "Please enter the expected yield" }]}
              >
                <Input type="number" />
              </Form.Item>
            </>
          )}

          {currentStep === 2 && (
            <Card>
              <Text>Please review your inputs before calculating:</Text>
              <Form.Item label="Crop Type">
                <Text strong>{form.getFieldValue('cropType')}</Text>
              </Form.Item>
              <Form.Item label="Soil Type">
                <Text strong>{form.getFieldValue('soilType')}</Text>
              </Form.Item>
              <Form.Item label="Land Size">
                <Text strong>{`${form.getFieldValue('landSize')} sq meters`}</Text>
              </Form.Item>
              <Form.Item label="Expected Yield">
                <Text strong>{`${form.getFieldValue('expectedYield')} kg/ha`}</Text>
              </Form.Item>
            </Card>
          )}
        </Form>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={handlePrevStep}>
              Previous
            </Button>
          )}
          {currentStep < 2 && (
            <Button type="primary" onClick={handleNextStep}>
              Next
            </Button>
          )}
          {currentStep === 2 && (
            <Button type="primary" onClick={handleOk} loading={loading}>
              Calculate
            </Button>
          )}
        </div>
      </Modal>

      <Modal
        title="Fertilizer Calculation Results"
        visible={isResultModalVisible}
        onOk={() => setIsResultModalVisible(false)}
        onCancel={() => setIsResultModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsResultModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            <InfoCircleOutlined /> The calculations are based on your inputs and general fertilizer recommendations. 
            Always consult with a local agricultural expert for precise recommendations.
          </Text>
          <Table
            columns={columns}
            dataSource={fertilizerCalculations}
            rowKey="name"
            scroll={{ x: true }}
          />
        </Space>
      </Modal>
    </>
  );
};

export default EnhancedFertilizerCalculator;