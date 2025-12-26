import JsonDb from "../database/jsondb";
import { IArticle } from "../interfaces/article.interface";

export const getAllArticles = ({limit, offset}: { limit: number; offset: number }): IArticle[] => {
  const data = JsonDb();

  return data.slice(offset, offset + limit) as IArticle[];
};

export const getArticleBySlug = ({ slug }: { slug: string }): IArticle | undefined => {
  const data = JsonDb();
  const result = data.find((article: IArticle) => article.slug === slug) as IArticle | undefined;

  return result;
};

