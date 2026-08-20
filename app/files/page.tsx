
"use client";

import {
  Download,
  File,
  FileImage,
  FileText,
  FileVideo,
  HardDrive,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type FileRecord = {
  id: string;
  name: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  type: "PHOTO" | "VIDEO" | "DOCUMENT" | "CONTRACT" | "INVOICE" | "OTHER";
  visibility: "PUBLIC" | "PRIVATE";
  clientId: string | null;
  bookingId: string | null;
  createdAt: string;
  updatedAt: string;

  uploadedBy: {
    id: string;
    name: string | null;
    email: string;
  } | null;

  client: {
    id: string;
    companyName: string | null;
    user: {
      name: string | null;
      email: string;
    };
  } | null;

  booking: {
    id: string;
    reference: string;
    service: string;
  } | null;
};

type Client = {
  id: string;
  companyName: string | null;
  user: {
    name: string | null;
    email: string;
  };
};

const fileTypeFilters = [
  "ALL",
  "PHOTO",
  "VIDEO",
  "DOCUMENT",
  "CONTRACT",
  "INVOICE",
  "OTHER",
] as const;

type FileTypeFilter = (typeof fileTypeFilters)[number];

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>("ALL");

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(
    null,
  );
  const [selectedClientId, setSelectedClientId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadFiles() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/files", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load files.");
      }

      setFiles(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading files.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadClients() {
    try {
      const response = await fetch("/api/clients", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load clients.");
      }

      setClients(data);
    } catch (err) {
      console.error("Failed to load clients:", err);
    }
  }

  useEffect(() => {
    loadFiles();
    loadClients();
  }, []);

  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return files.filter((file) => {
      const matchesType =
        typeFilter === "ALL" || file.type === typeFilter;

      if (!matchesType) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        file.name,
        file.originalName,
        file.mimeType,
        file.type,
        file.client?.companyName,
        file.client?.user.name,
        file.client?.user.email,
        file.uploadedBy?.name,
        file.uploadedBy?.email,
        file.booking?.reference,
        file.booking?.service,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [files, search, typeFilter]);

  const totalSize = useMemo(
    () => files.reduce((total, file) => total + file.size, 0),
    [files],
  );

  function openUploadModal() {
    setSelectedFile(null);
    setSelectedClientId("");
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function closeUploadModal() {
    if (uploading) {
      return;
    }

    setModalOpen(false);
    setSelectedFile(null);
    setSelectedClientId("");
    setError("");
    setSuccess("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setError("");
  }

  async function uploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("file", selectedFile);

      if (selectedClientId) {
        formData.append("clientId", selectedClientId);
      }

      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file.");
      }

      setFiles((current) => [data, ...current]);

      setSuccess("File uploaded successfully.");
      setSelectedFile(null);
      setSelectedClientId("");

      window.setTimeout(() => {
        setModalOpen(false);
        setSuccess("");
      }, 900);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading the file.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteFile(file: FileRecord) {
    const confirmed = window.confirm(
      `Delete "${file.originalName}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(file.id);
      setError("");

      const response = await fetch(
        `/api/files?id=${encodeURIComponent(file.id)}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete file.");
      }

      setFiles((current) =>
        current.filter((currentFile) => currentFile.id !== file.id),
      );

      setSuccess("File deleted successfully.");

      window.setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the file.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function downloadFile(file: FileRecord) {
    const link = document.createElement("a");

    link.href = `/api/files/${encodeURIComponent(file.id)}/download`;
    link.download = file.originalName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#b89235]/[0.06] blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8a6a22]/[0.05] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#c5a34a]/70">
              Company Portal
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              File Management
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Upload, organize and manage company documents, media and client
              files.
            </p>
          </div>

          <button
            onClick={openUploadModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c] active:scale-[0.98]"
          >
            <Plus size={17} />
            Upload File
          </button>
        </div>

        {/* Global messages */}
        {error && !modalOpen && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && !modalOpen && (
          <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/[0.06] px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<HardDrive size={19} />}
            label="Total Files"
            value={files.length.toString()}
          />

          <StatCard
            icon={<FileImage size={19} />}
            label="Photos"
            value={files
              .filter((file) => file.type === "PHOTO")
              .length.toString()}
          />

          <StatCard
            icon={<FileText size={19} />}
            label="Documents"
            value={files
              .filter(
                (file) =>
                  file.type === "DOCUMENT" ||
                  file.type === "CONTRACT" ||
                  file.type === "INVOICE",
              )
              .length.toString()}
          />

          <StatCard
            icon={<Users size={19} />}
            label="Clients With Files"
            value={
              new Set(
                files
                  .map((file) => file.clientId)
                  .filter(Boolean),
              ).size.toString()
            }
          />
        </div>

        {/* File directory */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90">
          {/* Toolbar */}
          <div className="border-b border-white/[0.06] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Company Files
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  {filteredFiles.length} file
                  {filteredFiles.length === 1 ? "" : "s"} found
                  {files.length > 0 && (
                    <>
                      {" "}
                      · {formatBytes(totalSize)} total
                    </>
                  )}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                <div className="relative w-full sm:w-[280px]">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search files..."
                    className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-[#c5a34a]/30"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(event.target.value as FileTypeFilter)
                  }
                  className="rounded-xl border border-white/[0.07] bg-[#111] px-4 py-2.5 text-sm text-white/60 outline-none transition focus:border-[#c5a34a]/30"
                >
                  {fileTypeFilters.map((type) => (
                    <option key={type} value={type}>
                      {type === "ALL" ? "All Types" : formatFileType(type)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#c5a34a]" />

                <p className="mt-4 text-xs text-white/30">
                  Loading files...
                </p>
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center p-8">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                  <File
                    size={25}
                    strokeWidth={1.5}
                    className="text-white/25"
                  />
                </div>

                <h3 className="mt-5 text-sm font-medium text-white/70">
                  {search || typeFilter !== "ALL"
                    ? "No files found"
                    : "No files uploaded"}
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/25">
                  {search || typeFilter !== "ALL"
                    ? "Try a different search or file type."
                    : "Upload your first file to start building your company file library."}
                </p>

                {!search && typeFilter === "ALL" && (
                  <button
                    onClick={openUploadModal}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c5a34a] px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-[#d4b45c]"
                  >
                    <Upload size={15} />
                    Upload First File
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-white/[0.06] bg-white/[0.015]">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                        File
                      </th>

                      <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                        Type
                      </th>

                      <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                        Client
                      </th>

                      <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                        Uploaded By
                      </th>

                      <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                        Date
                      </th>

                      <th className="px-6 py-4 text-right text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex min-w-[280px] items-center gap-3">
                            <FileIcon type={file.type} />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white/80">
                                {file.originalName}
                              </p>

                              <p className="mt-1 text-xs text-white/25">
                                {formatBytes(file.size)} · {file.mimeType}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <FileTypeBadge type={file.type} />
                        </td>

                        <td className="px-6 py-5">
                          {file.client ? (
                            <div>
                              <p className="text-sm text-white/60">
                                {file.client.companyName ||
                                  file.client.user.name ||
                                  "Private Client"}
                              </p>

                              <p className="mt-1 text-xs text-white/25">
                                {file.client.user.email}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-white/25">
                              Unassigned
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm text-white/50">
                              {file.uploadedBy?.name || "System"}
                            </p>

                            {file.uploadedBy?.email && (
                              <p className="mt-1 text-xs text-white/20">
                                {file.uploadedBy.email}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-xs text-white/40">
                            {formatDate(file.createdAt)}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => downloadFile(file)}
                              title="Download"
                              className="rounded-lg border border-white/[0.07] p-2 text-white/35 transition hover:border-[#c5a34a]/20 hover:bg-[#c5a34a]/[0.05] hover:text-[#d4b45c]"
                            >
                              <Download size={15} />
                            </button>

                            <button
                              onClick={() => deleteFile(file)}
                              disabled={deletingId === file.id}
                              title="Delete"
                              className="rounded-lg border border-white/[0.07] p-2 text-white/25 transition hover:border-red-500/20 hover:bg-red-500/[0.05] hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {deletingId === file.id ? (
                                <span className="block h-[15px] w-[15px] animate-spin rounded-full border border-white/10 border-t-red-400" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/tablet cards */}
              <div className="grid gap-3 p-4 lg:hidden">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <FileIcon type={file.type} />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white/80">
                          {file.originalName}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          {formatBytes(file.size)} · {formatDate(file.createdAt)}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <FileTypeBadge type={file.type} />

                          {file.client && (
                            <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-white/35">
                              {file.client.companyName ||
                                file.client.user.name ||
                                "Client"}
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-xs text-white/25">
                          Uploaded by{" "}
                          <span className="text-white/40">
                            {file.uploadedBy?.name || "System"}
                          </span>
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => downloadFile(file)}
                          className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-[#d4b45c]"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>

                        <button
                          onClick={() => deleteFile(file)}
                          disabled={deletingId === file.id}
                          className="rounded-lg p-2 text-white/25 transition hover:bg-red-500/[0.05] hover:text-red-400 disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Activity preview */}
        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                File Activity
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Recent file activity will appear here once authentication and
                activity logging are connected.
              </p>
            </div>

            <HardDrive size={20} className="text-white/15" />
          </div>
        </section>
      </div>

      {/* Upload modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md">
          <div className="my-8 w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b0b] shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#c5a34a]/70">
                  File Management
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  Upload File
                </h2>
              </div>

              <button
                onClick={closeUploadModal}
                disabled={uploading}
                className="rounded-xl p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={uploadFile}>
              <div className="p-6">
                {error && (
                  <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/[0.06] px-4 py-3 text-sm text-green-300">
                    {success}
                  </div>
                )}

                {/* File picker */}
                <label className="block cursor-pointer">
                  <span className="mb-2 block text-xs font-medium text-white/45">
                    File <span className="text-[#c5a34a]">*</span>
                  </span>

                  <input
                    type="file"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />

                  <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] p-8 text-center transition hover:border-[#c5a34a]/30 hover:bg-[#c5a34a]/[0.02]">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c5a34a]/15 bg-[#c5a34a]/[0.06] text-[#c5a34a]">
                      <Upload size={22} />
                    </div>

                    {selectedFile ? (
                      <>
                        <p className="mt-4 truncate px-4 text-sm font-medium text-white/70">
                          {selectedFile.name}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          {formatBytes(selectedFile.size)}
                        </p>

                        <p className="mt-3 text-[11px] text-[#c5a34a]/70">
                          Click to choose a different file
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-4 text-sm font-medium text-white/60">
                          Choose a file
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          Click here to browse files on your computer.
                        </p>
                      </>
                    )}
                  </div>
                </label>

                {/* Client */}
                <div className="mt-5">
                  <label className="block">
                    <span className="mb-2 block text-xs font-medium text-white/45">
                      Assign to Client
                    </span>

                    <select
                      value={selectedClientId}
                      onChange={(event) =>
                        setSelectedClientId(event.target.value)
                      }
                      disabled={uploading}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3 text-sm text-white/60 outline-none transition focus:border-[#c5a34a]/30"
                    >
                      <option value="">No client / unassigned</option>

                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.companyName ||
                            client.user.name ||
                            client.user.email}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <p className="mt-5 text-xs leading-5 text-white/20">
                  Files are stored in the local uploads directory and their
                  metadata is saved in PostgreSQL.
                </p>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] p-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={uploading}
                  className="rounded-xl border border-white/[0.08] px-5 py-3 text-sm font-medium text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c5a34a] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d4b45c] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Upload File
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b]/90 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] p-3 text-[#c5a34a]">
          {icon}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-white/30">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function FileIcon({
  type,
}: {
  type: FileRecord["type"];
}) {
  if (type === "PHOTO") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/10 bg-blue-500/[0.06] text-blue-400">
        <FileImage size={18} />
      </div>
    );
  }

  if (type === "VIDEO") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/10 bg-purple-500/[0.06] text-purple-400">
        <FileVideo size={18} />
      </div>
    );
  }

  if (
    type === "DOCUMENT" ||
    type === "CONTRACT" ||
    type === "INVOICE"
  ) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5a34a]/10 bg-[#c5a34a]/[0.06] text-[#c5a34a]">
        <FileText size={18} />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/30">
      <File size={18} />
    </div>
  );
}

function FileTypeBadge({
  type,
}: {
  type: FileRecord["type"];
}) {
  return (
    <span className="inline-flex rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] font-medium text-white/40">
      {formatFileType(type)}
    </span>
  );
}

function formatFileType(type: string) {
  return type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${
    units[index] || "Bytes"
  }`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

