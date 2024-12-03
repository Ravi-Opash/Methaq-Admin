module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "143.110.240.64"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.opash.in",
      },
      {
        protocol: "https",
        hostname: "**.esanad.com",
      },
    ],
  },
};
