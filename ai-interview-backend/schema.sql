-- Sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Resumes table
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Answers table
CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT,
    score INT,
    feedback TEXT,
    tips TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(session_id, question_id)
);

-- If the table already exists, run this to add the column:
-- ALTER TABLE answers ADD COLUMN tips TEXT[];



