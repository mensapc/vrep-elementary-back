CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(255)
);