import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { SnippetType } from '../interfaces/snippet.interface';

export type SnippetDocument = Snippet & Document;

@Schema({ timestamps: true })
export class Snippet {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ required: true, enum: ['note', 'link', 'command'] })
  type: SnippetType;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);

// Text индекс для поиска по title и content
SnippetSchema.index({ title: 'text', content: 'text' });
