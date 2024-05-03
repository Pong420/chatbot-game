import groupBy from 'lodash-es/groupBy';
import { ValueOf } from '@/types';
import { allDocs, allPosts } from 'contentlayer/generated';

export type DocItem = ValueOf<typeof groupByDirDocs>;

export const groupByDirDocs = groupBy(
  allDocs.filter(d => d.navbar),
  d => d._raw.sourceFileDir
);

export const docEntries = Object.entries(groupByDirDocs).map(
  ([k, v]) => [k, v.sort((a, b) => a.navbarPosition - b.navbarPosition)] as const
);

export const groupByYearPosts = Object.entries(groupBy(allPosts, d => new Date(d.date).getFullYear()));
