import { createDirectus, rest, authentication, readItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

const collections = [
  'Global_Settings',
  'Page_Home',
  'Page_Descubre_GYE',
  'Page_Informacion_Util',
  'Page_Como_Llegar',
  'Page_Movilidad',
  'Page_Que_Hacer',
  'Page_Turismo_MICE',
  'Page_Buro_Convenciones',
  'Page_Razones_Guayaquil',
  'Page_Solicitud_Apoyo',
  'Categorias',
  'Eventos',
  'Noticias',
  'Puntos_Interes',
  'Recorridos',
  'Experiencias',
  'Destinos_Internacionales'
];

async function dump() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  try {
    await client.login({ email: EMAIL, password: PASSWORD });
  } catch (error) {
    console.error('Failed to authenticate.', error);
    process.exit(1);
  }

  for (const collection of collections) {
    try {
      console.log(`\n=== COLLECTION: ${collection} ===`);
      const items = await client.request(readItems(collection, {
        fields: ['*', 'translations.*']
      }));
      console.log(JSON.stringify(items, null, 2));
    } catch (err) {
      console.error(`Error reading ${collection}:`, err.message);
    }
  }
  process.exit(0);
}

dump().catch(console.error);
