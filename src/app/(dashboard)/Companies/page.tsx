export default function CompaniesPage() {
  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[24px] font-roboto"
            style={{ fontWeight: 'normal', color: '#000000' }}
          >
            Companies
          </h2>
        </div>

        <div className="mb-4">
          <button
            type="button"
            className="presentation-upload-btn inline-flex items-center px-[16px] py-[8px] border border-[#ccc] rounded-[10px] bg-white text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none"
          >
            Create New
          </button>
        </div>

        <div className="overflow-x-auto" style={{ marginTop: '20px', marginBottom: '48px' }}>
          <table className="w-full border-collapse font-roboto text-sm">
            <thead>
              <tr className="bg-[#9E1B32]">
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center" style={{ width: '55%' }}>
                  Name
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Abbreviation
                </th>
                <th className="border border-[#7a0000] p-[10px] text-white font-normal text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-[#f5f5f5]">
                <td className="border border-[#ddd] p-[10px] text-left align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-left align-middle text-[#666]">—</td>
                <td className="border border-[#ddd] p-[10px] text-center align-middle">
                  <a href="#" className="text-[#666] no-underline hover:underline text-sm">Edit</a>
                  <span className="text-[#666] mx-1"> | </span>
                  <a href="#" className="text-[#666] no-underline hover:underline text-sm">Delete</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
