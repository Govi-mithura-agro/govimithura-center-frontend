import React from 'react'

function RequestFertilizers() {
  return (
    <div className="bg-[#e7e7e7]">
      <div className="flex justify-between mr-3 ml-3 ">
        <div className="w-[253px] h-[138px] pl-5 pr-3 py-3 bg-[#54b435]/20 rounded-[11px] border flex flex-col justify-center items-center gap-4 mt-5">
          <div className="text-black/20 text-lg font-medium font-['Poppins'] leading-7">Approved</div>
          <div className="text-black/20 text-4xl font-medium font-['Poppins'] leading-7">100</div>
        </div>
        <div className="w-[266px] h-[138px] pl-5 pr-3 py-3 bg-[#82cd47]/30 rounded-[11px] border flex flex-col justify-center items-center gap-4 mt-5">
          <div className="text-black/20 text-lg font-medium font-['Poppins'] leading-7">Pending</div>
          <div className="text-black/20 text-4xl font-medium font-['Poppins'] leading-7">100</div>
        </div>
        <div className="w-[260px] h-[138px] pl-5 pr-3 py-3 bg-[#f0ff42]/20 rounded-[11px] border flex flex-col justify-center items-center gap-4 mt-5">
          <div className="text-black/20 text-lg font-medium font-['Poppins'] leading-7">Rejected</div>
          <div className="text-black/20 text-4xl font-medium font-['Poppins'] leading-7">100</div>
        </div>
        <div className="w-[260px] h-[130px] pl-5 pr-3 py-3 bg-[#82cd47]/20 rounded-[11px] border flex flex-col justify-center items-center gap-4 mt-5">
          <div className="text-black/20 text-lg font-medium font-['Poppins'] leading-7">Rejected</div>
          <div className="text-black/20 text-4xl font-medium font-['Poppins'] leading-7">100</div>
        </div>
      </div>

      <div className="relative h-[66.52px] mt-5  flex justify-between items-center mr-4 ml-4">
      <div className="text-slate-900 text-base font-semibold font-['Inter']">
        Fertilizer Requests
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <button className="text-sm text-blue-500">PDF</button>
        </div>
        <div className="w-[90px] h-[35px] bg-[#0c6c41] rounded flex justify-center items-center">
          <button className="text-white text-sm font-normal font-['Lexend']">
            Request
          </button>
        </div>
      </div>
    </div>

    <div className="mt-5 mr-4 ml-3">
      <table className="min-w-full bg-slate-100 border-t border-b border-slate-200">
        <thead>
          <tr>
            <th className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Type</th>
            <th className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Requested Date</th>
            <th className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">From Date</th>
            <th className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Status</th>
            <th className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Description</th>
            <th className="text-left text-slate-900 text-base font-normal font-['Inter'] p-3">Quantity (Kg)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Type</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Requested Date</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">From Date</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Status</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Description</td>
            <td className="text-left text-slate-900 text-base font-normal font-['Inter'] p-3">Quantity (Kg)</td>
          </tr>
          <tr>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Type</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Requested Date</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">From Date</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Status</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Description</td>
            <td className="text-left text-slate-900 text-base font-normal font-['Inter'] p-3">Quantity (Kg)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className=" h-[66px] p-4 bg-white rounded-tl-lg rounded-tr-lg flex flex-col justify-center items-start gap-[721px] mt-5 mr-4 ml-3">
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
              See All Pending
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

    <div className="mt-5 mr-3 ml-4">
      <table className="min-w-full bg-slate-100 border-t border-b border-slate-200 mr-4">
        <thead>
          <tr>
            <th className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Type</th>
            <th className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Requested Date</th>
            <th className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">From Date</th>
            <th className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Status</th>
            <th className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Description</th>
            <th className="text-left text-slate-900 text-base font-normal font-['Inter'] p-3">Quantity (Kg)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Type</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Requested Date</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">From Date</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Status</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Description</td>
            <td className="text-left text-slate-900 text-base font-normal font-['Inter'] p-3">Quantity (Kg)</td>
          </tr>
          <tr>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Type</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Requested Date</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">From Date</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Status</td>
            <td className="text-left text-slate-800 text-sm font-medium font-['Inter'] p-3">Description</td>
            <td className="text-left text-slate-900 text-base font-normal font-['Inter'] p-3">Quantity (Kg)</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br></br>
    </div>
  )
}

export default RequestFertilizers
