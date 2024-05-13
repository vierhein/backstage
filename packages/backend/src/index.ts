/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';
import { customAuth } from './CustomResolver';

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend/alpha'));
backend.add(import('@backstage/plugin-proxy-backend/alpha'));
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
backend.add(import('@backstage/plugin-techdocs-backend/alpha'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// See https://backstage.io/docs/auth/guest/provider
// backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend/alpha'));
// backend.add(
//   import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
// );
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend/alpha'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

// devtools
backend.add(import('@backstage/plugin-devtools-backend'));
// unprocessed entity
backend.add(import('@backstage/plugin-catalog-backend-module-unprocessed'));

backend.add(customAuth);

backend.start();
