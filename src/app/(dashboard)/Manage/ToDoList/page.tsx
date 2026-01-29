'use client';

import Link from 'next/link';

export default function ToDoListPage() {
  return (
    <div className="w-full bg-white">
      <div className="pb-8 px-[100px]">
        {/* Spacer */}
        <div style={{ height: '40px' }}></div>
        
        {/* Back Button Container */}
        <div className="mb-6">
          <Link 
            href="/Manage" 
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline"
            style={{ fontWeight: 'normal', textDecoration: 'none' }}
          >
            <span className="text-[14px] font-bold" style={{ marginRight: '10px' }}>&#10094;</span>
            Back to Account
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-[30px] font-roboto" style={{ fontWeight: 'normal', color: '#000000' }}>
            To-Do List:
          </h2>
        </div>

        {/* To-Do Table */}
        <div className="overflow-x-auto mb-5">
          <table className="w-full max-w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-left w-[80px]">Checkbox</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-left">Name</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-left">Form</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-left">Upload</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-left w-[120px]">Date</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Impact Calculator/Final Report */}
              <tr className="bg-white hover:bg-[#f5f5f5]">
                <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-top">
                  <input type="checkbox" className="w-4 h-4" />
                </td>
                <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                  <span className="text-[#909090] font-roboto text-[14px]">Impact Calculator/Final Report</span>
                </td>
                <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                  <div className="flex flex-col gap-1">
                    <a 
                      href="https://apcstorage.blob.core.windows.net/staff-only-materials/Impact_Calculator_10312025.xlsx" 
                      className="text-[#909090] font-roboto text-[14px] no-underline hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Impact Calculator
                    </a>
                    <span className="text-[11px] text-[#909090] font-roboto">
                      *Need help filling out the Impact Calculator? Click{' '}
                      <a 
                        href="https://apcstorage.blob.core.windows.net/intern-reports/Impacts-Intern-Perspective.pptx" 
                        className="text-[#909090] text-[11px] no-underline hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        HERE
                      </a>.
                    </span>
                  </div>
                </td>
                <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                  <div className="flex items-center gap-8">
                    <button className="px-3 py-1 border border-[#767676] bg-white text-[#333] text-sm rounded hover:bg-gray-100">
                      Choose File
                    </button>
                    <span className="font-roboto text-[14px] ml-4" style={{ color: '#000000', marginLeft: '20px' }}>No file chosen</span>
                  </div>
                </td>
                <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                  <span className="text-[#909090] font-roboto text-[14px]">m / d / yyyy</span>
                </td>
              </tr>

              {/* Row 2: Presentation / Poster */}
              <tr className="bg-white hover:bg-[#f5f5f5]">
                <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-top">
                  <input type="checkbox" className="w-4 h-4" />
                </td>
                <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                  <span className="text-[#909090] font-roboto text-[14px]">Presentation / Poster</span>
                </td>
                <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                  <div className="flex flex-col gap-1">
                    <a 
                      href="https://apcstorage.blob.core.windows.net/intern-reports/Sample%20Presentation.pdf" 
                      className="text-[#909090] font-roboto text-[14px] no-underline hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sample Presentation
                    </a>
                    <a 
                      href="https://apcstorage.blob.core.windows.net/handbook/Sample%20Presentation.pdf" 
                      className="text-[#909090] font-roboto text-[14px] no-underline hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sample Poster
                    </a>
                    <a 
                      href="https://apcstorage.blob.core.windows.net/staff-only-materials/APC.Student.Poster.template.pub" 
                      className="text-[#909090] font-roboto text-[14px] no-underline hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Poster Template (Publisher)
                    </a>
                    <a 
                      href="https://apcstorage.blob.core.windows.net/staff-only-materials/APC.Student.Poster.template.pptx" 
                      className="text-[#909090] font-roboto text-[14px] no-underline hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Poster Template (Powerpoint)
                    </a>
                  </div>
                </td>
                <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                  <div className="flex items-center gap-8">
                    <button className="px-3 py-1 border border-[#767676] bg-white text-[#333] text-sm rounded hover:bg-gray-100">
                      Choose File
                    </button>
                    <span className="font-roboto text-[14px] ml-4" style={{ color: '#000000', marginLeft: '20px' }}>No file chosen</span>
                  </div>
                </td>
                <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                  <span className="text-[#909090] font-roboto text-[14px]">m / d / yyyy</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
