"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Submission, SubmissionStatus } from "@/lib/supabase";

const STATUS_NEXT: Record<SubmissionStatus, SubmissionStatus> = {
  new: "contacted",
  contacted: "done",
  done: "new"
};

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  new: "New",
  contacted: "Contacted",
  done: "Done"
};

const STATUS_COLOUR: Record<SubmissionStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  done: "bg-emerald-100 text-emerald-800"
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function AdminDashboard({
  submissions,
  error
}: {
  submissions: Submission[];
  error?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function cycleStatus(id: string, current: SubmissionStatus) {
    const next = STATUS_NEXT[current];
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next })
    });
    startTransition(() => router.refresh());
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Smile Assessments</h1>
            <p className="text-xs text-gray-500">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            Error loading submissions: {error}
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl">📭</p>
            <p className="mt-3 text-base font-medium text-gray-700">No submissions yet</p>
            <p className="mt-1 text-sm text-gray-400">They&apos;ll appear here once patients submit their smile photos.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Photo</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submissions.map((s) => (
                    <tr key={s.id} className="transition hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <a href={s.photo_url} target="_blank" rel="noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.photo_url}
                            alt={`${s.name}'s smile`}
                            className="h-14 w-14 rounded-lg object-cover ring-1 ring-gray-200 transition hover:ring-yellow-400"
                          />
                        </a>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <a
                          href={`https://wa.me/${s.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2 hover:text-green-600"
                        >
                          {s.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(s.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOUR[s.status]}`}>
                          {STATUS_LABEL[s.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => cycleStatus(s.id, s.status)}
                          disabled={isPending}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                          → {STATUS_LABEL[STATUS_NEXT[s.status]]}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
              {submissions.map((s) => (
                <div key={s.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex gap-4">
                    <a href={s.photo_url} target="_blank" rel="noreferrer" className="shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.photo_url}
                        alt={`${s.name}'s smile`}
                        className="h-16 w-16 rounded-xl object-cover ring-1 ring-gray-200"
                      />
                    </a>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{s.name}</p>
                      <a
                        href={`https://wa.me/${s.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-gray-600 underline underline-offset-2 hover:text-green-600"
                      >
                        {s.phone}
                      </a>
                      <p className="mt-0.5 text-xs text-gray-400">{formatDate(s.created_at)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOUR[s.status]}`}>
                      {STATUS_LABEL[s.status]}
                    </span>
                    <button
                      onClick={() => cycleStatus(s.id, s.status)}
                      disabled={isPending}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                      → {STATUS_LABEL[STATUS_NEXT[s.status]]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
