import React, { useEffect, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Input, Button, Space, Table, Modal, Col, Drawer, Form, Row, Select, Checkbox, message, Popconfirm } from 'antd';
import { Icon } from "@iconify/react";
import '../styles/CropData.css';
import axios from "axios";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';


const { Search } = Input;
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
  const [openCropDetails, setOpenCropDetials] = useState(false);
  const [openAddCrop, setOpenAddCrop] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null); // State to hold the selected crop's data
  const [size, setSize] = useState('large');
  const [crops, setCrops] = useState([]);

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

  const addSuccess = () => {
    messageApi.success('Crop added successfully!').then(() => {
      window.location.reload();
    });
  };


  const addError = () => {
    messageApi.error('Failed to add crop. Please try again.');
  };

  const addWarning = (warningMessage) => {
    messageApi.warning(warningMessage);
  };

  const onChangeRegion = (checkedValues) => {
    setRegion(checkedValues);
  };

  async function deleteCrop(id) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/crops/deletecrop/${id}`);
      console.log(response.data);
      messageApi.success('Crop deleted successfully!');
      setCrops((prevCrops) => prevCrops.filter(crop => crop._id !== id));
    } catch (error) {
      console.log(error);
      messageApi.error('Failed to delete crop. Please try again.');
    }
  }

  async function addNewCrop(e) {
    e.preventDefault();

    if (crop === '' || cropName === '' || scientificName === '' || plantingSeason === '' || soilType === '' || growthDuration === '' ||
      averageYield === '' || waterRequirements === '' || region.length === 0 || description === '') {
      addWarning('Please fill in all required fields.');
      return;
    }
    // Validation for numeric fields
    if (isNaN(growthDuration) || growthDuration === '') {
      addWarning('Please enter a valid number for Growth Duration.');
      return;
    }
    if (isNaN(averageYield) || averageYield === '') {
      addWarning('Please enter a valid number for Average Yield.');
      return;
    }

    const newCrop = {
      crop: [crop],  // Ensure crop is sent as an array
      cropName: cropName,
      scientificName: scientificName,
      plantingSeason: plantingSeason,
      soilType: soilType,
      growthDuration: parseFloat(growthDuration), // Convert to number
      averageYield: parseFloat(averageYield), // Convert to number
      waterRequirements: waterRequirements,
      region: region,
      description: description,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/crops/addcropdata', newCrop);
      console.log(response.data);
      addSuccess();
      setOpenAddCrop(false);
      setCrop('');
      setCropName('');
      setScientificName('');
      setPlantingSeason('');
      setSoilType('');
      setGrowthDuration('');
      setAverageYield('');
      setWaterRequirements('');
      setRegion([]);
      setDescription('');

      // Reload the crops data after adding a new crop

    } catch (error) {
      console.log(error);
      addError();
    }
  }

  const showModal = (crop) => {
    setSelectedCrop(crop); // Set the selected crop's data
    setOpenCropDetials(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenCropDetials(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpenCropDetials(false);
  };

  const showDrawer = () => {
    setOpenAddCrop(true);
  };

  const onClose = () => {
    setOpenAddCrop(false);
  };

  const columns = [
    {
      title: 'Crop',
      dataIndex: 'crop',
      key: 'crop',
      render: (images) => (
        <div>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Crop ${index + 1}`}
              className="w-10 h-10 mr-3"
            />
          ))}
        </div>
      ),
    },
    {
      title: 'Crop Name',
      dataIndex: 'cropName',
      key: 'cropName',
      className: 'px-4', // Additional padding for spacing
    },
    {
      title: 'Scientific Name',
      dataIndex: 'scientificName',
      key: 'scientificName',
      className: 'px-4',
    },
    {
      title: 'Planting Season',
      dataIndex: 'plantingSeason',
      key: 'plantingSeason',
      className: 'px-4',
    },
    {
      title: 'Soil Type',
      dataIndex: 'soilType',
      key: 'soilType',
      className: 'px-4',
    },
    {
      title: 'Growth Duration (days)',
      dataIndex: 'growthDuration',
      key: 'growthDuration',
      className: 'px-4',
      render: (text) => `${text}`,
    },
    {
      title: 'Average Yield (tons/ha)',
      dataIndex: 'averageYield',
      key: 'averageYield',
      className: 'px-4',
      render: (text) => `${text}`,
    },
    {
      title: 'Water Requirements',
      dataIndex: 'waterRequirements',
      key: 'waterRequirements',
      className: 'px-4',
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      className: 'px-4',
      render: (regions) => regions.join(', '),
    },
    {
      title: '',
      key: 'see more',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" className='text-[#767676]' onClick={() => showModal(record)}>See more...</Button>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="large" className='bg-[#379237] text-white' onClick={() => updateShowDrawer(record)}>Update</Button>
          <Popconfirm
            title="Delete the crop"
            description="Are you sure to delete this crop?"
            onConfirm={() => deleteCrop(record._id)}
            onCancel={() => messageApi.info('Cancelled')}
            okText="Yes"
            cancelText="No"
          >
            <Button size="large" className='text-white bg-red-600'>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    async function fetchCropsDetails() {
      try {
        const response = await axios.post("http://localhost:5000/api/crops/getcropdata");
        console.log("Crops data:", response.data.crops);

        const cropsWithKeys = response.data.crops.map((crop, index) => ({
          ...crop,
          key: crop._id || index,
        }));
        setCrops(cropsWithKeys);
        setFilteredCrops(cropsWithKeys); // Initialize filteredCrops with all crops
      } catch (error) {
        console.log("Error fetching crops:", error);
      }
    }
    fetchCropsDetails();
  }, []);

  useEffect(() => {
    filterCrops();
  }, [selectedPlantingSeason, selectedWaterRequirements, crops]);

  const filterCrops = () => {
    let filtered = [...crops];

    if (selectedPlantingSeason && selectedPlantingSeason !== 'All') {
      filtered = filtered.filter(crop => crop.plantingSeason === selectedPlantingSeason);
    }

    if (selectedWaterRequirements && selectedWaterRequirements !== 'All') {
      filtered = filtered.filter(crop => crop.waterRequirements === selectedWaterRequirements);
    }


    setFilteredCrops(filtered);
  };


  const onSearch = (value) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = crops.filter(crop =>
      crop.cropName.toLowerCase().includes(lowercasedValue)
    );
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
        <div className="w-[121px] h-[29px] text-slate-900 text-xl font-semibold font-['Poppins']">Crop Data</div>
        <Search
          placeholder="Search by Crop name"
          onSearch={onSearch}
          style={{
            width: '250px',
            height: '40px',
          }}
          size='large'
        />
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

        <Button type="primary" icon={<Icon icon="ic:baseline-plus" />} className="bg-[#0c6c41] ml-auto font-['Poppins'] w-[150px] h-[40px]" onClick={showDrawer}>
          Add New Crop
        </Button>
        <Drawer
          title="Add New Crop"
          width={720}
          onClose={onClose}
          open={openAddCrop}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={addNewCrop} type="primary" className='bg-[#0c6c41]'>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical">
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
                    value={crop}
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
                    value={cropName}
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
                    <Option value="Red Earth">Red Earth</Option>
                    <Option value="Reddish Brown Earth">Reddish Brown Earth</Option>
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
                    value={averageYield}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
      <div className="bg-white rounded-xl">
        <Table
          columns={columns}
          dataSource={filteredCrops} // Use filteredCrops instead of crops
          scroll={{ x: 1500 }}
          pagination={{ pageSize: 10 }}
        />
      </div>
      <Modal
        title="Crop Details"
        open={openCropDetails}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        {selectedCrop && (
          <div className="w-[587px] h-[730px] relative">
            <div className="left-[20px] top-[270px] absolute">
              <span style={{ color: 'black', fontSize: '1.125rem', fontWeight: 'normal', fontFamily: 'Poppins', lineHeight: '1.5' }}>
                Crop name:&nbsp;
              </span>
              <span style={{ color: '#817402', fontSize: '1.125rem', fontWeight: 'normal', fontFamily: 'Poppins', lineHeight: '1.5' }}>
                {selectedCrop.cropName}
              </span>
            </div>
            <img className="w-[193px] h-[193px] left-[25%] top-[30px] absolute" src={selectedCrop.crop[0] || "https://via.placeholder.com/193x193"} alt={selectedCrop.cropName} />
            <div className="w-[430px] h-[364px] left-[20px] top-[320px] absolute text-justify text-black text-base font-normal font-['Poppins'] leading-snug" style={{ fontSize: "12px" }}>
              {selectedCrop.description || "No description available."}
            </div>
          </div>
        )}
      </Modal>
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
                  <Option value="Red Earth">Red Earth</Option>
                  <Option value="Reddish Brown Earth">Reddish Brown Earth</Option>
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
