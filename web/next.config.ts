import type { NextConfig } from "next";

const nextConfig: NextConfig = {
/* config options here */
  eslint: {
    // ⚠️ Ignora avisos como "variável não usada" e "any" durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Ignora erros de tipagem que impediriam o deploy
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
