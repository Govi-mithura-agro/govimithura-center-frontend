import React from 'react';

function ManageFertilizers() {
  return (
    <div >
   <div className='flex mt'></div>
      <div className="w-[1096px] h-[412px] relative bg-white rounded-[11px] p-4 mt-10 mx-auto">
        {/* Header and Description */}
        <div className="absolute top-2 left-6 w-[292px] h-[74px]">
          <div className="text-gray-900 text-xl font-medium font-['DM Sans'] leading-normal">Anuradhapura</div>
          <div className="text-[#2b3674] text-[34px] font-bold font-['DM Sans'] leading-[42px]">73.4%</div>
          <div className="text-[#a3aed0] text-sm font-medium font-['DM Sans'] leading-normal">Mass percentage of fertilizer</div>
        </div>

        {/* Bar Chart */}
        <div className="w-full h-[200px] mt-[90px] flex justify-between items-end">
          {/* Bars */}
          <div className="w-[56px] bg-[#82cd47] rounded-t-[5px] text-center text-white text-xs font-bold font-['DM Sans'] leading-tight" style={{ height: '30%' }}>
            <div className="text-xs font-bold text-white">30%</div>
          </div>
          <div className="w-[56px] bg-[#82cd47] rounded-t-[5px] text-center text-white text-xs font-bold font-['DM Sans'] leading-tight" style={{ height: '50%' }}>
            <div className="text-xs font-bold text-white">50%</div>
          </div>
          <div className="w-[56px] bg-[#82cd47] rounded-t-[5px] text-center text-white text-xs font-bold font-['DM Sans'] leading-tight" style={{ height: '40%' }}>
            <div className="text-xs font-bold text-white">40%</div>
          </div>
          <div className="w-[56px] bg-[#82cd47] rounded-t-[5px] text-center text-white text-xs font-bold font-['DM Sans'] leading-tight" style={{ height: '60%' }}>
            <div className="text-xs font-bold text-white">60%</div>
          </div>
          <div className="w-[56px] bg-[#82cd47] rounded-t-[5px] text-center text-white text-xs font-bold font-['DM Sans'] leading-tight" style={{ height: '70%' }}>
            <div className="text-xs font-bold text-white">70%</div>
          </div>
          <div className="w-[56px] bg-[#82cd47] rounded-t-[5px] text-center text-white text-xs font-bold font-['DM Sans'] leading-tight" style={{ height: '55%' }}>
            <div className="text-xs font-bold text-white">55%</div>
          </div>
          <div className="w-[56px] bg-[#82cd47] rounded-t-[5px] text-center text-white text-xs font-bold font-['DM Sans'] leading-tight" style={{ height: '45%' }}>
            <div className="text-xs font-bold text-white">45%</div>
          </div>
          <div className="w-[56px] bg-[#82cd47] rounded-t-[5px] text-center text-white text-xs font-bold font-['DM Sans'] leading-tight" style={{ height: '65%' }}>
            <div className="text-xs font-bold text-white">65%</div>
          </div>
        </div>

        {/* Chart Labels */}
        <div className="w-full h-[24px] mt-2 flex justify-between">
          <div className="w-[56px] text-center text-[#b0bbd5] text-xs font-bold font-['DM Sans'] leading-tight">A</div>
          <div className="w-[56px] text-center text-[#b0bbd5] text-xs font-bold font-['DM Sans'] leading-tight">B</div>
          <div className="w-[56px] text-center text-[#b0bbd5] text-xs font-bold font-['DM Sans'] leading-tight">C</div>
          <div className="w-[56px] text-center text-[#b0bbd5] text-xs font-bold font-['DM Sans'] leading-tight">D</div>
          <div className="w-[56px] text-center text-[#b0bbd5] text-xs font-bold font-['DM Sans'] leading-tight">E</div>
          <div className="w-[56px] text-center text-[#b0bbd5] text-xs font-bold font-['DM Sans'] leading-tight">F</div>
          <div className="w-[56px] text-center text-[#b0bbd5] text-xs font-bold font-['DM Sans'] leading-tight">G</div>
          <div className="w-[56px] text-center text-[#b0bbd5] text-xs font-bold font-['DM Sans'] leading-tight">H</div>
        </div>
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
  );
}

export default ManageFertilizers;
