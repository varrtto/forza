-- Routines table and related changes for Supabase
-- Copy and paste this into your Supabase SQL Editor

-- Create routines table
CREATE TABLE IF NOT EXISTS routines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name VARCHAR(255) DEFAULT 'Rutina',
  routine_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for routines table
CREATE INDEX IF NOT EXISTS idx_routines_user_id ON routines(user_id);
CREATE INDEX IF NOT EXISTS idx_routines_student_id ON routines(student_id);

-- Create trigger for routines updated_at
CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON routines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for routines table
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

-- Create policies for routines table
CREATE POLICY "Users can view own routines" ON routines
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own routines" ON routines
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own routines" ON routines
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own routines" ON routines
    FOR DELETE USING (auth.uid()::text = user_id::text);
