'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";

const roles = ['Accountant', 'Admin', 'Advisor', 'Client', 'Intern', 'IT', 'Reception', 'Staff'];

export default function UsersPage() {
  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: 'normal', color: '#000000' }}
          >
            Users
          </h2>
        </div>

        <div className="mb-4">
          <button
            type="button"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
          >
            Create New
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
            {roles.map((role) => (
              <AccordionItem
                key={role}
                aria-label={role}
                title={role}
                HeadingComponent="div"
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse font-roboto text-sm">
                    <thead>
                      <tr className="bg-[#9E1B32]">
                        <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                          UserName
                        </th>
                        <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                          Name
                        </th>
                        <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                          Email
                        </th>
                        <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                          Company
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
                        <td className="border border-[#ddd] p-[10px] text-center align-middle">
                          <a href="#" className="text-[#666] no-underline hover:underline text-sm">Reset Password</a>
                          <span className="text-[#666] mx-1"> | </span>
                          <a href="#" className="text-[#666] no-underline hover:underline text-sm">Delete</a>
                          <span className="text-[#666] mx-1"> | </span>
                          <a href="#" className="text-[#666] no-underline hover:underline text-sm">Roles</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
