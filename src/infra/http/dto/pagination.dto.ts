import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

class MetaDto {
  @ApiProperty({
    description: 'Page index',
    type: Number,
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Total itens per page',
    type: Number,
    example: 10,
  })
  perPage: number;

  @ApiProperty({
    description: 'Total itens found in database',
    type: Number,
    example: 1,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Total pages found in database',
    type: Number,
    example: 1,
  })
  totalPages: number;
}

export class PaginationDto {
  @ApiProperty({
    description: 'Page for pagination',
    type: Number,
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    description: 'Limit for pagination',
    type: Number,
    default: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  limit: number = 9;
}

export class PaginatedDto<TData> {
  @ApiProperty({
    description: 'Metadata of the data found',
    type: MetaDto,
  })
  meta: MetaDto;

  results: TData[];
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto<TModel>, model),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedDto<TModel>) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
