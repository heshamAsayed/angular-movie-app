# 🎨 دليل متغيرات الألوان الكامل
## Theme Variables Documentation

---

## 🌞 Light Mode Variables (الوضع النهاري)

### ⚙️ الألوان الأساسية (Primary Colors)
```css
--primary-color: #1565c0;        /* اللون الأساسي للأزرار والروابط النشطة */
--accent-color: #d81b60;         /* اللون الثانوي للعناصر المميزة */
--warn-color: #d32f2f;           /* لون التحذيرات والأخطاء */
```

---

### 🖼️ ألوان الخلفيات (Background Colors)
```css
--surface-bg: #ffffff;           /* خلفية الصفحة الرئيسية (Body) */
--card-bg: #fafafa;              /* خلفية الكروت والبطاقات */
--hover-overlay: rgba(21, 101, 192, 0.06);  /* طبقة شفافة عند المرور بالماوس */
```

---

### 📝 ألوان النصوص (Text Colors)
```css
--primary-text: #000000;         /* النصوص الرئيسية (العناوين والنصوص المهمة) */
--secondary-text: #424242;       /* النصوص الثانوية (الوصف والتفاصيل) */
--muted-text: #757575;           /* النصوص الباهتة (التواريخ والمعلومات الإضافية) */
```

---

### 🎬 ألوان كروت الأفلام (Movie Card Colors)
```css
--rating-badge-bg: #1565c0;      /* خلفية شارة التقييم */
--rating-badge-text: #ffffff;    /* نص شارة التقييم */

--high-rating-bg: #2e7d32;       /* خلفية شارة التقييم العالي (فوق 8) */
--high-rating-text: #ffffff;     /* نص شارة التقييم العالي */

--adult-badge-bg: #d32f2f;       /* خلفية شارة المحتوى للبالغين (+18) */
--adult-badge-text: #ffffff;     /* نص شارة المحتوى للبالغين */

--card-border: rgba(0, 0, 0, 0.12);        /* حدود الكروت */
--card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);  /* ظل الكروت العادي */
--card-hover-shadow: 0 8px 24px rgba(21, 101, 192, 0.2);  /* ظل الكروت عند المرور عليها */
```

---

### 🧭 ألوان شريط التنقل (Navbar Colors)
```css
--navbar-bg: #1565c0;            /* خلفية شريط التنقل العلوي */
--navbar-text: #ffffff;          /* نص عناصر القائمة */
--navbar-hover: #ffffff;         /* لون النص عند المرور بالماوس */
--navbar-active: #ffffff;        /* لون الصفحة النشطة الحالية */
```

---

### 🦶 ألوان التذييل (Footer Colors)
```css
--footer-bg: #e0e0e0;            /* خلفية منطقة التذييل السفلية */
--footer-text: #000000;          /* نص التذييل */
--footer-link: #1565c0;          /* لون الروابط في التذييل */
--footer-border: rgba(0, 0, 0, 0.12);  /* الخط الفاصل العلوي للتذييل */
```

---

### ⭐ ألوان شريط التقييم (Rating Bar Colors)
```css
--rating-bar-bg: #e0e0e0;        /* خلفية شريط التقييم الفارغ */
--rating-high: #2e7d32;          /* لون التقييم العالي (8-10) أخضر */
--rating-medium: #f9a825;        /* لون التقييم المتوسط (5-7) أصفر */
--rating-low: #d32f2f;           /* لون التقييم المنخفض (0-4) أحمر */
```

---
---

## 🌙 Dark Mode Variables (الوضع الليلي)

### 🖼️ ألوان الخلفيات (Background Colors)
```css
--surface-bg: #0f1419;           /* خلفية الصفحة الرئيسية (أسود مزرق) */
--card-bg: #1a1f29;              /* خلفية الكروت (رمادي داكن مزرق) */
--hover-overlay: rgba(100, 181, 246, 0.08);  /* طبقة المرور بالماوس */
```

---

### 📝 ألوان النصوص (Text Colors)
```css
--primary-text: #ffffff;         /* النصوص الرئيسية (أبيض نقي) */
--secondary-text: #e0e0e0;       /* النصوص الثانوية (رمادي فاتح) */
--muted-text: #9e9e9e;           /* النصوص الباهتة (رمادي متوسط) */
```

---

### 🎬 ألوان كروت الأفلام (Movie Card Colors)
```css
--rating-badge-bg: #2196f3;      /* خلفية شارة التقييم (أزرق فاتح) */
--rating-badge-text: #000000;    /* نص شارة التقييم (أسود للتباين) */

--high-rating-bg: #4caf50;       /* خلفية التقييم العالي (أخضر فاتح) */
--high-rating-text: #000000;     /* نص التقييم العالي */

--adult-badge-bg: #f44336;       /* خلفية شارة البالغين (أحمر فاتح) */
--adult-badge-text: #ffffff;     /* نص شارة البالغين */

--card-border: rgba(255, 255, 255, 0.12);  /* حدود الكروت */
--card-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);  /* ظل الكروت */
--card-hover-shadow: 0 8px 32px rgba(33, 150, 243, 0.25);  /* ظل المرور */
```

---

### 🧭 ألوان شريط التنقل (Navbar Colors)
```css
--navbar-bg: #1a1f29;            /* خلفية شريط التنقل (رمادي داكن) */
--navbar-text: #ffffff;          /* نص عناصر القائمة */
--navbar-hover: #64b5f6;         /* لون المرور بالماوس (أزرق فاتح) */
--navbar-active: #2196f3;        /* لون الصفحة النشطة (أزرق) */
```

---

### 🦶 ألوان التذييل (Footer Colors)
```css
--footer-bg: #13171f;            /* خلفية التذييل (أسود داكن) */
--footer-text: #e0e0e0;          /* نص التذييل (رمادي فاتح) */
--footer-link: #64b5f6;          /* لون الروابط (أزرق فاتح) */
--footer-border: rgba(255, 255, 255, 0.12);  /* الخط الفاصل */
```

---

### ⭐ ألوان شريط التقييم (Rating Bar Colors)
```css
--rating-bar-bg: #37474f;        /* خلفية شريط التقييم (رمادي-أزرق) */
--rating-high: #66bb6a;          /* تقييم عالي (أخضر فاتح) */
--rating-medium: #ffeb3b;        /* تقييم متوسط (أصفر فاتح) */
--rating-low: #ef5350;           /* تقييم منخفض (أحمر فاتح) */
```

---
---

## 📋 ملاحظات مهمة (Important Notes)

### كيفية الاستخدام:
```css
/* في CSS أو SCSS استخدم المتغيرات كالتالي: */
.my-element {
  background-color: var(--surface-bg);
  color: var(--primary-text);
  border: 1px solid var(--card-border);
}
```

### التبديل بين الأوضاع:
```html
<!-- أضف class="dark-mode" على الـ body للوضع الليلي -->
<body class="dark-mode">
  <!-- المحتوى هنا -->
</body>
```

### نصائح للتطوير:
1. ✅ استخدم دائماً المتغيرات بدلاً من الألوان المباشرة
2. ✅ احرص على التباين الكافي بين النص والخلفية
3. ✅ اختبر الألوان في كلا الوضعين (Light & Dark)
4. ✅ استخدم أدوات فحص التباين (Contrast Checker)

---

## 🎯 الأماكن الشائعة للاستخدام

| المتغير | الاستخدام الشائع |
|---------|------------------|
| `--surface-bg` | خلفية الـ body والصفحات |
| `--card-bg` | خلفية الكروت والـ containers |
| `--primary-text` | العناوين والنصوص الرئيسية |
| `--secondary-text` | الأوصاف والنصوص الفرعية |
| `--navbar-bg` | الـ header والـ navbar |
| `--footer-bg` | الـ footer وأسفل الصفحة |
| `--card-shadow` | الظلال للكروت والعناصر |
| `--primary-color` | الأزرار والروابط النشطة |

---

**📅 آخر تحديث:** November 2025  
**🔧 النسخة:** Angular Material v20  
**🎨 نظام التصميم:** Material Design 3