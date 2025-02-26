-- Drop existing tables (in correct order to handle foreign key constraints)
DROP TABLE IF EXISTS medical_records;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS patients;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_type VARCHAR(10),
    height VARCHAR(20),
    weight VARCHAR(20),
    primary_physician VARCHAR(100),
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(50),
    primary_address_type VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    conditions VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    allergies VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Addresses table (one-to-many with patients)
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL,
    address_line TEXT NOT NULL,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medical records table with JSONB details
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_patients_patient_id ON patients(patient_id);
CREATE INDEX idx_patients_allergies ON patients USING gin (allergies);
CREATE INDEX idx_addresses_patient_id ON addresses(patient_id);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
-- CREATE INDEX idx_medical_records_record_id ON medical_records(record_id);
-- CREATE INDEX idx_medical_records_type ON medical_records(type);
-- CREATE INDEX idx_medical_records_date ON medical_records(date);
CREATE INDEX idx_medical_records_details ON medical_records USING gin (details);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at
    BEFORE UPDATE ON medical_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Version table
DROP TABLE IF EXISTS versions;
CREATE TABLE versions (
    version VARCHAR(50) PRIMARY KEY
);

-- Insert initial version
INSERT INTO versions (version) VALUES ('0.1');

/*
* search_patients - Searches for patients where ALL provided terms match
*
* This function implements a strict AND-based search where all terms must match each patient.
* For each term in search_terms:
*   - Checks if the term appears in first_name, last_name, or patient_id
*   - Uses both full-text search (with prefix matching) and ILIKE for flexible matching
*   - Only returns patients matching ALL provided search terms
*   - Empty terms are filtered out
*
* Performance considerations:
*   - Consider adding GIN indexes on to_tsvector('simple', first_name) and last_name
*   - Results are limited to 100 records
*/
DROP FUNCTION IF EXISTS search_patients(text[]);

CREATE OR REPLACE FUNCTION search_patients(search_terms text[])
RETURNS TABLE (
  id uuid,
  patient_id varchar(50),
  first_name varchar(100),
  last_name varchar(100),
  date_of_birth date
) AS $$
BEGIN
  RETURN QUERY
  WITH term_patterns AS (
    SELECT term, 
           term || ':*' AS prefix_term,
           '%' || term || '%' AS like_pattern
    FROM unnest(search_terms) AS term
    WHERE trim(term) != ''
  )
  SELECT DISTINCT p.id, p.patient_id, p.first_name, p.last_name, p.date_of_birth
  FROM patients p
  WHERE (
    SELECT COUNT(*)
    FROM term_patterns t
  ) = (
    -- This subquery counts how many of the search terms match for each patient
    SELECT COUNT(*)
    FROM term_patterns t
    WHERE 
      -- Full text search on names
      to_tsvector('simple', coalesce(p.first_name, '')) @@ to_tsquery('simple', t.prefix_term)
      OR to_tsvector('simple', coalesce(p.last_name, '')) @@ to_tsquery('simple', t.prefix_term)
      -- ILIKE search for partial matches on all fields
      OR p.first_name ILIKE t.like_pattern
      OR p.last_name ILIKE t.like_pattern
      OR p.patient_id ILIKE t.like_pattern
  )
  ORDER BY p.last_name, p.first_name
  LIMIT 100;
END;
$$ LANGUAGE plpgsql; 
