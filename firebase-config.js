// إعداد Firebase للمزامنة التلقائية
// يجب تحديث هذه القيم بمعلومات مشروع Firebase الخاص بك

// إعدادات Firebase من Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDs78nl3dPYZ-KaSb3qS4rb7i6X_DaNxmg",
    authDomain: "banzeen-97eae.firebaseapp.com",
    projectId: "banzeen-97eae",
    storageBucket: "banzeen-97eae.firebasestorage.app",
    messagingSenderId: "147221069949",
    appId: "1:147221069949:web:735cbf7cc0fb1e2f3cb114",
    measurementId: "G-TEJV4TG9RB"
};

// تهيئة Firebase
let firebaseDb = null;

// التحقق من إعداد Firebase
function isFirebaseConfigured() {
    return firebaseConfig.apiKey && 
           firebaseConfig.apiKey !== "YOUR_API_KEY" &&
           firebaseConfig.projectId && 
           firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

// تهيئة Firebase و Firestore
function initFirebase() {
    if (!isFirebaseConfigured()) {
        console.warn("Firebase not configured");
        return null;
    }
    
    if (!firebaseDb) {
        try {
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                if (!firebase.apps || firebase.apps.length === 0) {
                    firebase.initializeApp(firebaseConfig);
                }
                firebaseDb = firebase.firestore();
                console.log("Firebase initialized successfully");
                return firebaseDb;
            } else {
                console.warn("Firebase SDK not loaded yet");
                return null;
            }
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            return null;
        }
    }
    
    return firebaseDb;
}

// جعل Firebase متاحاً عالمياً
if (typeof window !== 'undefined') {
    window.isFirebaseConfigured = isFirebaseConfigured;
    window.initFirebase = initFirebase;
    window.getFirebaseDb = function() {
        if (!firebaseDb) {
            firebaseDb = initFirebase();
        }
        return firebaseDb;
    };
}

// تهيئة عند التحميل
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (isFirebaseConfigured()) {
            initFirebase();
        }
    });
} else if (typeof window !== 'undefined') {
    if (isFirebaseConfigured()) {
        initFirebase();
    }
}
