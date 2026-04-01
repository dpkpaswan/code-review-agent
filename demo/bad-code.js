// bad-code.js - intentionally vulnerable code for demo

const API_KEY = "sk_live_abc123supersecret"; // hardcoded secret
const DB_PASS = "admin1234"; // another secret

// SQL Injection vulnerability
function getUser(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.execute(query);
}

// XSS vulnerability
function renderComment(comment) {
  document.innerHTML = comment; // unsanitized input
}

// No error handling
async function fetchData(url) {
  const res = await fetch(url);
  const data = res.json(); // missing await
  return data;
}

// Function way too long + bad naming
function doStuff(a, b, c, d, e, f, g, h, i, j, k) {
  let x = a + b;
  let y = c * d;
  let z = e - f;
  let w = g / h;
  let v = i + j;
  let u = k * x;
  let t = y + z;
  let s = w - v;
  let r = u * t;
  let q = s + r;
  let p = q * 2;
  let o = p - 1;
  let n = o + 3;
  let m = n * 4;
  let l = m - 2;
  return l;
}

// Undefined variable access
function processOrder(order) {
  console.log(user.name); // user is not defined
  return order.total * TAX_RATE; // TAX_RATE not defined
}

// snake_case mixed with camelCase
const user_name = "deepak";
const userAge = 20;
const User_Email = "test@test.com";

module.exports = {
  getUser,
  renderComment,
  fetchData,
  doStuff,
  processOrder
};
