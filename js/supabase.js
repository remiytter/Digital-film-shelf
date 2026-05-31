const SUPABASE_URL = "https://mcoyglfgurcsxlgpjpwv.supabase.co";
const SUPABASE_KEY = "sb_publishable_JZEV0USYE4KXHatrpRwL1A_4IUjZgfK";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase connected");