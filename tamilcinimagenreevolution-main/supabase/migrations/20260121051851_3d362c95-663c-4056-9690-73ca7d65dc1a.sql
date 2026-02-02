-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create movies table
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  genre TEXT NOT NULL,
  rating DECIMAL(3,1) DEFAULT 0,
  poster_url TEXT,
  description TEXT,
  director TEXT,
  cast_members TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on movies (public read, admin write)
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Movies policies (public read)
CREATE POLICY "Anyone can view movies"
  ON public.movies FOR SELECT
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles timestamp
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample movies data
INSERT INTO public.movies (title, year, genre, rating, description, director) VALUES
  ('Ghilli', 2004, 'Action', 7.8, 'A kabaddi player saves a girl from a violent crime lord.', 'Dharani'),
  ('Chandramukhi', 2005, 'Horror', 7.6, 'A psychiatrist battles supernatural forces in an ancient mansion.', 'P. Vasu'),
  ('Sivaji', 2007, 'Action', 7.3, 'An NRI returns to India to start free education and healthcare but faces corruption.', 'S. Shankar'),
  ('Enthiran', 2010, 'Sci-Fi', 7.5, 'A scientist creates an android that develops human emotions.', 'S. Shankar'),
  ('Mankatha', 2011, 'Thriller', 7.4, 'A suspended cop plans a heist during an IPL cricket match.', 'Venkat Prabhu'),
  ('3', 2012, 'Romance', 7.2, 'A young couple faces tragedy when the husband develops bipolar disorder.', 'Aishwarya R. Dhanush'),
  ('Thuppakki', 2012, 'Action', 7.8, 'An army captain on leave uncovers a terrorist sleeper cell in Mumbai.', 'A.R. Murugadoss'),
  ('Veeram', 2014, 'Action', 6.4, 'A village strongman falls in love and must fight to protect his family.', 'Siva'),
  ('I', 2015, 'Thriller', 7.1, 'A bodybuilder turned model seeks revenge after being disfigured.', 'S. Shankar'),
  ('Kabali', 2016, 'Action', 6.2, 'A don rises from the slums of Kuala Lumpur to become a crime boss.', 'Pa. Ranjith'),
  ('Mersal', 2017, 'Action', 7.3, 'A magician seeks revenge against corrupt hospital owners.', 'Atlee'),
  ('96', 2018, 'Romance', 8.5, 'Former high school sweethearts reunite at a class reunion.', 'C. Prem Kumar'),
  ('Bigil', 2019, 'Sports', 6.2, 'A gangster coaches a women''s football team to glory.', 'Atlee'),
  ('Master', 2021, 'Action', 7.2, 'An alcoholic professor battles a criminal who uses children for crimes.', 'Lokesh Kanagaraj'),
  ('Karnan', 2021, 'Drama', 8.0, 'A young man leads his village in revolt against caste discrimination.', 'Mari Selvaraj'),
  ('Vikram', 2022, 'Action', 8.2, 'A retired agent is called back to track down a masked killer.', 'Lokesh Kanagaraj'),
  ('Ponniyin Selvan: I', 2022, 'Historical', 7.8, 'An epic tale of the Chola dynasty and the rise of Rajaraja I.', 'Mani Ratnam'),
  ('Leo', 2023, 'Action', 7.4, 'A café owner''s violent past catches up with him.', 'Lokesh Kanagaraj'),
  ('GOAT', 2024, 'Action', 6.8, 'A spy embarks on a mission involving time travel.', 'Venkat Prabhu'),
  ('Vidaamuyarchi', 2025, 'Action', 7.0, 'A man fights to save his kidnapped wife in a foreign land.', 'Magizh Thirumeni');