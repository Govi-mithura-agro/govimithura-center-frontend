import React, { useEffect, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Input, Button, Space, Table, Modal, Col, Drawer, Form, Row, Select, Checkbox, message, Popconfirm } from 'antd';
import { Icon } from "@iconify/react";
import '../styles/CropData.css';
import axios from "axios";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

const { Option } = Select;

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  header: {
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c883d'
  },
  logo: {
    width: 100,
    height: 50,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000'
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#EEEEEE",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    backgroundColor: '#FFFFFF',
  },
  tableHeader: {
    backgroundColor: '#e7ffe7',
    color: '#FFFFFF',
  },
  tableCol: {
    width: "100px",
    borderStyle: "solid",
    borderColor: "#EEEEEE",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
    color: '#333333',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#888888',
    fontSize: 10,
  },
});

// Define the PDF Document component
const MyDocument = ({ crops }) => (
  <Document>
    <Page size="A3" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src="../assets/govimithura_logo.svg" />
        <Text style={styles.headerText}>Govi mithura</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Crop Data</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>

            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Crop name</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Scientific Name</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Planting Season</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Soil Type</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Growth Duration (days)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Average Yield (tons/ha)</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Water Requirements</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Region</Text>
            </View>
          </View>
          {crops.map((crop, index) => (
            <View style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }]} key={crop._id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{crop.cropName}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{crop.scientificName}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{crop.plantingSeason}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{crop.soilType}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{crop.growthDuration}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{crop.averageYield}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{crop.waterRequirements}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{crop.region}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.footer}>Generated on {new Date().toLocaleDateString()}</Text>
    </Page>
  </Document>
);

function CropData() {
  const [selectedCrop, setSelectedCrop] = useState(null); // State to hold the selected crop's data
  const [size, setSize] = useState('large');
  const [factors, setFactors] = useState([]);

  const [filteredCrops, setFilteredCrops] = useState([]);
  const [selectedPlantingSeason, setSelectedPlantingSeason] = useState(null);
  const [selectedWaterRequirements, setSelectedWaterRequirements] = useState(null);



  const [crop, setCrop] = useState('');
  const [cropName, setCropName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [plantingSeason, setPlantingSeason] = useState('');
  const [soilType, setSoilType] = useState('');
  const [growthDuration, setGrowthDuration] = useState('');
  const [averageYield, setAverageYield] = useState('');
  const [waterRequirements, setWaterRequirements] = useState('');
  const [region, setRegion] = useState([]);
  const [description, setDescription] = useState('');

  const [messageApi, contextHolder] = message.useMessage();

  const [updatOpen, setUpdateOpen] = useState(false);

  const [updateForm] = Form.useForm();



  const updateShowDrawer = (crop) => {
    setSelectedCrop(crop);
    setUpdateOpen(true);

    // Update the form fields with the selected crop's data
    updateForm.setFieldsValue({
      cropimage: crop.crop[0],
      cropname: crop.cropName,
      scientificname: crop.scientificName,
      plantingseason: crop.plantingSeason,
      soiltype: crop.soilType,
      growthduration: crop.growthDuration,
      averageyield: crop.averageYield,
      waterrequirements: crop.waterRequirements,
      region: crop.region,
      description: crop.description,
    });

  };

  const handleUpdateCrop = async () => {

    try {
      // Validate and get the form values
      const values = await updateForm.validateFields();

      // Check if all required fields are filled
      if (Object.values(values).some(value => value === undefined || value === '')) {
        addWarning('Please fill in all required fields.');
        return;
      }

      // Validation for numeric fields
      if (isNaN(values.growthduration) || values.growthduration === '') {
        addWarning('Please enter a valid number for Growth Duration.');
        return;
      }
      if (isNaN(values.averageyield) || values.averageyield === '') {
        addWarning('Please enter a valid number for Average Yield.');
        return;
      }

      const updatedCrop = {
        ...selectedCrop,
        crop: [values.cropimage],
        cropName: values.cropname,
        scientificName: values.scientificname,
        plantingSeason: values.plantingseason,
        soilType: values.soiltype,
        growthDuration: parseFloat(values.growthduration),
        averageYield: parseFloat(values.averageyield),
        waterRequirements: values.waterrequirements,
        region: values.region,
        description: values.description,
      };

      // Send update request to your API
      const response = await axios.put(`http://localhost:5000/api/crops/editcrop/${selectedCrop._id}`, updatedCrop);
      messageApi.success('Crop updated successfully!').then(() => {
        window.location.reload();
      });;
      setUpdateOpen(false);
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to update crop. Please try again.');
    }
  };


  const updateOnClose = () => {
    setUpdateOpen(false);
  };

  const addWarning = (warningMessage) => {
    messageApi.warning(warningMessage);
  };

  const onChangeRegion = (checkedValues) => {
    setRegion(checkedValues);
  };


  const columns = [
    {
      title: 'Province',
      dataIndex: 'province',
      key: 'province',
      className: 'px-4',
    },
    {
      title: 'District',
      dataIndex: 'district',
      key: 'district',
      className: 'px-4',
    },
    {
      title: 'Soil Type',
      dataIndex: 'soiltype',
      key: 'soiltype',
      className: 'px-4',
    },
    {
      title: 'Soil PH',
      dataIndex: 'soilph',
      key: 'soilsoilphType',
      className: 'px-4',
    },
    {
      title: 'Nutrient Content',
      dataIndex: 'nutrientcontent',
      key: 'nutrientcontent',
      className: 'px-4',
    },
    {
      title: 'Temperature (°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      className: 'px-4',
      render: (text) => `${text}`,
    },
    {
      title: 'Rainfall (mm)',
      dataIndex: 'rainfall',
      key: 'rainfall',
      className: 'px-4',
      render: (text) => `${text}`,
    },
    {
      title: 'Humidity (%)',
      dataIndex: 'humidity',
      key: 'humidity',
      className: 'px-4',
      render: (text) => `${text}`,
    },
    {
      title: 'Topography',
      dataIndex: 'topography',
      key: 'topography',
      className: 'px-4',
    },
    {
      title: 'Irrigation Systems',
      dataIndex: 'irrigationsystems',
      key: 'irrigationsystems',
      className: 'px-4',
    },
    {
      title: 'Water Quality',
      dataIndex: 'waterquality',
      key: 'waterquality',
      className: 'px-4',
    },
    {
      title: 'Variety Selection',
      dataIndex: 'varietyselection',
      key: 'varietyselection',
      className: 'px-4',
    },
    {
      title: 'Growth Cycle',
      dataIndex: 'growthcycle',
      key: 'growthcycle',
      className: 'px-4',
    },
    {
      title: 'Pest Pressure',
      dataIndex: 'pestpressure',
      key: 'pestpressure',
      className: 'px-4',
    },
    {
      title: 'Disease Incidence',
      dataIndex: 'diseaseincidence',
      key: 'diseaseincidence',
      className: 'px-4',
    },
    {
      title: 'Crop Rotation',
      dataIndex: 'croprotation',
      key: 'croprotation',
      className: 'px-4',
    },
    {
      title: 'Fertilizer Use',
      dataIndex: 'fertilizeruse',
      key: 'fertilizeruse',
      className: 'px-4',
    },
    {
      title: 'Demand and Price Trends',
      dataIndex: 'demandandpricetrends',
      key: 'demandandpricetrends',
      className: 'px-4',
    },
    {
      title: 'Supply Chain Efficiency',
      dataIndex: 'supplychainefficiency',
      key: 'supplychainefficiency',
      className: 'px-4',
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Icon icon="uil:setting"
            onClick={() => updateShowDrawer(record)}
            style={{
              fontSize: '20px',
              color:"#bfbfbf"
            }}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    async function fetchCropsfactors() {
      try {
        const response = await axios.post("http://localhost:5000/api/cropfactors/getcropfactors");
        console.log("Crops factors:", response.data.cropfactors);

        const factorsWithKeys = response.data.cropfactors.map((factor, index) => ({
          ...factor,
          key: factor._id || index,
        }));
        setFactors(factorsWithKeys);
        setFilteredCrops(factorsWithKeys); // Initialize filteredCrops with all crops
      } catch (error) {
        console.log("Error fetching crops:", error);
      }
    }
    fetchCropsfactors();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [selectedPlantingSeason, selectedWaterRequirements, factors]);

  const filterCrops = () => {
    let filtered = [...factors];

    if (selectedPlantingSeason && selectedPlantingSeason !== 'All') {
      filtered = filtered.filter(crop => crop.plantingSeason === selectedPlantingSeason);
    }

    if (selectedWaterRequirements && selectedWaterRequirements !== 'All') {
      filtered = filtered.filter(crop => crop.waterRequirements === selectedWaterRequirements);
    }


    setFilteredCrops(filtered);
  };

  const handlePlantingSeasonChange = (value) => {
    setSelectedPlantingSeason(value);
  };

  const handleWaterRequirementsChange = (value) => {
    setSelectedWaterRequirements(value);
  };



  return (
    <>
      {contextHolder}
      <div className="flex justify-start gap-[25px] items-center h-[74px] bg-white rounded-[11px] m-[15px] px-[15px]">
        <div className="w-[250px] h-[29px] text-slate-900 text-xl font-semibold font-['Poppins']">Crop Prediction Factors</div>
        <Select
          placeholder="Select planting season"
          style={{
            width: '200px',
            height: '40px',
          }}
          size='large'
          onChange={handlePlantingSeasonChange}
          defaultValue="All"
        >
          <Option value="All">Planting season -- All</Option>
          <Option value="Maha">Maha</Option>
          <Option value="Yala">Yala</Option>
          <Option value="Maha/Yala">Maha/Yala</Option>
        </Select>
        <Select
          placeholder="Select water requirements"
          style={{
            width: '250px',
            height: '40px',
          }}
          size='large'
          onChange={handleWaterRequirementsChange}
          defaultValue="All"
        >
          <Option value="All">Water requirements -- All</Option>
          <Option value="High">High</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Low">Low</Option>
        </Select>


        <PDFDownloadLink
          document={<MyDocument crops={filteredCrops} />}
          fileName="crop_data.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              'Loading document...'
            ) : (
              <Button type="primary" icon={<DownloadOutlined />} size={size} className="bg-[#bfbfbf]">
                Download PDF
              </Button>
            )
          }
        </PDFDownloadLink>
      </div>
      <div className="m-4 bg-white rounded-xl p-4">
        <Table
          columns={columns}
          dataSource={filteredCrops} // Use filteredCrops instead of crops
          scroll={{ x: 1500 }}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Update drawer */}
      <Drawer
        title="Update Crop Details"
        width={720}
        onClose={updateOnClose}
        open={updatOpen}
        extra={
          <Space>
            <Button onClick={updateOnClose}>Cancel</Button>
            <Button onClick={handleUpdateCrop} type="primary" className='bg-[#0c6c41]'>
              Update
            </Button>
          </Space>
        }
      >

        <Form form={updateForm} layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cropimage"
                label="Crop Image Url"
                rules={[
                  {
                    required: true,
                    message: 'Please enter crop image url',
                  },
                ]}
              >
                <Input
                  placeholder="Enter crop image url"
                  defaultValue={crop}
                  onChange={(e) => setCrop(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cropname"
                label="Crop Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter crop name',
                  },
                ]}
              >
                <Input
                  placeholder="Enter crop name"
                  defaultValue={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="scientificname"
                label="Scientific Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter scientific name',
                  },
                ]}
              >
                <Input
                  placeholder="Enter scientific name"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="plantingseason"
                label="Planting Season"
                rules={[
                  {
                    required: true,
                    message: 'Please select planting season',
                  },
                ]}
              >
                <Select
                  placeholder="Select planting season"
                  value={plantingSeason}
                  onChange={(value) => setPlantingSeason(value)}
                >
                  <Option value="Maha">Maha</Option>
                  <Option value="Yala">Yala</Option>
                  <Option value="Maha/Yala">Maha/Yala</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="soiltype"
                label="Soil Type"
                rules={[
                  {
                    required: true,
                    message: 'Please select soil type',
                  },
                ]}
              >
                <Select
                  placeholder="Select soil type"
                  value={soilType}
                  onChange={(value) => setSoilType(value)}
                >
                  <Option value="Alluvial">Alluvial</Option>
                  <Option value="Red Loam">Red Loam</Option>
                  <Option value="Sandy Loam">Sandy Loam</Option>
                  <Option value="Laterite">Laterite</Option>
                  <Option value="Clay Loam">Clay Loam</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="growthduration"
                label="Growth Duration (in days)"
                rules={[
                  {
                    required: true,
                    message: 'Please enter growth duration',
                  },
                ]}
              >
                <Input
                  placeholder="Enter growth duration"
                  value={growthDuration}
                  onChange={(e) => setGrowthDuration(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="averageyield"
                label="Average Yield (tons/ha)"
                rules={[
                  {
                    required: true,
                    message: 'Please enter average yield',
                  },
                ]}
              >
                <Input
                  placeholder="Enter average yield"
                  defaultValue={averageYield}
                  onChange={(e) => setAverageYield(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="waterrequirements"
                label="Water Requirements"
                rules={[
                  {
                    required: true,
                    message: 'Please select water requirements',
                  },
                ]}
              >
                <Select
                  placeholder="Select water requirements"
                  value={waterRequirements}
                  onChange={(value) => setWaterRequirements(value)}
                >
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="region"
                label="Region"
                rules={[
                  {
                    required: true,
                    message: 'please enter region',
                  },
                ]}
              >
                <Checkbox.Group
                  options={[
                    'Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Wester', 'North Central', 'Uva', 'Sabaragamuwa'
                  ]}
                  value={region}
                  onChange={onChangeRegion}
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'please enter description',
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter description"
                  defaultValue={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>


      </Drawer>
    </>
  );
}

export default CropData;
