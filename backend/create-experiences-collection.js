import { createDirectus, rest, authentication, createCollection, createRelation } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

const statusChoices = [
  { text: 'Published', value: 'published' },
  { text: 'Draft', value: 'draft' },
  { text: 'Archived', value: 'archived' }
];

const statusField = { 
  field: 'status', 
  type: 'string', 
  meta: { 
    interface: 'select-dropdown',
    options: { choices: statusChoices }
  }, 
  schema: { default_value: 'published' } 
};

async function run() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });

  console.log('Creating Experiencias Collection...');

  try {
    // 1. Create Base Collection
    await client.request(createCollection({
      collection: 'Experiencias',
      name: 'Experiencias',
      meta: { icon: 'star', singleton: false },
      schema: { name: 'Experiencias' },
      fields: [
        { 
          field: 'id', 
          type: 'uuid', 
          meta: { hidden: true, readonly: true, interface: 'input', special: ['uuid'] },
          schema: { is_primary_key: true, has_auto_increment: false } 
        },
        statusField,
        {
          field: 'translations',
          type: 'alias',
          meta: { 
            interface: 'translations', 
            special: ['translations'],
            options: {
              languageField: 'code',
              languageTemplate: '{{name}}',
              defaultLanguage: 'es'
            }
          }
        },
        { field: 'imagen', type: 'uuid', meta: { interface: 'file-image' } },
        { field: 'number', type: 'string' },
        { field: 'categoria_id', type: 'uuid', meta: { interface: 'select-dropdown-m2o', display: 'related-values', display_options: { template: '{{translations.label}}' } } }
      ]
    }));
    console.log('Created Experiencias base collection.');
  } catch (e) {
    console.log('Experiencias base collection creation failed:', e.errors?.[0]?.message || e);
  }

  try {
    // 2. Create Translations Collection
    await client.request(createCollection({
      collection: 'Experiencias_translations',
      name: 'Experiencias Translations',
      meta: { hidden: true },
      schema: { name: 'Experiencias_translations' },
      fields: [
        { field: 'id', type: 'integer', meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
        { field: 'Experiencias_id', type: 'uuid', meta: { hidden: true } },
        { field: 'languages_code', type: 'string', meta: { hidden: true } },
        { field: 'name', type: 'string' },
        { field: 'description', type: 'text' },
        { field: 'cta_label', type: 'string' },
        { field: 'cta_link', type: 'string' }
      ]
    }));
    console.log('Created Experiencias_translations collection.');
  } catch (e) {
    console.log('Experiencias_translations collection creation failed:', e.errors?.[0]?.message || e);
  }

  // 3. Create Relations
  try {
    await client.request(createRelation({
      collection: 'Experiencias_translations',
      field: 'Experiencias_id',
      related_collection: 'Experiencias',
      meta: { 
        one_field: 'translations',
        junction_field: 'languages_code'
      }
    }));
    console.log('Created Experiencias_id relation.');
  } catch (e) {
    console.log('Failed to create Experiencias_id relation:', e.errors?.[0]?.message || e);
  }

  try {
    await client.request(createRelation({
      collection: 'Experiencias_translations',
      field: 'languages_code',
      related_collection: 'languages',
      meta: {
        many_collection: 'Experiencias_translations',
        many_field: 'languages_code',
        one_collection: 'languages',
        junction_field: 'Experiencias_id'
      }
    }));
    console.log('Created languages_code relation.');
  } catch (e) {
    console.log('Failed to create languages_code relation:', e.errors?.[0]?.message || e);
  }

  try {
    await client.request(createRelation({
      collection: 'Experiencias',
      field: 'imagen',
      related_collection: 'directus_files',
      meta: {
        many_collection: 'Experiencias',
        many_field: 'imagen',
        one_collection: 'directus_files'
      }
    }));
    console.log('Created image relation.');
  } catch (e) {
    console.log('Failed to create image relation:', e.errors?.[0]?.message || e);
  }

  try {
    await client.request(createRelation({
      collection: 'Experiencias',
      field: 'categoria_id',
      related_collection: 'Categorias',
      meta: {
        many_collection: 'Experiencias',
        many_field: 'categoria_id',
        one_collection: 'Categorias'
      }
    }));
    console.log('Created category relation.');
  } catch (e) {
    console.log('Failed to create category relation:', e.errors?.[0]?.message || e);
  }
}

run().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
