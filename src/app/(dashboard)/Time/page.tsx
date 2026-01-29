'use client';

const daysOfWeek = [
  { day: 'Sunday', date: '(MM/DD)' },
  { day: 'Monday', date: '(MM/DD)' },
  { day: 'Tuesday', date: '(MM/DD)' },
  { day: 'Wednesday', date: '(MM/DD)' },
  { day: 'Thursday', date: '(MM/DD)' },
  { day: 'Friday', date: '(MM/DD)' },
  { day: 'Saturday', date: '(MM/DD)' },
];

// Generate hour options (1-12)
const hours = Array.from({ length: 12 }, (_, i) => i + 1);
// Generate minute options (00, 15, 30, 45)
const minutes = ['00', '15', '30', '45'];

export default function TimePage() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Container matching dashboard layout */}
      <div className="py-8 px-[100px]">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h2 className="text-[30px] font-roboto mx-auto" style={{ fontWeight: 'normal', color: '#000000' }}>
            This Week
          </h2>
          <p className="text-[#555555] font-roboto text-sm mt-1">
            Month DD - Month DD
          </p>
          <p className="text-[30px] font-roboto mx-auto mt-4" style={{ fontWeight: 'normal', color: '#000000' }}>
            **YOUR TIME LOGS WILL NOT SAVE WITHOUT A DESCRIPTION OR LUNCH**
          </p>
        </div>

        {/* Timesheet Table - 100% width, auto height, mb-5 (20px) */}
        <div className="overflow-x-auto mb-5">
          <table className="w-full max-w-full border-collapse font-roboto text-sm">
            <thead>
              {/* Header row ~35-40px */}
              <tr className="bg-[#9E1B32]">
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Date</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Start Time</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">End Time</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Lunch</th>
                <th className="border border-[#7a0000] p-[5px] text-white font-normal text-center">Description</th>
                <th className="bg-[#9E1B32] border border-[#7a0000] p-[5px] text-white font-normal text-center">Clear</th>
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((item) => (
                <tr key={item.day} className="bg-white hover:bg-[#f5f5f5] h-[80px]">
                  {/* Date Column */}
                  <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                    <div className="text-[18px] font-normal mb-1" style={{ color: '#000000' }}>{item.day}</div>
                    <div className="text-[#555555] text-xs">{item.date}</div>
                  </td>
                  
                  {/* Start Time - Two dropdowns with colon */}
                  <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
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
                  <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
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
                  
                  {/* Lunch - vertical-align: middle */}
                  <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                    <select className="w-[140px] max-w-[280px] px-2 py-1 border border-[#999] text-[#333] text-sm bg-white">
                      <option value=""></option>
                      <option value="0">No Lunch</option>
                      <option value="15">15 Min</option>
                      <option value="30">30 Min</option>
                      <option value="45">45 Min</option>
                      <option value="60">1 Hour</option>
                      <option value="75">1 Hour &amp; 15 Min</option>
                    </select>
                  </td>
                  
                  {/* Description - Textarea: cols=60 but max-width 280px, rows=3 */}
                  <td className="border border-[#ddd] py-[15px] px-[10px] align-middle text-center">
                    <textarea 
                      className="w-[280px] max-w-[280px] px-2 py-1 border border-[#999] text-[#333] text-sm bg-white resize overflow-auto mx-auto block"
                      rows={3}
                      cols={60}
                    />
                  </td>
                  
                  {/* Clear Button - btn-xs sizing */}
                  <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-middle">
                    <button className="px-[5px] py-[1px] text-[12px] leading-[1.5] rounded-[3px] text-[#333] bg-white border border-[#ccc] hover:bg-[#e6e6e6]">
                      ×
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

