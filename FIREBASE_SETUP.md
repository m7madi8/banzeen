# تعليمات إعداد المزامنة التلقائية مع Firebase

## الخطوة 1: إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اضغط على "Add project" (أضف مشروع)
3. أدخل اسم المشروع (مثلاً: "debt-management")
4. اتبع التعليمات لإكمال إنشاء المشروع

## الخطوة 2: إعداد Firestore Database

1. من القائمة الجانبية، اختر "Firestore Database"
2. اضغط على "Create database"
3. اختر "Start in test mode" (للبداية السريعة)
4. اختر موقع قاعدة البيانات (أقرب موقع لمنطقتك)

## الخطوة 3: الحصول على إعدادات Firebase

1. من صفحة المشروع، اضغط على ⚙️ (الإعدادات) → "Project settings"
2. انتقل إلى تبويب "General"
3. ابحث عن قسم "Your apps" واختر "</>" (Web)
4. أدخل اسم التطبيق (مثلاً: "Debt Management")
5. انسخ إعدادات Firebase Config

## الخطوة 4: تحديث ملف firebase-config.js

افتح ملف `firebase-config.js` واستبدل القيم في `firebaseConfig`:

```javascript
const firebaseConfig = {
    apiKey: "ضع_API_KEY_هنا",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "ضع_PROJECT_ID_هنا",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "ضع_MESSAGING_SENDER_ID_هنا",
    appId: "ضع_APP_ID_هنا"
};
```

> استبدل `YOUR_PROJECT_ID` بـ **Project ID** من إعدادات المشروع.

## الخطوة 5: إعداد قواعد الأمان (Security Rules)

1. من Firestore Database، اختر تبويب "Rules"
2. استبدل القواعد الحالية بهذه:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clients/main {
      allow read, write: if true; // للبداية - يمكن تقييدها لاحقاً
    }
  }
}
```

3. اضغط "Publish"

## الخطوة 6: اختبار المزامنة

1. افتح الموقع في متصفحين مختلفين أو جهازين مختلفين
2. سجّل الدخول في كليهما
3. أضف عميل في المتصفح الأول
4. ستظهر البيانات تلقائياً في المتصفح الثاني خلال ثوانٍ!

## ملاحظات مهمة:

- ✅ البيانات تُحفظ محلياً أولاً (للاستمرار في العمل بدون إنترنت)
- ✅ ثم تُرفع تلقائياً لـ Firebase
- ✅ أي تغيير في أي جهاز يظهر على جميع الأجهزة فوراً
- ✅ النسخ المحلية تعمل كنسخ احتياطية

## الأمان:

لزيادة الأمان لاحقاً، يمكنك:
1. إضافة نظام المصادقة في Firebase
2. تحديث قواعد الأمان لتقييد الوصول
3. تشفير البيانات قبل رفعها

---

**بعد إكمال الإعداد، ستعمل المزامنة التلقائية بين جميع الأجهزة! 🎉**

