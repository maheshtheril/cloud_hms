-- Global Geography Seed
-- Includes All Countries and All States (~5000+ regions)
-- Districts included for: India (Comprehensive)

-- 1. Insert Countries

INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AF', 'AFG', 'Afghanistan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AX', 'ALA', 'Aland Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AL', 'ALB', 'Albania', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('DZ', 'DZA', 'Algeria', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AS', 'ASM', 'American Samoa', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AD', 'AND', 'Andorra', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AO', 'AGO', 'Angola', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AI', 'AIA', 'Anguilla', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AQ', 'ATA', 'Antarctica', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AG', 'ATG', 'Antigua and Barbuda', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AR', 'ARG', 'Argentina', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AM', 'ARM', 'Armenia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AW', 'ABW', 'Aruba', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AU', 'AUS', 'Australia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AT', 'AUT', 'Austria', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AZ', 'AZE', 'Azerbaijan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BS', 'BHS', 'The Bahamas', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BH', 'BHR', 'Bahrain', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BD', 'BGD', 'Bangladesh', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BB', 'BRB', 'Barbados', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BY', 'BLR', 'Belarus', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BE', 'BEL', 'Belgium', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BZ', 'BLZ', 'Belize', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BJ', 'BEN', 'Benin', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BM', 'BMU', 'Bermuda', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BT', 'BTN', 'Bhutan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BO', 'BOL', 'Bolivia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BA', 'BIH', 'Bosnia and Herzegovina', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BW', 'BWA', 'Botswana', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BV', 'BVT', 'Bouvet Island', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BR', 'BRA', 'Brazil', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('IO', 'IOT', 'British Indian Ocean Territory', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BN', 'BRN', 'Brunei', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BG', 'BGR', 'Bulgaria', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BF', 'BFA', 'Burkina Faso', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BI', 'BDI', 'Burundi', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KH', 'KHM', 'Cambodia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CM', 'CMR', 'Cameroon', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CA', 'CAN', 'Canada', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CV', 'CPV', 'Cape Verde', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KY', 'CYM', 'Cayman Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CF', 'CAF', 'Central African Republic', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TD', 'TCD', 'Chad', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CL', 'CHL', 'Chile', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CN', 'CHN', 'China', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CX', 'CXR', 'Christmas Island', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CC', 'CCK', 'Cocos (Keeling) Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CO', 'COL', 'Colombia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KM', 'COM', 'Comoros', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CG', 'COG', 'Congo', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CD', 'COD', 'Democratic Republic of the Congo', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CK', 'COK', 'Cook Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CR', 'CRI', 'Costa Rica', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CI', 'CIV', 'Ivory Coast', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('HR', 'HRV', 'Croatia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CU', 'CUB', 'Cuba', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CY', 'CYP', 'Cyprus', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CZ', 'CZE', 'Czech Republic', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('DK', 'DNK', 'Denmark', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('DJ', 'DJI', 'Djibouti', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('DM', 'DMA', 'Dominica', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('DO', 'DOM', 'Dominican Republic', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TL', 'TLS', 'Timor-Leste', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('EC', 'ECU', 'Ecuador', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('EG', 'EGY', 'Egypt', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SV', 'SLV', 'El Salvador', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GQ', 'GNQ', 'Equatorial Guinea', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('ER', 'ERI', 'Eritrea', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('EE', 'EST', 'Estonia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('ET', 'ETH', 'Ethiopia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('FK', 'FLK', 'Falkland Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('FO', 'FRO', 'Faroe Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('FJ', 'FJI', 'Fiji Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('FI', 'FIN', 'Finland', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('FR', 'FRA', 'France', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GF', 'GUF', 'French Guiana', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PF', 'PYF', 'French Polynesia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TF', 'ATF', 'French Southern Territories', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GA', 'GAB', 'Gabon', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GM', 'GMB', 'The Gambia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GE', 'GEO', 'Georgia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('DE', 'DEU', 'Germany', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GH', 'GHA', 'Ghana', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GI', 'GIB', 'Gibraltar', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GR', 'GRC', 'Greece', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GL', 'GRL', 'Greenland', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GD', 'GRD', 'Grenada', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GP', 'GLP', 'Guadeloupe', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GU', 'GUM', 'Guam', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GT', 'GTM', 'Guatemala', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GG', 'GGY', 'Guernsey', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GN', 'GIN', 'Guinea', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GW', 'GNB', 'Guinea-Bissau', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GY', 'GUY', 'Guyana', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('HT', 'HTI', 'Haiti', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('HM', 'HMD', 'Heard Island and McDonald Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('HN', 'HND', 'Honduras', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('HK', 'HKG', 'Hong Kong S.A.R.', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('HU', 'HUN', 'Hungary', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('IS', 'ISL', 'Iceland', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('IN', 'IND', 'India', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('ID', 'IDN', 'Indonesia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('IR', 'IRN', 'Iran', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('IQ', 'IRQ', 'Iraq', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('IE', 'IRL', 'Ireland', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('IL', 'ISR', 'Israel', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('IT', 'ITA', 'Italy', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('JM', 'JAM', 'Jamaica', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('JP', 'JPN', 'Japan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('JE', 'JEY', 'Jersey', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('JO', 'JOR', 'Jordan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KZ', 'KAZ', 'Kazakhstan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KE', 'KEN', 'Kenya', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KI', 'KIR', 'Kiribati', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KP', 'PRK', 'North Korea', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KR', 'KOR', 'South Korea', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KW', 'KWT', 'Kuwait', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KG', 'KGZ', 'Kyrgyzstan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LA', 'LAO', 'Laos', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LV', 'LVA', 'Latvia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LB', 'LBN', 'Lebanon', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LS', 'LSO', 'Lesotho', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LR', 'LBR', 'Liberia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LY', 'LBY', 'Libya', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LI', 'LIE', 'Liechtenstein', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LT', 'LTU', 'Lithuania', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LU', 'LUX', 'Luxembourg', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MO', 'MAC', 'Macau S.A.R.', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MK', 'MKD', 'North Macedonia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MG', 'MDG', 'Madagascar', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MW', 'MWI', 'Malawi', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MY', 'MYS', 'Malaysia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MV', 'MDV', 'Maldives', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('ML', 'MLI', 'Mali', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MT', 'MLT', 'Malta', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('IM', 'IMN', 'Man (Isle of)', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MH', 'MHL', 'Marshall Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MQ', 'MTQ', 'Martinique', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MR', 'MRT', 'Mauritania', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MU', 'MUS', 'Mauritius', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('YT', 'MYT', 'Mayotte', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MX', 'MEX', 'Mexico', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('FM', 'FSM', 'Micronesia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MD', 'MDA', 'Moldova', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MC', 'MCO', 'Monaco', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MN', 'MNG', 'Mongolia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('ME', 'MNE', 'Montenegro', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MS', 'MSR', 'Montserrat', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MA', 'MAR', 'Morocco', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MZ', 'MOZ', 'Mozambique', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MM', 'MMR', 'Myanmar', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NA', 'NAM', 'Namibia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NR', 'NRU', 'Nauru', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NP', 'NPL', 'Nepal', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BQ', 'BES', 'Bonaire, Sint Eustatius and Saba', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NL', 'NLD', 'Netherlands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NC', 'NCL', 'New Caledonia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NZ', 'NZL', 'New Zealand', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NI', 'NIC', 'Nicaragua', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NE', 'NER', 'Niger', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NG', 'NGA', 'Nigeria', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NU', 'NIU', 'Niue', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NF', 'NFK', 'Norfolk Island', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MP', 'MNP', 'Northern Mariana Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('NO', 'NOR', 'Norway', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('OM', 'OMN', 'Oman', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PK', 'PAK', 'Pakistan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PW', 'PLW', 'Palau', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PS', 'PSE', 'Palestinian Territory Occupied', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PA', 'PAN', 'Panama', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PG', 'PNG', 'Papua New Guinea', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PY', 'PRY', 'Paraguay', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PE', 'PER', 'Peru', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PH', 'PHL', 'Philippines', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PN', 'PCN', 'Pitcairn Island', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PL', 'POL', 'Poland', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PT', 'PRT', 'Portugal', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PR', 'PRI', 'Puerto Rico', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('QA', 'QAT', 'Qatar', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('RE', 'REU', 'Reunion', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('RO', 'ROU', 'Romania', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('RU', 'RUS', 'Russia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('RW', 'RWA', 'Rwanda', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SH', 'SHN', 'Saint Helena', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('KN', 'KNA', 'Saint Kitts and Nevis', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LC', 'LCA', 'Saint Lucia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('PM', 'SPM', 'Saint Pierre and Miquelon', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('VC', 'VCT', 'Saint Vincent and the Grenadines', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('BL', 'BLM', 'Saint-Barthelemy', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('MF', 'MAF', 'Saint-Martin (French part)', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('WS', 'WSM', 'Samoa', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SM', 'SMR', 'San Marino', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('ST', 'STP', 'Sao Tome and Principe', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SA', 'SAU', 'Saudi Arabia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SN', 'SEN', 'Senegal', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('RS', 'SRB', 'Serbia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SC', 'SYC', 'Seychelles', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SL', 'SLE', 'Sierra Leone', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SG', 'SGP', 'Singapore', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SK', 'SVK', 'Slovakia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SI', 'SVN', 'Slovenia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SB', 'SLB', 'Solomon Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SO', 'SOM', 'Somalia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('ZA', 'ZAF', 'South Africa', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GS', 'SGS', 'South Georgia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SS', 'SSD', 'South Sudan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('ES', 'ESP', 'Spain', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('LK', 'LKA', 'Sri Lanka', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SD', 'SDN', 'Sudan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SR', 'SUR', 'Suriname', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SJ', 'SJM', 'Svalbard and Jan Mayen Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SZ', 'SWZ', 'Eswatini', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SE', 'SWE', 'Sweden', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CH', 'CHE', 'Switzerland', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SY', 'SYR', 'Syria', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TW', 'TWN', 'Taiwan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TJ', 'TJK', 'Tajikistan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TZ', 'TZA', 'Tanzania', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TH', 'THA', 'Thailand', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TG', 'TGO', 'Togo', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TK', 'TKL', 'Tokelau', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TO', 'TON', 'Tonga', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TT', 'TTO', 'Trinidad and Tobago', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TN', 'TUN', 'Tunisia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TR', 'TUR', 'Turkey', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TM', 'TKM', 'Turkmenistan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TC', 'TCA', 'Turks and Caicos Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('TV', 'TUV', 'Tuvalu', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('UG', 'UGA', 'Uganda', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('UA', 'UKR', 'Ukraine', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('AE', 'ARE', 'United Arab Emirates', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('GB', 'GBR', 'United Kingdom', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('US', 'USA', 'United States', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('UM', 'UMI', 'United States Minor Outlying Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('UY', 'URY', 'Uruguay', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('UZ', 'UZB', 'Uzbekistan', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('VU', 'VUT', 'Vanuatu', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('VA', 'VAT', 'Vatican City State (Holy See)', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('VE', 'VEN', 'Venezuela', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('VN', 'VNM', 'Vietnam', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('VG', 'VGB', 'Virgin Islands (British)', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('VI', 'VIR', 'Virgin Islands (US)', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('WF', 'WLF', 'Wallis and Futuna Islands', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('EH', 'ESH', 'Western Sahara', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('YE', 'YEM', 'Yemen', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('ZM', 'ZMB', 'Zambia', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('ZW', 'ZWE', 'Zimbabwe', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('XK', 'XKX', 'Kosovo', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('CW', 'CUW', 'Curaçao', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;
INSERT INTO "countries" ("iso2", "iso3", "name", "region", "is_active")
VALUES ('SX', 'SXM', 'Sint Maarten (Dutch part)', 'World', true)
ON CONFLICT ("iso2") DO NOTHING;

-- 2. Insert States (Subdivisions)
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern Nations, Nationalities, and Peoples', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Somali', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amhara', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tigray', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oromia', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Afar', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Harari', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dire Dawa', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Benishangul-Gumuz', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gambela', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Addis Ababa', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Petnjica', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bar', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Danilovgrad', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rožaje', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plužine', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nikšić', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šavnik', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plav', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pljevlja', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Berane', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mojkovac', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Andrijevica', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gusinje', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bijelo Polje', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kotor', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Podgorica', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Old Royal Capital Cetinje', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tivat', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Budva', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kolašin', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Žabljak', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ulcinj', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kunene', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kavango West', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kavango East', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oshana', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hardap', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Omusati', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ohangwena', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Omaheke', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oshikoto', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Erongo', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khomas', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karas', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Otjozondjupa', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zambezi', 'state', true FROM "countries" WHERE "iso2" = 'NA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ashanti', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ahafo', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Greater Accra', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Upper East', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Volta', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Upper West', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Marino', 'state', true FROM "countries" WHERE "iso2" = 'SM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Acquaviva', 'state', true FROM "countries" WHERE "iso2" = 'SM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiesanuova', 'state', true FROM "countries" WHERE "iso2" = 'SM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Borgo Maggiore', 'state', true FROM "countries" WHERE "iso2" = 'SM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Faetano', 'state', true FROM "countries" WHERE "iso2" = 'SM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Montegiardino', 'state', true FROM "countries" WHERE "iso2" = 'SM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Domagnano', 'state', true FROM "countries" WHERE "iso2" = 'SM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Serravalle', 'state', true FROM "countries" WHERE "iso2" = 'SM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fiorentino', 'state', true FROM "countries" WHERE "iso2" = 'SM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tillabéri', 'state', true FROM "countries" WHERE "iso2" = 'NE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dosso', 'state', true FROM "countries" WHERE "iso2" = 'NE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zinder', 'state', true FROM "countries" WHERE "iso2" = 'NE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maradi', 'state', true FROM "countries" WHERE "iso2" = 'NE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agadez', 'state', true FROM "countries" WHERE "iso2" = 'NE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Diffa', 'state', true FROM "countries" WHERE "iso2" = 'NE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tahoua', 'state', true FROM "countries" WHERE "iso2" = 'NE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mqabba', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Ġwann', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Żurrieq', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luqa', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marsaxlokk', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qala', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Żebbuġ Malta', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Xgħajra', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kirkop', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rabat', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Floriana', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Żebbuġ Gozo', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Swieqi', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Lawrenz', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Birżebbuġa', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mdina', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Venera', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kerċem', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Għarb', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Iklin', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Luċija', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valletta', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Msida', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Birkirkara', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siġġiewi', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalkara', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Victoria', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mellieħa', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tarxien', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sliema', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ħamrun', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Għasri', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Birgu', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balzan', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mġarr', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Attard', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qrendi', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naxxar', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gżira', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Xagħra', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paola', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sannat', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dingli', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gudja', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qormi', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Għargħur', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Xewkija', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Żabbar', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Għaxaq', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pembroke', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lija', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pietà', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marsa', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fgura', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Għajnsielem', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mtarfa', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Munxar', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nadur', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fontana', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Żejtun', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Senglea', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marsaskala', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cospicua', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mosta', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mangystau', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kyzylorda', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Almaty', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Kazakhstan', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Akmola', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pavlodar', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jambyl', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Kazakhstan', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Turkistan', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karaganda', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aktobe', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Almaty', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Atyrau', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Kazakhstan', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Astana', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kostanay', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kakamega', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kisii', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Busia', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Embu', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Laikipia', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nandi', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lamu', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kirinyaga', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bungoma', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uasin Gishu', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isiolo', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kisumu', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kwale', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kilifi', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Narok', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taita–Taveta', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nyeri', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baringo', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wajir', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trans Nzoia', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Machakos', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tharaka-Nithi', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siaya', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mandera', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Makueni', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Migori', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nairobi City', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nyandarua', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kericho', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marsabit', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Homa Bay', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Garissa', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kajiado', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Meru', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kiambu', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mombasa', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Elgeyo-Marakwet', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vihiga', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakuru', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tana River', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Turkana', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samburu', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Pokot', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nyamira', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bomet', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kitui', 'state', true FROM "countries" WHERE "iso2" = 'KE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bié', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Huambo', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zaire', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cunene', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cuanza', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cuanza Norte', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Benguela', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moxico', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lunda Sul', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bengo', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luanda', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lunda Norte', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uíge', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Huíla', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cuando Cubango', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Malanje', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cabinda', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gasa ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tsirang ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wangdue Phodrang ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haa ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zhemgang ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lhuntse ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Punakha ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trashigang ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paro ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dagana ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chukha ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bumthang ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thimphu ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mongar ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samdrup Jongkhar ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pemagatshel ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trongsa ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samtse ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sarpang ', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tombouctou', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ségou', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koulikoro', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ménaka', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kayes', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bamako', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sikasso', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mopti', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taoudénit', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kidal', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gao', 'state', true FROM "countries" WHERE "iso2" = 'ML'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern', 'state', true FROM "countries" WHERE "iso2" = 'RW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'RW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern', 'state', true FROM "countries" WHERE "iso2" = 'RW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kigali', 'state', true FROM "countries" WHERE "iso2" = 'RW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'RW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Belize', 'state', true FROM "countries" WHERE "iso2" = 'BZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stann Creek', 'state', true FROM "countries" WHERE "iso2" = 'BZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Corozal', 'state', true FROM "countries" WHERE "iso2" = 'BZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Toledo', 'state', true FROM "countries" WHERE "iso2" = 'BZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Orange Walk', 'state', true FROM "countries" WHERE "iso2" = 'BZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cayo', 'state', true FROM "countries" WHERE "iso2" = 'BZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Havana', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santiago de Cuba', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sancti Spíritus', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Granma', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mayabeque', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pinar del Río', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isla de la Juventud', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Holguín', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Villa Clara', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Las Tunas', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ciego de Ávila', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Artemisa', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Matanzas', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guantánamo', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Camagüey', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cienfuegos', 'state', true FROM "countries" WHERE "iso2" = 'CU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jigawa', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Enugu', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kebbi', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Benue', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sokoto', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Abuja Federal Capital Territory', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaduna', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kwara', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oyo', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yobe', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kogi', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zamfara', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kano', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nasarawa', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plateau', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Abia', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Akwa Ibom', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bayelsa', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lagos', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Borno', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Imo', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ekiti', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gombe', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ebonyi', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bauchi', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Katsina', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cross River', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anambra', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Delta', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Niger', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Edo', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taraba', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adamawa', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ondo', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Osun', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ogun', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rukungiri', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kyankwanzi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kabarole', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mpigi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Apac', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Abim', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yumbe', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rukiga', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Serere', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kamuli', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amuru', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaberamaido', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namutumba', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kibuku', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ibanda', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Iganga', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dokolo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lira', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bukedea', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alebtong', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koboko', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kiryandongo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kiboga', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kitgum', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bududa', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mbale', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namayingo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amuria', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amudat', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Masindi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kiruhura', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Masaka', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pakwach', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rubanda', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tororo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kamwenge', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adjumani', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wakiso', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moyo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mityana', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Butaleja', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gomba', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jinja', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kayunga', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kween', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mubende', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kanungu', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Omoro', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bukomansimbi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lyantonde', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buikwe', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nwoya', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zombo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buyende', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bunyangabu', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kampala', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isingiro', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Butambala', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bukwo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bushenyi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bugiri', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Butebo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buliisa', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Otuke', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buhweju', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agago', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakapiripirit', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalungu', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moroto', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oyam', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaliro', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kakumiro', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namisindwa', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kole', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kyenjojo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kagadi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ntungamo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalangala', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakasongola', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sheema', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pader', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kisoro', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mukono', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lamwo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pallisa', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gulu', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buvuma', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mbarara', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amolatar', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lwengo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mayuge', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bundibugyo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Katakwi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maracha', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ntoroko', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakaseke', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngora', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kumi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kabale', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sembabule', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bulambuli', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sironko', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Napak', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Busia', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kapchorwa', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luwero', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaabong', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mitooma', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kibaale', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kyegegwa', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manafwa', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rakai', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kasese', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Budaka', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rubirizi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kotido', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Soroti', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luuka', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nebbi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arua', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kyotera', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Schellenberg', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Schaan', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eschen', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vaduz', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ruggell', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Planken', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mauren', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Triesenberg', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gamprin', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balzers', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Triesen', 'state', true FROM "countries" WHERE "iso2" = 'LI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brčko', 'state', true FROM "countries" WHERE "iso2" = 'BA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Federation of Bosnia and Herzegovina', 'state', true FROM "countries" WHERE "iso2" = 'BA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Republika Srpska', 'state', true FROM "countries" WHERE "iso2" = 'BA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dakar', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kolda', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaffrine', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Matam', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint-Louis', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ziguinchor', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fatick', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Diourbel Region', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kédougou', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sédhiou', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaolack', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thiès Region', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Louga', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tambacounda Region', 'state', true FROM "countries" WHERE "iso2" = 'SN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Encamp', 'state', true FROM "countries" WHERE "iso2" = 'AD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Andorra la Vella', 'state', true FROM "countries" WHERE "iso2" = 'AD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Canillo', 'state', true FROM "countries" WHERE "iso2" = 'AD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sant Julià de Lòria', 'state', true FROM "countries" WHERE "iso2" = 'AD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ordino', 'state', true FROM "countries" WHERE "iso2" = 'AD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Escaldes-Engordany', 'state', true FROM "countries" WHERE "iso2" = 'AD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Massana', 'state', true FROM "countries" WHERE "iso2" = 'AD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mont Buxton', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Digue', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Louis', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baie Lazare', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mont Fleuri', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Les Mamelles', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Roche Caiman', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anse Royale', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Glacis', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bel Ombre', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anse-aux-Pins', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Port Glaud', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Au Cap', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Takamaka', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pointe La Rue', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plaisance', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beau Vallon', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anse Boileau', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baie Sainte Anne', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bel Air', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Rivière Anglaise', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cascade', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shaki', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tartar', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shirvan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qazakh', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sadarak', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yevlakh', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khojali', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalbajar', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qakh', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fizuli', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Astara', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shamakhi', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Neftchala', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Goychay', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bilasuvar', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tovuz', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ordubad', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sharur', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samukh', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khizi', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yevlakh', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ujar', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Absheron', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lachin', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qabala', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agstafa', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Imishli', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salyan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lerik', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agsu', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qubadli', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kurdamir', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yardymli', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Goranboy', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baku', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agdash', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beylagan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Masally', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oghuz', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saatly', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lankaran', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agdam', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balakan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dashkasan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakhchivan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quba', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ismailli', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sabirabad', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zaqatala', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kangarli', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Martuni', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barda', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jabrayil', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hajigabul', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Julfa', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gobustan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Goygol', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Babek', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zardab', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aghjabadi', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jalilabad', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shahbuz', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mingachevir', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zangilan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sumqayit', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shamkir', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siazan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ganja', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shaki', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lankaran', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qusar', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gədəbəy', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khachmaz', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shabran', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shusha', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Elbasan', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kukës', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Berat', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gjirokastër', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lezhë', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dibër', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shkodër', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tirana', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Korçë', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fier', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Durrës', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vlorë', 'state', true FROM "countries" WHERE "iso2" = 'AL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sveti Nikole', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kratovo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Staro Nagoričane', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Češinovo-Obleševo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Debarca', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Probištip', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Krivogaštani', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gevgelija', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bogdanci', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Veles', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bosilovo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mogila', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tearce', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Demir Kapija', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aračinovo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vasilevo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lipkovo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brvenica', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Štip', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vevčani', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tetovo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Negotino', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Konče', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prilep', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saraj', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Želino', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mavrovo and Rostuša', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plasnica', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valandovo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vinica', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zrnovci', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karbinci', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dolneni', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Čaška', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kriva Palanka', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jegunovce', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bitola', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šuto Orizari', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karpoš', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kumanovo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pehčevo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kisela Voda', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Demir Hisar', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kičevo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vrapčište', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ilinden', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rosoman', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Makedonski Brod', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gostivar', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Butel', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Delčevo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Novaci', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dojran', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Petrovec', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ohrid', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Struga', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Makedonska Kamenica', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centar', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aerodrom', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Čair', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lozovo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zelenikovo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gazi Baba', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gradsko', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Radoviš', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Strumica', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Studeničani', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Resen', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kavadarci', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kruševo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Čučer-Sandevo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Berovo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rankovce', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Novo Selo', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sopište', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centar Župa', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bogovinje', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gjorče Petrov', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kočani', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Požega-Slavonia', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Split-Dalmatia', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Međimurje', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zadar', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dubrovnik-Neretva', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Krapina-Zagorje', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šibenik-Knin', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lika-Senj', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Virovitica-Podravina', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sisak-Moslavina', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bjelovar-Bilogora', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Primorje-Gorski Kotar', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zagreb', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brod-Posavina', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Varaždin', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Osijek-Baranja', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vukovar-Syrmia', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koprivnica-Križevci', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Istria', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kyrenia (Keryneia)', 'state', true FROM "countries" WHERE "iso2" = 'CY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nicosia (Lefkoşa)', 'state', true FROM "countries" WHERE "iso2" = 'CY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paphos (Pafos)', 'state', true FROM "countries" WHERE "iso2" = 'CY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Larnaca (Larnaka)', 'state', true FROM "countries" WHERE "iso2" = 'CY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Limassol (Leymasun)', 'state', true FROM "countries" WHERE "iso2" = 'CY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Famagusta (Mağusa)', 'state', true FROM "countries" WHERE "iso2" = 'CY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rangpur ', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rajshahi ', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mymensingh ', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dhaka ', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sylhet ', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khulna ', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chittagong ', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barisal ', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Okayama', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiba', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ōita', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tokyo', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nara', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shizuoka', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shimane', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aichi', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hiroshima', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Akita', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ishikawa', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hyōgo', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hokkaidō', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mie', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kyōto', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yamaguchi', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tokushima', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yamagata', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Toyama', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aomori', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kagoshima', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Niigata', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kanagawa', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nagano', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wakayama', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shiga', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kumamoto', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fukushima', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fukui', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nagasaki', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tottori', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ibaraki', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yamanashi', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Okinawa', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tochigi', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Miyazaki', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Iwate', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Miyagi', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gifu', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ōsaka', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saitama', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fukuoka', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gunma', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saga', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kagawa', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ehime', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ontario', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manitoba', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'New Brunswick', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yukon', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saskatchewan', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prince Edward Island', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alberta', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quebec', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nova Scotia', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'British Columbia', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nunavut', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Newfoundland and Labrador', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northwest Territories', 'state', true FROM "countries" WHERE "iso2" = 'CA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'White Nile', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Red Sea', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khartoum', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sennar', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Kordofan', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kassala', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Jazirah', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Qadarif', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blue Nile', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Darfur', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Kordofan', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Darfur', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'River Nile', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Darfur', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Kordofan', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Darfur', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Darfur', 'state', true FROM "countries" WHERE "iso2" = 'SD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tbilisi', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adjara', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Abkhazia', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mtskheta-Mtianeti', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shida Kartli', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kvemo Kartli', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Imereti', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samtskhe-Javakheti', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guria', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samegrelo-Zemo Svaneti', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Racha-Lechkhumi and Kvemo Svaneti', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kakheti', 'state', true FROM "countries" WHERE "iso2" = 'GE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'SL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern', 'state', true FROM "countries" WHERE "iso2" = 'SL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'SL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern', 'state', true FROM "countries" WHERE "iso2" = 'SL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hiran', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mudug', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bakool', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Galguduud', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sanaag', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nugal', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lower Shebelle', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Middle Juba', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Middle Shebelle', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lower Juba', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Awdal', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bay', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Banaadir', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gedo', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Togdheer', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bari', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Cape', 'state', true FROM "countries" WHERE "iso2" = 'ZA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Free State', 'state', true FROM "countries" WHERE "iso2" = 'ZA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Limpopo', 'state', true FROM "countries" WHERE "iso2" = 'ZA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North West', 'state', true FROM "countries" WHERE "iso2" = 'ZA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'KwaZulu-Natal', 'state', true FROM "countries" WHERE "iso2" = 'ZA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gauteng', 'state', true FROM "countries" WHERE "iso2" = 'ZA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mpumalanga', 'state', true FROM "countries" WHERE "iso2" = 'ZA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern Cape', 'state', true FROM "countries" WHERE "iso2" = 'ZA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western Cape', 'state', true FROM "countries" WHERE "iso2" = 'ZA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chontales', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Managua', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rivas', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Granada', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'León', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Estelí', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boaco', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Matagalpa', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madriz', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Río San Juan', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Carazo', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Caribbean Coast', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Caribbean Coast', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Masaya', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chinandega', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jinotega', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karak', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tafilah', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madaba', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aqaba', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Irbid', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balqa', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mafraq', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ajloun', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amman', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jerash', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zarqa', 'state', true FROM "countries" WHERE "iso2" = 'JO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manzini', 'state', true FROM "countries" WHERE "iso2" = 'SZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hhohho', 'state', true FROM "countries" WHERE "iso2" = 'SZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lubombo', 'state', true FROM "countries" WHERE "iso2" = 'SZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shiselweni', 'state', true FROM "countries" WHERE "iso2" = 'SZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Jahra', 'state', true FROM "countries" WHERE "iso2" = 'KW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hawalli', 'state', true FROM "countries" WHERE "iso2" = 'KW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mubarak Al-Kabeer', 'state', true FROM "countries" WHERE "iso2" = 'KW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Farwaniyah', 'state', true FROM "countries" WHERE "iso2" = 'KW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Asimah', 'state', true FROM "countries" WHERE "iso2" = 'KW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Ahmadi', 'state', true FROM "countries" WHERE "iso2" = 'KW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luang Prabang', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vientiane', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vientiane', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salavan', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Attapeu', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Xaisomboun', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sekong', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bolikhamsai', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khammouane', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phongsaly', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oudomxay', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Houaphanh', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Savannakhet', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bokeo', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luang Namtha', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sainyabuli', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Xiangkhouang', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Champasak', 'state', true FROM "countries" WHERE "iso2" = 'LA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Talas', 'state', true FROM "countries" WHERE "iso2" = 'KG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Batken', 'state', true FROM "countries" WHERE "iso2" = 'KG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naryn', 'state', true FROM "countries" WHERE "iso2" = 'KG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jalal-Abad', 'state', true FROM "countries" WHERE "iso2" = 'KG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bishkek', 'state', true FROM "countries" WHERE "iso2" = 'KG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Issyk-Kul', 'state', true FROM "countries" WHERE "iso2" = 'KG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Osh', 'state', true FROM "countries" WHERE "iso2" = 'KG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chuy', 'state', true FROM "countries" WHERE "iso2" = 'KG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Osh', 'state', true FROM "countries" WHERE "iso2" = 'KG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trøndelag', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oslo', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Innlandet', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Svalbard', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agder', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Finnmark', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vestland', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Møre og Romsdal', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rogaland', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Telemark', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nordland', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jan Mayen', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hódmezővásárhely', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Érd', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Szeged', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nagykanizsa', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Csongrád County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Debrecen', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Székesfehérvár', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nyíregyháza', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Somogy County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Békéscsaba', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eger', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tolna County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vas County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Heves County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Győr', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Győr-Moson-Sopron County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jász-Nagykun-Szolnok County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fejér County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Szabolcs-Szatmár-Bereg County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zala County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Szolnok', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bács-Kiskun', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dunaújváros', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zalaegerszeg', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nógrád County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Szombathely', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pécs', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Veszprém County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baranya', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kecskemét', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sopron', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Borsod-Abaúj-Zemplén', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pest County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Békés', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Szekszárd', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Veszprém', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hajdú-Bihar County', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Budapest', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Miskolc', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tatabánya', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaposvár', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salgótarján', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tipperary', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sligo', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Donegal', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dublin', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leinster', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cork', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monaghan', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Longford', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kerry', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Offaly', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Galway', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Munster', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Roscommon', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kildare', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Louth', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mayo', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wicklow', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ulster', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Connacht', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cavan', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Waterford', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kilkenny', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Clare', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Meath', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wexford', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Limerick', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Carlow', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Laois', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Westmeath', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Djelfa', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Oued', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Tarf', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oran', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naama', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Annaba', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bouïra', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chlef', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tiaret', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tlemcen', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Béchar', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Médéa', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Skikda', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blida', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Illizi', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jijel', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Biskra', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tipasa', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bordj Bou Arréridj', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tébessa', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adrar', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aïn Defla', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tindouf', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Constantine', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aïn Témouchent', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saïda', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mascara', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boumerdès', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khenchela', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ghardaïa', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Béjaïa', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Bayadh', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Relizane', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tizi Ouzou', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mila', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tissemsilt', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tamanghasset', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oum El Bouaghi', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guelma', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Laghouat', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouargla', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mostaganem', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sétif', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Batna', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Souk Ahras', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Algiers', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Burgos', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salamanca', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Palencia', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madrid', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Asturias', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zamora', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pontevedra', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cantabria', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Rioja', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Islas Baleares', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valencia', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Murcia', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Huesca', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valladolid', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Las Palmas', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ávila', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caceres', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gipuzkoa', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Segovia', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sevilla', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'León', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tarragona', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Navarra', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Toledo', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Soria', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guanacaste', 'state', true FROM "countries" WHERE "iso2" = 'CR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Puntarenas', 'state', true FROM "countries" WHERE "iso2" = 'CR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cartago', 'state', true FROM "countries" WHERE "iso2" = 'CR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Heredia', 'state', true FROM "countries" WHERE "iso2" = 'CR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Limón', 'state', true FROM "countries" WHERE "iso2" = 'CR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San José', 'state', true FROM "countries" WHERE "iso2" = 'CR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alajuela', 'state', true FROM "countries" WHERE "iso2" = 'CR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brunei-Muara', 'state', true FROM "countries" WHERE "iso2" = 'BN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Belait', 'state', true FROM "countries" WHERE "iso2" = 'BN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Temburong', 'state', true FROM "countries" WHERE "iso2" = 'BN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tutong', 'state', true FROM "countries" WHERE "iso2" = 'BN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Philip', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Lucy', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Peter', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Joseph', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint James', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Thomas', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint George', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint John', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Christ Church', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Andrew', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Michael', 'state', true FROM "countries" WHERE "iso2" = 'BB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amanat Al Asimah', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ibb', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Mahwit', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Abyan', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hadhramaut', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Socotra', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Hudaydah', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adan', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Jawf', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hajjah', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lahij', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dhamar', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shabwah', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Raymah', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saada', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amran', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Mahrah', 'state', true FROM "countries" WHERE "iso2" = 'YE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sangha-Mbaéré', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nana-Grébizi', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouham', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lobaye', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mambéré-Kadéï', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haut-Mbomou', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bamingui-Bangoran', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nana-Mambéré', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vakaga', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bangui', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kémo', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Basse-Kotto', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouaka', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mbomou', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouham-Pendé', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haute-Kotto', 'state', true FROM "countries" WHERE "iso2" = 'CF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Romblon', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bukidnon', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rizal', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bohol', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quirino', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Biliran', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quezon', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siquijor', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sarangani', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bulacan', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cagayan', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Cotabato', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sorsogon', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sultan Kudarat', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Camarines Norte', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern Leyte', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Camiguin', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Surigao del Norte', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Camarines Sur', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sulu', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Davao Oriental', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern Samar', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dinagat Islands', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Capiz', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tawi-Tawi', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Calabarzon', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tarlac', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Surigao del Sur', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zambales', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ilocos Norte', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mimaropa', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ifugao', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Catanduanes', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zamboanga del Norte', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guimaras', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bicol', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western Visayas', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cebu', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cavite', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Visayas', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Davao Occidental', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Soccsksargen', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Davao de Oro', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalinga', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isabela', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caraga', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Iloilo', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Autonomous Region in Muslim Mindanao', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Union', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Davao del Sur', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Davao del Norte', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cotabato', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ilocos Sur', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern Visayas', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agusan del Norte', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Abra', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zamboanga Peninsula', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agusan del Sur', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lanao del Norte', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Laguna', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marinduque', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maguindanao del Norte', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aklan', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leyte', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lanao del Sur', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Apayao', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cordillera Administrative', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Antique', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Albay', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Masbate', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Mindanao', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Davao', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aurora', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cagayan Valley', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Misamis Occidental', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bataan', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Luzon', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Basilan', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maguindanao del Sur', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Misamis Oriental', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Samar', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Negros Oriental', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Negros Occidental', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Batanes', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mountain Province', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oriental Mindoro', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ilocos', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Occidental Mindoro', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zamboanga del Sur', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nueva Vizcaya', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Batangas', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nueva Ecija', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Palawan', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zamboanga Sibugay', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Benguet', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pangasinan', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pampanga', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'IL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'IL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern', 'state', true FROM "countries" WHERE "iso2" = 'IL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haifa', 'state', true FROM "countries" WHERE "iso2" = 'IL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jerusalem', 'state', true FROM "countries" WHERE "iso2" = 'IL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tel Aviv', 'state', true FROM "countries" WHERE "iso2" = 'IL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Limburg', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Flanders', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Flemish Brabant', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hainaut', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brussels-Capital ', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Flanders', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namur', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luxembourg', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wallonia', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Antwerp', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Walloon Brabant', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Flanders', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Liège', 'state', true FROM "countries" WHERE "iso2" = 'BE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Darién', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Colón', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Coclé', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guna', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Herrera', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Los Santos', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngöbe-Buglé Comarca', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Veraguas', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bocas del Toro', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Panamá Oeste', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Panamá', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Emberá-Wounaan Comarca', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiriquí Province', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Delaware', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alaska', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maryland', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'New Hampshire', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kansas', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Texas', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nebraska', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vermont', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hawaii', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guam', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'United States Virgin Islands', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Utah', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oregon', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'California', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'New Jersey', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Dakota', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kentucky', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Minnesota', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oklahoma', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pennsylvania', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'New Mexico', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'American Samoa', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Illinois', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Michigan', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Virginia', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Virginia', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mississippi', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Mariana Islands', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'United States Minor Outlying Islands', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Massachusetts', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arizona', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Connecticut', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Florida', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'District of Columbia', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Indiana', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wisconsin', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wyoming', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Carolina', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arkansas', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Dakota', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Montana', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Carolina', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Puerto Rico', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Colorado', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Missouri', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'New York', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maine', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tennessee', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Georgia', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alabama', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Louisiana', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nevada', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Iowa', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Idaho', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rhode Island', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Washington', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shinyanga', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Simiyu', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kagera', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dodoma', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kilimanjaro', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mara', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tabora', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Morogoro', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zanzibar South', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pemba South', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zanzibar North', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Singida', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zanzibar West', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mtwara', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rukwa', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kigoma', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mwanza', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Njombe', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Geita', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Katavi', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lindi', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manyara', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pwani', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ruvuma', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tanga', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pemba North', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Iringa', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dar es Salaam', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arusha', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tavastia Proper', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Ostrobothnia', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern Savonia', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kainuu', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Karelia', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern Ostrobothnia', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lapland', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Satakunta', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Päijänne Tavastia', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Savonia', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Karelia', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Ostrobothnia', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pirkanmaa', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Finland Proper', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ostrobothnia', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uusimaa', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Finland', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kymenlaakso', 'state', true FROM "countries" WHERE "iso2" = 'FI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Diekirch', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luxembourg ', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Echternach', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Redange', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Esch-sur-Alzette', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Capellen', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Remich', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grevenmacher', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Clervaux', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mersch', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vianden', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wiltz', 'state', true FROM "countries" WHERE "iso2" = 'LU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zealand', 'state', true FROM "countries" WHERE "iso2" = 'DK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern Denmark', 'state', true FROM "countries" WHERE "iso2" = 'DK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Denmark', 'state', true FROM "countries" WHERE "iso2" = 'DK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Denmark', 'state', true FROM "countries" WHERE "iso2" = 'DK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Denmark', 'state', true FROM "countries" WHERE "iso2" = 'DK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gävleborg', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dalarna', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Värmland', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Östergötland', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blekinge', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Norrbotten', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Örebro', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Södermanland', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Skåne', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kronoberg', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Västerbotten', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalmar', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uppsala', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gotland', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Västra Götaland', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Halland', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Västmanland', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jönköping', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stockholm', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Västernorrland', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plungė', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jurbarkas', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaunas', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mažeikiai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Panevėžys', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Elektrėnai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Švenčionys', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Akmenė', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ignalina', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Neringa', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Visaginas', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Biržai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jonava', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Radviliškis', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Telšiai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marijampolė', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kretinga', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tauragė', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tauragė', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alytus', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kazlų Rūda', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šakiai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šalčininkai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prienai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Druskininkai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaunas', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Joniškis', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Molėtai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaišiadorys', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kėdainiai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kupiškis', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šiauliai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Raseiniai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Palanga', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rietavas', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalvarija', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trakai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Širvintos', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pakruojis', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ukmergė', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Utena', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Klaipėda', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vilnius', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Varėna', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Birštonas', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Klaipėda', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alytus', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vilnius', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šilutė', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Telšiai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šiauliai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marijampolė', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lazdijai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pagėgiai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šilalė ', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Panevėžys', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rokiškis', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pasvalys', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Skuodas', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kelmė', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zarasai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vilkaviškis', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Utena', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Upper Silesia', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Silesia', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pomerania', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kuyavia-Pomerania', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Subcarpathia', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Warmia-Masuria', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lower Silesia', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Holy Cross', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lubusz', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Podlaskie', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Pomerania', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Greater Poland', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lesser Poland', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Łódź', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mazovia', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lublin', 'state', true FROM "countries" WHERE "iso2" = 'PL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aargau', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fribourg', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Basel-Land', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uri', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ticino', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St. Gallen', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bern', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zug', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Geneva', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valais', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Appenzell Innerrhoden', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Obwalden', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vaud', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nidwalden', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Schwyz', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Schaffhausen', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Appenzell Ausserrhoden', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zürich', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thurgau', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jura', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Neuchâtel', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Graubünden', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Glarus', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Solothurn', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lucerne', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tuscany', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Padua', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Parma', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siracusa', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Palermo', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Campania', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marche', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ancona', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Latina', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lecce', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pavia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lecco', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lazio', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Abruzzo', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ascoli Piceno', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Umbria', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pisa', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barletta-Andria-Trani', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pistoia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Apulia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Belluno', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pordenone', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Perugia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Avellino', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pesaro and Urbino', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pescara', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Molise', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Piacenza', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Potenza', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prato', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Benevento', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Piedmont', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Calabria', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bergamo', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lombardy', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Basilicata', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ravenna', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Reggio Emilia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sicily', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rieti', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rimini', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brindisi', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sardinia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aosta Valley', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brescia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caltanissetta', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rovigo', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salerno', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Campobasso', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sassari', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Enna', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trentino-South Tyrol', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Verbano-Cusio-Ossola', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agrigento', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Catanzaro', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ragusa', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Sardinia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caserta', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Savona', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trapani', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siena', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Viterbo', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Verona', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vibo Valentia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vicenza', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chieti', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Como', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sondrio', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cosenza', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taranto', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fermo', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Livorno', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ferrara', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lodi', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lucca', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Macerata', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cremona', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Teramo', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Veneto', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Crotone', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Terni', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Friuli–Venezia Giulia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Modena', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mantua', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Massa and Carrara', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Matera', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arezzo', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Treviso', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trieste', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Udine', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Varese', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Liguria', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monza and Brianza', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Foggia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Emilia-Romagna', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Novara', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cuneo', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Frosinone', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gorizia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Biella', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Forlì-Cesena', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Asti', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alessandria', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vercelli', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oristano', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grosseto', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Imperia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isernia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nuoro', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Spezia', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sumatera Utara', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bengkulu', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalimantan Tengah', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sulawesi Selatan', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sulawesi Tenggara', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Papua', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Papua Barat', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maluku', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maluku Utara', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jawa Tengah', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalimantan Timur', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'DKI Jakarta', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalimantan Barat', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kepulauan Riau', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sulawesi Utara', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Riau', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Banten', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lampung', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gorontalo', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sulawesi Tengah', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nusa Tenggara Barat', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jambi', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sumatera Selatan', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sulawesi Barat', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nusa Tenggara Timur', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalimantan Selatan', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kepulauan Bangka Belitung', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aceh', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalimantan Utara', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jawa Barat', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bali', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jawa Timur', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sumatera Barat', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'DI Yogyakarta', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phoenix', 'state', true FROM "countries" WHERE "iso2" = 'KI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gilbert', 'state', true FROM "countries" WHERE "iso2" = 'KI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Line', 'state', true FROM "countries" WHERE "iso2" = 'KI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Primorsky', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Novgorod', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jewish', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nenets', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rostov', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khanty-Mansi', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Magadan', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Krasnoyarsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karelia', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buryatia', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Murmansk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaluga', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chelyabinsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Omsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yamalo-Nenets', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sakha', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arkhangelsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dagestan', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yaroslavl', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adygea', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Ossetia-Alania', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bashkortostan', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kursk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ulyanovsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nizhny Novgorod', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amur', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chukotka', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tver', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tatarstan', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samara', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pskov', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ivanovo', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kamchatka', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Astrakhan', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bryansk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stavropol', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karachay-Cherkess', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mari El', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Perm', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tomsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khabarovsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vologda', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sakhalin', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Altai', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khakassia', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tambov', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Petersburg', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Irkutsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vladimir', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moscow', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalmykia', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ingushetia', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Smolensk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Orenburg', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saratov', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Novosibirsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lipetsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kirov', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Krasnodar', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kabardino-Balkar', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chechen', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sverdlovsk', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tula', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leningrad', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kemerovo', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mordovia', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Komi', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tuva', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moscow', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaliningrad', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Belgorod', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zabaykalsky', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ryazan', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Voronezh', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tyumen', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oryol', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Penza', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kostroma', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Altai', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sevastopol', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Udmurt', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chuvash', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kurgan', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lomaiviti', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ba', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tailevu', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nadroga-Navosa', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rewa', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Macuata', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cakaudrove', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Serua', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ra', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naitasiri', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namosi', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bua', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rotuma', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lau', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kadavu', 'state', true FROM "countries" WHERE "iso2" = 'FJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Labuan', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sabah', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sarawak', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Perlis', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Penang', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pahang', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Malacca', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Terengganu', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Perak', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Selangor', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Putrajaya', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kelantan', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kedah', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Negeri Sembilan', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kuala Lumpur', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Johor', 'state', true FROM "countries" WHERE "iso2" = 'MY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mashonaland East', 'state', true FROM "countries" WHERE "iso2" = 'ZW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Matabeleland South', 'state', true FROM "countries" WHERE "iso2" = 'ZW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mashonaland West', 'state', true FROM "countries" WHERE "iso2" = 'ZW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Matabeleland North', 'state', true FROM "countries" WHERE "iso2" = 'ZW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mashonaland Central', 'state', true FROM "countries" WHERE "iso2" = 'ZW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bulawayo', 'state', true FROM "countries" WHERE "iso2" = 'ZW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Midlands', 'state', true FROM "countries" WHERE "iso2" = 'ZW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Harare', 'state', true FROM "countries" WHERE "iso2" = 'ZW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manicaland', 'state', true FROM "countries" WHERE "iso2" = 'ZW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Masvingo', 'state', true FROM "countries" WHERE "iso2" = 'ZW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bulgan', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Darkhan-Uul', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dornod', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khovd', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Övörkhangai', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Orkhon', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ömnögovi', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Töv', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bayan-Ölgii', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dundgovi', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uvs', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Govi-Altai', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arkhangai', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khentii', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khövsgöl', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bayankhongor', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sükhbaatar', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Govisümber', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zavkhan', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Selenge', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dornogovi', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'ZM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'ZM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Copperbelt', 'state', true FROM "countries" WHERE "iso2" = 'ZM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northwestern', 'state', true FROM "countries" WHERE "iso2" = 'ZM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'ZM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luapula', 'state', true FROM "countries" WHERE "iso2" = 'ZM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lusaka', 'state', true FROM "countries" WHERE "iso2" = 'ZM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Muchinga', 'state', true FROM "countries" WHERE "iso2" = 'ZM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern', 'state', true FROM "countries" WHERE "iso2" = 'ZM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern', 'state', true FROM "countries" WHERE "iso2" = 'ZM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Capital', 'state', true FROM "countries" WHERE "iso2" = 'BH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern', 'state', true FROM "countries" WHERE "iso2" = 'BH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'BH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Muharraq', 'state', true FROM "countries" WHERE "iso2" = 'BH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rio de Janeiro', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Minas Gerais', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amapá', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Goiás', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rio Grande do Sul', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bahia', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sergipe', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amazonas', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paraíba', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pernambuco', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alagoas', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Piauí', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pará', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mato Grosso do Sul', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mato Grosso', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Acre', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rondônia', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Catarina', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maranhão', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ceará', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Distrito Federal', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Espírito Santo', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rio Grande do Norte', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tocantins', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'São Paulo', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paraná', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aragatsotn', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ararat', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vayots Dzor', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Armavir', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Syunik', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gegharkunik', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lori', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yerevan', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shirak', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tavush', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kotayk', 'state', true FROM "countries" WHERE "iso2" = 'AM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cojedes', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Falcón', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Portuguesa', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Miranda', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lara', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bolívar', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Carabobo', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yaracuy', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zulia', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trujillo', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amazonas', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guárico', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Venezuela', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aragua', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Táchira', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barinas', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anzoátegui', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Delta Amacuro', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nueva Esparta', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mérida', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monagas', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Guaira', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sucre', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Carinthia', 'state', true FROM "countries" WHERE "iso2" = 'AT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Upper Austria', 'state', true FROM "countries" WHERE "iso2" = 'AT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Styria', 'state', true FROM "countries" WHERE "iso2" = 'AT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vienna', 'state', true FROM "countries" WHERE "iso2" = 'AT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salzburg', 'state', true FROM "countries" WHERE "iso2" = 'AT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Burgenland', 'state', true FROM "countries" WHERE "iso2" = 'AT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vorarlberg', 'state', true FROM "countries" WHERE "iso2" = 'AT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tyrol', 'state', true FROM "countries" WHERE "iso2" = 'AT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lower Austria', 'state', true FROM "countries" WHERE "iso2" = 'AT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koshi', 'state', true FROM "countries" WHERE "iso2" = 'NP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lumbini', 'state', true FROM "countries" WHERE "iso2" = 'NP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karnali', 'state', true FROM "countries" WHERE "iso2" = 'NP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gandaki', 'state', true FROM "countries" WHERE "iso2" = 'NP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bagmati', 'state', true FROM "countries" WHERE "iso2" = 'NP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Unity', 'state', true FROM "countries" WHERE "iso2" = 'SS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Upper Nile', 'state', true FROM "countries" WHERE "iso2" = 'SS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Warrap', 'state', true FROM "countries" WHERE "iso2" = 'SS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Bahr el Ghazal', 'state', true FROM "countries" WHERE "iso2" = 'SS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western Equatoria', 'state', true FROM "countries" WHERE "iso2" = 'SS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lakes', 'state', true FROM "countries" WHERE "iso2" = 'SS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western Bahr el Ghazal', 'state', true FROM "countries" WHERE "iso2" = 'SS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Equatoria', 'state', true FROM "countries" WHERE "iso2" = 'SS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern Equatoria', 'state', true FROM "countries" WHERE "iso2" = 'SS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jonglei State', 'state', true FROM "countries" WHERE "iso2" = 'SS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Greece', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Macedonia', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Crete', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Epirus', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Achaea', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Macedonia and Thrace', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Aegean', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Peloponnese', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Attica', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Attica', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Macedonia', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Greece', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ionian Islands', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kayin', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mandalay', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yangon', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Magway', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chin', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rakhine', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shan', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tanintharyi', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bago', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ayeyarwady', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kachin', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kayah', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sagaing', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naypyidaw', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mon State', 'state', true FROM "countries" WHERE "iso2" = 'MM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bartın', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kütahya', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sakarya', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Edirne', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Van', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bingöl', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kilis', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adıyaman', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mersin', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Denizli', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Malatya', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Elazığ', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Erzincan', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amasya', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Muş', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bursa', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eskişehir', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Erzurum', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Iğdır', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tekirdağ', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Çankırı', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Antalya', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'İstanbul', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Konya', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bolu', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Çorum', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ordu', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balıkesir', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kırklareli', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bayburt', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kırıkkale', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Afyonkarahisar', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kırşehir', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sivas', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Muğla', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Şanlıurfa', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karaman', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ardahan', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Giresun', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aydın', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yozgat', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Niğde', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hakkâri', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Artvin', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tunceli', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ağrı', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Batman', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kocaeli', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nevşehir', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kastamonu', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manisa', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tokat', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kayseri', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uşak', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Düzce', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gaziantep', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gümüşhane', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'İzmir', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trabzon', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siirt', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kars', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Burdur', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aksaray', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hatay', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adana', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zonguldak', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Osmaniye', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bitlis', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Çanakkale', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ankara', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yalova', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rize', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samsun', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bilecik', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isparta', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karabük', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mardin', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Şırnak', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Diyarbakır', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kahramanmaraş', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lisbon', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bragança', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beja', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madeira', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Portalegre', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Açores', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vila Real', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aveiro', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Évora', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Viseu', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santarém', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Faro', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leiria', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Castelo Branco', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Setúbal', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Porto', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Braga', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Viana do Castelo', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Coimbra', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zhejiang', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fujian', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shanghai', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jiangsu', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anhui', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shandong', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jilin', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shanxi', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taiwan', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jiangxi', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beijing', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hunan', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Henan', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yunnan', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guizhou', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ningxia', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Xinjiang', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tibet', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Heilongjiang', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Macau SAR', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hong Kong SAR', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Liaoning', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Inner Mongolia', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qinghai', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chongqing', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shaanxi', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hainan', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hubei', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gansu', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tianjin', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sichuan', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guangxi', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guangdong', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hebei', 'state', true FROM "countries" WHERE "iso2" = 'CN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South', 'state', true FROM "countries" WHERE "iso2" = 'LB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mount Lebanon', 'state', true FROM "countries" WHERE "iso2" = 'LB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baalbek-Hermel', 'state', true FROM "countries" WHERE "iso2" = 'LB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North', 'state', true FROM "countries" WHERE "iso2" = 'LB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Akkar', 'state', true FROM "countries" WHERE "iso2" = 'LB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beirut', 'state', true FROM "countries" WHERE "iso2" = 'LB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beqaa', 'state', true FROM "countries" WHERE "iso2" = 'LB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nabatieh', 'state', true FROM "countries" WHERE "iso2" = 'LB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isle of Wight', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Helens', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brent', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Walsall', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trafford', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'City of Southampton', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sheffield', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Sussex', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Peterborough', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caerphilly', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vale of Glamorgan', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shetland Islands', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rhondda Cynon Taf', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Bedfordshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Portsmouth', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haringey', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bexley', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rotherham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hartlepool', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Telford and Wrekin', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Belfast', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cornwall', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sutton', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Causeway Coast and Glens', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leicester', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Islington', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wigan', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oxfordshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southend-on-Sea', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Armagh, Banbridge and Craigavon', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Perth and Kinross', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Waltham Forest', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rochdale', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Merthyr Tydfil', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blackburn with Darwen', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Knowsley', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Middlesbrough', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Renfrewshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cumbria', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Scotland', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'England', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Ireland', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wales', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bath and North East Somerset', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Liverpool', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sandwell', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isles of Scilly', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Falkirk', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dorset', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Scottish Borders', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Havering', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Camden', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Neath Port Talbot', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Conwy', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Outer Hebrides', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Lothian', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lincolnshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barking and Dagenham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Westminster', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lewisham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nottingham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moray', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Lanarkshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Doncaster', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northumberland', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fermanagh and Omagh', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tameside', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kensington and Chelsea', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hertfordshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Riding of Yorkshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kirklees', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sunderland', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gloucestershire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Ayrshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hillingdon', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Ayrshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gwynedd', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hounslow', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Medway', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Highland', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North East Lincolnshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Harrow', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Somerset', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Angus', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Inverclyde', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Darlington', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tower Hamlets', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wiltshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Argyll and Bute', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stockport', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brighton and Hove', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lambeth', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Redbridge', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manchester', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mid Ulster', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Gloucestershire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aberdeenshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monmouthshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Derbyshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Glasgow', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buckinghamshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Durham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shropshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wirral', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Tyneside', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Essex', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hackney', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Antrim and Newtownabbey', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bristol', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Sussex', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dumfries and Galloway', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Milton Keynes', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Newham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wokingham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Warrington', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stockton-on-Tees', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Swindon', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cambridgeshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'London', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Birmingham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'York', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Slough', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Edinburgh', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mid and East Antrim', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Somerset', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gateshead', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southwark', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Swansea', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wandsworth', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hampshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wrexham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Flintshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Coventry', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Dunbartonshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Powys', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cheshire West and Chester', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Renfrewshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cheshire East', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Derry City and Strabane', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Staffordshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hammersmith and Fulham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Clackmannanshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blackpool', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bridgend', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Lincolnshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Dunbartonshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Reading', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nottinghamshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dudley', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Newcastle upon Tyne', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bury', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lisburn and Castlereagh', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Lothian', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aberdeen', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kent', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wakefield', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Halton', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Suffolk', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thurrock', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Solihull', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bracknell Forest', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Berkshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rutland', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Norfolk', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Orkney Islands', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'City of Kingston upon Hull', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Enfield', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oldham', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Torbay', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fife', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kingston upon Thames', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Windsor and Maidenhead', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Merton', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Carmarthenshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Derby', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pembrokeshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Lanarkshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stirling', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wolverhampton', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bromley', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Devon', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Greenwich', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salford', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lancashire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Torfaen', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Denbighshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barnsley', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Herefordshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Richmond upon Thames', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leeds', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bolton', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Warwickshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stoke-on-Trent', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bedford', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ceredigion', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Worcestershire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dundee', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Croydon', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plymouth', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leicestershire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Calderdale', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sefton', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Midlothian', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barnet', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Tyneside', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Yorkshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ards and North Down', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Newport', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Surrey', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Redcar and Cleveland', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cardiff', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bradford', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blaenau Gwent', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ealing', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Newry, Mourne and Down', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Ayrshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tashkent', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namangan', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fergana', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Xorazm', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Andijan', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bukhara', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Navoiy', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qashqadaryo', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samarqand', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jizzakh', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Surxondaryo', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sirdaryo', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karakalpakstan', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tashkent', 'state', true FROM "countries" WHERE "iso2" = 'UZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ariana', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bizerte', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jendouba', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monastir', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tunis', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manouba', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gafsa', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sfax', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gabès', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tataouine', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Medenine', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kef', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kebili', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siliana', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kairouan', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zaghouan', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ben Arous', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sidi Bouzid', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mahdia', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tozeur', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kasserine', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sousse', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Béja', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ratak', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ralik', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centrale', 'state', true FROM "countries" WHERE "iso2" = 'TG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maritime', 'state', true FROM "countries" WHERE "iso2" = 'TG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plateaux', 'state', true FROM "countries" WHERE "iso2" = 'TG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Savanes', 'state', true FROM "countries" WHERE "iso2" = 'TG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kara', 'state', true FROM "countries" WHERE "iso2" = 'TG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chuuk', 'state', true FROM "countries" WHERE "iso2" = 'FM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pohnpei', 'state', true FROM "countries" WHERE "iso2" = 'FM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yap', 'state', true FROM "countries" WHERE "iso2" = 'FM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kosrae', 'state', true FROM "countries" WHERE "iso2" = 'FM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vaavu', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shaviyani', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haa Alif', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alif Alif', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dhaalu', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thaa', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Noonu', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Addu', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gnaviyani', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaafu', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haa Dhaalu', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gaafu Alif', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Faafu', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alif Dhaal', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Laamu', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Raa', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gaafu Dhaalu', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lhaviyani', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Meemu', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Malé', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Utrecht', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gelderland', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Holland', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Drenthe', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Holland', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Limburg', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Groningen', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Overijssel', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Flevoland', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zeeland', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Friesland', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Brabant', 'state', true FROM "countries" WHERE "iso2" = 'NL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Savanes', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lagunes', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Montagnes', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lacs', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Abidjan', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vallée du Bandama', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zanzan', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bas-Sassandra', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Denguélé', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sassandra-Marahoué', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Woroba', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gôh-Djiboua', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yamoussoukro', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Comoé', 'state', true FROM "countries" WHERE "iso2" = 'CI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Far North', 'state', true FROM "countries" WHERE "iso2" = 'CM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northwest', 'state', true FROM "countries" WHERE "iso2" = 'CM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southwest', 'state', true FROM "countries" WHERE "iso2" = 'CM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South', 'state', true FROM "countries" WHERE "iso2" = 'CM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centre', 'state', true FROM "countries" WHERE "iso2" = 'CM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East', 'state', true FROM "countries" WHERE "iso2" = 'CM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Littoral', 'state', true FROM "countries" WHERE "iso2" = 'CM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adamawa', 'state', true FROM "countries" WHERE "iso2" = 'CM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West', 'state', true FROM "countries" WHERE "iso2" = 'CM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North', 'state', true FROM "countries" WHERE "iso2" = 'CM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Banjul', 'state', true FROM "countries" WHERE "iso2" = 'GM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Coast', 'state', true FROM "countries" WHERE "iso2" = 'GM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Upper River', 'state', true FROM "countries" WHERE "iso2" = 'GM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central River', 'state', true FROM "countries" WHERE "iso2" = 'GM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lower River', 'state', true FROM "countries" WHERE "iso2" = 'GM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Bank', 'state', true FROM "countries" WHERE "iso2" = 'GM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beyla', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mandiana', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yomou', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fria', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boké', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Labé', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nzérékoré', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dabola', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Labé', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dubréka', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Faranah', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Forécariah', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nzérékoré', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gaoual', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Conakry', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Télimélé', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dinguiraye', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mamou', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lélouma', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kissidougou', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koubia', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kindia', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pita', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kouroussa', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tougué', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kankan', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mamou', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boffa', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mali', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kindia', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Macenta', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koundara', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kankan', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Coyah', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dalaba', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siguiri', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lola', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boké', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kérouané', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guéckédou', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tombali', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cacheu', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Biombo', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quinara', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sul', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Norte', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oio', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gabú', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bafatá', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leste', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bolama', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Woleu-Ntem', 'state', true FROM "countries" WHERE "iso2" = 'GA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ogooué-Ivindo', 'state', true FROM "countries" WHERE "iso2" = 'GA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nyanga', 'state', true FROM "countries" WHERE "iso2" = 'GA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haut-Ogooué', 'state', true FROM "countries" WHERE "iso2" = 'GA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Estuaire', 'state', true FROM "countries" WHERE "iso2" = 'GA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ogooué-Maritime', 'state', true FROM "countries" WHERE "iso2" = 'GA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ogooué-Lolo', 'state', true FROM "countries" WHERE "iso2" = 'GA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moyen-Ogooué', 'state', true FROM "countries" WHERE "iso2" = 'GA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngounié', 'state', true FROM "countries" WHERE "iso2" = 'GA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tshuapa', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tanganyika', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haut-Uélé', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kasaï Oriental', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sud-Kivu', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nord-Ubangi', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kwango', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kinshasa', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kasaï Central', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sankuru', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Équateur', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maniema', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kongo Central', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lomami', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sud-Ubangi', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nord-Kivu', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haut-Katanga', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ituri', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mongala', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bas-Uélé', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mai-Ndombe', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tshopo', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kasaï', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haut-Lomami', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kwilu', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cuyuni-Mazaruni', 'state', true FROM "countries" WHERE "iso2" = 'GY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Potaro-Siparuni', 'state', true FROM "countries" WHERE "iso2" = 'GY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mahaica-Berbice', 'state', true FROM "countries" WHERE "iso2" = 'GY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Upper Demerara-Berbice', 'state', true FROM "countries" WHERE "iso2" = 'GY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barima-Waini', 'state', true FROM "countries" WHERE "iso2" = 'GY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pomeroon-Supenaam', 'state', true FROM "countries" WHERE "iso2" = 'GY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Berbice-Corentyne', 'state', true FROM "countries" WHERE "iso2" = 'GY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Demerara-Mahaica', 'state', true FROM "countries" WHERE "iso2" = 'GY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Essequibo Islands-West Demerara', 'state', true FROM "countries" WHERE "iso2" = 'GY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Upper Takutu-Upper Essequibo', 'state', true FROM "countries" WHERE "iso2" = 'GY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Presidente Hayes', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Canindeyú', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guairá', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caaguazú', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paraguarí', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caazapá', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Pedro', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Itapúa', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Concepción', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boquerón', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ñeembucú', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amambay', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cordillera', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alto Paraná', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alto Paraguay', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Misiones', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jaffna', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kandy', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalutara', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Badulla', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hambantota', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Galle', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kilinochchi', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nuwara Eliya', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trincomalee', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Puttalam', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kegalle', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ampara', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Central', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sabaragamuwa', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gampaha', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mannar', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Matara', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ratnapura', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vavuniya', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Matale', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uva', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Polonnaruwa', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mullaitivu', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Colombo', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anuradhapura', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Western', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Batticaloa', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monaragala', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mohéli', 'state', true FROM "countries" WHERE "iso2" = 'KM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anjouan', 'state', true FROM "countries" WHERE "iso2" = 'KM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grande Comore', 'state', true FROM "countries" WHERE "iso2" = 'KM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Atacama', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Región Metropolitana de Santiago', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Coquimbo', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Araucanía', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Biobío', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aisén del General Carlos Ibañez del Campo', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arica y Parinacota', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valparaíso', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ñuble', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Antofagasta', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maule', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Los Ríos', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Los Lagos', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Magallanes y de la Antártica Chilena', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tarapacá', 'state', true FROM "countries" WHERE "iso2" = 'CL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Commewijne', 'state', true FROM "countries" WHERE "iso2" = 'SR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nickerie', 'state', true FROM "countries" WHERE "iso2" = 'SR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Para', 'state', true FROM "countries" WHERE "iso2" = 'SR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Coronie', 'state', true FROM "countries" WHERE "iso2" = 'SR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paramaribo', 'state', true FROM "countries" WHERE "iso2" = 'SR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wanica', 'state', true FROM "countries" WHERE "iso2" = 'SR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marowijne', 'state', true FROM "countries" WHERE "iso2" = 'SR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brokopondo', 'state', true FROM "countries" WHERE "iso2" = 'SR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sipaliwini', 'state', true FROM "countries" WHERE "iso2" = 'SR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saramacca', 'state', true FROM "countries" WHERE "iso2" = 'SR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Riyadh', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Makkah', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Madinah', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tabuk', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Asir', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Borders', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern Province', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Jawf', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jizan', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Bahah', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Najran', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al-Qassim', 'state', true FROM "countries" WHERE "iso2" = 'SA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plateaux', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pointe-Noire', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cuvette', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Likouala', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bouenza', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kouilou', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lékoumou', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cuvette-Ouest', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brazzaville', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sangha', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Niari', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pool', 'state', true FROM "countries" WHERE "iso2" = 'CG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quindío', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cundinamarca', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chocó', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Norte de Santander', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Meta', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Risaralda', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Atlántico', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arauca', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guainía', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tolima', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cauca', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vaupés', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Magdalena', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caldas', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guaviare', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Guajira', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Antioquia', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caquetá', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Casanare', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bolívar', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vichada', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amazonas', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Putumayo', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nariño', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Córdoba', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cesar', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Andrés, Providencia y Santa Catalina', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santander', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sucre', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boyacá', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valle del Cauca', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Galápagos', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sucumbíos', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pastaza', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tungurahua', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zamora Chinchipe', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Los Ríos', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Imbabura', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Elena', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manabí', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guayas', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Carchi', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Napo', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cañar', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Morona-Santiago', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santo Domingo de los Tsáchilas', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bolívar', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cotopaxi', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Esmeraldas', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Azuay', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Oro', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chimborazo', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Orellana', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pichincha', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Obock', 'state', true FROM "countries" WHERE "iso2" = 'DJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Djibouti', 'state', true FROM "countries" WHERE "iso2" = 'DJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dikhil', 'state', true FROM "countries" WHERE "iso2" = 'DJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tadjourah', 'state', true FROM "countries" WHERE "iso2" = 'DJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arta', 'state', true FROM "countries" WHERE "iso2" = 'DJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ali Sabieh', 'state', true FROM "countries" WHERE "iso2" = 'DJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hama', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rif Dimashq', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'As-Suwayda', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Deir ez-Zor', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Latakia', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Damascus', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Idlib', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al-Hasakah', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Homs', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quneitra', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al-Raqqah', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Daraa', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aleppo', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tartus', 'state', true FROM "countries" WHERE "iso2" = 'SY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fianarantsoa', 'state', true FROM "countries" WHERE "iso2" = 'MG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Toliara', 'state', true FROM "countries" WHERE "iso2" = 'MG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Antsiranana', 'state', true FROM "countries" WHERE "iso2" = 'MG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Antananarivo', 'state', true FROM "countries" WHERE "iso2" = 'MG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Toamasina', 'state', true FROM "countries" WHERE "iso2" = 'MG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mahajanga', 'state', true FROM "countries" WHERE "iso2" = 'MG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mogilev', 'state', true FROM "countries" WHERE "iso2" = 'BY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gomel', 'state', true FROM "countries" WHERE "iso2" = 'BY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grodno', 'state', true FROM "countries" WHERE "iso2" = 'BY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Minsk', 'state', true FROM "countries" WHERE "iso2" = 'BY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Minsk', 'state', true FROM "countries" WHERE "iso2" = 'BY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brest', 'state', true FROM "countries" WHERE "iso2" = 'BY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vitebsk', 'state', true FROM "countries" WHERE "iso2" = 'BY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Murqub', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nuqat al Khams', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zawiya', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Wahat', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sabha', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Derna', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Murzuq', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marj', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ghat', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jufra', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tripoli', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kufra', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wadi al Hayaa', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jabal al Gharbi', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wadi al Shatii', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nalut', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sirte', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Misrata', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jafara', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jabal al Akhdar', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Benghazi', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ribeira Brava', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tarrafal', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ribeira Grande de Santiago', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Catarina', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'São Domingos', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mosteiros', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Praia', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Porto Novo', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'São Miguel', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maio', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sotavento Islands', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'São Lourenço dos Órgãos', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barlavento Islands', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Catarina do Fogo', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brava', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paul', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sal', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boa Vista', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'São Filipe', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'São Vicente', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ribeira Grande', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tarrafal de São Nicolau', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Cruz', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Schleswig-Holstein', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baden-Württemberg', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mecklenburg-Vorpommern', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lower Saxony', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bavaria', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Berlin', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saxony-Anhalt', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brandenburg', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bremen', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thuringia', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hamburg', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Rhine-Westphalia', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hessen', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rhineland-Palatinate', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saarland', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saxony', 'state', true FROM "countries" WHERE "iso2" = 'DE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mafeteng', 'state', true FROM "countries" WHERE "iso2" = 'LS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mokhotlong', 'state', true FROM "countries" WHERE "iso2" = 'LS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leribe', 'state', true FROM "countries" WHERE "iso2" = 'LS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quthing', 'state', true FROM "countries" WHERE "iso2" = 'LS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maseru', 'state', true FROM "countries" WHERE "iso2" = 'LS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Butha-Buthe', 'state', true FROM "countries" WHERE "iso2" = 'LS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Berea', 'state', true FROM "countries" WHERE "iso2" = 'LS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thaba-Tseka', 'state', true FROM "countries" WHERE "iso2" = 'LS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Montserrado', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'River Cess', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bong', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sinoe', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grand Cape Mount', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lofa', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'River Gee', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grand Gedeh', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grand Bassa', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bomi', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maryland', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Margibi', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gbarpolu', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grand Kru', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nimba', 'state', true FROM "countries" WHERE "iso2" = 'LR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ad Dhahirah', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Batinah North', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Batinah South', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Musandam', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ash Sharqiyah North', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ash Sharqiyah South', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Muscat', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Wusta', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dhofar', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ad Dakhiliyah', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Buraimi', 'state', true FROM "countries" WHERE "iso2" = 'OM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ghanzi', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kgatleng', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South-East', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North-West', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kgalagadi', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North-East', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kweneng', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Collines', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kouffo', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Donga', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zou', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plateau', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mono', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Atakora', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alibori', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Borgou', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Atlantique', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouémé', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Littoral', 'state', true FROM "countries" WHERE "iso2" = 'BJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Machinga', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zomba', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mwanza', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nsanje', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salima', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chitipa', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ntcheu', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rumphi', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dowa', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karonga', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Likoma', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kasungu', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nkhata Bay', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balaka', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dedza', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thyolo', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mchinji', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nkhotakota', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lilongwe', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blantyre', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mulanje', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mzimba', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chikwawa', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phalombe', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiradzulu', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mangochi', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ntchisi', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kénédougou', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namentenga', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sahel', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centre-Ouest', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nahouri', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Passoré', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zoundwéogo', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sissili', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Banwa', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bougouriba', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gnagna', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mouhoun', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yagha', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plateau-Central', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sanmatenga', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centre-Nord', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tapoa', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Houet', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zondoma', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boulgou', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Komondjari', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koulpélogo', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tuy', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ioba', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centre', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sourou', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boucle du Mouhoun', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Séno', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sud-Ouest', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oubritenga', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nayala', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gourma', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oudalan', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ziro', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kossi', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kourwéogo', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ganzourgou', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centre-Sud', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yatenga', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loroum', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bazèga', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cascades', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sanguié', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bam', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Noumbiel', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kompienga', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Est', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Léraba', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balé', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kouritenga', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centre-Est', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Poni', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nord', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hauts-Bassins', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Soum', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Comoé', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kadiogo', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Islamabad', 'state', true FROM "countries" WHERE "iso2" = 'PK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gilgit-Baltistan', 'state', true FROM "countries" WHERE "iso2" = 'PK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khyber Pakhtunkhwa', 'state', true FROM "countries" WHERE "iso2" = 'PK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Azad Kashmir', 'state', true FROM "countries" WHERE "iso2" = 'PK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balochistan', 'state', true FROM "countries" WHERE "iso2" = 'PK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sindh', 'state', true FROM "countries" WHERE "iso2" = 'PK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Punjab', 'state', true FROM "countries" WHERE "iso2" = 'PK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Rayyan', 'state', true FROM "countries" WHERE "iso2" = 'QA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al-Shahaniya', 'state', true FROM "countries" WHERE "iso2" = 'QA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Wakrah', 'state', true FROM "countries" WHERE "iso2" = 'QA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madinat ash Shamal', 'state', true FROM "countries" WHERE "iso2" = 'QA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Doha', 'state', true FROM "countries" WHERE "iso2" = 'QA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Daayen', 'state', true FROM "countries" WHERE "iso2" = 'QA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Khor', 'state', true FROM "countries" WHERE "iso2" = 'QA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Umm Salal', 'state', true FROM "countries" WHERE "iso2" = 'QA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rumonge', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Muyinga', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mwaro', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Makamba', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rutana', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cibitoke', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ruyigi', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kayanza', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Muramvya', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karuzi', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kirundo', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bubanza', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gitega', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bujumbura Mairie', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngozi', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bujumbura Rural', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cankuzo', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bururi', 'state', true FROM "countries" WHERE "iso2" = 'BI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Flores', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San José', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Artigas', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maldonado', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rivera', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Colonia', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Durazno', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Río Negro', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cerro Largo', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paysandú', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Canelones', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Treinta y Tres', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lavalleja', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rocha', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Florida', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Montevideo', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Soriano', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salto', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tacuarembó', 'state', true FROM "countries" WHERE "iso2" = 'UY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kafr El-Sheikh', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cairo', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Damietta', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aswan', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sohag', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Sinai', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monufia', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Port Said', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beni Suef', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Matrouh', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qalyubia', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Suez', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gharbia', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alexandria', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Asyut', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Sinai', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Faiyum', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Giza', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Red Sea', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beheira', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luxor', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Minya', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ismailia', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dakahlia', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'New Valley', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qena', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agalega Islands', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rodrigues Island', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pamplemousses', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Brandon Islands', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moka', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Flacq', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Savanne', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Black River', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Port Louis', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rivière du Rempart', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plaines Wilhems', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grand Port', 'state', true FROM "countries" WHERE "iso2" = 'MU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guelmim', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aousserd (EH)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Hoceïma', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Larache', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouarzazate', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boulemane', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Béni Mellal', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chichaoua', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boujdour (EH)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khémisset', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tiznit', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Béni Mellal-Khénifra', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sidi Kacem', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Jadida', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nador', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Settat', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zagora', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Médiouna', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Berkane', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tan-Tan (EH-partial)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nouaceur', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marrakesh-Safi', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sefrou', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Drâa-Tafilalet', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Hajeb', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Es-Semara (EH-partial)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Laâyoune (EH)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Inezgane-Ait Melloul', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Souss-Massa', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taza', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Assa-Zag (EH-partial)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Laâyoune-Sakia El Hamra (EH-partial)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Errachidia', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fahs-Anjra', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Figuig', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chtouka-Ait Baha', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Casablanca-Settat', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Benslimane', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guelmim-Oued Noun (EH-partial)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dakhla-Oued Ed-Dahab (EH)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jerada', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kénitra', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Kelâa des Sraghna', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chefchaouen', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Safi', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tata', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fès-Meknès', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taroudannt', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moulay Yacoub', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Essaouira', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khénifra', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tétouan', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oued Ed-Dahab (EH)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Haouz', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Azilal', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taourirt', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taounate', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tanger-Tétouan-Al Hoceïma', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ifrane', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khouribga', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cabo Delgado', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zambezia', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gaza', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Inhambane', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sofala', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maputo', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Niassa', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tete', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maputo', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nampula', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manica', 'state', true FROM "countries" WHERE "iso2" = 'MZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hodh Ech Chargui', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brakna', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tiris Zemmour', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gorgol', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Inchiri', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nouakchott-Nord', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adrar', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tagant', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dakhlet Nouadhibou', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nouakchott-Sud', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trarza', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Assaba', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guidimaka', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hodh El Gharbi', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nouakchott-Ouest', 'state', true FROM "countries" WHERE "iso2" = 'MR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western Tobago', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Couva-Tabaquite-Talparo', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern Tobago', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rio Claro-Mayaro', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Juan-Laventille', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tunapuna-Piarco', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Fernando', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Point Fortin', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sangre Grande', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arima', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Port of Spain', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siparia', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Penal-Debe', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chaguanas', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Diego Martin', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Princes Town', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mary', 'state', true FROM "countries" WHERE "iso2" = 'TM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lebap', 'state', true FROM "countries" WHERE "iso2" = 'TM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ashgabat', 'state', true FROM "countries" WHERE "iso2" = 'TM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balkan', 'state', true FROM "countries" WHERE "iso2" = 'TM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Daşoguz', 'state', true FROM "countries" WHERE "iso2" = 'TM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ahal', 'state', true FROM "countries" WHERE "iso2" = 'TM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beni', 'state', true FROM "countries" WHERE "iso2" = 'BO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oruro', 'state', true FROM "countries" WHERE "iso2" = 'BO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Cruz', 'state', true FROM "countries" WHERE "iso2" = 'BO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tarija', 'state', true FROM "countries" WHERE "iso2" = 'BO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pando', 'state', true FROM "countries" WHERE "iso2" = 'BO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Paz', 'state', true FROM "countries" WHERE "iso2" = 'BO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cochabamba', 'state', true FROM "countries" WHERE "iso2" = 'BO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chuquisaca', 'state', true FROM "countries" WHERE "iso2" = 'BO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Potosí', 'state', true FROM "countries" WHERE "iso2" = 'BO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint George', 'state', true FROM "countries" WHERE "iso2" = 'VC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Patrick', 'state', true FROM "countries" WHERE "iso2" = 'VC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Andrew', 'state', true FROM "countries" WHERE "iso2" = 'VC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint David', 'state', true FROM "countries" WHERE "iso2" = 'VC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grenadines', 'state', true FROM "countries" WHERE "iso2" = 'VC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Charlotte', 'state', true FROM "countries" WHERE "iso2" = 'VC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sharjah', 'state', true FROM "countries" WHERE "iso2" = 'AE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dubai', 'state', true FROM "countries" WHERE "iso2" = 'AE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Umm Al Quwain', 'state', true FROM "countries" WHERE "iso2" = 'AE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fujairah', 'state', true FROM "countries" WHERE "iso2" = 'AE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ras Al Khaimah', 'state', true FROM "countries" WHERE "iso2" = 'AE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ajman', 'state', true FROM "countries" WHERE "iso2" = 'AE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Abu Dhabi', 'state', true FROM "countries" WHERE "iso2" = 'AE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nohiyahoi Tobei Jumhurí ', 'state', true FROM "countries" WHERE "iso2" = 'TJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khatlon', 'state', true FROM "countries" WHERE "iso2" = 'TJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gorno-Badakhshan', 'state', true FROM "countries" WHERE "iso2" = 'TJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sughd ', 'state', true FROM "countries" WHERE "iso2" = 'TJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yilan', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Penghu', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Changhua', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pingtung', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taichung', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nantou', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiayi', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taitung', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hualien', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaohsiung', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Miaoli', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kinmen', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yunlin', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hsinchu', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taoyuan', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lienchiang', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tainan', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taipei', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Red Sea', 'state', true FROM "countries" WHERE "iso2" = 'ER'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anseba', 'state', true FROM "countries" WHERE "iso2" = 'ER'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maekel', 'state', true FROM "countries" WHERE "iso2" = 'ER'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Debub', 'state', true FROM "countries" WHERE "iso2" = 'ER'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gash-Barka', 'state', true FROM "countries" WHERE "iso2" = 'ER'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern Red Sea', 'state', true FROM "countries" WHERE "iso2" = 'ER'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern Peninsula', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Capital', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Westfjords', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northwestern', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northeastern', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Río Muni', 'state', true FROM "countries" WHERE "iso2" = 'GQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kié-Ntem', 'state', true FROM "countries" WHERE "iso2" = 'GQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wele-Nzas', 'state', true FROM "countries" WHERE "iso2" = 'GQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Litoral', 'state', true FROM "countries" WHERE "iso2" = 'GQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Insular', 'state', true FROM "countries" WHERE "iso2" = 'GQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bioko Sur', 'state', true FROM "countries" WHERE "iso2" = 'GQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Annobón', 'state', true FROM "countries" WHERE "iso2" = 'GQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centro Sur', 'state', true FROM "countries" WHERE "iso2" = 'GQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bioko Norte', 'state', true FROM "countries" WHERE "iso2" = 'GQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chihuahua', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oaxaca', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sinaloa', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Estado de México', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiapas', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nuevo León', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Durango', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tabasco', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Querétaro', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aguascalientes', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baja California', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tlaxcala', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guerrero', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baja California Sur', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Luis Potosí', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zacatecas', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tamaulipas', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Veracruz de Ignacio de la Llave', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Morelos', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yucatán', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quintana Roo', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sonora', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guanajuato', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hidalgo', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Coahuila de Zaragoza', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Colima', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ciudad de México', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Michoacán de Ocampo', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Campeche', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Puebla', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nayarit', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Krabi', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ranong', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nong Bua Lam Phu', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samut Prakan', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Surat Thani', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lamphun', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nong Khai', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khon Kaen', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chanthaburi', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saraburi', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phatthalung', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uttaradit', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sing Buri', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiang Mai', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakhon Sawan', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yala', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phra Nakhon Si Ayutthaya', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nonthaburi', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trat', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakhon Ratchasima', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiang Rai', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ratchaburi', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pathum Thani', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sakon Nakhon', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samut Songkhram', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakhon Pathom', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samut Sakhon', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mae Hong Son', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phitsanulok', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pattaya', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prachuap Khiri Khan', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loei', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Roi Et', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kanchanaburi', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ubon Ratchathani', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chon Buri', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phichit', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phetchabun', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kamphaeng Phet', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maha Sarakham', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rayong', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ang Thong', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakhon Si Thammarat', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yasothon', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chai Nat', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amnat Charoen', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Suphan Buri', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tak', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chumphon', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Udon Thani', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phrae', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sa Kaeo', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nan', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Surin', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phetchaburi', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bueng Kan', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buri Ram', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakhon Nayok', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phuket', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Satun', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phayao', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Songkhla', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pattani', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trang', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prachin Buri', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lop Buri', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lampang', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sukhothai', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mukdahan', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Si Sa Ket', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakhon Phanom', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phangnga', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalasin', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uthai Thani', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chachoengsao', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Narathiwat', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bangkok', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hiiu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Viljandi', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tartu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valga', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rapla', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Võru', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saare', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pärnu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Põlva', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lääne-Viru', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jõgeva', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Järva', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Harju', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lääne', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ida-Viru', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moyen-Chari', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mayo-Kebbi Ouest', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sila', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hadjer-Lamis', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Borkou', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ennedi-Est', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guéra', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lac', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tandjilé', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mayo-Kebbi Est', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wadi Fira', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouaddaï', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bahr el Gazel', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ennedi-Ouest', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Logone Occidental', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tibesti', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kanem', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mandoul', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Batha', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Logone Oriental', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salamat', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Berry Islands', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Eleuthera', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Grand Bahama', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rum Cay', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Acklins', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Eleuthera', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Abaco', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Black Point', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Eleuthera', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Abaco', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Inagua', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Long Island', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cat Island', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Exuma', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Harbour Island', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Grand Bahama', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ragged Island', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Abaco', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Andros', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Crooked Island', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Andros', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hope Town', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mangrove Cay', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Freeport', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Salvador Island', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bimini', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Spanish Wells', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Andros', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grand Cay', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mayaguana', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Juan', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santiago del Estero', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Luis', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tucumán', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Corrientes', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Río Negro', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chaco', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Fe', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Córdoba', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salta', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Misiones', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jujuy', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mendoza', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Catamarca', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Neuquén', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Cruz', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tierra del Fuego', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chubut', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Formosa', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Rioja', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Entre Ríos', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Pampa', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buenos Aires', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quiché ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jalapa ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Izabal ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Suchitepéquez ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sololá ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Progreso ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Totonicapán ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Retalhuleu ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Rosa ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiquimula ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Marcos ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quetzaltenango ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Petén ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Huehuetenango ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alta Verapaz ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guatemala ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jutiapa ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baja Verapaz ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chimaltenango ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sacatepéquez ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Escuintla ', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madre de Dios', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Huancavelica', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Áncash', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arequipa', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Puno', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Libertad', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ucayali', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Amazonas', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pasco', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Huanuco', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cajamarca', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tumbes', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cusco', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ayacucho', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Junín', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Martín', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lima', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tacna', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Piura', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moquegua', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Apurímac', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ica', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Callao', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lambayeque', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Redonda', 'state', true FROM "countries" WHERE "iso2" = 'AG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Peter', 'state', true FROM "countries" WHERE "iso2" = 'AG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Paul', 'state', true FROM "countries" WHERE "iso2" = 'AG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint John', 'state', true FROM "countries" WHERE "iso2" = 'AG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Mary', 'state', true FROM "countries" WHERE "iso2" = 'AG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barbuda', 'state', true FROM "countries" WHERE "iso2" = 'AG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint George', 'state', true FROM "countries" WHERE "iso2" = 'AG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Philip', 'state', true FROM "countries" WHERE "iso2" = 'AG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Bačka', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pirot', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Banat', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Bačka', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jablanica', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Banat', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bor', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Toplica', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mačva', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rasina', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pčinja', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nišava', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kolubara', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Raška', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Bačka', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moravica', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Belgrade', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zlatibor', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zaječar', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Braničevo', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vojvodina', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šumadija', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Banat', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pomoravlje', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Srem', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Podunavlje', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Westmoreland', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Elizabeth', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Ann', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint James', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Catherine', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Mary', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kingston', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hanover', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Thomas', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Andrew', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Portland', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Clarendon', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manchester', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trelawny', 'state', true FROM "countries" WHERE "iso2" = 'JM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dennery', 'state', true FROM "countries" WHERE "iso2" = 'LC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anse la Raye', 'state', true FROM "countries" WHERE "iso2" = 'LC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Castries', 'state', true FROM "countries" WHERE "iso2" = 'LC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Laborie', 'state', true FROM "countries" WHERE "iso2" = 'LC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Choiseul', 'state', true FROM "countries" WHERE "iso2" = 'LC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Canaries', 'state', true FROM "countries" WHERE "iso2" = 'LC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Micoud', 'state', true FROM "countries" WHERE "iso2" = 'LC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vieux Fort', 'state', true FROM "countries" WHERE "iso2" = 'LC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Soufrière', 'state', true FROM "countries" WHERE "iso2" = 'LC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gros Islet', 'state', true FROM "countries" WHERE "iso2" = 'LC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hưng Yên', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Đồng Tháp', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thanh Hóa', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Điện Biên', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cà Mau', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nghệ An', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cao Bằng', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hải Phòng', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ninh Bình', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vĩnh Long', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bắc Ninh', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lạng Sơn', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khánh Hòa', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'An Giang', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tuyên Quang', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thừa Thiên-Huế', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phú Thọ', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quảng Trị', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Đà Nẵng', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thái Nguyên', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hà Nội', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hồ Chí Minh', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sơn La', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gia Lai', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quảng Ninh', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hà Tĩnh', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lào Cai', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lâm Đồng', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Đồng Nai', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lai Châu', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tây Ninh', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quảng Ngãi', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Đắk Lắk', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Peter Basseterre', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nevis', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Christ Church Nichola Town', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Paul Capisterre', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint James Windward', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Anne Sandy Point', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint George Gingerland', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Paul Charlestown', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Thomas Lowland', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint John Figtree', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Kitts', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Thomas Middle Island', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trinity Palmetto Point', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Mary Cayon', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint John Capisterre', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Daegu', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gyeonggi', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Incheon', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Seoul', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Daejeon', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Jeolla', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ulsan', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jeju', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Chungcheong', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Gyeongsang', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Jeolla', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Gyeongsang', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gwangju', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Chungcheong', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Busan', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sejong City', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gangwon', 'state', true FROM "countries" WHERE "iso2" = 'KR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Patrick', 'state', true FROM "countries" WHERE "iso2" = 'GD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint George', 'state', true FROM "countries" WHERE "iso2" = 'GD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Andrew', 'state', true FROM "countries" WHERE "iso2" = 'GD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Mark', 'state', true FROM "countries" WHERE "iso2" = 'GD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Carriacou', 'state', true FROM "countries" WHERE "iso2" = 'GD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint John', 'state', true FROM "countries" WHERE "iso2" = 'GD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint David', 'state', true FROM "countries" WHERE "iso2" = 'GD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ghazni', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Badghis', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bamyan', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Helmand', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zabul', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baghlan', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kunar', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paktika', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khost', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kapisa', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nuristan', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Panjshir', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nangarhar', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samangan', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balkh', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sar-e Pol', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jowzjan', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Herat', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ghōr', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Faryab', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kandahar', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Laghman', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Daykundi', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Takhar', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paktia', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Parwan', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nimruz', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Logar', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Urozgan', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Farah', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kunduz Province', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Badakhshan', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kabul', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Victoria', 'state', true FROM "countries" WHERE "iso2" = 'AU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Australia', 'state', true FROM "countries" WHERE "iso2" = 'AU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Queensland', 'state', true FROM "countries" WHERE "iso2" = 'AU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western Australia', 'state', true FROM "countries" WHERE "iso2" = 'AU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Australian Capital Territory', 'state', true FROM "countries" WHERE "iso2" = 'AU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tasmania', 'state', true FROM "countries" WHERE "iso2" = 'AU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'New South Wales', 'state', true FROM "countries" WHERE "iso2" = 'AU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Territory', 'state', true FROM "countries" WHERE "iso2" = 'AU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vavaʻu', 'state', true FROM "countries" WHERE "iso2" = 'TO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tongatapu', 'state', true FROM "countries" WHERE "iso2" = 'TO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haʻapai', 'state', true FROM "countries" WHERE "iso2" = 'TO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Niuas', 'state', true FROM "countries" WHERE "iso2" = 'TO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'ʻEua', 'state', true FROM "countries" WHERE "iso2" = 'TO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Markazi', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khuzestan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ilam', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kermanshah', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gilan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chaharmahal and Bakhtiari', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qom', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isfahan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Azarbaijan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zanjan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kohgiluyeh and Boyer-Ahmad', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Razavi Khorasan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lorestan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alborz', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Khorasan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sistan and Baluchestan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bushehr', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Golestan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ardabil', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kurdistan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yazd', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hormozgan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mazandaran', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fars', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Semnan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qazvin', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Khorasan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kerman', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Azerbaijan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tehran', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Niutao Island Council', 'state', true FROM "countries" WHERE "iso2" = 'TV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nanumanga', 'state', true FROM "countries" WHERE "iso2" = 'TV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nui', 'state', true FROM "countries" WHERE "iso2" = 'TV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nanumea', 'state', true FROM "countries" WHERE "iso2" = 'TV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vaitupu', 'state', true FROM "countries" WHERE "iso2" = 'TV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Funafuti', 'state', true FROM "countries" WHERE "iso2" = 'TV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nukufetau', 'state', true FROM "countries" WHERE "iso2" = 'TV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nukulaelae', 'state', true FROM "countries" WHERE "iso2" = 'TV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dhi Qar', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Babylon', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al-Qādisiyyah', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karbala', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Muthanna', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baghdad', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Basra', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saladin', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Najaf', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nineveh', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Anbar', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Diyala', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maysan', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dohuk', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Erbil', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sulaymaniyah', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wasit', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kirkuk', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Svay Rieng', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Preah Vihear', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prey Veng', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Takeo', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Battambang', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pursat', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kep', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kampong Chhnang', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pailin', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kampot', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koh Kong', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kandal', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Banteay Meanchey', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mondulkiri', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kratie', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oddar Meanchey', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kampong Speu', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sihanoukville', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ratanakiri', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kampong Cham', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Siem Reap', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stung Treng', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Phnom Penh', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Hamgyong', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ryanggang', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Pyongan', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chagang', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kangwon', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Hamgyong', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rason', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Pyongan', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Hwanghae', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Hwanghae', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pyongyang', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Meghalaya', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haryana', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maharashtra', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Goa', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manipur', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Puducherry', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Telangana', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Odisha', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rajasthan', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Punjab', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uttarakhand', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Andhra Pradesh', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nagaland', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lakshadweep', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Himachal Pradesh', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Delhi', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uttar Pradesh', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Andaman and Nicobar Islands', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arunachal Pradesh', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jharkhand', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karnataka', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Assam', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kerala', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jammu and Kashmir', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gujarat', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chandigarh', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dadra and Nagar Haveli and Daman and Diu', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sikkim', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tamil Nadu', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mizoram', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bihar', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tripura', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madhya Pradesh', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chhattisgarh', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Choluteca', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Comayagua', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Paraíso', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Intibucá', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bay Islands', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cortés', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Atlántida', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gracias a Dios', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Copán', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Olancho', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Colón', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Francisco Morazán', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Bárbara', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lempira', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valle', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ocotepeque', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yoro', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Paz', 'state', true FROM "countries" WHERE "iso2" = 'HN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northland', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manawatu-Whanganui', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Waikato', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Otago', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marlborough', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Coast', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wellington', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Canterbury', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chatham Islands', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gisborne', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taranaki', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nelson', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southland', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Auckland', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tasman', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bay of Plenty', 'state', true FROM "countries" WHERE "iso2" = 'NZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint John', 'state', true FROM "countries" WHERE "iso2" = 'DM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Mark', 'state', true FROM "countries" WHERE "iso2" = 'DM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint David', 'state', true FROM "countries" WHERE "iso2" = 'DM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint George', 'state', true FROM "countries" WHERE "iso2" = 'DM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Patrick', 'state', true FROM "countries" WHERE "iso2" = 'DM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Peter', 'state', true FROM "countries" WHERE "iso2" = 'DM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Andrew', 'state', true FROM "countries" WHERE "iso2" = 'DM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Luke', 'state', true FROM "countries" WHERE "iso2" = 'DM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Paul', 'state', true FROM "countries" WHERE "iso2" = 'DM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Joseph', 'state', true FROM "countries" WHERE "iso2" = 'DM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Seibo', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Romana', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sánchez Ramírez', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hermanas Mirabal', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barahona', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Cristóbal', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Puerto Plata', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santo Domingo', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'María Trinidad Sánchez', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Distrito Nacional', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Peravia', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Independencia', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Juan', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monseñor Nouel', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santiago Rodríguez', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pedernales', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Espaillat', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Samaná', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valverde', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baoruco', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hato Mayor', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dajabón', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santiago', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Altagracia', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Pedro de Macorís', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monte Plata', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San José de Ocoa', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Duarte', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Azua', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monte Cristi', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Vega', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nord', 'state', true FROM "countries" WHERE "iso2" = 'HT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nippes', 'state', true FROM "countries" WHERE "iso2" = 'HT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouest', 'state', true FROM "countries" WHERE "iso2" = 'HT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nord-Est', 'state', true FROM "countries" WHERE "iso2" = 'HT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sud', 'state', true FROM "countries" WHERE "iso2" = 'HT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Artibonite', 'state', true FROM "countries" WHERE "iso2" = 'HT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sud-Est', 'state', true FROM "countries" WHERE "iso2" = 'HT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centre', 'state', true FROM "countries" WHERE "iso2" = 'HT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nord-Ouest', 'state', true FROM "countries" WHERE "iso2" = 'HT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Vicente', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Ana', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Usulután', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Morazán', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chalatenango', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cabañas', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Salvador', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Libertad', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Miguel', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Paz', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cuscatlán', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Unión ', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ahuachapán', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sonsonate', 'state', true FROM "countries" WHERE "iso2" = 'SV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Braslovče', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lenart', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oplotnica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Velike Lašče', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hajdina', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Podčetrtek', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cankova', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vitanje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sežana', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kidričevo', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Črenšovci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Idrija', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trnovska Vas', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vodice', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ravne na Koroškem', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lovrenc na Pohorju', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Majšperk', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loški Potok', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Domžale', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rečica ob Savinji', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Podlehnik', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cerknica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vransko', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sveta Ana', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brezovica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Benedikt', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Divača', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moravče', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Slovenj Gradec', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Škocjan', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šentjur', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pesnica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dol pri Ljubljani', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loška Dolina', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hoče–Slivnica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cerkvenjak', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naklo', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cerkno', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bistrica ob Sotli', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kamnik', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bovec', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zavrč', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ajdovščina', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pivka', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Štore', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kozje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Škofljica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prebold', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dobrovnik', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mozirje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Celje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Žiri', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Horjul', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tabor', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Radeče', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vipava', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kungota', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Slovenske Konjice', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Osilnica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Borovnica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Piran', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bled', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jezersko', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rače–Fram', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nova Gorica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Razkrižje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ribnica na Pohorju', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Muta', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rogatec', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gorišnica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kuzma', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mislinja', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Duplek', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trebnje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brežice', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dobrepolje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grad', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moravske Toplice', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luče', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Miren–Kostanjevica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ormož', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šalovci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Miklavž na Dravskem Polju', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Makole', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lendava', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vuzenica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kanal ob Soči', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ptuj', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sveti Andraž v Slovenskih Goricah', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Selnica ob Dravi', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Radovljica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Črna na Koroškem', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rogaška Slatina', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Podvelka', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ribnica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Novo Mesto', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mirna Peč', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Križevci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Poljčane', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brda', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šentjernej', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maribor', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kobarid', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Markovci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vojnik', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trbovlje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tolmin', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šoštanj', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Žetale', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tržič', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Turnišče', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dobrna', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Renče–Vogrsko', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kostanjevica na Krki', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sveti Jurij ob Ščavnici', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Železniki', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Veržej', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Žalec', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Starše', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sveta Trojica v Slovenskih Goricah', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Solčava', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vrhnika', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Središče ob Dravi', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rogašovci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mežica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Juršinci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Velika Polana', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sevnica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zagorje ob Savi', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ljubljana', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gornji Petrovci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Polzela', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sveti Tomaž', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prevalje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Radlje ob Dravi', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Žirovnica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sodražica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bloke', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šmartno pri Litiji', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ruše', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dolenjske Toplice', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bohinj', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Komenda', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gorje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šmarje pri Jelšah', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ig', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kranj', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Puconci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šmarješke Toplice', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dornava', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Črnomelj', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Radenci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gorenja Vas–Poljane', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ljubno', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dobje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šmartno ob Paki', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mokronog–Trebelno', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mirna', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šenčur', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Videm', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beltinci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lukovica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Preddvor', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Destrnik', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ivančna Gorica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Log–Dragomer', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Žužemberk', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dobrova–Polhov Gradec', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cirkulane', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cerklje na Gorenjskem', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šentrupert', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tišina', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Murska Sobota', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Krško', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Komen', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Škofja Loka', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šempeter–Vrtojba', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Apače', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koper', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Odranci', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hrpelje–Kozina', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Izola', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Metlika', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šentilj', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kobilje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ankaran', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hodoš', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sveti Jurij v Slovenskih Goricah', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nazarje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Postojna', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kostel', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Slovenska Bistrica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Straža', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trzin', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kočevje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grosuplje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jesenice', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Laško', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gornji Grad', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kranjska Gora', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hrastnik', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zreče', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gornja Radgona', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ilirska Bistrica', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dravograd', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Semič', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Litija', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mengeš', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Medvode', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Logatec', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ljutomer', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Banská Bystrica', 'state', true FROM "countries" WHERE "iso2" = 'SK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Košice', 'state', true FROM "countries" WHERE "iso2" = 'SK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prešov', 'state', true FROM "countries" WHERE "iso2" = 'SK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trnava', 'state', true FROM "countries" WHERE "iso2" = 'SK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bratislava', 'state', true FROM "countries" WHERE "iso2" = 'SK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nitra', 'state', true FROM "countries" WHERE "iso2" = 'SK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trenčín', 'state', true FROM "countries" WHERE "iso2" = 'SK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Žilina', 'state', true FROM "countries" WHERE "iso2" = 'SK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cimișlia', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Orhei', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bender', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nisporeni', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sîngerei', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Căușeni', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Călărași', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Glodeni', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anenii Noi', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ialoveni', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Florești', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Telenești', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Taraclia', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chișinău', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Soroca', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Briceni', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rîșcani', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Strășeni', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ștefan Vodă', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Basarabeasca', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cantemir', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fălești', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hîncești', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dubăsari', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dondușeni', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gagauzia', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ungheni', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Edineț', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Șoldănești', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ocnița', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Criuleni', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cahul', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Drochia', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bălți', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rezina', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Transnistria', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gulbene', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Līvāni', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salaspils', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ventspils', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tukums', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ogre', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Olaine', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Limbaži', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ventspils', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jelgava', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valka', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Varakļāni', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madona', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ķekava', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dobele', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jēkabpils', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saldus', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saulkrasti', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jūrmala', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mārupe', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ādaži', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rēzekne', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Talsi', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Liepāja', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Smiltene', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Daugavpils', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bauska', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cēsis', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aizkraukle', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valmiera', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Krāslava', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sigulda', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Preiļi', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alūksne', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kuldīga', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Riga', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Augšdaugava', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ropaži', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jelgava', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ludza', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balvi', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dienvidkurzemes', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rēzekne', 'state', true FROM "countries" WHERE "iso2" = 'LV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Viqueque', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Liquiçá', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ermera', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manatuto', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ainaro', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manufahi', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aileu', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baucau', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cova Lima', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lautém', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dili', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bobonaro', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Peleliu', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngardmau', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Airai', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hatohobei', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Melekeok', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngatpang', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koror', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngarchelong', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngiwal', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sonsorol', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngchesar', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngaraard', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Angaur', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kayangel', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aimeliik', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ngeremlengui', 'state', true FROM "countries" WHERE "iso2" = 'PW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Břeclav', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Český Krumlov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plzeň-město', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brno-venkov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Příbram', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pardubice', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nový Jičín', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Náchod', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prostějov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zlínský kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chomutov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Středočeský kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'České Budějovice', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rakovník', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Frýdek-Místek', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Písek', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hodonín', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zlín', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plzeň-sever', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tábor', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brno-město', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Svitavy', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vsetín', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cheb', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Olomouc', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kraj Vysočina', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ústecký kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prachatice', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trutnov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hradec Králové', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karlovarský kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nymburk', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rokycany', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ostrava-město', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karviná', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pardubický kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Olomoucký kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Liberec', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Klatovy', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uherské Hradiště', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kroměříž', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sokolov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Semily', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Třebíč', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Praha, Hlavní město', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ústí nad Labem', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moravskoslezský kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Liberecký kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jihomoravský kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karlovy Vary', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Litoměřice', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Praha-východ', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plzeňský kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plzeň-jih', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Děčín', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Havlíčkův Brod', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jablonec nad Nisou', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jihlava', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Královéhradecký kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blansko', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Louny', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kolín', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Praha-západ', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Beroun', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Teplice', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vyškov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Opava', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jindřichův Hradec', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jeseník', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Přerov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Benešov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Strakonice', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Most', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Znojmo', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kladno', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Česká Lípa', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chrudim', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rychnov nad Kněžnou', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mělník', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jihočeský kraj', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jičín', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Domažlice', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šumperk', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mladá Boleslav', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bruntál', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pelhřimov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tachov', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ústí nad Orlicí', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Žďár nad Sázavou', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North East', 'state', true FROM "countries" WHERE "iso2" = 'SG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South East', 'state', true FROM "countries" WHERE "iso2" = 'SG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central Singapore', 'state', true FROM "countries" WHERE "iso2" = 'SG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South West', 'state', true FROM "countries" WHERE "iso2" = 'SG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North West', 'state', true FROM "countries" WHERE "iso2" = 'SG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ewa', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uaboe', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aiwo', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Meneng', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anabar', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nibok', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baiti', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ijuw', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buada', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anibare', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yaren', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boe', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Denigomodu', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anetan', 'state', true FROM "countries" WHERE "iso2" = 'NR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zhytomyrska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vinnytska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zakarpatska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kyivska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lvivska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luhanska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ternopilska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dnipropetrovska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kyiv', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kirovohradska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chernivetska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mykolaivska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cherkaska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khmelnytska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ivano-Frankivska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rivnenska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khersonska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sumska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kharkivska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zaporizka', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Odeska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Autonomous Republic of Crimea', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Volynska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Donetska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chernihivska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gabrovo', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Smolyan', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pernik', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Montana', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vidin', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Razgrad', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blagoevgrad', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sliven', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Plovdiv', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kardzhali', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kyustendil', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haskovo', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sofia City', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pleven', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stara Zagora', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Silistra', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Veliko Tarnovo', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lovech', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vratsa', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pazardzhik', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ruse', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Targovishte', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Burgas', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yambol', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Varna', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dobrich', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sofia', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Suceava', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hunedoara', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arges', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bihor', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alba', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ilfov', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Giurgiu', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tulcea', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Teleorman', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prahova', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bucharest', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Neamț', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Călărași', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bistrița-Năsăud', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cluj', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Iași', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Braila', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Constanța', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Olt', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arad', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Botoșani', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sălaj', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dolj', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ialomița', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bacău', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dâmbovița', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Satu Mare', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Galați', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Timiș', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Harghita', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gorj', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mehedinți', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vaslui', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caraș-Severin', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Covasna', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sibiu', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buzău', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vâlcea', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vrancea', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brașov', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maramureș', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aiga-i-le-Tai', 'state', true FROM "countries" WHERE "iso2" = 'WS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Atua', 'state', true FROM "countries" WHERE "iso2" = 'WS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vaisigano', 'state', true FROM "countries" WHERE "iso2" = 'WS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Palauli', 'state', true FROM "countries" WHERE "iso2" = 'WS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tuamasaga', 'state', true FROM "countries" WHERE "iso2" = 'WS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Torba', 'state', true FROM "countries" WHERE "iso2" = 'VU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Penama', 'state', true FROM "countries" WHERE "iso2" = 'VU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shefa', 'state', true FROM "countries" WHERE "iso2" = 'VU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Malampa', 'state', true FROM "countries" WHERE "iso2" = 'VU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sanma', 'state', true FROM "countries" WHERE "iso2" = 'VU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tafea', 'state', true FROM "countries" WHERE "iso2" = 'VU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Honiara', 'state', true FROM "countries" WHERE "iso2" = 'SB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Temotu', 'state', true FROM "countries" WHERE "iso2" = 'SB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isabel', 'state', true FROM "countries" WHERE "iso2" = 'SB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Choiseul', 'state', true FROM "countries" WHERE "iso2" = 'SB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Makira-Ulawa', 'state', true FROM "countries" WHERE "iso2" = 'SB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Malaita', 'state', true FROM "countries" WHERE "iso2" = 'SB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'SB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guadalcanal', 'state', true FROM "countries" WHERE "iso2" = 'SB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'SB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rennell and Bellona', 'state', true FROM "countries" WHERE "iso2" = 'SB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint-Barthélemy', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nouvelle-Aquitaine', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Île-de-France', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mayotte', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Auvergne-Rhône-Alpes', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Occitanie', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pays-de-la-Loire', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Normandie', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Corse', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bretagne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint-Martin', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wallis and Futuna', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alsace', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Provence-Alpes-Côte-d’Azur', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paris', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Centre-Val de Loire', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grand-Est', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Pierre and Miquelon', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'French Guiana', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Réunion', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'French Polynesia', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bourgogne-Franche-Comté', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Martinique', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hauts-de-France', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guadeloupe', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West New Britain', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bougainville', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jiwaka', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hela', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East New Britain', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Morobe', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sandaun', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Port Moresby', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oro', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gulf', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western Highlands', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'New Ireland', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manus', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madang', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern Highlands', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern Highlands', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chimbu', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Enga', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Milne Bay', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ohio', 'state', true FROM "countries" WHERE "iso2" = 'US'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ladakh', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Bengal', 'state', true FROM "countries" WHERE "iso2" = 'IN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sinop', 'state', true FROM "countries" WHERE "iso2" = 'TR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Distrito Capital', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Apure', 'state', true FROM "countries" WHERE "iso2" = 'VE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jalisco', 'state', true FROM "countries" WHERE "iso2" = 'MX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Roraima', 'state', true FROM "countries" WHERE "iso2" = 'BR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guarda', 'state', true FROM "countries" WHERE "iso2" = 'PT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Devonshire', 'state', true FROM "countries" WHERE "iso2" = 'BM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hamilton', 'state', true FROM "countries" WHERE "iso2" = 'BM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paget', 'state', true FROM "countries" WHERE "iso2" = 'BM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pembroke', 'state', true FROM "countries" WHERE "iso2" = 'BM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sandys', 'state', true FROM "countries" WHERE "iso2" = 'BM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southampton', 'state', true FROM "countries" WHERE "iso2" = 'BM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Warwick', 'state', true FROM "countries" WHERE "iso2" = 'BM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Huila', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ferizaj', 'state', true FROM "countries" WHERE "iso2" = 'XK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gjakove', 'state', true FROM "countries" WHERE "iso2" = 'XK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gjilan', 'state', true FROM "countries" WHERE "iso2" = 'XK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mitrovica', 'state', true FROM "countries" WHERE "iso2" = 'XK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pristina', 'state', true FROM "countries" WHERE "iso2" = 'XK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Autonomous City of Buenos Aires', 'state', true FROM "countries" WHERE "iso2" = 'AR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'New Providence', 'state', true FROM "countries" WHERE "iso2" = 'BS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shumen', 'state', true FROM "countries" WHERE "iso2" = 'BG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yuen Long', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tsuen Wan', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tai Po', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sai Kung', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Islands', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Central and Western', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wan Chai', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southern', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yau Tsim Mong', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sham Shui Po', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kowloon City', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wong Tai Sin', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kwun Tong', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kwai Tsing', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tuen Mun', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sha Tin', 'state', true FROM "countries" WHERE "iso2" = 'HK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sidi Bel Abbès', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Menia', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouled Djellal', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bordj Baji Mokhtar', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Béni Abbès', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Timimoun', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Touggourt', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Djanet', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'In Salah', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'In Guezzam', 'state', true FROM "countries" WHERE "iso2" = 'DZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mureș', 'state', true FROM "countries" WHERE "iso2" = 'RO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Volgograd Oblast', 'state', true FROM "countries" WHERE "iso2" = 'RU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Colle', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Condamine', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moneghetti', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hamadan', 'state', true FROM "countries" WHERE "iso2" = 'IR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bogotá D.C.', 'state', true FROM "countries" WHERE "iso2" = 'CO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loreto', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kutná Hora', 'state', true FROM "countries" WHERE "iso2" = 'CZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kōchi', 'state', true FROM "countries" WHERE "iso2" = 'JP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cần Thơ', 'state', true FROM "countries" WHERE "iso2" = 'VN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rivers', 'state', true FROM "countries" WHERE "iso2" = 'NG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rabat-Salé-Kénitra', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agadir-Ida-Ou-Tanane', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Berrechid', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Casablanca', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Driouch', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fès', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fquih Ben Salah', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guercif', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marrakech', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'M’diq-Fnideq', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Meknès', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Midelt', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mohammadia', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oujda-Angad', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouezzane', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rabat', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rehamna', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salé', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sidi Bennour', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sidi Ifni', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Skhirate-Témara', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tarfaya (EH-partial)', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tinghir', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tanger-Assilah', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Youssoufia', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sidi Slimane', 'state', true FROM "countries" WHERE "iso2" = 'MA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lualaba', 'state', true FROM "countries" WHERE "iso2" = 'CD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chaiyaphum', 'state', true FROM "countries" WHERE "iso2" = 'TH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mbeya', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Songwe', 'state', true FROM "countries" WHERE "iso2" = 'TZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Basel-Stadt', 'state', true FROM "countries" WHERE "iso2" = 'CH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bono East', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bono', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North East', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oti', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Savannah', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western North', 'state', true FROM "countries" WHERE "iso2" = 'GH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nueva Segovia', 'state', true FROM "countries" WHERE "iso2" = 'NI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Keelung', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'New Taipei', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ain', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aisne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Allier', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alpes-de-Haute-Provence', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hautes-Alpes', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alpes-Maritimes', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ardèche', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ardennes', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ariège', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aube', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aude', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aveyron', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bouches-du-Rhône', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Calvados', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cantal', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Charente', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Charente-Maritime', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cher', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Corrèze', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Creuse', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dordogne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Doubs', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Drôme', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eure', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eure-et-Loir', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Finistère', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Corse-du-Sud', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haute-Corse', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gard', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haute-Garonne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gers', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gironde', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hérault', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ille-et-Vilaine', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Indre', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Indre-et-Loire', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isère', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jura', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Landes', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loir-et-Cher', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loire', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haute-Loire', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loire-Atlantique', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loiret', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lot', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lot-et-Garonne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lozère', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maine-et-Loire', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manche', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haute-Marne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mayenne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Meurthe-et-Moselle', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Meuse', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Morbihan', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moselle', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nièvre', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nord', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oise', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Orne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pas-de-Calais', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Puy-de-Dôme', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pyrénées-Atlantiques', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hautes-Pyrénées', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pyrénées-Orientales', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bas-Rhin', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haut-Rhin', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rhône', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Métropole de Lyon', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haute-Saône', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saône-et-Loire', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sarthe', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Savoie', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haute-Savoie', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Seine-Maritime', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Seine-et-Marne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yvelines', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Deux-Sèvres', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Somme', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tarn', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tarn-et-Garonne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Var', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vaucluse', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vendée', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vienne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haute-Vienne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vosges', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yonne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Territoire de Belfort', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Essonne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hauts-de-Seine', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Seine-Saint-Denis', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Val-de-Marne', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Clipperton', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'French Southern and Antarctic Lands', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sharqia', 'state', true FROM "countries" WHERE "iso2" = 'EG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loja', 'state', true FROM "countries" WHERE "iso2" = 'EC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karlovac', 'state', true FROM "countries" WHERE "iso2" = 'HR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kampong Thom', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Poltavska', 'state', true FROM "countries" WHERE "iso2" = 'UA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Thomas', 'state', true FROM "countries" WHERE "iso2" = 'VI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint John', 'state', true FROM "countries" WHERE "iso2" = 'VI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Croix', 'state', true FROM "countries" WHERE "iso2" = 'VI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Juan', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bayamon', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Carolina', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ponce', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caguas', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guaynabo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arecibo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Toa Baja', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mayagüez', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trujillo Alto', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Komárom-Esztergom', 'state', true FROM "countries" WHERE "iso2" = 'HU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bonaire', 'state', true FROM "countries" WHERE "iso2" = 'BQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saba', 'state', true FROM "countries" WHERE "iso2" = 'BQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sint Eustatius', 'state', true FROM "countries" WHERE "iso2" = 'BQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'A Coruña', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lugo', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ourense', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Badajoz', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Araba', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bizkaia', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Almeria', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cádiz', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Córdoba', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Granada', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Huelva', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jaén', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Málaga', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barcelona', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Girona', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lleida', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ciudad Real', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cuenca', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guadalajara', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alicante', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Albacete', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Castellón', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Teruel', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Cruz de Tenerife', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zaragoza', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chari-Baguirmi', 'state', true FROM "countries" WHERE "iso2" = 'TD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western Samar', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nabeul', 'state', true FROM "countries" WHERE "iso2" = 'TN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jämtland', 'state', true FROM "countries" WHERE "iso2" = 'SE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bethlehem', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Deir El Balah', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gaza', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hebron', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jenin', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jericho ', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jerusalem (Quds)', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khan Yunis', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nablus', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Gaza', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qalqilya', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rafah', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ramallah', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salfit', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tubas', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tulkarm', 'state', true FROM "countries" WHERE "iso2" = 'PS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Adjuntas', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aguada', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aguadilla', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aguas Buenas', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aibonito', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Añasco', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arroyo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barceloneta', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barranquitas', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cabo Rojo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Camuy', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Canóvanas', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cataño', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cayey', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ceiba', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ciales', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cidra', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Coamo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Comerío', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Corozal', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Culebra', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dorado', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fajardo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Florida', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guánica', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guayama', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Guayanilla', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gurabo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hatillo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hormigueros', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Humacao', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isabela', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jayuya', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Juana Díaz', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Juncos', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lajas', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lares', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Las Marías', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Las Piedras', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loíza', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luquillo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manatí', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maricao', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maunabo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moca', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Morovis', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naguabo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naranjito', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Orocovis', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Patillas', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Peñuelas', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Quebradillas', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rincón', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Río Grande', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sabana Grande', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salinas', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Germán', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Lorenzo', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Sebastián', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Isabel', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Toa Alta', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Utuado', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vega Alta', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vega Baja', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vieques', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Villalba', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yabucoa', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yauco', 'state', true FROM "countries" WHERE "iso2" = 'PR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baker Island', 'state', true FROM "countries" WHERE "iso2" = 'UM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Howland Island', 'state', true FROM "countries" WHERE "iso2" = 'UM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jarvis Island', 'state', true FROM "countries" WHERE "iso2" = 'UM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Johnston Atoll', 'state', true FROM "countries" WHERE "iso2" = 'UM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kingman Reef', 'state', true FROM "countries" WHERE "iso2" = 'UM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Midway Islands', 'state', true FROM "countries" WHERE "iso2" = 'UM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Navassa Island', 'state', true FROM "countries" WHERE "iso2" = 'UM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Palmyra Atoll', 'state', true FROM "countries" WHERE "iso2" = 'UM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wake Island', 'state', true FROM "countries" WHERE "iso2" = 'UM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Asuncion', 'state', true FROM "countries" WHERE "iso2" = 'PY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Canary Islands', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ceuta', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Melilla', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Province', 'state', true FROM "countries" WHERE "iso2" = 'NC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Province', 'state', true FROM "countries" WHERE "iso2" = 'NC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loyalty Islands Province', 'state', true FROM "countries" WHERE "iso2" = 'NC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East Sepik', 'state', true FROM "countries" WHERE "iso2" = 'PG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eysturoy', 'state', true FROM "countries" WHERE "iso2" = 'FO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Northern Isles', 'state', true FROM "countries" WHERE "iso2" = 'FO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sandoy', 'state', true FROM "countries" WHERE "iso2" = 'FO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Streymoy', 'state', true FROM "countries" WHERE "iso2" = 'FO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Suðuroy', 'state', true FROM "countries" WHERE "iso2" = 'FO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vágar', 'state', true FROM "countries" WHERE "iso2" = 'FO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Papua Tengah', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Papua Pegunungan', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Papua Selatan', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Papua Barat Daya', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zacapa', 'state', true FROM "countries" WHERE "iso2" = 'GT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madhesh', 'state', true FROM "countries" WHERE "iso2" = 'NP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sudurpashchim', 'state', true FROM "countries" WHERE "iso2" = 'NP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trashi Yangtse	', 'state', true FROM "countries" WHERE "iso2" = 'BT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Noord', 'state', true FROM "countries" WHERE "iso2" = 'AW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oranjestad West', 'state', true FROM "countries" WHERE "iso2" = 'AW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oranjestad East', 'state', true FROM "countries" WHERE "iso2" = 'AW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paradera', 'state', true FROM "countries" WHERE "iso2" = 'AW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Nicolaas Noord', 'state', true FROM "countries" WHERE "iso2" = 'AW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'San Nicolaas Zuid', 'state', true FROM "countries" WHERE "iso2" = 'AW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Cruz', 'state', true FROM "countries" WHERE "iso2" = 'AW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Savaneta', 'state', true FROM "countries" WHERE "iso2" = 'AW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grand Cayman', 'state', true FROM "countries" WHERE "iso2" = 'KY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cayman Brac', 'state', true FROM "countries" WHERE "iso2" = 'KY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Little Cayman', 'state', true FROM "countries" WHERE "iso2" = 'KY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Agana Heights', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Asan-Maina', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barrigada', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chalan Pago-Ordot', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dededo', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hågat', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Umatac (Humåtak)', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Inarajan (Inalåhan)', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Merizo (Malesso)', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mangilao', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mongmong-Toto-Maite', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hagåtña', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Piti', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Santa Rita (Sånta Rita-Sumai)', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sinajana', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tamuning', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yigo', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yona', 'state', true FROM "countries" WHERE "iso2" = 'GU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blowing Point', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'East End', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'George Hill', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Island Harbour', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Hill', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Side', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sandy Ground', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sandy Hill', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Hill', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stoney Ground', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'The Farrington', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'The Quarter', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'The Valley', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West End', 'state', true FROM "countries" WHERE "iso2" = 'AI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mariehamn', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jomala', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Finström', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lemland', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saltvik', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hammarland', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sund', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eckerö', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Föglö', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Geta', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vårdö', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brändö', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lumparland', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kumlinge', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kökar', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sottunga', 'state', true FROM "countries" WHERE "iso2" = 'AX'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ayre', 'state', true FROM "countries" WHERE "iso2" = 'IM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Garff', 'state', true FROM "countries" WHERE "iso2" = 'IM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Glenfaba', 'state', true FROM "countries" WHERE "iso2" = 'IM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Michael', 'state', true FROM "countries" WHERE "iso2" = 'IM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Middle', 'state', true FROM "countries" WHERE "iso2" = 'IM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rushen', 'state', true FROM "countries" WHERE "iso2" = 'IM'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grouville', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Brelade', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Clement', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Helier', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St John', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Lawrence', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Martin', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Mary', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Ouen', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Peter', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Saviour', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trinity', 'state', true FROM "countries" WHERE "iso2" = 'JE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Peja', 'state', true FROM "countries" WHERE "iso2" = 'XK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prizren', 'state', true FROM "countries" WHERE "iso2" = 'XK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'National Capital Region (Metro Manila)', 'state', true FROM "countries" WHERE "iso2" = 'PH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Andalusia', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aragon', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Castile and Leon', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Castilla-La Mancha', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Catalonia', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Basque Country', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Estremadura', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Galicia', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Balearic Islands', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Community of Madrid', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Region of Murcia', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Navarre', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valencian Community', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oranjestad', 'state', true FROM "countries" WHERE "iso2" = 'AW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kurunegala', 'state', true FROM "countries" WHERE "iso2" = 'LK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boulkiemde', 'state', true FROM "countries" WHERE "iso2" = 'BF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Faranah', 'state', true FROM "countries" WHERE "iso2" = 'GN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leitrim', 'state', true FROM "countries" WHERE "iso2" = 'IE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anykščiai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Neno', 'state', true FROM "countries" WHERE "iso2" = 'MW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint George Basseterre', 'state', true FROM "countries" WHERE "iso2" = 'KN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kasanda', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bugweri', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kapelebyong', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalaki', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kwania', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nabilatuk', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Karenga', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madi-Okollo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Obongi', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hoima', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kikuube', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kazo', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kitagwenda', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rwampara', 'state', true FROM "countries" WHERE "iso2" = 'UG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Providenciales', 'state', true FROM "countries" WHERE "iso2" = 'TC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Caicos', 'state', true FROM "countries" WHERE "iso2" = 'TC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Middle Caicos', 'state', true FROM "countries" WHERE "iso2" = 'TC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Caicos', 'state', true FROM "countries" WHERE "iso2" = 'TC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grand Turk', 'state', true FROM "countries" WHERE "iso2" = 'TC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Salt Cay', 'state', true FROM "countries" WHERE "iso2" = 'TC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Austral Islands', 'state', true FROM "countries" WHERE "iso2" = 'PF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leeward Islands', 'state', true FROM "countries" WHERE "iso2" = 'PF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Marquesas Islands', 'state', true FROM "countries" WHERE "iso2" = 'PF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tuamotu-Gambier', 'state', true FROM "countries" WHERE "iso2" = 'PF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Windward Islands', 'state', true FROM "countries" WHERE "iso2" = 'PF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Western', 'state', true FROM "countries" WHERE "iso2" = 'AS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eastern', 'state', true FROM "countries" WHERE "iso2" = 'AS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manuʻa', 'state', true FROM "countries" WHERE "iso2" = 'AS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Swains', 'state', true FROM "countries" WHERE "iso2" = 'AS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rose', 'state', true FROM "countries" WHERE "iso2" = 'AS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Avannaata', 'state', true FROM "countries" WHERE "iso2" = 'GL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kujalleq', 'state', true FROM "countries" WHERE "iso2" = 'GL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qeqertalik', 'state', true FROM "countries" WHERE "iso2" = 'GL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Qeqqata', 'state', true FROM "countries" WHERE "iso2" = 'GL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sermersooq', 'state', true FROM "countries" WHERE "iso2" = 'GL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Basse-Terre', 'state', true FROM "countries" WHERE "iso2" = 'GP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pointe-à-Pitre', 'state', true FROM "countries" WHERE "iso2" = 'GP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Castel', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Forest', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Andrew', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alderney', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Martin', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Peter Port', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sark', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Pierre du Bois', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Sampson', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'St Saviour', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Torteval', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vale', 'state', true FROM "countries" WHERE "iso2" = 'GG'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fort-de-France', 'state', true FROM "countries" WHERE "iso2" = 'MQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Trinité', 'state', true FROM "countries" WHERE "iso2" = 'MQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Le Marin', 'state', true FROM "countries" WHERE "iso2" = 'MQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint-Pierre', 'state', true FROM "countries" WHERE "iso2" = 'MQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dzaoudzi', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pamandzi', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mamoudzou', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dembeni', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bandrélé', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kani Keli', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Boueni', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chirongui', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sada', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ouangani', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiconi', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tsingoni', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Acoua', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mtsamboro', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bandraboua', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Koungou', 'state', true FROM "countries" WHERE "iso2" = 'YT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Peter', 'state', true FROM "countries" WHERE "iso2" = 'MS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Georges', 'state', true FROM "countries" WHERE "iso2" = 'MS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint Anthony', 'state', true FROM "countries" WHERE "iso2" = 'MS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Makefu', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tuapa', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namukulu', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hikutavake', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Toi', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mutalau', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lakepa', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Liku', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hakupu', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vaiea', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Avatele', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tamakautoga', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alofi South', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alofi North', 'state', true FROM "countries" WHERE "iso2" = 'NU'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint-Benoît', 'state', true FROM "countries" WHERE "iso2" = 'RE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint-Denis', 'state', true FROM "countries" WHERE "iso2" = 'RE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint-Paul', 'state', true FROM "countries" WHERE "iso2" = 'RE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint-Pierre', 'state', true FROM "countries" WHERE "iso2" = 'RE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alarm Forest', 'state', true FROM "countries" WHERE "iso2" = 'SH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Blue Hill', 'state', true FROM "countries" WHERE "iso2" = 'SH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Half Tree Hollow', 'state', true FROM "countries" WHERE "iso2" = 'SH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jamestown', 'state', true FROM "countries" WHERE "iso2" = 'SH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Levelwood', 'state', true FROM "countries" WHERE "iso2" = 'SH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Longwood', 'state', true FROM "countries" WHERE "iso2" = 'SH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sandy Bay', 'state', true FROM "countries" WHERE "iso2" = 'SH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Akershus', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Buskerud', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Østfold', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Troms', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vestfold', 'state', true FROM "countries" WHERE "iso2" = 'NO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ulaanbaatar', 'state', true FROM "countries" WHERE "iso2" = 'MN'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shymkent', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Abai', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jetisu', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ulytau', 'state', true FROM "countries" WHERE "iso2" = 'KZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Isle of Anglesey', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bournemouth, Christchurch and Poole', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luton', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Northamptonshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'West Northamptonshire', 'state', true FROM "countries" WHERE "iso2" = 'GB'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thessaly', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Aegean', 'state', true FROM "countries" WHERE "iso2" = 'GR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sidama', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Southwest Ethiopia Peoples', 'state', true FROM "countries" WHERE "iso2" = 'ET'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wardak', 'state', true FROM "countries" WHERE "iso2" = 'AF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namibe', 'state', true FROM "countries" WHERE "iso2" = 'AO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naftalan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nakhchivan', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khankendi', 'state', true FROM "countries" WHERE "iso2" = 'AZ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bagerhat', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bandarban', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barguna', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Barishal', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bhola', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bogura', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Brahmanbaria', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chandpur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chapai Nawabganj', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chattogram', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chuadanga', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cumilla', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dhaka', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dinajpur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Faridpur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Feni', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gaibandha', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gazipur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gopalganj', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Habiganj', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jamalpur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jashore', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jhalakathi', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jhenaidah', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Joypurhat', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khagrachhari', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Khulna', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kishoreganj', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kurigram', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kushtia', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lakshmipur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lalmonirhat', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Madaripur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Magura', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Manikganj', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Meherpur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moulvibazar', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Munshiganj', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mymensingh', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naogaon', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Narail', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Narayanganj', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Narsingdi', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Natore', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Netrakona', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nilphamari', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Noakhali', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pabna', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Panchagarh', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Patuakhali', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pirojpur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rajbari', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rajshahi', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rangamati', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rangpur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Satkhira', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Shariatpur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sherpur', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sirajganj', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sunamganj', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sylhet', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tangail', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Thakurgaon', 'state', true FROM "countries" WHERE "iso2" = 'BD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tboung Khmum', 'state', true FROM "countries" WHERE "iso2" = 'KH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nouvelle-Calédonie', 'state', true FROM "countries" WHERE "iso2" = 'FR'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Elías Piña', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cibao Nordeste', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cibao Noroeste', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cibao Norte', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cibao Sur', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'El Valle', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Enriquillo', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Higuamo', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ozama', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valdesia', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Yuma', 'state', true FROM "countries" WHERE "iso2" = 'DO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Oecusse', 'state', true FROM "countries" WHERE "iso2" = 'TL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Djibloho', 'state', true FROM "countries" WHERE "iso2" = 'GQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'São Salvador do Mundo', 'state', true FROM "countries" WHERE "iso2" = 'CV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bissau', 'state', true FROM "countries" WHERE "iso2" = 'GW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Akranes', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Akureyri', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Árneshreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ásahreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bláskógabyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Borgarbyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bolungarvík', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dalabyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dalvíkurbyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eyja- og Miklaholtshreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Eyjafjarðarsveit', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fjarðabyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fjallabyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Flóahreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fljótsdalshreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Garðabær', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grímsnes- og Grafningshreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grindavík', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grundarfjörður', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Grýtubakkahreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hafnarfjörður', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hörðarsveit', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hrunamannahreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Húnabyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Húnaþing vestra', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hvalfjarðarsveit', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hveragerði', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ísafjörður', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaldrananeshreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kjósarhreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kópavogur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Langanesbyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mosfellsbær', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Múlaþing', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mýrdalshreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Norðurþing', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rangárþing eystra', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rangárþing ytra', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Reykhólahreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Reykjanesbær', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Reykjavík', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Svalbardsstrandarhreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Suðurnesjabær', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Súðavík', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Seltjarnarnes', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Árborg', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hornafjörður', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Skaftárhreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Skagabyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Skorradalshreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Skagafjörður', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Snæfellsbær', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Skeiða- og Gnúpverjahreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ölfus', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Skagaströnd', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Strandabyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Stykkishólmur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vogar', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tálknafjarðarhreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Þingeyjarsveit', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tjörneshreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vestmannaeyjar', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vesturbyggð', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vopnafjarðarhreppur', 'state', true FROM "countries" WHERE "iso2" = 'IS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jawa', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kalimantan', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maluku', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nusa Tenggara', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Papua', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sulawesi', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sumatera', 'state', true FROM "countries" WHERE "iso2" = 'ID'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Iqlim Kurdistan', 'state', true FROM "countries" WHERE "iso2" = 'IQ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bari', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bologna', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cagliari', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Catania', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Florence', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Genoa', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Messina', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Milan', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naples', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Reggio Calabria', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rome', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Turin', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Venice', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'South Tyrol', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Trentino', 'state', true FROM "countries" WHERE "iso2" = 'IT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Al Butnan', 'state', true FROM "countries" WHERE "iso2" = 'LY'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Safi', 'state', true FROM "countries" WHERE "iso2" = 'MT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ailinglaplap', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ailuk', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Arno', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Aur', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Bikini & Kili', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ebon', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Enewetak & Ujelang', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jabat', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jaluit', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kwajalein', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lae', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lib', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Likiep', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Majuro', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maloelap', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mejit', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mili', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namdrik', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Namu', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rongelap', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ujae', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Utrik', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wotho', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Wotje', 'state', true FROM "countries" WHERE "iso2" = 'MH'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Leova', 'state', true FROM "countries" WHERE "iso2" = 'MD'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Fontvieille', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jardin Exotique', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Gare', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Source', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Larvotto', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Malbousquet', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monaco-Ville', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Monte-Carlo', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Moulins', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Port-Hercule', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saint-Roman', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sainte-Dévote', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Spélugues', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vallon de la Rousse', 'state', true FROM "countries" WHERE "iso2" = 'MC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Herceg-Novi', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tuzi', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Zeta', 'state', true FROM "countries" WHERE "iso2" = 'ME'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Niamey', 'state', true FROM "countries" WHERE "iso2" = 'NE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Naso Tjër Di', 'state', true FROM "countries" WHERE "iso2" = 'PA'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Municipalidad Metropolitana de Lima', 'state', true FROM "countries" WHERE "iso2" = 'PE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kosovo-Metohija', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kosovo', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Peć', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Prizren', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kosovska Mitrovica', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kosovo-Pomoravlje', 'state', true FROM "countries" WHERE "iso2" = 'RS'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anse Etoile', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ile Perseverance I', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ile Perseverance II', 'state', true FROM "countries" WHERE "iso2" = 'SC'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'North Western', 'state', true FROM "countries" WHERE "iso2" = 'SL'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Velenje', 'state', true FROM "countries" WHERE "iso2" = 'SI'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sool', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Woqooyi Galbeed', 'state', true FROM "countries" WHERE "iso2" = 'SO'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Asturias, Principality of', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cantabria', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'La Rioja', 'state', true FROM "countries" WHERE "iso2" = 'ES'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chiayi County', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hsinchu County', 'state', true FROM "countries" WHERE "iso2" = 'TW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Dushanbe', 'state', true FROM "countries" WHERE "iso2" = 'TJ'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Uvea', 'state', true FROM "countries" WHERE "iso2" = 'WF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sigave', 'state', true FROM "countries" WHERE "iso2" = 'WF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alo', 'state', true FROM "countries" WHERE "iso2" = 'WF'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Chobe', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Francistown', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Gaborone', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jwaneng', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lobatse', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Selibe Phikwe', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sowa Town', 'state', true FROM "countries" WHERE "iso2" = 'BW'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Nampho', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaesong', 'state', true FROM "countries" WHERE "iso2" = 'KP'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Klaipėdos miestas', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Panevėžio miestas', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alytus', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kaunas', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Šiauliai', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vilnius', 'state', true FROM "countries" WHERE "iso2" = 'LT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Debar', 'state', true FROM "countries" WHERE "iso2" = 'MK'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Baa', 'state', true FROM "countries" WHERE "iso2" = 'MV'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Água Grande', 'state', true FROM "countries" WHERE "iso2" = 'ST'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Cantagalo', 'state', true FROM "countries" WHERE "iso2" = 'ST'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Caué', 'state', true FROM "countries" WHERE "iso2" = 'ST'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lemba', 'state', true FROM "countries" WHERE "iso2" = 'ST'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lobata', 'state', true FROM "countries" WHERE "iso2" = 'ST'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mé-Zóchi', 'state', true FROM "countries" WHERE "iso2" = 'ST'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Príncipe', 'state', true FROM "countries" WHERE "iso2" = 'ST'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tobago', 'state', true FROM "countries" WHERE "iso2" = 'TT'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Alutaguse', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Anija', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Antsla', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Elva', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haljala', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Harku', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Hiiumaa', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Häädemeeste', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Joelähtme', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jõgeva', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Jõhvi', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Järva', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kadrina', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kambja', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kanepi', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kastre', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kehtna', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kihnu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kiili', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kohila', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kose', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kuusalu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lääne-Harju', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lääneranna', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Luunja', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lääne-Nigula', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Lüganuse', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Muhu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mulgi', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Mustvee', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Märjamaa', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Noo', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Otepää', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Peipsiääre', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Põhja-Sakala', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Poltsamaa', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Põlva', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Põhja-Pärnu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Raasiku', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rae', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rakvere', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rapla', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Ruhnu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rõuge', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Räpina', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saarde', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saaremaa', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saku', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Saue', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Setomaa', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tapa', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tartu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Toila', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tori', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tõrva', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Türi', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Valga', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Viimsi', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Viljandi', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vinni', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Viru-Nigula', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Vormsi', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Võru', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Väike-Maarja', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Haapsalu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Keila', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Kohtla-Järve', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Loksa', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Maardu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Narva', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Narva-Jõesuu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Paide', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Pärnu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Rakvere', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Sillamäe', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tallinn', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Tartu', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Viljandi', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
INSERT INTO "country_subdivision" ("country_id", "name", "type", "is_active")
SELECT id, 'Võru', 'state', true FROM "countries" WHERE "iso2" = 'EE'
ON CONFLICT DO NOTHING;
-- 3. India Districts (Comprehensive)
DO $$
DECLARE 
    country_uuid UUID;
    state_uuid UUID;
BEGIN
    SELECT id INTO country_uuid FROM countries WHERE iso2 = 'IN';
    
    -- ANDHRA PRADESH
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Andhra Pradesh' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- KARNATAKA
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Karnataka' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburgi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- KERALA
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Kerala' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- MAHARASHTRA
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Maharashtra' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- TAMIL NADU
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Tamil Nadu' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- TELANGANA
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Telangana' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Warangal Urban', 'Yadadri Bhuvanagiri'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

    -- DELHI
    SELECT id INTO state_uuid FROM country_subdivision WHERE name = 'Delhi' AND country_id = country_uuid;
    IF state_uuid IS NOT NULL THEN
        INSERT INTO country_subdivision (country_id, parent_id, name, type, is_active)
        SELECT country_uuid, state_uuid, d, 'district', true
        FROM unnest(ARRAY[
            'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
        ]) as d
        WHERE NOT EXISTS (SELECT 1 FROM country_subdivision WHERE name = d AND parent_id = state_uuid);
    END IF;

END $$;
