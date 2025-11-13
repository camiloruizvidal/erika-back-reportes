import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class MetaPaginadoResponseDto {
  @ApiProperty({ description: 'Total de registros encontrados', type: Number })
  @Expose({ name: 'total' })
  total!: number;

  @ApiProperty({ description: 'Página que se está consultando (1-based)', type: Number })
  @Expose({ name: 'pagina' })
  pagina!: number;

  @ApiProperty({ description: 'Cantidad de elementos devueltos por página', type: Number })
  @Expose({ name: 'tamanoPagina' })
  tamano_pagina!: number;
}

export class PaginadoResponseDto<T> {
  @ApiProperty({ type: () => MetaPaginadoResponseDto })
  @Expose({ name: 'meta' })
  @Type(() => MetaPaginadoResponseDto)
  meta!: MetaPaginadoResponseDto;

  @ApiProperty({ isArray: true, type: () => Object })
  @Expose({ name: 'data' })
  data!: T[];
}

