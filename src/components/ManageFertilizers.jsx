import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from '@iconify/react';
import { Space, Table,  Button, Modal, Input, Tag,Menu,Dropdown,message,Popconfirm } from 'antd';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ManageFertilizers() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fertilizers, setFertilizers] = useState([]);
  const [fertilizerName, setFertilizerName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');


  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };


  //update model
  const [ufertilizerName, setuFertilizerName] = useState('');
  const [uquantity, setuQuantity] = useState('');
  const [udate, setuudate] = useState('');
  const [uopen, setuOpen] = useState(false);
  const [uloading, setuLoading] = useState(true);
  const [selectedFertilizerId, setselectedFertilizerId] = useState(null);



  const showuLoading = () => {
    setuOpen(true);
    setuLoading(true);
    
    setTimeout(() => {
      setuLoading(false);
    }, 500);
  };


  const showUpdateModal = async (id) => {
    showuLoading();
    setselectedFertilizerId(id)
    try {
      const response = await axios.post(`http://localhost:5000/api/fertilizers/getFertilizer/${id}`);
      setuFertilizerName(response.data.fertilizer.fertilizerName);
      setuQuantity(response.data.fertilizer.quantity);
    } catch (error) {
      console.log(error);
    } finally {
      setuLoading(false);
    }
  };

  const updateFertilizer = async (e) => {
    e.preventDefault();
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // Extract the date part only

    const updateData = {
       quantity: uquantity,
       date : currentDate,
     };
    try {
      const response = await axios.put(`http://localhost:5000/api/fertilizers/updatefertilizer/${selectedFertilizerId}`, updateData);
      message.success('Fertilizer quantity updated successfully!').then(() => {
        setuOpen(false);
        fetchData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fertilizers/getallFertilizers");
      // Ensure you're getting _id from the backend response
      const formattedFertilizers = response.data.map((fertilizer, index) => ({
        key: fertilizer._id, // Use the actual _id as the key
        fertilizer: fertilizer.fertilizerName,
        lastUpdated: fertilizer.date,
        amount: fertilizer.quantity,
        status: fertilizer.quantity === 0 ? 'out of stock' : fertilizer.quantity < 100 ? 'low stock' : 'In stock',
        _id: fertilizer._id, // Add the _id to each record for deletion
      }));
      setFertilizers(formattedFertilizers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addfertilizer = async (event) => {
    event.preventDefault();

    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // Extract the date part only

    const fertilizer = {
      fertilizerName,
      quantity,
      date: currentDate,
    };

    try {
      const result = await axios.post("http://localhost:5000/api/fertilizers/addFertilizer", fertilizer);
      console.log(result.data);

      message.success('Fertilizer added successfully!').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  const deletewarehouse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/fertilizers/delete/${id}`);
      message.success('Fertilizer deleted successfully');
      fetchData(); // Reload data after successful deletion
    } catch (error) {
      console.log(error);
      message.error('Failed to delete fertilizer');
    }
  };
  
  

  const columns = [
    {
      title: "Fertilizer",
      dataIndex: "fertilizer",
      key: "fertilizer",
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
    },
    {
      title: "Amount(Kg)",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        switch (status) {
          case "low stock":
            color = "gold";
            break;
          case "out of stock":
            color = "red";
            break;
          case "available":
            color = "green";
            break;
          default:
            color = "blue";
        }
        return (
          <Tag color={color}
          style={{
            fontSize: '14px',
            padding: '4px 10px',
            width: '110px',
            textAlign: 'center',
          }}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: <div className="text-center">Action</div>,
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className="flex justify-center">
          <button onClick={() => showUpdateModal(record._id)}  className="ml-4">
            <Icon icon="lucide:edit" className="text-green-500 text-2xl" />
          </button>
          <Popconfirm
            title="Delete the fertilizer"
            description="Are you sure to delete this fertilizer?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deletewarehouse(record._id)} // Correctly pass the _id
          >
            <button className="ml-4">
              <Icon icon="streamline:recycle-bin-2" className="text-red-500 text-2xl" />
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  const [error, setError] = useState('');

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value < 0) {
      setError('Quantity cannot be negative');
    } else {
      setError('');
      setQuantity(value);
    }
  };

  // Data for Bar chart
  const barData = {
    labels: fertilizers.map((fertilizer) => fertilizer.fertilizer), // Fertilizer names
    datasets: [
      {
        label: 'Quantity (Kg)',
        data: fertilizers.map((fertilizer) => fertilizer.amount), // Quantities
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 15, // Rounded corners
        barThickness: 60, // Adjust thickness of the bars for better visibility
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Fertilizer Quantities',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };


  return (
    <div >
   <div className='flex mt'></div>
      
   <Bar data={barData} options={barOptions} />
      
      <div className=" h-[66px] p-4 bg-white rounded-tl-lg rounded-tr-lg flex flex-col justify-center items-start gap-[721px] mt-5 mr-4 ml-3">
      <div className="w-full h-[50px] relative">
        <div className="absolute left-0 top-[28px] w-[416.21px] text-zinc-500/80 text-[13px] font-normal font-['Plus Jakarta Sans'] leading-snug">
          Lorem ipsum dolor sit amet, consectetur adipis.
        </div>
        <div className="absolute left-0 top-0 w-[141.60px] text-zinc-900/80 text-base font-bold font-['Plus Jakarta Sans'] leading-normal">
          Recent Pending
        </div>
        <div className="absolute right-0 top-0 w-[190.23px] h-[30px] p-4 bg-white rounded-[5px] flex justify-center  items-center mr-[10px]">
          <div className="w-[126px] flex justify-center ml-10 items-center gap-[5px]">
          <div className="w-[90px] h-[35px] bg-[#0c6c41] rounded flex justify-center items-center">
          <button onClick={showLoading} className="text-white  text-sm font-normal font-['Lexend']">
           Add Fertilizer
          </button>
        </div>
            <div className="w-3.5 h-3.5 flex justify-end items-center">
              <div className="w-[11px] h-[11px] relative">
                {/* Placeholder for icon or additional content */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <Modal
        title={<p>Add  Fertilizer</p>}
        footer={
          null
        }
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <form onSubmit={addfertilizer} className="max-w-md mx-auto">
       <div className="relative z-0 w-full mb-5 group mt-6">
              <input
                type="text"
                value={fertilizerName}
                onChange={(e) => setFertilizerName(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                required
              />
              <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Fertilizer Name</label>
            </div>
            <div className="relative z-0 w-full mb-5 group mt-6">
      <input
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
          error ? 'border-red-600' : 'border-gray-300'
        } appearance-none focus:outline-none focus:ring-0 ${
          error ? 'focus:border-red-600' : 'focus:border-blue-600'
        } peer`}
        placeholder=""
        required
      />
      <label
        className={`absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 ${
          error ? 'text-red-600' : 'text-gray-500'
        } peer-focus:left-0 ${
          error ? 'peer-focus:text-red-600' : 'peer-focus:text-blue-600'
        } peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}
      >
        Quantity (Kg)
      </label>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Submit
            </button>
       </form> 
      </Modal>

      <Modal
        title={<p>Update Fertilizer Qount</p>}
        footer={
          null
        }
        loading={uloading}
        open={uopen}
        onCancel={() => setuOpen(false)}
      >
        <form onSubmit={updateFertilizer} className="max-w-md mx-auto">
        <div class="mb-5 mt-5">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-400 dark:gray-900">Fertilizer name</label>
    <input type="text"
                value={ufertilizerName}
                onChange={(e) => setuFertilizerName(e.target.value)}
                readOnly
             class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-200  dark:placeholder-gray-400   dark:shadow-sm-light"   />
  </div>
  <div class="mb-5 mt-5">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-400 dark:gray-900">Update Quentity</label>
    <input type="number"
                value={uquantity}
                onChange={(e) => setuQuantity(e.target.value)}
             class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-200  dark:placeholder-gray-400   dark:shadow-sm-light"   />
  </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              update
            </button>
       </form> 
      </Modal>

    <div className="mt-5 mr-3 ml-4">
    <Table columns={columns} dataSource={fertilizers} pagination={false} />
    </div>
    <br></br>
    </div>
  );
}

export default ManageFertilizers;
