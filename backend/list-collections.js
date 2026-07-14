import { createDirectus, rest, authentication } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

async function listCollections() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });
  
  const collections = await client.request(() => ({
    method: 'GET',
    path: '/collections'
  }));
  
  // Directus raw endpoint returns { data: [...] }
  const data = collections.data || collections;
  const customCollections = data.filter(c => !c.collection.startsWith('directus_'));
  console.log(customCollections.map(c => c.collection));
}

listCollections().catch(console.error);
