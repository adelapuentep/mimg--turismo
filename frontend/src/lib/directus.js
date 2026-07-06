import { createDirectus, rest } from '@directus/sdk';

const directusUrl = import.meta.env.PUBLIC_DIRECTUS_URL || 'http://localhost:8505';

export const directus = createDirectus(directusUrl).with(rest());
