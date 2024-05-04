import groupBy from 'lodash-es/groupBy';
import { allPosts } from 'contentlayer/generated';

export interface PostProps {
  params: {
    slug: string[];
  };
}

export function getPostFromParams(params: PostProps['params']) {
  const slug = params?.slug?.join('/');
  const post = allPosts.find(post => post.slugAsParams === slug);
  return post || null;
}

export const groupByYearPosts = Object.entries(groupBy(allPosts, d => new Date(d.date).getFullYear()));
