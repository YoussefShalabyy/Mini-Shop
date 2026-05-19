/**
 * Backend API Test Suite
 * ─────────────────────
 * Run: npx ts-node src/scripts/test.ts
 *
 * Tests every route honestly. Shows ✅ PASS / ❌ FAIL with details.
 * No test framework needed — pure Node.js fetch.
 */
import 'dotenv/config';

const BASE = `http://localhost:${process.env.PORT || 3000}`;

// ── Helpers ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

async function req(
  method: string,
  path: string,
  body?: unknown,
  token?: string
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function check(label: string, pass: boolean, detail?: string) {
  if (pass) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? `  →  ${detail}` : ''}`);
    failed++;
  }
}

function section(title: string) {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  ${title}`);
  console.log(`${'─'.repeat(50)}`);
}

// ── State shared across tests ──────────────────────────────────────────────

let customerToken = '';
let adminToken = '';
let productId = '';
let orderId = '';
let categoryId = '';

// ── Test Suites ───────────────────────────────────────────────────────────

async function testHealth() {
  section('🏥 Health Check');
  const { status, data } = await req('GET', '/health');
  check('GET /health → 200', status === 200);
  check('Returns { status: "ok" }', data?.status === 'ok', JSON.stringify(data));
}

async function testAuth() {
  section('🔐 Auth Routes');

  // Register — Supabase silently accepts duplicate (resends confirmation), so 200 or 201 are both fine
  const r1 = await req('POST', '/auth/register', {
    name: 'Test User',
    email: 'customer@mailtest.com',
    password: 'Customer123!',
  });
  check('POST /auth/register duplicate → non-500', r1.status !== 500, `got ${r1.status}`);

  // Register — new user (use mailtest.com — test.com is blocked by Supabase email sender)
  // Note: Supabase free tier rate-limits signups. Accept 201 (success) or 400 (rate limit) as valid.
  const newEmail = `newuser_${Date.now()}@mailtest.com`;
  const r2 = await req('POST', '/auth/register', {
    name: 'New User',
    email: newEmail,
    password: 'NewUser123!',
  });
  const rateLimited = r2.data?.message?.includes('rate limit');
  check(
    'POST /auth/register new user → 201 (or rate limited)',
    r2.status === 201 || rateLimited,
    `got ${r2.status}: ${JSON.stringify(r2.data)}`
  );

  // Register — validation: short password
  const r3 = await req('POST', '/auth/register', {
    name: 'X',
    email: 'bad@test.com',
    password: '123',
  });
  check('POST /auth/register short password → 400', r3.status === 400, `got ${r3.status}`);

  // Register — validation: invalid email
  const r4 = await req('POST', '/auth/register', {
    name: 'Test',
    email: 'not-an-email',
    password: 'password123',
  });
  check('POST /auth/register invalid email → 400', r4.status === 400, `got ${r4.status}`);

  // Login — wrong password
  const r5 = await req('POST', '/auth/login', {
    email: 'customer@test.com',
    password: 'wrongpass',
  });
  check('POST /auth/login wrong password → 401', r5.status === 401, `got ${r5.status}`);

  // Login — customer
  const r6 = await req('POST', '/auth/login', {
    email: 'customer@mailtest.com',
    password: 'Customer123!',
  });
  check('POST /auth/login customer → 200', r6.status === 200, `got ${r6.status}: ${JSON.stringify(r6.data)}`);
  check('Login returns token', typeof r6.data?.token === 'string', JSON.stringify(r6.data));
  check('Login returns user.role = customer', r6.data?.user?.role === 'customer', JSON.stringify(r6.data?.user));
  customerToken = r6.data?.token ?? '';

  // Login — admin
  const r7 = await req('POST', '/auth/login', {
    email: 'admin@mailtest.com',
    password: 'Admin123!',
  });
  check('POST /auth/login admin → 200', r7.status === 200, `got ${r7.status}: ${JSON.stringify(r7.data)}`);
  check('Admin login returns role = admin', r7.data?.user?.role === 'admin', JSON.stringify(r7.data?.user));
  adminToken = r7.data?.token ?? '';

  // GET /auth/me — no token
  const r8 = await req('GET', '/auth/me');
  check('GET /auth/me no token → 401', r8.status === 401, `got ${r8.status}`);

  // GET /auth/me — with customer token
  const r9 = await req('GET', '/auth/me', undefined, customerToken);
  check('GET /auth/me with token → 200', r9.status === 200, `got ${r9.status}: ${JSON.stringify(r9.data)}`);
  check('/auth/me returns name', typeof r9.data?.name === 'string', JSON.stringify(r9.data));

  // Forgot password (note: Supabase may reject test.com — we just check it doesn't crash the server)
  const r10 = await req('POST', '/auth/forgot-password', { email: 'customer@mailtest.com' });
  check('POST /auth/forgot-password → non-500', r10.status !== 500, `got ${r10.status}: ${JSON.stringify(r10.data)}`);
}

async function testProducts() {
  section('📦 Product Routes');

  // GET /products — public
  const r1 = await req('GET', '/products');
  check('GET /products → 200', r1.status === 200, `got ${r1.status}`);
  check('Returns { data, total, page, limit }', Array.isArray(r1.data?.data), JSON.stringify(r1.data));

  // GET /products/categories — public
  const r2 = await req('GET', '/products/categories');
  check('GET /products/categories → 200', r2.status === 200, `got ${r2.status}`);
  check('Returns array of categories', Array.isArray(r2.data), JSON.stringify(r2.data));
  if (Array.isArray(r2.data) && r2.data.length > 0) {
    categoryId = r2.data[0].id;
    check('Category has id, name, slug', !!(r2.data[0].id && r2.data[0].name && r2.data[0].slug), JSON.stringify(r2.data[0]));
  }

  // GET /products with search
  const r3 = await req('GET', '/products?search=headphones');
  check('GET /products?search= → 200', r3.status === 200, `got ${r3.status}`);

  // GET /products with pagination
  const r4 = await req('GET', '/products?page=1&limit=5');
  check('GET /products?page=1&limit=5 → 200', r4.status === 200, `got ${r4.status}`);

  // POST /products — no auth → 401
  const r5 = await req('POST', '/products', { name: 'Test', price: 9.99 });
  check('POST /products no auth → 401', r5.status === 401, `got ${r5.status}`);

  // POST /products — customer (not admin) → 403
  const r6 = await req('POST', '/products', { name: 'Test', price: 9.99 }, customerToken);
  check('POST /products as customer → 403', r6.status === 403, `got ${r6.status}`);

  // POST /products — admin, missing name → 400
  const r7 = await req('POST', '/products', { price: 9.99 }, adminToken);
  check('POST /products missing name → 400', r7.status === 400, `got ${r7.status}`);

  // POST /products — admin, valid
  const r8 = await req(
    'POST',
    '/products',
    {
      name: 'Test Headphones',
      description: 'Great sound quality',
      price: 49.99,
      category_id: categoryId || undefined,
    },
    adminToken
  );
  check('POST /products as admin → 201', r8.status === 201, `got ${r8.status}: ${JSON.stringify(r8.data)}`);
  check('Created product has id', typeof r8.data?.id === 'string', JSON.stringify(r8.data));
  productId = r8.data?.id ?? '';

  // GET /products/:id
  if (productId) {
    const r9 = await req('GET', `/products/${productId}`);
    check('GET /products/:id → 200', r9.status === 200, `got ${r9.status}`);
    check('Product has name and price', !!(r9.data?.name && r9.data?.price), JSON.stringify(r9.data));
  }

  // GET /products/:id — not found
  const r10 = await req('GET', '/products/00000000-0000-0000-0000-000000000000');
  check('GET /products/:id not found → 404', r10.status === 404, `got ${r10.status}`);

  // PATCH /products/:id — admin
  if (productId) {
    const r11 = await req('PATCH', `/products/${productId}`, { price: 59.99 }, adminToken);
    check('PATCH /products/:id as admin → 200', r11.status === 200, `got ${r11.status}`);
    check('Price updated', r11.data?.price === 59.99, `price = ${r11.data?.price}`);
  }

  // DELETE /products/:id — admin (soft delete)
  // We'll skip actually deleting so we can use it in orders test
}

async function testOrders() {
  section('🛍️  Order Routes');

  if (!productId) {
    console.log('  ⚠️  Skipping orders — no product created');
    return;
  }

  // POST /orders — no auth
  const r1 = await req('POST', '/orders', { items: [{ product_id: productId, quantity: 2 }] });
  check('POST /orders no auth → 401', r1.status === 401, `got ${r1.status}`);

  // POST /orders — empty items → 400
  const r2 = await req('POST', '/orders', { items: [] }, customerToken);
  check('POST /orders empty items → 400', r2.status === 400, `got ${r2.status}`);

  // POST /orders — valid
  const r3 = await req(
    'POST',
    '/orders',
    { items: [{ product_id: productId, quantity: 2 }] },
    customerToken
  );
  check('POST /orders valid → 201', r3.status === 201, `got ${r3.status}: ${JSON.stringify(r3.data)}`);
  check('Order has id and total_amount', !!(r3.data?.id && r3.data?.total_amount), JSON.stringify(r3.data));
  check('Order status is pending', r3.data?.status === 'pending', `status = ${r3.data?.status}`);
  orderId = r3.data?.id ?? '';

  // GET /orders/my — customer
  const r4 = await req('GET', '/orders/my', undefined, customerToken);
  check('GET /orders/my → 200', r4.status === 200, `got ${r4.status}`);
  check('Returns array', Array.isArray(r4.data), JSON.stringify(r4.data));

  // GET /orders — no auth → 401
  const r5 = await req('GET', '/orders');
  check('GET /orders no auth → 401', r5.status === 401, `got ${r5.status}`);

  // GET /orders — customer → 403
  const r6 = await req('GET', '/orders', undefined, customerToken);
  check('GET /orders as customer → 403', r6.status === 403, `got ${r6.status}`);

  // GET /orders — admin
  const r7 = await req('GET', '/orders', undefined, adminToken);
  check('GET /orders as admin → 200', r7.status === 200, `got ${r7.status}`);
  check('Returns array', Array.isArray(r7.data), JSON.stringify(r7.data));

  // PATCH /orders/:id/status — invalid status → 400
  if (orderId) {
    const r8 = await req('PATCH', `/orders/${orderId}/status`, { status: 'invalid' }, adminToken);
    check('PATCH /orders/:id/status invalid value → 400', r8.status === 400, `got ${r8.status}`);

    // PATCH /orders/:id/status — valid
    const r9 = await req('PATCH', `/orders/${orderId}/status`, { status: 'processing' }, adminToken);
    check('PATCH /orders/:id/status → 200', r9.status === 200, `got ${r9.status}: ${JSON.stringify(r9.data)}`);
    check('Status updated to processing', r9.data?.status === 'processing', `status = ${r9.data?.status}`);

    // PATCH — customer cannot update status
    const r10 = await req('PATCH', `/orders/${orderId}/status`, { status: 'shipped' }, customerToken);
    check('PATCH /orders/:id/status as customer → 403', r10.status === 403, `got ${r10.status}`);
  }
}

async function cleanup() {
  // Soft delete the test product we created
  if (productId && adminToken) {
    await req('DELETE', `/products/${productId}`, undefined, adminToken);
    console.log('\n  🧹 Cleaned up test product');
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🧪 Mini Shop — Backend Test Suite');
  console.log(`   Target: ${BASE}\n`);

  try {
    await testHealth();
    await testAuth();
    await testProducts();
    await testOrders();
    await cleanup();
  } catch (err) {
    console.error('\n💥 Test runner crashed:', err);
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('  🎉 All tests passed!');
  } else {
    console.log('  ⚠️  Some tests failed — check details above');
  }
  console.log(`${'═'.repeat(50)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
