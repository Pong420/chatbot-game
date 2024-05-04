import { readdirSync } from 'fs';
import { withContentlayer } from 'next-contentlayer2';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  async rewrites() {
    return {
      beforeFiles: [...['privacy', 'term-of-use', 'contact'].map(s => ({ source: `/${s}`, destination: `/docs/${s}` }))]
    };
  },
  async redirects() {
    return [
      { source: '/docs/werewolf', destination: '/docs/werewolf/flow', permanent: true },
      { source: '/docs', destination: '/docs/todo', permanent: true }
    ];
  },

  webpack(config, { webpack }) {
    // ----- require.context ------

    config.plugins.push(new webpack.ContextExclusionPlugin(/test\.ts$/));

    // ----- SVG ------

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/ // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack']
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  serverRuntimeConfig: {
    context: ['src/bot/line/handlers', 'src/bot/line/service/werewolf/handlers'].reduce(
      (res, dirname) => ({
        ...res,
        [dirname]: readdirSync(dirname).filter(name => /(?<!\.test)\.(ts|tsx)?$/.test(name))
      }),
      {}
    )
  }
};

export default withContentlayer(nextConfig);
