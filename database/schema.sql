-- Food Inventory Management System Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food items table (NFR-XX: quantity CHECK >= 0 prevents negative inventory)
CREATE TABLE IF NOT EXISTS food_items (
    item_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    quantity DECIMAL(10, 2) DEFAULT 1 CHECK (quantity >= 0),
    unit VARCHAR(20),
    price DECIMAL(10, 2),
    purchase_date DATE DEFAULT CURRENT_DATE,
    expiration_date DATE,
    location VARCHAR(50) DEFAULT 'pantry',
    barcode VARCHAR(50),
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping list table
CREATE TABLE IF NOT EXISTS shopping_list (
    list_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit VARCHAR(20),
    estimated_price DECIMAL(10, 2),
    is_purchased BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login audit table (NFR-02)
CREATE TABLE IF NOT EXISTS login_audit (
    audit_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    success BOOLEAN NOT NULL,
    ip_address VARCHAR(45),
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table (FR-10, FR-11, FR-13)
CREATE TABLE IF NOT EXISTS recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    prep_time_minutes INTEGER DEFAULT 0,
    cook_time_minutes INTEGER DEFAULT 0,
    servings INTEGER DEFAULT 2,
    difficulty VARCHAR(20) DEFAULT 'easy',
    ingredients JSONB DEFAULT '[]',
    instructions TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipe feedback — thumbs up/down (FR-12)
CREATE TABLE IF NOT EXISTS recipe_feedback (
    feedback_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    is_liked BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recipe_id)
);

-- Grocery stores (FR-14, FR-16)
CREATE TABLE IF NOT EXISTS grocery_stores (
    store_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User favorite stores (FR-14, FR-15, FR-16)
CREATE TABLE IF NOT EXISTS user_favorite_stores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES grocery_stores(store_id) ON DELETE CASCADE,
    is_favorite BOOLEAN DEFAULT FALSE,
    last_visited DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);

-- Restaurants (FR-XX: Order Hot Food)
CREATE TABLE IF NOT EXISTS restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuisine_type VARCHAR(50),
    address VARCHAR(255),
    estimated_delivery_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User favorite restaurants (FR-XX)
CREATE TABLE IF NOT EXISTS user_favorite_restaurants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    restaurant_id INTEGER REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    is_favorite BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, restaurant_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_food_items_user ON food_items(user_id);
CREATE INDEX IF NOT EXISTS idx_food_items_expiration ON food_items(expiration_date);
CREATE INDEX IF NOT EXISTS idx_shopping_list_user ON shopping_list(user_id);
CREATE INDEX IF NOT EXISTS idx_login_audit_username ON login_audit(username);
CREATE INDEX IF NOT EXISTS idx_recipe_feedback_user ON recipe_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_fav_stores_user ON user_favorite_stores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_fav_restaurants_user ON user_favorite_restaurants(user_id);
