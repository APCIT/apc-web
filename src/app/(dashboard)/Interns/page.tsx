export default function InternsPage() {
  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        {/* Page Title */}
        <div className="mb-6 text-center">
          <h2
            className="text-[24px] font-roboto"
            style={{ fontWeight: 'normal', color: '#900' }}
          >
            Current Interns
          </h2>
        </div>

        <div className="flex justify-end mb-4">
          <select
            defaultValue="Order By"
            className="pl-[12px] pr-[32px] py-[8px] border border-[#333] rounded-[6px] text-[#333] bg-white text-[14px] font-normal cursor-pointer appearance-none bg-no-repeat"
            style={{
              minWidth: '160px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 12px center',
            }}
          >
            <option value="Order By">Order By</option>
            <option value="Name">Name</option>
            <option value="Company">Company</option>
            <option value="Hours">Hours</option>
            <option value="Grad Date">Grad Date</option>
          </select>
        </div>

        <div className="overflow-x-auto" style={{ marginTop: '20px', marginBottom: '48px' }}>
          <table className="w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center w-[40px]">
                  <span className="inline-flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    >
                      <rect x="2.5" y="5" width="11" height="8.5" rx="0.75" />
                      <path d="M2.5 7.5h11" />
                      <path d="M8 5v8.5" />
                      <path d="M4.5 4c-.8-.65-.7-1.9.3-2.3.6-.3 1.4-.1 1.8.4.4.5.4 1.2.1 1.7" />
                      <path d="M11.5 4c.8-.65.7-1.9-.3-2.3-.6-.3-1.4-.1-1.8.4-.4.5-.4 1.2-.1 1.7" />
                    </svg>
                  </span>
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  CWID
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Name
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Email
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Phone
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Company
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Semester
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Level
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Grad&nbsp;Date
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Hours&nbsp;This&nbsp;Week
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center w-[40px]">
                  ⚑
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Actions
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  $
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  To&nbsp;Applicant
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Archive&nbsp;Intern
                </th>
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
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle">
                  <a href="#" className="text-[#909090] no-underline hover:underline text-sm">
                    Details
                  </a>
                </td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle !bg-white">
                  <button
                    type="button"
                    className="inline-flex h-[40px] shrink-0 items-center justify-center rounded-[6px] border border-[#e8e8e8] !bg-white hover:!bg-white focus:!bg-white focus:outline-none focus:ring-0 active:!bg-white"
                    style={{ backgroundColor: 'white', width: '48px', minWidth: '48px' }}
                    aria-label="Download to applicant"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#444444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v10" />
                      <path d="M8 11l4 4 4-4" />
                      <path d="M5 19h14" />
                    </svg>
                  </button>
                </td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle !bg-white">
                  <button
                    type="button"
                    className="inline-flex h-[40px] shrink-0 items-center justify-center rounded-[6px] border border-[#e8e8e8] !bg-white hover:!bg-white focus:!bg-white focus:outline-none focus:ring-0 active:!bg-white"
                    style={{ backgroundColor: 'white', width: '48px', minWidth: '48px' }}
                    aria-label="Archive intern"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#444444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v10" />
                      <path d="M8 11l4 4 4-4" />
                      <path d="M5 19h14" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap" style={{ marginTop: '32px', gap: '24px' }}>
          {/* Export ATN Report */}
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
            <span>Export ATN Report</span>
          </button>

          {/* Semester Timelogs */}
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
            <span>Semester Timelogs</span>
          </button>

          {/* Tara Timelogs */}
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
            <span>Tara Timelogs</span>
          </button>

          {/* Interns Reports (alert icon) */}
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
                <path d="M12 3 3 20h18L12 3z" />
                <path d="M12 9v5" />
                <path d="M12 17.5h.01" />
              </svg>
            </span>
            <span>Interns Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
