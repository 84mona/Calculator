// ===== متغیرهای اصلی =====
const currentEl = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

// ===== توابع =====

// فرمت عدد برای نمایش
function formatNumber(num) {
  const [intPart, decPart] = String(num).split(".");
  const cleanInt = intPart.replace(/^(-?)0+(?!\d)/, "$1");
  const withSep = cleanInt.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart ? `${withSep}.${decPart}` : withSep;
}

// بروزرسانی نمایشگر
function updateDisplay() {
  currentEl.textContent = formatNumber(current);
}

// پاک کردن کل یا عدد فعلی
function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
}

function clearEntry() {
  current = "0";
}

// حذف آخرین رقم
function backspace() {
  current = current.slice(0, -1) || "0";
}

// تغییر علامت
function toggleSign() {
  current = String(-parseFloat(current));
}

// درصد
function percent() {
  current = String(parseFloat(current) / 100);
}
// ریشه دوم
function squareRoot() {
  current = String(Math.sqrt(parseFloat(current)));
}

// مربع
function square() {
  current = String(Math.pow(parseFloat(current), 2));
}

// معکوس عدد
function reciprocal() {
  current = String(1 / parseFloat(current));
}

// ذخیره عملگر و آماده عدد بعدی
function setOperator(op) {
  if (previous === null) {
    previous = current;
  } else if (operator) {
    calculate();
  }
  operator = op;
  justEvaluated = false;
  current = "0";
}

// محاسبه عدد نهایی
function calculate() {
  const prev = parseFloat(previous);
  const curr = parseFloat(current);

  switch (operator) {
    case "+": current = String(prev + curr); break;
    case "-": current = String(prev - curr); break;
    case "*": current = String(prev * curr); break;
    case "÷": current = curr !== 0 ? String(prev / curr) : "خطا"; break;
  }

  previous = null;
}

// دریافت ورودی عدد یا نقطه
function inputNumber(value) {
  if (!isNaN(value)) {
    if (current === "0" || justEvaluated) {
      current = value;
      justEvaluated = false;
    } else {
      current += value;
    }
  } else if (value === ".") {
    if (!current.includes(".")) current += ".";
  }
}

// پردازش کلیک دکمه
function handleButton(value) {
  switch (value) {
    case "C": clearAll(); break;
    case "CE": clearEntry(); break;
    case "⌫": backspace(); break;
    case "+/-": toggleSign(); break;
    case "%": percent(); break;
    case "√x": squareRoot(); break;
    case "x²": square(); break;
    case "1/x": reciprocal(); break;
    case "+": case "-": case "*": case "÷": setOperator(value); break;
    case "=": if (operator && previous !== null) { calculate(); operator = null; previous = null; justEvaluated = true; } break;
    default: inputNumber(value); break;
  }
  updateDisplay();
}

// اضافه کردن event listener به همه دکمه‌ها
buttons.forEach(btn => {
  btn.addEventListener("click", () => handleButton(btn.textContent));
});

// بروزرسانی نمایشگر در ابتدا
updateDisplay();