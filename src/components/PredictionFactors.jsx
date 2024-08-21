import React, { useState } from 'react'
import { AudioOutlined, DownloadOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import { Icon } from "@iconify/react";
import '../styles/CropData.css'
const { Search } = Input;

<AudioOutlined
  style={{
    fontSize: 16,
    color: '#1677ff',
  }}
/>

const onSearch = (value, _e, info) => console.log(info?.source, value);

function PredictionFactors() {

  const [size, setSize] = useState('samll');

  return (
    <>
      <div className="flex justify-start gap-[25px] items-center h-[80px] bg-white rounded-[11px] m-[15px] px-[15px]">
        <div className="w-40 h-8 text-slate-900 text-xl font-semibold font-['Poppins'] relative bottom-[10px]">Crop Prediction  <br/>Factors</div>
        <Search
          placeholder="Search by District"
          onSearch={onSearch}
          style={{
            width: 200,
          }}
        />
        <Button type="primary" icon={<DownloadOutlined />} size={size} className="relative left-[600px] bg-[#bfbfbf]"/>
        <Button type="primary" icon={<Icon icon="ic:baseline-plus" />} className="bg-[#0c6c41] ml-auto font-['Poppins']">
          Add New Crop
        </Button>
      </div>
    </>
  )
}

export default PredictionFactors