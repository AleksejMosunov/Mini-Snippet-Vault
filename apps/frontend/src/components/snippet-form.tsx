'use client';

import { useMemo, useState } from 'react';
import type { Snippet, SnippetPayload, SnippetType } from '@/lib/types';

type SnippetFormProps = {
  mode: 'create' | 'edit';
  initialValue?: Snippet;
  onSubmit: (payload: SnippetPayload) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
};

type FormValues = {
  title: string;
  content: string;
  type: SnippetType;
  tagsInput: string;
};

type FormErrors = {
  title?: string;
  content?: string;
  type?: string;
};

const DEFAULT_VALUES: FormValues = {
  title: '',
  content: '',
  type: 'note',
  tagsInput: '',
};

function toFormValues(initialValue?: Snippet): FormValues {
  if (!initialValue) {
    return DEFAULT_VALUES;
  }

  return {
    title: initialValue.title,
    content: initialValue.content,
    type: initialValue.type,
    tagsInput: initialValue.tags.join(', '),
  };
}

function parseTags(input: string): string[] {
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function SnippetForm({
  mode,
  initialValue,
  onSubmit,
  onCancel,
  isSubmitting,
}: SnippetFormProps) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(initialValue));
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const titleText = useMemo(() => {
    return mode === 'create' ? 'Create New Snippet' : 'Edit Snippet';
  }, [mode]);

  function validate(next: FormValues): FormErrors {
    const nextErrors: FormErrors = {};

    if (!next.title.trim()) {
      nextErrors.title = 'Title is required.';
    }

    if (!next.content.trim()) {
      nextErrors.content = 'Content is required.';
    }

    if (!next.type) {
      nextErrors.type = 'Type is required.';
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setFormError(null);

    try {
      await onSubmit({
        title: values.title.trim(),
        content: values.content.trim(),
        type: values.type,
        tags: parseTags(values.tagsInput),
      });

      if (mode === 'create') {
        setValues({ ...DEFAULT_VALUES });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save snippet.';
      setFormError(message);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{titleText}</h2>
        <p className="text-sm text-slate-600">
          {mode === 'create'
            ? 'Add your note, link, or command in one place.'
            : 'Update fields and save changes.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            value={values.title}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, title: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500"
            placeholder="Example: MongoDB text index notes"
          />
          {errors.title ? (
            <p className="mt-1 text-sm text-rose-600">{errors.title}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={values.content}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, content: event.target.value }))
            }
            className="min-h-28 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500"
            placeholder="Write your snippet content"
          />
          {errors.content ? (
            <p className="mt-1 text-sm text-rose-600">{errors.content}</p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              value={values.type}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  type: event.target.value as SnippetType,
                }))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500"
            >
              <option value="note">Note</option>
              <option value="link">Link</option>
              <option value="command">Command</option>
            </select>
            {errors.type ? (
              <p className="mt-1 text-sm text-rose-600">{errors.type}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="tags">
              Tags
            </label>
            <input
              id="tags"
              value={values.tagsInput}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, tagsInput: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-cyan-500"
              placeholder="api, nest, mongodb"
            />
            <p className="mt-1 text-xs text-slate-500">Separate tags with commas.</p>
          </div>
        </div>

        {formError ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {formError}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Saving...'
              : mode === 'create'
                ? 'Create Snippet'
                : 'Save Changes'}
          </button>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
