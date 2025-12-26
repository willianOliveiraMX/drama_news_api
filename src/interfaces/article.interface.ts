export interface ITextMark {
  type: 'bold' | 'italic';
}

export interface IContentText {
  nodeType: 'text';
  value: string;
  marks: ITextMark[];
}

export interface IContentNode {
  nodeType: 'paragraph' | 'heading-2';
  content: IContentText[];
}

export interface ICoverImage {
  url: string;
  alt_text: string;
  caption: string;
}

export interface IMedia {
  cover_image: ICoverImage;
}

export interface IAuthor {
  name: string;
  profile_url: string;
  bio: string;
}

export interface IDates {
  published_at: string;
  modified_at: string;
}

export interface ISEO {
  title_tag: string;
  meta_description: string;
  canonical_url: string;
  robots_directive: string;
  keywords: string[];
}

export interface ISocialGraph {
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
}

export interface IStructuredData {
  schema_type: string;
  item_reviewed: string;
}

export interface IArticle {
  id: string;
  slug: string;
  title: string;
  type: string;
  subtitle: string;
  locale: string;
  midia: IMedia;
  author: IAuthor;
  dates: IDates;
  seo: ISEO;
  social_graph: ISocialGraph;
  structured_data: IStructuredData;
  content: IContentNode[];
}

export interface IArticleDatabase {
  data: IArticle[];
}
