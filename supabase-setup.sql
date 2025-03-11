-- Drop existing table if it exists
DROP TABLE IF EXISTS translations;

-- Create the translations table
CREATE TABLE translations (
    id BIGSERIAL PRIMARY KEY,
    source_text TEXT NOT NULL,
    target_language TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint
ALTER TABLE translations 
ADD CONSTRAINT unique_translation 
UNIQUE (source_text, target_language);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations
CREATE POLICY "Allow all operations" ON translations
FOR ALL
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- Grant access to the table for anonymous users
GRANT ALL ON translations TO anon;
GRANT USAGE ON SEQUENCE translations_id_seq TO anon;
