'use client';

import { Accordion, AccordionItem } from "@heroui/accordion";
import { useEffect, useRef, useState } from "react";
import { API, type ChartData } from "@/lib/api";

function ChartSkeleton() {
  return (
    <div
      className="min-h-[450px] w-full min-w-0 rounded-lg animate-pulse"
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
        arrayToDataTable: (data: any[][]) => unknown;
        ColumnChart: new (el: HTMLElement) => {
          draw: (data: unknown, options: Record<string, unknown>) => void;
        };
        NumberFormat: new (opts?: { pattern?: string }) => {
          format: (dataTable: unknown, columnIndex: number) => void;
        };
      };
    };
  }
}

const CHART_COLORS: Record<string, string> = {
  major: "#B22222",
  company: "#B22222",
  hours: "#B22222",
  default: "#B22222",
};

function drawColumnChart(elementId: string, data: ChartData): void {
  const el = document.getElementById(elementId);
  if (!el || !window.google?.visualization || !data?.length) return;
  const w = el.offsetWidth || 0;
  const h = Math.max(el.offsetHeight || 300, 300);
  if (w < 10) return;
  try {
    // Build an enhanced data array with an HTML tooltip column so tooltips
    // can show value + percent and be styled.
    const header = data[0] as (string | number)[];
    const rows = data.slice(1) as (string | number)[][];
    const total = rows.reduce((s, r) => s + Number(r[1] ?? 0), 0);

    // Add an annotation column (value labels only for the top 5 values) and an HTML tooltip column.
    // Determine the top 5 row indices by value.
    const indexed = rows.map((r, i) => [i, Number(r[1] ?? 0)] as [number, number]);
    const topIndices = new Set(indexed.sort((a, b) => b[1] - a[1]).slice(0, 5).map(([i]) => i));

    const enhanced: (string | number | object)[][] = [
      [header[0], header[1], { role: "annotation" }, { role: "tooltip", p: { html: true } }],
      ...rows.map((r, idx) => {
        const label = String(r[0] ?? "");
        const val = Number(r[1] ?? 0);
        const pct = total > 0 ? Math.round((val / total) * 1000) / 10 : 0; // one decimal
        const annotation = topIndices.has(idx) ? val.toLocaleString() : "";
        const tooltipHtml = `<div style="padding:6px 8px;font-family:Roboto"><div style="font-weight:700">${label}</div><div style="color:#666;margin-top:4px">${val.toLocaleString()} (${pct}%)</div></div>`;
        return [label, val, annotation, tooltipHtml];
      }),
    ];

    const dataTable = window.google.visualization.arrayToDataTable(enhanced as any[][]);

    // Choose color based on element id (major/company/hrs)
    const key = elementId.includes("major")
      ? "major"
      : elementId.includes("company")
      ? "company"
      : elementId.includes("hrs")
      ? "hours"
      : "default";
    const color = CHART_COLORS[key] ?? CHART_COLORS.default;

    // Format numeric column for hours to 2 decimals
    try {
      if (window.google.visualization.NumberFormat && /Hours?/i.test(String(data[0][1] ?? ""))) {
        const formatter = new window.google.visualization.NumberFormat({ pattern: "#,##0.##" });
        formatter.format(dataTable, 1);
      }
    } catch {
      // ignore formatting errors
    }

    const chart = new window.google.visualization.ColumnChart(el);

    const isDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const textColor = isDark ? "#ddd" : "#444";
    const bgFill = isDark ? "transparent" : "transparent";

    const small = w < 480;
    const chartArea = elementId.includes("hrs")
      ? small ? { left: 40, top: 20, width: "85%", height: "75%" } : { left: 60, top: 20, width: "80%", height: "75%" }
      : small ? { left: 40, top: 20, width: "85%", height: "75%" } : { left: 60, top: 20, width: "80%", height: "75%" };

    chart.draw(dataTable, {
      width: w,
      height: h,
      legend: { position: "top", alignment: "center", textStyle: { color: textColor, fontName: "Roboto", fontSize: 12 } },
      colors: [color],
      vAxis: {
        title: "",
        textStyle: { color: textColor, fontName: "Roboto", fontSize: 12 },
        minValue: 0,
        ...(elementId === "chart-current-hrs" && { maxValue: 60000 }),
        ...(elementId === "chart-past-hrs" && { maxValue: 55000 }),
        ...(elementId === "chart-current-company" && { maxValue: 18 }),
        ...(elementId === "chart-past-company" && { maxValue: 180 }),
        ...(elementId === "chart-current-major" && { maxValue: 6 }),
      },
      hAxis: {
        title: "",
        textStyle: { color: textColor, fontName: "Roboto", fontSize: 12 },
      },
      tooltip: { isHtml: true, textStyle: { fontName: "Roboto", color: textColor }, showColorCode: true },
      explorer: { actions: ["dragToZoom", "rightClickToReset"], axis: "horizontal" },
      animation: { startup: true, duration: 700, easing: "out" },
      chartArea,
      backgroundColor: { fill: bgFill },
      bar: { groupWidth: small ? "55%" : "70%" },
      titleTextStyle: { color: textColor, fontName: "Roboto", fontSize: 14 },
      annotations: { alwaysOutside: true, textStyle: { fontName: "Roboto", color: textColor, fontSize: 9 } },
    });
    try {
      // Add a select listener that shows a small overlay with details (label/value/percent)
      (window.google as any).visualization.events.addListener(chart, "select", () => {
        try {
          const sel = (chart as any).getSelection();
          const overlayClass = "chart-select-overlay";
          let overlay = el.querySelector(`.${overlayClass}`) as HTMLElement | null;
          if (!sel || sel.length === 0) {
            if (overlay) overlay.style.display = "none";
            return;
          }
          const rowIndex = sel[0].row;
          const row = rows[rowIndex];
          if (!row) return;
          const label = String(row[0] ?? "");
          const val = Number(row[1] ?? 0);
          const pct = total > 0 ? Math.round((val / total) * 1000) / 10 : 0;
          const html = `<div style="font-family:Roboto"><div style="font-weight:700">${label}</div><div style="color:#666;margin-top:4px">${val.toLocaleString()} (${pct}%)</div></div>`;

          if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = overlayClass;
            overlay.style.position = "absolute";
            overlay.style.right = "12px";
            overlay.style.top = "12px";
            overlay.style.background = "rgba(255,255,255,0.95)";
            overlay.style.border = "1px solid rgba(0,0,0,0.08)";
            overlay.style.padding = "8px 10px";
            overlay.style.borderRadius = "6px";
            overlay.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
            overlay.style.zIndex = "10";
            overlay.style.minWidth = "120px";
            overlay.style.display = "none";
            el.style.position = el.style.position || "relative";
            el.appendChild(overlay);
          }
          overlay.innerHTML = html;
          overlay.style.display = "block";
          // auto-hide after 4s
          setTimeout(() => {
            overlay && (overlay.style.display = "none");
          }, 4000);
        } catch {
          // ignore overlay errors
        }
      });
    } catch {
      // ignore event registration errors
    }
  } catch (err) {
    // ignore drawing errors but log for debugging
    // console.error(err);
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
                        className="min-h-[450px] w-full min-w-0 overflow-hidden"
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
                        className="min-h-[450px] w-full min-w-0 overflow-hidden"
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
