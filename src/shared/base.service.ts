import { Model, ModelCtor } from 'sequelize-typescript';
import { NotFoundException } from '@nestjs/common';

// models
import { IPaginationResponse } from './interfaces/pagination-response.model';
import { IPaginationQueryParams } from './interfaces/pagination-query-params.model';

export abstract class BaseService<T extends any = ModelCtor<Model<any, any>>> {
  private DB_MODEL: T & ModelCtor<Model<any, any>>;

  constructor(model: any) {
    // Cannot figure out how to put type here
    this.DB_MODEL = model;
  }

  public async getByID(id: number): Promise<T> {
    const data = (await this.DB_MODEL.findByPk(id)) as any;
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  public async getByPagination(
    queryParams: IPaginationQueryParams,
  ): Promise<IPaginationResponse<T>> {
    const { rows, count } = await this.DB_MODEL.findAndCountAll({
      ...this.getPaginationValues(queryParams),
    });

    return {
      count: count,
      results: rows as any[],
    };
  }

  public async deleteByID(id: number): Promise<void> {
    const data = await this.DB_MODEL.findByPk(id);
    if (!data) {
      throw new NotFoundException();
    }

    await data.destroy();
  }

  protected getPaginationValues(
    params: IPaginationQueryParams,
  ): { limit: number; offset: number } | Record<string, never> {
    if (
      !!params.showAll &&
      (params.showAll === 'true' || +params.showAll === 1)
    ) {
      return {};
    }

    const page =
      +params.page && +params.page >= 1 ? Math.round(+params.page) : 1;
    const pageSize =
      +params.pageSize && +params.pageSize >= 1
        ? Math.round(+params.pageSize)
        : 30;

    const offset = (page - 1) * pageSize;

    return { limit: pageSize, offset };
  }
}
