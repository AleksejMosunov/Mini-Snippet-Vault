type ListControlsProps = {
  searchValue: string;
  tagValue: string;
  page: number;
  total: number;
  limit: number;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
};

export function ListControls({
  searchValue,
  tagValue,
  page,
  total,
  limit,
  isLoading,
  onSearchChange,
  onTagChange,
  onNextPage,
  onPrevPage,
}: ListControlsProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor="search" className="mb-1 block text-sm font-medium text-slate-700">
            Search
          </label>
          <input
            id="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search title or content"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="tag" className="mb-1 block text-sm font-medium text-slate-700">
            Filter by tag
          </label>
          <input
            id="tag"
            value={tagValue}
            onChange={(event) => onTagChange(event.target.value)}
            placeholder="Example: mongodb"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Page {page} of {totalPages} ({total} total)
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevPage}
            disabled={page <= 1 || isLoading}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNextPage}
            disabled={page >= totalPages || isLoading}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
