/**
 * Seed script — creates test users and sets admin role
 * Run once: npx ts-node src/scripts/seed.ts
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function seed() {
  console.log('🌱 Seeding test users...');

  // 1. Create admin user
  const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
    email: 'admin@mailtest.com',
    password: 'Admin123!',
    email_confirm: true,
    user_metadata: { name: 'Admin User' },
  });
  if (adminError) {
    console.log('Admin user may already exist:', adminError.message);
  } else {
    // Set role to admin
    await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', adminData.user.id);
    console.log('✅ Admin user created: admin@mailtest.com / Admin123!');
  }

  // 2. Create customer user
  const { error: customerError } = await supabase.auth.admin.createUser({
    email: 'customer@mailtest.com',
    password: 'Customer123!',
    email_confirm: true,
    user_metadata: { name: 'Test Customer' },
  });
  if (customerError) {
    console.log('Customer user may already exist:', customerError.message);
  } else {
    console.log('✅ Customer user created: customer@mailtest.com / Customer123!');
  }

  console.log('✅ Seed complete!');
}

seed().catch(console.error);
