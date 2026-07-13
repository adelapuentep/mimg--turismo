import { createDirectus, rest, authentication, readRelations, updateRelation } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

async function run() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });

  console.log('Querying existing relations...');
  const relations = await client.request(readRelations());

  for (const r of relations) {
    // Detect translation relations: collection ends with _translations, and field is ParentName_id
    if (r.collection && r.collection.endsWith('_translations') && r.field && r.field.endsWith('_id')) {
      try {
        console.log(`Patching translation relation: ${r.collection}.${r.field} -> ${r.related_collection} to ON DELETE CASCADE...`);
        await client.request(updateRelation(r.collection, r.field, {
          schema: {
            on_delete: 'CASCADE'
          }
        }));
        console.log(`Successfully patched ${r.collection}.${r.field}`);
      } catch (e) {
        console.error(`Failed to patch ${r.collection}.${r.field}:`, e.errors?.[0]?.message || e);
      }
    }
  }
}

run().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
