-- ============================================================================
-- Blog Posts Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'Julieta Arena',
  date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  category TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  featured BOOLEAN DEFAULT false,
  read_time INTEGER DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Authenticated users can do everything
CREATE POLICY "Authenticated users can insert posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();
