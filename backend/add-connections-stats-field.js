import { createDirectus, rest, authentication, createField } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

async function run() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });

  console.log('Adding trip_connections_banner_stats to Page_Home_translations...');
  try {
    await client.request(createField('Page_Home_translations', {
      field: 'trip_connections_banner_stats',
      type: 'json',
      meta: {
        interface: 'list',
        options: {
          fields: [
            { field: 'value', type: 'string', name: 'Valor', meta: { interface: 'input' } },
            { field: 'label', type: 'string', name: 'Etiqueta', meta: { interface: 'input' } }
          ]
        },
        translations: [
          { language: 'en-US', translation: 'Estadísticas de Conexiones' },
          { language: 'es-ES', translation: 'Estadísticas de Conexiones' },
          { language: 'es-419', translation: 'Estadísticas de Conexiones' },
          { language: 'es', translation: 'Estadísticas de Conexiones' }
        ]
      },
      schema: {}
    }));
    console.log('Successfully created the field trip_connections_banner_stats!');
  } catch (e) {
    console.error('Failed to create field:', e.errors?.[0]?.message || e);
  }
}

run().then(() => { console.log('Done!'); process.exit(0); }).catch((e) => { console.error(e); process.exit(1); });
