'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function ScheduleDisplayPage() {
  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: 'normal', color: '#000000' }}
          >
            Work Schedules
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
            {days.map((day) => (
              <AccordionItem
                key={day}
                aria-label={day}
                title={<span className="!font-bold" style={{ fontWeight: 700 }}>{day}</span>}
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
                          Start Time
                        </th>
                        <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                          End Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white hover:bg-[#f5f5f5]">
                        <td className="border border-[#ddd] p-[10px] text-[#666] text-center">—</td>
                        <td className="border border-[#ddd] p-[10px] text-[#666] text-center">—</td>
                        <td className="border border-[#ddd] p-[10px] text-[#666] text-center">—</td>
                        <td className="border border-[#ddd] p-[10px] text-[#666] text-center">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex flex-wrap" style={{ gap: '24px', marginTop: '32px' }}>
          <button
            type="button"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
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
            <span>Semester Schedules</span>
          </button>
        </div>
      </div>
    </div>
  );
}
