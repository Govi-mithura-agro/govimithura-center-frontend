import React, { useEffect, useState } from "react";
import axios from "axios";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import {
  Button,
  Drawer,
  Popconfirm,
  Space,
  Table,
  message,
  Form,
  Input,
  Upload,
  Select,
  Modal,
} from "antd";
import {
  UploadOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";

const { Option } = Select;

function FertilizerList() {
  const [fertilizers, setFertilizers] = useState([]);
  const [filteredFertilizers, setFilteredFertilizers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedSoilType, setSelectedSoilType] = useState("All");
  const [selectedWaterRequirement, setSelectedWaterRequirement] =
    useState("All");

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedFertilizer, setSelectedFertilizer] = useState(null);
  const [addForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);

  const updateOnClose = () => {
    setUpdateOpen(false);
    setSelectedFertilizer(null); // Clear selected fertilizer
  };

  const columns = [
    {
      title: "Fertilizer Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <img
          src={imageUrl || "https://via.placeholder.com/150"}
          alt="Crop"
          className="w-10 h-10"
        />
      ),
    },
    {
      title: "Fertilizer Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Soil Type",
      dataIndex: "soilType",
      key: "soilType",
    },
    {
      title: "Water Requirements",
      dataIndex: "waterRequirements",
      key: "waterRequirements",
    },
    {
      title: "Crops",
      dataIndex: "crops",
      key: "crops",
      render: (crops) => crops.join(", "),
    },
    {
      title: "Average Amount(Kg/ha)",
      dataIndex: "fertilizerAmount",
      key: "fertilizerAmount",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="large"
            className="bg-[#379237] text-white"
            onClick={() => updateShowDrawer(record)} // Ensure this is the correct function
          >
            Update
          </Button>
          <Popconfirm
            title="Delete the fertilizer"
            description="Are you sure to delete this fertilizer?"
            onConfirm={() => deleteFertilizer(record._id)}
            onCancel={() => message.info("Cancelled")}
            okText="Yes"
            cancelText="No"
          >
            <Button size="large" className="text-white bg-red-600">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Create styles
  const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    section: {
      margin: 10,
      padding: 10,
      border: "1px solid black",
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
    },
  });

  // Create Document Component
  const MyDocument = ({ crops }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Fertilizer List</Text>
          {crops.map((crop, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.title}>{crop.name}</Text>
              <Text style={styles.text}>Soil Type: {crop.soilType}</Text>
              <Text style={styles.text}>
                Water Requirements: {crop.waterRequirements}
              </Text>
              <Text style={styles.text}>Crops: {crop.crops.join(", ")}</Text>
              <Text style={styles.text}>Description: {crop.description}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  useEffect(() => {
    fetchFertilizers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [fertilizers, searchText, selectedSoilType, selectedWaterRequirement]);

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

  const applyFilters = () => {
    let filtered = fertilizers;

    if (searchText) {
      filtered = filtered.filter((fertilizer) =>
        fertilizer.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedSoilType !== "All") {
      filtered = filtered.filter(
        (fertilizer) => fertilizer.soilType === selectedSoilType
      );
    }

    if (selectedWaterRequirement !== "All") {
      filtered = filtered.filter(
        (fertilizer) =>
          fertilizer.waterRequirements === selectedWaterRequirement
      );
    }

    setFilteredFertilizers(filtered);
  };

  const deleteFertilizer = (id) => {
    axios
      .delete(`http://localhost:5000/api/fertilizers/deletefertilizer/${id}`)
      .then(() => {
        message.success("Fertilizer deleted successfully");
        fetchFertilizers();
      })
      .catch(() => {
        message.error("Failed to delete fertilizer");
      });
  };

  const showAddModal = () => {
    setIsAdding(true);
  };

  const updateShowDrawer = (fertilizer) => {
    setSelectedFertilizer(fertilizer);
    setUpdateOpen(true); // Open the Drawer

    // Populate the form fields with the selected fertilizer's data
    updateForm.setFieldsValue({
      imageUrl: fertilizer.imageUrl,
      name: fertilizer.name,
      soilType: fertilizer.soilType,
      fertilizerAmount: fertilizer.fertilizerAmount,
      waterRequirements: fertilizer.waterRequirements,
      crops: fertilizer.crops.join(", "), // Ensure this matches the format expected by the form
      description: fertilizer.description,
    });
  };

  const handleAddOk = () => {
    addForm
      .validateFields()
      .then((values) => {
        const {
          imageUrl,
          name,
          soilType,
          fertilizerAmount,
          waterRequirements,
          crops,
          description,
        } = values;

        axios
          .post("http://localhost:5000/api/fertilizers/addfertilizer", {
            imageUrl,
            name,
            soilType,
            fertilizerAmount: parseFloat(fertilizerAmount), // Convert to number
            waterRequirements,
            crops: crops.split(",").map((crop) => crop.trim()), // Convert to array if needed
            description,
          })
          .then(() => {
            message.success("Fertilizer added successfully!");
            addForm.resetFields();
            fetchFertilizers();
            setIsAdding(false);
          })
          .catch((error) => {
            message.error("Failed to add fertilizer");
            console.error("Error adding fertilizer:", error);
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleAddCancel = () => {
    setIsAdding(false);
  };

  const handleUpdateOk = () => {
    updateForm
      .validateFields()
      .then((values) => {
        const {
          imageUrl,
          name,
          soilType,
          fertilizerAmount, // Ensure this is correctly retrieved
          waterRequirements,
          crops,
          description,
        } = values;

        console.log("Updating with values:", {
          imageUrl,
          name,
          soilType,
          fertilizerAmount, // Correctly handled here
          waterRequirements,
          crops: crops.split(", ").map((crop) => crop.trim()), // Ensure this is the correct format
          description,
        });

        axios
          .put(
            `http://localhost:5000/api/fertilizers/editfertilizer/${selectedFertilizer._id}`,
            {
              imageUrl,
              name,
              soilType,
              fertilizerAmount, // Send this value
              waterRequirements,
              crops: crops.split(", ").map((crop) => crop.trim()), // Convert string back to array
              description,
            }
          )
          .then(() => {
            message.success("Fertilizer updated successfully!");
            updateForm.resetFields();
            fetchFertilizers();
            setUpdateOpen(false);
            setSelectedFertilizer(null); // Clear selected fertilizer
          })
          .catch((error) => {
            message.error("Failed to update fertilizer");
            console.error("Error updating fertilizer:", error);
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleUpdateCancel = () => {
    setUpdateOpen(false);
    setSelectedFertilizer(null); // Clear selected fertilizer
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleSoilTypeChange = (value) => {
    setSelectedSoilType(value);
  };

  const handleWaterRequirementsChange = (value) => {
    setSelectedWaterRequirement(value);
  };

  return (
    <div className="p-6">
      <div className="flex justify-start gap-[25px] items-center h-[74px] bg-white rounded-[11px] m-[15px] px-[15px]">
        <div className="w-[160px] h-[29px] text-slate-900 text-xl font-semibold font-['Poppins']">
          Fertilizer Data
        </div>

        <Input
          placeholder="Search by Fertilizer Name"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          placeholder="Select Soil Type"
          style={{ width: 200 }}
          onChange={handleSoilTypeChange}
          defaultValue="All"
        >
          <Option value="All">All</Option>
          <Option value="Clay">Clay</Option>
          <Option value="Sandy">Sandy</Option>
          <Option value="Loamy">Loamy</Option>
        </Select>
        <Select
          placeholder="Select Water Requirements"
          style={{ width: 200 }}
          onChange={handleWaterRequirementsChange}
          defaultValue="All"
        >
          <Option value="All">All</Option>
          <Option value="High">High</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Low">Low</Option>
        </Select>
        <PDFDownloadLink
          document={<MyDocument crops={filteredFertilizers} />}
          fileName="fertilizer_data.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? (
              "Loading document..."
            ) : (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                className="ml-auto"
              >
                Download PDF
              </Button>
            )
          }
        </PDFDownloadLink>
        <Button type="primary" className="ml-auto" onClick={showAddModal}>
          Add New Fertilizer
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredFertilizers} rowKey="_id" />

      {/* Add Fertilizer Modal */}
      <Modal
        title="Add Fertilizer"
        visible={isAdding}
        onOk={handleAddOk}
        confirmLoading={confirmLoading}
        onCancel={handleAddCancel}
      >
        <Form form={addForm} layout="vertical" name="add_fertilizer">
          <Form.Item
            name="imageUrl"
            label="Fertilizer Image"
            rules={[{ required: true, message: "Please enter the image URL" }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Fertilizer Name"
            rules={[
              { required: true, message: "Please enter the fertilizer name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="soilType"
            label="Soil Type"
            rules={[{ required: true, message: "Please select the soil type" }]}
          >
            <Select placeholder="Select Soil Type" style={{ width: 200 }}>
              <Option value="Clay">Clay</Option>
              <Option value="Sandy">Sandy</Option>
              <Option value="Loamy">Loamy</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="fertilizerAmount"
            label="Fertilizer Amount"
            rules={[
              { required: true, message: "Please enter the fertilizer amount" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="waterRequirements"
            label="Water Requirements"
            rules={[
              {
                required: true,
                message: "Please select the water requirements",
              },
            ]}
          >
            <Select
              placeholder="Select Water Requirements"
              style={{ width: 200 }}
            >
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="crops"
            label="Crops"
            rules={[{ required: true, message: "Please list the crops" }]}
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
        </Form>
      </Modal>

      {/* Update Fertilizer Drawer */}
      <Drawer
        title="Update Fertilizer Details"
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
        <Form form={updateForm} layout="vertical" name="update_fertilizer">
          <Form.Item name="imageUrl" label="Fertilizer Image">
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Fertilizer Name"
            rules={[
              { required: true, message: "Please enter the fertilizer name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="soilType"
            label="Soil Type"
            rules={[{ required: true, message: "Please enter the soil type" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fertilizerAmount"
            label="Fertilizer Amount"
            rules={[
              { required: true, message: "Please enter the fertilizer amount" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="waterRequirements"
            label="Water Requirements"
            rules={[
              {
                required: true,
                message: "Please enter the water requirements",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="crops"
            label="Crops"
            rules={[{ required: true, message: "Please list the crops" }]}
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
        </Form>
      </Drawer>

      {/* Details Modal */}
    </div>
  );
}

export default FertilizerList;
