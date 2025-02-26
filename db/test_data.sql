-- Generated test data SQL
-- Generated at: 2025-02-26T21:30:27.090Z

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
    uuid_generate_v4(), '4711', 'John', 'Anderson', '1988-07-22',
    'male', 'B-', '175[cm]', '80[kg]', 'Dr. Wilson',
    'United Health', 'UH789012345', 'HOME',
    '(415) 555-0127', 'john.anderson@email.com', ARRAY['Asthma']::varchar[], ARRAY['Sulfa']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4711'),
    'HOME', '890 Cedar Lane, San Francisco, CA 94107, USA', '890 Cedar Lane', 'San Francisco', 'CA', '94107', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4712', 'Robert', 'Anderson', '1971-08-30',
    'male', 'A+', '', '', 'Dr. White',
    'Anthem', 'AN159753468', 'HOME',
    '(415) 555-0131', 'robert.anderson@email.com', ARRAY['GERD', 'Sleep Apnea']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4712'),
    'HOME', '5678 Guerrero Street, San Francisco, CA 94110, USA', '5678 Guerrero Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4713', 'Michael', 'Bennett', '1975-03-15',
    'male', 'B-', '176[cm]', '78[kg]', 'Dr. Nelson',
    'United Health', 'UH901234567', 'HOME',
    '(415) 555-0135', 'michael.bennett@email.com', ARRAY['Chronic Back Pain']::varchar[], ARRAY['Aspirin']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4713'),
    'HOME', '789 Spruce Court, San Francisco, CA 94115, USA', '789 Spruce Court', 'San Francisco', 'CA', '94115', 'USA'
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
    uuid_generate_v4(), '4715', 'Susan', 'Clark', '1982-03-25',
    'female', 'B-', '', '', 'Dr. Wilson',
    'Cigna', 'CG357951846', 'HOME',
    '(415) 555-0138', 'susan.clark@email.com', ARRAY['Endometriosis']::varchar[], ARRAY['Aspirin']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4715'),
    'HOME', '4567 24th Street, San Francisco, CA 94110, USA', '4567 24th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4716', 'Lisa', 'Coleman', '1988-07-22',
    'female', 'O+', '167[cm]', '61[kg]', 'Dr. Murphy',
    'Kaiser', 'KP012345678', 'HOME',
    '(415) 555-0136', 'lisa.coleman@email.com', ARRAY['Eczema']::varchar[], ARRAY['Bee Stings']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4716'),
    'HOME', '890 Maple Court, San Francisco, CA 94116, USA', '890 Maple Court', 'San Francisco', 'CA', '94116', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4717', 'William', 'Cooper', '1962-11-30',
    'male', 'B+', '178[cm]', '82[kg]', 'Dr. Taylor',
    'Anthem', 'AN567890123', 'HOME',
    '(415) 555-0131', 'william.cooper@email.com', ARRAY['GERD']::varchar[], ARRAY['Ibuprofen']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4717'),
    'HOME', '234 Pine Street, San Francisco, CA 94111, USA', '234 Pine Street', 'San Francisco', 'CA', '94111', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4718', 'Lisa', 'Foster', '1988-07-22',
    'female', 'A-', '170[cm]', '65[kg]', 'Dr. Garcia',
    'Humana', 'HU345678901', 'HOME',
    '(415) 555-0130', 'lisa.foster@email.com', ARRAY['Anxiety']::varchar[], ARRAY['Dust']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4718'),
    'HOME', '789 Elm Court, San Francisco, CA 94110, USA', '789 Elm Court', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4719', 'Lisa', 'Garcia', '1992-12-10',
    'female', 'A-', '', '', 'Dr. Wilson',
    'Cigna', 'CG852963741', 'HOME',
    '(415) 555-0128', 'lisa.garcia@email.com', ARRAY['Migraine', 'Anxiety']::varchar[], ARRAY['Shellfish']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4719'),
    'HOME', '2345 Mission Street, San Francisco, CA 94110, USA', '2345 Mission Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4720', 'Thomas', 'Harris', '1976-12-08',
    'male', 'AB+', '', '', 'Dr. Thompson',
    'Blue Cross', 'BC951357846', 'HOME',
    '(415) 555-0137', 'thomas.harris@email.com', ARRAY['Psoriasis', 'Anxiety']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4720'),
    'HOME', '3456 23rd Street, San Francisco, CA 94110, USA', '3456 23rd Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4721', 'Emma', 'Hayes', '1962-11-30',
    'female', 'AB-', '172[cm]', '67[kg]', 'Dr. Adams',
    'Aetna', 'AE890123456', 'HOME',
    '(415) 555-0134', 'emma.hayes@email.com', ARRAY['Osteoporosis']::varchar[], ARRAY['Dairy']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4721'),
    'HOME', '678 Cherry Street, San Francisco, CA 94114, USA', '678 Cherry Street', 'San Francisco', 'CA', '94114', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4722', 'Richard', 'Jackson', '1959-01-20',
    'male', 'A+', '', '', 'Dr. Martinez',
    'Humana', 'HU456123789', 'HOME',
    '(415) 555-0135', 'richard.jackson@email.com', ARRAY['Chronic Kidney Disease', 'Hypertension']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4722'),
    'HOME', '9012 21st Street, San Francisco, CA 94110, USA', '9012 21st Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4723', 'Emma', 'Johnson', '1988-07-22',
    'female', 'O-', '', '', 'Dr. Martinez',
    'Aetna', 'AE987654321', 'HOME',
    '(415) 555-0124', 'emma.johnson@email.com', ARRAY['Severe Allergies']::varchar[], ARRAY['Latex', 'Pollen']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4723'),
    'HOME', '456 Pine Avenue, San Francisco, CA 94110, USA', '456 Pine Avenue', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4724', 'Margaret', 'Lee', '1991-10-05',
    'female', 'A+', '', '', 'Dr. Jackson',
    'Anthem', 'AN753159846', 'HOME',
    '(415) 555-0140', 'margaret.lee@email.com', ARRAY['Multiple Sclerosis']::varchar[], ARRAY['Penicillin', 'Sulfa Drugs']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4724'),
    'HOME', '6789 26th Street, San Francisco, CA 94110, USA', '6789 26th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4725', 'Daniel', 'Lewis', '1964-07-19',
    'male', 'O-', '', '', 'Dr. Moore',
    'Medicare', 'MC159357846', 'HOME',
    '(415) 555-0139', 'daniel.lewis@email.com', ARRAY['COPD', 'Emphysema']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4725'),
    'HOME', '5678 25th Street, San Francisco, CA 94110, USA', '5678 25th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4726', 'Jennifer', 'Martin', '1983-11-12',
    'female', 'AB-', '', '', 'Dr. Brown',
    'United Healthcare', 'UH951753684', 'HOME',
    '(415) 555-0132', 'jennifer.martin@email.com', ARRAY['Depression', 'Fibromyalgia']::varchar[], ARRAY['Peanuts']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4726'),
    'HOME', '6789 Dolores Street, San Francisco, CA 94110, USA', '6789 Dolores Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4727', 'David', 'Miller', '1980-09-05',
    'male', 'O+', '', '', 'Dr. Patel',
    'Kaiser', 'KP159753468', 'HOME',
    '(415) 555-0127', 'david.miller@email.com', ARRAY['Type 2 Diabetes']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4727'),
    'HOME', '901 Valencia Street, San Francisco, CA 94110, USA', '901 Valencia Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4728', 'John', 'Mitchell', '1988-07-22',
    'male', 'A+', '183[cm]', '88[kg]', 'Dr. White',
    'Medicare', 'MC789012345', 'HOME',
    '(415) 555-0133', 'john.mitchell@email.com', ARRAY['Sleep Apnea']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4728'),
    'HOME', '567 Walnut Lane, San Francisco, CA 94113, USA', '567 Walnut Lane', 'San Francisco', 'CA', '94113', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4729', 'Patricia', 'Moore', '1987-09-28',
    'other', 'B+', '', '', 'Dr. Taylor',
    'Aetna', 'AE753951852', 'HOME',
    '(415) 555-0134', 'patricia.moore@email.com', ARRAY['Rheumatoid Arthritis']::varchar[], ARRAY['Ibuprofen']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4729'),
    'HOME', '8901 20th Street, San Francisco, CA 94110, USA', '8901 20th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4730', 'Susan', 'Morgan', '1975-03-15',
    'female', 'O-', '168[cm]', '63[kg]', 'Dr. Rodriguez',
    'Blue Shield', 'BS678901234', 'HOME',
    '(415) 555-0132', 'susan.morgan@email.com', ARRAY['Hypothyroidism']::varchar[], ARRAY['Peanuts']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4730'),
    'HOME', '345 Oak Avenue, San Francisco, CA 94112, USA', '345 Oak Avenue', 'San Francisco', 'CA', '94112', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4731', 'Emma', 'Parker', '1962-11-30',
    'female', 'AB+', '165[cm]', '62[kg]', 'Dr. Lee',
    'Kaiser', 'KP456789012', 'HOME',
    '(415) 555-0128', 'emma.parker@email.com', ARRAY['Migraine']::varchar[], ARRAY['Shellfish']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4731'),
    'HOME', '567 Maple Drive, San Francisco, CA 94108, USA', '567 Maple Drive', 'San Francisco', 'CA', '94108', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4732', 'Michael', 'Roberts', '1975-03-15',
    'male', 'O+', '182[cm]', '85[kg]', 'Dr. Brown',
    'Cigna', 'CI234567890', 'HOME',
    '(415) 555-0129', 'michael.roberts@email.com', ARRAY['Type 2 Diabetes']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4732'),
    'HOME', '432 Birch Street, San Francisco, CA 94109, USA', '432 Birch Street', 'San Francisco', 'CA', '94109', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4733', 'Maria', 'Rodriguez', '1990-02-14',
    'female', 'O+', '', '', 'Dr. Nguyen',
    'Blue Shield', 'BS741852963', 'HOME',
    '(415) 555-0130', 'maria.rodriguez@email.com', ARRAY['Hypothyroidism']::varchar[], ARRAY['Sulfa Drugs']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4733'),
    'HOME', '4567 24th Street, San Francisco, CA 94110, USA', '4567 24th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4734', 'John', 'Smith', '1975-03-15',
    'male', 'A+', '180[cm]', '75[kg]', 'Dr. Anderson',
    'Blue Cross', 'BC123456789', 'HOME',
    '(415) 555-0123', 'john.smith@email.com', ARRAY['Hypertension', 'High Cholesterol']::varchar[], ARRAY['Penicillin']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4734'),
    'HOME', '123 Oak Street, San Francisco, CA 94105, USA', '123 Oak Street', 'San Francisco', 'CA', '94105', 'USA'
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4734'),
    'WORK', '555 Market Street, San Francisco, CA 94105, USA', '555 Market Street', 'San Francisco', 'CA', '94105', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4735', 'James', 'Taylor', '1958-06-25',
    'male', 'B-', '', '', 'Dr. Lee',
    'Humana', 'HU963852741', 'HOME',
    '(415) 555-0129', 'james.taylor@email.com', ARRAY['Coronary Artery Disease', 'Type 2 Diabetes']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4735'),
    'HOME', '3456 Folsom Street, San Francisco, CA 94110, USA', '3456 Folsom Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4736', 'William', 'Thompson', '1967-04-03',
    'male', 'O-', '', '', 'Dr. Garcia',
    'Medicare', 'MC357159852', 'HOME',
    '(415) 555-0133', 'william.thompson@email.com', ARRAY['Osteoporosis']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4736'),
    'HOME', '7890 19th Street, San Francisco, CA 94110, USA', '7890 19th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4737', 'Joseph', 'Walker', '1969-05-12',
    'male', 'B+', '', '', 'Dr. Harris',
    'United Healthcare', 'UH357951846', 'HOME',
    '(415) 555-0141', 'joseph.walker@email.com', ARRAY['Parkinson''s Disease']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4737'),
    'HOME', '7890 27th Street, San Francisco, CA 94110, USA', '7890 27th Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4738', 'Elizabeth', 'White', '1993-06-15',
    'female', 'O+', '', '', 'Dr. Anderson',
    'Kaiser', 'KP789456123', 'HOME',
    '(415) 555-0136', 'elizabeth.white@email.com', ARRAY['Celiac Disease']::varchar[], ARRAY['Dairy']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4738'),
    'HOME', '2345 22nd Street, San Francisco, CA 94110, USA', '2345 22nd Street', 'San Francisco', 'CA', '94110', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4739', 'Michael', 'Williams', '1962-11-30',
    'male', 'B+', '', '', 'Dr. Chen',
    'Medicare', 'MC456789123', 'HOME',
    '(415) 555-0125', 'michael.williams@email.com', ARRAY['Hypertension', 'Arthritis']::varchar[], ARRAY[]::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4739'),
    'HOME', '789 Market Street, Apt 4B, San Francisco, CA 94103, USA', '789 Market Street, Apt 4B', 'San Francisco', 'CA', '94103', 'USA'
);

INSERT INTO patients (
    id, patient_id, first_name, last_name, date_of_birth, 
    gender, blood_type, height, weight, primary_physician,
    insurance_provider, insurance_number, primary_address_type,
    phone, email, conditions, allergies
) VALUES (
    uuid_generate_v4(), '4740', 'Barbara', 'Young', '1986-08-17',
    'female', 'O+', '', '', 'Dr. Clark',
    'Blue Shield', 'BS951357846', 'HOME',
    '(415) 555-0142', 'barbara.young@email.com', ARRAY['Lupus']::varchar[], ARRAY['Latex']::varchar[]
);

INSERT INTO addresses (
    id, patient_id, address_type, address_line, street, city, state, zip_code, country
) VALUES (
    uuid_generate_v4(), 
    (SELECT id FROM patients WHERE patient_id = '4740'),
    'HOME', '8901 28th Street, San Francisco, CA 94110, USA', '8901 28th Street', 'San Francisco', 'CA', '94110', 'USA'
);

-- Medical records

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7mfb285sti1AP00',
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
    'm7mfb285xA4K8R00',
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
    'm7mfb285NgCoGG00',
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
    'm7mfb285kqBfeP00',
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
    'm7mfb285MSQcYF00',
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
    'm7mfb285RHfWEL00',
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
    'm7mfb285gsbT1D00',
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
    'm7mfb285sFRc5r00',
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
    'm7mfb285w7BQwg00',
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
    'm7mfb285LQf2Ps00',
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
    'm7mfb2851SYlJK00',
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
    'm7mfb285vqLWqe00',
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
    'm7mfb285C2KSjS00',
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
    'm7mfb285G8X8Pd00',
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
    'm7mfb285fUrCPH00',
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
    'm7mfb285C6oNib00',
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
    'm7mfb285AAMyKd00',
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
    'm7mfb2859SNqiW00',
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
    'm7mfb2852OZZXT00',
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
    'm7mfb285UuocA100',
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
    'm7mfb285xgr4ma00',
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
    'm7mfb285W5qMoN00',
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
    'm7mfb285MRIg5X00',
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
    'm7mfb285a0Mu6K00',
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
    'm7mfb285NAUenq00',
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
    'm7mfb2855MCHyE00',
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
    'm7mfb285ZUWhrt00',
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
    'm7mfb285hEuNl700',
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
    'm7mfb285KSKKE900',
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
    'm7mfb2856AjNRX00',
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
    'm7mfb285v9SkA000',
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
    'm7mfb285ejrivE00',
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
    'm7mfb285CDziUz00',
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
    'm7mfb285hsCdfU00',
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
    'm7mfb285OgI1fd00',
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
    'm7mfb285wcN5Hn00',
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
    'm7mfb2852mwQUa00',
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
    'm7mfb2852gJSRT00',
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
    'm7mfb285XxW3eh00',
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
    'm7mfb285ZJHQH800',
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
    'm7mfb285w2YVV500',
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
    'm7mfb285NcTaFp00',
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
    'm7mfb285NJlr8s00',
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
    'm7mfb285QN6KWC00',
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
    'm7mfb2850eaumJ00',
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
    'm7mfb285zbdrzS00',
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
    'm7mfb285oY3Y2100',
    (SELECT id FROM patients WHERE patient_id = '4730'),
    'vital_signs',
    '2025-02-20T10:30:00',
    'Regular Check-up',
    'Routine health check with normal vital signs.',
    '{"blood_pressure":"120/80","heart_rate":68,"temperature":36.6,"respiratory_rate":14}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7mfb285QMrLwV00',
    (SELECT id FROM patients WHERE patient_id = '4731'),
    'diagnosis',
    '2025-02-18T14:15:00',
    'Migraine Assessment',
    'Follow-up for chronic migraine management.',
    '{"condition":"Chronic Migraine","severity":"Moderate","status":"Active"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7mfb285jDuSD300',
    (SELECT id FROM patients WHERE patient_id = '4732'),
    'lab_result',
    '2025-02-15T09:00:00',
    'HbA1c Test',
    'Diabetes monitoring blood test.',
    '{"test_name":"HbA1c","value":7.1,"unit":"%","reference_range":"4.0-5.6%"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7mfb285CcUGG600',
    (SELECT id FROM patients WHERE patient_id = '4733'),
    'prescription',
    '2025-02-12T11:30:00',
    'Anxiety Medication',
    'Prescription renewal for anxiety management.',
    '{"medication":"Sertraline","dosage":"50mg","frequency":"Once daily","duration":"3 months"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7mfb285VQo88v00',
    (SELECT id FROM patients WHERE patient_id = '4734'),
    'procedure',
    '2025-02-10T15:45:00',
    'Endoscopy',
    'Upper endoscopy for GERD evaluation.',
    '{"procedure_type":"Upper Endoscopy","findings":"Mild esophagitis","recommendations":"Continue PPI medication"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7mfb285qnkrbr00',
    (SELECT id FROM patients WHERE patient_id = '4735'),
    'lab_result',
    '2025-02-08T13:20:00',
    'Thyroid Function Test',
    'Regular thyroid hormone level check.',
    '{"test_name":"TSH","value":4.2,"unit":"mIU/L","reference_range":"0.4-4.0 mIU/L"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7mfb285WGxYZH00',
    (SELECT id FROM patients WHERE patient_id = '4736'),
    'procedure',
    '2025-02-05T16:00:00',
    'Sleep Study',
    'Overnight polysomnography for sleep apnea monitoring.',
    '{"procedure_type":"Polysomnography","findings":"Moderate sleep apnea","recommendations":"CPAP therapy adjustment"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7mfb2858xHnhJ00',
    (SELECT id FROM patients WHERE patient_id = '4737'),
    'lab_result',
    '2025-02-03T10:45:00',
    'Bone Density Scan',
    'DEXA scan for osteoporosis monitoring.',
    '{"test_name":"DEXA Scan","value":-2.3,"unit":"T-score","reference_range":">-1.0"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7mfb285OOpFnl00',
    (SELECT id FROM patients WHERE patient_id = '4738'),
    'treatment',
    '2025-02-01T14:30:00',
    'Physical Therapy',
    'Back pain management session.',
    '{"treatment_type":"Physical Therapy","focus_area":"Lower back","exercises":"Core strengthening, stretching","progress":"Moderate improvement"}'::jsonb
);

INSERT INTO medical_records (
    record_id, patient_id, record_type, recorded_at,
    title, description, details
) VALUES (
    'm7mfb285vP2kkC00',
    (SELECT id FROM patients WHERE patient_id = '4739'),
    'diagnosis',
    '2025-01-30T11:15:00',
    'Eczema Follow-up',
    'Regular check of eczema condition.',
    '{"condition":"Atopic Dermatitis","severity":"Mild","status":"Under control"}'::jsonb
);

COMMIT;