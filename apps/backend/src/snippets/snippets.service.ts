import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Snippet, SnippetDocument } from './schemas/snippet.schema';
import { Error as MongooseError, Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { QuerySnippetDto } from './dto/query-snippet.dto';

type SnippetFilter = {
  $text?: { $search: string };
  tags?: string;
  type?: QuerySnippetDto['type'];
};

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name) private snippetModel: Model<SnippetDocument>,
  ) {}

  private validateIdOrThrow(id: string): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid snippet id');
    }
  }

  private handleValidationError(error: unknown): never {
    if (error instanceof MongooseError.ValidationError) {
      throw new BadRequestException(error.message);
    }

    throw error;
  }

  async create(createSnippetDto: CreateSnippetDto): Promise<SnippetDocument> {
    try {
      const createdSnippet = new this.snippetModel(createSnippetDto);
      return await createdSnippet.save();
    } catch (error) {
      this.handleValidationError(error);
    }
  }

  async findOne(id: string): Promise<SnippetDocument> {
    this.validateIdOrThrow(id);

    const snippet = await this.snippetModel.findById(id).exec();
    if (!snippet) {
      throw new NotFoundException('Snippet not found');
    }

    return snippet;
  }

  async findAllFiltered(
    query: QuerySnippetDto,
  ): Promise<{ data: SnippetDocument[]; total: number }> {
    const { q, tag, type, page = 1, limit = 10 } = query;

    const filter: SnippetFilter = {};

    if (q?.trim()) {
      filter.$text = { $search: q.trim() };
    }

    if (tag) filter.tags = tag;
    if (type) filter.type = type;

    const snippets = await this.snippetModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.snippetModel.countDocuments(filter);

    return { data: snippets, total };
  }

  async update(
    id: string,
    updateSnippetDto: UpdateSnippetDto,
  ): Promise<SnippetDocument> {
    this.validateIdOrThrow(id);

    try {
      const snippet = await this.snippetModel
        .findByIdAndUpdate(id, updateSnippetDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!snippet) {
        throw new NotFoundException('Snippet not found');
      }

      return snippet;
    } catch (error) {
      this.handleValidationError(error);
    }
  }

  async remove(id: string): Promise<SnippetDocument> {
    this.validateIdOrThrow(id);

    const snippet = await this.snippetModel.findByIdAndDelete(id).exec();
    if (!snippet) {
      throw new NotFoundException('Snippet not found');
    }

    return snippet;
  }
}
