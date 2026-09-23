ALTER TABLE trips ADD COLUMN IF NOT EXISTS travellers INTEGER DEFAULT 1 CHECK (travellers > 0);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS origin VARCHAR(180);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS trip_days(
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title VARCHAR(180),
  trip_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  day_budget NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id,day_number)
);

CREATE TABLE IF NOT EXISTS trip_activities(
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trip_day_id INTEGER REFERENCES trip_days(id) ON DELETE CASCADE,
  time_label VARCHAR(20),
  activity_type VARCHAR(40) DEFAULT 'Place',
  title VARCHAR(180) NOT NULL,
  description TEXT,
  planned_cost NUMERIC(12,2) DEFAULT 0,
  actual_cost NUMERIC(12,2),
  completed BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trip_expenses(
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES trip_activities(id) ON DELETE SET NULL,
  category VARCHAR(80),
  amount NUMERIC(12,2) NOT NULL CHECK(amount >= 0),
  note TEXT,
  spent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trip_days_trip ON trip_days(trip_id,day_number);
CREATE INDEX IF NOT EXISTS idx_trip_activities_day ON trip_activities(trip_day_id,sort_order);
CREATE INDEX IF NOT EXISTS idx_trip_expenses_trip ON trip_expenses(trip_id,spent_at DESC);