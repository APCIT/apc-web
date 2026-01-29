'use client';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Generate hour options (1-12)
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
// Generate minute options (00, 15, 30, 45)
const minutes = ['00', '15', '30', '45'];

export default function WorkSchedulePage() {
  return (
    <div className="w-full bg-white">
      {/* Container matching dashboard layout */}
      <div className="py-8 px-[100px]">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h2 className="text-[30px] font-roboto mx-auto" style={{ fontWeight: 'normal', color: '#000000' }}>
            Semester Work Schedule
          </h2>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto mb-5">
          <table className="w-full max-w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Day</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Start Time</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">End Time</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Add</th>
              </tr>
            </thead>
            <tbody>
              {weekdays.map((day) => (
                <tr key={day} className="bg-white hover:bg-[#f5f5f5] h-[100px]">
                  {/* Day Column */}
                  <td className="border border-[#ddd] py-[25px] px-[10px] text-center align-middle">
                    <div className="text-[18px] font-normal" style={{ color: '#000000' }}>{day}</div>
                  </td>
                  
                  {/* Start Time - Two dropdowns with colon */}
                  <td className="border border-[#ddd] py-[25px] px-[10px] text-center align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <select className="max-w-[280px] px-1 py-1 border border-[#999] text-[#333] text-sm bg-white">
                        <option value=""></option>
                        {hours.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <span style={{ color: '#000000' }}>:</span>
                      <select className="max-w-[280px] px-1 py-1 border border-[#999] text-[#333] text-sm bg-white">
                        <option value=""></option>
                        {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </td>
                  
                  {/* End Time - Two dropdowns with colon */}
                  <td className="border border-[#ddd] py-[25px] px-[10px] text-center align-middle">
                    <div className="flex items-center justify-center gap-1">
                      <select className="max-w-[280px] px-1 py-1 border border-[#999] text-[#333] text-sm bg-white">
                        <option value=""></option>
                        {hours.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <span style={{ color: '#000000' }}>:</span>
                      <select className="max-w-[280px] px-1 py-1 border border-[#999] text-[#333] text-sm bg-white">
                        <option value=""></option>
                        {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </td>
                  
                  {/* Add Button */}
                  <td className="border border-[#ddd] py-[25px] px-[10px] text-center align-middle">
                    <button className="px-[10px] py-[5px] text-[16px] leading-[1.5] rounded-[3px] text-[#333] bg-white border border-[#ccc] hover:bg-[#e6e6e6]">
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
