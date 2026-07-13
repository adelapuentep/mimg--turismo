import { createDirectus, rest, authentication, createCollection, createRelation, createItems } from '@directus/sdk';

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

async function setupSchema() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  
  console.log('Authenticating...');
  try { await client.login(EMAIL, PASSWORD); } catch (e) {}
  try {
    await client.login({ email: EMAIL, password: PASSWORD });
  } catch (error) {
    console.error('Failed to authenticate. Ensure Directus is fully booted.', error);
    process.exit(1);
  }

  // Normalize fields to ensure they all have a `meta` object so the Directus UI doesn't crash
  const normalizeFields = (fields) => fields.map(f => {
    if (!f.meta) f.meta = {};
    if (!f.meta.special) f.meta.special = [];
    if (!f.meta.interface) {
      if (f.type === 'string') f.meta.interface = 'input';
      if (f.type === 'text') f.meta.interface = 'input-multiline';
      if (f.type === 'json') {
        f.meta.interface = 'list';
        f.meta.special = ['cast-json'];
      }
      if (f.type === 'uuid' && f.field.includes('image')) f.meta.interface = 'file-image';
    }
    return f;
  });

  async function createTranslatedCollection(baseName, readableName, isSingleton, baseFields, transFields, icon = 'box') {
    console.log(`Creating ${readableName}...`);
    try {
      const baseColFields = [
        { 
          field: 'id', 
          type: 'uuid', 
          meta: { hidden: true, readonly: true, interface: 'input', special: ['uuid'] },
          schema: { is_primary_key: true, has_auto_increment: false } 
        },
        statusField
      ];
      
      // If the collection has translations, add the translations alias field for the Directus UI
      if (transFields && transFields.length > 0) {
        baseColFields.push({
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
        });
      }

      await client.request(createCollection({
        collection: baseName,
        name: readableName,
        meta: { icon, singleton: isSingleton },
        schema: { name: baseName },
        fields: normalizeFields([...baseColFields, ...baseFields])
      }));

      if (transFields && transFields.length > 0) {
        const transName = `${baseName}_translations`;
        await client.request(createCollection({
          collection: transName,
          name: `${readableName} Translations`,
          meta: { hidden: true },
          schema: { name: transName },
          fields: normalizeFields([
            { field: 'id', type: 'integer', meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
            { field: `${baseName}_id`, type: 'uuid', meta: { hidden: true } },
            { field: 'languages_code', type: 'string', meta: { hidden: true } },
            ...transFields
          ])
        }));

        await client.request(createRelation({
          collection: transName,
          field: `${baseName}_id`,
          related_collection: baseName,
          meta: { 
            one_field: 'translations',
            junction_field: 'languages_code'
          }
        }));

        await client.request(createRelation({
          collection: transName,
          field: 'languages_code',
          related_collection: 'languages',
          meta: {
            many_collection: transName,
            many_field: 'languages_code',
            one_collection: 'languages',
            junction_field: `${baseName}_id`
          }
        }));
      }

      // Helper to automatically create relationships for UUID fields (like directus_files and foreign keys)
      const createRelationsForFields = async (fieldsToProcess, collectionName) => {
        if (!fieldsToProcess) return;
        for (const f of fieldsToProcess) {
          if (f.type === 'uuid' && f.field !== 'id' && f.field !== `${baseName}_id`) {
            let relatedCollection = 'directus_files';
            if (f.field === 'categoria_id') relatedCollection = 'Categorias';
            
            try {
              await client.request(createRelation({
                collection: collectionName,
                field: f.field,
                related_collection: relatedCollection,
                meta: {
                  many_collection: collectionName,
                  many_field: f.field,
                  one_collection: relatedCollection
                }
              }));
            } catch (err) {
              console.log(`Warning: Failed to create relation for ${collectionName}.${f.field}:`, err.errors?.[0]?.message || err);
            }
          }
        }
      };

      await createRelationsForFields(baseFields, baseName);
      if (transFields && transFields.length > 0) {
        await createRelationsForFields(transFields, `${baseName}_translations`);
      }

    } catch(e) {
      console.log(`Error creating ${baseName}:`, e.errors?.[0]?.message || e);
    }
  }

  console.log('Creating Languages collection...');
  try {
    await client.request(createCollection({
      collection: 'languages',
      name: 'Languages',
      meta: { icon: 'translate' },
      schema: { name: 'languages' },
      fields: normalizeFields([
        { field: 'code', type: 'string', schema: { is_primary_key: true, length: 10 } },
        { field: 'name', type: 'string', schema: { length: 255 } }
      ])
    }));
    await client.request(createItems('languages', [
      { code: 'es', name: 'Español' }, { code: 'en', name: 'English' },
      { code: 'pt', name: 'Português' }, { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' }
    ]));
  } catch(e) {}

  // 1. GLOBAL SETTINGS
  await createTranslatedCollection('Global_Settings', 'Global Settings', true, [
    { field: 'vuelos_semanales', type: 'integer' },
    { field: 'logo_text', type: 'string' },
    { field: 'logo_subtitle', type: 'string' }
  ], [
    { field: 'footer_headline', type: 'string' },
    { field: 'footer_copyright', type: 'string' }
  ], 'settings');

  // 2. SINGLE PAGES
  await createTranslatedCollection('Page_Home', 'Page Home', true, [
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } },
    { field: 'coordinates', type: 'string' }
  ], [
    { field: 'hero_tagline', type: 'string' }, { field: 'hero_headline_line1', type: 'string' }, { field: 'hero_headline_line2', type: 'string' },
    { field: 'hero_body_text', type: 'text' }, { field: 'hero_cta_primary_label', type: 'string' }, { field: 'hero_cta_primary_href', type: 'string' },
    { field: 'hero_cta_secondary_label', type: 'string' }, { field: 'hero_cta_secondary_href', type: 'string' },
    { field: 'kinetic_marquee_line1', type: 'string' }, { field: 'kinetic_marquee_line2', type: 'string' },
    { field: 'kinetic_section_label', type: 'string' }, { field: 'kinetic_heading_line1', type: 'string' },
    { field: 'kinetic_heading_line2_stroke', type: 'string' }, { field: 'kinetic_body_paragraph', type: 'text' },
    { field: 'kinetic_stats', type: 'json' }, { field: 'experiences_section_label', type: 'string' },
    { field: 'experiences_heading_line1', type: 'string' }, { field: 'experiences_heading_line2_stroke', type: 'string' },
    { field: 'experiences_description', type: 'text' }, { field: 'recorridos_section_label', type: 'string' },
    { field: 'recorridos_heading_line1', type: 'string' }, { field: 'recorridos_heading_line2_stroke', type: 'string' },
    { field: 'events_section_label', type: 'string' }, { field: 'events_heading_line1', type: 'string' },
    { field: 'events_heading_line2_stroke', type: 'string' }, { field: 'mice_section_label', type: 'string' },
    { field: 'mice_heading', type: 'string' }, { field: 'mice_description', type: 'text' }, { field: 'mice_stats', type: 'json' },
    { field: 'mice_services', type: 'json' }, { field: 'mice_amenities', type: 'json' }, { field: 'mice_cta_label', type: 'string' },
    { field: 'mice_cta_href', type: 'string' }, { field: 'trip_section_label', type: 'string' }, { field: 'trip_heading_line1', type: 'string' },
    { field: 'trip_heading_line2_stroke', type: 'string' }, { field: 'trip_quick_info', type: 'json' }, { field: 'trip_transport', type: 'json' },
    { field: 'trip_connections_banner_title', type: 'string' }, { field: 'trip_connections_banner_subtitle', type: 'string' },
    { field: 'trip_connections_banner_image', type: 'uuid', meta: { interface: 'file-image' } },
    { field: 'trip_connections_banner_stats', type: 'json' }
  ], 'web');

  await createTranslatedCollection('Page_Descubre_GYE', 'Page Descubre GYE', true, [
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } }
  ], [
    { field: 'hero_title', type: 'string' }, { field: 'hero_subtitle', type: 'text' }, { field: 'hero_tagline', type: 'string' },
    { field: 'intro_label', type: 'string' }, { field: 'intro_heading', type: 'string' }, { field: 'intro_paragraphs', type: 'json' },
    { field: 'cards', type: 'json' }, { field: 'stats', type: 'json' }
  ], 'web');

  await createTranslatedCollection('Page_Informacion_Util', 'Page Informacion Util', true, [
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } }
  ], [
    { field: 'title', type: 'string' }, { field: 'subtitle', type: 'string' }, { field: 'tagline', type: 'string' },
    { field: 'info_cards', type: 'json' }, { field: 'gateway_banner_icon', type: 'string' }, { field: 'gateway_banner_label', type: 'string' },
    { field: 'gateway_banner_heading', type: 'string' }, { field: 'gateway_banner_body', type: 'text' }, { field: 'gateway_banner_connections', type: 'json' },
    { field: 'visa_info', type: 'json' }, { field: 'important_note', type: 'text', meta: { interface: 'input-rich-text-html' } },
    { field: 'climate_label', type: 'string' }, { field: 'climate_heading', type: 'string' }, { field: 'climate_description', type: 'text' },
    { field: 'climate_seasons', type: 'json' }
  ], 'web');

  await createTranslatedCollection('Page_Como_Llegar', 'Page Como Llegar', true, [
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } }
  ], [
    { field: 'title', type: 'string' }, { field: 'subtitle', type: 'string' }, { field: 'tagline', type: 'string' },
    { field: 'airport_stats', type: 'json' }, { field: 'airport_info_heading', type: 'string' }, { field: 'airport_info_details', type: 'json' },
    { field: 'terminal_terrestre_heading', type: 'string' }, { field: 'terminal_terrestre_body', type: 'text' },
    { field: 'terminal_terrestre_hours', type: 'string' }, { field: 'terminal_terrestre_routes', type: 'string' }, { field: 'terminal_terrestre_tip', type: 'text' }
  ], 'web');

  await createTranslatedCollection('Page_Movilidad', 'Page Movilidad', true, [
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } }
  ], [
    { field: 'title', type: 'string' }, { field: 'subtitle', type: 'string' }, { field: 'tagline', type: 'string' },
    { field: 'metrovia_heading', type: 'string' }, { field: 'metrovia_description', type: 'text' }, { field: 'metrovia_schedule', type: 'json' },
    { field: 'metrovia_tip', type: 'text' }, { field: 'metrovia_stat_number', type: 'string' }, { field: 'metrovia_stat_subtitle', type: 'string' },
    { field: 'aerovia_heading', type: 'string' }, { field: 'aerovia_description', type: 'text' }, { field: 'aerovia_schedule', type: 'json' },
    { field: 'aerovia_tip', type: 'text' }, { field: 'aerovia_stat_number', type: 'string' }, { field: 'aerovia_stat_subtitle', type: 'string' },
    { field: 'aerovia_stations', type: 'json' }, { field: 'terminal_terrestre_heading', type: 'string' }, { field: 'terminal_terrestre_cards', type: 'json' },
    { field: 'terminal_terrestre_tip', type: 'text' }, { field: 'quick_tips', type: 'json' }
  ], 'web');

  await createTranslatedCollection('Page_Que_Hacer', 'Page Que Hacer', true, [
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } }
  ], [
    { field: 'title', type: 'string' }, { field: 'subtitle', type: 'string' }, { field: 'tagline', type: 'string' },
    { field: 'cta_heading', type: 'string' }, { field: 'cta_description', type: 'text' }, { field: 'cta_label', type: 'string' }, { field: 'cta_link', type: 'string' }
  ], 'web');

  await createTranslatedCollection('Page_Turismo_MICE', 'Page Turismo MICE', true, [
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } }
  ], [
    { field: 'title', type: 'string' }, { field: 'subtitle', type: 'string' }, { field: 'tagline', type: 'string' },
    { field: 'intro_heading', type: 'string' }, { field: 'intro_paragraphs', type: 'json' }, { field: 'stats', type: 'json' },
    { field: 'services', type: 'json' }, { field: 'sub_page_cards', type: 'json' }, { field: 'cta_heading', type: 'string' },
    { field: 'cta_description', type: 'text' }, { field: 'cta_label', type: 'string' }, { field: 'cta_link', type: 'string' }
  ], 'web');

  await createTranslatedCollection('Page_Buro_Convenciones', 'Page Buro Convenciones', true, [
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } }
  ], [
    { field: 'title', type: 'string' }, { field: 'subtitle', type: 'string' }, { field: 'tagline', type: 'string' },
    { field: 'quienes_somos_paragraphs', type: 'json' }, { field: 'mission_icon', type: 'string' }, { field: 'mission_heading', type: 'string' },
    { field: 'mission_body', type: 'text' }, { field: 'objectives', type: 'json' }, { field: 'activities', type: 'json' },
    { field: 'service_help_cards', type: 'json' }, { field: 'cta_heading', type: 'string' }, { field: 'cta_description', type: 'text' }, { field: 'cta_label', type: 'string' }
  ], 'web');

  await createTranslatedCollection('Page_Razones_Guayaquil', 'Page Razones Guayaquil', true, [
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } }
  ], [
    { field: 'title', type: 'string' }, { field: 'subtitle', type: 'string' }, { field: 'tagline', type: 'string' },
    { field: 'intro_heading', type: 'string' }, { field: 'intro_body', type: 'text' }, { field: 'reasons', type: 'json' },
    { field: 'differentiators', type: 'json' }, { field: 'stats', type: 'json' }, { field: 'testimonial_quote', type: 'text' },
    { field: 'testimonial_body', type: 'text' }, { field: 'testimonial_attribution', type: 'string' }, { field: 'cta_heading', type: 'string' },
    { field: 'cta_description', type: 'text' }, { field: 'cta_primary_label', type: 'string' }, { field: 'cta_primary_link', type: 'string' },
    { field: 'cta_secondary_label', type: 'string' }, { field: 'cta_secondary_link', type: 'string' }
  ], 'web');

  await createTranslatedCollection('Page_Solicitud_Apoyo', 'Page Solicitud Apoyo', true, [
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } }
  ], [
    { field: 'title', type: 'string' }, { field: 'subtitle', type: 'string' }, { field: 'tagline', type: 'string' },
    { field: 'requirements', type: 'json' }, { field: 'documentation_heading', type: 'string' }, { field: 'documentation_sections', type: 'json' },
    { field: 'contacts', type: 'json' }, { field: 'process_timeline_steps', type: 'json' }
  ], 'web');

  // 3. SHARED DYNAMIC COLLECTIONS
  await createTranslatedCollection('Categorias', 'Categorías', false, [
    { field: 'key', type: 'string' }, { field: 'color_theme', type: 'string' }
  ], [
    { field: 'label', type: 'string' }
  ], 'category');

  await createTranslatedCollection('Eventos', 'Eventos', false, [
    { field: 'imagen', type: 'uuid', meta: { interface: 'file-image' } }, { field: 'fecha', type: 'date' },
    { field: 'categoria_id', type: 'uuid' }, { field: 'color_theme', type: 'string' }
  ], [
    { field: 'title', type: 'string' }, { field: 'month', type: 'string' }, { field: 'description', type: 'text' }, { field: 'slug', type: 'string' }
  ], 'event');

  await createTranslatedCollection('Noticias', 'Noticias (Blog)', false, [
    { field: 'imagen', type: 'uuid', meta: { interface: 'file-image' } }, { field: 'fecha', type: 'date' }, { field: 'categoria_id', type: 'uuid' }
  ], [
    { field: 'title', type: 'string' }, { field: 'excerpt', type: 'text' }, { field: 'body_text', type: 'text', meta: { interface: 'input-rich-text-html' } },
    { field: 'slug', type: 'string' }
  ], 'article');

  await createTranslatedCollection('Puntos_Interes', 'Puntos de Interés', false, [
    { field: 'x', type: 'float' }, { field: 'y', type: 'float' }, { field: 'categoria_id', type: 'uuid' }
  ], [
    { field: 'name', type: 'string' }, { field: 'description', type: 'text' }, { field: 'hours', type: 'string' }, { field: 'price', type: 'string' }
  ], 'place');

  await createTranslatedCollection('Recorridos', 'Recorridos', false, [
    { field: 'numero_ruta', type: 'string' }, { field: 'duracion', type: 'string' }, { field: 'imagen', type: 'uuid', meta: { interface: 'file-image' } }
  ], [
    { field: 'title', type: 'string' }, { field: 'description', type: 'text' }, { field: 'stops', type: 'json' }
  ], 'route');

  // No translations for Aerolineas
  await createTranslatedCollection('Aerolineas', 'Aerolineas', false, [
    { field: 'logo', type: 'uuid', meta: { interface: 'file-image' } }, { field: 'nombre', type: 'string' }
  ], [], 'flight');

  await createTranslatedCollection('Destinos_Internacionales', 'Destinos Internacionales', false, [
    { field: 'airport_code', type: 'string' }
  ], [
    { field: 'ciudad', type: 'string' }, { field: 'pais', type: 'string' }
  ], 'public');

  console.log('Schema setup finished!');
  process.exit(0);
}

setupSchema().catch(console.error);
