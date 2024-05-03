import groupBy from 'lodash-es/groupBy';
import keyBy from 'lodash-es/keyBy';
import { ValueOf } from '@/types';
import { allDocs, allCategories } from 'contentlayer/generated';

export type DocItem = ValueOf<typeof groupByDirectory>;

const category = keyBy(allCategories, '_raw.sourceFileDir');

export const groupByDirectory = groupBy(
  allDocs.filter(d => d.navbar).map(d => ({ ...d, category: category[d._raw.sourceFileDir] })),
  d => (d._raw.sourceFileDir === '.' ? d._raw.flattenedPath : d._raw.sourceFileDir)
);

export const docEntries = Object.entries(groupByDirectory).map(
  ([k, v]) => [k, v.sort((a, b) => a.navbarPosition - b.navbarPosition)] as const
);
