import { createDirectus, rest, authentication, readCollections, deleteField, readSettings, updateSettings } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

async function run() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });

  console.log('Reverting the explicitly added divider fields...');
  const collections = await client.request(readCollections());
  for (const c of collections) {
    if (c.meta && c.collection.startsWith('Page_') && !c.collection.endsWith('_translations')) {
      try {
        await client.request(deleteField(c.collection, 'divider'));
        console.log(`Deleted divider field from ${c.collection}`);
      } catch (e) {
        // Ignore if it doesn't exist
      }
    }
  }

  console.log('Applying Custom CSS to move the native divider to the top...');
  
  const css = `
/* Hide the native divider at the bottom of the Translations component */
.translations .v-form .v-divider.inlineTitle,
.translations .primary > .v-divider.inlineTitle {
  display: none !important;
}

/* Inject a visual divider at the top of the Translations component */
.translations::before {
  content: "";
  display: block;
  width: 100%;
  border-top: var(--border-width, 1px) solid var(--theme--border-color-subdued, #e0e0e0);
  margin-bottom: 32px;
}
`;

  await client.request(updateSettings({ custom_css: css.trim() }));
  console.log('Custom CSS updated to move the divider!');
}

run().then(() => { console.log('Done!'); process.exit(0); });
