import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayUnique,
  IsIn,
} from 'class-validator';
import type { SnippetType } from '../interfaces/snippet.interface';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsIn(['note', 'link', 'command'], {
    message: 'Type must be note, link or command',
  })
  type: SnippetType;

  @IsArray()
  @ArrayUnique()
  tags: string[];
}
