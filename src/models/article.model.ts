import JsonDb from "../database/jsondb";
import { IArticle } from "../interfaces/article.interface";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllArticles = async ({limit, offset}: { limit: number; offset: number }): Promise<IArticle[]> => {
  await delay(300);
  const data = JsonDb();

  return data.slice(offset, offset + limit) as IArticle[];
};

export const getArticleBySlug = async ({ slug }: { slug: string }): Promise<IArticle | undefined> => {
  await delay(300);
  const data = JsonDb();
  const result = data.find((article: IArticle) => article.slug === slug) as IArticle | undefined;

  return result;
};

export const getArticleByType = async ({ type }: { type: string }): Promise<IArticle[] > => {
  await delay(300);
  const data = JsonDb();
  const result = data.filter((article: IArticle) => article.type.toLowerCase() === type.toLowerCase()) as IArticle[];

  return result;
}

