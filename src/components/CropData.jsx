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
function CropData() {

  const [size, setSize] = useState('samll');

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
        <Button type="primary" icon={<DownloadOutlined />} size={size} className="relative left-[640px] bg-[#bfbfbf]"/>
        <Button type="primary" icon={<Icon icon="ic:baseline-plus" />} className="bg-[#0c6c41] ml-auto font-['Poppins']">
          Add New Crop
        </Button>
      </div>
    </>
  )
}

export default CropData