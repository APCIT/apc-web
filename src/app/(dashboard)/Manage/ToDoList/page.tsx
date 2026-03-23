'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GET_TODO_LIST_API,
  UPDATE_INTERN_IMPACT_CALC_API,
  UPDATE_INTERN_PRESENTATION_API,
  type TodoListResponse,
} from '@/lib/api';

const BLOB_BASE = 'https://apcstorage.blob.core.windows.net';
const CONTAINER_IMPACT_CALC = 'checklist-impactcalculator';
const CONTAINER_PRESENTATION = 'checklist-presentation';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve(base64 ?? '');
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Due date for checklist rows from the intern's semester (same for both rows).
 * April semester (month 4) → 5/1 of current year; July (7) → 8/1; November (11) → 12/1.
 * Year is always the current year (like DateTime.Now.Year in the legacy app).
 */
function formatDueDate(semesterMonth: number | null): string {
  if (!semesterMonth) return '—';
  const year = new Date().getFullYear();
  if (semesterMonth === 4) return `5/1/${year}`;
  if (semesterMonth === 7) return `8/1/${year}`;
  if (semesterMonth === 11) return `12/1/${year}`;
  return '—';
}

export default function ToDoListPage() {
  const [data, setData] = useState<TodoListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const impactFileInputRef = useRef<HTMLInputElement>(null);
  const presFileInputRef = useRef<HTMLInputElement>(null);

  const [impactFile, setImpactFile] = useState<File | null>(null);
  const [impactFileName, setImpactFileName] = useState<string | null>(null);
  const [presFile, setPresFile] = useState<File | null>(null);
  const [presFileName, setPresFileName] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    GET_TODO_LIST_API()
      .then((res) => {
        if (res.ok) {
          setData(res.data);
        } else {
          setError(res.error ?? 'Failed to load to-do list');
        }
      })
      .catch(() => setError('Failed to load to-do list'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const impactCompleted = !!(data?.impactCalcId && data.impactCalcId.length > 15);
  const presCompleted = !!(data?.presentationId && data.presentationId.length > 15);

  const impactHref =
    impactCompleted && data?.impactCalcId
      ? `${BLOB_BASE}/${CONTAINER_IMPACT_CALC}/${encodeURIComponent(data.impactCalcId)}`
      : null;

  const presHref =
    presCompleted && data?.presentationId
      ? `${BLOB_BASE}/${CONTAINER_PRESENTATION}/${encodeURIComponent(data.presentationId)}`
      : null;

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!data?.internId) return;

      setSaving(true);
      setSaveError(null);
      setSaveSuccess(null);

      try {
        const operations: Promise<{ ok: boolean; error?: string }>[] = [];

        if (impactFile) {
          const fileBase64 = await fileToBase64(impactFile);
          operations.push(
            UPDATE_INTERN_IMPACT_CALC_API(data.internId, {
              fileBase64,
              fileName: impactFile.name,
            }),
          );
        }

        if (presFile) {
          const fileBase64 = await fileToBase64(presFile);
          operations.push(
            UPDATE_INTERN_PRESENTATION_API(data.internId, {
              fileBase64,
              fileName: presFile.name,
            }),
          );
        }

        if (operations.length === 0) {
          setSaveError('Please choose at least one file to upload.');
          setSaving(false);
          return;
        }

        const results = await Promise.all(operations);
        const failed = results.find((r) => !r.ok);
        if (failed) {
          setSaveError(failed.error ?? 'Failed to save uploads.');
        } else {
          setSaveSuccess('Files saved successfully.');
          setImpactFile(null);
          setImpactFileName(null);
          setPresFile(null);
          setPresFileName(null);
          if (impactFileInputRef.current) impactFileInputRef.current.value = '';
          if (presFileInputRef.current) presFileInputRef.current.value = '';
          load();
        }
      } catch {
        setSaveError('Failed to save uploads.');
      } finally {
        setSaving(false);
      }
    },
    [data?.internId, impactFile, presFile, load],
  );

  return (
    <div className="w-full bg-white">
      <div className="py-8 px-[50px]">
        <div style={{ height: '20px' }} aria-hidden></div>

        <div className="mb-6">
          <Link
            href="/Manage"
            className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none no-underline hover:no-underline"
            style={{ fontWeight: 'normal', textDecoration: 'none' }}
          >
            <span className="text-[14px] font-bold" style={{ marginRight: '10px' }}>
              &#10094;
            </span>
            Back to Account
          </Link>
        </div>

        <div className="mb-4 text-left">
          <h2
            className="text-[24px] font-roboto"
            style={{ fontWeight: 'normal', color: '#000000' }}
          >
            To-Do List
          </h2>
        </div>
        <hr className="border-t border-[#ccc] mb-6" />

        {error && (
          <p className="mb-4 font-roboto text-red-600 text-[14px]">{error}</p>
        )}

        <form onSubmit={handleSave}>
          <div className="overflow-x-auto mb-5">
            <table className="w-full max-w-full border-collapse font-roboto text-sm">
              <thead>
                <tr className="bg-[#9E1B32]">
                  <th className="border border-[#7a0000] p-[10px] text-white font-normal text-left w-[80px]">
                    Checkbox
                  </th>
                  <th className="border border-[#7a0000] p-[10px] text-white font-normal text-left">
                    Name
                  </th>
                  <th className="border border-[#7a0000] p-[10px] text-white font-normal text-left">
                    Form
                  </th>
                  <th className="border border-[#7a0000] p-[10px] text-white font-normal text-left">
                    Upload
                  </th>
                  <th className="border border-[#7a0000] p-[10px] text-white font-normal text-left w-[120px]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white hover:bg-[#f5f5f5]">
                  <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-top">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={impactCompleted}
                      readOnly
                    />
                  </td>
                  <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                    <span className="text-[#909090] font-roboto text-[14px]">
                      Impact Calculator/Final Report
                    </span>
                  </td>
                  <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                    <div className="flex flex-col gap-1">
                      <a
                        href="https://apcstorage.blob.core.windows.net/staff-only-materials/Impact_Calculator_10312025.xlsx"
                        className="text-[#909090] font-roboto text-[14px] no-underline hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Impact Calculator
                      </a>
                      <span className="text-[11px] text-[#909090] font-roboto">
                        *Need help filling out the Impact Calculator? Click{' '}
                        <a
                          href="https://apcstorage.blob.core.windows.net/intern-reports/Impacts-Intern-Perspective.pptx"
                          className="text-[#909090] text-[11px] no-underline hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          HERE
                        </a>
                        .
                      </span>
                    </div>
                  </td>
                  <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="px-3 py-1 border border-[#767676] bg-white text-[#333] text-sm rounded hover:bg-gray-100"
                          onClick={() => impactFileInputRef.current?.click()}
                        >
                          Choose File
                        </button>
                        <span
                          className="font-roboto text-[14px]"
                          style={{ color: '#000000' }}
                        >
                          {impactFileName ?? 'No file chosen'}
                        </span>
                      </div>
                      {impactHref && (
                        <a
                          href={impactHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-roboto text-[13px] text-[#909090] no-underline hover:underline"
                        >
                          View current file
                        </a>
                      )}
                      <input
                        ref={impactFileInputRef}
                        type="file"
                        name="impactCalc"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setImpactFile(file);
                          setImpactFileName(file ? file.name : null);
                        }}
                      />
                    </div>
                  </td>
                  <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                    <span className="text-[#909090] font-roboto text-[14px]">
                      {formatDueDate(data?.semesterMonth ?? null)}
                    </span>
                  </td>
                </tr>

                <tr className="bg-white hover:bg-[#f5f5f5]">
                  <td className="border border-[#ddd] py-[15px] px-[10px] text-center align-top">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={presCompleted}
                      readOnly
                    />
                  </td>
                  <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                    <span className="text-[#909090] font-roboto text-[14px]">
                      Presentation / Poster
                    </span>
                  </td>
                  <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                    <div className="flex flex-col gap-1">
                      <a
                        href="https://apcstorage.blob.core.windows.net/intern-reports/Sample%20Presentation.pdf"
                        className="text-[#909090] font-roboto text-[14px] no-underline hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sample Presentation
                      </a>
                      <a
                        href="https://apcstorage.blob.core.windows.net/handbook/Sample%20Presentation.pdf"
                        className="text-[#909090] font-roboto text-[14px] no-underline hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sample Poster
                      </a>
                      <a
                        href="https://apcstorage.blob.core.windows.net/staff-only-materials/APC.Student.Poster.template.pub"
                        className="text-[#909090] font-roboto text-[14px] no-underline hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Poster Template (Publisher)
                      </a>
                      <a
                        href="https://apcstorage.blob.core.windows.net/staff-only-materials/APC.Student.Poster.template.pptx"
                        className="text-[#909090] font-roboto text-[14px] no-underline hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Poster Template (Powerpoint)
                      </a>
                    </div>
                  </td>
                  <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="px-3 py-1 border border-[#767676] bg-white text-[#333] text-sm rounded hover:bg-gray-100"
                          onClick={() => presFileInputRef.current?.click()}
                        >
                          Choose File
                        </button>
                        <span
                          className="font-roboto text-[14px]"
                          style={{ color: '#000000' }}
                        >
                          {presFileName ?? 'No file chosen'}
                        </span>
                      </div>
                      {presHref && (
                        <a
                          href={presHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-roboto text-[13px] text-[#909090] no-underline hover:underline"
                        >
                          View current file
                        </a>
                      )}
                      <input
                        ref={presFileInputRef}
                        type="file"
                        name="presentation"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setPresFile(file);
                          setPresFileName(file ? file.name : null);
                        }}
                      />
                    </div>
                  </td>
                  <td className="border border-[#ddd] py-[15px] px-[10px] align-top">
                    <span className="text-[#909090] font-roboto text-[14px]">
                      {formatDueDate(data?.semesterMonth ?? null)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {saveError && (
            <p className="mb-3 font-roboto text-[14px] text-red-600">{saveError}</p>
          )}
          {saveSuccess && (
            <p className="mb-3 font-roboto text-[14px] text-green-700">
              {saveSuccess}
            </p>
          )}

          <div className="mt-4">
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center px-[12px] py-[6px] border border-[#ccc] rounded-[10px] text-[#333] bg-white hover:bg-[#e6e6e6] hover:border-[#adadad] text-[14px] leading-[1.42857143] font-normal text-center align-middle cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontWeight: 'normal' }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

