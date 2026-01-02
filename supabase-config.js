// إعداد Supabase للمزامنة التلقائية
// يجب تحديث هذه القيم بمعلومات مشروع Supabase الخاص بك

// إعدادات Supabase - يجب تحديثها
const SUPABASE_URL = "https://yuxwerlbvwtjnmqftgie.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__BomvcuctbKDPk85KRbU1A_1lBWj1HJ";

// تهيئة Supabase
let supabaseClient = null;

// التحقق من إعداد Supabase
function isSupabaseConfigured() {
    return SUPABASE_URL !== "https://yuxwerlbvwtjnmqftgie.supabase.co" && 
           SUPABASE_ANON_KEY !== "sb_publishable__BomvcuctbKDPk85KRbU1A_1lBWj1HJ" &&
           SUPABASE_URL.length > 0 &&
           SUPABASE_ANON_KEY.length > 0;
}

// تهيئة Supabase Client
function initSupabase() {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return null;
    }
    
    if (!supabaseClient) {
        try {
            // التحقق من وجود Supabase SDK
            if (typeof supabase !== 'undefined' && supabase.createClient) {
                supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log("Supabase initialized successfully");
                return supabaseClient;
            } else {
                console.warn("Supabase SDK not loaded yet");
                return null;
            }
        } catch (error) {
            console.error("Error initializing Supabase:", error);
            return null;
        }
    }
    
    return supabaseClient;
}

// جعل Supabase متاحاً عالمياً
if (typeof window !== 'undefined') {
    window.isSupabaseConfigured = isSupabaseConfigured;
    window.initSupabase = initSupabase;
    window.getSupabaseClient = function() {
        if (!supabaseClient) {
            supabaseClient = initSupabase();
        }
        return supabaseClient;
    };
}

// تهيئة عند التحميل
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (isSupabaseConfigured()) {
            initSupabase();
        }
    });
} else if (typeof window !== 'undefined') {
    if (isSupabaseConfigured()) {
        initSupabase();
    }
}

