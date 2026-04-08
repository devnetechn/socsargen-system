require('dotenv').config();
const pool = require('./src/config/database');

const sampleNews = [
  {
    title: 'Socsargen Hospital Launches Telemedicine Services for Remote Communities',
    slug: 'socsargen-hospital-launches-telemedicine-services',
    content: 'In a groundbreaking move to improve healthcare access in the SOCSARGEN region, Socsargen County Hospital has officially launched its telemedicine platform. The service allows patients from remote barangays in South Cotabato, Sultan Kudarat, Sarangani, and General Santos City to consult with specialists without the need to travel long distances. The platform features video consultations, digital prescriptions, and follow-up scheduling. This initiative is part of the hospital\'s commitment to bringing quality healthcare closer to every Filipino family in the region.',
    excerpt: 'Socsargen County Hospital officially launches its telemedicine platform, bringing specialist consultations to remote communities across the SOCSARGEN region.',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 0
  },
  {
    title: 'Hospital Tour: Inside Our World-Class Facilities',
    slug: 'hospital-tour-inside-our-world-class-facilities',
    content: 'Take a virtual tour of Socsargen County Hospital and see our newly upgraded facilities. From the state-of-the-art operating rooms to our comfortable patient wards, every area has been designed with patient comfort and safety in mind. Our hospital features modern diagnostic equipment including MRI, CT Scan, and digital X-ray machines. The tour also showcases our newly renovated emergency department, which can now accommodate more patients with faster triage times.',
    excerpt: 'Take a virtual tour of our newly upgraded facilities featuring state-of-the-art operating rooms and modern diagnostic equipment.',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    days_ago: 1
  },
  {
    title: 'Free Medical Mission Serves Over 500 Residents in Sarangani',
    slug: 'free-medical-mission-serves-over-500-residents-sarangani',
    content: 'Socsargen County Hospital, in partnership with the Provincial Government of Sarangani, successfully conducted a free medical mission in Barangay Mabila, Malapatan. Over 500 residents received free consultations, medicines, and laboratory tests. Services included general check-ups, dental extractions, eye screenings, and minor surgical procedures. The medical team comprised 15 doctors, 20 nurses, and 30 volunteer health workers who worked tirelessly from dawn to dusk.',
    excerpt: 'Over 500 residents received free consultations, medicines, and laboratory tests during our medical mission in Sarangani Province.',
    image_url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 2
  },
  {
    title: 'Socsargen Hospital Receives DOH Level 3 Re-accreditation',
    slug: 'socsargen-hospital-receives-doh-level-3-re-accreditation',
    content: 'The Department of Health has officially re-accredited Socsargen County Hospital as a Level 3 medical facility, the highest classification for government hospitals in the Philippines. This accreditation recognizes the hospital\'s capability to provide tertiary-level healthcare services including complex surgeries, advanced diagnostics, and specialized medical treatments. The evaluation team commended the hospital for its significant improvements in patient care protocols, staff training programs, and facility upgrades over the past three years.',
    excerpt: 'DOH re-accredits Socsargen County Hospital as a Level 3 facility, recognizing our capability for tertiary-level healthcare services.',
    image_url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 4
  },
  {
    title: 'New MRI Machine Now Operational at Socsargen Hospital',
    slug: 'new-mri-machine-now-operational',
    content: 'Socsargen County Hospital is proud to announce that our brand-new 1.5 Tesla MRI machine is now fully operational. This state-of-the-art imaging equipment provides superior image quality for diagnosing conditions affecting the brain, spine, joints, and soft tissues. Previously, patients in the SOCSARGEN area had to travel to Davao or Cebu for MRI scans. Now, they can access this critical diagnostic service right here in General Santos City, reducing wait times and travel costs significantly.',
    excerpt: 'Our brand-new 1.5 Tesla MRI machine is now fully operational, eliminating the need for patients to travel to other cities for MRI scans.',
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 6
  },
  {
    title: 'Blood Donation Drive Collects 200 Units in One Day',
    slug: 'blood-donation-drive-collects-200-units',
    content: 'The hospital\'s annual blood donation drive proved to be a massive success, collecting over 200 units of blood in a single day. Volunteers from local government units, private companies, schools, and civic organizations participated in the event held at the hospital\'s multi-purpose hall. The collected blood will help replenish the hospital\'s blood bank and ensure adequate supply for emergency surgeries, accident victims, and patients undergoing chemotherapy. The Philippine Red Cross South Cotabato Chapter assisted in the blood screening and collection process.',
    excerpt: 'Our annual blood donation drive collected over 200 units in a single day, with volunteers from across the SOCSARGEN region.',
    image_url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 8
  },
  {
    title: 'Hospital Partners with GenSan LGU for Mental Health Program',
    slug: 'hospital-partners-with-gensan-lgu-mental-health-program',
    content: 'Socsargen County Hospital has signed a memorandum of agreement with the General Santos City local government unit to establish a comprehensive community mental health program. The partnership aims to provide accessible mental health services including counseling, psychiatric consultations, and community outreach programs. Training will also be provided to barangay health workers on mental health first aid and early detection of mental health conditions. This initiative responds to the growing need for mental health services in the region.',
    excerpt: 'A new partnership with GenSan LGU establishes a comprehensive community mental health program with accessible counseling and outreach.',
    image_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 10
  },
  {
    title: '20 Nurses Complete Advanced Cardiac Life Support Training',
    slug: '20-nurses-complete-advanced-cardiac-life-support-training',
    content: 'Twenty nurses from Socsargen County Hospital have successfully completed the Advanced Cardiac Life Support (ACLS) certification program. The intensive five-day training, conducted in partnership with the Philippine Heart Association, covered emergency cardiac care protocols including rhythm recognition, pharmacology, and team-based resuscitation techniques. These newly certified ACLS providers will strengthen the hospital\'s emergency response capability and improve survival rates for cardiac arrest patients.',
    excerpt: '20 nurses earn ACLS certification through an intensive training program in partnership with the Philippine Heart Association.',
    image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 12
  },
  {
    title: 'Socsargen Hospital Opens 24/7 Pharmacy for Public Access',
    slug: 'socsargen-hospital-opens-24-7-pharmacy',
    content: 'To better serve the community, Socsargen County Hospital has opened a 24/7 pharmacy accessible to both in-patients and walk-in customers. The pharmacy stocks a comprehensive range of medicines, including generic alternatives approved by the FDA Philippines. Special attention has been given to ensuring the availability of essential medicines for chronic conditions such as diabetes, hypertension, and asthma. Senior citizens and PWDs will continue to enjoy their mandated discounts on all medicine purchases.',
    excerpt: 'Our new 24/7 pharmacy is now open to both patients and the public, stocking essential medicines with senior citizen and PWD discounts.',
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 15
  },
  {
    title: 'Doctors from Japan Visit for Knowledge Exchange Program',
    slug: 'doctors-from-japan-visit-for-knowledge-exchange',
    content: 'A delegation of five specialist doctors from Osaka University Hospital in Japan visited Socsargen County Hospital as part of an international medical knowledge exchange program. The visiting doctors conducted workshops on minimally invasive surgical techniques, shared best practices in patient safety, and demonstrated advanced laparoscopic procedures. In return, our medical team shared insights on tropical disease management and community health programs. This partnership opens doors for future collaborations including telemedicine consultations and staff exchange programs.',
    excerpt: 'Japanese specialist doctors from Osaka University Hospital visit for workshops on minimally invasive surgery and patient safety.',
    image_url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 18
  },
  {
    title: 'Hospital Installs Solar Panels to Go Green',
    slug: 'hospital-installs-solar-panels-to-go-green',
    content: 'As part of its sustainability initiative, Socsargen County Hospital has completed the installation of 500 solar panels on the rooftop of its main building. The solar power system is expected to generate up to 30% of the hospital\'s daily electricity consumption, significantly reducing both operational costs and carbon footprint. The project, funded through a DOH green hospital grant, positions Socsargen County Hospital as one of the first government hospitals in Mindanao to adopt solar energy on this scale.',
    excerpt: '500 solar panels now power up to 30% of the hospital\'s electricity, making us one of the first green government hospitals in Mindanao.',
    image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 22
  },
  {
    title: 'Emergency Department Renovation Complete with Expanded Capacity',
    slug: 'emergency-department-renovation-complete',
    content: 'The newly renovated Emergency Department of Socsargen County Hospital is now fully operational with expanded capacity. The renovation doubled the number of treatment bays from 10 to 20, added a dedicated trauma room, and introduced a modern triage system with color-coded zones. New features include a separate pediatric emergency area, an isolation room for infectious cases, and upgraded monitoring equipment in each bay. The renovation was completed in just six months, ahead of the original schedule.',
    excerpt: 'Our renovated Emergency Department features doubled capacity with 20 treatment bays, a trauma room, and modern triage system.',
    image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 25
  },
  {
    title: 'PhilHealth Coverage Expansion: What You Need to Know',
    slug: 'philhealth-coverage-expansion-what-you-need-to-know',
    content: 'Socsargen County Hospital is pleased to inform the public about the expanded PhilHealth coverage now available at our facility. Under the Universal Health Care Act, all Filipinos are automatically enrolled in PhilHealth and entitled to a comprehensive benefits package. Our hospital now covers a wider range of procedures under PhilHealth, including dialysis, chemotherapy, cataract surgery, and selected orthopedic procedures. Patients are encouraged to bring their PhilHealth ID or any valid government ID when visiting the hospital to avail of these benefits.',
    excerpt: 'Learn about expanded PhilHealth coverage now available at our hospital, including dialysis, chemotherapy, and cataract surgery.',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop',
    video_url: null,
    days_ago: 30
  }
];

async function seedNews() {
  const client = await pool.connect();
  try {
    // Get admin user id
    const adminResult = await client.query(
      "SELECT id FROM users WHERE email = 'admin@socsargen-hospital.com' LIMIT 1"
    );

    if (adminResult.rows.length === 0) {
      console.error('Admin user not found! Run the main seed first.');
      process.exit(1);
    }

    const authorId = adminResult.rows[0].id;
    let inserted = 0;

    for (const news of sampleNews) {
      const exists = await client.query('SELECT id FROM news WHERE slug = $1', [news.slug]);
      if (exists.rows.length > 0) {
        console.log(`  Skipped (exists): ${news.title}`);
        continue;
      }

      await client.query(
        `INSERT INTO news (title, slug, content, excerpt, image_url, video_url, author_id, is_published, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP - INTERVAL '${news.days_ago} days')`,
        [news.title, news.slug, news.content, news.excerpt, news.image_url, news.video_url, authorId]
      );
      inserted++;
      console.log(`  Added: ${news.title}`);
    }

    console.log(`\nDone! Inserted ${inserted} news articles.`);
  } catch (err) {
    console.error('Error seeding news:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seedNews();
