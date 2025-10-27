-- ===================================
-- MARUSYA CINEMA - SUPABASE SCHEMA
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- PROFILES TABLE (дополнительная инфа о юзере)
-- ===================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    username TEXT UNIQUE,
    name TEXT,
    surname TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Subscription fields
    has_subscription BOOLEAN DEFAULT FALSE,
    subscription_end TIMESTAMPTZ,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    UNIQUE(email)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies if exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert profile on signup" ON profiles;

-- Policies for profiles
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Anyone can insert profile on signup"
ON profiles FOR INSERT
WITH CHECK (true);

-- ===================================
-- FAVORITES TABLE
-- ===================================
CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL,
    movie_title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, movie_id)
);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Drop old policies if exist
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

-- Policies for favorites
CREATE POLICY "Users can view own favorites"
ON favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
ON favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
ON favorites FOR DELETE
USING (auth.uid() = user_id);

-- ===================================
-- FUNCTIONS
-- ===================================

-- Function to check if subscription is active
CREATE OR REPLACE FUNCTION is_subscription_active(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT 
            has_subscription = TRUE 
            AND subscription_end > NOW()
        FROM profiles
        WHERE id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================================
-- INDEXES (для производительности)
-- ===================================
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_movie_id ON favorites(movie_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(has_subscription, subscription_end);

