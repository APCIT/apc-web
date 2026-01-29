'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";

export default function PresentationsPage() {
  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6">
          <h2
            className="text-[36px] font-roboto"
            style={{ fontWeight: 'normal', color: '#000000' }}
          >
            New Presentation
          </h2>
        </div>

        <form className="max-w-4xl">
          {/* Name(s) */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#000000] font-bold">
              Name(s)
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <input
                type="text"
                name="names"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto text-[#000000] focus:outline-none focus:border-[#666] h-[40px]"
              />
            </div>
          </div>

          {/* Company */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#000000] font-bold">
              Company
            </label>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <select
                name="company"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto text-[#000000] bg-white focus:outline-none focus:border-[#666] h-[40px]"
              >
                {/* empty for now */}
              </select>
            </div>
          </div>

          {/* Semester */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <label className="w-[180px] text-right font-roboto text-[14px] text-[#000000] font-bold">
              Semester
            </label>
            <div className="flex-1 flex" style={{ marginLeft: '20px' }}>
              <select
                name="semesterTerm"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto text-[#000000] bg-white focus:outline-none focus:border-[#666] h-[40px]"
              >
                {/* empty for now */}
              </select>
              <select
                name="semesterYear"
                className="w-[200px] px-3 py-3 border border-[#ccc] rounded-[4px] text-[14px] font-roboto text-[#000000] bg-white focus:outline-none focus:border-[#666] h-[40px]"
                style={{ marginLeft: '20px' }}
              >
                {/* empty for now */}
              </select>
            </div>
          </div>

          {/* File */}
          <div className="flex items-center" style={{ marginBottom: '24px' }}>
            <div className="w-[180px]"></div>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <input type="file" className="font-roboto text-[14px]" />
            </div>
          </div>

          {/* Upload */}
          <div className="flex items-center mt-4">
            <div className="w-[180px]"></div>
            <div className="flex-1" style={{ marginLeft: '20px' }}>
              <button
                type="button"
                className="presentation-upload-btn inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] bg-white text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
              >
                Upload
              </button>
            </div>
          </div>
        </form>

        <div className="mt-16">
          <div className="mb-6 text-center">
            <h2
              className="text-[30px] font-roboto"
              style={{ fontWeight: 'normal', color: '#000000' }}
            >
              End of Semester Presentations
            </h2>
          </div>

          <div className="manage-accordion px-4 mt-8">
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
                          Name(s)
                        </th>
                        <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                          Company
                        </th>
                        <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                          Upload Date
                        </th>
                        <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                          Uploaded By
                        </th>
                        <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white hover:bg-[#f5f5f5]">
                        <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                          {'\u00A0'}
                        </td>
                        <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                          {'\u00A0'}
                        </td>
                        <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                          {'\u00A0'}
                        </td>
                        <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">
                          {'\u00A0'}
                        </td>
                        <td className="border border-[#ddd] p-[10px] text-center align-middle">
                          <a
                            href="#"
                            className="text-[#909090] no-underline hover:underline text-sm inline-flex items-center justify-center"
                          >
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
                              <path d="M12 4v10" />
                              <path d="M8 10l4 4 4-4" />
                              <path d="M5 20h14" />
                            </svg>
                            <span className="ml-2">Download</span>
                          </a>
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
    </div>
  );
}

