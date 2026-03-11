'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SnippetForm } from '@/components/snippet-form';
import { deleteSnippet, getSnippet, updateSnippet } from '@/lib/api';
import type { Snippet, SnippetPayload } from '@/lib/types';

type SnippetDetailPageProps = {
  params: Promise<{ id: string; }>;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function SnippetDetailPage({ params }: SnippetDetailPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function resolveParams() {
      const resolved = await params;
      if (mounted) {
        setId(resolved.id);
      }
    }

    void resolveParams();

    return () => {
      mounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!id) {
      return;
    }

    async function loadSnippet() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getSnippet(id);
        setSnippet(result);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Failed to load snippet.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadSnippet();
  }, [id]);

  async function handleUpdate(payload: SnippetPayload): Promise<void> {
    if (!id) {
      return;
    }

    setIsSaving(true);

    try {
      const updated = await updateSnippet(id, payload);
      setSnippet(updated);
      setError(null);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) {
      return;
    }

    const confirmed = window.confirm('Delete this snippet permanently?');
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteSnippet(id);
      router.push('/');
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Failed to delete snippet.';
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 md:px-6">
      <div className="mb-5 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-cyan-700 hover:underline">
          Back to list
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          Loading snippet details...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
          <p className="text-sm font-semibold">Unable to load snippet.</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && !snippet ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-700 shadow-sm">
          Snippet not found.
        </div>
      ) : null}

      {!isLoading && !error && snippet ? (
        <section className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{snippet.title}</h1>
              <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800">
                {snippet.type}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-slate-700">{snippet.content}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {snippet.tags.length > 0 ? (
                snippet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-300 px-2 py-1 text-xs text-slate-700"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No tags</span>
              )}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Created {formatDate(snippet.createdAt)} | Updated {formatDate(snippet.updatedAt)}
            </p>
          </article>

          <SnippetForm
            mode="edit"
            initialValue={snippet}
            isSubmitting={isSaving}
            onSubmit={handleUpdate}
          />

          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            {isDeleting ? 'Deleting...' : 'Delete Snippet'}
          </button>
        </section>
      ) : null}
    </main>
  );
}
