import { createDirectus, rest, authentication, updateSingleton } from '@directus/sdk';

const DIRECTUS_URL = 'http://127.0.0.1:8505';
const EMAIL = 'admin@turismo.gov.ec';
const PASSWORD = 'admin';

async function seedGlobalSettings() {
  const client = createDirectus(DIRECTUS_URL).with(rest()).with(authentication());
  await client.login({ email: EMAIL, password: PASSWORD });
  
  console.log('Checking Global_Settings...');
  try {
    const settings = await client.request(() => ({
      method: 'GET',
      path: '/items/Global_Settings?fields=*,translations.*'
    }));
    
    console.log('Current Global_Settings:', JSON.stringify(settings));
    
    // If translations are missing, let's seed them!
    if (!settings || !settings.translations || settings.translations.length === 0) {
      console.log('Global_Settings is empty. Seeding...');
      await client.request(updateSingleton('Global_Settings', {
        vuelos_semanales: 200,
        logo_text: "GYE",
        logo_subtitle: "Guayaquil",
        translations: [
          {
            languages_code: "es",
            footer_headline: "Tu próxima aventura empieza aquí.",
            footer_copyright: "GAD Municipal de Guayaquil"
          },
          {
            languages_code: "en",
            footer_headline: "Your next adventure begins here.",
            footer_copyright: "GAD Municipal de Guayaquil"
          }
        ]
      }));
      console.log('Seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding Global_Settings:', error);
  }
}

seedGlobalSettings().catch(console.error);
