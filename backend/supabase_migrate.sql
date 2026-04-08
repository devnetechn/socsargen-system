-- ===========================================
-- SUPABASE DATA MIGRATION
-- Run this in Supabase SQL Editor
-- ===========================================

-- Step 1: Clean up existing news (remove seed data)
DELETE FROM news;

-- Step 2: Clean up duplicate awards
DELETE FROM patient_awards;

-- Step 3: Get admin user ID for news author
-- Insert news with admin as author
INSERT INTO news (title, slug, content, excerpt, image_url, video_url, is_published, published_at, author_id, created_at, updated_at)
SELECT
  n.title, n.slug, n.content, n.excerpt, n.image_url, n.video_url, n.is_published, n.published_at,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  n.created_at, n.updated_at
FROM (VALUES
  ('Socsargen Hospital Launches Telemedicine Services for Remote Communities',
   'socsargen-hospital-launches-telemedicine-services',
   'In a groundbreaking move to improve healthcare access in the SOCSARGEN region, Socsargen County Hospital has officially launched its telemedicine platform. The service allows patients from remote barangays in South Cotabato, Sultan Kudarat, Sarangani, and General Santos City to consult with specialists without the need to travel long distances. The platform features video consultations, digital prescriptions, and follow-up scheduling. This initiative is part of the hospital''s commitment to bringing quality healthcare closer to every Filipino family in the region.',
   'Socsargen County Hospital officially launches its telemedicine platform, bringing specialist consultations to remote communities across the SOCSARGEN region.',
   '/uploads/news-1771565745308-922881.jpg', NULL, true,
   '2026-02-20 12:50:06.842979'::timestamp, '2026-02-20 12:50:06.842979'::timestamp, '2026-02-20 12:50:06.842979'::timestamp),

  ('Hospital Tour: Inside Our World-Class Facilities',
   'hospital-tour-inside-our-world-class-facilities',
   'Take a virtual tour of our newly upgraded facilities featuring state-of-the-art operating rooms and modern diagnostic equipment.',
   'Take a virtual tour of our newly upgraded facilities featuring state-of-the-art operating rooms and modern diagnostic equipment.',
   '/uploads/news-1771565747466-939500.jpg', '/uploads/1772412814556-600402309.mp4', true,
   '2026-02-19 12:50:06.851'::timestamp, '2026-02-20 12:50:06.851086'::timestamp, '2026-03-02 08:53:34.881849'::timestamp),

  ('Free Medical Mission Serves Over 500 Residents in Sarangani',
   'free-medical-mission-serves-over-500-residents-sarangani',
   'Socsargen County Hospital, in partnership with the Provincial Government of Sarangani, successfully conducted a free medical mission in Barangay Mabila, Malapatan. Over 500 residents received free consultations, medicines, and laboratory tests. Services included general check-ups, dental extractions, eye screenings, and minor surgical procedures. The medical team comprised 15 doctors, 20 nurses, and 30 volunteer health workers who worked tirelessly from dawn to dusk.',
   'Over 500 residents received free consultations, medicines, and laboratory tests during our medical mission in Sarangani Province.',
   '/uploads/news-1771565749918-695714.jpg', NULL, true,
   '2026-02-18 12:50:06.855018'::timestamp, '2026-02-20 12:50:06.855018'::timestamp, '2026-02-20 12:50:06.855018'::timestamp),

  ('Welcome to Socsargen Hospital Online Services',
   'welcome-to-socsargen-hospital-online-services',
   'We are excited to announce the launch of our new online appointment booking system.',
   'We are excited to announce the launch of our new online appointment booking system.',
   '/uploads/1771561457590-63668557.jpg', NULL, true,
   '2026-02-17 08:51:45.234'::timestamp, '2026-02-17 08:51:45.234906'::timestamp, '2026-02-20 12:24:17.617337'::timestamp),

  ('Socsargen Hospital Receives DOH Level 3 Re-accreditation',
   'socsargen-hospital-receives-doh-level-3-re-accreditation',
   'The Department of Health has officially re-accredited Socsargen County Hospital as a Level 3 medical facility, the highest classification for government hospitals in the Philippines. This accreditation recognizes the hospital''s capability to provide tertiary-level healthcare services including complex surgeries, advanced diagnostics, and specialized medical treatments. The evaluation team commended the hospital for its significant improvements in patient care protocols, staff training programs, and facility upgrades over the past three years.',
   'DOH re-accredits Socsargen County Hospital as a Level 3 facility, recognizing our capability for tertiary-level healthcare services.',
   '/uploads/news-1771565750263-69460.jpg', NULL, true,
   '2026-02-16 12:50:06.85852'::timestamp, '2026-02-20 12:50:06.85852'::timestamp, '2026-02-20 12:50:06.85852'::timestamp),

  ('COVID-19 Safety Protocols Update',
   'covid-19-safety-protocols-update',
   'Socsargen Hospital continues to implement strict COVID-19 safety protocols.',
   'Socsargen Hospital continues to implement strict COVID-19 safety protocols.',
   '/uploads/1771561469459-23872574.jpg', NULL, true,
   '2026-02-16 08:51:45.234'::timestamp, '2026-02-17 08:51:45.234906'::timestamp, '2026-02-20 12:24:29.484257'::timestamp),

  ('New MRI Machine Now Operational at Socsargen Hospital',
   'new-mri-machine-now-operational',
   'Socsargen County Hospital is proud to announce that our brand-new 1.5 Tesla MRI machine is now fully operational. This state-of-the-art imaging equipment provides superior image quality for diagnosing conditions affecting the brain, spine, joints, and soft tissues. Previously, patients in the SOCSARGEN area had to travel to Davao or Cebu for MRI scans. Now, they can access this critical diagnostic service right here in General Santos City, reducing wait times and travel costs significantly.',
   'Our brand-new 1.5 Tesla MRI machine is now fully operational, eliminating the need for patients to travel to other cities for MRI scans.',
   '/uploads/news-1771565750615-564563.jpg', NULL, true,
   '2026-02-14 12:50:06.861751'::timestamp, '2026-02-20 12:50:06.861751'::timestamp, '2026-02-20 12:50:06.861751'::timestamp),

  ('New Pediatric Wing Now Open',
   'new-pediatric-wing-now-open',
   'We are proud to announce the opening of our new Pediatric Wing, designed specifically with children in mind. The wing features child-friendly decor, a dedicated play area, and specialized equipment for pediatric care. Our team of pediatric specialists is ready to provide the best care for your little ones in a comfortable and welcoming environment.',
   'We are proud to announce the opening of our new Pediatric Wing.',
   '/uploads/news-1771571993361-844812.jpg', NULL, true,
   '2026-02-14 08:51:45.234906'::timestamp, '2026-02-17 08:51:45.234906'::timestamp, '2026-02-17 08:51:45.234906'::timestamp),

  ('Blood Donation Drive Collects 200 Units in One Day',
   'blood-donation-drive-collects-200-units',
   'The hospital''s annual blood donation drive proved to be a massive success, collecting over 200 units of blood in a single day. Volunteers from local government units, private companies, schools, and civic organizations participated in the event held at the hospital''s multi-purpose hall. The collected blood will help replenish the hospital''s blood bank and ensure adequate supply for emergency surgeries, accident victims, and patients undergoing chemotherapy. The Philippine Red Cross South Cotabato Chapter assisted in the blood screening and collection process.',
   'Our annual blood donation drive collected over 200 units in a single day, with volunteers from across the SOCSARGEN region.',
   '/uploads/news-1771565750970-934660.jpg', NULL, true,
   '2026-02-12 12:50:06.866023'::timestamp, '2026-02-20 12:50:06.866023'::timestamp, '2026-02-20 12:50:06.866023'::timestamp),

  ('Hospital Partners with GenSan LGU for Mental Health Program',
   'hospital-partners-with-gensan-lgu-mental-health-program',
   'Socsargen County Hospital has signed a memorandum of agreement with the General Santos City local government unit to establish a comprehensive community mental health program. The partnership aims to provide accessible mental health services including counseling, psychiatric consultations, and community outreach programs. Training will also be provided to barangay health workers on mental health first aid and early detection of mental health conditions. This initiative responds to the growing need for mental health services in the region.',
   'A new partnership with GenSan LGU establishes a comprehensive community mental health program with accessible counseling and outreach.',
   '/uploads/news-1771565751322-712034.jpg', NULL, true,
   '2026-02-10 12:50:06.869503'::timestamp, '2026-02-20 12:50:06.869503'::timestamp, '2026-02-20 12:50:06.869503'::timestamp),

  ('20 Nurses Complete Advanced Cardiac Life Support Training',
   '20-nurses-complete-advanced-cardiac-life-support-training',
   'Twenty nurses from Socsargen County Hospital have successfully completed the Advanced Cardiac Life Support (ACLS) certification program. The intensive five-day training, conducted in partnership with the Philippine Heart Association, covered emergency cardiac care protocols including rhythm recognition, pharmacology, and team-based resuscitation techniques. These newly certified ACLS providers will strengthen the hospital''s emergency response capability and improve survival rates for cardiac arrest patients.',
   '20 nurses earn ACLS certification through an intensive training program in partnership with the Philippine Heart Association.',
   '/uploads/news-1771565751676-406968.jpg', NULL, true,
   '2026-02-08 12:50:06.872236'::timestamp, '2026-02-20 12:50:06.872236'::timestamp, '2026-02-20 12:50:06.872236'::timestamp),

  ('Socsargen Hospital Opens 24/7 Pharmacy for Public Access',
   'socsargen-hospital-opens-24-7-pharmacy',
   'To better serve the community, Socsargen County Hospital has opened a 24/7 pharmacy accessible to both in-patients and walk-in customers. The pharmacy stocks a comprehensive range of medicines, including generic alternatives approved by the FDA Philippines. Special attention has been given to ensuring the availability of essential medicines for chronic conditions such as diabetes, hypertension, and asthma. Senior citizens and PWDs will continue to enjoy their mandated discounts on all medicine purchases.',
   'Our new 24/7 pharmacy is now open to both patients and the public, stocking essential medicines with senior citizen and PWD discounts.',
   '/uploads/news-1771565752030-673190.jpg', NULL, true,
   '2026-02-05 12:50:06.875157'::timestamp, '2026-02-20 12:50:06.875157'::timestamp, '2026-02-20 12:50:06.875157'::timestamp),

  ('Doctors from Japan Visit for Knowledge Exchange Program',
   'doctors-from-japan-visit-for-knowledge-exchange',
   'A delegation of five specialist doctors from Osaka University Hospital in Japan visited Socsargen County Hospital as part of an international medical knowledge exchange program. The visiting doctors conducted workshops on minimally invasive surgical techniques, shared best practices in patient safety, and demonstrated advanced laparoscopic procedures. In return, our medical team shared insights on tropical disease management and community health programs. This partnership opens doors for future collaborations including telemedicine consultations and staff exchange programs.',
   'Japanese specialist doctors from Osaka University Hospital visit for workshops on minimally invasive surgery and patient safety.',
   '/uploads/news-1771565752370-428207.jpg', NULL, true,
   '2026-02-02 12:50:06.878575'::timestamp, '2026-02-20 12:50:06.878575'::timestamp, '2026-02-20 12:50:06.878575'::timestamp),

  ('Hospital Installs Solar Panels to Go Green',
   'hospital-installs-solar-panels-to-go-green',
   'As part of its sustainability initiative, Socsargen County Hospital has completed the installation of 500 solar panels on the rooftop of its main building. The solar power system is expected to generate up to 30% of the hospital''s daily electricity consumption, significantly reducing both operational costs and carbon footprint. The project, funded through a DOH green hospital grant, positions Socsargen County Hospital as one of the first government hospitals in Mindanao to adopt solar energy on this scale.',
   '500 solar panels now power up to 30% of the hospital''s electricity, making us one of the first green government hospitals in Mindanao.',
   '/uploads/news-1771565752722-360480.jpg', NULL, true,
   '2026-01-29 12:50:06.881456'::timestamp, '2026-02-20 12:50:06.881456'::timestamp, '2026-02-20 12:50:06.881456'::timestamp),

  ('Emergency Department Renovation Complete with Expanded Capacity',
   'emergency-department-renovation-complete',
   'The newly renovated Emergency Department of Socsargen County Hospital is now fully operational with expanded capacity. The renovation doubled the number of treatment bays from 10 to 20, added a dedicated trauma room, and introduced a modern triage system with color-coded zones. New features include a separate pediatric emergency area, an isolation room for infectious cases, and upgraded monitoring equipment in each bay. The renovation was completed in just six months, ahead of the original schedule.',
   'Our renovated Emergency Department features doubled capacity with 20 treatment bays, a trauma room, and modern triage system.',
   '/uploads/news-1771565753124-8557.jpg', NULL, true,
   '2026-01-26 12:50:06.884754'::timestamp, '2026-02-20 12:50:06.884754'::timestamp, '2026-02-20 12:50:06.884754'::timestamp),

  ('KAHIMSOG',
   'kahimsog-1768981392420',
   '"Leading with innovation, Serving with compassion"...',
   '"Leading with innovation, Serving with compassion"...',
   '/uploads/1771561494041-53178204.jpg', NULL, true,
   '2026-01-21 15:43:12.42'::timestamp, '2026-01-21 15:43:12.420546'::timestamp, '2026-02-20 12:24:54.06413'::timestamp),

  ('It''s Safari Time!',
   'it-s-safari-time-1768981335726',
   'The wildest and most epic expedition SCH has faced this year—a party like no other.
Watch this same-day edit video and relive the adventure in a daring night to remember, filled with roaring energy, t...',
   'The wildest and most epic expedition SCH has faced this year—a party like no other.
Watch this same-day edit video and relive the adventure in a daring night to remember, filled with roaring energy, t...',
   '/uploads/1771561508679-911168800.png', '/uploads/1771561621721-570036478.mp4', true,
   '2026-01-21 15:42:15.726'::timestamp, '2026-01-21 15:42:15.726574'::timestamp, '2026-02-20 12:27:01.971069'::timestamp),

  ('This Christmas season, we celebrate not only the joy of the holidays but the people who make Socsargen County Hospital a place of compassion, service, and hope.',
   'this-christmas-season-we-celebrate-not-only-the-joy-of-the-holidays-but-the-people-who-make-socsargen-county-hospital-a-place-of-compassion-service-and-hope-1768981269229',
   'May this season remind us of the value of gratitude, unity, and care—both for one another and for the communities we serve.',
   'May this season remind us of the value of gratitude, unity, and care—both for one another and for the communities we serve.',
   '/uploads/1771561524815-463846036.jpg', NULL, true,
   '2026-01-21 15:41:31.625'::timestamp, '2026-01-21 15:41:09.229715'::timestamp, '2026-02-20 12:25:24.838307'::timestamp),

  ('We''re ISO 9001:2015 Certified!',
   'we-re-iso-9001-2015-certified-1768981106415',
   'This milestone is a testament to the dedication, professionalism, and teamwork of our entire workforce, who consistently uphold the highest standards of care and service.',
   'This milestone is a testament to the dedication, professionalism, and teamwork of our entire workforce, who consistently uphold the highest standards of care and service.',
   '/uploads/1771561536297-412722822.jpg', NULL, true,
   '2026-01-21 15:38:26.415'::timestamp, '2026-01-21 15:38:26.416209'::timestamp, '2026-02-20 12:25:36.312627'::timestamp),

  ('PhilHealth Coverage Expansion: What You Need to Know',
   'philhealth-coverage-expansion-what-you-need-to-know',
   'Socsargen County Hospital is pleased to inform the public about the expanded PhilHealth coverage now available at our facility. Under the Universal Health Care Act, all Filipinos are automatically enrolled in PhilHealth and entitled to a comprehensive benefits package. Our hospital now covers a wider range of procedures under PhilHealth, including dialysis, chemotherapy, cataract surgery, and selected orthopedic procedures. Patients are encouraged to bring their PhilHealth ID or any valid government ID when visiting the hospital to avail of these benefits.',
   'Learn about expanded PhilHealth coverage now available at our hospital, including dialysis, chemotherapy, and cataract surgery.',
   '/uploads/news-1771565753526-656461.jpg', NULL, true,
   '2026-01-21 12:50:06.889201'::timestamp, '2026-02-20 12:50:06.889201'::timestamp, '2026-02-20 12:50:06.889201'::timestamp)

) AS n(title, slug, content, excerpt, image_url, video_url, is_published, published_at, created_at, updated_at)
ON CONFLICT (slug) DO NOTHING;

-- Step 4: Insert clean awards (no duplicates)
INSERT INTO patient_awards (title, recipient, description, votes, color_theme, display_order, award_month, is_active) VALUES
('Most Compassionate Care', 'Department of Pediatrics', 'Recognized by patients for providing the most compassionate and attentive care to children and their families.', 1248, 'rose', 1, '2026-03-01', true),
('Excellence in Service', 'Department of Internal Medicine', 'Voted by patients as the department delivering outstanding medical service with professionalism and dedication.', 1105, 'amber', 2, '2026-03-01', true),
('Best Patient Experience', 'Department of OB-GYN', 'Honored for creating the best overall patient experience — from warm reception to expert care.', 987, 'emerald', 3, '2026-03-01', true);

SELECT 'Migration complete! News: ' || (SELECT count(*) FROM news) || ' rows, Awards: ' || (SELECT count(*) FROM patient_awards) || ' rows' as status;
