-- EXTENDED FEATURES SCHEMA
-- Run this SQL in your Supabase SQL Editor

-- ==========================================
-- 1. CAREER APPLICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS career_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users (admins) can view applications
CREATE POLICY "Authenticated users can view applications"
ON career_applications FOR SELECT
TO authenticated
USING (true);

-- Policy: Anyone can submit an application
CREATE POLICY "Anyone can submit applications"
ON career_applications FOR INSERT
WITH CHECK (true);

-- Policy: Authenticated users can update applications
CREATE POLICY "Authenticated users can update applications"
ON career_applications FOR UPDATE
TO authenticated
USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_applications_career_id ON career_applications(career_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON career_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON career_applications(created_at DESC);

-- ==========================================
-- 2. LEGAL DRAFTS/TEMPLATES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS legal_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('bail', 'agreements', 'petitions', 'notices', 'affidavits', 'contracts', 'other')),
    description TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx', 'doc')),
    file_size INTEGER, -- in bytes
    downloads_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE legal_drafts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active drafts
CREATE POLICY "Public can view active drafts"
ON legal_drafts FOR SELECT
USING (is_active = true);

-- Policy: Authenticated users can manage drafts
CREATE POLICY "Authenticated users can manage drafts"
ON legal_drafts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_drafts_category ON legal_drafts(category);
CREATE INDEX IF NOT EXISTS idx_drafts_active ON legal_drafts(is_active);
CREATE INDEX IF NOT EXISTS idx_drafts_downloads ON legal_drafts(downloads_count DESC);

-- ==========================================
-- 3. COURT VC LINKS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS court_vc_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    court_name TEXT NOT NULL,
    judge_name TEXT NOT NULL,
    court_type TEXT NOT NULL CHECK (court_type IN ('supreme-court', 'high-court', 'district-court', 'sessions-court', 'magistrate-court', 'tribunal')),
    state TEXT NOT NULL,
    district TEXT,
    vc_link TEXT NOT NULL,
    additional_info TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE court_vc_links ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active VC links
CREATE POLICY "Public can view active vc links"
ON court_vc_links FOR SELECT
USING (is_active = true);

-- Policy: Authenticated users can manage VC links
CREATE POLICY "Authenticated users can manage vc links"
ON court_vc_links FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes for search
CREATE INDEX IF NOT EXISTS idx_vc_judge_name ON court_vc_links USING gin(to_tsvector('english', judge_name));
CREATE INDEX IF NOT EXISTS idx_vc_court_name ON court_vc_links USING gin(to_tsvector('english', court_name));
CREATE INDEX IF NOT EXISTS idx_vc_court_type ON court_vc_links(court_type);
CREATE INDEX IF NOT EXISTS idx_vc_state ON court_vc_links(state);

-- ==========================================
-- 4. COURT FEE STRUCTURE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS court_fee_structure (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_type TEXT NOT NULL,
    court_type TEXT NOT NULL CHECK (court_type IN ('supreme-court', 'high-court', 'district-court', 'sessions-court', 'magistrate-court', 'tribunal')),
    min_claim_value DECIMAL(15,2),
    max_claim_value DECIMAL(15,2),
    fixed_fee DECIMAL(10,2),
    percentage_fee DECIMAL(5,2),
    additional_charges TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE court_fee_structure ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active fee structures
CREATE POLICY "Public can view active fee structures"
ON court_fee_structure FOR SELECT
USING (is_active = true);

-- Policy: Authenticated users can manage fee structures
CREATE POLICY "Authenticated users can manage fee structures"
ON court_fee_structure FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fee_case_type ON court_fee_structure(case_type);
CREATE INDEX IF NOT EXISTS idx_fee_court_type ON court_fee_structure(court_type);

-- ==========================================
-- 5. POLICE STATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS police_stations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    station_name TEXT NOT NULL,
    station_code TEXT,
    district TEXT NOT NULL,
    region TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT,
    phone TEXT,
    email TEXT,
    jurisdictional_court TEXT NOT NULL,
    court_address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE police_stations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active police stations
CREATE POLICY "Public can view active police stations"
ON police_stations FOR SELECT
USING (is_active = true);

-- Policy: Authenticated users can manage police stations
CREATE POLICY "Authenticated users can manage police stations"
ON police_stations FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes for search
CREATE INDEX IF NOT EXISTS idx_ps_name ON police_stations USING gin(to_tsvector('english', station_name));
CREATE INDEX IF NOT EXISTS idx_ps_city ON police_stations(city);
CREATE INDEX IF NOT EXISTS idx_ps_state ON police_stations(state);
CREATE INDEX IF NOT EXISTS idx_ps_court ON police_stations USING gin(to_tsvector('english', jurisdictional_court));

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON career_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at
    BEFORE UPDATE ON legal_drafts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vc_links_updated_at
    BEFORE UPDATE ON court_vc_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fee_structure_updated_at
    BEFORE UPDATE ON court_fee_structure
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_police_stations_updated_at
    BEFORE UPDATE ON police_stations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SAMPLE DATA
-- ==========================================

-- Sample Court Fee Structure
INSERT INTO court_fee_structure (case_type, court_type, min_claim_value, max_claim_value, fixed_fee, percentage_fee, description) VALUES
('Civil Suit', 'district-court', 0, 100000, 500, 2.5, 'For suits valued up to ₹1 lakh'),
('Civil Suit', 'district-court', 100001, 500000, 2500, 3.0, 'For suits valued between ₹1-5 lakhs'),
('Civil Suit', 'high-court', 0, 1000000, 5000, 3.5, 'For suits valued up to ₹10 lakhs'),
('Criminal Petition', 'sessions-court', NULL, NULL, 1000, NULL, 'Fixed fee for criminal petitions'),
('Bail Application', 'magistrate-court', NULL, NULL, 500, NULL, 'Fixed fee for bail applications'),
('Writ Petition', 'high-court', NULL, NULL, 10000, NULL, 'Fixed fee for writ petitions');

-- Sample Court VC Links (You'll need to add real links)
INSERT INTO court_vc_links (court_name, judge_name, court_type, state, district, vc_link, additional_info) VALUES
('Delhi High Court', 'Justice Rajesh Bindal', 'high-court', 'Delhi', 'New Delhi', 'https://example.com/vc/dhc-rb', 'Court No. 1'),
('Tis Hazari Courts', 'Magistrate Amit Kumar', 'magistrate-court', 'Delhi', 'North Delhi', 'https://example.com/vc/thc-ak', 'Court No. 12');

-- Sample Police Stations
INSERT INTO police_stations (station_name, district, region, station_code, address, city, state, pincode, phone, jurisdictional_court, court_address) VALUES
('Rohini North', 'Rohini District', 'Delhi', 'PS001', 'Rohini Sector 9, Delhi', 'New Delhi', 'Delhi', '110085', '011-23412345', 'Rohini Courts', 'Rohini, Delhi - 110085'),
('Rohini South', 'Rohini District', 'Delhi', 'PS002', 'Rohini Sector 3, Delhi', 'New Delhi', 'Delhi', '110085', '011-25752345', 'Rohini Courts', 'Rohini, Delhi - 110085'),
('Rohini Cyber Cell', 'Rohini District', 'Delhi', 'PS003', 'Sector 23, Rohini, Delhi', 'New Delhi', 'Delhi', '110085', '011-26522345', 'Rohini Courts', 'Rohini, Delhi - 110085'),
('Connaught Place Police Station', 'New Delhi District', 'Delhi', 'PS004', 'Connaught Place, New Delhi', 'New Delhi', 'Delhi', '110001', '011-23412345', 'Patiala House Courts', 'Patiala House, New Delhi - 110001'),
('Dwarka Sector 23', 'Dwarka District', 'Delhi', 'PS005', 'Dwarka Sector 23, New Delhi', 'New Delhi', 'Delhi', '110075', '011-23410000', 'Dwarka Courts', 'Dwarka, New Delhi - 110075');
