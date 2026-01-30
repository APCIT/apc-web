'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";

export default function ServicesPage() {
  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: 'normal', color: '#000000' }}
          >
            Professional Services
          </h2>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-white hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
            style={{ backgroundColor: 'white' }}
          >
            Create New
          </button>
          <span style={{ width: '16px' }} />
          <button
            type="button"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-white hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
            style={{ backgroundColor: 'white' }}
          >
            <span className="inline-flex items-center justify-center mr-[8px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 18a4 4 0 0 1 0-8h.5A5.5 5.5 0 0 1 19 11a3.5 3.5 0 0 1-1 6.9H14" />
                <path d="M12 10v9" />
                <path d="M9.5 15.5 12 18l2.5-2.5" />
              </svg>
            </span>
            <span>Export Service Log</span>
          </button>
        </div>

        <div className="manage-accordion px-4 mt-8" style={{ marginTop: '48px' }}>
          <Accordion
            disableIndicatorAnimation={false}
            showDivider={false}
            selectionMode="multiple"
            itemClasses={{
              base: "px-0 shadow-none border border-gray-300 rounded-lg mb-3",
              heading: "m-0 p-0",
              trigger: "bg-gray-100 hover:bg-gray-200 data-[hover=true]:bg-gray-200 rounded-lg",
              title: "text-[16px] font-normal text-[#666666] text-left",
              titleWrapper: "flex-1",
              content: "bg-white rounded-lg",
              indicator: "text-black"
            }}
          >
            <AccordionItem
              key="semester-20xx"
              aria-label="Semester 20XX"
              title={<span className="!font-bold" style={{ fontWeight: 700 }}>Semester 20XX</span>}
              HeadingComponent="div"
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-roboto text-sm">
                  <thead>
                    <tr className="bg-[#9E1B32]">
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Type of Service
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Company
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Staff Member
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Completed
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Certificate(s) Awarded
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-[#f5f5f5]">
                      <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                      <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                      <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                      <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                      <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                      <td className="border border-[#ddd] p-[10px] text-center align-middle">
                        <a href="#" className="text-[#666] no-underline hover:underline text-sm">Edit</a>
                        <span className="text-[#666] mx-1"> | </span>
                        <a href="#" className="text-[#666] no-underline hover:underline text-sm">Details</a>
                        <span className="text-[#666] mx-1"> | </span>
                        <a href="#" className="text-[#666] no-underline hover:underline text-sm">Delete</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
