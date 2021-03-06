import { Category } from "../infra/typeorm/entities/Category";

interface ICreateCategoryDTO {
  description: string;
  name: string;
}

interface ICategoriesRepository {
  findByName(name: string): Promise<Category>;
  list(): Promise<Category[]>;
  create(data: ICreateCategoryDTO): Promise<void>
}

export {ICategoriesRepository, ICreateCategoryDTO}