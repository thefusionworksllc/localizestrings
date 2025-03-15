/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import path from 'path';
import i18nConfig from './next-i18next.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  i18n: i18nConfig.i18n,
};

export default nextConfig;
