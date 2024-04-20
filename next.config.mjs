import { readdirSync } from 'fs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { webpack }) {
    config.plugins.push(new webpack.ContextExclusionPlugin(/test\.ts$/));
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

export default nextConfig;
