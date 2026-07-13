import { createDirectus, rest, authentication, updateSettings } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

async function run() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });

  const css = `
/* 1. Make the parent field wrapper relative and add padding to make space for the divider */
.field.full:has(.translations) {
  position: relative;
  padding-top: 48px;
}

/* 2. LITERALLY MOVE the existing native divider DOM element to the top using absolute positioning */
.translations .v-form .v-divider.inlineTitle {
  display: flex !important; /* Ensure it is visible, overriding any previous display: none */
  position: absolute;
  top: 12px;
  left: 0;
  width: 100%;
  margin: 0 !important;
}
`;

  await client.request(updateSettings({ custom_css: css.trim() }));
  console.log('Custom CSS updated to literally move the native divider!');
}

run().then(() => { console.log('Done!'); process.exit(0); });
