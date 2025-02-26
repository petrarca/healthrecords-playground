-- Generated test data SQL
-- Generated at: 2025-02-26T18:50:20.949Z

-- Begin transaction
BEGIN;

-- Cleanup existing data

-- Clean up existing data
TRUNCATE TABLE patients CASCADE;

-- Patient data

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4711', 'John', 'Smith', '1975-03-15',
    'male', 'A+', '180[cm]', '75[kg]', 'Dr. Anderson',
    'Blue Cross', 'BC123456789', 'HOME',
    '(415) 555-0123', 'john.smith@email.com', ARRAY['Hypertension', 'High Cholesterol']::varchar[], ARRAY['Penicillin']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'HOME', '123 Oak Street, San Francisco, CA 94105, USA', '123 Oak Street', 'San Francisco', 'CA', '94105', 'USA'
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'WORK', '555 Market Street, San Francisco, CA 94105, USA', '555 Market Street', 'San Francisco', 'CA', '94105', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4712', 'Emma', 'Johnson', '1988-07-22',
    'female', 'O-', '', '', 'Dr. Martinez',
    'Aetna', 'AE987654321', 'HOME',
    '(415) 555-0124', 'emma.johnson@email.com', ARRAY['Severe Allergies']::varchar[], ARRAY['Latex', 'Pollen']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'HOME', '456 Pine Avenue, San Francisco, CA 94110, USA', '456 Pine Avenue', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4713', 'Michael', 'Williams', '1962-11-30',
    'male', 'B+', '', '', 'Dr. Chen',
    'Medicare', 'MC456789123', 'HOME',
    '(415) 555-0125', 'michael.williams@email.com', ARRAY['Hypertension', 'Arthritis']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'HOME', '789 Market Street, Apt 4B, San Francisco, CA 94103, USA', '789 Market Street, Apt 4B', 'San Francisco', 'CA', '94103', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4714', 'Sarah', 'Brown', '1995-04-18',
    'female', 'AB+', '', '', 'Dr. Thompson',
    'United Healthcare', 'UH789123456', 'HOME',
    '(415) 555-0126', 'sarah.brown@email.com', ARRAY['Asthma']::varchar[], ARRAY['Dust Mites']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4714'),
    'HOME', '321 Hayes Street, San Francisco, CA 94102, USA', '321 Hayes Street', 'San Francisco', 'CA', '94102', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4715', 'David', 'Miller', '1980-09-05',
    'male', 'O+', '', '', 'Dr. Patel',
    'Kaiser', 'KP159753468', 'HOME',
    '(415) 555-0127', 'david.miller@email.com', ARRAY['Type 2 Diabetes']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4715'),
    'HOME', '901 Valencia Street, San Francisco, CA 94110, USA', '901 Valencia Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4716', 'Lisa', 'Garcia', '1992-12-10',
    'female', 'A-', '', '', 'Dr. Wilson',
    'Cigna', 'CG852963741', 'HOME',
    '(415) 555-0128', 'lisa.garcia@email.com', ARRAY['Migraine', 'Anxiety']::varchar[], ARRAY['Shellfish']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4716'),
    'HOME', '2345 Mission Street, San Francisco, CA 94110, USA', '2345 Mission Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4717', 'James', 'Taylor', '1958-06-25',
    'male', 'B-', '', '', 'Dr. Lee',
    'Humana', 'HU963852741', 'HOME',
    '(415) 555-0129', 'james.taylor@email.com', ARRAY['Coronary Artery Disease', 'Type 2 Diabetes']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4717'),
    'HOME', '3456 Folsom Street, San Francisco, CA 94110, USA', '3456 Folsom Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4718', 'Maria', 'Rodriguez', '1990-02-14',
    'female', 'O+', '', '', 'Dr. Nguyen',
    'Blue Shield', 'BS741852963', 'HOME',
    '(415) 555-0130', 'maria.rodriguez@email.com', ARRAY['Hypothyroidism']::varchar[], ARRAY['Sulfa Drugs']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4718'),
    'HOME', '4567 24th Street, San Francisco, CA 94110, USA', '4567 24th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4719', 'Robert', 'Anderson', '1971-08-30',
    'male', 'A+', '', '', 'Dr. White',
    'Anthem', 'AN159753468', 'HOME',
    '(415) 555-0131', 'robert.anderson@email.com', ARRAY['GERD', 'Sleep Apnea']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4719'),
    'HOME', '5678 Guerrero Street, San Francisco, CA 94110, USA', '5678 Guerrero Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4720', 'Jennifer', 'Martin', '1983-11-12',
    'female', 'AB-', '', '', 'Dr. Brown',
    'United Healthcare', 'UH951753684', 'HOME',
    '(415) 555-0132', 'jennifer.martin@email.com', ARRAY['Depression', 'Fibromyalgia']::varchar[], ARRAY['Peanuts']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4720'),
    'HOME', '6789 Dolores Street, San Francisco, CA 94110, USA', '6789 Dolores Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4721', 'William', 'Thompson', '1967-04-03',
    'male', 'O-', '', '', 'Dr. Garcia',
    'Medicare', 'MC357159852', 'HOME',
    '(415) 555-0133', 'william.thompson@email.com', ARRAY['Osteoporosis']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4721'),
    'HOME', '7890 19th Street, San Francisco, CA 94110, USA', '7890 19th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4722', 'Patricia', 'Moore', '1987-09-28',
    'other', 'B+', '', '', 'Dr. Taylor',
    'Aetna', 'AE753951852', 'HOME',
    '(415) 555-0134', 'patricia.moore@email.com', ARRAY['Rheumatoid Arthritis']::varchar[], ARRAY['Ibuprofen']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4722'),
    'HOME', '8901 20th Street, San Francisco, CA 94110, USA', '8901 20th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4723', 'Richard', 'Jackson', '1959-01-20',
    'male', 'A+', '', '', 'Dr. Martinez',
    'Humana', 'HU456123789', 'HOME',
    '(415) 555-0135', 'richard.jackson@email.com', ARRAY['Chronic Kidney Disease', 'Hypertension']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4723'),
    'HOME', '9012 21st Street, San Francisco, CA 94110, USA', '9012 21st Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4724', 'Elizabeth', 'White', '1993-06-15',
    'female', 'O+', '', '', 'Dr. Anderson',
    'Kaiser', 'KP789456123', 'HOME',
    '(415) 555-0136', 'elizabeth.white@email.com', ARRAY['Celiac Disease']::varchar[], ARRAY['Dairy']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4724'),
    'HOME', '2345 22nd Street, San Francisco, CA 94110, USA', '2345 22nd Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4725', 'Thomas', 'Harris', '1976-12-08',
    'male', 'AB+', '', '', 'Dr. Thompson',
    'Blue Cross', 'BC951357846', 'HOME',
    '(415) 555-0137', 'thomas.harris@email.com', ARRAY['Psoriasis', 'Anxiety']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4725'),
    'HOME', '3456 23rd Street, San Francisco, CA 94110, USA', '3456 23rd Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4726', 'Susan', 'Clark', '1982-03-25',
    'female', 'B-', '', '', 'Dr. Wilson',
    'Cigna', 'CG357951846', 'HOME',
    '(415) 555-0138', 'susan.clark@email.com', ARRAY['Endometriosis']::varchar[], ARRAY['Aspirin']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4726'),
    'HOME', '4567 24th Street, San Francisco, CA 94110, USA', '4567 24th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4727', 'Daniel', 'Lewis', '1964-07-19',
    'male', 'O-', '', '', 'Dr. Moore',
    'Medicare', 'MC159357846', 'HOME',
    '(415) 555-0139', 'daniel.lewis@email.com', ARRAY['COPD', 'Emphysema']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4727'),
    'HOME', '5678 25th Street, San Francisco, CA 94110, USA', '5678 25th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4728', 'Margaret', 'Lee', '1991-10-05',
    'female', 'A+', '', '', 'Dr. Jackson',
    'Anthem', 'AN753159846', 'HOME',
    '(415) 555-0140', 'margaret.lee@email.com', ARRAY['Multiple Sclerosis']::varchar[], ARRAY['Penicillin', 'Sulfa Drugs']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4728'),
    'HOME', '6789 26th Street, San Francisco, CA 94110, USA', '6789 26th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4729', 'Joseph', 'Walker', '1969-05-12',
    'male', 'B+', '', '', 'Dr. Harris',
    'United Healthcare', 'UH357951846', 'HOME',
    '(415) 555-0141', 'joseph.walker@email.com', ARRAY['Parkinson''s Disease']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4729'),
    'HOME', '7890 27th Street, San Francisco, CA 94110, USA', '7890 27th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4730', 'Barbara', 'Young', '1986-08-17',
    'female', 'O+', '', '', 'Dr. Clark',
    'Blue Shield', 'BS951357846', 'HOME',
    '(415) 555-0142', 'barbara.young@email.com', ARRAY['Lupus']::varchar[], ARRAY['Latex']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4730'),
    'HOME', '8901 28th Street, San Francisco, CA 94110, USA', '8901 28th Street', 'San Francisco', 'CA', '94110', 'USA'
);

-- Medical records

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotdpxuDGH00',
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'vital_signs',
    '2025-01-15T09:30:00',
    'Routine Follow-up',
    'Vital signs checked during routine follow-up visit.',
    '{"blood_pressure":"128/82","heart_rate":72,"temperature":36.8,"respiratory_rate":16}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotdzZEK7b00',
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'lab_result',
    '2025-01-15T09:45:00',
    'Complete Blood Count',
    'Complete blood count within normal ranges.',
    '{"test_name":"Complete Blood Count","value":7.2,"unit":"K/µL","reference_range":"4.5-11.0 K/µL"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotdv53FmG00',
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'diagnosis',
    '2025-01-15T10:00:00',
    'Hypertension Assessment',
    'Regular assessment of hypertension condition.',
    '{"condition":"Essential Hypertension","severity":"Mild","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotd4t9Lzk00',
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'lab_result',
    '2024-10-15T10:00:00',
    'Lipid Panel',
    'Cholesterol levels showing improvement with statin therapy.',
    '{"test_name":"Total Cholesterol","value":190,"unit":"mg/dL","reference_range":"<200 mg/dL"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotdvlerZR00',
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'diagnosis',
    '2024-07-20T10:15:00',
    'Annual Physical',
    'Annual check-up shows good progress. Cholesterol levels improved.',
    '{"condition":"Hypertension, High Cholesterol","severity":"Mild","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotedygSop00',
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'complaint',
    '2024-04-12T14:30:00',
    'Headache and Dizziness',
    'Patient reports occasional headaches and dizziness. BP slightly elevated.',
    '{"symptom":"Persistent headache","severity":"Moderate","duration":"2-3 times per week"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotetcIVxG00',
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'vital_signs',
    '2024-01-05T09:15:00',
    'BP Check',
    'Blood pressure elevated. Increasing Lisinopril dosage.',
    '{"blood_pressure":"145/92","heart_rate":78,"temperature":36.7,"respiratory_rate":18}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteTvGqsj00',
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'lab_result',
    '2023-10-20T11:30:00',
    'Comprehensive Metabolic Panel',
    'All values within normal range except slightly elevated cholesterol.',
    '{"test_name":"Glucose","value":98,"unit":"mg/dL","reference_range":"70-110 mg/dL"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotekG7snN00',
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'diagnosis',
    '2023-07-15T10:00:00',
    'Annual Physical',
    'Initial diagnosis of hypertension. Starting medication.',
    '{"condition":"Essential Hypertension","severity":"Mild","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotevaLe1Y00',
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'diagnosis',
    '2025-02-10T14:20:00',
    'Emergency Visit - Allergic Reaction',
    'Patient experienced anaphylaxis after latex exposure. Administered epinephrine.',
    '{"condition":"Latex Allergy","severity":"Severe","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteii8EJe00',
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'vital_signs',
    '2024-11-05T15:45:00',
    'Allergy Follow-up',
    'Review of allergy management plan. No recent reactions.',
    '{"blood_pressure":"118/75","heart_rate":72,"temperature":36.8,"respiratory_rate":16}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotetubMPW00',
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'lab_result',
    '2024-08-20T09:30:00',
    'Allergy Panel Results',
    'Confirmed allergies to latex and various pollens.',
    '{"test_name":"Latex IgE","value":"High","unit":"","reference_range":""}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteXdovEN00',
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'complaint',
    '2024-05-15T13:20:00',
    'Seasonal Allergies',
    'Increased allergy symptoms during spring season.',
    '{"symptom":"Seasonal allergy symptoms","severity":"Moderate","duration":"2 weeks"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypote107FKm00',
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'diagnosis',
    '2024-02-10T10:15:00',
    'Annual Physical',
    'Routine check-up. Allergy management plan reviewed and updated.',
    '{"condition":"Severe Allergies","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteUe332L00',
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'diagnosis',
    '2023-09-30T16:00:00',
    'Emergency Visit',
    'Moderate allergic reaction to unknown trigger.',
    '{"condition":"Allergic Reaction","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteViiW4f00',
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'vital_signs',
    '2023-06-15T11:30:00',
    'Follow-up Visit',
    'Regular check of BP and joint function.',
    '{"blood_pressure":"120/78","heart_rate":70,"temperature":36.7,"respiratory_rate":16}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteJ0pEBe00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'diagnosis',
    '2025-01-30T11:00:00',
    'Arthritis Management',
    'Joint pain in hands and knees. Prescribed new anti-inflammatory.',
    '{"condition":"Osteoarthritis","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteNqxNtZ00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'vital_signs',
    '2024-11-15T14:45:00',
    'BP and Joint Check',
    'Blood pressure stable. Joint pain increased with cold weather.',
    '{"blood_pressure":"132/84","heart_rate":74,"temperature":36.8,"respiratory_rate":18}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotez9o4pB00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'lab_result',
    '2024-08-20T10:30:00',
    'Rheumatoid Factor Test',
    'RF and anti-CCP antibodies negative. Consistent with osteoarthritis.',
    '{"test_name":"Rheumatoid Factor","value":"Negative","unit":"","reference_range":""}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypote6zZ90900',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'complaint',
    '2024-05-10T09:15:00',
    'Increased Joint Pain',
    'Reports increased pain in knees after starting new exercise routine.',
    '{"symptom":"Increased joint pain","severity":"Moderate","duration":"2 weeks"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypote0cncvv00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'diagnosis',
    '2024-02-15T13:30:00',
    'Annual Physical',
    'Yearly check-up. Arthritis symptoms progressing slowly.',
    '{"condition":"Osteoarthritis, Hypertension","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteiBnUmk00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'vital_signs',
    '2024-11-20T15:00:00',
    'Follow-up Visit',
    'Regular check of BP and joint function.',
    '{"blood_pressure":"130/82","heart_rate":76,"temperature":36.7,"respiratory_rate":16}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteBuDsGm00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'lab_result',
    '2023-08-05T11:45:00',
    'Comprehensive Panel',
    'Routine blood work to monitor medication effects.',
    '{"test_name":"Creatinine","value":1.1,"unit":"mg/dL","reference_range":"0.6-1.2 mg/dL"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteXpq2Q200',
    (SELECT id FROM patients WHERE patient_id = '4714'),
    'vital_signs',
    '2025-02-15T15:45:00',
    'Asthma Follow-up',
    'Increased frequency of rescue inhaler use. Adjusting maintenance medication.',
    '{"blood_pressure":"128/80","heart_rate":72,"temperature":36.8,"respiratory_rate":18}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteUBwu8t00',
    (SELECT id FROM patients WHERE patient_id = '4715'),
    'lab_result',
    '2025-02-01T13:30:00',
    'Diabetes Check',
    'A1C slightly elevated. Adjusting medication dosage.',
    '{"test_name":"A1C","value":7.2,"unit":"%","reference_range":"<7%"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteqUHNPK00',
    (SELECT id FROM patients WHERE patient_id = '4716'),
    'complaint',
    '2025-02-20T16:15:00',
    'Migraine Episode',
    'Severe migraine with aura. IV medications administered.',
    '{"symptom":"Severe migraine","severity":"Severe","duration":"1 day"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypote0Tvu2h00',
    (SELECT id FROM patients WHERE patient_id = '4717'),
    'diagnosis',
    '2025-02-05T10:30:00',
    'Cardiology Follow-up',
    'Stress test shows stable condition. Continuing current treatment plan.',
    '{"condition":"Coronary Artery Disease - Stable","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypote1mXGts00',
    (SELECT id FROM patients WHERE patient_id = '4718'),
    'lab_result',
    '2025-02-18T14:00:00',
    'Thyroid Function Test',
    'TSH levels normalized with current medication.',
    '{"test_name":"TSH","value":2.5,"unit":"mU/L","reference_range":"0.4-4.5 mU/L"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteKKs7hO00',
    (SELECT id FROM patients WHERE patient_id = '4719'),
    'diagnosis',
    '2025-02-12T20:00:00',
    'Sleep Study Results',
    'CPAP pressure adjusted. Patient reports improved sleep quality.',
    '{"condition":"Obstructive Sleep Apnea","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteZJj10C00',
    (SELECT id FROM patients WHERE patient_id = '4720'),
    'diagnosis',
    '2025-02-08T00:00:00',
    'Psychiatry Follow-up',
    'Symptoms improving with current treatment plan. Continue therapy.',
    '{"condition":"Depression, Fibromyalgia","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteKhTKGh00',
    (SELECT id FROM patients WHERE patient_id = '4721'),
    'diagnosis',
    '2025-01-25T00:00:00',
    'Osteoporosis Follow-up',
    'DEXA scan shows improvement. Continue current treatment.',
    '{"condition":"Osteoporosis","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteIZURXJ00',
    (SELECT id FROM patients WHERE patient_id = '4722'),
    'diagnosis',
    '2025-02-14T00:00:00',
    'Rheumatology Follow-up',
    'Joint swelling decreased. Maintaining current treatment plan.',
    '{"condition":"Rheumatoid Arthritis","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypote3JNnv200',
    (SELECT id FROM patients WHERE patient_id = '4723'),
    'diagnosis',
    '2025-02-03T00:00:00',
    'Nephrology Follow-up',
    'Creatinine stable. Dietary compliance good.',
    '{"condition":"Chronic Kidney Disease Stage 3","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotehDhDUU00',
    (SELECT id FROM patients WHERE patient_id = '4724'),
    'diagnosis',
    '2025-02-16T00:00:00',
    'Gastroenterology Follow-up',
    'Maintaining strict gluten-free diet. Symptoms well controlled.',
    '{"condition":"Celiac Disease","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypote3XOmfv00',
    (SELECT id FROM patients WHERE patient_id = '4725'),
    'diagnosis',
    '2025-02-07T00:00:00',
    'Dermatology Follow-up',
    'Skin lesions improving with current treatment.',
    '{"condition":"Psoriasis","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypote23BRaA00',
    (SELECT id FROM patients WHERE patient_id = '4726'),
    'diagnosis',
    '2025-02-19T00:00:00',
    'Gynecology Follow-up',
    'Pain well managed with current treatment plan.',
    '{"condition":"Endometriosis","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotenqNy9p00',
    (SELECT id FROM patients WHERE patient_id = '4727'),
    'diagnosis',
    '2025-02-11T00:00:00',
    'Pulmonology Follow-up',
    'Breathing improved with current regimen.',
    '{"condition":"COPD with Emphysema","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteKEFhZu00',
    (SELECT id FROM patients WHERE patient_id = '4728'),
    'diagnosis',
    '2025-02-13T00:00:00',
    'Neurology Follow-up',
    'MRI stable. Continuing current treatment plan.',
    '{"condition":"Multiple Sclerosis","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotejOMuho00',
    (SELECT id FROM patients WHERE patient_id = '4729'),
    'diagnosis',
    '2025-02-17T00:00:00',
    'Neurology Follow-up',
    'Tremor well controlled. Adjusting medication timing.',
    '{"condition":"Parkinson''s Disease","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotecvcRXY00',
    (SELECT id FROM patients WHERE patient_id = '4730'),
    'diagnosis',
    '2025-02-09T00:00:00',
    'Rheumatology Follow-up',
    'Disease activity stable. Maintaining current medications.',
    '{"condition":"Lupus","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteokcUw100',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'complaint',
    '2025-02-15T09:00:00',
    'Joint Pain Assessment',
    'Patient reports increasing joint pain in knees and hands.',
    '{"symptom":"Increased joint pain","severity":"Moderate","duration":"2 weeks"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoten2IZ5900',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'lab_result',
    '2025-02-15T09:15:00',
    'Rheumatoid Factor Test',
    'Blood work to assess for rheumatoid arthritis.',
    '{"test_name":"Rheumatoid Factor","value":"Elevated","unit":"","reference_range":""}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteevmh6j00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'diagnosis',
    '2025-02-15T10:00:00',
    'Initial RA Diagnosis',
    'Diagnosed with early-stage rheumatoid arthritis based on symptoms and lab results.',
    '{"condition":"Rheumatoid Arthritis","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteinlbab00',
    (SELECT id FROM patients WHERE patient_id = '4714'),
    'vital_signs',
    '2025-02-22T14:00:00',
    'Emergency Room Visit',
    'Patient presented with chest pain and shortness of breath.',
    '{"blood_pressure":"145/90","heart_rate":98,"temperature":36.9,"respiratory_rate":20}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteoFMU4f00',
    (SELECT id FROM patients WHERE patient_id = '4714'),
    'lab_result',
    '2025-02-22T14:15:00',
    'Cardiac Enzymes',
    'Urgent cardiac panel ordered.',
    '{"test_name":"Troponin","value":"Elevated","unit":"","reference_range":""}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotejcCuum00',
    (SELECT id FROM patients WHERE patient_id = '4714'),
    'diagnosis',
    '2025-02-22T14:45:00',
    'Acute Coronary Syndrome',
    'Diagnosed with NSTEMI based on symptoms and lab results.',
    '{"condition":"NSTEMI","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotew5swtg00',
    (SELECT id FROM patients WHERE patient_id = '4714'),
    'vital_signs',
    '2025-02-22T15:00:00',
    'CCU Admission Vitals',
    'Initial vital signs upon CCU admission.',
    '{"blood_pressure":"138/85","heart_rate":82,"temperature":36.8,"respiratory_rate":18}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteYaLVfQ00',
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'medication',
    '2025-02-23T10:00:00',
    'Lisinopril Prescription',
    'Antihypertensive medication for blood pressure control.',
    '{"name":"Lisinopril","dosage":"10mg","frequency":"Once daily","duration":"Ongoing"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotefEYtJ300',
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'medication',
    '2025-02-23T10:00:00',
    'Atorvastatin Prescription',
    'Statin medication for cholesterol management.',
    '{"name":"Atorvastatin","dosage":"20mg","frequency":"Once daily","duration":"Ongoing"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypote5LpJVf00',
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'medication',
    '2025-02-20T14:30:00',
    'Metformin Prescription',
    'Oral diabetes medication for blood sugar control.',
    '{"name":"Metformin","dosage":"500mg","frequency":"Twice daily","duration":"Ongoing"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteFiBEKd00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'complaint',
    '2025-02-15T09:00:00',
    'Joint Pain Assessment',
    'Patient reports increasing joint pain in knees and hands.',
    '{"symptom":"Increased joint pain","severity":"Moderate","duration":"2 weeks"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotevfcq6k00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'lab_result',
    '2025-02-15T09:15:00',
    'Rheumatoid Factor Test',
    'Blood work to assess for rheumatoid arthritis.',
    '{"test_name":"Rheumatoid Factor","value":"Elevated","unit":"","reference_range":""}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteJwaBTp00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'diagnosis',
    '2025-02-15T10:00:00',
    'Initial RA Diagnosis',
    'Diagnosed with early-stage rheumatoid arthritis based on symptoms and lab results.',
    '{"condition":"Rheumatoid Arthritis","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypoteceVTMF00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'complaint',
    '2025-02-15T09:00:00',
    'Joint Pain Assessment',
    'Patient reports increasing joint pain in knees and hands.',
    '{"symptom":"Increased joint pain","severity":"Moderate","duration":"2 weeks"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotee4Cihm00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'lab_result',
    '2025-02-15T09:15:00',
    'Rheumatoid Factor Test',
    'Blood work to assess for rheumatoid arthritis.',
    '{"test_name":"Rheumatoid Factor","value":"Elevated","unit":"","reference_range":""}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7kypotekBXUAP00',
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'diagnosis',
    '2025-02-15T10:00:00',
    'Initial RA Diagnosis',
    'Diagnosed with early-stage rheumatoid arthritis based on symptoms and lab results.',
    '{"condition":"Rheumatoid Arthritis","severity":"Moderate","status":"Active"}'::jsonb
);

COMMIT;