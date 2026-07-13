import { createDirectus, rest, authentication, readCollections, updateCollection, readFields, updateField } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

const translationDictionary = {
  "status": "Estado",
  "translations": "Traducciones",
  "hero_image": "Imagen Principal",
  "coordinates": "Coordenadas",
  "hero_tagline": "Etiqueta Principal",
  "hero_headline_line1": "Título Principal (Línea 1)",
  "hero_headline_line2": "Título Principal (Línea 2)",
  "hero_body_text": "Cuerpo de Texto Principal",
  "hero_cta_primary_label": "Botón Principal (Texto)",
  "hero_cta_primary_href": "Botón Principal (Enlace)",
  "hero_cta_secondary_label": "Botón Secundario (Texto)",
  "hero_cta_secondary_href": "Botón Secundario (Enlace)",
  
  "kinetic_marquee_line1": "Marquesina Dinámica (Línea 1)",
  "kinetic_marquee_line2": "Marquesina Dinámica (Línea 2)",
  "kinetic_section_label": "Etiqueta Sección Dinámica",
  "kinetic_heading_line1": "Título Dinámico (Línea 1)",
  "kinetic_heading_line2_stroke": "Título Dinámico (Contorno)",
  "kinetic_body_paragraph": "Párrafo Dinámico",
  "kinetic_stats": "Estadísticas Dinámicas",
  "experiences_section_label": "Etiqueta Sección Experiencias",
  "experiences_heading_line1": "Título Experiencias (Línea 1)",
  "experiences_heading_line2_stroke": "Título Experiencias (Contorno)",
  "experiences_description": "Descripción de Experiencias",
  "recorridos_section_label": "Etiqueta Sección Recorridos",
  "recorridos_heading_line1": "Título Recorridos (Línea 1)",
  "recorridos_heading_line2_stroke": "Título Recorridos (Contorno)",
  "events_section_label": "Etiqueta Sección Eventos",
  "events_heading_line1": "Título Eventos (Línea 1)",
  "events_heading_line2_stroke": "Título Eventos (Contorno)",
  "mice_section_label": "Etiqueta Sección Negocios",
  "mice_heading": "Título Turismo MICE",
  "mice_description": "Descripción Turismo MICE",
  "mice_stats": "Estadísticas MICE",
  "mice_services": "Servicios MICE",
  "mice_amenities": "Comodidades MICE",
  "mice_cta_label": "Botón MICE (Texto)",
  "mice_cta_href": "Botón MICE (Enlace)",
  "trip_section_label": "Etiqueta Sección Viaje",
  "trip_heading_line1": "Título Viaje (Línea 1)",
  "trip_heading_line2_stroke": "Título Viaje (Contorno)",
  "trip_quick_info": "Información Rápida de Viaje",
  "trip_transport": "Transporte de Viaje",
  "trip_connections_banner_title": "Título Banner Conexiones",
  "trip_connections_banner_subtitle": "Subtítulo Banner Conexiones",
  "trip_connections_banner_image": "Imagen Banner Conexiones",
  "trip_connections_banner_stats": "Estadísticas de Conexiones",

  "hero_title": "Título Principal",
  "hero_subtitle": "Subtítulo Principal",
  "intro_label": "Etiqueta de Introducción",
  "intro_heading": "Título de Introducción",
  "intro_paragraphs": "Párrafos de Introducción",
  "cards": "Tarjetas",
  "stats": "Estadísticas",

  "title": "Título",
  "subtitle": "Subtítulo",
  "tagline": "Etiqueta",
  "info_cards": "Tarjetas de Información",
  "gateway_banner_icon": "Icono Banner Aeropuerto",
  "gateway_banner_label": "Etiqueta Banner Aeropuerto",
  "gateway_banner_heading": "Título Banner Aeropuerto",
  "gateway_banner_body": "Cuerpo Banner Aeropuerto",
  "gateway_banner_connections": "Conexiones Banner Aeropuerto",
  "visa_info": "Información de Visado",
  "important_note": "Nota Importante",
  "climate_label": "Etiqueta de Clima",
  "climate_heading": "Título de Clima",
  "climate_description": "Descripción de Clima",
  "climate_seasons": "Temporadas de Clima",

  "airport_stats": "Estadísticas Aeropuerto",
  "airport_info_heading": "Título Info Aeropuerto",
  "airport_info_details": "Detalles Info Aeropuerto",
  "terminal_terrestre_heading": "Título Terminal Terrestre",
  "terminal_terrestre_body": "Cuerpo Terminal Terrestre",
  "terminal_terrestre_hours": "Horarios Terminal Terrestre",
  "terminal_terrestre_routes": "Rutas Terminal Terrestre",
  "terminal_terrestre_tip": "Consejo Terminal Terrestre",

  "metrovia_heading": "Título Metrovía",
  "metrovia_description": "Descripción Metrovía",
  "metrovia_schedule": "Horarios Metrovía",
  "metrovia_tip": "Consejo Metrovía",
  "metrovia_stat_number": "Número Estadística Metrovía",
  "metrovia_stat_subtitle": "Subtítulo Estadística Metrovía",
  "aerovia_heading": "Título Aerovía",
  "aerovia_description": "Descripción Aerovía",
  "aerovia_schedule": "Horarios Aerovía",
  "aerovia_tip": "Consejo Aerovía",
  "aerovia_stat_number": "Número Estadística Aerovía",
  "aerovia_stat_subtitle": "Subtítulo Estadística Aerovía",
  "aerovia_stations": "Estaciones Aerovía",
  "terminal_terrestre_cards": "Tarjetas Terminal Terrestre",
  "quick_tips": "Consejos Rápidos",

  "cta_heading": "Título Botón Acción",
  "cta_description": "Descripción Botón Acción",
  "cta_label": "Texto Botón Acción",
  "cta_link": "Enlace Botón Acción",
  "services": "Servicios",
  "sub_page_cards": "Tarjetas Subpágina",
  "quienes_somos_paragraphs": "Párrafos Quiénes Somos",
  "mission_icon": "Icono Misión",
  "mission_heading": "Título Misión",
  "mission_body": "Cuerpo Misión",
  "objectives": "Objetivos",
  "activities": "Actividades",
  "service_help_cards": "Tarjetas Ayuda Servicio",

  "intro_body": "Cuerpo de Introducción",
  "reasons": "Razones",
  "differentiators": "Diferenciadores",
  "testimonial_quote": "Cita Testimonial",
  "testimonial_body": "Cuerpo Testimonial",
  "testimonial_attribution": "Atribución Testimonial",
  "cta_primary_label": "Texto Botón Primario",
  "cta_primary_link": "Enlace Botón Primario",
  "cta_secondary_label": "Texto Botón Secundario",
  "cta_secondary_link": "Enlace Botón Secundario",

  "requirements": "Requisitos",
  "documentation_heading": "Título Documentación",
  "documentation_sections": "Secciones Documentación",
  "contacts": "Contactos",
  "process_timeline_steps": "Pasos Cronograma Proceso",

  "vuelos_semanales": "Vuelos Semanales",
  "logo_text": "Texto del Logo",
  "logo_subtitle": "Subtítulo del Logo",
  "footer_headline": "Título Pie de Página",
  "footer_copyright": "Derechos de Autor Pie de Página",

  "key": "Clave",
  "color_theme": "Tema de Color",
  "label": "Etiqueta",
  "imagen": "Imagen",
  "fecha": "Fecha",
  "categoria_id": "Categoría",
  "title": "Título",
  "month": "Mes",
  "description": "Descripción",
  "slug": "Identificador (Slug)",
  "excerpt": "Extracto",
  "body_text": "Cuerpo de Texto",
  "x": "Coordenada X",
  "y": "Coordenada Y",
  "name": "Nombre",
  "hours": "Horarios",
  "price": "Precio",
  "numero_ruta": "Número de Ruta",
  "duracion": "Duración",
  "stops": "Paradas",
  "logo": "Logo",
  "nombre": "Nombre",
  "airport_code": "Código Aeropuerto",
  "ciudad": "Ciudad",
  "pais": "País",
  
  "id": "ID",
  "languages_code": "Código Idioma"
};

function formatFallback(key) {
  return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function run() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });

  // 1. UPDATE COLLECTIONS
  const collections = await client.request(readCollections());
  for (const c of collections) {
    if (c.meta && c.collection.startsWith('Page_')) {
      // Remove 'Page_' and format nicely (e.g. Page_Descubre_GYE -> Descubre GYE)
      const newName = c.collection.replace(/^Page_/, '').replace(/_/g, ' ');
      await client.request(updateCollection(c.collection, { 
        meta: { 
          translations: [
            { language: 'en-US', translation: newName },
            { language: 'es-ES', translation: newName },
            { language: 'es-419', translation: newName },
            { language: 'es', translation: newName }
          ]
        } 
      }));
      console.log(`Updated collection name: ${c.collection} -> ${newName}`);
    }
  }

  // 2. UPDATE FIELDS (SORT & TRANSLATIONS)
  const fields = await client.request(readFields());
  
  for (const f of fields) {
    if (f.collection.startsWith('directus_')) continue;
    if (!f.meta) continue;
    
    let updates = {};

    // Apply translations
    const t = translationDictionary[f.field] || formatFallback(f.field);
    updates.translations = [
      { language: 'en-US', translation: t },
      { language: 'es-ES', translation: t },
      { language: 'es-419', translation: t },
      { language: 'es', translation: t }
    ];

    // Reorder fields if it's a base collection
    if (f.collection.startsWith('Page_') && !f.collection.endsWith('_translations')) {
      if (f.field === 'status') updates.sort = 1;
      else if (f.field === 'hero_image') updates.sort = 2;
      else if (f.field === 'coordinates') updates.sort = 3;
      else if (f.meta && f.meta.interface === 'presentation-divider') updates.sort = 4;
      else if (f.field === 'translations') updates.sort = 5;
    }

    try {
      await client.request(updateField(f.collection, f.field, { meta: updates }));
    } catch (e) {
      console.log(`Failed to update field ${f.collection}.${f.field}:`, e.errors?.[0]?.message || e);
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
