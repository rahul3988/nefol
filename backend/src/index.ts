import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Pool } from 'pg'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

const app = express()
app.use(express.json())

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: (_origin, cb) => cb(null, true), credentials: true }))

// Create HTTP server and Socket.IO
const server = createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: (_origin, cb) => cb(null, true),
    methods: ['GET', 'POST']
  }
})

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/nefol'
const pool = new Pool({ connectionString })

// Create a simple db object for compatibility
const db = {
  query: async (text: string, params?: any[]) => {
    try {
      const result = await pool.query(text, params)
      return result
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  }
}

function getAdminConnectionString(target: string | undefined): string | undefined {
  if (!target) return undefined
  try {
    const url = new URL(target)
    // Switch to default admin DB 'postgres' to manage/create target DB
    url.pathname = '/postgres'
    return url.toString()
  } catch {
    return target
  }
}

// Ensure base tables exist
async function ensureSchema() {
  await pool.query(`
    create table if not exists products (
      id serial primary key,
      slug text unique not null,
      title text not null,
      category text default '',
      price text default '',
      list_image text default '',
      description text default '',
      details jsonb default '{}'::jsonb,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
    
    -- Ensure details column exists (for existing tables)
    alter table products add column if not exists details jsonb default '{}'::jsonb;
    
    -- Ensure profile_photo column exists (for existing users table)
    alter table users add column if not exists profile_photo text;
    
    create table if not exists users (
      id serial primary key,
      name text not null,
      email text unique not null,
      password text not null,
      phone text,
      address jsonb,
      profile_photo text,
      loyalty_points integer default 0,
      total_orders integer default 0,
      member_since timestamptz default now(),
      is_verified boolean default false,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
    
    create table if not exists videos (
      id serial primary key,
      title text not null,
      description text not null,
      video_url text not null,
      redirect_url text not null,
      price text not null,
      size text not null check (size in ('small', 'medium', 'large')),
      thumbnail_url text not null,
      video_type text not null default 'url' check (video_type in ('local', 'instagram', 'facebook', 'youtube', 'url')),
      is_active boolean default true,
      views integer default 0,
      likes integer default 0,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
    create table if not exists product_images (
      id serial primary key,
      product_id integer not null references products(id) on delete cascade,
      url text not null,
      created_at timestamptz default now()
    );
    create table if not exists orders (
      id serial primary key,
      order_number text unique not null,
      customer_name text not null,
      customer_email text not null,
      shipping_address jsonb not null,
      items jsonb not null,
      subtotal numeric(12,2) not null,
      shipping numeric(12,2) not null default 0,
      tax numeric(12,2) not null default 0,
      total numeric(12,2) not null,
      status text not null default 'created',
      payment_method text,
      payment_type text,
      created_at timestamptz default now()
    );
    
    -- Finance tables
    create table if not exists invoices (
      id serial primary key,
      invoice_number text unique not null,
      customer_name text not null,
      customer_email text not null,
      order_id text not null,
      status text not null default 'draft',
      amount numeric(12,2) not null,
      tax numeric(12,2) not null default 0,
      total numeric(12,2) not null,
      due_date date not null,
      items jsonb not null,
      notes text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
    
    create table if not exists tax_rates (
      id serial primary key,
      name text not null,
      rate numeric(5,2) not null,
      type text not null check (type in ('percentage', 'fixed')),
      region text not null,
      is_active boolean not null default true,
      created_at timestamptz default now()
    );
    
    create table if not exists tax_rules (
      id serial primary key,
      name text not null,
      conditions jsonb not null,
      tax_rate_ids jsonb not null,
      priority integer not null default 1,
      is_active boolean not null default true,
      created_at timestamptz default now()
    );
    
    create table if not exists returns (
      id serial primary key,
      return_number text unique not null,
      order_id text not null,
      customer_name text not null,
      customer_email text not null,
      reason text not null,
      status text not null default 'pending',
      items jsonb not null,
      total_amount numeric(12,2) not null,
      refund_amount numeric(12,2) not null,
      notes text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
    
    create table if not exists payment_methods (
      id serial primary key,
      name text not null,
      type text not null check (type in ('credit_card', 'debit_card', 'upi', 'netbanking', 'wallet', 'cod')),
      is_active boolean not null default true,
      processing_fee numeric(5,2) not null default 0,
      min_amount numeric(12,2) not null default 0,
      max_amount numeric(12,2) not null default 999999,
      supported_regions jsonb not null default '[]',
      created_at timestamptz default now()
    );
    
    create table if not exists payment_gateways (
      id serial primary key,
      name text not null,
      type text unique not null check (type in ('cod', 'razorpay', 'easybuzz', 'phonepe', 'googlepay', 'paytm', 'navi', 'bhim', 'stripe', 'paypal', 'payu', 'instamojo')),
      is_active boolean not null default true,
      api_key text not null,
      secret_key text not null,
      webhook_url text not null,
      merchant_id text,
      processing_fee_percentage numeric default 0,
      processing_fee_fixed numeric default 0,
      min_amount numeric default 0,
      max_amount numeric default 999999,
      supported_methods jsonb not null default '[]',
      created_at timestamptz default now()
    );
    
    -- Add merchant_id column if it doesn't exist
    alter table payment_gateways add column if not exists merchant_id text;
    
    -- Add processing fee columns if they don't exist
    alter table payment_gateways add column if not exists processing_fee_percentage numeric default 0;
    alter table payment_gateways add column if not exists processing_fee_fixed numeric default 0;
    alter table payment_gateways add column if not exists min_amount numeric default 0;
    alter table payment_gateways add column if not exists max_amount numeric default 999999;
    
    -- Add payment columns to orders table if they don't exist
    alter table orders add column if not exists payment_method text;
    alter table orders add column if not exists payment_type text;
    
    -- Add updated_at column to orders table if it doesn't exist
    alter table orders add column if not exists updated_at timestamptz default now();
    
    -- Add video_type column to videos table if it doesn't exist
    alter table videos add column if not exists video_type text default 'url' check (video_type in ('local', 'instagram', 'facebook', 'youtube', 'url'));
    
    -- Update check constraint to include COD
    do $$ 
    begin
      if exists (select 1 from pg_constraint where conname = 'payment_gateways_type_check') then
        alter table payment_gateways drop constraint payment_gateways_type_check;
      end if;
      alter table payment_gateways add constraint payment_gateways_type_check 
        check (type in ('cod', 'razorpay', 'easybuzz', 'phonepe', 'googlepay', 'paytm', 'navi', 'bhim', 'stripe', 'paypal', 'payu', 'instamojo'));
    end $$;
    
    create table if not exists payment_transactions (
      id serial primary key,
      transaction_id text unique not null,
      order_id text not null,
      customer_name text not null,
      amount numeric(12,2) not null,
      method text not null,
      status text not null default 'pending',
      gateway text not null,
      created_at timestamptz default now(),
      processed_at timestamptz
    );
    
    -- Customer Engagement Features Tables
    create table if not exists loyalty_program (
      id serial primary key,
      name text not null,
      description text,
      points_per_rupee numeric default 1,
      referral_bonus numeric default 100,
      vip_threshold numeric default 1000,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists affiliate_program (
      id serial primary key,
      name text not null,
      commission_rate numeric default 5,
      cookie_duration integer default 30,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists cashback_system (
      id serial primary key,
      name text not null,
      cashback_rate numeric default 2,
      min_order_amount numeric default 500,
      max_cashback numeric default 100,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists email_campaigns (
      id serial primary key,
      name text not null,
      subject text not null,
      content text,
      target_audience text,
      status text default 'draft',
      created_at timestamptz default now()
    );
    
    create table if not exists sms_campaigns (
      id serial primary key,
      name text not null,
      message text not null,
      target_audience text,
      status text default 'draft',
      created_at timestamptz default now()
    );
    
    create table if not exists push_notifications (
      id serial primary key,
      title text not null,
      message text not null,
      target_audience text,
      status text default 'draft',
      created_at timestamptz default now()
    );
    
    create table if not exists whatsapp_chat (
      id serial primary key,
      phone_number text not null,
      message text,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists live_chat (
      id serial primary key,
      customer_name text not null,
      message text,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists analytics_data (
      id serial primary key,
      metric_name text not null,
      metric_value numeric,
      date_recorded date default current_date,
      created_at timestamptz default now()
    );
    
    create table if not exists forms (
      id serial primary key,
      name text not null,
      fields jsonb,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists workflows (
      id serial primary key,
      name text not null,
      triggers jsonb,
      actions jsonb,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists customer_segments (
      id serial primary key,
      name text not null,
      criteria jsonb,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists customer_journeys (
      id serial primary key,
      customer_id integer,
      journey_step text,
      timestamp timestamptz default now(),
      created_at timestamptz default now()
    );
    
    create table if not exists actionable_insights (
      id serial primary key,
      insight_type text not null,
      description text,
      recommendation text,
      priority text default 'medium',
      created_at timestamptz default now()
    );
    
    create table if not exists ai_features (
      id serial primary key,
      feature_name text not null,
      feature_type text,
      configuration jsonb,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists journey_funnels (
      id serial primary key,
      funnel_name text not null,
      steps jsonb,
      conversion_rate numeric,
      created_at timestamptz default now()
    );
    
    create table if not exists personalization_rules (
      id serial primary key,
      rule_name text not null,
      conditions jsonb,
      actions jsonb,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists custom_audiences (
      id serial primary key,
      audience_name text not null,
      criteria jsonb,
      size integer,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    create table if not exists omni_channel_campaigns (
      id serial primary key,
      campaign_name text not null,
      channels jsonb,
      content jsonb,
      status text default 'draft',
      created_at timestamptz default now()
    );
    
    create table if not exists api_configurations (
      id serial primary key,
      name text not null,
      category text not null,
      fields jsonb,
      status text default 'active',
      created_at timestamptz default now()
    );
    
    -- Order Delivery and Review System
    create table if not exists order_delivery_status (
      id serial primary key,
      order_id text not null,
      status text not null, -- pending, shipped, delivered, failed
      tracking_number text,
      carrier text default 'shiprocket',
      estimated_delivery_date date,
      actual_delivery_date date,
      delivery_address jsonb,
      notes text,
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
    
    create table if not exists product_reviews (
      id serial primary key,
      order_id text not null,
      product_id integer not null,
      customer_email text not null,
      customer_name text not null,
      rating integer not null check (rating >= 1 and rating <= 5),
      title text,
      review_text text,
      images jsonb default '[]',
      is_verified boolean default false,
      is_featured boolean default false,
      points_awarded integer default 1000,
      status text default 'pending', -- pending, approved, rejected
      created_at timestamptz default now(),
      updated_at timestamptz default now()
    );
    
    create table if not exists delivery_notifications (
      id serial primary key,
      order_id text not null,
      customer_email text not null,
      notification_type text not null, -- delivery_popup, delivery_email, review_request
      sent_at timestamptz default now(),
      status text default 'sent', -- sent, delivered, failed
      response_data jsonb
    );
    
    create table if not exists shiprocket_config (
      id serial primary key,
      api_key text not null,
      api_secret text not null,
      webhook_url text,
      pickup_address jsonb,
      is_active boolean default true,
      created_at timestamptz default now()
    );
    
    create table if not exists shiprocket_shipments (
      id serial primary key,
      order_id text not null,
      shipment_id text,
      awb_code text,
      courier_name text,
      tracking_url text,
      status text,
      created_at timestamptz default now()
    );
    
    -- Discounts and Promotions
    create table if not exists discounts (
      id serial primary key,
      name text not null,
      code text unique not null,
      type text not null check (type in ('percentage', 'fixed', 'free_shipping')),
      value numeric not null,
      min_amount numeric default 0,
      max_amount numeric default 999999,
      usage_limit integer,
      valid_from timestamptz default now(),
      valid_until timestamptz,
      is_active boolean default true,
      created_at timestamptz default now()
    );
    
    create table if not exists discount_usage (
      id serial primary key,
      discount_id integer not null references discounts(id) on delete cascade,
      order_id text not null,
      customer_email text not null,
      used_at timestamptz default now()
    );
    
    create or replace function set_updated_at()
    returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
    drop trigger if exists trg_products_updated_at on products;
    create trigger trg_products_updated_at before update on products
    for each row execute procedure set_updated_at();
  `)

  // Insert default payment gateways including COD
  await pool.query(`
    insert into payment_gateways (name, type, api_key, secret_key, webhook_url, merchant_id, processing_fee_percentage, processing_fee_fixed, min_amount, max_amount, supported_methods)
    values 
      ('Cash on Delivery', 'cod', 'cod_key', 'cod_secret', 'https://nefol.com/webhook/cod', 'cod_merchant', 0, 0, 1, 50000, '["cod"]'),
      ('Razorpay', 'razorpay', 'rzp_test_key', 'rzp_test_secret', 'https://nefol.com/webhook/razorpay', 'rzp_merchant_123', 2.5, 0, 1, 100000, '["card", "netbanking", "upi", "wallet"]'),
      ('Easybuzz', 'easybuzz', 'eb_test_key', 'eb_test_secret', 'https://nefol.com/webhook/easybuzz', 'eb_merchant_123', 2.0, 0, 1, 100000, '["card", "netbanking", "upi"]'),
      ('PhonePe', 'phonepe', 'pp_test_key', 'pp_test_secret', 'https://nefol.com/webhook/phonepe', 'pp_merchant_123', 1.8, 0, 1, 100000, '["upi", "card", "netbanking"]'),
      ('Google Pay', 'googlepay', 'gp_test_key', 'gp_test_secret', 'https://nefol.com/webhook/googlepay', 'gp_merchant_123', 1.5, 0, 1, 100000, '["upi", "card"]'),
      ('Paytm', 'paytm', 'pt_test_key', 'pt_test_secret', 'https://nefol.com/webhook/paytm', 'pt_merchant_123', 2.2, 0, 1, 100000, '["upi", "card", "netbanking", "wallet"]'),
      ('Navi', 'navi', 'nv_test_key', 'nv_test_secret', 'https://nefol.com/webhook/navi', 'nv_merchant_123', 1.9, 0, 1, 100000, '["upi", "card"]'),
      ('BHIM', 'bhim', 'bh_test_key', 'bh_test_secret', 'https://nefol.com/webhook/bhim', 'bh_merchant_123', 1.7, 0, 1, 100000, '["upi"]')
    on conflict (type) do nothing
  `)

  console.log('Database schema ensured with COD payment option')
}
// File uploads
const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, safeName)
  }
})
const upload = multer({ storage })
app.use('/uploads', express.static(uploadDir))

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = (req as any).file as Express.Multer.File | undefined
  if (!file) return res.status(400).json({ error: 'No file uploaded' })
  const url = `/uploads/${file.filename}`
  res.json({ url, filename: file.filename })
})

// Serve product details CSV as JSON for PDP and pricing
app.get('/api/products-csv', async (_req, res) => {
  try {
    const csvPath = path.resolve(process.cwd(), '..', 'product details.csv')
    if (!fs.existsSync(csvPath)) {
      return res.json([])
    }
    const raw = fs.readFileSync(csvPath, 'utf8')
    const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0)
    if (lines.length === 0) return res.json([])
    const headerLine = lines[0]
    const headers = headerLine.split(',').map(h => h.trim())
    const rows = [] as any[]
    for (let i = 1; i < lines.length; i++) {
      // basic CSV split (no quoted fields support). Expand later if needed.
      const parts = lines[i].split(',')
      if (parts.every(p => p.trim() === '')) continue
      const obj: any = {}
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = (parts[j] ?? '').trim()
      }
      rows.push(obj)
    }
    res.json(rows)
  } catch (err) {
    console.error('Failed to read products CSV:', err)
    res.status(500).json({ error: 'Failed to read products CSV' })
  }
})

// Upload CSV to replace current product details CSV
app.post('/api/products-csv/upload', upload.single('file'), async (req, res) => {
  try {
    const file = (req as any).file as Express.Multer.File | undefined
    if (!file) return res.status(400).json({ error: 'No file uploaded' })
    const destPath = path.resolve(process.cwd(), '..', 'product details.csv')
    fs.copyFileSync(file.path, destPath)
    res.json({ ok: true })
  } catch (err) {
    console.error('Failed to upload CSV:', err)
    res.status(500).json({ error: 'Failed to upload CSV' })
  }
})


// Products CRUD
app.get('/api/products', async (_req, res) => {
  try {
    const { rows } = await pool.query('select * from products order by created_at desc')
    // Fetch PDP images for each product
    for (const product of rows) {
      const { rows: imageRows } = await pool.query('select url from product_images where product_id = $1 order by created_at', [product.id])
      product.pdp_images = imageRows.map(r => r.url)
    }
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('select * from products where id = $1', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// Product by slug
app.get('/api/products/slug/:slug', async (req, res) => {
  try {
    const { rows } = await pool.query('select * from products where slug = $1', [req.params.slug])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    const product = rows[0]
    // Fetch PDP images
    const { rows: imageRows } = await pool.query('select url from product_images where product_id = $1 order by created_at', [product.id])
    product.pdp_images = imageRows.map(r => r.url)
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

app.post('/api/products', async (req, res) => {
  try {
    console.log('POST /api/products - Request body:', req.body)
    const { slug, title, category = '', price = '', listImage = '', description = '', details = {} } = req.body || {}
    console.log('Extracted fields:', { slug, title, category, price, listImage, description, details })
    
    if (!slug || !title) {
      console.log('Missing required fields: slug or title')
      return res.status(400).json({ error: 'slug and title are required' })
    }
    
    console.log('About to execute database query...')
    const { rows } = await pool.query(
      'insert into products (slug, title, category, price, list_image, description, details) values ($1,$2,$3,$4,$5,$6,$7) returning *',
      [slug, title, category, price, listImage, description, JSON.stringify(details)]
    )
    console.log('Database query successful, created product:', rows[0])
    res.status(201).json(rows[0])
  } catch (err: any) {
    console.error('POST /api/products - Error details:', err)
    console.error('Error code:', err?.code)
    console.error('Error message:', err?.message)
    console.error('Error stack:', err?.stack)
    
    if (err?.code === '23505') return res.status(409).json({ error: 'slug must be unique' })
    res.status(500).json({ error: 'Failed to create product' })
  }
})

app.put('/api/products/:id', async (req, res) => {
  try {
    const body = req.body || {}
    const slug = body.slug
    const title = body.title
    const category = body.category
    const price = body.price
    const listImage = body.listImage ?? body.list_image
    const description = body.description
    const details = body.details

    const { rows } = await pool.query(
      `update products set
         slug = coalesce($1, slug),
         title = coalesce($2, title),
         category = coalesce($3, category),
         price = coalesce($4, price),
         list_image = coalesce($5, list_image),
         description = coalesce($6, description),
         details = coalesce($7, details)
       where id = $8 returning *`,
      [
        slug ?? null,
        title ?? null,
        category ?? null,
        price ?? null,
        listImage ?? null,
        description ?? null,
        details ? JSON.stringify(details) : null,
        req.params.id
      ]
    )
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('Failed to update product:', err)
    res.status(500).json({ error: 'Failed to update product' })
  }
})
// Attach PDP images to a product
app.post('/api/products/:id/images', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const images: string[] = Array.isArray(req.body?.images) ? req.body.images : []
    if (!images.length) return res.status(400).json({ error: 'No images provided' })
    const values: any[] = []
    const rows = images.map((u, i) => `($1, $${i + 2})`).join(',')
    values.push(id, ...images)
    await pool.query(`insert into product_images (product_id, url) values ${rows}`, values)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to save images' })
  }
})


app.delete('/api/products/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('delete from products where id = $1', [req.params.id])
    if (!rowCount) return res.status(404).json({ error: 'Not found' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

app.post('/api/test-create', async (req, res) => {
  try {
    console.log('Test create - Request body:', req.body)
    const { slug, title } = req.body || {}
    
    if (!slug || !title) {
      return res.status(400).json({ error: 'slug and title are required' })
    }
    
    console.log('About to insert:', { slug, title })
    const { rows } = await pool.query(
      'insert into products (slug, title, category, price, list_image, description, details) values ($1,$2,$3,$4,$5,$6,$7) returning *',
      [slug, title, '', '', '', '', '{}']
    )
    console.log('Insert successful:', rows[0])
    res.status(201).json(rows[0])
  } catch (err: any) {
    console.error('Test create error:', err)
    res.status(500).json({ error: 'Test create failed', details: err.message })
  }
})

// Socket.IO event handlers for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join-admin', () => {
    socket.join('admin-panel')
    console.log('Admin panel connected')
  })

  socket.on('join-user', () => {
    socket.join('user-panel')
    console.log('User panel connected')
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const port = Number(process.env.PORT || 4000)
ensureSchema()
  .then(() => {
    server.listen(port, '0.0.0.0', () => {
      console.log(`Nefol API running on http://0.0.0.0:${port}`)
      console.log(`WebSocket server ready for real-time updates`)
    })
  })
  .catch((err) => {
    // If database does not exist, attempt to create it, then retry
    if ((err as any)?.code === '3D000') {
      const adminCstr = getAdminConnectionString(connectionString)
      if (!adminCstr) {
        console.error('DATABASE_URL missing; cannot create database')
        process.exit(1)
      }
      const adminPool = new Pool({ connectionString: adminCstr })
      let targetDb = 'nefol'
      try {
        const u = new URL(connectionString as string)
        targetDb = (u.pathname || '/').replace(/^\//, '') || 'nefol'
      } catch {}
      adminPool.query(`create database ${JSON.stringify(targetDb).replace(/^"|"$/g,'"')} `)
        .then(() => {
          console.log(`Created database '${targetDb}'. Retrying schema...`)
          return ensureSchema()
        })
        .then(() => {
          server.listen(port, () => {
            console.log(`Nefol API running on http://localhost:${port}`)
            console.log(`WebSocket server ready for real-time updates`)
          })
        })
        .catch((e) => {
          console.error('Failed to create database or ensure schema', e)
          process.exit(1)
        })
      return
    }
    console.error('Failed to ensure schema', err)
    process.exit(1)
  })

// Helper function to broadcast updates
function broadcastUpdate(type: string, data: any) {
  io.to('admin-panel').emit('update', { type, data })
  io.to('user-panel').emit('update', { type, data })
}

// ==================== CUSTOMER ENGAGEMENT FEATURES API ====================

// Loyalty Program APIs
app.get('/api/loyalty-program', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from loyalty_program 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loyalty program' })
  }
})

app.post('/api/loyalty-program', async (req, res) => {
  try {
    const { name, description, points_per_rupee, referral_bonus, vip_threshold } = req.body
    const { rows } = await pool.query(`
      insert into loyalty_program (name, description, points_per_rupee, referral_bonus, vip_threshold)
      values ($1, $2, $3, $4, $5)
      returning *
    `, [name, description, points_per_rupee, referral_bonus, vip_threshold])
    
    broadcastUpdate('loyalty_program_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create loyalty program' })
  }
})

// Affiliate Marketing APIs
app.get('/api/affiliate-program', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from affiliate_program 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch affiliate program' })
  }
})

app.post('/api/affiliate-program', async (req, res) => {
  try {
    const { name, commission_rate, cookie_duration, status } = req.body
    const { rows } = await pool.query(`
      insert into affiliate_program (name, commission_rate, cookie_duration, status)
      values ($1, $2, $3, $4)
      returning *
    `, [name, commission_rate, cookie_duration, status])
    
    broadcastUpdate('affiliate_program_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create affiliate program' })
  }
})

// Cashback System APIs
app.get('/api/cashback-system', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from cashback_system 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cashback system' })
  }
})

app.post('/api/cashback-system', async (req, res) => {
  try {
    const { name, cashback_rate, min_order_amount, max_cashback, status } = req.body
    const { rows } = await pool.query(`
      insert into cashback_system (name, cashback_rate, min_order_amount, max_cashback, status)
      values ($1, $2, $3, $4, $5)
      returning *
    `, [name, cashback_rate, min_order_amount, max_cashback, status])
    
    broadcastUpdate('cashback_system_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create cashback system' })
  }
})

// Email Marketing APIs
app.get('/api/email-marketing', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from email_campaigns 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch email campaigns' })
  }
})

app.post('/api/email-marketing', async (req, res) => {
  try {
    const { name, subject, content, target_audience, status } = req.body
    const { rows } = await pool.query(`
      insert into email_campaigns (name, subject, content, target_audience, status)
      values ($1, $2, $3, $4, $5)
      returning *
    `, [name, subject, content, target_audience, status])
    
    broadcastUpdate('email_campaign_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create email campaign' })
  }
})

// SMS Marketing APIs
app.get('/api/sms-marketing', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from sms_campaigns 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch SMS campaigns' })
  }
})

app.post('/api/sms-marketing', async (req, res) => {
  try {
    const { name, message, target_audience, status } = req.body
    const { rows } = await pool.query(`
      insert into sms_campaigns (name, message, target_audience, status)
      values ($1, $2, $3, $4)
      returning *
    `, [name, message, target_audience, status])
    
    broadcastUpdate('sms_campaign_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create SMS campaign' })
  }
})

// Push Notifications APIs
app.get('/api/push-notifications', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from push_notifications 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch push notifications' })
  }
})

app.post('/api/push-notifications', async (req, res) => {
  try {
    const { title, message, target_audience, status } = req.body
    const { rows } = await pool.query(`
      insert into push_notifications (title, message, target_audience, status)
      values ($1, $2, $3, $4)
      returning *
    `, [title, message, target_audience, status])
    
    broadcastUpdate('push_notification_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create push notification' })
  }
})

// WhatsApp Chat APIs
app.get('/api/whatsapp-chat', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from whatsapp_chat 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch WhatsApp chat' })
  }
})

app.post('/api/whatsapp-chat', async (req, res) => {
  try {
    const { phone_number, message, status } = req.body
    const { rows } = await pool.query(`
      insert into whatsapp_chat (phone_number, message, status)
      values ($1, $2, $3)
      returning *
    `, [phone_number, message, status])
    
    broadcastUpdate('whatsapp_chat_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create WhatsApp chat' })
  }
})

// Live Chat APIs
app.get('/api/live-chat', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from live_chat 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch live chat' })
  }
})

app.post('/api/live-chat', async (req, res) => {
  try {
    const { customer_name, message, status } = req.body
    const { rows } = await pool.query(`
      insert into live_chat (customer_name, message, status)
      values ($1, $2, $3)
      returning *
    `, [customer_name, message, status])
    
    broadcastUpdate('live_chat_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create live chat' })
  }
})

// Advanced Analytics APIs
app.get('/api/advanced-analytics', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from analytics_data 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics data' })
  }
})

// Form Builder APIs
app.get('/api/form-builder', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from forms 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forms' })
  }
})

app.post('/api/form-builder', async (req, res) => {
  try {
    const { name, fields, status } = req.body
    const { rows } = await pool.query(`
      insert into forms (name, fields, status)
      values ($1, $2, $3)
      returning *
    `, [name, JSON.stringify(fields), status])
    
    broadcastUpdate('form_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create form' })
  }
})

// Workflow Automation APIs
app.get('/api/workflow-automation', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from workflows 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflows' })
  }
})

app.post('/api/workflow-automation', async (req, res) => {
  try {
    const { name, triggers, actions, status } = req.body
    const { rows } = await pool.query(`
      insert into workflows (name, triggers, actions, status)
      values ($1, $2, $3, $4)
      returning *
    `, [name, JSON.stringify(triggers), JSON.stringify(actions), status])
    
    broadcastUpdate('workflow_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create workflow' })
  }
})

// Customer Segmentation APIs
app.get('/api/customer-segmentation', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from customer_segments 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer segments' })
  }
})

app.post('/api/customer-segmentation', async (req, res) => {
  try {
    const { name, criteria, status } = req.body
    const { rows } = await pool.query(`
      insert into customer_segments (name, criteria, status)
      values ($1, $2, $3)
      returning *
    `, [name, JSON.stringify(criteria), status])
    
    broadcastUpdate('customer_segment_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer segment' })
  }
})

// Journey Tracking APIs
app.get('/api/journey-tracking', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from customer_journeys 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer journeys' })
  }
})

// Actionable Analytics APIs
app.get('/api/actionable-analytics', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from actionable_insights 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch actionable insights' })
  }
})

// AI Box APIs
app.get('/api/ai-box', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from ai_features 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch AI features' })
  }
})

// Journey Funnel APIs
app.get('/api/journey-funnel', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from journey_funnels 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch journey funnels' })
  }
})

// AI Personalization APIs
app.get('/api/ai-personalization', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from personalization_rules 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch personalization rules' })
  }
})

// Custom Audience APIs
app.get('/api/custom-audience', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from custom_audiences 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch custom audiences' })
  }
})

// Omni Channel APIs
app.get('/api/omni-channel', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from omni_channel_campaigns 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch omni channel campaigns' })
  }
})

// API Manager APIs
app.get('/api/api-manager', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from api_configurations 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch API configurations' })
  }
})

// Cashback System APIs
app.get('/api/cashback/balance', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'No token provided' })
    
    const userId = token.split('_')[2] // Extract user ID from token
    const { rows } = await pool.query(`
      select loyalty_points as balance from users where id = $1
    `, [userId])
    
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' })
    res.json({ balance: rows[0].balance || 0 })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cashback balance' })
  }
})

// AI Personalization APIs
app.get('/api/ai-personalization/content', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'No token provided' })
    
    const userId = token.split('_')[2] // Extract user ID from token
    
    // Get user's order history for personalization
    const { rows: orders } = await pool.query(`
      select * from orders where customer_email = (
        select email from users where id = $1
      ) order by created_at desc limit 5
    `, [userId])
    
    // Generate personalized content based on user behavior
    const personalizedContent = {
      personalizedTitle: orders.length > 0 ? 'Recommended for You' : 'Buy Rewind Age Reversing Gel Creme',
      personalizedHeadline: orders.length > 0 ? 'Continue Your Skincare Journey' : 'Skin that looks 5 years younger in days',
      personalizedDescription: orders.length > 0 ? 'Based on your previous purchases, we recommend these products.' : 'Advanced peptides meet nature-powered care for youthful, resilient, hi-glaze skin.',
      recommendedProducts: orders.length > 0 ? orders.map(o => o.items).flat() : []
    }
    
    res.json(personalizedContent)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch personalized content' })
  }
})

// ==================== PAYMENT GATEWAYS API ====================

// Get all payment gateways
app.get('/api/payment-gateways', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from payment_gateways 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment gateways' })
  }
})

// Create payment gateway
app.post('/api/payment-gateways', async (req, res) => {
  try {
    const { name, type, api_key, secret_key, webhook_url, merchant_id, processing_fee_percentage, processing_fee_fixed, min_amount, max_amount, supported_methods } = req.body
    const { rows } = await pool.query(`
      insert into payment_gateways (name, type, api_key, secret_key, webhook_url, merchant_id, processing_fee_percentage, processing_fee_fixed, min_amount, max_amount, supported_methods)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning *
    `, [name, type, api_key, secret_key, webhook_url, merchant_id, processing_fee_percentage, processing_fee_fixed, min_amount, max_amount, JSON.stringify(supported_methods)])
    
    broadcastUpdate('payment_gateway_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment gateway' })
  }
})

// ==================== ORDER DELIVERY API ====================

// Get delivery status for order
app.get('/api/order-delivery/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const { rows } = await pool.query(`
      select * from order_delivery_status 
      where order_id = $1
      order by created_at desc
    `, [orderId])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch delivery status' })
  }
})

// Update delivery status
app.post('/api/order-delivery', async (req, res) => {
  try {
    const { order_id, status, tracking_number, carrier, estimated_delivery_date, delivery_address, notes } = req.body
    const { rows } = await pool.query(`
      insert into order_delivery_status (order_id, status, tracking_number, carrier, estimated_delivery_date, delivery_address, notes)
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *
    `, [order_id, status, tracking_number, carrier, estimated_delivery_date, JSON.stringify(delivery_address), notes])
    
    // Send delivery notification
    if (status === 'delivered') {
      await pool.query(`
        insert into delivery_notifications (order_id, customer_email, notification_type)
        select $1, customer_email, 'delivery_popup' from orders where order_number = $1
      `, [order_id])
      
      await pool.query(`
        insert into delivery_notifications (order_id, customer_email, notification_type)
        select $1, customer_email, 'delivery_email' from orders where order_number = $1
      `, [order_id])
      
      await pool.query(`
        insert into delivery_notifications (order_id, customer_email, notification_type)
        select $1, customer_email, 'review_request' from orders where order_number = $1
      `, [order_id])
    }
    
    broadcastUpdate('delivery_status_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update delivery status' })
  }
})

// ==================== PRODUCT REVIEWS API ====================

// Get product reviews
app.get('/api/product-reviews/:productId', async (req, res) => {
  try {
    const { productId } = req.params
    const { rows } = await pool.query(`
      select * from product_reviews 
      where product_id = $1 and status = 'approved'
      order by created_at desc
    `, [productId])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product reviews' })
  }
})

// Create product review
app.post('/api/product-reviews', async (req, res) => {
  try {
    const { order_id, product_id, customer_email, customer_name, rating, title, review_text, images } = req.body
    const { rows } = await pool.query(`
      insert into product_reviews (order_id, product_id, customer_email, customer_name, rating, title, review_text, images, points_awarded)
      values ($1, $2, $3, $4, $5, $6, $7, $8, 1000)
      returning *
    `, [order_id, product_id, customer_email, customer_name, rating, title, review_text, JSON.stringify(images)])
    
    broadcastUpdate('product_review_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product review' })
  }
})

// Approve/reject review
app.put('/api/product-reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params
    const { status } = req.body
    const { rows } = await pool.query(`
      update product_reviews 
      set status = $1, updated_at = now()
      where id = $2
      returning *
    `, [status, reviewId])
    
    broadcastUpdate('product_review_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product review' })
  }
})

// ==================== SHIPROCKET INTEGRATION API ====================

// Get Shiprocket configuration
app.get('/api/shiprocket-config', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from shiprocket_config 
      where is_active = true
      order by created_at desc
      limit 1
    `)
    res.json(rows[0] || null)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Shiprocket config' })
  }
})

// Update Shiprocket configuration
app.post('/api/shiprocket-config', async (req, res) => {
  try {
    const { api_key, api_secret, webhook_url, pickup_address } = req.body
    const { rows } = await pool.query(`
      insert into shiprocket_config (api_key, api_secret, webhook_url, pickup_address)
      values ($1, $2, $3, $4)
      returning *
    `, [api_key, api_secret, webhook_url, JSON.stringify(pickup_address)])
    
    broadcastUpdate('shiprocket_config_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update Shiprocket config' })
  }
})

// Create shipment
app.post('/api/shiprocket-shipment', async (req, res) => {
  try {
    const { order_id, shipment_id, awb_code, courier_name, tracking_url, status } = req.body
    const { rows } = await pool.query(`
      insert into shiprocket_shipments (order_id, shipment_id, awb_code, courier_name, tracking_url, status)
      values ($1, $2, $3, $4, $5, $6)
      returning *
    `, [order_id, shipment_id, awb_code, courier_name, tracking_url, status])
    
    broadcastUpdate('shipment_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create shipment' })
  }
})

// Get shipment tracking
app.get('/api/shipment-tracking/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const { rows } = await pool.query(`
      select * from shiprocket_shipments 
      where order_id = $1
      order by created_at desc
    `, [orderId])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipment tracking' })
  }
})

// ==================== DISCOUNTS API ====================

// Get all discounts
app.get('/api/discounts', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from discounts 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch discounts' })
  }
})

// Create discount
app.post('/api/discounts', async (req, res) => {
  try {
    const { name, code, type, value, min_amount, max_amount, usage_limit, valid_from, valid_until, is_active } = req.body
    const { rows } = await pool.query(`
      insert into discounts (name, code, type, value, min_amount, max_amount, usage_limit, valid_from, valid_until, is_active)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *
    `, [name, code, type, value, min_amount, max_amount, usage_limit, valid_from, valid_until, is_active])
    
    broadcastUpdate('discount_created', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create discount' })
  }
})

// Get discount usage
app.get('/api/discounts/usage', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select 
        d.id,
        d.name,
        d.code,
        d.usage_limit,
        count(du.id) as used_count,
        d.usage_limit - count(du.id) as remaining_count
      from discounts d
      left join discount_usage du on d.id = du.discount_id
      group by d.id, d.name, d.code, d.usage_limit
      order by d.created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch discount usage' })
  }
})

// ==================== AUTHENTICATION API ====================
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body
    
    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    // Create new user
    const result = await db.query(`
      INSERT INTO users (name, email, password, phone, address, loyalty_points, total_orders, member_since, is_verified)
      VALUES ($1, $2, $3, $4, $5, 0, 0, NOW(), false)
      RETURNING id, name, email, phone, address, loyalty_points, total_orders, member_since, is_verified
    `, [name, email, password, phone, JSON.stringify(address)])

    const user = result.rows[0]
    const token = `user_token_${user.id}_${Date.now()}`

    res.json({ user, token })
  } catch (err) {
    console.error('Signup failed:', err)
    res.status(500).json({ message: 'Signup failed' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password])
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const user = result.rows[0]
    const token = `user_token_${user.id}_${Date.now()}`

    res.json({ user, token })
  } catch (err) {
    console.error('Login failed:', err)
    res.status(500).json({ message: 'Login failed' })
  }
})

// ==================== USERS API ====================
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, phone, address, loyalty_points, total_orders, member_since, is_verified FROM users ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error('Failed to fetch users:', err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// ==================== VIDEOS API ====================
app.get('/api/videos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM videos ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    console.error('Failed to fetch videos:', err)
    res.status(500).json({ error: 'Failed to fetch videos' })
  }
})

app.post('/api/videos', async (req, res) => {
  try {
    const { title, description, video_url, redirect_url, price, size, thumbnail_url, is_active, video_type } = req.body
    
    const result = await db.query(
      'INSERT INTO videos (title, description, video_url, redirect_url, price, size, thumbnail_url, video_type, is_active, views, likes, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, 0, NOW()) RETURNING *',
      [title, description, video_url, redirect_url, price, size, thumbnail_url, video_type || 'url', is_active]
    )
    
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Failed to create video:', err)
    res.status(500).json({ error: 'Failed to create video' })
  }
})

app.put('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, video_url, redirect_url, price, size, thumbnail_url, is_active, video_type } = req.body
    
    const result = await db.query(
      'UPDATE videos SET title = $1, description = $2, video_url = $3, redirect_url = $4, price = $5, size = $6, thumbnail_url = $7, video_type = $8, is_active = $9, updated_at = NOW() WHERE id = $10 RETURNING *',
      [title, description, video_url, redirect_url, price, size, thumbnail_url, video_type || 'url', is_active, id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' })
    }
    
    res.json(result.rows[0])
  } catch (err) {
    console.error('Failed to update video:', err)
    res.status(500).json({ error: 'Failed to update video' })
  }
})

app.delete('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await db.query('DELETE FROM videos WHERE id = $1 RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' })
    }
    
    res.json({ message: 'Video deleted successfully' })
  } catch (err) {
    console.error('Failed to delete video:', err)
    res.status(500).json({ error: 'Failed to delete video' })
  }
})

// Get user profile
app.get('/api/users/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Extract user ID from token format: user_token_${user.id}_${Date.now()}
    const tokenParts = token.split('_')
    if (tokenParts.length < 3 || tokenParts[0] !== 'user' || tokenParts[1] !== 'token') {
      return res.status(401).json({ error: 'Invalid token format' })
    }
    
    const userId = tokenParts[2]
    const result = await db.query(`
      SELECT id, name, email, phone, address, profile_photo, loyalty_points, total_orders, member_since, is_verified
      FROM users WHERE id = $1
    `, [userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.rows[0]
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profile_photo: user.profile_photo,
      loyalty_points: user.loyalty_points,
      total_orders: user.total_orders,
      member_since: user.member_since
    })
  } catch (err) {
    console.error('Failed to fetch user profile:', err)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update user profile
app.put('/api/users/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Extract user ID from token format: user_token_${user.id}_${Date.now()}
    const tokenParts = token.split('_')
    if (tokenParts.length < 3 || tokenParts[0] !== 'user' || tokenParts[1] !== 'token') {
      return res.status(401).json({ error: 'Invalid token format' })
    }
    
    const userId = tokenParts[2]
    const { name, phone, address, profile_photo } = req.body

    const result = await db.query(`
      UPDATE users 
      SET name = $1, phone = $2, address = $3, profile_photo = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, name, email, phone, address, profile_photo, loyalty_points, total_orders, member_since, is_verified
    `, [name, phone, JSON.stringify(address), profile_photo || null, userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = result.rows[0]
    
    // Broadcast user profile update to admin panel
    broadcastUpdate('user_profile_updated', {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profile_photo: user.profile_photo,
      loyalty_points: user.loyalty_points,
      total_orders: user.total_orders,
      updated_at: new Date()
    })
    
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profile_photo: user.profile_photo,
      loyalty_points: user.loyalty_points,
      total_orders: user.total_orders,
      member_since: user.member_since
    })
  } catch (err) {
    console.error('Failed to update user profile:', err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Get user's saved cards
app.get('/api/users/saved-cards', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Extract user ID from token format: user_token_${user.id}_${Date.now()}
    const tokenParts = token.split('_')
    if (tokenParts.length < 3 || tokenParts[0] !== 'user' || tokenParts[1] !== 'token') {
      return res.status(401).json({ error: 'Invalid token format' })
    }
    
    const userId = tokenParts[2]
    
    // For now, return empty array - implement saved cards table later
    res.json([])
  } catch (err) {
    console.error('Failed to fetch saved cards:', err)
    res.status(500).json({ error: 'Failed to fetch saved cards' })
  }
})

// ==================== ORDERS API ====================

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select * from orders 
      order by created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Create order with auto-generated invoice and Shiprocket integration
app.post('/api/orders', async (req, res) => {
  try {
    const { order_number, customer_name, customer_email, shipping_address, items, subtotal, shipping, tax, total, status, payment_method, payment_type } = req.body
    
    // Create order
    const { rows } = await pool.query(`
      insert into orders (order_number, customer_name, customer_email, shipping_address, items, subtotal, shipping, tax, total, status, payment_method, payment_type)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      returning *
    `, [order_number, customer_name, customer_email, JSON.stringify(shipping_address), JSON.stringify(items), subtotal, shipping, tax, total, status, payment_method, payment_type])
    
    const order = rows[0]
    
    // Auto-generate invoice
    const invoiceNumber = 'INV-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30) // 30 days from now
    
    const { rows: invoiceRows } = await pool.query(`
      insert into invoices (invoice_number, customer_name, customer_email, order_id, amount, tax, total, due_date, items, notes, status)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      returning *
    `, [
      invoiceNumber, 
      customer_name, 
      customer_email, 
      order.order_number, 
      subtotal, 
      tax, 
      total, 
      dueDate, 
      JSON.stringify(items), 
      `Invoice for order ${order_number}`,
      'paid'
    ])
    
    // Create Shiprocket shipment
    const { rows: shiprocketRows } = await pool.query(`
      insert into shiprocket_shipments (order_id, status, created_at)
      values ($1, $2, NOW())
      returning *
    `, [order.order_number, 'pending'])
    
    // Update user's total orders count
    await pool.query(`
      update users 
      set total_orders = total_orders + 1, loyalty_points = loyalty_points + $1
      where email = $2
    `, [Math.floor(total / 10), customer_email]) // 1 point per ₹10 spent
    
    // Broadcast updates
    broadcastUpdate('order_created', order)
    broadcastUpdate('invoice_created', invoiceRows[0])
    broadcastUpdate('shipment_created', shiprocketRows[0])
    
    res.json({ 
      order_number: order.order_number,
      id: order.id,
      status: order.status,
      invoice_number: invoiceNumber,
      shipment_id: shiprocketRows[0].id,
      message: 'Order created successfully with invoice and shipment'
    })
  } catch (err) {
    console.error('Order creation failed:', err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Update order status
app.put('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body
    const { rows } = await pool.query(`
      update orders 
      set status = $1, updated_at = NOW()
      where id = $2
      returning *
    `, [status, orderId])
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }
    
    broadcastUpdate('order_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    console.error('Order update failed:', err)
    res.status(500).json({ error: 'Failed to update order' })
  }
})

// Some Chrome DevTools versions probe this path; serve an empty response to avoid 404 noise
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.status(204).end()
})

// Orders API
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      shippingAddress,
      items,
      subtotal,
      shipping = 0,
      tax = 0,
      total
    } = req.body || {}

    if (!customerName || !customerEmail || !shippingAddress || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'Invalid order payload' })
    }

    const orderNumber = 'NEFOL-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    const { rows } = await pool.query(
      `insert into orders (order_number, customer_name, customer_email, shipping_address, items, subtotal, shipping, tax, total)
       values ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9)
       returning id, order_number as orderNumber` ,
      [orderNumber, customerName, customerEmail, JSON.stringify(shippingAddress), JSON.stringify(items), subtotal, shipping, tax, total]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Shiprocket Integration APIs
app.post('/api/shiprocket/create-shipment', async (req, res) => {
  try {
    const { order_id, shipment_id } = req.body
    
    // Get order details
    const { rows: orderRows } = await pool.query(`
      select * from orders where order_number = $1
    `, [order_id])
    
    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }
    
    const order = orderRows[0]
    const shippingAddress = order.shipping_address
    
    // Shiprocket API payload
    const shiprocketPayload = {
      order_id: order.order_number,
      channel_id: "NEFOL_CHANNEL",
      pickup_location: "NEFOL_PICKUP",
      billing_customer_name: order.customer_name,
      billing_last_name: "",
      billing_address: shippingAddress.address || "",
      billing_address_2: "",
      billing_city: shippingAddress.city || "",
      billing_pincode: shippingAddress.zip || "",
      billing_state: shippingAddress.state || "",
      billing_country: "India",
      billing_email: order.customer_email,
      billing_phone: shippingAddress.phone || "",
      shipping_is_billing: true,
      order_items: order.items.map((item: any) => ({
        name: item.title || item.name,
        sku: item.slug || item.id,
        units: item.quantity || 1,
        selling_price: parseFloat(item.price.replace('₹', '').replace(',', ''))
      })),
      payment_method: "Prepaid",
      sub_total: order.subtotal,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    }
    
    // Update shipment with Shiprocket data
    const { rows: shipmentRows } = await pool.query(`
      update shiprocket_shipments 
      set shipment_data = $1, status = 'created'
      where order_id = $2
      returning *
    `, [JSON.stringify(shiprocketPayload), order_id])
    
    broadcastUpdate('shipment_created', shipmentRows[0])
    res.json({
      success: true,
      shipment_id: shipmentRows[0].id,
      order_id: order_id,
      message: 'Shiprocket shipment created successfully',
      tracking_info: {
        order_number: order.order_number,
        customer_name: order.customer_name,
        delivery_address: shippingAddress,
        items: order.items,
        total_amount: order.total
      }
    })
  } catch (err) {
    console.error('Shiprocket shipment creation failed:', err)
    res.status(500).json({ error: 'Failed to create Shiprocket shipment' })
  }
})

// Get Shiprocket shipments
app.get('/api/shiprocket/shipments', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      select s.*, o.customer_name, o.customer_email, o.total, o.status as order_status
      from shiprocket_shipments s
      left join orders o on s.order_id = o.order_number
      order by s.created_at desc
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipments' })
  }
})

// Update shipment status
app.put('/api/shiprocket/shipments/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status, awb_code, courier_name, tracking_url } = req.body
    
    const { rows } = await pool.query(`
      update shiprocket_shipments 
      set status = $1, awb_code = $2, courier_name = $3, tracking_url = $4
      where id = $5
      returning *
    `, [status, awb_code, courier_name, tracking_url, id])
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' })
    }
    
    broadcastUpdate('shipment_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update shipment' })
  }
})

// Invoice APIs
app.get('/api/invoices', async (_req, res) => {
  try {
    const { rows } = await pool.query('select * from invoices order by created_at desc')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoices' })
  }
})

app.post('/api/invoices', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      orderId,
      amount,
      tax = 0,
      total,
      dueDate,
      items,
      notes
    } = req.body || {}

    if (!customerName || !customerEmail || !orderId || !amount || !total || !dueDate || !items) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const invoiceNumber = 'INV-' + Date.now()
    const { rows } = await pool.query(
      `insert into invoices (invoice_number, customer_name, customer_email, order_id, amount, tax, total, due_date, items, notes)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10)
       returning *`,
      [invoiceNumber, customerName, customerEmail, orderId, amount, tax, total, dueDate, JSON.stringify(items), notes]
    )
    
    broadcastUpdate('invoice_created', rows[0])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create invoice' })
  }
})

app.patch('/api/invoices/:id', async (req, res) => {
  try {
    const { status, dueDate, notes } = req.body || {}
    const updates = []
    const values = []
    let paramCount = 1

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`)
      values.push(status)
      paramCount++
    }
    if (dueDate !== undefined) {
      updates.push(`due_date = $${paramCount}`)
      values.push(dueDate)
      paramCount++
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount}`)
      values.push(notes)
      paramCount++
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' })
    }

    updates.push(`updated_at = now()`)
    values.push(req.params.id)

    const { rows } = await pool.query(
      `update invoices set ${updates.join(', ')} where id = $${paramCount} returning *`,
      values
    )

    if (!rows[0]) return res.status(404).json({ error: 'Invoice not found' })
    
    broadcastUpdate('invoice_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update invoice' })
  }
})

app.post('/api/invoices/:id/send', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'update invoices set status = $1, updated_at = now() where id = $2 returning *',
      ['sent', req.params.id]
    )
    
    if (!rows[0]) return res.status(404).json({ error: 'Invoice not found' })
    
    broadcastUpdate('invoice_sent', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to send invoice' })
  }
})

app.get('/api/invoices/:id/download', async (req, res) => {
  try {
    const { rows } = await pool.query('select * from invoices where id = $1', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Invoice not found' })
    
    // In a real implementation, you would generate a PDF here
    // For now, return the invoice data
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to download invoice' })
  }
})

// Tax Rate APIs
app.get('/api/tax/rates', async (_req, res) => {
  try {
    const { rows } = await pool.query('select * from tax_rates order by created_at desc')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tax rates' })
  }
})

app.post('/api/tax/rates', async (req, res) => {
  try {
    const { name, rate, type, region } = req.body || {}
    
    if (!name || !rate || !type || !region) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { rows } = await pool.query(
      'insert into tax_rates (name, rate, type, region) values ($1,$2,$3,$4) returning *',
      [name, rate, type, region]
    )
    
    broadcastUpdate('tax_rate_created', rows[0])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create tax rate' })
  }
})

app.patch('/api/tax/rates/:id', async (req, res) => {
  try {
    const { isActive } = req.body || {}
    const { rows } = await pool.query(
      'update tax_rates set is_active = $1 where id = $2 returning *',
      [isActive, req.params.id]
    )
    
    if (!rows[0]) return res.status(404).json({ error: 'Tax rate not found' })
    
    broadcastUpdate('tax_rate_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tax rate' })
  }
})

// Tax Rule APIs
app.get('/api/tax/rules', async (_req, res) => {
  try {
    const { rows } = await pool.query('select * from tax_rules order by priority, created_at desc')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tax rules' })
  }
})

app.post('/api/tax/rules', async (req, res) => {
  try {
    const { name, conditions, taxRateIds, priority = 1 } = req.body || {}
    
    if (!name || !conditions || !taxRateIds) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { rows } = await pool.query(
      'insert into tax_rules (name, conditions, tax_rate_ids, priority) values ($1,$2::jsonb,$3::jsonb,$4) returning *',
      [name, JSON.stringify(conditions), JSON.stringify(taxRateIds), priority]
    )
    
    broadcastUpdate('tax_rule_created', rows[0])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create tax rule' })
  }
})

app.patch('/api/tax/rules/:id', async (req, res) => {
  try {
    const { isActive } = req.body || {}
    const { rows } = await pool.query(
      'update tax_rules set is_active = $1 where id = $2 returning *',
      [isActive, req.params.id]
    )
    
    if (!rows[0]) return res.status(404).json({ error: 'Tax rule not found' })
    
    broadcastUpdate('tax_rule_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tax rule' })
  }
})

app.post('/api/tax/calculate', async (req, res) => {
  try {
    const { amount, region, productType } = req.body || {}
    
    if (!amount || !region) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get applicable tax rules
    const { rows: rules } = await pool.query(
      'select * from tax_rules where is_active = true order by priority'
    )

    let totalTax = 0
    const appliedRates = []

    for (const rule of rules) {
      const conditions = rule.conditions
      const taxRateIds = rule.tax_rate_ids
      
      // Check if conditions match
      let matches = true
      for (const condition of conditions) {
        if (condition.includes('Country:') && !condition.includes(region)) {
          matches = false
          break
        }
        if (condition.includes('Product Type:') && !condition.includes(productType)) {
          matches = false
          break
        }
      }

      if (matches) {
        // Get tax rates for this rule
        const { rows: rates } = await pool.query(
          `select * from tax_rates where id = any($1) and is_active = true`,
          [taxRateIds]
        )

        for (const rate of rates) {
          let taxAmount = 0
          if (rate.type === 'percentage') {
            taxAmount = (amount * rate.rate) / 100
          } else {
            taxAmount = rate.rate
          }
          
          totalTax += taxAmount
          appliedRates.push({
            name: rate.name,
            rate: rate.rate,
            type: rate.type,
            amount: taxAmount
          })
        }
        break // Use first matching rule
      }
    }

    res.json({
      originalAmount: amount,
      totalTax,
      finalAmount: amount + totalTax,
      appliedRates
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate tax' })
  }
})

// Returns APIs
app.get('/api/returns', async (_req, res) => {
  try {
    const { rows } = await pool.query('select * from returns order by created_at desc')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch returns' })
  }
})

app.post('/api/returns', async (req, res) => {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      reason,
      items,
      totalAmount,
      refundAmount,
      notes
    } = req.body || {}

    if (!orderId || !customerName || !customerEmail || !reason || !items || !totalAmount || !refundAmount) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const returnNumber = 'RET-' + Date.now()
    const { rows } = await pool.query(
      `insert into returns (return_number, order_id, customer_name, customer_email, reason, items, total_amount, refund_amount, notes)
       values ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9)
       returning *`,
      [returnNumber, orderId, customerName, customerEmail, reason, JSON.stringify(items), totalAmount, refundAmount, notes]
    )
    
    broadcastUpdate('return_created', rows[0])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create return' })
  }
})

app.patch('/api/returns/:id', async (req, res) => {
  try {
    const { status, refundAmount, notes } = req.body || {}
    const updates = []
    const values = []
    let paramCount = 1

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`)
      values.push(status)
      paramCount++
    }
    if (refundAmount !== undefined) {
      updates.push(`refund_amount = $${paramCount}`)
      values.push(refundAmount)
      paramCount++
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount}`)
      values.push(notes)
      paramCount++
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' })
    }

    updates.push(`updated_at = now()`)
    values.push(req.params.id)

    const { rows } = await pool.query(
      `update returns set ${updates.join(', ')} where id = $${paramCount} returning *`,
      values
    )

    if (!rows[0]) return res.status(404).json({ error: 'Return not found' })
    
    broadcastUpdate('return_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update return' })
  }
})

app.post('/api/returns/:id/refund', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'update returns set status = $1, updated_at = now() where id = $2 returning *',
      ['refunded', req.params.id]
    )
    
    if (!rows[0]) return res.status(404).json({ error: 'Return not found' })
    
    broadcastUpdate('return_refunded', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to process refund' })
  }
})

app.get('/api/returns/:id/label', async (req, res) => {
  try {
    const { rows } = await pool.query('select * from returns where id = $1', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Return not found' })
    
    // In a real implementation, you would generate a shipping label here
    // For now, return the return data
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate label' })
  }
})

// Payment Method APIs
app.get('/api/payment/methods', async (_req, res) => {
  try {
    const { rows } = await pool.query('select * from payment_methods order by created_at desc')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment methods' })
  }
})

app.post('/api/payment/methods', async (req, res) => {
  try {
    const { name, type, processingFee = 0, minAmount = 0, maxAmount = 999999, supportedRegions = [] } = req.body || {}
    
    if (!name || !type) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { rows } = await pool.query(
      'insert into payment_methods (name, type, processing_fee, min_amount, max_amount, supported_regions) values ($1,$2,$3,$4,$5,$6::jsonb) returning *',
      [name, type, processingFee, minAmount, maxAmount, JSON.stringify(supportedRegions)]
    )
    
    broadcastUpdate('payment_method_created', rows[0])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment method' })
  }
})

app.patch('/api/payment/methods/:id', async (req, res) => {
  try {
    const { isActive } = req.body || {}
    const { rows } = await pool.query(
      'update payment_methods set is_active = $1 where id = $2 returning *',
      [isActive, req.params.id]
    )
    
    if (!rows[0]) return res.status(404).json({ error: 'Payment method not found' })
    
    broadcastUpdate('payment_method_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment method' })
  }
})

// Payment Gateway APIs
app.get('/api/payment/gateways', async (_req, res) => {
  try {
    const { rows } = await pool.query('select * from payment_gateways order by created_at desc')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment gateways' })
  }
})

app.post('/api/payment/gateways', async (req, res) => {
  try {
    const { name, type, apiKey, secretKey, webhookUrl, supportedMethods = [] } = req.body || {}
    
    if (!name || !type || !apiKey || !secretKey || !webhookUrl) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { rows } = await pool.query(
      'insert into payment_gateways (name, type, api_key, secret_key, webhook_url, supported_methods) values ($1,$2,$3,$4,$5,$6::jsonb) returning *',
      [name, type, apiKey, secretKey, webhookUrl, JSON.stringify(supportedMethods)]
    )
    
    broadcastUpdate('payment_gateway_created', rows[0])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment gateway' })
  }
})

app.patch('/api/payment/gateways/:id', async (req, res) => {
  try {
    const { isActive } = req.body || {}
    const { rows } = await pool.query(
      'update payment_gateways set is_active = $1 where id = $2 returning *',
      [isActive, req.params.id]
    )
    
    if (!rows[0]) return res.status(404).json({ error: 'Payment gateway not found' })
    
    broadcastUpdate('payment_gateway_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment gateway' })
  }
})

// Payment Transaction APIs
app.get('/api/payment/transactions', async (_req, res) => {
  try {
    const { rows } = await pool.query('select * from payment_transactions order by created_at desc')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

app.post('/api/payment/transactions', async (req, res) => {
  try {
    const { orderId, customerName, amount, method, gateway } = req.body || {}
    
    if (!orderId || !customerName || !amount || !method || !gateway) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const transactionId = 'TXN-' + Date.now()
    const { rows } = await pool.query(
      'insert into payment_transactions (transaction_id, order_id, customer_name, amount, method, gateway) values ($1,$2,$3,$4,$5,$6) returning *',
      [transactionId, orderId, customerName, amount, method, gateway]
    )
    
    broadcastUpdate('transaction_created', rows[0])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction' })
  }
})

app.post('/api/payment/transactions/:id/refund', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'update payment_transactions set status = $1, processed_at = now() where id = $2 returning *',
      ['refunded', req.params.id]
    )
    
    if (!rows[0]) return res.status(404).json({ error: 'Transaction not found' })
    
    broadcastUpdate('transaction_refunded', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to process refund' })
  }
})

// Additional PUT endpoints for frontend compatibility
app.put('/api/invoices/:id', async (req, res) => {
  try {
    const { customerName, customerEmail, orderId, dueDate, status, notes, items, amount, tax, total } = req.body
    const updates = []
    const values = []
    let paramCount = 1

    if (customerName !== undefined) {
      updates.push(`customer_name = $${paramCount++}`)
      values.push(customerName)
    }
    if (customerEmail !== undefined) {
      updates.push(`customer_email = $${paramCount++}`)
      values.push(customerEmail)
    }
    if (orderId !== undefined) {
      updates.push(`order_id = $${paramCount++}`)
      values.push(orderId)
    }
    if (dueDate !== undefined) {
      updates.push(`due_date = $${paramCount++}`)
      values.push(dueDate)
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`)
      values.push(status)
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`)
      values.push(notes)
    }
    if (items !== undefined) {
      updates.push(`items = $${paramCount++}`)
      values.push(JSON.stringify(items))
    }
    if (amount !== undefined) {
      updates.push(`amount = $${paramCount++}`)
      values.push(amount)
    }
    if (tax !== undefined) {
      updates.push(`tax = $${paramCount++}`)
      values.push(tax)
    }
    if (total !== undefined) {
      updates.push(`total = $${paramCount++}`)
      values.push(total)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    updates.push(`updated_at = now()`)
    values.push(req.params.id)

    const { rows } = await pool.query(
      `update invoices set ${updates.join(', ')} where id = $${paramCount} returning *`,
      values
    )

    if (!rows[0]) return res.status(404).json({ error: 'Invoice not found' })

    broadcastUpdate('invoice_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update invoice' })
  }
})

app.put('/api/tax-rates/:id', async (req, res) => {
  try {
    const { name, rate, type, region, isActive } = req.body
    const updates = []
    const values = []
    let paramCount = 1

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`)
      values.push(name)
    }
    if (rate !== undefined) {
      updates.push(`rate = $${paramCount++}`)
      values.push(rate)
    }
    if (type !== undefined) {
      updates.push(`type = $${paramCount++}`)
      values.push(type)
    }
    if (region !== undefined) {
      updates.push(`region = $${paramCount++}`)
      values.push(region)
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramCount++}`)
      values.push(isActive)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    values.push(req.params.id)

    const { rows } = await pool.query(
      `update tax_rates set ${updates.join(', ')} where id = $${paramCount} returning *`,
      values
    )

    if (!rows[0]) return res.status(404).json({ error: 'Tax rate not found' })

    broadcastUpdate('tax_rate_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tax rate' })
  }
})

app.put('/api/returns/:id', async (req, res) => {
  try {
    const { status, notes, refundAmount } = req.body
    const updates = []
    const values = []
    let paramCount = 1

    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`)
      values.push(status)
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`)
      values.push(notes)
    }
    if (refundAmount !== undefined) {
      updates.push(`refund_amount = $${paramCount++}`)
      values.push(refundAmount)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    updates.push(`updated_at = now()`)
    values.push(req.params.id)

    const { rows } = await pool.query(
      `update returns set ${updates.join(', ')} where id = $${paramCount} returning *`,
      values
    )

    if (!rows[0]) return res.status(404).json({ error: 'Return not found' })

    broadcastUpdate('return_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update return' })
  }
})

app.put('/api/payment-methods/:id', async (req, res) => {
  try {
    const { name, processingFee, minAmount, maxAmount, isActive } = req.body
    const updates = []
    const values = []
    let paramCount = 1

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`)
      values.push(name)
    }
    if (processingFee !== undefined) {
      updates.push(`processing_fee = $${paramCount++}`)
      values.push(processingFee)
    }
    if (minAmount !== undefined) {
      updates.push(`min_amount = $${paramCount++}`)
      values.push(minAmount)
    }
    if (maxAmount !== undefined) {
      updates.push(`max_amount = $${paramCount++}`)
      values.push(maxAmount)
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramCount++}`)
      values.push(isActive)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    values.push(req.params.id)

    const { rows } = await pool.query(
      `update payment_methods set ${updates.join(', ')} where id = $${paramCount} returning *`,
      values
    )

    if (!rows[0]) return res.status(404).json({ error: 'Payment method not found' })

    broadcastUpdate('payment_method_updated', rows[0])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment method' })
  }
})

// DELETE endpoints
app.delete('/api/invoices/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('delete from invoices where id = $1 returning *', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Invoice not found' })
    
    broadcastUpdate('invoice_deleted', { id: req.params.id })
    res.json({ message: 'Invoice deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete invoice' })
  }
})

app.delete('/api/tax-rates/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('delete from tax_rates where id = $1 returning *', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Tax rate not found' })
    
    broadcastUpdate('tax_rate_deleted', { id: req.params.id })
    res.json({ message: 'Tax rate deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tax rate' })
  }
})

app.delete('/api/returns/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('delete from returns where id = $1 returning *', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Return not found' })
    
    broadcastUpdate('return_deleted', { id: req.params.id })
    res.json({ message: 'Return deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete return' })
  }
})

app.delete('/api/payment-methods/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('delete from payment_methods where id = $1 returning *', [req.params.id])
    if (!rows[0]) return res.status(404).json({ error: 'Payment method not found' })
    
    broadcastUpdate('payment_method_deleted', { id: req.params.id })
    res.json({ message: 'Payment method deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete payment method' })
  }
})






