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
        if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
            const lastSync = localStorage.getItem("lastSyncTime");
            if (lastSync) {
                syncStatusElement.textContent = `☁️ متزامن مع السحابة (Supabase)`;
                syncStatusElement.style.color = "var(--secondary)";
            } else {
                syncStatusElement.textContent = `☁️ جاري المزامنة...`;
                syncStatusElement.style.color = "var(--primary)";
            }
        } else {
            syncStatusElement.textContent = `📱 العمل في وضع محلي فقط - قم بإعداد Supabase للمزامنة`;
            syncStatusElement.style.color = "var(--warning)";
        }
    }
}

// حفظ البيانات مع نسخ احتياطي ومزامنة Supabase
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
        
        // إنشاء نسخة احتياطية تلقائية (يومية)
        const today = new Date().toISOString().split('T')[0];
        const backupKey = `clients_backup_${today}`;
        localStorage.setItem(backupKey, dataString);
        
        // حفظ آخر تاريخ تحديث
        const now = new Date().toISOString();
        localStorage.setItem("lastSaveTime", now);
        
        // حفظ في Supabase للمزامنة التلقائية
        if (!skipSync && window.isSupabaseConfigured && window.isSupabaseConfigured()) {
            try {
                await saveToSupabase(clients, now);
                localStorage.setItem("lastSyncTime", now);
            } catch (supabaseError) {
                console.warn("Supabase save failed, data saved locally only:", supabaseError);
                // نستمر في الحفظ المحلي حتى لو فشل Supabase
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

// حفظ البيانات في Supabase
async function saveToSupabase(data, timestamp) {
    const supabase = window.getSupabaseClient && window.getSupabaseClient();
    if (!supabase) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('clients_data')
            .upsert({
                id: 'main',
                clients: data,
                last_updated: timestamp,
                updated_by: localStorage.getItem("username") || "unknown"
            }, {
                onConflict: 'id'
            });
        
        if (error) {
            throw error;
        }
        
        console.log("Data saved to Supabase successfully");
    } catch (error) {
        console.error("Error saving to Supabase:", error);
        throw error;
    }
}

// تحميل البيانات من Supabase
async function loadFromSupabase() {
    const supabase = window.getSupabaseClient && window.getSupabaseClient();
    if (!supabase) {
        return null;
    }
    
    try {
        const { data, error } = await supabase
            .from('clients_data')
            .select('*')
            .eq('id', 'main')
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                // لا توجد بيانات بعد
                return null;
            }
            throw error;
        }
        
        if (data && data.clients && Array.isArray(data.clients)) {
            console.log("Data loaded from Supabase");
            return {
                clients: data.clients,
                lastUpdated: data.last_updated || null
            };
        }
        
        return null;
    } catch (error) {
        console.error("Error loading from Supabase:", error);
        return null;
    }
}

// الاستماع للتحديثات التلقائية من Supabase
function setupSupabaseSync() {
    if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) {
        return;
    }
    
    const supabase = window.getSupabaseClient && window.getSupabaseClient();
    if (!supabase) {
        return;
    }
    
    try {
        // الاستماع للتحديثات في الوقت الفعلي
        const subscription = supabase
            .channel('clients_data_changes')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'clients_data',
                    filter: 'id=eq.main'
                }, 
                (payload) => {
                    console.log('Change received!', payload);
                    
                    if (payload.new && payload.new.clients) {
                        const remoteLastUpdate = payload.new.last_updated;
                        const localLastUpdate = localStorage.getItem("lastSaveTime");
                        
                        // تحديث فقط إذا كانت البيانات من Supabase أحدث
                        if (!localLastUpdate || remoteLastUpdate > localLastUpdate) {
                            // تجنب الحلقة اللا نهائية - تحديث بدون إرسال لـ Supabase
                            clients = payload.new.clients;
                            localStorage.setItem("clients", JSON.stringify(clients));
                            localStorage.setItem("lastSaveTime", remoteLastUpdate);
                            localStorage.setItem("lastSyncTime", remoteLastUpdate);
                            
                            renderClients();
                            updateSaveStatus();
                            
                            // عرض إشعار بالمزامنة
                            if (document.hasFocus()) {
                                showSuccess("تم تحديث البيانات من السحابة تلقائياً!");
                            }
                        }
                    }
                }
            )
            .subscribe();
        
        console.log("Supabase real-time sync activated");
        
        // تنظيف الاشتراك عند إغلاق الصفحة
        window.addEventListener('beforeunload', () => {
            subscription.unsubscribe();
        });
    } catch (error) {
        console.error("Error setting up Supabase sync:", error);
    }
}

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
        const backupData = JSON.parse(localStorage.getItem(latestBackup));
        
        if (validateData(backupData)) {
            customConfirm(
                `تم العثور على نسخة احتياطية بتاريخ: ${latestBackup.replace("clients_backup_", "")}\nهل تريد استعادتها؟`,
                "استعادة النسخة الاحتياطية"
            ).then(confirmed => {
                if (confirmed) {
                    clients = backupData;
                    saveData();
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
function addClient() {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const amount = parseFloat(amountInput.value);

    // التحقق من البيانات
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

    // التحقق من عدم وجود عميل بنفس الاسم
    if (clients.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        customConfirm(`يوجد عميل باسم "${name}" بالفعل. هل تريد الإضافة رغم ذلك؟`, "تحذير").then(result => {
            if (!result) return;
            addClientConfirmed(name, phone, amount);
        });
        return;
    }
    
    addClientConfirmed(name, phone, amount);
}

// إضافة عميل بعد التأكيد
async function addClientConfirmed(name, phone, amount) {

    // إضافة العميل
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

    // مسح الحقول
    nameInput.value = "";
    phoneInput.value = "";
    amountInput.value = "";

    saveData();
    renderClients();
    showSuccess("تم إضافة العميل بنجاح!");
    nameInput.focus();
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
    if (!confirmed) {
        return;
    }

    const amount = client.remaining;
    client.remaining = 0;
    client.history.push({
        type: "سداد كامل",
        amount: amount,
        date: new Date().toISOString()
    });

    saveData();
    renderClients();
    showSuccess(`تم سداد المبلغ الكامل: ${formatNumber(amount)} ₪`);
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

    client.remaining -= amount;
    if (client.remaining < 0) client.remaining = 0;

    client.history.push({
        type: "دفعة تقسيط",
        amount: amount,
        date: new Date().toISOString()
    });

    saveData();
    renderClients();
    showSuccess(`تم تسجيل دفعة: ${formatNumber(amount)} ₪`);
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

    clients[i].total += amount;
    clients[i].remaining += amount;
    clients[i].history.push({
        type: "دين إضافي",
        amount: amount,
        date: new Date().toISOString()
    });

    saveData();
    renderClients();
    showSuccess(`تم إضافة دين إضافي: ${formatNumber(amount)} ₪`);
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

    saveData();
    renderClients();
    showSuccess("تم تحديث بيانات العميل!");
}

// حذف العميل
async function removeClient(i) {
    if (i < 0 || i >= clients.length) return;

    const client = clients[i];
    const confirmed = await customConfirm(`هل أنت متأكد من حذف العميل "${client.name}"؟\nسيتم حذف جميع البيانات المرتبطة به بشكل نهائي.`, "تأكيد الحذف");
    if (!confirmed) {
        return;
    }

    clients.splice(i, 1);
    saveData();
    renderClients();
    showSuccess("تم حذف العميل!");
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
        showError("حدث خطأ في تصدير الملف!");
        return;
    }

    try {
        const client = clients[currentIndex];
        
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
            const canvas = await html2canvas(pdfContent, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

    const { jsPDF } = window.jspdf;
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

            doc.save(`${client.name}_كشف_حساب_${Date.now()}.pdf`);
            document.body.removeChild(pdfContent);
            showSuccess("تم تصدير الملف بنجاح!");
        } else {
            throw new Error("html2canvas غير متاح");
        }
    } catch (error) {
        showError("حدث خطأ في تصدير الملف!");
        console.error("PDF Export Error:", error);
        // إزالة العنصر إذا كان موجوداً
        const pdfContent = document.getElementById("pdf-content");
        if (pdfContent) document.body.removeChild(pdfContent);
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
        // إعادة توجيه فورية لصفحة تسجيل الدخول
        window.location.href = "login.html";
        return; // لا نكمل أي شيء آخر
    }
    
    // محاولة تحميل البيانات من Supabase أولاً
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
        try {
            const supabaseData = await loadFromSupabase();
            if (supabaseData && supabaseData.clients && supabaseData.clients.length > 0) {
                const localData = localStorage.getItem("clients");
                const localLastUpdate = localStorage.getItem("lastSaveTime");
                
                // إذا كانت بيانات Supabase أحدث، استخدمها
                if (!localData || !localLastUpdate || supabaseData.lastUpdated > localLastUpdate) {
                    clients = supabaseData.clients;
                    localStorage.setItem("clients", JSON.stringify(clients));
                    localStorage.setItem("lastSaveTime", supabaseData.lastUpdated || new Date().toISOString());
                    localStorage.setItem("lastSyncTime", supabaseData.lastUpdated || new Date().toISOString());
                    showSuccess("تم تحميل البيانات من السحابة!");
                } else {
                    // إذا كانت البيانات المحلية أحدث، رفعها لـ Supabase
                    await saveData(true);
                }
            }
            
            // إعداد المزامنة التلقائية
            setupSupabaseSync();
        } catch (error) {
            console.error("Error loading from Supabase:", error);
            // المتابعة بالبيانات المحلية
        }
    }
    
    // تحميل البيانات من localStorage كنسخة احتياطية
    if (clients.length === 0) {
        const localData = localStorage.getItem("clients");
        if (localData) {
            try {
                clients = JSON.parse(localData);
            } catch (e) {
                console.error("Error parsing local data:", e);
                clients = [];
            }
        }
    }
    
    // تحديث الفهرس عند التحميل وإصلاح البيانات
    clients = clients.map((client, index) => {
        if (!client.id) {
            client.id = Date.now() + index;
        }
        // إصلاح القيم المفقودة
        if (typeof client.total !== 'number') client.total = 0;
        if (typeof client.remaining !== 'number') client.remaining = client.total || 0;
        if (!Array.isArray(client.history)) client.history = [];
        if (!client.name) client.name = "غير معروف";
        if (!client.phone) client.phone = "لا يوجد";
        return client;
    });
    
    // حفظ البيانات بعد الإصلاح
    if (clients.length > 0) {
        await saveData(true); // حفظ بدون Firebase لتجنب الحلقة
    }
    
    renderClients();
    updateSaveStatus();
    nameInput.focus();
    
    // تحديث مؤشر الحفظ كل 5 ثواني
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
                ).then(confirmed => {
                    if (confirmed) {
                        clients = dataToImport;
                        saveData();
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
        // إنشاء نسخة احتياطية بإسم فريد
        const backupKey = `clients_manual_backup_${Date.now()}`;
        localStorage.setItem(backupKey, JSON.stringify(clients));
        showSuccess("تم إنشاء النسخة الاحتياطية بنجاح!");
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            showError("مساحة التخزين ممتلئة! يرجى تصدير البيانات وحذف النسخ القديمة.");
        } else {
            showError("حدث خطأ في إنشاء النسخة الاحتياطية!");
        }
        console.error("Backup error:", error);
    }
}

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
        localStorage.removeItem("clients");
        saveData();
renderClients();
        showSuccess("تم حذف جميع البيانات!");
    }
}

// حفظ تلقائي قبل إغلاق الصفحة
window.addEventListener("beforeunload", (e) => {
    try {
        saveData();
    } catch (error) {
        console.error("Error saving before unload:", error);
    }
});

// حفظ تلقائي كل 30 ثانية
setInterval(() => {
    if (clients.length > 0) {
        try {
            saveData();
        } catch (error) {
            console.error("Auto-save error:", error);
        }
    }
}, 30000); // 30 ثانية


// حفظ تلقائي عند إخفاء الصفحة
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        try {
            saveData();
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
