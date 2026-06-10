"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Submission, SubmissionStatus } from "@/lib/supabase";
import StatusDropdown from "./StatusDropdown";

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

const STATUS_SELECT_COLOUR: Record<SubmissionStatus, string> = {
  new: "bg-amber-50 text-amber-800 border-amber-200",
  contacted: "bg-blue-50 text-blue-800 border-blue-200",
  done: "bg-emerald-50 text-emerald-800 border-emerald-200"
};

const STATUS_DOT: Record<string, string> = {
  new: "bg-amber-400",
  contacted: "bg-blue-500",
  done: "bg-emerald-500"
};

const ALL_STATUSES: SubmissionStatus[] = ["new", "contacted", "done"];

const STATUS_OPTIONS = ALL_STATUSES.map((s) => ({
  value: s,
  label: STATUS_LABEL[s]
}));

const FILTER_OPTIONS: { value: SubmissionStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  ...STATUS_OPTIONS
];

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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function updateStatus(id: string, status: SubmissionStatus) {
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    startTransition(() => router.refresh());
  }

  async function deleteSubmission(id: string) {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }
    setConfirmDelete(null);
    setDeleting(id);
    await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    setDeleting(null);
    startTransition(() => router.refresh());
  }

  const visible = submissions
    .filter((s) => {
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q || s.name.toLowerCase().includes(q) || s.phone.includes(q);
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (a.status === "done" && b.status !== "done") return 1;
      if (a.status !== "done" && b.status === "done") return -1;
      return 0;
    });

  const countLabel =
    visible.length === submissions.length
      ? `${submissions.length} submission${submissions.length !== 1 ? "s" : ""}`
      : `${visible.length} of ${submissions.length} submission${submissions.length !== 1 ? "s" : ""}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Smile Assessments</h1>
            <p className="text-xs text-gray-500">{countLabel}</p>
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

        {/* Search & filter bar */}
        {submissions.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search by name or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
            />
            <StatusDropdown
              value={statusFilter}
              options={FILTER_OPTIONS}
              onChange={setStatusFilter}
              size="md"
              colourClass="bg-white text-gray-700 border-gray-200"
              optionDot={STATUS_DOT}
              ariaLabel="Filter by status"
            />
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl">📭</p>
            <p className="mt-3 text-base font-medium text-gray-700">No submissions yet</p>
            <p className="mt-1 text-sm text-gray-400">They&apos;ll appear here once patients submit their smile photos.</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-3 text-base font-medium text-gray-700">No results found</p>
            <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filter.</p>
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
                    <th className="px-4 py-3 text-left">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visible.map((s) => (
                    <tr
                      key={s.id}
                      className={`transition hover:bg-gray-50 ${s.status === "done" ? "opacity-60" : ""}`}
                    >
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
                        <StatusDropdown
                          value={s.status}
                          options={STATUS_OPTIONS}
                          onChange={(status) => updateStatus(s.id, status)}
                          disabled={isPending}
                          colourClass={STATUS_SELECT_COLOUR[s.status]}
                          optionDot={STATUS_DOT}
                          ariaLabel={`Status for ${s.name}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteSubmission(s.id)}
                          disabled={deleting === s.id || isPending}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                            confirmDelete === s.id
                              ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                              : "border-gray-300 text-gray-500 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                          }`}
                        >
                          {deleting === s.id ? "Deleting…" : confirmDelete === s.id ? "Confirm?" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 md:hidden">
              {visible.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${s.status === "done" ? "opacity-60" : ""}`}
                >
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
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <a
                          href={`https://wa.me/${s.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-gray-600 underline underline-offset-2 hover:text-green-600"
                        >
                          {s.phone}
                        </a>
                        <p className="shrink-0 whitespace-nowrap text-xs text-gray-400">
                          {formatDate(s.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <StatusDropdown
                      value={s.status}
                      options={STATUS_OPTIONS}
                      onChange={(status) => updateStatus(s.id, status)}
                      disabled={isPending}
                      colourClass={STATUS_SELECT_COLOUR[s.status]}
                      optionDot={STATUS_DOT}
                      ariaLabel={`Status for ${s.name}`}
                    />
                    <button
                      onClick={() => deleteSubmission(s.id)}
                      disabled={deleting === s.id || isPending}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                        confirmDelete === s.id
                          ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                          : "border-gray-300 text-gray-500 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                      }`}
                    >
                      {deleting === s.id ? "Deleting…" : confirmDelete === s.id ? "Confirm?" : "Delete"}
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
