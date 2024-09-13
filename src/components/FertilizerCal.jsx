import React, { useState } from 'react';
import { Modal, Form, Input, Select, Steps, Button, Table } from 'antd';

const { Option } = Select;
const { Step } = Steps;

const FertilizerCalculator = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [cropOptions, setCropOptions] = useState([]); // Initialize with your crop options
  const [soilTypeFactor, setSoilTypeFactor] = useState({}); // Initialize with your soil types
  const [fertilizerCalculations, setFertilizerCalculations] = useState([]);

  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    setIsModalVisible(false);
  };

  const handleOk = () => {
    // Perform your calculations and show the results modal
    setFertilizerCalculations(/* Your calculation logic here */);
    setIsResultModalVisible(true);
  };

  const handleResultModalOk = () => {
    setIsResultModalVisible(false);
    // Clear any calculations or related data if necessary
    setFertilizerCalculations([]);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <>
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
                rules={[{ required: true, message: "Please select the crop type" }]}
              >
                <Select
                  placeholder="Select a crop"
                  showSearch
                  optionFilterProp="children"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    // Update the selected crop and form fields
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
                rules={[{ required: true, message: "Please select the soil type" }]}
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
                initialValue={/* Your default value */}
              >
                <Input placeholder="Land size" />
              </Form.Item>

              <Form.Item
                name="expectedYield"
                label="Expected Yield (kg/ha)"
                rules={[{ required: true, message: "Please enter the expected yield" }]}
              >
                <Input type="number" placeholder="Expected yield" disabled />
              </Form.Item>
            </>
          )}

          {/* Step 3: Fertilizer Calculation */}
          {currentStep === 2 && (
            <>
              <Form form={form} layout="vertical">
                <Form.Item name="cropType" label="Crop Type" rules={[{ required: true }]}>
                  <Select placeholder="Select crop type">
                    {cropOptions.map((crop) => (
                      <Option key={crop.cropName} value={crop.cropName}>
                        {crop.cropName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="soilType" label="Soil Type" rules={[{ required: true }]}>
                  <Select placeholder="Select soil type">
                    {Object.keys(soilTypeFactor).map((soil) => (
                      <Option key={soil} value={soil}>
                        {soil}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="landSize" label="Land Size (ha)" rules={[{ required: true }]}>
                  <Input type="number" />
                </Form.Item>
                <Form.Item name="expectedYield" label="Expected Yield (tons)" rules={[{ required: true }]}>
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
                    columns={/* Your columns definition */}
                    dataSource={fertilizerCalculations}
                    pagination={false}
                    rowKey="name"
                  />
                )}
              </Modal>
            </>
          )}

          <div style={{ marginTop: '20px' }}>
            <Button onClick={handlePrevStep} disabled={currentStep === 0}>
              Back
            </Button>
            <Button onClick={handleNextStep} disabled={!isStepValid(currentStep)} style={{ marginLeft: '8px' }}>
              Next
            </Button>
            {currentStep === 2 && (
              <Button type="primary" onClick={handleOk} style={{ marginLeft: '8px' }}>
                Calculate
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default FertilizerCalculator;
