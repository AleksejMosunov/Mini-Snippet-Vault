import Link from 'next/link';
import type { Snippet } from '@/lib/types';

type SnippetCardProps = {
  snippet: Snippet;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{snippet.title}</h3>
        <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800">
          {snippet.type}
        </span>
      </div>

      <p className="line-clamp-3 text-sm text-slate-700">{snippet.content}</p>

      <div className="mt-3 flex flex-wrap gap-2">
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

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>Updated {formatDate(snippet.updatedAt)}</span>
        <Link
          href={`/snippets/${snippet._id}`}
          className="rounded-lg bg-slate-900 px-3 py-1.5 font-semibold text-white transition hover:bg-slate-700"
        >
          Open
        </Link>
      </div>
    </article>
  );
}
