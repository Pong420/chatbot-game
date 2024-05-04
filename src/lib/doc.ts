import groupBy from 'lodash-es/groupBy';
import { Doc, allDocs } from 'contentlayer/generated';

export type { Doc };

export interface DocPageProps {
  params: {
    slug: string[];
  };
}

export const groupByDirDocs = groupBy(
  allDocs.filter(d => d.navbar),
  d => d._raw.sourceFileDir
);

export const docEntries = Object.entries(groupByDirDocs).map(
  ([k, v]) => [k, v.sort((a, b) => a.navbarPosition - b.navbarPosition)] as const
);

export function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join('/') || '';
  const doc = allDocs.find(doc => doc.slugAsParams === slug);
  return doc || null;
}
