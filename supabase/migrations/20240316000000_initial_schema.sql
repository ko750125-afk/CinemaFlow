-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();


-- 2. Watch Records Table
CREATE TABLE public.watch_records (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tmdb_movie_id text NOT NULL,
  movie_title text NOT NULL,
  poster_path text,
  rating numeric(3,1) NOT NULL,
  viewed_at date,
  place text,
  one_liner text,
  review text,
  is_spoiler boolean DEFAULT false,
  visibility text DEFAULT 'private',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.watch_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watch records" 
  ON public.watch_records FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watch records" 
  ON public.watch_records FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch records" 
  ON public.watch_records FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watch records" 
  ON public.watch_records FOR DELETE 
  USING (auth.uid() = user_id);

CREATE TRIGGER on_watch_records_updated
  BEFORE UPDATE ON public.watch_records
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 3. Collection Items Table
CREATE TABLE public.collection_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tmdb_movie_id text NOT NULL,
  movie_title text NOT NULL,
  poster_path text,
  status text NOT NULL CHECK (status IN ('watch-later', 'watched', 'favorite')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, tmdb_movie_id, status)
);

ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own collection items" 
  ON public.collection_items FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own collection items" 
  ON public.collection_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collection items" 
  ON public.collection_items FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own collection items" 
  ON public.collection_items FOR DELETE 
  USING (auth.uid() = user_id);

CREATE TRIGGER on_collection_items_updated
  BEFORE UPDATE ON public.collection_items
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 4. Learning Progress Table
CREATE TABLE public.learning_progress (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  component_key text NOT NULL,
  is_learned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, component_key)
);

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own learning progress" 
  ON public.learning_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning progress" 
  ON public.learning_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning progress" 
  ON public.learning_progress FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own learning progress" 
  ON public.learning_progress FOR DELETE 
  USING (auth.uid() = user_id);

CREATE TRIGGER on_learning_progress_updated
  BEFORE UPDATE ON public.learning_progress
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 5. Quiz Attempts Table
CREATE TABLE public.quiz_attempts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  quiz_type text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts" 
  ON public.quiz_attempts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts" 
  ON public.quiz_attempts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Optional: Create trigger on auth.users to automatically create profile
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
