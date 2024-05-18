import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import { stringifyEntityRef, DEFAULT_NAMESPACE } from '@backstage/catalog-model';

async function signInResolver({ profile }, ctx) {
  if (!profile.email) {
    throw new Error(
      'Login failed, user profile does not contain an email',
    );
  }
  // Split the email into the local part and the domain.
  const [localPart] = profile.email.split('@');

  // Next we verify the email domain. It is recommended to include this
  // kind of check if you don't look up the user in an external service.
  // if (domain !== 'acme.org') {
  //   throw new Error(
  //     `Login failed, '${profile.email}' does not belong to the expected domain`,
  //   );
  // }

  // By using `stringifyEntityRef` we ensure that the reference is formatted correctly
  const userEntity = stringifyEntityRef({
    kind: 'User',
    name: localPart,
    namespace: DEFAULT_NAMESPACE,
  });

  return ctx.issueToken({
    claims: {
      sub: userEntity,
      ent: [userEntity],
    },
  });
}

const customAuth = createBackendModule({
  // This ID must be exactly "auth" because that's the plugin it targets
  pluginId: 'auth',
  // This ID must be unique, but can be anything
  moduleId: 'custom-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          // This ID must match the actual provider config, e.g. addressing
          // auth.providers.github means that this must be "github".
          providerId: 'github',
          // Use createProxyAuthProviderFactory instead if it's one of the proxy
          // based providers rather than an OAuth based one
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            signInResolver,
          }),
        });
      },
    });
  },
});

export { customAuth };
