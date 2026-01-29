'use client';

import Link from 'next/link';
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";

export default function ApplicantsPage() {
  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        {/* Page Title */}
        <div className="mb-6 text-center">
          <h2 className="text-[24px] font-roboto" style={{ fontWeight: 'normal', color: '#900' }}>
            Internship Applicants
          </h2>
        </div>

        {/* Action Buttons and Sort Dropdown */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex">
            <Link
              href="/Applicants/Export"
              className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline"
              style={{ fontWeight: 'normal', textDecoration: 'none', marginRight: '20px' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
                style={{ marginRight: '10px' }}
              >
                <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/>
              </svg>
              Export Applicants
            </Link>
            <Link
              href="/Applicants/Search"
              className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline"
              style={{ fontWeight: 'normal', textDecoration: 'none' }}
            >
              Applicant Search
            </Link>
          </div>

          {/* Sort Dropdown */}
          <select
            defaultValue="Recent"
            className="pl-[12px] pr-[20px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal cursor-pointer appearance-none bg-no-repeat"
            style={{ 
              minWidth: '140px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 10px center'
            }}
          >
            <option value="Recent">Recent</option>
            <option value="Symbol">Symbol</option>
            <option value="Level">Level</option>
            <option value="Major">Major</option>
            <option value="Name">Name</option>
            <option value="School">School</option>
            <option value="Graduation Date">Graduation Date</option>
          </select>
        </div>

        {/* Spacer */}
        <div style={{ height: '20px' }}></div>

        {/* Applicants Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                {/* Icon Column - Info/Legend */}
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center w-[40px]">
                  <Popover placement="right">
                    <PopoverTrigger>
                      <button className="cursor-pointer bg-transparent border-none p-0 text-white hover:opacity-80">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-[#e8e8e8] border border-[#ccc] rounded-[10px] shadow-lg">
                      <div className="text-[#333] font-roboto text-xl" style={{ padding: '16px 22px' }}>
                        <div className="flex flex-col gap-3">
                          {/* Star - Previous Intern */}
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-[#DAA520] text-[20px]" style={{ fontFamily: 'serif' }}>★</span>
                            <span>: Previous Intern</span>
                          </div>
                          {/* Checkmark - Interviewed */}
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-[#228B22] text-[20px] font-bold">✔</span>
                            <span>: Interviewed</span>
                          </div>
                          {/* Phone - Called Back */}
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#333" strokeWidth="1">
                              <rect x="4" y="1" width="8" height="14" rx="1" ry="1"/>
                              <line x1="6" y1="12" x2="10" y2="12"/>
                            </svg>
                            <span>: Called Back</span>
                          </div>
                          {/* Asterisk - Note */}
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-[#DC143C] text-[20px] font-bold">✱</span>
                            <span>: Note</span>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">Valid US<br />Employee</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">Date<br />Applied</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">Name</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">Major</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">School</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">Level</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">Grad<br />Date</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center" style={{ minWidth: '300px' }}>Skills</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">Foreign<br />Language</th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-[#f5f5f5]">
                <td className="border border-[#ddd] p-[10px] text-center align-middle"></td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-left align-middle">
                  <div className="flex flex-col gap-1 text-sm text-[#909090]">
                    <span><a href="#" className="text-[#909090] no-underline hover:underline">Resume</a> |</span>
                    <span><a href="#" className="text-[#909090] no-underline hover:underline">Edit</a> |</span>
                    <span><a href="#" className="text-[#909090] no-underline hover:underline">Details</a> |</span>
                    <span><a href="#" className="text-[#909090] no-underline hover:underline">Delete</a></span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

