import { Document } from 'mongoose';

export type SnippetType = 'note' | 'link' | 'command';

export interface Snippet extends Document {
  title: string;
  content: string;
  type: SnippetType;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
