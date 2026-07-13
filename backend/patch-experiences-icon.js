import { createDirectus, rest, authentication, createField } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

async function run() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });

  console.log('Adding field icon_name to Experiencias...');
  try {
    await client.request(createField('Experiencias', {
      field: 'icon_name',
      type: 'string',
      meta: {
        interface: 'input',
        sort: 5
      }
    }));
    console.log('Successfully created field icon_name!');
  } catch (e) {
    console.error('Failed to create field:', e.errors?.[0]?.message || e);
  }
}

run().then(() => { console.log('Done!'); process.exit(0); }).catch((e) => { console.error(e); process.exit(1); });
