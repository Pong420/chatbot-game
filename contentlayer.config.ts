import fs from 'fs/promises';
import path from 'path';
import { ComputedFields, defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import * as wc from 'words-count';

const { wordsCount } = wc['default'] as unknown as typeof import('words-count');

const slugFields = (): ComputedFields => ({
  slug: {
    type: 'string',
    resolve: doc => `/${doc._raw.flattenedPath}`
  },
  slugAsParams: {
    type: 'string',
    resolve: doc => doc._raw.flattenedPath.split('/').slice(1).join('/')
  }
});

const getDescription = (content: string, length: number) => {
  content = content.trim();
  length = Math.min(content.length, length);

  const total = wordsCount(content);
  let result = content.slice(0, length);
  let i = 0;
  while (wordsCount(result) < length) {
    i++;
    result = content.slice(0, length + i);
  }

  if (length < total) {
    result += '...';
  }

  return result;
};

export const Post = defineDocumentType(() => ({
  name: 'Post',
  contentType: 'mdx',
  filePathPattern: `posts/**/*.mdx`,
  fields: {
    title: {
      type: 'string',
      required: true
    }
  },
  computedFields: {
    ...slugFields(),
    date: {
      type: 'date',
      resolve: doc => new Date(path.basename(doc._raw.sourceFileName, '.mdx')).toISOString()
    },
    description: {
      type: 'string',
      resolve: doc => getDescription(doc.body.raw, 100)
    }
  }
}));

export const Category = defineDocumentType(() => ({
  name: 'Category',
  contentType: 'data',
  filePathPattern: `docs/**/_category_.json`,
  fields: {
    label: { type: 'string', required: true }
  },
  computedFields: {}
}));

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: `docs/**/*.mdx`,
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
    ...slugFields(),
    category: {
      type: 'Category' as 'json',
      resolve: doc =>
        fs
          .readFile(path.resolve(doc._raw.sourceFileDir, '_category_.json'), 'utf-8')
          .then(content => JSON.parse(content))
          .catch(() => ({}))
    }
  }
}));

export default makeSource({
  contentDirPath: './',
  documentTypes: [Post, Doc, Category],
  contentDirInclude: ['docs', 'posts'],
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
