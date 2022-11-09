/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  images: {
    domains: ["cloudflare-ipfs.com", "tbi.mypinata.cloud", "localhost"],
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      events: false,
      path: false,
      stream: false,
      util: false,
      zlib: false,
      crypto: false,
      assert: false,
      querystring: false,
      http: false,
      https: false,
    };

    // add compilerOPtions paths stream
    config.resolve.alias = {
      ...config.resolve.alias,
      stream: require.resolve("stream-browserify"),
    };

    return config;
  },
};
