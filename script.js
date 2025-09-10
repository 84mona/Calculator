const currentEl = document.getElementById("display");

// گرفتن تمام دکمه‌های داخل کانتینر دکمه‌ها
const buttons = document.querySelectorAll(".buttons button");

// متغیر برای ذخیره عدد فعلی که کاربر وارد می‌کند
let current = "0";

// متغیر برای ذخیره عدد قبلی هنگام انجام عملیات
let previous = null;

// متغیر برای ذخیره عملگر انتخاب شده (+ - * /)
let operator = null;

// متغیر برای تشخیص اینکه آخرین عمل "=" زده شده یا نه
let justEvaluated = false;

/* ==========================
      تابع فرمت اعداد
============================ */
// این تابع عدد را با جداکننده هزارگان و حذف صفرهای اضافی قبل از عدد فرمت می‌کند
function formatNumber(num) {
  // جدا کردن قسمت صحیح و اعشاری عدد
  const [intPart, decPart] = String(num).split(".");

  // حذف صفرهای اضافه ابتدای عدد صحیح، نگه داشتن علامت منفی
  const cleanInt = intPart.replace(/^(-?)0+(?!\d)/, "$1");

  // اضافه کردن کاما برای جدا کردن هزارگان
  const withSep = cleanInt.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // اگر قسمت اعشاری وجود دارد، آن را به عدد اضافه کن، در غیر اینصورت فقط عدد صحیح را برگردان
  return decPart ? `${withSep}.${decPart}` : withSep;
}
    //  تابع بروزرسانی نمایشگر
function updateDisplay() {
  // نمایش عدد فعلی با فرمت خوانا در المنت currentEl
  currentEl.textContent = formatNumber(current);

  // نمایش تاریخچه (عدد قبلی + عملگر) در المنت historyEl
  // اگر عدد قبلی و عملگر موجود باشد نمایش بده، در غیر اینصورت خالی بگذار
  historyEl.textContent = previous !== null && operator
    ? `${formatNumber(previous)} ${operator}`
    : "";
}

//  اضافه کردن event listener به همه دکمه‌ها
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.textContent; // مقدار متن دکمه (عدد یا عملگر)

    // اگر دکمه عدد بود
    if (!isNaN(value)) {
      // اگر عدد فعلی 0 است یا آخرین عمل "=" زده شده
      if (current === "0" || justEvaluated) {
        current = value;     // جایگزین کردن عدد فعلی با عدد جدید
        justEvaluated = false; // حالت justEvaluated را خاموش کن
      } else {
        current += value;    // عدد جدید را به انتهای عدد فعلی اضافه کن
      }
    } 
    // اگر دکمه "." بود و اعشار هنوز موجود نیست
    else if (value === ".") {
      if (!current.includes(".")) {
        current += ".";     // نقطه اعشاری اضافه کن
      }
    } 
    // اگر دکمه "C" بود (پاک کردن همه)
    else if (value === "C") {
      current = "0";        // عدد فعلی صفر شود
      previous = null;      // عدد قبلی پاک شود
      operator = null;      // عملگر پاک شود
    } 
    // اگر دکمه "CE" بود (پاک کردن عدد فعلی فقط)
    else if (value === "CE") {
      current = "0";
    } 
    // اگر دکمه Backspace بود
    else if (value === "⌫") {
      current = current.slice(0, -1) || "0"; // حذف آخرین رقم، اگر خالی شد صفر شود
    } 
    // اگر دکمه عملگر بود (+ - * ÷)
    else if (["+", "-", "*", "÷"].includes(value)) {
      if (previous === null) {
        previous = current; // ذخیره عدد فعلی به عنوان عدد قبلی
      } else if (operator) {
        calculate();        // اگر عملگر قبلی وجود داشت، محاسبه کن
      }
      operator = value;     // ذخیره عملگر جدید
      justEvaluated = false;
      current = "0";        // آماده دریافت عدد بعدی
    } 
    // اگر دکمه "=" بود
    else if (value === "=") {
      if (operator && previous !== null) {
        calculate();        // محاسبه با عملگر و عدد قبلی
        operator = null;    // بعد از محاسبه عملگر پاک شود
        previous = null;    // عدد قبلی پاک شود
        justEvaluated = true; // علامت محاسبه انجام شد
      }
    } 
    // دکمه تغییر علامت
    else if (value === "±") {
      current = String(-parseFloat(current));
    } 
    // درصد
    else if (value === "%") {
      current = String(parseFloat(current) / 100);
    } 
    // ریشه دوم
    else if (value === "√x") {
      current = String(Math.sqrt(parseFloat(current)));
    } 
    // مربع عدد
    else if (value === "x²") {
      current = String(Math.pow(parseFloat(current), 2));
    } 
    // معکوس عدد
    else if (value === "1/x") {
      current = String(1 / parseFloat(current));
    }

    // بروزرسانی نمایشگر بعد از هر عملیات
    updateDisplay();
  });
});

//  تابع محاسبه با عملگر انتخاب شده
function calculate() {
  const prev = parseFloat(previous); // تبدیل عدد قبلی به float
  const curr = parseFloat(current);  // تبدیل عدد فعلی به float

  switch (operator) { // بسته به عملگر محاسبه انجام می‌شود
    case "+": current = String(prev + curr); break;
    case "-": current = String(prev - curr); break;
    case "*": current = String(prev * curr); break;
    case "÷": current = curr !== 0 ? String(prev / curr) : "خطا"; break; // تقسیم بر صفر خطا
  }

  previous = null; // بعد از محاسبه عدد قبلی پاک می‌شود
}

// بروزرسانی نمایشگر در ابتدا
updateDisplay();