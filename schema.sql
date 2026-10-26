CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL,
  description TEXT, price NUMERIC(10,2) NOT NULL, stock INT NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY, order_number TEXT UNIQUE NOT NULL,
  user_id INT REFERENCES users(id), status TEXT NOT NULL,        -- processing | shipped | out_for_delivery | delivered | cancelled
  carrier TEXT, tracking_id TEXT, estimated_delivery DATE,
  total NUMERIC(10,2) NOT NULL, placed_at TIMESTAMPTZ DEFAULT now(), delivered_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY, order_id INT REFERENCES orders(id), product_id INT REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 1, unit_price NUMERIC(10,2) NOT NULL
);
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'bot',                              -- bot | escalated
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY, conversation_id UUID REFERENCES conversations(id),
  role TEXT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS handoffs (
  id SERIAL PRIMARY KEY, conversation_id UUID REFERENCES conversations(id),
  reason TEXT NOT NULL, summary TEXT, created_at TIMESTAMPTZ DEFAULT now(), resolved BOOLEAN DEFAULT false
);

-- Demo data
INSERT INTO users (name, email) VALUES ('Asha Roy', 'asha@example.com') ON CONFLICT DO NOTHING;
INSERT INTO products (name, category, description, price, stock) VALUES
 ('Linen Throw Blanket', 'home', 'Stonewashed linen, 130x170 cm', 59.00, 24),
 ('Wool Throw Blanket', 'home', 'Merino wool, heavyweight, 140x180 cm', 89.00, 6),
 ('Ceramic Pour-Over Set', 'kitchen', 'Dripper, carafe and two cups', 48.00, 15),
 ('Walnut Serving Board', 'kitchen', 'Hand-finished, 45 cm', 36.00, 0)
ON CONFLICT DO NOTHING;
INSERT INTO orders (order_number, user_id, status, carrier, tracking_id, estimated_delivery, total)
 VALUES ('SP-10234', 1, 'shipped', 'BlueDart', 'BD99120344', CURRENT_DATE + 2, 59.00) ON CONFLICT DO NOTHING;
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (1, 1, 1, 59.00);
