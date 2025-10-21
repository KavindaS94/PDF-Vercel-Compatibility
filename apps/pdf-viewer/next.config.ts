// Delegate to JS config to avoid version-specific TypeScript loader issues
// and ensure a single source of truth for Next configuration.
import nextConfig from './next.config.js';
export default nextConfig;
