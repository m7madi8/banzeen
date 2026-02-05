// لا حاجة لحفظ الدالة - سنستخدم الطريقة المباشرة

// البيانات والمتغيرات
let clients = JSON.parse(localStorage.getItem("clients")) || [];
let currentIndex = null;

// العناصر الأساسية
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const amountInput = document.getElementById("amount");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("search");
const modal = document.getElementById("modal");
const errorMessage = document.getElementById("errorMessage");

// إعداد الأحداث
addBtn.addEventListener("click", addClient);
searchInput.addEventListener("input", debounce(renderClients, 300));

// إمكانية الإضافة بالضغط على Enter
[nameInput, phoneInput, amountInput].forEach(input => {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addClient();
    });
});

// إغلاق Modal بالضغط على ESC أو النقر خارجها
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

// تنسيق التاريخ
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// دالة تأخير للبحث
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// عرض رسالة خطأ
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    setTimeout(() => {
        errorMessage.classList.add("hidden");
    }, 5000);
}

// عرض رسالة نجاح
function showSuccess(message) {
    const successMsg = document.createElement("div");
    successMsg.className = "success-message";
    successMsg.textContent = message;
    document.querySelector(".card").insertBefore(successMsg, nameInput);
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

// ==================== نوافذ التأكيد المخصصة ====================

// دالة confirm مخصصة
function customConfirm(message, title = "تأكيد العملية") {
    return new Promise((resolve) => {
        const confirmModal = document.getElementById("confirmModal");
        const confirmTitle = document.getElementById("confirmTitle");
        const confirmMessage = document.getElementById("confirmMessage");
        const confirmOk = document.getElementById("confirmOk");
        const confirmCancel = document.getElementById("confirmCancel");

        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        
        confirmModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";

        const handleOk = () => {
            confirmModal.classList.add("hidden");
            document.body.style.overflow = "";
            confirmOk.removeEventListener("click", handleOk);
            confirmCancel.removeEventListener("click", handleCancel);
            resolve(true);
        };

        const handleCancel = () => {
            confirmModal.classList.add("hidden");
            document.body.style.overflow = "";
            confirmOk.removeEventListener("click", handleOk);
            confirmCancel.removeEventListener("click", handleCancel);
            resolve(false);
        };

        confirmOk.addEventListener("click", handleOk);
        confirmCancel.addEventListener("click", handleCancel);

        // إغلاق عند النقر خارج النافذة
        const handleOutsideClick = (e) => {
            if (e.target === confirmModal) {
                handleCancel();
                confirmModal.removeEventListener("click", handleOutsideClick);
            }
        };
        confirmModal.addEventListener("click", handleOutsideClick);

        // إغلاق عند الضغط على ESC
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                handleCancel();
                document.removeEventListener("keydown", handleEsc);
            }
        };
        document.addEventListener("keydown", handleEsc);
    });
}

// دالة prompt مخصصة
function customPrompt(label, placeholder = "", defaultValue = "", inputType = "text") {
    return new Promise((resolve) => {
        const inputModal = document.getElementById("inputModal");
        const inputTitle = document.getElementById("inputTitle");
        const inputLabel = document.getElementById("inputLabel");
        const inputValue = document.getElementById("inputValue");
        const inputOk = document.getElementById("inputOk");
        const inputCancel = document.getElementById("inputCancel");

        inputLabel.textContent = label;
        inputValue.placeholder = placeholder;
        inputValue.value = defaultValue;
        inputValue.type = inputType;
        
        inputModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        inputValue.focus();
        inputValue.select();

        const handleOk = () => {
            const value = inputValue.value.trim();
            inputModal.classList.add("hidden");
            document.body.style.overflow = "";
            inputOk.removeEventListener("click", handleOk);
            inputCancel.removeEventListener("click", handleCancel);
            resolve(value);
        };

        const handleCancel = () => {
            inputModal.classList.add("hidden");
            document.body.style.overflow = "";
            inputOk.removeEventListener("click", handleOk);
            inputCancel.removeEventListener("click", handleCancel);
            resolve(null);
        };

        inputOk.addEventListener("click", handleOk);
        inputCancel.addEventListener("click", handleCancel);

        // إدخال عند الضغط على Enter
        const handleEnter = (e) => {
            if (e.key === "Enter") {
                handleOk();
                inputValue.removeEventListener("keypress", handleEnter);
            }
        };
        inputValue.addEventListener("keypress", handleEnter);

        // إغلاق عند الضغط على ESC
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                handleCancel();
                document.removeEventListener("keydown", handleEsc);
            }
        };
        document.addEventListener("keydown", handleEsc);
    });
}

// دالة alert مخصصة
function customAlert(message, title = "تنبيه") {
    return new Promise((resolve) => {
        const alertModal = document.getElementById("alertModal");
        const alertTitle = document.getElementById("alertTitle");
        const alertMessage = document.getElementById("alertMessage");
        const alertOk = document.getElementById("alertOk");

        alertTitle.textContent = title;
        alertMessage.textContent = message;
        
        alertModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";

        const handleOk = () => {
            alertModal.classList.add("hidden");
            document.body.style.overflow = "";
            alertOk.removeEventListener("click", handleOk);
            resolve();
        };

        alertOk.addEventListener("click", handleOk);

        // إغلاق عند النقر خارج النافذة
        const handleOutsideClick = (e) => {
            if (e.target === alertModal) {
                handleOk();
                alertModal.removeEventListener("click", handleOutsideClick);
            }
        };
        alertModal.addEventListener("click", handleOutsideClick);

        // إغلاق عند الضغط على ESC أو Enter
        const handleKey = (e) => {
            if (e.key === "Escape" || e.key === "Enter") {
                handleOk();
                document.removeEventListener("keydown", handleKey);
            }
        };
        document.addEventListener("keydown", handleKey);
    });
}

// دالة إغلاق نافذة الإدخال
function closeInputModal() {
    const inputModal = document.getElementById("inputModal");
    inputModal.classList.add("hidden");
    document.body.style.overflow = "";
}

// تحديث مؤشر حالة الحفظ
function updateSaveStatus() {
    const lastSaveTime = localStorage.getItem("lastSaveTime");
    const statusElement = document.getElementById("lastSaveTime");
    const syncStatusElement = document.getElementById("syncStatusText");
    
    if (statusElement) {
        if (lastSaveTime) {
            const saveDate = new Date(lastSaveTime);
            const now = new Date();
            const diffMs = now - saveDate;
            const diffMins = Math.floor(diffMs / 60000);
            const diffSecs = Math.floor((diffMs % 60000) / 1000);
            
            if (diffMins < 1) {
                statusElement.textContent = `✅ آخر حفظ: قبل ${diffSecs} ثانية`;
                statusElement.style.color = "var(--secondary)";
            } else if (diffMins < 60) {
                statusElement.textContent = `✅ آخر حفظ: قبل ${diffMins} دقيقة`;
                statusElement.style.color = "var(--secondary)";
            } else {
                const diffHours = Math.floor(diffMins / 60);
                statusElement.textContent = `✅ آخر حفظ: قبل ${diffHours} ساعة`;
                statusElement.style.color = "var(--secondary)";
            }
        } else {
            statusElement.textContent = "⚠️ لم يتم الحفظ بعد";
            statusElement.style.color = "var(--warning)";
        }
    }
    
    // تحديث حالة المزامنة
    if (syncStatusElement) {
        if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
            const lastSync = localStorage.getItem("lastSyncTime");
            if (lastSync) {
                syncStatusElement.textContent = `☁️ متزامن مع السحابة (Firebase)`;
                syncStatusElement.style.color = "var(--secondary)";
            } else {
                syncStatusElement.textContent = `☁️ جاري المزامنة...`;
                syncStatusElement.style.color = "var(--primary)";
            }
        } else {
            syncStatusElement.textContent = `📱 العمل في وضع محلي فقط - قم بإعداد Firebase للمزامنة`;
            syncStatusElement.style.color = "var(--warning)";
        }
    }
}

// حفظ البيانات مع نسخ احتياطي ومزامنة Firebase
async function saveData(skipSync = false) {
    try {
        const dataString = JSON.stringify(clients);
        
        // التحقق من حجم البيانات
        const dataSize = new Blob([dataString]).size;
        const maxSize = 5 * 1024 * 1024; // 5 MB
        
        if (dataSize > maxSize) {
            showError("حجم البيانات كبير جداً! يرجى تصدير البيانات القديمة وحذفها.");
            return false;
        }
        
        // حفظ البيانات محلياً
        localStorage.setItem("clients", dataString);
        
        // حفظ آخر تاريخ تحديث
        const now = new Date().toISOString();
        
        // إنشاء نسخة احتياطية تلقائية (يومية) مع معلومات إضافية
        const today = new Date().toISOString().split('T')[0];
        const backupKey = `clients_backup_${today}`;
        const backupData = {
            clients: clients,
            timestamp: now,
            clientCount: clients.length,
            type: 'auto'
        };
        localStorage.setItem(backupKey, JSON.stringify(backupData));
        localStorage.setItem("lastSaveTime", now);
        
        // حفظ في Firebase للمزامنة التلقائية
        if (!skipSync && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
            try {
                await saveToFirebase(clients, now);
                localStorage.setItem("lastSyncTime", now);
            } catch (firebaseError) {
                console.warn("Firebase save failed, data saved locally only:", firebaseError);
                // نستمر في الحفظ المحلي حتى لو فشل Firebase
            }
        }
        
        // تحديث مؤشر الحفظ
        updateSaveStatus();
        
        // تنظيف النسخ الاحتياطية القديمة (الاحتفاظ بآخر 5 نسخ فقط)
        cleanupOldBackups();
        
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            showError("مساحة التخزين ممتلئة! يرجى تصدير البيانات وحذفها.");
        } else {
            showError("خطأ في حفظ البيانات!");
        }
        console.error("Error saving data:", error);
        return false;
    }
}

// حفظ البيانات في Firebase
async function saveToFirebase(data, timestamp) {
    const db = window.getFirebaseDb && window.getFirebaseDb();
    if (!db) {
        console.warn("Firebase DB not available - skipping cloud save");
        return;
    }
    
    isSavingToFirebase = true;
    try {
        await db.collection('clients').doc('main').set({
            clients: data,
            last_updated: timestamp,
            updated_by: localStorage.getItem("username") || "unknown"
        });
        
        console.log("Data saved to Firebase successfully");
    } catch (error) {
        console.error("Error saving to Firebase:", error);
        throw error;
    } finally {
        isSavingToFirebase = false;
    }
}

// تحميل البيانات من Firebase (من الخادم لتجنب البيانات المخزنة مؤقتاً)
async function loadFromFirebase() {
    const db = window.getFirebaseDb && window.getFirebaseDb();
    if (!db) {
        return null;
    }
    
    try {
        const docRef = db.collection('clients').doc('main');
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return null;
        }
        
        const data = doc.data();
        if (!data || !data.clients || !Array.isArray(data.clients)) {
            return null;
        }
        
        let lastUpdated = data.last_updated || null;
        if (lastUpdated && typeof lastUpdated.toDate === 'function') {
            lastUpdated = lastUpdated.toDate().toISOString();
        } else if (lastUpdated && typeof lastUpdated !== 'string') {
            lastUpdated = String(lastUpdated);
        }
        
        console.log("Data loaded from Firebase");
        return {
            clients: data.clients,
            lastUpdated: lastUpdated
        };
    } catch (error) {
        console.error("Error loading from Firebase:", error);
        return null;
    }
}

// إلغاء الاشتراك في مستمع Firebase (لمنع المستمعين المكررين)
let firebaseUnsubscribe = null;
// علم لتجنّب استبدال البيانات أثناء حفظنا (race condition)
let isSavingToFirebase = false;

// الاستماع للتحديثات التلقائية من Firebase (Real-time)
function setupFirebaseSync() {
    if (!window.isFirebaseConfigured || !window.isFirebaseConfigured()) {
        return;
    }
    
    const db = window.getFirebaseDb && window.getFirebaseDb();
    if (!db) {
        return;
    }
    
    // إلغاء المستمع السابق إن وجد (منع التكرار)
    if (firebaseUnsubscribe && typeof firebaseUnsubscribe === 'function') {
        firebaseUnsubscribe();
        firebaseUnsubscribe = null;
    }
    
    try {
        firebaseUnsubscribe = db.collection('clients').doc('main')
            .onSnapshot((docSnapshot) => {
                if (!docSnapshot.exists) return;
                // تجاهل التحديث أثناء حفظنا لتفادي استبدال بياناتنا بقديمة
                if (isSavingToFirebase) return;
                
                const data = docSnapshot.data();
                if (!data || !data.clients) return;
                
                // تحويل Firestore Timestamp إلى ISO string للمقارنة
                let remoteLastUpdate = data.last_updated;
                if (remoteLastUpdate && typeof remoteLastUpdate.toDate === 'function') {
                    remoteLastUpdate = remoteLastUpdate.toDate().toISOString();
                } else if (remoteLastUpdate && typeof remoteLastUpdate !== 'string') {
                    remoteLastUpdate = remoteLastUpdate.toString();
                }
                
                const localLastUpdate = localStorage.getItem("lastSaveTime");
                
                // تحديث فقط إذا كانت البيانات من Firebase أحدث (أو لم نحفظ محلياً بعد)
                const shouldUpdate = !localLastUpdate || 
                    (remoteLastUpdate && String(remoteLastUpdate) > String(localLastUpdate));
                
                if (shouldUpdate) {
                    const remoteClients = Array.isArray(data.clients) ? data.clients : [];
                    clients = remoteClients;
                    localStorage.setItem("clients", JSON.stringify(clients));
                    if (remoteLastUpdate) {
                        localStorage.setItem("lastSaveTime", remoteLastUpdate);
                        localStorage.setItem("lastSyncTime", remoteLastUpdate);
                    }
                    
                    renderClients();
                    updateSaveStatus();
                    
                    if (document.hasFocus() && localLastUpdate) {
                        showSuccess("تم تحديث البيانات من السحابة تلقائياً!");
                    }
                }
            }, (error) => {
                console.error("Firebase real-time error:", error);
            });
        
        console.log("Firebase real-time sync activated");
    } catch (error) {
        console.error("Error setting up Firebase sync:", error);
    }
}

// إلغاء مستمع Firebase عند إغلاق الصفحة
window.addEventListener('beforeunload', () => {
    if (firebaseUnsubscribe && typeof firebaseUnsubscribe === 'function') {
        firebaseUnsubscribe();
        firebaseUnsubscribe = null;
    }
});

// تنظيف النسخ الاحتياطية القديمة
function cleanupOldBackups() {
    try {
        const backupKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("clients_backup_")) {
                backupKeys.push(key);
            }
        }
        
        // ترتيب حسب التاريخ (الأحدث أولاً)
        backupKeys.sort().reverse();
        
        // حذف النسخ القديمة (الاحتفاظ بآخر 5 فقط)
        if (backupKeys.length > 5) {
            for (let i = 5; i < backupKeys.length; i++) {
                localStorage.removeItem(backupKeys[i]);
            }
        }
    } catch (error) {
        console.error("Error cleaning backups:", error);
    }
}

// التحقق من تكامل البيانات
function validateData(data) {
    if (!Array.isArray(data)) {
        return false;
    }
    
    for (const client of data) {
        if (!client.name || typeof client.name !== 'string') {
            return false;
        }
        if (typeof client.total !== 'number' || client.total < 0) {
            return false;
        }
        if (typeof client.remaining !== 'number' || client.remaining < 0) {
            return false;
        }
        if (!Array.isArray(client.history)) {
            return false;
        }
    }
    
    return true;
}

// استعادة البيانات من النسخ الاحتياطية
function restoreFromBackup() {
    try {
        const backupKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("clients_backup_")) {
                backupKeys.push(key);
            }
        }
        
        if (backupKeys.length === 0) {
            customAlert("لا توجد نسخ احتياطية متاحة", "تنبيه");
            return;
        }
        
        // أحدث نسخة احتياطية
        backupKeys.sort().reverse();
        const latestBackup = backupKeys[0];
        const backupRaw = localStorage.getItem(latestBackup);
        let backupData;
        
        try {
            backupData = JSON.parse(backupRaw);
        } catch (e) {
            customAlert("النسخة الاحتياطية تالفة!", "خطأ");
            return;
        }
        
        // معالجة الصيغة الجديدة والقديمة
        let clientsToRestore;
        if (backupData.clients && Array.isArray(backupData.clients)) {
            clientsToRestore = backupData.clients;
        } else if (Array.isArray(backupData)) {
            clientsToRestore = backupData;
        } else {
            customAlert("صيغة النسخة الاحتياطية غير صحيحة!", "خطأ");
            return;
        }
        
        if (validateData(clientsToRestore)) {
            customConfirm(
                `تم العثور على نسخة احتياطية بتاريخ: ${latestBackup.replace("clients_backup_", "").replace("clients_manual_backup_", "")}\nعدد العملاء: ${clientsToRestore.length}\nهل تريد استعادتها؟`,
                "استعادة النسخة الاحتياطية"
            ).then(async (confirmed) => {
                if (confirmed) {
                    clients = clientsToRestore;
                    await saveData();
                    renderClients();
                    showSuccess("تم استعادة النسخة الاحتياطية بنجاح!");
                }
            });
        }
    } catch (error) {
        showError("حدث خطأ في استعادة النسخة الاحتياطية!");
        console.error("Error restoring backup:", error);
    }
}

// إضافة عميل جديد
async function addClient() {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!name) {
        showError("الرجاء إدخال اسم العميل");
        nameInput.focus();
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        showError("الرجاء إدخال مبلغ صحيح أكبر من الصفر");
        amountInput.focus();
        return;
    }

    if (clients.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        const result = await customConfirm(`يوجد عميل باسم "${name}" بالفعل. هل تريد الإضافة رغم ذلك؟`, "تحذير");
        if (!result) return;
    }
    
    await addClientConfirmed(name, phone, amount);
}

// إضافة عميل بعد التأكيد
async function addClientConfirmed(name, phone, amount) {
    try {
        clients.push({
            id: Date.now(),
            name,
            phone: phone || "لا يوجد",
            total: amount,
            remaining: amount,
            history: [{
                type: "دين أولي",
                amount: amount,
                date: new Date().toISOString()
            }]
        });

        localStorage.removeItem("dataClearedAt");

        nameInput.value = "";
        phoneInput.value = "";
        amountInput.value = "";

        const saved = await saveData();
        if (!saved) {
            showError("فشل حفظ البيانات!");
            return;
        }
        renderClients();
        showSuccess("تم إضافة العميل بنجاح!");
        nameInput.focus();
    } catch (err) {
        console.error("addClientConfirmed error:", err);
        showError("حدث خطأ أثناء الإضافة: " + (err.message || err));
    }
}

// عرض قائمة العملاء
function renderClients() {
    const search = searchInput.value.trim().toLowerCase();
    const container = document.getElementById("clientsList");
    container.innerHTML = "";

    // فلترة العملاء
    let filteredClients = clients;
    if (search) {
        filteredClients = clients.filter(c =>
            c.name.toLowerCase().includes(search) ||
            (c.phone && c.phone.includes(search))
        );
    }

    // عرض رسالة فارغة إذا لم توجد نتائج
    if (filteredClients.length === 0) {
        container.innerHTML = `<div class="empty-state">${search ? "لا توجد نتائج للبحث" : "لا يوجد عملاء بعد"}</div>`;
        updateStats();
        return;
    }

    // عرض العملاء
    filteredClients.forEach((client, displayIndex) => {
        const actualIndex = clients.findIndex(c => c.id === client.id);
            const div = document.createElement("div");
            div.className = "client";
        
        const progressPercent = client.total > 0 
            ? ((client.total - client.remaining) / client.total * 100).toFixed(0)
            : 0;

            div.innerHTML = `
            <div class="info-row">
                <strong>الاسم:</strong> ${escapeHtml(client.name)}
            </div>
            <div class="info-row">
                <strong>الهاتف:</strong> ${escapeHtml(client.phone)}
            </div>
            <div class="info-row">
                <strong>المبلغ الكلي:</strong> <span style="color: var(--primary);">${formatNumber(client.total)} ₪</span>
            </div>
            <div class="info-row">
                <strong>المتبقي:</strong> <span style="color: ${client.remaining > 0 ? 'var(--danger)' : 'var(--secondary)'}; font-weight: bold;">${formatNumber(client.remaining)} ₪</span>
            </div>
            <div class="info-row" style="margin-top: 10px;">
                <div style="background: var(--bg-dark); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: ${client.remaining === 0 ? 'var(--secondary)' : 'var(--primary)'}; height: 100%; width: ${progressPercent}%; transition: width 0.3s;"></div>
                </div>
                <small style="color: var(--text-secondary); margin-top: 5px; display: block;">تم سداد ${progressPercent}%</small>
            </div>
            <div class="actions">
                <button onclick="payFull(${actualIndex})" class="success" ${client.remaining === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>✅ سداد كامل</button>
                <button onclick="installment(${actualIndex})" ${client.remaining === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>💰 دفع تقسيط</button>
                <button onclick="addMore(${actualIndex})">➕ إضافة دين</button>
                <button onclick="editClient(${actualIndex})">✏️ تعديل</button>
                <button onclick="openModal(${actualIndex})">📄 ملف العميل</button>
                <button onclick="removeClient(${actualIndex})" class="danger">🗑️ حذف</button>
                </div>
            `;
            container.appendChild(div);
        });

    updateStats();
}

// تحديث الإحصائيات
function updateStats() {
    const totalClients = clients.length;
    const totalDebt = clients.reduce((sum, c) => sum + c.total, 0);
    const totalRemaining = clients.reduce((sum, c) => sum + c.remaining, 0);

    document.getElementById("totalClients").innerText = totalClients;
    document.getElementById("totalDebt").innerText = formatNumber(totalDebt) + " ₪";
    document.getElementById("totalRemaining").innerText = formatNumber(totalRemaining) + " ₪";
}

// تنسيق الأرقام
function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// حماية من XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// سداد كامل
async function payFull(i) {
    if (i < 0 || i >= clients.length) return;
    
    const client = clients[i];
    if (client.remaining === 0) {
        await customAlert("لا يوجد دين متبقي للدفع!", "تنبيه");
        return;
    }

    const confirmed = await customConfirm(`هل تريد سداد المبلغ الكامل الباقي: ${formatNumber(client.remaining)} ₪؟`, "تأكيد السداد");
    if (!confirmed) return;

    try {
        const amount = client.remaining;
        client.remaining = 0;
        client.history.push({
            type: "سداد كامل",
            amount: amount,
            date: new Date().toISOString()
        });

        const saved = await saveData();
        if (!saved) { client.remaining = amount; client.history.pop(); showError("فشل الحفظ!"); return; }
        renderClients();
        showSuccess(`تم سداد المبلغ الكامل: ${formatNumber(amount)} ₪`);
    } catch (err) {
        console.error("payFull error:", err);
        showError("حدث خطأ: " + (err.message || err));
    }
}

// دفع تقسيط
async function installment(i) {
    if (i < 0 || i >= clients.length) return;
    
    const client = clients[i];
    if (client.remaining === 0) {
        await customAlert("لا يوجد دين متبقي للدفع!", "تنبيه");
        return;
    }

    const amountStr = await customPrompt(`أدخل مبلغ الدفع الجزئي (المتبقي: ${formatNumber(client.remaining)} ₪):`, "أدخل المبلغ", "", "number");
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
        showError("مبلغ غير صالح!");
        return;
    }

    if (amount > client.remaining) {
        showError(`المبلغ المدخل أكبر من المتبقي (${formatNumber(client.remaining)} ₪)`);
        return;
    }

    try {
        client.remaining -= amount;
        if (client.remaining < 0) client.remaining = 0;
        client.history.push({
            type: "دفعة تقسيط",
            amount: amount,
            date: new Date().toISOString()
        });

        const saved = await saveData();
        if (!saved) {
            client.remaining += amount;
            client.history.pop();
            showError("فشل الحفظ!");
            return;
        }
        renderClients();
        showSuccess(`تم تسجيل دفعة: ${formatNumber(amount)} ₪`);
    } catch (err) {
        client.remaining += amount;
        client.history.pop();
        console.error("installment error:", err);
        showError("حدث خطأ: " + (err.message || err));
    }
}

// إضافة دين إضافي
async function addMore(i) {
    if (i < 0 || i >= clients.length) return;

    const amountStr = await customPrompt("أدخل مبلغ الدين الإضافي:", "أدخل المبلغ", "", "number");
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
        showError("مبلغ غير صالح!");
        return;
    }

    try {
        clients[i].total += amount;
        clients[i].remaining += amount;
        clients[i].history.push({
            type: "دين إضافي",
            amount: amount,
            date: new Date().toISOString()
        });

        const saved = await saveData();
        if (!saved) {
            clients[i].total -= amount;
            clients[i].remaining -= amount;
            clients[i].history.pop();
            showError("فشل الحفظ!");
            return;
        }
        renderClients();
        showSuccess(`تم إضافة دين إضافي: ${formatNumber(amount)} ₪`);
    } catch (err) {
        clients[i].total -= amount;
        clients[i].remaining -= amount;
        clients[i].history.pop();
        console.error("addMore error:", err);
        showError("حدث خطأ: " + (err.message || err));
    }
}

// تعديل العميل
async function editClient(i) {
    if (i < 0 || i >= clients.length) return;

    const client = clients[i];
    const newName = await customPrompt("الاسم الجديد:", "أدخل الاسم الجديد", client.name);
    if (newName === null) return;

    const newPhone = await customPrompt("رقم الهاتف الجديد:", "أدخل رقم الهاتف", client.phone === "لا يوجد" ? "" : client.phone);

    if (newName && newName.trim()) {
        client.name = newName.trim();
    }

    if (newPhone !== null) {
        client.phone = newPhone.trim() || "لا يوجد";
    }

    try {
        const saved = await saveData();
        if (!saved) { showError("فشل الحفظ!"); return; }
        renderClients();
        showSuccess("تم تحديث بيانات العميل!");
    } catch (err) {
        console.error("editClient error:", err);
        showError("حدث خطأ: " + (err.message || err));
    }
}

// حذف العميل
async function removeClient(i) {
    if (i < 0 || i >= clients.length) return;

    const client = clients[i];
    const confirmed = await customConfirm(`هل أنت متأكد من حذف العميل "${client.name}"؟\nسيتم حذف جميع البيانات المرتبطة به بشكل نهائي.`, "تأكيد الحذف");
    if (!confirmed) return;

    try {
        clients.splice(i, 1);
        const saved = await saveData();
        if (!saved) {
            showError("فشل حفظ الحذف!");
            clients.splice(i, 0, client); // تراجع
            return;
        }
        renderClients();
        showSuccess("تم حذف العميل!");
    } catch (err) {
        console.error("removeClient error:", err);
        clients.splice(i, 0, client);
        showError("حدث خطأ أثناء الحذف: " + (err.message || err));
    }
}

// فتح Modal ملف العميل
function openModal(i) {
    if (i < 0 || i >= clients.length) return;

    currentIndex = i;
    const client = clients[i];
    
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    document.getElementById("modalName").innerText = client.name;
    
    // معلومات العميل
    const infoDiv = document.getElementById("modalClientInfo");
    infoDiv.innerHTML = `
        <div style="background: var(--bg-dark); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <div class="info-row"><strong>رقم الهاتف:</strong> ${escapeHtml(client.phone)}</div>
            <div class="info-row"><strong>المبلغ الكلي:</strong> <span style="color: var(--primary);">${formatNumber(client.total)} ₪</span></div>
            <div class="info-row"><strong>المتبقي:</strong> <span style="color: ${client.remaining > 0 ? 'var(--danger)' : 'var(--secondary)'}; font-weight: bold;">${formatNumber(client.remaining)} ₪</span></div>
            <div class="info-row"><strong>تم السداد:</strong> <span style="color: var(--secondary);">${formatNumber(client.total - client.remaining)} ₪</span></div>
        </div>
    `;

    // سجل الديون
    const histDiv = document.getElementById("modalHistory");
    if (client.history.length === 0) {
        histDiv.innerHTML = "<div class='empty-state'>لا يوجد سجل</div>";
    } else {
        histDiv.innerHTML = "<h3>📜 سجل الديون والمدفوعات:</h3>";
        client.history.forEach((h, idx) => {
            const historyItem = document.createElement("div");
            historyItem.className = "history-item";
            
            const isDebt = h.type.includes("دين");
            const isPayment = h.type.includes("سداد") || h.type.includes("دفعة");
            
            historyItem.innerHTML = `
                <div class="history-date">${formatDate(h.date)}</div>
                <div>
                    <span class="history-type">${escapeHtml(h.type)}</span>
                    <span class="history-amount" style="color: ${isDebt ? 'var(--danger)' : isPayment ? 'var(--secondary)' : 'var(--primary)'};">
                        ${isPayment ? '-' : '+'} ${formatNumber(h.amount)} ₪
                    </span>
                </div>
            `;
            histDiv.appendChild(historyItem);
        });
    }
}

// إغلاق Modal
function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    currentIndex = null;
}

// تصدير PDF
async function exportPDF() {
    if (currentIndex === null || currentIndex < 0 || currentIndex >= clients.length) {
        customAlert("يرجى اختيار عميل أولاً لعرض كشف حسابه", "تنبيه");
        return;
    }

    try {
        const client = clients[currentIndex];
        
        // التحقق من وجود المكتبات المطلوبة
        if (typeof html2canvas === 'undefined') {
            throw new Error("مكتبة html2canvas غير متاحة. يرجى تحديث الصفحة.");
        }
        
        // التحقق من jsPDF بطرق مختلفة
        let jsPDFAvailable = false;
        if (window.jspdf && window.jspdf.jsPDF) {
            jsPDFAvailable = true;
        } else if (window.jsPDF) {
            jsPDFAvailable = true;
        }
        
        if (!jsPDFAvailable) {
            throw new Error("مكتبة jsPDF غير متاحة. يرجى تحديث الصفحة.");
        }
        
        // إظهار رسالة تحميل
        showSuccess("جاري إنشاء الملف... يرجى الانتظار...");
        
        // إنشاء محتوى HTML للتصدير
        const pdfContent = document.createElement("div");
        pdfContent.id = "pdf-content";
        pdfContent.style.cssText = `
            width: 800px;
            padding: 40px;
            background: white;
            color: black;
            font-family: 'Arial', 'Tahoma', sans-serif;
            direction: rtl;
            text-align: right;
        `;

        // العنوان
        const title = document.createElement("h1");
        title.textContent = "كشف حساب العميل";
        title.style.cssText = "text-align: center; color: #38bdf8; font-size: 28px; margin-bottom: 10px;";
        pdfContent.appendChild(title);

        // اسم العميل
        const clientName = document.createElement("h2");
        clientName.textContent = client.name;
        clientName.style.cssText = "text-align: center; color: #000; font-size: 22px; margin-bottom: 30px;";
        pdfContent.appendChild(clientName);

        // معلومات العميل
        const infoDiv = document.createElement("div");
        infoDiv.style.cssText = "margin-bottom: 30px; padding: 20px; background: #f5f5f5; border-radius: 10px;";
        
        const infoItems = [
            { label: "رقم الهاتف", value: client.phone },
            { label: "المبلغ الكلي", value: `${formatNumber(client.total)} ₪`, color: "#38bdf8" },
            { label: "المتبقي", value: `${formatNumber(client.remaining)} ₪`, color: client.remaining > 0 ? "#ef4444" : "#10b981" },
            { label: "تم السداد", value: `${formatNumber(client.total - client.remaining)} ₪`, color: "#10b981" }
        ];

        infoItems.forEach(item => {
            const row = document.createElement("div");
            row.style.cssText = "margin: 10px 0; font-size: 16px;";
            const label = document.createElement("strong");
            label.textContent = `${item.label}: `;
            const value = document.createElement("span");
            value.textContent = item.value;
            if (item.color) value.style.color = item.color;
            row.appendChild(label);
            row.appendChild(value);
            infoDiv.appendChild(row);
        });
        
        pdfContent.appendChild(infoDiv);

        // خط فاصل
        const hr1 = document.createElement("hr");
        hr1.style.cssText = "border: 1px solid #ddd; margin: 30px 0;";
        pdfContent.appendChild(hr1);

        // عنوان السجل
        const historyTitle = document.createElement("h3");
        historyTitle.textContent = "سجل الديون والمدفوعات:";
        historyTitle.style.cssText = "font-size: 20px; margin-bottom: 20px; color: #000;";
        pdfContent.appendChild(historyTitle);

        // جدول السجل
        const table = document.createElement("table");
        table.style.cssText = "width: 100%; border-collapse: collapse; margin-bottom: 30px;";
        table.innerHTML = `
            <thead>
                <tr style="background: #38bdf8; color: white;">
                    <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">التاريخ والوقت</th>
                    <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">نوع العملية</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">المبلغ</th>
                </tr>
            </thead>
            <tbody>
                ${client.history.map(h => {
                    const isDebt = h.type.includes("دين");
                    const isPayment = h.type.includes("سداد") || h.type.includes("دفعة");
                    const color = isDebt ? "#ef4444" : isPayment ? "#10b981" : "#38bdf8";
                    const sign = isPayment ? "-" : "+";
                    return `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">${formatDate(h.date)}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: ${color}; font-weight: bold;">${escapeHtml(h.type)}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: left; font-weight: bold; color: ${color};">${sign} ${formatNumber(h.amount)} ₪</td>
                        </tr>
                    `;
                }).join("")}
            </tbody>
        `;
        pdfContent.appendChild(table);

        // خط فاصل
        const hr2 = document.createElement("hr");
        hr2.style.cssText = "border: 1px solid #ddd; margin: 30px 0;";
        pdfContent.appendChild(hr2);

        // تاريخ التصدير
        const exportDate = document.createElement("p");
        exportDate.textContent = `تم التصدير في: ${new Date().toLocaleString("ar-SA")}`;
        exportDate.style.cssText = "text-align: center; color: #666; font-size: 14px;";
        pdfContent.appendChild(exportDate);

        // إضافة المحتوى للصفحة (مخفي)
        pdfContent.style.position = "absolute";
        pdfContent.style.left = "-9999px";
        pdfContent.style.top = "0";
        document.body.appendChild(pdfContent);

        // تحويل إلى صورة ثم PDF
        if (typeof html2canvas !== 'undefined') {
            // إعطاء الوقت للعناصر للظهور
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const canvas = await html2canvas(pdfContent, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                allowTaint: true,
                removeContainer: false
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            // الوصول إلى jsPDF بشكل صحيح
            let jsPDF;
            if (window.jspdf && window.jspdf.jsPDF) {
                jsPDF = window.jspdf.jsPDF;
            } else if (window.jsPDF) {
                jsPDF = window.jsPDF;
            } else {
                throw new Error("مكتبة jsPDF غير متاحة");
            }
            
            const doc = new jsPDF('p', 'mm', 'a4');
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // إنشاء PDF blob وفتحه مباشرة
            const pdfBlob = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            console.log("PDF created successfully, size:", pdfBlob.size, "bytes");
            
            // استخدام طريقة موثوقة لفتح PDF
            // إنشاء رابط وفتحه في نافذة جديدة
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            
            // محاولة فتح PDF في نافذة جديدة
            try {
                link.click();
                showSuccess("تم فتح الملف بنجاح!");
                
                // تنظيف بعد 3 ثوانٍ
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(pdfUrl);
                }, 3000);
            } catch (error) {
                console.error("Error opening PDF:", error);
                // إذا فشل، حاول فتحه مباشرة في نافذة جديدة
                const newWindow = window.open(pdfUrl, '_blank');
                if (newWindow) {
                    showSuccess("تم فتح الملف بنجاح!");
                    setTimeout(() => {
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pdfUrl);
                    }, 3000);
                } else {
                    // إذا فشل كل شيء، قم بتحميل الملف
                    const fileName = `${client.name.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}_كشف_حساب_${Date.now()}.pdf`;
                    link.download = fileName;
                    link.click();
                    showSuccess("تم تحميل الملف بنجاح!");
                    setTimeout(() => {
                        document.body.removeChild(link);
                        URL.revokeObjectURL(pdfUrl);
                    }, 1000);
                }
            }
            
            document.body.removeChild(pdfContent);
        } else {
            throw new Error("html2canvas غير متاح");
        }
    } catch (error) {
        console.error("PDF Export Error:", error);
        customAlert(`حدث خطأ في تصدير الملف!\n${error.message || error}`, "خطأ");
        // إزالة العنصر إذا كان موجوداً
        const pdfContent = document.getElementById("pdf-content");
        if (pdfContent && pdfContent.parentNode) {
            document.body.removeChild(pdfContent);
        }
    }
}

// تسجيل الخروج
async function handleLogout() {
    const confirmed = await customConfirm("هل أنت متأكد من تسجيل الخروج؟", "تأكيد تسجيل الخروج");
    if (confirmed) {
        // تسجيل الخروج مباشرة
        localStorage.removeItem("user_auth");
        window.location.href = "login.html";
    }
}

// جعل دالة logout متاحة من HTML
window.logout = handleLogout;

// تهيئة الصفحة
async function init() {
    // التحقق من تسجيل الدخول أولاً وقبل كل شيء
    if (typeof checkAuth === 'function') {
        checkAuth();
    }
    
    // تحقق إضافي: إذا لم يكن مسجل دخول محلياً، لا نكمل التحميل
    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
        window.location.href = "login.html";
        return;
    }
    
    // تحميل البيانات المحلية أولاً كقيمة افتراضية
    const localData = localStorage.getItem("clients");
    const localLastUpdate = localStorage.getItem("lastSaveTime");
    let localClients = [];
    try {
        localClients = localData ? JSON.parse(localData) : [];
    } catch (e) {
        console.error("Error parsing local data:", e);
    }
    
    // مزامنة Firebase إن كان مُعداً
    if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
        try {
            const dataClearedAt = localStorage.getItem("dataClearedAt");
            const now = new Date();
            const clearedTime = dataClearedAt ? new Date(dataClearedAt) : null;
            const timeSinceClear = clearedTime ? (now - clearedTime) / (1000 * 60) : null;
            const wasRecentlyCleared = clearedTime && timeSinceClear < 10;
            
            // إذا تم الحذف حديثاً والبيانات المحلية فارغة، لا نحمل من Firebase
            if (wasRecentlyCleared && localClients.length === 0) {
                console.log("Data was recently cleared, skipping Firebase load");
            } else {
                const firebaseData = await loadFromFirebase();
                
                if (firebaseData && Array.isArray(firebaseData.clients)) {
                    const fbLast = firebaseData.lastUpdated || "";
                    const useFirebase = firebaseData.clients.length > 0 && 
                        (!localLastUpdate || !fbLast || String(fbLast) >= String(localLastUpdate));
                    
                    if (useFirebase) {
                        const localIsEmpty = localClients.length === 0;
                        const localIsRecent = localLastUpdate && 
                            (new Date() - new Date(localLastUpdate)) / 1000 < 60;
                        
                        if (!(localIsEmpty && localIsRecent)) {
                            clients = firebaseData.clients;
                            if (firebaseData.lastUpdated) {
                                localStorage.setItem("clients", JSON.stringify(clients));
                                localStorage.setItem("lastSaveTime", firebaseData.lastUpdated);
                                localStorage.setItem("lastSyncTime", firebaseData.lastUpdated);
                            }
                            showSuccess("تم تحميل البيانات من السحابة!");
                        }
                    } else if (localClients.length > 0 && (!firebaseData.clients.length || String(localLastUpdate) > String(fbLast))) {
                        // المحلي أحدث: رفع لـ Firebase (skipSync=false)
                        clients = localClients;
                        await saveData(false);
                    }
                } else if (localClients.length > 0) {
                    // Firebase فارغ والبيانات المحلية موجودة: رفعها
                    clients = localClients;
                    await saveData(false);
                }
            }
            
            setupFirebaseSync();
        } catch (error) {
            console.error("Error loading from Firebase:", error);
            clients = localClients.length > 0 ? localClients : clients;
        }
    } else {
        clients = localClients.length > 0 ? localClients : clients;
    }
    
    // إذا لم نحصل على بيانات من أي مصدر
    if (clients.length === 0 && localClients.length > 0) {
        clients = localClients;
    }
    
    // إصلاح البيانات (معرفات، قيم افتراضية)
    clients = clients.map((client, index) => {
        if (!client.id) client.id = Date.now() + index;
        if (typeof client.total !== 'number') client.total = 0;
        if (typeof client.remaining !== 'number') client.remaining = client.total || 0;
        if (!Array.isArray(client.history)) client.history = [];
        if (!client.name) client.name = "غير معروف";
        if (!client.phone) client.phone = "لا يوجد";
        return client;
    });
    
    // حفظ البيانات المُصلحة (بما فيها Firebase) - شرط التحديث يمنع الحلقة
    if (clients.length > 0) {
        await saveData(false);
    }
    
    renderClients();
    updateSaveStatus();
    nameInput.focus();
    
    setInterval(updateSaveStatus, 5000);
}

// ==================== إدارة البيانات ====================

// تصدير البيانات
function exportData() {
    try {
        const data = {
            clients: clients,
            exportDate: new Date().toISOString(),
            version: "1.0"
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showSuccess("تم تصدير البيانات بنجاح!");
    } catch (error) {
        showError("حدث خطأ في تصدير البيانات!");
        console.error("Export error:", error);
    }
}

// استيراد البيانات
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                // التحقق من صحة البيانات
                let dataToImport;
                if (importedData.clients) {
                    dataToImport = importedData.clients;
                } else if (Array.isArray(importedData)) {
                    dataToImport = importedData;
                } else {
                    throw new Error("صيغة البيانات غير صحيحة");
                }
                
                if (!validateData(dataToImport)) {
                    throw new Error("البيانات المستوردة غير صحيحة أو تالفة");
                }
                
                customConfirm(
                    `تم العثور على ${dataToImport.length} عميل.\nهل تريد استيرادهم؟ (سيتم استبدال البيانات الحالية)`,
                    "تأكيد الاستيراد"
                ).then(async (confirmed) => {
                    if (confirmed) {
                        clients = dataToImport;
                        // إزالة علامة الحذف الكامل عند استيراد البيانات
                        localStorage.removeItem("dataClearedAt");
                        await saveData();
                        renderClients();
                        showSuccess(`تم استيراد ${dataToImport.length} عميل بنجاح!`);
                    }
                });
            } catch (error) {
                showError("فشل استيراد البيانات! تأكد من أن الملف صحيح.");
                console.error("Import error:", error);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// إنشاء نسخة احتياطية يدوية
function createBackup() {
    try {
        // التحقق من وجود بيانات
        if (!clients || !Array.isArray(clients)) {
            showError("لا توجد بيانات للنسخ الاحتياطي!");
            return;
        }
        
        // إنشاء نسخة احتياطية بإسم فريد مع معلومات إضافية
        const backupKey = `clients_manual_backup_${Date.now()}`;
        const timestamp = new Date().toISOString();
        
        const backupData = {
            clients: clients,
            timestamp: timestamp,
            clientCount: clients.length,
            type: 'manual'
        };
        
        // التحقق من حجم البيانات
        const dataString = JSON.stringify(backupData);
        const dataSize = new Blob([dataString]).size;
        const maxSize = 5 * 1024 * 1024; // 5 MB
        
        if (dataSize > maxSize) {
            showError("حجم البيانات كبير جداً! يرجى تصدير البيانات بدلاً من النسخ الاحتياطي.");
            return;
        }
        
        localStorage.setItem(backupKey, dataString);
        showSuccess(`تم إنشاء النسخة الاحتياطية بنجاح! (${clients.length} عميل)`);
    } catch (error) {
        console.error("Backup error details:", error);
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            showError("مساحة التخزين ممتلئة! يرجى تصدير البيانات وحذف النسخ القديمة.");
        } else if (error.message) {
            showError(`حدث خطأ في إنشاء النسخة الاحتياطية: ${error.message}`);
        } else {
            showError("حدث خطأ في إنشاء النسخة الاحتياطية! تحقق من Console للتفاصيل.");
        }
    }
}

// عرض قائمة النسخ الاحتياطية
function viewBackups() {
    const backupsModal = document.getElementById("backupsModal");
    const backupsList = document.getElementById("backupsList");
    
    // جمع جميع النسخ الاحتياطية
    const backups = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("clients_backup_") || key.startsWith("clients_manual_backup_"))) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                const timestamp = data.timestamp || key.replace("clients_backup_", "").replace("clients_manual_backup_", "");
                const clientCount = data.clientCount || (Array.isArray(data.clients) ? data.clients.length : (Array.isArray(data) ? data.length : 0));
                
                backups.push({
                    key: key,
                    timestamp: timestamp,
                    clientCount: clientCount,
                    type: key.startsWith("clients_manual_backup_") ? "يدوي" : "تلقائي",
                    rawData: data
                });
            } catch (e) {
                // قد يكون بيانات قديمة بصيغة مختلفة
                try {
                    const oldData = JSON.parse(localStorage.getItem(key));
                    if (Array.isArray(oldData)) {
                        backups.push({
                            key: key,
                            timestamp: key.replace("clients_backup_", "").replace("clients_manual_backup_", ""),
                            clientCount: oldData.length,
                            type: "قديم",
                            rawData: oldData
                        });
                    }
                } catch (e2) {
                    console.error("Error parsing backup:", key, e2);
                }
            }
        }
    }
    
    // ترتيب حسب التاريخ (الأحدث أولاً)
    backups.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
    });
    
    if (backups.length === 0) {
        backupsList.innerHTML = '<div class="empty-state">لا توجد نسخ احتياطية متاحة</div>';
    } else {
        backupsList.innerHTML = backups.map((backup, index) => {
            const date = new Date(backup.timestamp);
            const formattedDate = date.toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
            
            return `
                <div style="background: var(--bg-dark); padding: 15px; border-radius: 10px; margin: 10px 0; border: 1px solid var(--border);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <strong style="color: var(--primary);">نسخة احتياطية #${index + 1}</strong>
                            <div style="color: var(--text-secondary); font-size: 14px; margin-top: 5px;">
                                📅 ${formattedDate}
                            </div>
                            <div style="color: var(--text-secondary); font-size: 14px;">
                                👥 عدد العملاء: ${backup.clientCount} | نوع النسخة: ${backup.type}
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <button onclick="restoreSpecificBackup('${backup.key}')" class="success" style="padding: 8px 15px; font-size: 14px;">📥 استعادة</button>
                            <button onclick="deleteSpecificBackup('${backup.key}')" class="danger" style="padding: 8px 15px; font-size: 14px;">🗑️ حذف</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    backupsModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

// إغلاق نافذة النسخ الاحتياطية
function closeBackupsModal() {
    const backupsModal = document.getElementById("backupsModal");
    backupsModal.classList.add("hidden");
    document.body.style.overflow = "";
}

// استعادة نسخة احتياطية محددة
async function restoreSpecificBackup(backupKey) {
    const confirmed = await customConfirm(
        "هل تريد استعادة هذه النسخة الاحتياطية؟\nسيتم استبدال البيانات الحالية.",
        "تأكيد الاستعادة"
    );
    
    if (!confirmed) return;
    
    try {
        const backupData = JSON.parse(localStorage.getItem(backupKey));
        
        // معالجة البيانات القديمة والجديدة
        let clientsToRestore;
        if (backupData.clients && Array.isArray(backupData.clients)) {
            clientsToRestore = backupData.clients;
        } else if (Array.isArray(backupData)) {
            clientsToRestore = backupData;
        } else {
            throw new Error("صيغة النسخة الاحتياطية غير صحيحة");
        }
        
        if (!validateData(clientsToRestore)) {
            throw new Error("النسخة الاحتياطية تالفة");
        }
        
        clients = clientsToRestore;
        // إزالة علامة الحذف الكامل عند استعادة النسخة الاحتياطية
        localStorage.removeItem("dataClearedAt");
        await saveData(true);
        renderClients();
        showSuccess(`تم استعادة النسخة الاحتياطية بنجاح! (${clients.length} عميل)`);
        closeBackupsModal();
    } catch (error) {
        showError("فشل استعادة النسخة الاحتياطية!");
        console.error("Restore error:", error);
    }
}

// حذف نسخة احتياطية محددة
async function deleteSpecificBackup(backupKey) {
    const confirmed = await customConfirm(
        "هل تريد حذف هذه النسخة الاحتياطية؟",
        "تأكيد الحذف"
    );
    
    if (!confirmed) return;
    
    try {
        localStorage.removeItem(backupKey);
        showSuccess("تم حذف النسخة الاحتياطية!");
        // تحديث القائمة
        viewBackups();
    } catch (error) {
        showError("فشل حذف النسخة الاحتياطية!");
        console.error("Delete backup error:", error);
    }
}

// طباعة كشف العملاء
function printClientsReport() {
    if (!clients || clients.length === 0) {
        customAlert("لا توجد عملاء لعرضهم!", "تنبيه");
        return;
    }
    
    // إنشاء محتوى الطباعة
    const printContent = document.createElement("div");
    printContent.id = "print-content";
    printContent.style.cssText = `
        width: 210mm;
        padding: 20mm;
        background: white;
        color: black;
        font-family: 'Arial', 'Tahoma', sans-serif;
        direction: rtl;
        text-align: right;
    `;
    
    // العنوان
    const title = document.createElement("h1");
    title.textContent = "كشف العملاء";
    title.style.cssText = "text-align: center; color: #000; font-size: 24px; margin-bottom: 10px;";
    printContent.appendChild(title);
    
    // التاريخ
    const date = document.createElement("p");
    date.textContent = `تاريخ الطباعة: ${new Date().toLocaleDateString("ar-SA")}`;
    date.style.cssText = "text-align: center; color: #666; font-size: 14px; margin-bottom: 20px;";
    printContent.appendChild(date);
    
    // جدول العملاء
    const table = document.createElement("table");
    table.style.cssText = "width: 100%; border-collapse: collapse; margin-top: 20px;";
    table.innerHTML = `
        <thead>
            <tr style="background: #38bdf8; color: white;">
                <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">#</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">الاسم</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">رقم الهاتف</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">المبلغ المتبقي</th>
            </tr>
        </thead>
        <tbody>
            ${clients.map((client, index) => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${index + 1}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(client.name)}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(client.phone || "لا يوجد")}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: left; font-weight: bold; color: ${client.remaining > 0 ? '#ef4444' : '#10b981'};">
                        ${formatNumber(client.remaining)} ₪
                    </td>
                </tr>
            `).join("")}
        </tbody>
        <tfoot>
            <tr style="background: #f5f5f5; font-weight: bold;">
                <td colspan="3" style="padding: 12px; border: 1px solid #ddd; text-align: right;">الإجمالي:</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: left; color: #ef4444;">
                    ${formatNumber(clients.reduce((sum, c) => sum + c.remaining, 0))} ₪
                </td>
            </tr>
        </tfoot>
    `;
    printContent.appendChild(table);
    
    // الملخص
    const summary = document.createElement("div");
    summary.style.cssText = "margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 10px;";
    summary.innerHTML = `
        <p style="margin: 5px 0;"><strong>عدد العملاء:</strong> ${clients.length}</p>
        <p style="margin: 5px 0;"><strong>إجمالي المتبقي:</strong> <span style="color: #ef4444;">${formatNumber(clients.reduce((sum, c) => sum + c.remaining, 0))} ₪</span></p>
    `;
    printContent.appendChild(summary);
    
    // إضافة للصفحة (مخفي)
    printContent.style.position = "absolute";
    printContent.style.left = "-9999px";
    printContent.style.top = "0";
    document.body.appendChild(printContent);
    
    // إعداد الطباعة
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>كشف العملاء</title>
            <style>
                body {
                    margin: 0;
                    padding: 20mm;
                    font-family: 'Arial', 'Tahoma', sans-serif;
                    direction: rtl;
                }
                @media print {
                    body { margin: 0; padding: 0; }
                    @page { margin: 20mm; }
                }
            </style>
        </head>
        <body>
            ${printContent.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    
    // الانتظار قليلاً ثم الطباعة
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        document.body.removeChild(printContent);
    }, 250);
    
    showSuccess("تم تحضير الكشف للطباعة!");
}

// إعادة تعيين بيانات Firebase فقط (استخدام لمرة واحدة)
async function resetFirebaseData() {
    if (!window.isFirebaseConfigured || !window.isFirebaseConfigured()) {
        console.warn("Firebase is not configured");
        return false;
    }
    const db = window.getFirebaseDb && window.getFirebaseDb();
    if (!db) return false;
    try {
        await db.collection('clients').doc('main').delete();
        console.log("Firebase clients document deleted successfully");
        localStorage.removeItem("lastSyncTime");
        return true;
    } catch (error) {
        console.error("Error resetting Firebase data:", error);
        throw error;
    }
}

// تأكيد إعادة تعيين Firebase (للزر في الواجهة)
async function resetFirebaseDataConfirm() {
    const confirmed = await customConfirm(
        "⚠️ سيتم حذف جميع بيانات السحابة (Firebase) فقط.\nالبيانات المحلية ستبقى.\nهل أنت متأكد؟",
        "إعادة تعيين Firebase"
    );
    if (!confirmed) return;
    try {
        await resetFirebaseData();
        showSuccess("تم إعادة تعيين بيانات Firebase بنجاح!");
    } catch (error) {
        showError("فشل إعادة تعيين Firebase!");
    }
}

// جعل الدوال متاحة عالمياً للاستخدام من Console
window.resetFirebaseData = resetFirebaseData;

// حذف جميع البيانات
async function clearAllData() {
    const confirmed = await customConfirm(
        "⚠️ تحذير: سيتم حذف جميع البيانات بشكل نهائي!\nهل أنت متأكد؟",
        "تأكيد الحذف"
    );
    
    if (!confirmed) return;
    
    // تأكيد إضافي
    const doubleConfirmed = await customConfirm(
        "⚠️ تحذير نهائي: هل أنت متأكد 100% من حذف جميع البيانات؟\nلا يمكن التراجع عن هذا الإجراء!",
        "تأكيد نهائي"
    );
    
    if (doubleConfirmed) {
        clients = [];
        
        // حذف البيانات المحلية
        localStorage.removeItem("clients");
        
        // وضع علامة على الحذف الكامل مع timestamp
        const deletionTime = new Date().toISOString();
        localStorage.setItem("dataClearedAt", deletionTime);
        localStorage.setItem("lastSaveTime", deletionTime);
        
        // حذف البيانات من Firebase أيضاً وحفظ مصفوفة فارغة
        if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
            try {
                await saveToFirebase([], deletionTime);
                localStorage.setItem("lastSyncTime", deletionTime);
                console.log("Data cleared from Firebase");
            } catch (error) {
                console.warn("Failed to clear data from Firebase:", error);
                // نستمر حتى لو فشل Firebase
            }
        }
        
        renderClients();
        showSuccess("تم حذف جميع البيانات بشكل نهائي!");
    }
}

// حفظ تلقائي قبل إغلاق الصفحة (ملاحظة: قبلunload لا ينتظر الـ await - الحفظ الفعلي يحدث فوراً قدر الإمكان)
window.addEventListener("beforeunload", (e) => {
    try {
        saveData(); // لا await - المتصفح قد يغلق قبل اكتماله
    } catch (error) {
        console.error("Error saving before unload:", error);
    }
});

// حفظ تلقائي كل 30 ثانية
setInterval(async () => {
    if (clients.length > 0) {
        try {
            await saveData();
        } catch (error) {
            console.error("Auto-save error:", error);
        }
    }
}, 30000); // 30 ثانية

// حفظ تلقائي عند إخفاء الصفحة
document.addEventListener("visibilitychange", async () => {
    if (document.hidden && clients.length > 0) {
        try {
            await saveData();
        } catch (error) {
            console.error("Error saving on visibility change:", error);
        }
    }
});

// التحقق من البيانات عند التحميل
function validateOnLoad() {
    try {
        const savedData = localStorage.getItem("clients");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (!validateData(parsedData)) {
                // محاولة استعادة من النسخ الاحتياطية
                customAlert(
                    "⚠️ بياناتك الحالية تالفة!\nسيتم محاولة استعادة من النسخ الاحتياطية.",
                    "تحذير"
                ).then(() => {
                    restoreFromBackup();
                });
            }
        }
    } catch (error) {
        console.error("Error validating data:", error);
        restoreFromBackup();
    }
}

// تشغيل التهيئة عند تحميل الصفحة
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        validateOnLoad();
        init();
    });
} else {
    validateOnLoad();
    init();
}
