import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from "@iconify/react";
import { Table, Tag } from 'antd';
import { Doughnut } from "react-chartjs-2";
import Warehousebarchart from './Warehousebarchart';
import SriLankaMap from './SriLankaMap';
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";


const pieChartData = {
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [
    {
      label: "Packages",
      data: [10, 20, 30],
      backgroundColor: [
        "#82cd47",
        "#379237",
        "#f0ff42",
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const Fertilizercolumns = [
  {
    title: 'TRANSACTION',
    dataIndex: 'transaction',
    key: 'transaction',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'DATE & TIME',
    dataIndex: 'date_and_time',
    key: 'date & time',
  },
  {
    title: 'Quentity(Kg)',
    dataIndex: 'quentity',
    key: 'quentity',
  },
  {
    title: 'STATUS',
    key: 'status',
    dataIndex: 'status',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = 'blue';
          
          return (
            <Tag
              color={color}
              style={{
                fontSize: '14px',
                padding: '4px 10px',
                width: '100px',
                textAlign: 'center',
              }}
            >
              Complete
            </Tag>
          );
        })}
      </>
    ),
  },
];

const data = [
  {
    key: '1',
    transaction: 'Payment from Bonnie Green',
    date_and_time: 'New York No. 1 Lake Park',
    quentity: 15000,
    tags: ['nice'],
  },
  {
    key: '2',
    transaction: 'Payment from Bonnie Green',
    date_and_time: 'New York No. 1 Lake Park',
    quentity: 15000,
    tags: ['nice'],
  },
  {
    key: '3',
    transaction: 'Payment from Bonnie Green',
    date_and_time: 'New York No. 1 Lake Park',
    quentity: 15000,
    tags: ['nice'],
  },
];




function DashBoard() {

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [farmerCount, setFarmerCount] = useState(0); // State to store the farmer count
 

  useEffect(() => {
    // Fetch all farmers to get the count
    const fetchFarmerCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/farmers/getAllFarmers'); // Make sure this endpoint matches your backend route
        setFarmerCount(response.data.length);  // Set the farmer count
      } catch (error) {
        console.error('Error fetching farmer count:', error);
      }
    };

    fetchFarmerCount();

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
   

  const [farmersStatusCount, setFarmersStatusCount] = useState({ active: 0, unverified: 0 });

  useEffect(() => {
    const fetchFarmersVerificationData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/farmers/getAllFarmers'); 
        const farmers = response.data;

        // Calculate counts for Active and Unverified farmers
        const activeCount = farmers.filter(farmer => farmer.status === "Active").length;
        const unverifiedCount = farmers.filter(farmer => farmer.status === "Unverified").length;

        setFarmersStatusCount({ active: activeCount, unverified: unverifiedCount });
      } catch (error) {
        console.error('Error fetching farmer verification data:', error);
      }
    };

    fetchFarmersVerificationData();
  }, []);
  
  return (
    <div>
      <div className="flex gap-4 p-4">
        {/* Card 1 */}
        <div className="flex items-center bg-green-100 p-4 rounded-md w-64 ">
          <div className="mr-4">
            <div className="text-green-600 text-3xl"><Icon icon="material-symbols-light:warehouse-outline" className='h-16 w-16'  style={{color: '#008000'}} /></div>
          </div>
          <div>
            <h3 className="text-green-800 font-bold">Anuradhapura</h3>
            <p className="text-gray-600">No. 123 / A Saliyapura, Anuradhapura</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-center bg-yellow-100 p-4 rounded-md w-64 ml-14">
          <div className="mr-4">
            <div className="text-green-600 text-3xl"><Icon icon="fluent-emoji-high-contrast:farmer"  className='w-16 h-16' style={{color:' #008000'}} /></div>
          </div>
          <div>
            <h3 className="text-gray-800 font-bold">Farmers</h3>
            <p className="text-gray-800 text-xl">{farmerCount}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex items-center bg-blue-100 p-4 rounded-md w-64 ml-14">
          <div className="mr-4">
            <div className="text-blue-600 text-3xl"><Icon icon="bi:cloud-rain-fill" className='w-16 h-16' style={{color: '#0080ff'}} /></div>
          </div>
          <div>
            <h3 className="text-gray-800 text-xl">24°C</h3>
            <p className="text-gray-600">Anuradhapura</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex items-center bg-white p-4 rounded-md w-64 ml-14">
          <div className="mr-4">
            <div className="text-yellow-500 text-3xl"><Icon icon="solar:sun-2-bold" className='w-16 h-16'  style={{color:' #f2dd38'}} /></div>
          </div>
          <div>
            <h3 className="text-gray-800 text-xl">{currentTime}</h3>
            <p className="text-gray-600">Realtime Insight</p>
          </div>
        </div>
      </div>

      <div className="flex mt-6 ml-4 space-x-10">
        <div className="w-[645px] h-[345px] bg-white rounded-[11px] flex flex-col ">
          <div className="w-[272px] h-[74px] mb-4 p-4">
            <div className="w-[200px] h-[22px] text-gray-900 text-xl font-medium font-['DM Sans'] leading-normal">
              Anuradhapura
            </div>
            <div className="text-[#a3aed0] text-sm font-medium font-['DM Sans'] leading-normal mt-2">
              Mass percentage of fertilizer
            </div>
            <div className="bar_chart">
              <Warehousebarchart/>       
            </div>
          </div>
        </div>

         {/* New section */}
      <div className="flex  ml-4 space-x-10">
        

        <div className="w-[545px] h-[345px] bg-white rounded-[11px] flex flex-col ">
          <div className="w-[262px] h-[74px] mb-4 p-4">
            <div className="booking_dashboard_doughnut_container ">
              <h4>Farmer verification</h4>
              <p className='text-gray-400'>All verification farers summary </p>
              <div className="booking_dashboard_doughnut flex mt-10 ml-10">
  <Doughnut
    data={{
      labels: ['Active', 'Unverified'],
      datasets: [
        {
          label: "Farmers",
          data: [farmersStatusCount.active, farmersStatusCount.unverified],
          backgroundColor: [
            "#82cd47", // Active farmers
            "#f0ff42", // Unverified farmers
          ],
          borderWidth: 1,
        },
      ],
    }}
    options={options}
  />
  <div className="flex flex-col ml-6 mt-10">
    {['Active', 'Unverified'].map((label, index) => (
      <div key={index} className="flex items-center mb-2">
        <div
          className="legend-color mt-6"
          style={{
            backgroundColor: ['#82cd47', '#f0ff42'][index], // Use the same colors from the chart
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            marginRight: '8px',
          }}
        ></div>
        <div className="w-32 mt-5">
          {label}: {index === 0 ? farmersStatusCount.active : farmersStatusCount.unverified}
        </div>
      </div>
    ))}
  </div>
</div>

            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="flex gap-4  mt-8 mb-8">
        {/* Updates section */}
        <div className="w-[750px] h-[438px] bg-white rounded-[11px] flex flex-col p-4  ml-4 mb-4">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Fertilizers</h1>
              <p className="text-sm text-gray-500">List of out of stock and low stock fertilizers.</p>
            </div>
            <button className="px-4 py-2 bg-green-700 text-white rounded-lg text-xs font-bold">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <Table columns={Fertilizercolumns} dataSource={data} />
          </div>
        </div>
        <div>
          <div className="w-[445px] h-[437px] p-6 ml-4 bg-white rounded-[9px] shadow">
          <MapContainer
              center={[7.8731, 80.7718]}
              zoom={7}
              style={{ height: "380px", width: "395px", borderRadius: "10px", marginTop: "10px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard