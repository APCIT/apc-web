export default function ClassRegistrantsPage() {
  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[24px] font-roboto"
            style={{ fontWeight: 'normal', color: '#900' }}
          >
            Class Registrants
          </h2>
        </div>

        <div className="flex justify-end mb-4">
          <select
            defaultValue="Company"
            className="pl-[12px] pr-[32px] py-[8px] border border-[#333] rounded-[6px] text-[#333] bg-white text-[14px] font-normal cursor-pointer appearance-none bg-no-repeat"
            style={{
              minWidth: '160px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 12px center',
            }}
          >
            <option value="Company">Company</option>
            <option value="Class">Class</option>
            <option value="LastName">LastName</option>
          </select>
        </div>

        <div className="overflow-x-auto" style={{ marginTop: '20px', marginBottom: '48px' }}>
          <table className="w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Date Registered
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Class Name
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
                  Job Title
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
                <td className="border border-[#ddd] p-[10px] text-center align-middle text-[#666]">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
