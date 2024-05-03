import fs from 'fs/promises';
import path from 'path';
import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export const Category = defineDocumentType(() => ({
  name: 'Category',
  contentType: 'data',
  filePathPattern: `**/_category_.json`,
  fields: {
    label: { type: 'string', required: true }
  },
  computedFields: {}
}));

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: false
    },
    published: {
      type: 'boolean',
      default: true
    },
    toc: {
      type: 'boolean',
      default: true,
      required: false
    },
    date: {
      type: 'date',
      required: false
    },
    messages: {
      type: 'string',
      required: false
    },
    navbar: { type: 'boolean', default: true },
    navbarPosition: { type: 'number', default: 99999 }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: doc => `/docs/${doc._raw.flattenedPath}`
    },
    slugAsParams: {
      type: 'string',
      resolve: doc => doc._raw.flattenedPath
    },
    category: {
      type: 'Category' as 'json',
      resolve: doc =>
        fs
          .readFile(path.resolve('docs', doc._raw.sourceFileDir, '_category_.json'), 'utf-8')
          .then(content => JSON.parse(content))
          .catch(() => ({}))
    }
  }
}));

export default makeSource({
  contentDirPath: './docs',
  documentTypes: [Doc, Category],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section'
          },
          behavior: 'wrap'
        }
      ]
    ]
  }
});
