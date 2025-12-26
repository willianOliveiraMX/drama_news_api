import JsonDb from "../database/jsondb";
import { IArticle } from "../interfaces/article.interface";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllArticles = async ({limit, offset}: { limit: number; offset: number }): Promise<IArticle[]> => {
  await delay(900);
  const data = JsonDb();

  return data.slice(offset, offset + limit) as IArticle[];
};

export const getArticleBySlug = async ({ slug }: { slug: string }): Promise<IArticle | undefined> => {
  await delay(900);
  const data = JsonDb();
  const result = data.find((article: IArticle) => article.slug === slug) as IArticle | undefined;

  return result;
};

