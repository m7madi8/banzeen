// نظام المصادقة

// المفاتيح في localStorage
const AUTH_KEY = "user_auth";
const USER_KEY = "username";
const PASS_KEY = "password_hash";
const INIT_KEY = "system_initialized";

// بيانات المستخدم الافتراضية
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "00001111";

// دالة hash بسيطة (لأغراض العرض فقط - ليست آمنة 100%)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
}

// حفظ بيانات المستخدم
function saveUser(username, password) {
    localStorage.setItem(USER_KEY, username);
    localStorage.setItem(PASS_KEY, simpleHash(password));
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(INIT_KEY, "true");
}

// تهيئة النظام بالمستخدم الافتراضي
function initializeDefaultUser() {
    if (!localStorage.getItem(INIT_KEY)) {
        saveUser(DEFAULT_USERNAME, DEFAULT_PASSWORD);
        return true;
    }
    return false;
}

// التحقق من بيانات المستخدم
function verifyUser(username, password) {
    const savedUsername = localStorage.getItem(USER_KEY);
    const savedPasswordHash = localStorage.getItem(PASS_KEY);
    
    if (!savedUsername || !savedPasswordHash) {
        return false;
    }
    
    return savedUsername === username && savedPasswordHash === simpleHash(password);
}

// التحقق من تسجيل الدخول
function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === "true";
}

// تسجيل الدخول
function login(username, password) {
    if (!username || !password) {
        return { success: false, message: "الرجاء إدخال اسم المستخدم وكلمة المرور" };
    }
    
    // تهيئة المستخدم الافتراضي إذا لم يكن موجوداً
    initializeDefaultUser();
    
    // التحقق من البيانات
    if (verifyUser(username, password)) {
        localStorage.setItem(AUTH_KEY, "true");
        return { success: true, message: "تم تسجيل الدخول بنجاح" };
    } else {
        return { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" };
    }
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "login.html";
}

// جعل دالة logout متاحة عالمياً
window.logout = logout;

// عرض رسالة خطأ
function showLoginError(message) {
    const errorDiv = document.getElementById("loginErrorMessage");
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove("hidden");
        
        const successDiv = document.getElementById("loginSuccessMessage");
        if (successDiv) successDiv.classList.add("hidden");
        
        setTimeout(() => {
            errorDiv.classList.add("hidden");
        }, 5000);
    }
}

// عرض رسالة نجاح
function showLoginSuccess(message) {
    const successDiv = document.getElementById("loginSuccessMessage");
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.remove("hidden");
        
        const errorDiv = document.getElementById("loginErrorMessage");
        if (errorDiv) errorDiv.classList.add("hidden");
    }
}

// معالجة تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    
    const result = login(username, password);
    
    if (result.success) {
        showLoginSuccess(result.message);
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } else {
        showLoginError(result.message);
    }
}

// إظهار/إخفاء كلمة المرور
function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.querySelector(".toggle-password");
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleBtn.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        toggleBtn.textContent = "👁️";
    }
}

// التحقق من المصادقة قبل تحميل الصفحة
function checkAuth() {
    // إذا كنا في صفحة تسجيل الدخول، لا نحتاج للتحقق
    if (window.location.pathname.includes("login.html")) {
        // إذا كان المستخدم مسجل دخول بالفعل، إعادة توجيه للصفحة الرئيسية
        if (isLoggedIn()) {
            window.location.href = "index.html";
        }
        return;
    }
    
    // إذا لم يكن المستخدم مسجل دخول، إعادة توجيه لصفحة تسجيل الدخول
    if (!isLoggedIn()) {
        window.location.href = "login.html";
    }
}

// تهيئة النظام عند التحميل
initializeDefaultUser();

// إضافة إمكانية الضغط على Enter لتسجيل الدخول
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        checkAuth();
        setupEnterKey();
    });
} else {
    checkAuth();
    setupEnterKey();
}

function setupEnterKey() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    
    if (usernameInput && passwordInput) {
        [usernameInput, passwordInput].forEach(input => {
            if (input) {
                input.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        const form = document.getElementById("loginForm");
                        if (form) {
                            handleLogin(e);
                        }
                    }
                });
            }
        });
    }
}

