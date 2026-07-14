import { createDirectus, rest, authentication, createPermission } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

const collections = [
  'languages',
  'Global_Settings',
  'Global_Settings_translations',
  'Page_Home',
  'Page_Home_translations',
  'Page_Descubre_GYE',
  'Page_Descubre_GYE_translations',
  'Page_Informacion_Util',
  'Page_Informacion_Util_translations',
  'Page_Como_Llegar',
  'Page_Como_Llegar_translations',
  'Page_Movilidad',
  'Page_Movilidad_translations',
  'Page_Que_Hacer',
  'Page_Que_Hacer_translations',
  'Page_Turismo_MICE',
  'Page_Turismo_MICE_translations',
  'Page_Buro_Convenciones',
  'Page_Buro_Convenciones_translations',
  'Page_Razones_Guayaquil',
  'Page_Razones_Guayaquil_translations',
  'Page_Solicitud_Apoyo',
  'Page_Solicitud_Apoyo_translations',
  'Categorias',
  'Categorias_translations',
  'Eventos',
  'Eventos_translations',
  'Experiencias',
  'Experiencias_translations',
  'Noticias',
  'Noticias_translations',
  'Puntos_Interes',
  'Puntos_Interes_translations',
  'Recorridos',
  'Recorridos_translations',
  'Aerolineas',
  'Destinos_Internacionales',
  'Destinos_Internacionales_translations',
  'directus_files'
];

async function grantPublicAccess() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  
  console.log('Authenticating...');
  try {
    await client.login({ email: EMAIL, password: PASSWORD });
    console.log('Authenticated successfully!');
  } catch (error) {
    console.error('Failed to authenticate:', error);
    process.exit(1);
  }

  // Fetch existing permissions for public role
  console.log('Fetching existing public permissions...');
  let existingPermissions = [];
  try {
    existingPermissions = await client.request(() => ({
      method: 'GET',
      path: '/permissions',
      params: {
        filter: {
          role: {
            _null: true
          }
        },
        limit: -1
      }
    }));
  } catch (error) {
    console.error('Failed to fetch existing permissions:', error);
  }

  const existingCollections = new Set(existingPermissions.map(p => p.collection));
  console.log(`Found ${existingCollections.size} existing public permissions.`);

  const permissionsToCreate = [];
  for (const collection of collections) {
    if (!existingCollections.has(collection)) {
      permissionsToCreate.push({
        role: null,
        collection: collection,
        action: 'read',
        permissions: {},
        validation: {},
        presets: {},
        fields: ['*']
      });
    }
  }

  if (permissionsToCreate.length === 0) {
    console.log('All collections already have public read permissions.');
    process.exit(0);
  }

  console.log(`Creating ${permissionsToCreate.length} permissions...`);
  for (const perm of permissionsToCreate) {
    try {
      await client.request(createPermission(perm));
      console.log(`Granted public read to collection: ${perm.collection}`);
    } catch (error) {
      console.error(`Failed to grant read to ${perm.collection}:`, error.errors?.[0]?.message || error);
    }
  }
  console.log('Finished setting permissions!');
}

grantPublicAccess().catch(console.error);
