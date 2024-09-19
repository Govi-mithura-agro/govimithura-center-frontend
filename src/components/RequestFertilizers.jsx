import React, { useEffect, useState } from "react";
import axios from "axios";
import { Space,Tag,Table, Modal, Input, Button,Menu,Dropdown,message,Popconfirm } from 'antd';



function RequestFertilizers() {

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fertilizerName, setfertilizerName] = useState("");
  const [fertilizerRequests, setFertilizerRequests] = useState([]); // For fertilizer request data
  const [wantedDate, setwantedDate] = useState("");
  const [quantity, setquantity] = useState("");
  const [description, setdescription] = useState("");
  
   // New state variables for status counts
   const [approvedCount, setApprovedCount] = useState(0);
   const [pendingCount, setPendingCount] = useState(0);
   const [rejectedCount, setRejectedCount] = useState(0);
   const [totalCount, settotalCount] = useState(0);
   

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  
  const [warehouseID, setWarehouseID] = useState('');

  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/warehouses/getallwarehouse');
        const warehouses = response.data;
        const matchingWarehouse = warehouses.find(warehouse => warehouse.district === user?.address?.district);

        if (matchingWarehouse) {
          setWarehouseID(matchingWarehouse._id);
        }
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };

    if (user?.address?.district) {
      fetchWarehouses();
    }
  }, [user?.address?.district]);

  useEffect(() => {
    if (warehouseID) {
      fetchData();
    }
  }, [warehouseID]);


  const requestFertilizer = async (event) => {
    event.preventDefault();
    // Get current date and time
    const currentDateTime = new Date().toISOString(); // You can format this as needed

    const request = {
      warehouseID:warehouseID,
      fertilizerName,
      requestDate: currentDateTime, // Set current date as request date
      wantedDate,
      quantity,
      description,
    };

    try {
      const result = await axios.post("http://localhost:5000/api/fertilizers/requesrFertilizer", request);
      console.log(result.data);

      message.success('Fertilizer request send successfully!').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/fertilizers/getFertilizerRequestedWarehouseId", {
        warehouseid: warehouseID, // Correct the key to 'warehouseid'
      });
      setFertilizerRequests(response.data); // Update state with the fetched data

      const requests = response.data;
      setFertilizerRequests(requests);

      // Calculate the count of each status
      const approved = requests.filter(req => req.status === "Approved").length;
      const pending = requests.filter(req => req.status === "Pending").length;
      const rejected = requests.filter(req => req.status === "Disapproved").length;

      // Update the state with the counts
      setApprovedCount(approved);
      setPendingCount(pending);
      setRejectedCount(rejected);
      settotalCount(approved+pending+rejected)

      
    } catch (error) {
      console.error('Error fetching fertilizer requests:', error);
    }
  };

 

  const requestData = fertilizerRequests.map((request, index) => ({
    key: index,
    fertilizerName: request.fertilizerName,
    requestedDate: new Date(request.requestDate).toLocaleDateString(),
    fromDate: new Date(request.wantedDate).toLocaleDateString(),
    status: request.status,
    description: request.description,
    quantity: request.quantity,
  }));

  const columns = [
    {
      title: 'Fertilizer Name',
      dataIndex: 'fertilizerName',
      key: 'fertilizerName',
    },
    {
      title: 'Requested Date',
      dataIndex: 'requestedDate',
      key: 'requestedDate',
    },
    {
      title: 'Wanted Date',
      dataIndex: 'fromDate',
      key: 'fromDate',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Quantity (Kg)',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: <div style={{ textAlign: 'center' }}>Status</div>, // Center the header
      dataIndex: 'status',
      key: 'status',
      align: 'center', // Center the column content
      render: (status) => {
        let color = '';
        if (status === 'Pending') {
          color = 'blue';
        } else if (status === 'Approved') {
          color = 'green';
        } else if (status === 'Disapproved') {
          color = 'red';
        }
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag
              color={color}
              style={{
                fontSize: '14px',
                padding: '4px 10px',
                width: '100px',
                display: 'inline-block',
              }}
            >
              {status}
            </Tag>
          </div>
        );
      },
    },
  ];
  

   // Filter only approved requests for the progressing table
   const approvedRequestsData = requestData.filter(request => request.status === "Approved");

   const calculateStatus = (wantedDate) => {
    const wantedDateTime = new Date(wantedDate);
    const currentDateTime = new Date();

    if (isNaN(wantedDateTime.getTime())) {
      return 'Invalid date';
    }

    return wantedDateTime < currentDateTime ? 'Complete' : 'Progress';
  };

  const progresingcolumns = [
    {
      title: 'Fertilizer Name',
      dataIndex: 'fertilizerName',
      key: 'fertilizerName',
    },
    {
      title: 'Progress Status',
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (fromDate) => {
        const status = calculateStatus(fromDate);
        let color = '';
  
        if (status === 'Complete') {
          color = 'blue';
        } else if (status === 'Progress') {
          color = 'red';
        }
  
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag
              color={color}
              style={{
                fontSize: '14px',
                padding: '4px 10px',
                width: '100px',
                textAlign: 'center',
              }}
            >
              {status}
            </Tag>
          </div>
        );
      },
      align: 'center', // Center the column content
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Quantity (Kg)',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: <div style={{ textAlign: 'center' }}>Status</div>, // Center the header
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        if (status === "Pending") {
          color = 'blue';
        } else if (status === "Approved") {
          color = 'green';
        } else if (status === "Disapproved") {
          color = 'red';
        }
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag
              color={color}
              style={{
                fontSize: '14px',
                padding: '4px 10px',
                width: '100px',
                textAlign: 'center',
              }}
            >
              {status}
            </Tag>
          </div>
        );
      },
      align: 'center', // Center the column content
    },
  ];
  

  return (
    <div className="mr-2">
<Modal
        title={<p>Request Fertilizer</p>}
        footer={
          null
        }
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
         <form onSubmit={requestFertilizer} className="max-w-md mx-auto">
            {/* Warehouse Name Input */}
            <div className="relative z-0 w-full mb-5 group mt-2">
              <input
                type="text"
                value={fertilizerName}
                onChange={(e) => setfertilizerName(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                required
              />
             

              <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Fertilizer name</label>
            </div>
            {/* Capacity Input */}
           
            <div className="relative z-0 w-full mb-5 group mt-2">
              <input
                type="date"
                value={wantedDate}
                onChange={(e) => setwantedDate(e.target.value)}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                required
              />
             

              <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Wanted date</label>
            </div>
            <div className="relative z-0 w-full mb-5 group mt-2">
              <input
                type="number"
                value={quantity}
               
                onChange={(e) => {
    const value = e.target.value;
    // Allow only numeric input and handle invalid cases
    if (/^\d*$/.test(value)) {
      setquantity(value);
    }
  }}
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                required
              />
             
             <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-0 peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Quentity (Kg)</label>

            </div>
            <div className="relative z-0 w-full mb-5 group">
<div className="w-full mt-1"><h1 className="">Description</h1></div>
            <textarea 
  type="tect"
  value={description}
  onChange={(e) => setdescription(e.target.value)}
   id="message" rows="4" class="block p-2.5 mt-2 w-full text-sm  text-gray-500 bg-gray-50 rounded-lg border border-gray-300  dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black  " placeholder="Leave a comment..."></textarea>

            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              send
            </button>
          </form>
      </Modal>
      
      <div className="flex justify-between mr-3 ml-3 ">
        <div className="w-[253px] h-[138px] pl-5 pr-3 py-3 bg-[#54b435]/80 rounded-[11px] border flex flex-col justify-center  gap-4 mt-5">
          <div className="text-black text-lg font-medium font-['Poppins'] leading-7">All Request</div>
          <div className="text-black text-4xl font-medium font-['Poppins'] leading-7">{totalCount}</div>
        </div>
        <div className="w-[266px] h-[138px] pl-5 pr-3 py-3 bg-[#82cd47]/80 rounded-[11px] border flex flex-col justify-center  gap-4 mt-5">
          <div className="text-black text-lg font-medium font-['Poppins'] leading-7">Approved</div>
          <div className="text-black text-4xl font-medium font-['Poppins'] leading-7">{approvedCount}</div>
        </div>
        <div className="w-[260px] h-[138px] pl-5 pr-3 py-3 bg-[#f0ff42]/80 rounded-[11px] border flex flex-col justify-center  gap-4 mt-5">
          <div className="text-black text-lg font-medium font-['Poppins'] leading-7">Pending</div>
          <div className="text-black text-4xl font-medium font-['Poppins'] leading-7">{pendingCount}</div>
        </div>
        <div className="w-[260px] h-[130px] pl-5 pr-3 py-3 bg-[#82cd47]/80 rounded-[11px] border flex flex-col justify-center  gap-4 mt-5">
          <div className="text-black text-lg font-medium font-['Poppins'] leading-7">Rejected</div>
          <div className="text-black text-4xl font-medium font-['Poppins'] leading-7">{rejectedCount}</div>
        </div>
      </div>

      <div className=" h-[66px] p-4 bg-white rounded-tl-lg rounded-tr-lg flex flex-col justify-center items-start gap-[721px] mt-5 mr-4 ml-3">
      <div className="w-full h-[50px] relative">
        <div className="absolute left-0 top-[28px] w-[416.21px] text-zinc-500/80 text-[13px] font-normal font-['Plus Jakarta Sans'] leading-snug">
          Lorem ipsum dolor sit amet, consectetur adipis.
        </div>
        <div className="absolute left-0 top-0 w-[141.60px] text-zinc-900/80 text-base font-bold font-['Plus Jakarta Sans'] leading-normal">
        Fertilizer Requests

        </div>
        <div className="absolute right-0 top-0 w-[190.23px] h-[30px] p-4 bg-white rounded-[5px] flex justify-center items-center mr-[10px]">
          <div className="w-[126px] flex justify-center items-center gap-[5px]">
          <div className="w-[90px] h-[35px] bg-[#0c6c41] rounded flex justify-center items-center ml-10">
          <button onClick={() => showLoading()} className="text-white text-sm font-normal font-['Lexend']">
            Request
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

    
      {/* Fertilizer Requests Table */}
      <div className="mt-5 mr-3 ml-3">
        <Table columns={columns} dataSource={requestData} pagination={false} />
      </div>
  

    <div className=" h-[66px] p-4 bg-white rounded-tl-lg rounded-tr-lg flex flex-col justify-center items-start gap-[721px] mt-5 mr-3 ml-3">
      <div className="w-full h-[50px] relative">
        <div className="absolute left-0 top-[28px] w-[416.21px] text-zinc-500/80 text-[13px] font-normal font-['Plus Jakarta Sans'] leading-snug">
          Lorem ipsum dolor sit amet, consectetur adipis.
        </div>
        <div className="absolute left-0 top-0 w-[141.60px] text-zinc-900/80 text-base font-bold font-['Plus Jakarta Sans'] leading-normal">
          Recent Pending
        </div>
        <div className="absolute right-0 top-0 w-[190.23px] h-[30px] p-4 bg-white rounded-[5px] flex justify-center items-center mr-[10px]">
          <div className="w-[126px] flex justify-center items-center gap-[5px]">
            <div className="text-right text-indigo-600 text-xs font-medium font-['Plus Jakarta Sans'] leading-[21px]">
             
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

    <div className="mt-5 mr-3 ml-3">
    <Table columns={progresingcolumns} dataSource={approvedRequestsData} pagination={false} />
    </div>
    <br></br>
    </div>
  )
}

export default RequestFertilizers
