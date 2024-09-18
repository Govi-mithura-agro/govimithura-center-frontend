import React, { useState, useRef, useEffect } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Icon } from "@iconify/react";
//import Loader from "./Loader";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  ConfigProvider,
  Modal,
  DatePicker,
  Input,
  Button,
  Radio,
  Space,
  message,
  Upload,
  Avatar,
  Tag,
  Table,
} from "antd";

import axios from "axios";
import { set } from "mongoose";

let index = 0;

const { Search, TextArea } = Input;

function FarmersList() {
  const [selectedType, setSelectedType] = useState("all");
  const [addEmployeeModelOpen, setAddEmployeeModelOpen] = useState(false);
  const [tableModelOpen, setTableModelOpen] = useState(false);
  const [tableModelContent, setTableModelContent] = useState();
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);

  // Add farmer model use states
  const [address, setAddress] = useState({
    addressLine: "",
    province: "",
    district: "",
    division: "",
  });
  const [addressLine, setAddressLine] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [division, setDivision] = useState("");
  const [dob, setDob] = useState("");
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [status, setStatus] = useState("");

  //Edit farmer model use states
  const [editAddress, setEditAddress] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [editIdNumber, setEditIdNumber] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editProfileImage, setEditProfileImage] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const [fileListEdit, setFileListEdit] = useState([]);

  const customRequestEdit = ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("image", file);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=700c61f2bf87cf203338efe206d7e66f",
        formData
      )
      .then((response) => {
        if (response.data.data) {
          onSuccess();
          message.success("Image uploaded successfully");
          setFileListEdit([
            {
              uid: "1",
              name: "image.png",
              status: "done",
              url: response.data.data.url,
            },
          ]);
          setEditProfileImage(response.data.data.url);
          console.log(profileImage);
          setLoading(false);
        } else {
          onError();
          message.error("Failed to upload image");
        }
      })
      .catch((error) => {
        onError();
        message.error("Error uploading image: " + error.message);
      });
  };

  const saveEditEmployee = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !editAddress ||
      !editDob ||
      !editFullName ||
      !editIdNumber ||
      !editEmail ||
      !editPhoneNumber
    ) {
      return message.error("Please fill all the fields");
    } else if (!emailRegex.test(editEmail)) {
      return message.error("Please enter a valid email address");
    }

    if (!editProfileImage || editProfileImage.trim() === "") {
      setProfileImage(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/1200px-Windows_10_Default_Profile_Picture.svg.png"
      );
    } else {
      console.log("Profile image already set:", editProfileImage);
    }

    const farmerData = {
      farmerID: tableModelContent.farmerID, // Ensure you send the correct ID field
      address: editAddress,
      dob: editDob, // Make sure dob is the correct type
      fullname: editFullName,
      idnumber: editIdNumber,
      phoneNumber: editPhoneNumber,
      profileImage: editProfileImage,
      email: editEmail,
    };

    console.log("Sending farmer data:", farmerData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/farmers/editFarmer",
        farmerData
      );
      console.log("Response:", response.data);
      message.success("Farmer edited successfully");
      setTableModelOpen(false);
      fetchFarmersList();
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      message.error(error.response?.data?.message || "An error occurred");
    }
  };

  //Employee table
  const columns = [
    {
      title: "",
      dataIndex: "profileImage",
      key: "profileImage",
      render: (_, record) => (
        <Avatar size={35} src={record.profileImage} alt="profileImage" />
      ),
    },
    {
      title: "ID",
      dataIndex: "farmerID",
      key: "farmerID",
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Id Number",
      dataIndex: "idnumber",
      key: "idnumber",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <div>
          <p>{address.addressLine}</p>
          <p>{address.province}</p>
          <p>{address.district}</p>
          <p>{address.division}</p>
        </div>
      ),
    },

    {
      title: "phoneNumber",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        let color = "green";
        if (status === "Unverified") {
          color = "red";
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "Verified" ? (
            <button
              style={{
                fontSize: "20px",
                color: "#9D9D9D",
                border: "none",
                background: "transparent",
              }}
              onClick={() => showModal(record)}
            >
              <Icon icon="uil:setting" />
            </button>
          ) : (
            <button
              style={{
                fontSize: "20px",
                color: "#9D9D9D",
                border: "none",
                background: "transparent",
              }}
              onClick={() => showModal(record)}
            >
              <Icon icon="uil:setting" />
            </button>
          )}
        </Space>
      ),
    },
  ];

  const showModal = (record) => {
    setTableModelContent(record);
    setTableModelOpen(true);
    setEditAddress(record.address);
    setEditDob(record.dob);
    setEditFullName(record.fullname);
    setEditIdNumber(record.idnumber);
    setEditEmail(record.email);
    setEditPhoneNumber(record.phoneNumber);
    setEditUsername(record.username);
    setEditProfileImage(record.profileImage);
    setEditStatus(record.status);
    setFileListEdit([
      {
        uid: "1",
        name: "image.png",
        status: "done",
        url: record.profileImage,
      },
    ]);
  };
  async function fetchFarmersList() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/farmers/getAllFarmers"
      );
      setEmployeeList(response.data);
      console.log(response.data.farmers);
      setIsEmployeeLoading(false);
    } catch (error) {
      console.error("Error fetching farmers list:", error);
      setIsEmployeeLoading(false);
    }
  }

  const saveFarmer = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate required fields
    if (
      !address.addressLine ||
      !address.province ||
      !address.district ||
      !address.division ||
      !dob ||
      !fullName ||
      !idNumber ||
      !email ||
      !phoneNumber ||
      !username
    ) {
      return message.error("Please fill all the fields");
    } else if (!emailRegex.test(email)) {
      return message.error("Please enter a valid email address");
    }

    // Set default profile image if none is provided
    if (!profileImage || profileImage.trim() === "") {
      setProfileImage(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/1200px-Windows_10_Default_Profile_Picture.svg.png"
      );
    } else {
      console.log("Profile image already set:", profileImage);
    }

    // Prepare the data to be sent
    const farmerData = {
      profileImage,
      idnumber: idNumber,
      fullname: fullName,
      email,
      phoneNumber,
      username,
      address: {
        addressLine: address.addressLine,
        province: address.province,
        district: address.district,
        division: address.division,
      },
      dob,
      status: "Unverified",
    };

    try {
      // Send a POST request to add a new farmer
      await axios.post(
        "http://localhost:5000/api/farmers/addFarmer",
        farmerData
      );

      message.success("Farmer added successfully");
      setAddEmployeeModelOpen(false);
      fetchFarmersList();

      // Reset form fields
      setAddress({
        addressLine: "",
        province: "",
        district: "",
        division: "",
      });
      setDob(null);
      setFullName("");
      setIdNumber("");
      setEmail("");
      setPhoneNumber("");
      setUsername("");
      setProfileImage("");
      setFileList([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while adding the farmer";
      message.error(errorMessage);
    }
  };

  // Image upload
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleCancel = () => setPreviewOpen(false);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const customRequest = ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("image", file);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=700c61f2bf87cf203338efe206d7e66f",
        formData
      )
      .then((response) => {
        if (response.data.data) {
          onSuccess();
          message.success("Image uploaded successfully");
          setFileList([
            {
              uid: "1",
              name: "image.png",
              status: "done",
              url: response.data.data.url,
            },
          ]);
          setProfileImage(response.data.data.url);
          console.log(profileImage);
          setLoading(false);
        } else {
          onError();
          message.error("Failed to upload image");
        }
      })
      .catch((error) => {
        onError();
        message.error("Error uploading image: " + error.message);
      });
  };

  // Table Functions
  const [employeeList, setEmployeeList] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    position: ["bottomCenter"],
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const conformSuspend = () => {
    setIsConformModalOpen(true);
  };

  const conformActive = () => {
    setIsVerifyModalOpen(true);
  };

  const [isConformModalOpen, setIsConformModalOpen] = useState(false);
  const [IsVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const verifyFarmer = async () => {
    try {
      // Verify the farmer by sending a POST request to the server
      await axios.post("http://localhost:5000/api/farmers/verifyFarmer", {
        farmerID: tableModelContent.farmerID,
      });

      // Display a success message
      message.success("Farmer verified successfully");

      // Close any open modals or dialogs
      setTableModelOpen(false);
      setIsVerifyModalOpen(false);

      // Fetch the updated list of farmers
      fetchFarmersList();
    } catch (error) {
      // Log any errors that occur during the process
      console.log(error);
      message.error("Failed to verify farmer");
    }
  };

  useEffect(() => {
    fetchFarmersList();
  }, []);

  //Filter employee list
  const [filteredEmployeeList, setFilteredEmployeeList] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const formatDareful = (date) => {
    const createdAtDate = new Date(date);
    const formattedDate = createdAtDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  };

  useEffect(() => {
    let tempList = employeeList;

    if (searchKey && searchKey !== "") {
      tempList = tempList.filter(
        (item) =>
          item.firstName.toLowerCase().includes(searchKey) ||
          item.lastName.toLowerCase().includes(searchKey) ||
          item.empID.toLowerCase().includes(searchKey)
      );
    }

    if (selectedType !== "all") {
      tempList = tempList.filter((item) => item.status === selectedType);
    }

    setFilteredEmployeeList(tempList);
  }, [searchKey, selectedType, employeeList]);

  return (
    <div className="flex flex-col">
      {/* Active conformation model */}
      <Modal
        title="Are You Sure?"
        open={IsVerifyModalOpen}
        onOk={verifyFarmer}
        okText="Active"
        onCancel={() => setIsVerifyModalOpen(false)}
        width={300}
        centered
      >
        <p>This can't be undone.</p>
      </Modal>

      {/* Table model */}
      <Modal
        centered
        open={tableModelOpen}
        onOk={() => setTableModelOpen(false)}
        onCancel={() => setTableModelOpen(false)}
        footer={null}
        width={550}
      >
        <div className="p-2 mb-7">
          <div className="flex flex-row justify-center items-center gap-5">
            <div className="w-24 mr-7">
              <Upload
                customRequest={customRequestEdit}
                listType="picture-circle"
                fileList={fileListEdit}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                onRemove={() => {
                  setFileListEdit([]);
                  setEditProfileImage(
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/1200px-Windows_10_Default_Profile_Picture.svg.png"
                  );
                }}
              >
                {fileListEdit.length >= 1 ? null : uploadButton}
              </Upload>
              <Modal
                open={previewOpen}
                footer={null}
                onCancel={handleCancel}
                title={"Preview: "}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImage}
                />
              </Modal>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center rounded-lg border border-black/15 p-5 pt-2.5 gap-5 my-4.5 mt-5 mb-5">
            <div className="add_employee_popup_details_container_left">
              <div className="mt-2 flex flex-col">
                <span className="mb-1 text-xs">Full Name</span>
                <Input
                  size="large"
                  onChange={(e) => setEditFullName(e.target.value)}
                  value={editFullName}
                />
              </div>

              <div className="flex flex-col mt-2.5">
                <span className="mb-1 text-xs">Email</span>
                <Input
                  type="email"
                  size="large"
                  onChange={(e) => setEditEmail(e.target.value)}
                  value={editEmail}
                />
              </div>

              <div className="flex flex-col mt-2.5">
                <span className="mb-1 text-xs">Phone Number</span>
                <Input
                  size="large"
                  onChange={(e) => setEditPhoneNumber(e.target.value)}
                  value={editPhoneNumber}
                />
              </div>
            </div>

            <div className="add_employee_popup_details_container_left space-y-2.5">
              <div className="flex flex-col mt-2.5">
                <span className="mb-1 text-xs">ID Number</span>
                <Input
                  size="large"
                  onChange={(e) => setEditIdNumber(e.target.value)}
                  value={editIdNumber}
                />
              </div>

              <div className="flex flex-col mt-2.5">
                <span className="mb-1 text-xs">Username</span>
                <Input
                  size="large"
                  onChange={(e) => setEditUsername(e.target.value)}
                  value={editUsername}
                />
              </div>

              <div className="flex flex-col mt-2.5">
                <span className="mb-1 text-xs">Date of Birth</span>
                <DatePicker
                  className="w-52 h-10"
                  defaultValue={moment(editDob)}
                  onChange={(date, dateString) => setEditDob(dateString)}
                />
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-1.5 justify-start items-start rounded-lg border border-gray-300 px-5 py-3.5">
            <span>Address</span>
            <TextArea
              className="w-[520px]"
              rows={4}
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
            />
          </div>
          <div>
            {editStatus === "Active" ? (
              <button
                onClick={conformSuspend}
                className="border-none bg-none w-fit text-red-600 mt-2 ml-1"
              >
                Verify Farmer
              </button>
            ) : (
              <button
                onClick={conformActive}
                className="border-none bg-none w-fit text-green-600 mt-2 ml-1"
              >
                Verify Farmer
              </button>
            )}
          </div>
          <div className="mt-4 flex flex-raw gap-1.5 justify-center gap-[50px] items-start rounded-lg border border-gray-300 px-5 py-4">
            <button
              onClick={() => setTableModelOpen(false)}
              className="w-[120px] h-[40px] bg-green-600 text-white rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={saveEditEmployee}
              className="w-[120px] h-[40px] text-white font-medium text-sm bg-[#533c56] rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <ConfigProvider
        theme={{
          components: {
            Modal: {},
          },
        }}
      >
        <div class="flex flex-col justify-start items-center bg-white w-[calc(100%-30px)] mx-4 mb-4 rounded-xl">
          <div class="flex flex-row items-center w-full h-[80px] px-4 rounded-t-xl bg-[#f5f5f5]">
            <div class="mr-auto flex items-center gap-10">
              <h1 class="text-xl font-semibold">All Farmers</h1>
              <Search
                placeholder="Search"
                size="large"
                onSearch={(value) => setSearchKey(value)}
                className="w-[265px] h-[40px]"
              />
            </div>
            <div class="ml-auto flex items-center">
              <Radio.Group
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                }}
                size="large"
                style={{
                  width: 250,
                }}
              >
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="Active">Verified</Radio.Button>
                <Radio.Button value="Suspended">Unverified</Radio.Button>
              </Radio.Group>
              <button
                class=" flex flex-derectiom-col text-white font-medium text-sm bg-[#533c56] rounded-md py-2.5 px-4"
                onClick={() => setAddEmployeeModelOpen(true)}
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Farmer
              </button>
            </div>
          </div>

          <Modal
            centered
            open={addEmployeeModelOpen}
            onOk={() => setAddEmployeeModelOpen(false)}
            onCancel={() => setAddEmployeeModelOpen(false)}
            footer={null}
            width={550}
          >
            <div class="p-2 mb-7">
              <div class="flex flex-row justify-center items-center gap-5">
                <div class="w-[100px] mr-7">
                  <Upload
                    customRequest={customRequest}
                    listType="picture-circle"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    onRemove={() => setFileList([])}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal
                    open={previewOpen}
                    title={"Preview: "}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt="example"
                      style={{
                        width: "100%",
                      }}
                      src={previewImage}
                    />
                  </Modal>
                </div>
              </div>

              <div class="flex flex-row justify-center items-center rounded-lg border border-gray-300 p-5 gap-5 my-4">
                <div className="add_employee_popup_details_container_left">
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        marginBottom: "3px",
                        fontSize: "12px",
                      }}
                    >
                      Full Name
                    </span>
                    <Input
                      size="large"
                      onChange={(e) => setFullName(e.target.value)}
                      value={fullName}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        marginBottom: "3px",
                        fontSize: "12px",
                      }}
                    >
                      Email
                    </span>
                    <Input
                      type="email"
                      size="large"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        marginBottom: "3px",
                        fontSize: "12px",
                      }}
                    >
                      Phone Number
                    </span>
                    <Input
                      size="large"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      value={phoneNumber}
                    />
                  </div>
                </div>
                <div className="add_employee_popup_details_container_left">
                  <div class="mt-2 flex flex-col">
                    <span class="mb-[3px] text-xs">ID Number</span>
                    <Input
                      size="large"
                      onChange={(e) => setIdNumber(e.target.value)}
                      value={idNumber}
                    />
                  </div>

                  <div class="mt-2 flex flex-col">
                    <span class="mb-[3px] text-xs">Username</span>
                    <Input
                      size="large"
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                    />
                  </div>

                  <div class="mt-2 flex flex-col">
                    <span class="mb-[3px] text-xs">Date of Birth</span>
                    <DatePicker
                      class="w-[205px] h-[40px]"
                      defaultValue={moment(dob)}
                      onChange={(date, dateString) => setDob(dateString)}
                    />
                  </div>
                </div>
              </div>

              <div class="mt-4 flex flex-col gap-1.5 justify-start items-start rounded-lg border border-gray-300 p-[10px_20px_15px_20px]">
                <span>Address Line</span>
                <Input
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                />

                <span>Province</span>
                <Input
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                />

                <span>District</span>
                <Input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />

                <span>Division</span>
                <Input
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                />
              </div>
            </div>
            <div class="flex flex-row justify-between items-center gap-[40px] justify-center items-center">
              <Button
                onClick={() => setAddEmployeeModelOpen(false)}
                style={{
                  width: "120px",
                  height: "40px",
                }}
                danger
              >
                Cancel
              </Button>
              <button
                class="text-white font-medium text-sm bg-[#533c56] rounded-md py-2 px-3"
                onClick={saveFarmer}
                style={{
                  width: "120px",
                  height: "40px",
                }}
              >
                Add Farmer
              </button>
            </div>
          </Modal>

          <div class="w-full">
            <div class="min-h-[192px]">
              {!isEmployeeLoading ? (
                <Table
                  columns={columns}
                  dataSource={filteredEmployeeList}
                  pagination={
                    filteredEmployeeList.length > 10 ? pagination : false
                  }
                  onChange={handleTableChange}
                />
              ) : (
                <div class="flex justify-center items-center h-[192px]">
                  {/* <Loader /> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
}

export default FarmersList;
