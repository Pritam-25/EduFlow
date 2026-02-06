import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname: "lms-application.fly.storage.tigris.dev",
        port: "",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
