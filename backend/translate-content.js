import { createDirectus, rest, authentication, readItems, createItem, updateItem } from '@directus/sdk';

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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  // If the text does not contain letters, no need to translate (e.g. coordinates or numbers)
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(text)) return text;
  // If it is an icon prefix
  if (text.startsWith('lucide-')) return text;
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  await delay(100); // Be polite to API rate limits
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const data = await res.json();
  return data[0].map(s => s[0]).join('');
}

async function translateValue(val, targetLang, parentKey = null) {
  if (val === null || val === undefined) return val;
  
  if (Array.isArray(val)) {
    const result = [];
    for (const item of val) {
      result.push(await translateValue(item, targetLang, parentKey));
    }
    return result;
  }
  
  if (typeof val === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(val)) {
      const untranslatableKeys = ['icon_name', 'color_theme', 'icon', 'image', 'id', 'uuid', 'color', 'theme', 'distance'];
      if (untranslatableKeys.includes(key)) {
        result[key] = value;
      } else {
        result[key] = await translateValue(value, targetLang, key);
      }
    }
    return result;
  }
  
  if (typeof val === 'string') {
    if (parentKey && (parentKey.includes('path') || parentKey.includes('href') || parentKey.includes('link'))) {
      if (val.startsWith('/es/')) {
        return val.replace(/^\/es\//, `/${targetLang}/`);
      }
      return val;
    }
    return await translateText(val, targetLang);
  }
  
  return val;
}

async function translateAll() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  try {
    await client.login({ email: EMAIL, password: PASSWORD });
  } catch (error) {
    console.error('Failed to authenticate with Directus.', error);
    process.exit(1);
  }

  const targetLangs = ['en', 'pt', 'fr', 'de'];

  for (const collection of collections) {
    try {
      console.log(`\nProcessing collection: ${collection}`);
      let items = await client.request(readItems(collection, {
        fields: ['*', 'translations.*']
      }));
      
      if (!items) continue;
      if (!Array.isArray(items)) {
        items = [items];
      }
      
      // Filter out items that don't have a valid ID (e.g. uninitialized singletons)
      items = items.filter(item => item.id !== null && item.id !== undefined);
      if (items.length === 0) {
        console.log(`No active items found for ${collection}.`);
        continue;
      }

      const transCollectionName = `${collection}_translations`;
      const parentIdField = `${collection}_id`;
      const excludeKeys = ['id', parentIdField, 'languages_code'];

      for (const item of items) {
        const translations = item.translations || [];
        const esTrans = translations.find(t => t.languages_code === 'es');
        
        if (!esTrans) {
          console.log(`  -> Item ${item.id} has no Spanish ('es') translation. Skipping.`);
          continue;
        }

        console.log(`  -> Translating item ${item.id} from Spanish...`);
        for (const targetLang of targetLangs) {
          console.log(`     -> Translating to: [${targetLang}]`);
          const existingTrans = translations.find(t => t.languages_code === targetLang);
          
          const payload = {
            languages_code: targetLang,
            [parentIdField]: item.id
          };

          for (const [key, val] of Object.entries(esTrans)) {
            if (!excludeKeys.includes(key)) {
              payload[key] = await translateValue(val, targetLang);
            }
          }

          if (existingTrans) {
            console.log(`        Updating existing translation record (ID: ${existingTrans.id})...`);
            await client.request(updateItem(transCollectionName, existingTrans.id, payload));
          } else {
            console.log(`        Creating new translation record...`);
            await client.request(createItem(transCollectionName, payload));
          }
        }
      }
    } catch (err) {
      console.error(`Error translating collection ${collection}:`, err.message, err.stack);
    }
  }

  console.log('\nAll translations completed successfully!');
  process.exit(0);
}

translateAll().catch(console.error);
