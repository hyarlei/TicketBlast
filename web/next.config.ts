import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withSentryConfig(nextConfig, {
  // Para todas as opções disponíveis: https://github.com/getsentry/sentry-webpack-plugin#options

  org: "universidade-federal-do-cea-9j", // O Wizard deve ter preenchido isso
  project: "javascript-nextjs", // Ou o nome que você deu no Sentry

  // Apenas imprime logs úteis ao fazer upload de source maps
  silent: !(process.env.CI === 'true'),

  // Faz upload de arquivos maiores de source map
  widenClientFileUpload: true,

  // Oculta source maps do client-side no browser (segurança)
  hideSourceMaps: true,

  // Desabilita o logger na árvore de componentes
  disableLogger: true,
});
function withSentryConfig(
  nextConfig: NextConfig,
  sentryOptions: {
    org: string;
    project: string;
    silent: boolean;
    widenClientFileUpload: boolean;
    hideSourceMaps: boolean;
    disableLogger: boolean;
  }
): NextConfig {
  return {
    ...nextConfig,
    webpack: (config, options) => {
      // Call existing webpack config if present
      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, options);
      }

      // Add Sentry webpack plugin configuration here if needed
      config.plugins = config.plugins || [];
      
      return config;
    },
  };
}
