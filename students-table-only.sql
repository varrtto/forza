-- Students table and related changes for Supabase
-- Copy and paste this into your Supabase SQL Editor

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(50) NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for students table
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- Create trigger for students updated_at
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policies for students table
CREATE POLICY "Users can view own students" ON students
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own students" ON students
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own students" ON students
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own students" ON students
    FOR DELETE USING (auth.uid()::text = user_id::text);
