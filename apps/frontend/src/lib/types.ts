export type SnippetType = "note" | "link" | "command";

export type Snippet = {
  _id: string;
  title: string;
  content: string;
  type: SnippetType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type SnippetListResponse = {
  data: Snippet[];
  total: number;
};

export type QueryParams = {
  q?: string;
  tag?: string;
  page?: number;
  limit?: number;
};

export type SnippetPayload = {
  title: string;
  content: string;
  type: SnippetType;
  tags: string[];
};
