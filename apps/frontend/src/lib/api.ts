import type {
  QueryParams,
  Snippet,
  SnippetListResponse,
  SnippetPayload,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(path, BASE_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as {
        message?: string | string[];
      };
      if (Array.isArray(errorBody.message)) {
        message = errorBody.message.join(", ");
      } else if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Keep fallback message when response body is not JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getSnippets(query: QueryParams): Promise<SnippetListResponse> {
  return request<SnippetListResponse>(buildUrl("/snippets", query));
}

export function getSnippet(id: string): Promise<Snippet> {
  return request<Snippet>(buildUrl(`/snippets/${id}`));
}

export function createSnippet(payload: SnippetPayload): Promise<Snippet> {
  return request<Snippet>(buildUrl("/snippets"), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSnippet(
  id: string,
  payload: SnippetPayload,
): Promise<Snippet> {
  return request<Snippet>(buildUrl(`/snippets/${id}`), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteSnippet(id: string): Promise<Snippet> {
  return request<Snippet>(buildUrl(`/snippets/${id}`), {
    method: "DELETE",
  });
}
