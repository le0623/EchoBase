import { protocol, rootDomain } from "./utils";

/**
* Utility functions for URL handling in multi-tenant applications
*/

/**
 * Constructs a tenant-specific URL
 * @param subdomain The tenant subdomain
 * @param path The path to navigate to (optional)
 * @returns The full tenant URL
 */
export const getTenantUrl = (subdomain: string, path: string = ''): string => {
  const tenantHostname = `${subdomain}.${rootDomain}`;

  return `${protocol}://${tenantHostname}${path}`;
};

/**
 * Navigates to a specific tenant
 * @param subdomain The tenant subdomain
 * @param path The path to navigate to (optional)
 */
export const navigateToTenant = (subdomain: string, path: string = ''): void => {
  window.location.href = getTenantUrl(subdomain, path);
};
