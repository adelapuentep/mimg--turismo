import { createDirectus, rest, authentication, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

const repeaterMappings = {
  // Page_Home_translations
  'Page_Home_translations': {
    'trip_connections_banner_stats': [
      { field: 'value', type: 'string', name: 'Valor', meta: { interface: 'input' } },
      { field: 'label', type: 'string', name: 'Etiqueta', meta: { interface: 'input' } }
    ]
  },

  // Page_Descubre_GYE_translations
  'Page_Descubre_GYE_translations': {
    'intro_paragraphs': [
      { field: 'paragraph', type: 'string', name: 'Párrafo', meta: { interface: 'input-multiline' } }
    ],
    'cards': [
      { field: 'title', type: 'string', name: 'Título', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } },
      { field: 'icon_name', type: 'string', name: 'Icono (Nombre)', meta: { interface: 'input' } },
      { field: 'link_path', type: 'string', name: 'Enlace', meta: { interface: 'input' } },
      { field: 'color_theme', type: 'string', name: 'Tema de Color', meta: { interface: 'input' } }
    ],
    'stats': [
      { field: 'number', type: 'string', name: 'Número/Valor', meta: { interface: 'input' } },
      { field: 'label', type: 'string', name: 'Etiqueta', meta: { interface: 'input' } }
    ]
  },
  
  // Page_Informacion_Util_translations
  'Page_Informacion_Util_translations': {
    'info_cards': [
      { field: 'icon_name', type: 'string', name: 'Icono', meta: { interface: 'input' } },
      { field: 'label', type: 'string', name: 'Etiqueta', meta: { interface: 'input' } },
      { field: 'value', type: 'string', name: 'Valor', meta: { interface: 'input' } },
      { field: 'color_theme', type: 'string', name: 'Tema de Color', meta: { interface: 'input' } }
    ],
    'gateway_banner_connections': [
      { field: 'distance', type: 'string', name: 'Distancia/Duración', meta: { interface: 'input' } },
      { field: 'location', type: 'string', name: 'Ubicación', meta: { interface: 'input' } }
    ],
    'visa_info': [
      { field: 'type', type: 'string', name: 'Tipo de Visa', meta: { interface: 'input' } },
      { field: 'countries', type: 'string', name: 'Países aplicables', meta: { interface: 'input' } },
      { field: 'duration', type: 'string', name: 'Duración permitida', meta: { interface: 'input' } }
    ],
    'climate_seasons': [
      { field: 'name', type: 'string', name: 'Temporada', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } }
    ]
  },

  // Page_Como_Llegar_translations
  'Page_Como_Llegar_translations': {
    'airport_stats': [
      { field: 'value', type: 'string', name: 'Valor', meta: { interface: 'input' } },
      { field: 'label', type: 'string', name: 'Etiqueta', meta: { interface: 'input' } }
    ],
    'airport_info_details': [
      { field: 'label', type: 'string', name: 'Etiqueta', meta: { interface: 'input' } },
      { field: 'value', type: 'string', name: 'Valor', meta: { interface: 'input' } }
    ]
  },

  // Page_Movilidad_translations
  'Page_Movilidad_translations': {
    'metrovia_schedule': [
      { field: 'label', type: 'string', name: 'Días', meta: { interface: 'input' } },
      { field: 'value', type: 'string', name: 'Horario', meta: { interface: 'input' } }
    ],
    'aerovia_schedule': [
      { field: 'label', type: 'string', name: 'Días', meta: { interface: 'input' } },
      { field: 'value', type: 'string', name: 'Horario', meta: { interface: 'input' } }
    ],
    'aerovia_stations': [
      { field: 'name', type: 'string', name: 'Nombre Estación', meta: { interface: 'input' } },
      { field: 'details', type: 'string', name: 'Detalles', meta: { interface: 'input-multiline' } }
    ],
    'terminal_terrestre_cards': [
      { field: 'title', type: 'string', name: 'Título', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } },
      { field: 'icon_name', type: 'string', name: 'Icono', meta: { interface: 'input' } }
    ],
    'quick_tips': [
      { field: 'icon_name', type: 'string', name: 'Icono', meta: { interface: 'input' } },
      { field: 'text', type: 'string', name: 'Consejo', meta: { interface: 'input-multiline' } }
    ]
  },

  // Page_Turismo_MICE_translations
  'Page_Turismo_MICE_translations': {
    'intro_paragraphs': [
      { field: 'paragraph', type: 'string', name: 'Párrafo', meta: { interface: 'input-multiline' } }
    ],
    'stats': [
      { field: 'value', type: 'string', name: 'Valor', meta: { interface: 'input' } },
      { field: 'label', type: 'string', name: 'Etiqueta', meta: { interface: 'input' } }
    ],
    'services': [
      { field: 'icon_name', type: 'string', name: 'Icono', meta: { interface: 'input' } },
      { field: 'title', type: 'string', name: 'Título', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } },
      { field: 'color_theme', type: 'string', name: 'Tema de Color', meta: { interface: 'input' } }
    ],
    'sub_page_cards': [
      { field: 'title', type: 'string', name: 'Título', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } },
      { field: 'icon_name', type: 'string', name: 'Icono', meta: { interface: 'input' } },
      { field: 'link_path', type: 'string', name: 'Enlace', meta: { interface: 'input' } }
    ]
  },

  // Page_Buro_Convenciones_translations
  'Page_Buro_Convenciones_translations': {
    'quienes_somos_paragraphs': [
      { field: 'paragraph', type: 'string', name: 'Párrafo', meta: { interface: 'input-multiline' } }
    ],
    'objectives': [
      { field: 'text', type: 'string', name: 'Objetivo', meta: { interface: 'input-multiline' } }
    ],
    'activities': [
      { field: 'title', type: 'string', name: 'Actividad', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } }
    ],
    'service_help_cards': [
      { field: 'title', type: 'string', name: 'Servicio', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } },
      { field: 'icon_name', type: 'string', name: 'Icono', meta: { interface: 'input' } }
    ]
  },

  // Page_Razones_Guayaquil_translations
  'Page_Razones_Guayaquil_translations': {
    'reasons': [
      { field: 'title', type: 'string', name: 'Razón', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } },
      { field: 'icon_name', type: 'string', name: 'Icono', meta: { interface: 'input' } }
    ],
    'differentiators': [
      { field: 'title', type: 'string', name: 'Diferenciador', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } }
    ],
    'stats': [
      { field: 'value', type: 'string', name: 'Valor', meta: { interface: 'input' } },
      { field: 'label', type: 'string', name: 'Etiqueta', meta: { interface: 'input' } }
    ]
  },

  // Page_Solicitud_Apoyo_translations
  'Page_Solicitud_Apoyo_translations': {
    'requirements': [
      { field: 'title', type: 'string', name: 'Requisito', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } }
    ],
    'documentation_sections': [
      { field: 'title', type: 'string', name: 'Sección', meta: { interface: 'input' } },
      { field: 'details', type: 'string', name: 'Detalles/Requisitos', meta: { interface: 'input-multiline' } }
    ],
    'contacts': [
      { field: 'role', type: 'string', name: 'Cargo/Rol', meta: { interface: 'input' } },
      { field: 'name', type: 'string', name: 'Nombre', meta: { interface: 'input' } },
      { field: 'email', type: 'string', name: 'Email', meta: { interface: 'input' } },
      { field: 'phone', type: 'string', name: 'Teléfono', meta: { interface: 'input' } }
    ],
    'process_timeline_steps': [
      { field: 'step_number', type: 'string', name: 'Paso #', meta: { interface: 'input' } },
      { field: 'title', type: 'string', name: 'Título Paso', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } }
    ]
  },

  // Recorridos_translations
  'Recorridos_translations': {
    'stops': [
      { field: 'name', type: 'string', name: 'Nombre de Parada', meta: { interface: 'input' } },
      { field: 'description', type: 'string', name: 'Descripción', meta: { interface: 'input-multiline' } },
      { field: 'image', type: 'uuid', name: 'Imagen', meta: { interface: 'file-image' } }
    ]
  }
};

async function fixAllRepeaters() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });

  for (const [collectionName, fieldsMap] of Object.entries(repeaterMappings)) {
    for (const [fieldName, subFields] of Object.entries(fieldsMap)) {
      try {
        await client.request(updateField(collectionName, fieldName, {
          meta: {
            interface: 'list',
            options: {
              fields: subFields
            }
          }
        }));
        console.log(`Updated ${collectionName}.${fieldName}`);
      } catch (e) {
        console.error(`Failed to update ${collectionName}.${fieldName}:`, e.errors?.[0]?.message || e);
      }
    }
  }
}

fixAllRepeaters().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
