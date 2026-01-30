'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";

const accordionItems = [
  { key: 'major', title: 'Interns by Major' },
  { key: 'company', title: 'Interns by Company' },
  { key: 'hours', title: 'Hours Billed by Company' },
];

export default function ChartsPage() {
  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: 'normal', color: '#000000' }}
          >
            Charts
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
            {accordionItems.map((item) => (
              <AccordionItem
                key={item.key}
                aria-label={item.title}
                title={<span className="!font-bold" style={{ fontWeight: 700, color: '#000000' }}>{item.title}</span>}
                HeadingComponent="div"
              >
                <div className="flex flex-col gap-6 py-2">
                  <div>
                    <h3
                      className="text-[14px] font-roboto mb-2"
                      style={{ fontWeight: 700, color: '#000000' }}
                    >
                      Past (Starting Spring 2016)
                    </h3>
                    <div className="min-h-[120px] text-[#666666] text-sm">
                      {/* Chart placeholder */}
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-[14px] font-roboto mb-2"
                      style={{ fontWeight: 700, color: '#000000' }}
                    >
                      Current
                    </h3>
                    <div className="min-h-[120px] text-[#666666] text-sm">
                      {/* Chart placeholder */}
                    </div>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
