import { createClient } from '@supabase/supabase-js';

// Obtenemos las credenciales desde las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Creamos el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);