import React, { useEffect, useState } from 'react';
import { AudioOutlined, DownloadOutlined } from '@ant-design/icons';
import { Input, Button, Space, Table, Modal } from 'antd';
import { Icon } from "@iconify/react";
import '../styles/CropData.css';
import axios from "axios";

const { Search } = Input;

function CropData() {

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null); // State to hold the selected crop's data

  const [size, setSize] = useState('medium');
  const [crops, setCrops] = useState([]);

  const showModal = (crop) => {
    setSelectedCrop(crop); // Set the selected crop's data
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
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
              style={{ width: '40px', height: '40px', marginRight: '10px' }}
            />
          ))}
        </div>
      ),
    },
    {
      title: 'Crop Name',
      dataIndex: 'cropName',
      key: 'cropName',
    },
    {
      title: 'Scientific Name',
      dataIndex: 'scientificName',
      key: 'scientificName',
    },
    {
      title: 'Planting Season',
      dataIndex: 'plantingSeason',
      key: 'plantingSeason',
    },
    {
      title: 'Soil Type',
      dataIndex: 'soilType',
      key: 'soilType',
    },
    {
      title: 'Growth Duration (days)',
      dataIndex: 'growthDuration',
      key: 'growthDuration',
      render: (text) => `${text} days`, // Add "days" to the growth duration
    },
    {
      title: 'Average Yield (tons/ha)',
      dataIndex: 'averageYield',
      key: 'averageYield',
      render: (text) => `${text}`, // Assuming this is the unit
    },
    {
      title: 'Water Requirements',
      dataIndex: 'waterRequirements',
      key: 'waterRequirements',
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      render: (regions) => regions.join(', '), // Join regions with commas
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
          <a href={`/invite/${record.key}`}><Button size="large" className='bg-[#379237] text-[white]'>Update</Button></a>
          <a href={`/delete/${record.key}`}><Button size="large" className='bg-[red] text-[white]'>Delete</Button></a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    async function fetchCropsDetails() {
      try {
        const response = await axios.post("http://localhost:5000/api/crops/getcropdata");
        console.log("Crops data:", response.data.crops);

        if (Array.isArray(response.data.crops)) {
          response.data.crops.forEach(crop => {
            console.log("Crop ID:", crop._id); // Ensure _id is present in each crop
          });
        } else {
          console.error("Expected an array of crops but got:", response.data.crops);
        }

        const cropsWithKeys = response.data.crops.map((crop, index) => ({
          ...crop,
          key: crop._id || index, // Use crop._id as key if available, otherwise fallback to index
        }));
        setCrops(cropsWithKeys);
      } catch (error) {
        console.log("Error fetching crops:", error);
      }
    }
    fetchCropsDetails();
  }, []);

  const onSearch = (value) => console.log('Search:', value);

  return (
    <>
      <div className="flex justify-start gap-[25px] items-center h-[74px] bg-white rounded-[11px] m-[15px] px-[15px]">
        <div className="w-[121px] h-[29px] text-slate-900 text-xl font-semibold font-['Poppins']">Crop Data</div>
        <Search
          placeholder="Search by Crop name"
          onSearch={onSearch}
          style={{
            width: 200,
          }}
        />
        <Button type="primary" icon={<DownloadOutlined />} size={size} className="relative left-[625px] bg-[#bfbfbf]" />
        <Button type="primary" icon={<Icon icon="ic:baseline-plus" />} className="bg-[#0c6c41] ml-auto font-['Poppins']">
          Add New Crop
        </Button>
      </div>
      <Table columns={columns} dataSource={crops} className='m-[7px] px-[7px]' />
      <Modal
        title="Crop Details"
        open={open}
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
            <div className="w-[430px] h-[364px] left-[20px] top-[320px] absolute text-justify text-black text-base font-normal font-['Poppins'] leading-snug text-[12px]">
              {selectedCrop.description || "No description available."}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default CropData;
