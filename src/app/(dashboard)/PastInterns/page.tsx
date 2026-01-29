'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";

export default function PastInternsPage() {
  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: 'normal', color: '#000000' }}
          >
            Past Interns
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
                        Name
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Company
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Mid-Sem Report
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Impact Calculator
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Presentation
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Details
                      </th>
                      <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-[#f5f5f5]">
                      <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                      <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>

                      <td className="border border-[#ddd] p-[10px] text-center align-middle !bg-white">
                        <button
                          type="button"
                          className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[4px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
                          aria-label="Mid-Sem Report"
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
                            <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                          </svg>
                          <span className="ml-2">Mid-Sem</span>
                        </button>
                      </td>

                      <td className="border border-[#ddd] p-[10px] text-center align-middle !bg-white">
                        <button
                          type="button"
                          className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[4px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
                          aria-label="Impact Calculator"
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
                            <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                          </svg>
                          <span className="ml-2">Imp-Cal</span>
                        </button>
                      </td>

                      <td className="border border-[#ddd] p-[10px] text-center align-middle !bg-white">
                        <button
                          type="button"
                          className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[4px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
                          aria-label="Presentation"
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
                            <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                          </svg>
                          <span className="ml-2">Pres</span>
                        </button>
                      </td>

                      <td className="border border-[#ddd] p-[10px] text-center align-middle">
                        <a href="#" className="text-[#909090] no-underline hover:underline text-sm">
                          Details
                        </a>
                      </td>

                      <td className="border border-[#ddd] p-[10px] text-center align-middle !bg-white">
                        <button
                          type="button"
                          className="inline-flex h-[40px] shrink-0 items-center justify-center rounded-[6px] border border-[#e8e8e8] !bg-white hover:!bg-white focus:!bg-white focus:outline-none focus:ring-0 active:!bg-white"
                          style={{ backgroundColor: 'white', width: '48px', minWidth: '48px' }}
                          aria-label="Delete"
                        >
                          <span className="text-[#333333] text-[16px] leading-none">×</span>
                        </button>
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

