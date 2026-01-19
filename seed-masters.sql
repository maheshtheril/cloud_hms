-- 1. Seed Currencies
INSERT INTO currencies (code, name, symbol, is_active) VALUES
('INR', 'Indian Rupee', '₹', true),
('USD', 'US Dollar', '$', true),
('AED', 'UAE Dirham', 'AED', true),
('EUR', 'Euro', '€', true),
('GBP', 'British Pound', '£', true)
ON CONFLICT (code) DO NOTHING;

-- 2. Seed Countries
INSERT INTO countries (iso2, iso3, name, flag, region, is_active) VALUES
('IN', 'IND', 'India', '🇮🇳', 'Asia', true),
('US', 'USA', 'United States', '🇺🇸', 'Americas', true),
('AE', 'ARE', 'United Arab Emirates', '🇦🇪', 'Asia', true),
('GB', 'GBR', 'United Kingdom', '🇬🇧', 'Europe', true)
ON CONFLICT (iso2) DO NOTHING;
