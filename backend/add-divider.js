import { createDirectus, rest, authentication, createField, readCollections, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

async function run() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });

  const collections = await client.request(readCollections());
  for (const c of collections) {
    if (c.meta && c.collection.startsWith('Page_') && !c.collection.endsWith('_translations')) {
      try {
        await client.request(createField(c.collection, {
          field: 'divider',
          type: 'alias',
          meta: {
            interface: 'presentation-divider',
            special: ['alias', 'no-data'],
            sort: 4,
            options: {
              title: 'Contenido Dinámico',
              margins: 'both'
            },
            translations: [
              { language: 'en-US', translation: 'Translated Content' },
              { language: 'es-ES', translation: 'Contenido Traducido' },
              { language: 'es-419', translation: 'Contenido Traducido' }
            ]
          },
          schema: null
        }));
        console.log(`Created divider in ${c.collection}`);
      } catch (e) {
        console.log(`Failed to create divider in ${c.collection}:`, e.errors?.[0]?.message || e);
      }
      
      // Ensure translations stays at 5
      try {
        await client.request(updateField(c.collection, 'translations', {
            meta: { sort: 5 }
        }));
      } catch (e) { }
    }
  }
}

run().then(() => { console.log('Done!'); process.exit(0); });
