import React, { useEffect, useState } from 'react'
import { AudioOutlined, DownloadOutlined } from '@ant-design/icons';
import { Input, Button, Space, Table, Tag } from 'antd';
import { Icon } from "@iconify/react";
import '../styles/CropData.css'
import axios from "axios";
const { Search } = Input;

<AudioOutlined
  style={{
    fontSize: 16,
    color: '#1677ff',
  }}
/>

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
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
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
    render: (text) => `${text}`, // Add "days" to the growth duration
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
        <a href={`/delete/${record.key}`}><Button type="text" className='text-[#767676]'>See more...</Button></a>
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

const data = [

];

const onSearch = (value, _e, info) => console.log(info?.source, value);
function CropData() {

  const [size, setSize] = useState('samll');

  const [crops, setCrops] = useState([]);

  useEffect(() => {
    async function fetchCropsDetails() {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/crops/getcropdata"
        );
        // Assign a unique key to each crop item
        const cropsWithKeys = response.data.crops.map((crop, index) => ({
          ...crop,
          key: index, // or use crop._id if it exists
        }));
        setCrops(cropsWithKeys);
        console.log(response.data.crops);
      } catch (error) {
        console.log(error);
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
        <Button type="primary" icon={<DownloadOutlined />} size={size} className="relative left-[640px] bg-[#bfbfbf]" />
        <Button type="primary" icon={<Icon icon="ic:baseline-plus" />} className="bg-[#0c6c41] ml-auto font-['Poppins']">
          Add New Crop
        </Button>
      </div>
      <Table columns={columns} dataSource={crops} className='m-[7px] px-[7px]'/>
    </>
  )
}

export default CropData