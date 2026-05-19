'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";
import { useEffect, useRef, useState } from "react";
import { API, type ChartData } from "@/lib/api";

function ChartSkeleton() {
  return (
    <div
      className="min-h-[300px] w-full min-w-0 rounded-lg animate-pulse"
      style={{ backgroundColor: "rgb(229 231 235)" }}
      aria-hidden
    />
  );
}

const CHART_SCRIPT = "https://www.gstatic.com/charts/loader.js";

declare global {
  interface Window {
    google?: {
      charts: {
        load: (version: string, opts: { packages: string[] }) => void;
        setOnLoadCallback: (fn: () => void) => void;
      };
      visualization: {
        arrayToDataTable: (data: (string | number)[][]) => unknown;
        ColumnChart: new (el: HTMLElement) => {
          draw: (data: unknown, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const CHART_COLOR = "#990000";

function drawColumnChart(elementId: string, data: ChartData): void {
  const el = document.getElementById(elementId);
  if (!el || !window.google?.visualization || !data?.length) return;
  const w = el.offsetWidth || 0;
  const h = Math.max(el.offsetHeight || 300, 300);
  if (w < 10) return;
  try {
    const dataTable = window.google.visualization.arrayToDataTable(data);
    const chart = new window.google.visualization.ColumnChart(el);
    chart.draw(dataTable, {
      width: w,
      height: h,
      legend: { position: "none" },
      colors: [CHART_COLOR],
      vAxis: { title: "", textPosition: "none" },
      hAxis: { title: "", textPosition: "none" },
      chartArea: { width: "85%", height: "80%" },
    });
  } catch {
    // ignore
  }
}

const accordionItems = [
  { key: "major", title: "Interns by Major" },
  { key: "company", title: "Interns by Company" },
  { key: "hours", title: "Hours Billed by Company" },
];

const ALL_CHART_KEYS = ["major", "company", "hours"];

export default function ChartsPage() {
  const [data, setData] = useState<{
    ok: true;
    data: import("@/lib/api").ChartsResponse;
  } | { ok: false; error: string; status?: number } | null>(null);
  const [chartsReady, setChartsReady] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const chartsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCharts = async () => {
      const res = await fetch(API.charts, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setData({ ok: false, error: (json?.error as string) ?? "Failed to load charts", status: res.status });
        return;
      }
      setData({ ok: true, data: json });
    };
    fetchCharts();
  }, []);

  useEffect(() => {
    if (!window.google?.charts) {
      const script = document.createElement("script");
      script.src = CHART_SCRIPT;
      script.async = true;
      script.onload = () => {
        window.google!.charts.load("current", { packages: ["corechart"] });
        window.google!.charts.setOnLoadCallback(() => setChartsReady(true));
      };
      document.head.appendChild(script);
      return () => {
        script.remove();
      };
    } else {
      setChartsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!chartsReady || !data?.ok) return;
    const d = data.data;
    const draw = () => {
      drawColumnChart("chart-past-major", d.pastInternsByMajorData);
      drawColumnChart("chart-current-major", d.internsByMajorData);
      drawColumnChart("chart-past-company", d.pastInternsByCompanyData);
      drawColumnChart("chart-current-company", d.internsByCompanyData);
      drawColumnChart("chart-past-hrs", d.pastHrsByCompanyData);
      drawColumnChart("chart-current-hrs", d.hrsByCompanyData);
    };
    draw();
    const delay = expandedKeys.size > 0 ? 250 : 100;
    const t = setTimeout(draw, delay);
    const wrapper = chartsWrapperRef.current;
    if (!wrapper) return () => clearTimeout(t);
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(draw);
    });
    ro.observe(wrapper);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, [chartsReady, data, expandedKeys]);

  if (data?.ok === false) {
    return (
      <div className="w-full bg-white">
        <div className="py-8 px-[50px] text-center text-red-600">
          {data.status === 403
            ? "You don't have permission to view charts."
            : data.error}
        </div>
      </div>
    );
  }

  const chartsLoading = data === null || (data?.ok && !chartsReady);

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div className="mb-6 text-center">
          <h2
            className="text-[30px] font-roboto"
            style={{ fontWeight: "normal", color: "#000000" }}
          >
            Charts
          </h2>
        </div>

        <div ref={chartsWrapperRef} className="manage-accordion px-4 mt-8 w-full min-w-0">
          <Accordion
            selectedKeys={expandedKeys}
            onSelectionChange={(keys) => {
              const arr =
                keys === "all"
                  ? ALL_CHART_KEYS
                  : Array.from(keys instanceof Set ? keys : keys ?? []).map(String);
              setExpandedKeys(new Set(arr));
            }}
            disableIndicatorAnimation={false}
            showDivider={false}
            selectionMode="multiple"
            itemClasses={{
              base: "px-0 shadow-none border border-gray-300 rounded-lg mb-3",
              heading: "m-0 p-0",
              trigger:
                "bg-gray-100 hover:bg-gray-200 data-[hover=true]:bg-gray-200 rounded-lg",
              title: "text-[16px] font-normal text-[#666666] text-left",
              titleWrapper: "flex-1",
              content: "bg-white rounded-lg",
              indicator: "text-black",
            }}
          >
            {accordionItems.map((item) => (
              <AccordionItem
                key={item.key}
                aria-label={item.title}
                title={
                  <span
                    className="!font-bold"
                    style={{ fontWeight: 700, color: "#000000" }}
                  >
                    {item.title}
                  </span>
                }
                HeadingComponent="div"
              >
                <div className="flex flex-col gap-6 py-2">
                  <div>
                    <h3
                      className="text-[14px] font-roboto mb-2"
                      style={{ fontWeight: 700, color: "#000000" }}
                    >
                      Past (Starting Spring 2016)
                    </h3>
                    {chartsLoading ? (
                      <ChartSkeleton />
                    ) : (
                      <div
                        id={
                          item.key === "major"
                            ? "chart-past-major"
                            : item.key === "company"
                              ? "chart-past-company"
                              : "chart-past-hrs"
                        }
                        className="min-h-[300px] w-full min-w-0 overflow-hidden"
                        role="img"
                        aria-label={`Chart: ${item.title} (Past)`}
                      />
                    )}
                  </div>
                  <div>
                    <h3
                      className="text-[14px] font-roboto mb-2"
                      style={{ fontWeight: 700, color: "#000000" }}
                    >
                      Current
                    </h3>
                    {chartsLoading ? (
                      <ChartSkeleton />
                    ) : (
                      <div
                        id={
                          item.key === "major"
                            ? "chart-current-major"
                            : item.key === "company"
                              ? "chart-current-company"
                              : "chart-current-hrs"
                        }
                        className="min-h-[300px] w-full min-w-0 overflow-hidden"
                        role="img"
                        aria-label={`Chart: ${item.title} (Current)`}
                      />
                    )}
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
