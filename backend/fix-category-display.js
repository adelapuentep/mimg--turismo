import { createDirectus, rest, authentication, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

const collectionsToFix = ['Eventos', 'Noticias', 'Puntos_Interes'];

async function fixCategoryDisplay() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });

  for (const collectionName of collectionsToFix) {
    try {
      await client.request(updateField(collectionName, 'categoria_id', {
        meta: {
          interface: 'select-dropdown-m2o',
          display: 'related-values',
          display_options: {
            template: '{{translations.label}}'
          }
        }
      }));
      console.log(`Updated ${collectionName}.categoria_id selector display template.`);
    } catch (e) {
      console.error(`Failed to update ${collectionName}.categoria_id:`, e.errors?.[0]?.message || e);
    }
  }
}

fixCategoryDisplay().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
