-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: users can view only their own notes
CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  USING (created_by = auth.uid());

-- Policy: users can insert only their own notes
CREATE POLICY "Users can insert own notes"
  ON notes FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Policy: users can update only their own notes
CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  USING (created_by = auth.uid());

-- Policy: users can delete only their own notes
CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  USING (created_by = auth.uid());

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_notes_created_by ON notes(created_by);
