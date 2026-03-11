'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListControls } from '@/components/list-controls';
import { SnippetCard } from '@/components/snippet-card';
import { SnippetForm } from '@/components/snippet-form';
import { createSnippet, getSnippets } from '@/lib/api';
import type { Snippet, SnippetPayload } from '@/lib/types';

const PAGE_SIZE = 6;

export default function HomePage() {
  const [items, setItems] = useState<Snippet[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [debouncedTag, setDebouncedTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q);
      setDebouncedTag(tag);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [q, tag]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSnippets({
        q: debouncedQ,
        tag: debouncedTag,
        page,
        limit: PAGE_SIZE,
      });
      setItems(response.data);
      setTotal(response.total);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Failed to load snippets.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQ, debouncedTag, page]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleCreate = useCallback(async (payload: SnippetPayload): Promise<void> => {
    setIsCreating(true);

    try {
      await createSnippet(payload);
      await loadData();
    } finally {
      setIsCreating(false);
    }
  }, [loadData]);

  const hasFilters = useMemo(() => {
    return Boolean(debouncedQ.trim() || debouncedTag.trim());
  }, [debouncedQ, debouncedTag]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-6">
      <header className="mb-6 rounded-3xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-amber-50 p-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Snippet Hub
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-700">
          Keep useful notes, links, and commands in one clean workspace.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-4">
          <ListControls
            searchValue={q}
            tagValue={tag}
            page={page}
            total={total}
            limit={PAGE_SIZE}
            isLoading={isLoading}
            onSearchChange={setQ}
            onTagChange={setTag}
            onNextPage={() => setPage((prev) => prev + 1)}
            onPrevPage={() => setPage((prev) => Math.max(1, prev - 1))}
          />

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
              <p className="text-sm font-medium">Could not load snippets.</p>
              <p className="mt-1 text-sm">{error}</p>
              <button
                type="button"
                onClick={() => void loadData()}
                className="mt-3 rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
              Loading snippets...
            </div>
          ) : null}

          {!isLoading && !error && items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">No snippets yet</p>
              <p className="mt-1 text-sm text-slate-600">
                {hasFilters
                  ? 'Try different search or tag filters.'
                  : 'Create your first snippet using the form.'}
              </p>
            </div>
          ) : null}

          {!isLoading && !error && items.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((snippet) => (
                <SnippetCard key={snippet._id} snippet={snippet} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <SnippetForm
            mode="create"
            isSubmitting={isCreating}
            onSubmit={handleCreate}
          />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            <p className="font-medium text-slate-800">Quick tips</p>
            <ul className="mt-2 space-y-1">
              <li>Use short titles for better scanability.</li>
              <li>Separate tags with commas.</li>
              <li>Open a snippet to edit or delete it.</li>
            </ul>
            <Link href="/snippets" className="mt-3 inline-block text-cyan-700 underline">
              Direct list route
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
