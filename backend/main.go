package main

import (
	"bufio"
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func initDB() {
	var err error
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "root:@tcp(127.0.0.1:3306)/owc_db?parseTime=true&multiStatements=true"
	}

	// Auto-create the database if it doesn't exist yet
	// Connect without a database name first
	baseDSN := "root:@tcp(127.0.0.1:3306)/?parseTime=true"
	tmpDB, tmpErr := sql.Open("mysql", baseDSN)
	if tmpErr == nil {
		if pingErr := tmpDB.Ping(); pingErr == nil {
			tmpDB.Exec("CREATE DATABASE IF NOT EXISTS owc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
		}
		tmpDB.Close()
	}

	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("db open:", err)
	}
	if err = db.Ping(); err != nil {
		log.Fatal("db connect:", err)
	}

	tables := []string{
		`CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(200) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, role VARCHAR(50) NOT NULL DEFAULT 'admin', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
		`CREATE TABLE IF NOT EXISTS news_articles (id INT PRIMARY KEY AUTO_INCREMENT, slug VARCHAR(300) UNIQUE NOT NULL, date VARCHAR(50) NOT NULL, month VARCHAR(20) NOT NULL, year VARCHAR(10) NOT NULL, category VARCHAR(100) NOT NULL, title TEXT NOT NULL, excerpt TEXT NOT NULL, image TEXT NOT NULL DEFAULT '', author VARCHAR(200) NOT NULL DEFAULT 'OWC Communications', read_time VARCHAR(50) NOT NULL DEFAULT '3 min read', body LONGTEXT NOT NULL DEFAULT '[]', published TINYINT NOT NULL DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`,
		"CREATE TABLE IF NOT EXISTS contact_messages (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(200) NOT NULL, email VARCHAR(200) NOT NULL, subject VARCHAR(300) NOT NULL, message TEXT NOT NULL, `read` TINYINT NOT NULL DEFAULT 0, received_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
		`CREATE TABLE IF NOT EXISTS pages (id INT PRIMARY KEY AUTO_INCREMENT, slug VARCHAR(200) UNIQUE NOT NULL, badge VARCHAR(200) NOT NULL DEFAULT '', title VARCHAR(300) NOT NULL, subtitle TEXT NOT NULL DEFAULT '', hero_image TEXT NOT NULL DEFAULT '', updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`,
		`CREATE TABLE IF NOT EXISTS menu_items (id INT PRIMARY KEY AUTO_INCREMENT, label VARCHAR(200) NOT NULL, href VARCHAR(500) NOT NULL, position INT NOT NULL DEFAULT 0)`,
		`CREATE TABLE IF NOT EXISTS documents (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(300) NOT NULL, category VARCHAR(100) NOT NULL DEFAULT 'General', filename VARCHAR(300) NOT NULL, original_name VARCHAR(300) NOT NULL, file_size INT NOT NULL DEFAULT 0, uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
		`CREATE TABLE IF NOT EXISTS audit_log (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(200) NOT NULL, action VARCHAR(200) NOT NULL, detail TEXT, ip VARCHAR(100), ts DATETIME DEFAULT CURRENT_TIMESTAMP)`,
		"CREATE TABLE IF NOT EXISTS site_settings (`key` VARCHAR(200) PRIMARY KEY, value TEXT NOT NULL DEFAULT '')",
		`CREATE TABLE IF NOT EXISTS events (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(300) NOT NULL, description TEXT NOT NULL DEFAULT '', event_date VARCHAR(50) NOT NULL, event_time VARCHAR(50) NOT NULL DEFAULT '', location VARCHAR(300) NOT NULL DEFAULT '', category VARCHAR(100) NOT NULL DEFAULT 'General', image TEXT NOT NULL DEFAULT '', published TINYINT NOT NULL DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
		`CREATE TABLE IF NOT EXISTS offices (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(200) NOT NULL, address TEXT NOT NULL DEFAULT '', phone VARCHAR(100) NOT NULL DEFAULT '', email VARCHAR(200) NOT NULL DEFAULT '', hours VARCHAR(200) NOT NULL DEFAULT 'Mon–Fri: 8:00 AM – 4:00 PM', position INT NOT NULL DEFAULT 0)`,
		`CREATE TABLE IF NOT EXISTS leadership (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(200) NOT NULL, title VARCHAR(200) NOT NULL, since VARCHAR(50) NOT NULL DEFAULT '', photo TEXT NOT NULL DEFAULT '', position INT NOT NULL DEFAULT 0)`,
		`CREATE TABLE IF NOT EXISTS faqs (id INT PRIMARY KEY AUTO_INCREMENT, question TEXT NOT NULL, answer TEXT NOT NULL, position INT NOT NULL DEFAULT 0, published TINYINT NOT NULL DEFAULT 1)`,
		`CREATE TABLE IF NOT EXISTS hero_slides (id INT PRIMARY KEY AUTO_INCREMENT, badge VARCHAR(200) NOT NULL DEFAULT '', title TEXT NOT NULL, subtitle TEXT NOT NULL DEFAULT '', image TEXT NOT NULL DEFAULT '', cta_label VARCHAR(200) NOT NULL DEFAULT 'Learn More', cta_href VARCHAR(500) NOT NULL DEFAULT '/', cta_external TINYINT NOT NULL DEFAULT 0, secondary_label VARCHAR(200) NOT NULL DEFAULT '', secondary_href VARCHAR(500) NOT NULL DEFAULT '/', position INT NOT NULL DEFAULT 0, published TINYINT NOT NULL DEFAULT 1)`,
		`CREATE TABLE IF NOT EXISTS services (id INT PRIMARY KEY AUTO_INCREMENT, position INT NOT NULL DEFAULT 0, tag VARCHAR(100) NOT NULL DEFAULT '', icon_name VARCHAR(100) NOT NULL DEFAULT 'HelpCircle', title VARCHAR(300) NOT NULL, description TEXT NOT NULL DEFAULT '', who_eligible TEXT NOT NULL DEFAULT '', benefits LONGTEXT NOT NULL DEFAULT '[]', published TINYINT NOT NULL DEFAULT 1)`,
	}
	for _, stmt := range tables {
		if _, err = db.Exec(stmt); err != nil {
			log.Fatalf("schema error: %v\nSQL: %s", err, stmt)
		}
	}

	// Migration: add photo column to leadership if it doesn't exist yet
	var colCount int
	db.QueryRow(`SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='leadership' AND COLUMN_NAME='photo'`).Scan(&colCount)
	if colCount == 0 {
		db.Exec(`ALTER TABLE leadership ADD COLUMN photo TEXT NOT NULL DEFAULT ''`)
	}

	os.MkdirAll("./uploads/images", 0755)
	os.MkdirAll("./uploads/documents", 0755)
	seedAdminUser()
	seedNewsArticles()
	seedPages()
	seedMenuItems()
	seedSettings()
	seedEvents()
	seedOffices()
	seedLeadership()
	seedFAQs()
	seedHeroSlides()
	seedServices()
	seedAboutSettings()
	log.Println("Database ready: MySQL owc_db")
}

func seedAdminUser() {
	var n int
	db.QueryRow("SELECT COUNT(*) FROM users").Scan(&n)
	if n > 0 {
		return
	}
	// Default password is set here only for first-run seeding.
	// Change immediately via /admin/change-password after first login.
	defaultPass := os.Getenv("ADMIN_INITIAL_PASSWORD")
	if defaultPass == "" {
		defaultPass = "ChangeMe@OWC2026!"
	}
	h, _ := bcrypt.GenerateFromPassword([]byte(defaultPass), bcrypt.DefaultCost)
	db.Exec("INSERT INTO users (username,password_hash,role) VALUES (?,?,?)", "admin", string(h), "admin")
	log.Println("Admin user created. Change the password immediately after first login.")
}

func seedPages() {
	var n int
	db.QueryRow("SELECT COUNT(*) FROM pages").Scan(&n)
	if n > 0 {
		return
	}
	pp := []struct{ slug, badge, title, subtitle, img string }{
		{"home", "Official Government Agency", "Protecting Papua New Guinea's Workforce", "The Office of Workers Compensation ensures every worker injured on the job receives fair compensation, quality rehabilitation, and a safe path back to employment.", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"},
		{"about", "About OWC", "About Us", "Established under the Workers Compensation Act 1978, OWC has been the guardian of PNG workers rights for nearly five decades.", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"},
		{"services", "What We Offer", "Our Services", "OWC provides comprehensive workers compensation services to protect PNG's workforce and support employers in meeting their obligations.", "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80"},
		{"news", "Updates", "News & Announcements", "Stay up to date with the latest news, policy changes, and events from the Office of Workers Compensation.", "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80"},
		{"resources", "Downloads", "Resources & Forms", "Access all OWC forms, guides, legislation, and policy documents in one place.", "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=80"},
		{"contact", "Get in Touch", "Contact Us", "Our team is ready to assist you. Reach out to your nearest OWC office or send us a message online.", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"},
		{"privacy", "Legal", "Privacy Policy", "How the Office of Workers Compensation collects, uses, and protects your personal information.", ""},
		{"terms", "Legal", "Terms of Use", "Please read these terms carefully before using the OWC website and online services.", ""},
	}
	for _, p := range pp {
		db.Exec("INSERT INTO pages (slug,badge,title,subtitle,hero_image) VALUES (?,?,?,?,?)", p.slug, p.badge, p.title, p.subtitle, p.img)
	}
	log.Println("Seeded 9 pages")
}

func seedMenuItems() {
	var n int
	db.QueryRow("SELECT COUNT(*) FROM menu_items").Scan(&n)
	if n > 0 {
		return
	}
	items := []struct {
		label, href string
		pos         int
	}{
		{"Home", "/", 0}, {"About", "/about", 1}, {"Services", "/services", 2},
		{"News & Updates", "/news", 3}, {"Events", "/events", 4}, {"Resources", "/resources", 5}, {"Contact", "/contact", 6},
	}
	for _, m := range items {
		db.Exec("INSERT INTO menu_items (label,href,position) VALUES (?,?,?)", m.label, m.href, m.pos)
	}
	log.Println("Seeded 7 menu items")
}

func seedSettings() {
	defaults := map[string]string{
		"theme":             "navy",
		"contact_phone":     "(+675) 313 5000 / Toll-Free: 180 1100",
		"contact_email":     "workerscomp@owc.gov.pg",
		"contact_address":   "Gaukara Rumana, Wards Rd\nPort Moresby, NCD\nPapua New Guinea",
		"contact_hours":     "Mon–Fri, 8:00 AM – 4:00 PM",
		"banner_enabled":    "true",
		"banner_text":       "Notice: For claims assistance call (+675) 313 5000 or Toll-Free 180 1100. Email: workerscomp@owc.gov.pg",
		"banner_link":       "/claims",
		"home_show_stats":    "true",
		"home_show_services": "true",
		"home_show_process":  "true",
		"home_show_news":     "true",
		"home_show_events":   "true",
		"home_show_cta":      "true",
		"stat_claims":        "1,732",
		"stat_benefits":      "K3.2M+",
		"stat_processing":    "60–90",
		"stat_coverage":      "All PLOs",
		"site_name":          "Office of Workers Compensation",
		"site_tagline":       "Protecting Papua New Guinea's Workforce",
		"custom_css":         "",
	}
	for k, v := range defaults {
		db.Exec("INSERT IGNORE INTO site_settings (`key`,value) VALUES (?,?)", k, v)
	}
	log.Println("Settings seeded")
}

func seedEvents() {
	var n int
	db.QueryRow("SELECT COUNT(*) FROM events").Scan(&n)
	if n > 0 {
		return
	}
	ee := []struct{ title, desc, date, time, location, category, image string }{
		{
			"Employer Awareness Workshop — Port Moresby",
			"A free workshop for all employers covering obligations under the Workers' Compensation Act 1978, including registration, levy payments, accident reporting, and claims management.",
			"2026-04-15", "8:00 AM – 1:00 PM",
			"Airways Hotel, Jacksons Parade, Port Moresby, NCD",
			"Workshop",
			"https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
		},
		{
			"Provincial Labour Officers Training — Lae",
			"Capacity building training for Provincial Labour Office staff to enhance their ability to process workers' compensation claims regionally and provide frontline services.",
			"2026-04-22", "9:00 AM – 4:00 PM",
			"Melanesian Hotel, 4th Street, Lae, Morobe Province",
			"Training",
			"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
		},
		{
			"Workers' Rights Awareness Campaign — Mt Hagen",
			"OWC officers will conduct public awareness sessions in the Western Highlands on workers' rights, how to lodge a compensation claim, and accessing Provincial Labour Office services.",
			"2026-05-06", "8:30 AM – 3:00 PM",
			"Mt Hagen Cultural Centre, Western Highlands Province",
			"Awareness",
			"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
		},
		{
			"Workers' Compensation Act Review — Public Consultation",
			"DLIR invites workers, employers, legal practitioners, and community representatives to participate in consultations on proposed amendments to the Workers' Compensation Act 1978.",
			"2026-05-20", "10:00 AM – 3:00 PM",
			"DLIR Headquarters, Gaukara Rumana, Wards Rd, Port Moresby",
			"Consultation",
			"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
		},
		{
			"National Occupational Health & Safety Forum 2026",
			"Annual national forum bringing together government agencies, employers, trade unions, and industry groups to discuss occupational health and safety standards, injury prevention, and compensation policy.",
			"2026-06-03", "8:00 AM – 5:00 PM",
			"Stanley Hotel & Suites, Waigani, Port Moresby",
			"Conference",
			"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
		},
		{
			"Claimant Outreach Program — Highlands Region",
			"OWC case officers will travel to Goroka and surrounding areas to assist existing claimants, accept new claims, and provide guidance to injured workers and their families.",
			"2026-06-17", "8:00 AM – 2:00 PM",
			"Eastern Highlands Provincial Labour Office, Goroka",
			"Outreach",
			"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
		},
	}
	for _, e := range ee {
		db.Exec(`INSERT INTO events (title,description,event_date,event_time,location,category,image,published) VALUES (?,?,?,?,?,?,?,1)`,
			e.title, e.desc, e.date, e.time, e.location, e.category, e.image)
	}
	log.Println("Seeded 6 events")
}

func scanEvent(row interface{ Scan(...any) error }) (*Event, error) {
	var e Event
	var pub int
	err := row.Scan(&e.ID, &e.Title, &e.Description, &e.EventDate, &e.EventTime, &e.Location, &e.Category, &e.Image, &pub, &e.CreatedAt)
	if err != nil {
		return nil, err
	}
	e.Published = pub == 1
	return &e, nil
}

func scanOffice(row interface{ Scan(...any) error }) (*Office, error) {
	var o Office
	return &o, row.Scan(&o.ID, &o.Name, &o.Address, &o.Phone, &o.Email, &o.Hours, &o.Position)
}

func scanLeader(row interface{ Scan(...any) error }) (*LeadershipMember, error) {
	var l LeadershipMember
	return &l, row.Scan(&l.ID, &l.Name, &l.Title, &l.Since, &l.Photo, &l.Position)
}

func scanFAQ(row interface{ Scan(...any) error }) (*FAQ, error) {
	var f FAQ
	var pub int
	err := row.Scan(&f.ID, &f.Question, &f.Answer, &f.Position, &pub)
	f.Published = pub == 1
	return &f, err
}

func scanService(row interface{ Scan(...any) error }) (*Service, error) {
	var s Service
	var benefitsJSON string
	var pub int
	err := row.Scan(&s.ID, &s.Position, &s.Tag, &s.IconName, &s.Title, &s.Description, &s.WhoEligible, &benefitsJSON, &pub)
	if err != nil {
		return nil, err
	}
	s.Published = pub == 1
	json.Unmarshal([]byte(benefitsJSON), &s.Benefits)
	if s.Benefits == nil {
		s.Benefits = []string{}
	}
	return &s, nil
}

func scanHeroSlide(row interface{ Scan(...any) error }) (*HeroSlide, error) {
	var s HeroSlide
	var ext, pub int
	err := row.Scan(&s.ID, &s.Badge, &s.Title, &s.Subtitle, &s.Image, &s.CTALabel, &s.CTAHref, &ext, &s.SecondaryLabel, &s.SecondaryHref, &s.Position, &pub)
	s.CTAExternal = ext == 1
	s.Published = pub == 1
	return &s, err
}

func seedOffices() {
	var n int
	db.QueryRow("SELECT COUNT(*) FROM offices").Scan(&n)
	if n > 0 {
		return
	}
	oo := []struct{ name, address, phone, email, hours string }{
		{"Head Office — Port Moresby (OWC / DLIR HQ)", "Gaukara Rumana, Wards Rd, Port Moresby, NCD", "(+675) 313 5000 / Toll-Free: 180 1100", "workerscomp@owc.gov.pg", "Mon–Fri: 8:00 AM – 4:00 PM"},
		{"Lae Regional Office", "Lae City Centre, Morobe Province", "+675 472 0000", "lae@owc.gov.pg", "Mon–Fri: 8:00 AM – 4:00 PM"},
		{"Mt Hagen Office", "Highlands Highway, Western Highlands", "+675 542 0000", "mthagen@owc.gov.pg", "Mon–Fri: 8:00 AM – 4:00 PM"},
	}
	for i, o := range oo {
		db.Exec(`INSERT INTO offices (name,address,phone,email,hours,position) VALUES (?,?,?,?,?,?)`, o.name, o.address, o.phone, o.email, o.hours, i)
	}
	log.Println("Seeded 3 offices")
}

func seedLeadership() {
	var n int
	db.QueryRow("SELECT COUNT(*) FROM leadership").Scan(&n)
	if n > 0 {
		return
	}
	ll := []struct{ name, title, since string }{
		{"Sir John Kaupa", "Commissioner", "2022"},
		{"Mrs. Grace Mondo", "Deputy Commissioner — Operations", "2021"},
		{"Mr. Peter Wari", "Deputy Commissioner — Compliance", "2023"},
		{"Ms. Susan Taku", "Director — Claims", "2020"},
		{"Mr. David Kila", "Director — Legal Services", "2019"},
		{"Ms. Naomi Bero", "Director — Corporate Services", "2022"},
	}
	for i, l := range ll {
		db.Exec(`INSERT INTO leadership (name,title,since,position) VALUES (?,?,?,?)`, l.name, l.title, l.since, i)
	}
	log.Println("Seeded 6 leadership members")
}

func seedFAQs() {
	var n int
	db.QueryRow("SELECT COUNT(*) FROM faqs").Scan(&n)
	if n > 0 {
		return
	}
	ff := []struct{ q, a string }{
		{"Is compensation mandatory for all employers?", "Yes. All employers are required by law to insure their employees against work-related injury or death under the Workers' Compensation Act 1978."},
		{"Can compensation be claimed for informal or casual workers?", "Eligibility depends on the employment arrangement. OWC will assess each case individually — contact your nearest Provincial Labour Office or OWC HQ for guidance."},
		{"How long does a claim take to be processed?", "Most claims are resolved within 60–90 days, depending on the completeness of documentation and availability of medical reports."},
		{"Who is eligible for workers compensation?", "Any worker employed under a contract of service in PNG who suffers injury, disease, or death arising out of and in the course of employment is eligible."},
		{"How long do I have to file a claim?", "Claims must be lodged within 12 months of the injury date. Latent injury claims must be filed within 3 years of diagnosis."},
		{"What if my employer refuses to report my injury?", "You can report directly to OWC. We will investigate and assist you in pursuing your claim."},
		{"Do I need a lawyer to file a claim?", "No, you can file directly with OWC. However, for complex disputes you may choose to engage legal representation."},
		{"How is compensation calculated?", "Weekly benefits are based on your pre-injury earnings. Lump sum amounts depend on the degree of permanent disability as assessed by a certified medical board."},
	}
	for i, f := range ff {
		db.Exec(`INSERT INTO faqs (question,answer,position,published) VALUES (?,?,?,1)`, f.q, f.a, i)
	}
	log.Println("Seeded 8 FAQs")
}

func seedHeroSlides() {
	var n int
	db.QueryRow("SELECT COUNT(*) FROM hero_slides").Scan(&n)
	if n > 0 {
		return
	}
	ss := []struct {
		badge, title, subtitle, image, ctaLabel, ctaHref string
		ctaExternal                                       bool
		secLabel, secHref                                 string
	}{
		{"Official Government Agency", "Protecting Papua New Guinea's Workforce", "A statutory office under the Department of Labour and Industrial Relations (DLIR), OWC ensures every worker injured on the job receives fair compensation, quality rehabilitation, and a safe path back to employment.", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80", "File a Claim", "https://portal.owc.gov.pg", true, "Learn More", "/about"},
		{"Workers Compensation", "Fair Compensation for Every Injured Worker", "From medical expenses to lost wages and permanent disability — OWC ensures you receive every benefit you are entitled to under Papua New Guinea law.", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80", "Check Your Eligibility", "/services", false, "View Services", "/services"},
		{"Employer Compliance", "Supporting PNG Employers in Meeting Their Obligations", "Register your business, understand your coverage requirements, and ensure your workforce is protected under the Workers Compensation Act 1978.", "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80", "Register Now", "/services#employer", false, "Resources", "/resources"},
		{"Rehabilitation Services", "A Safe Path Back to Employment", "OWC's structured rehabilitation programs help injured workers recover and return to safe, meaningful work — supporting their families and communities.", "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80", "Learn About Rehab", "/services#rehabilitation", false, "Contact Us", "/contact"},
	}
	for i, s := range ss {
		ext := 0
		if s.ctaExternal {
			ext = 1
		}
		db.Exec(`INSERT INTO hero_slides (badge,title,subtitle,image,cta_label,cta_href,cta_external,secondary_label,secondary_href,position,published) VALUES (?,?,?,?,?,?,?,?,?,?,1)`,
			s.badge, s.title, s.subtitle, s.image, s.ctaLabel, s.ctaHref, ext, s.secLabel, s.secHref, i)
	}
	log.Println("Seeded 4 hero slides")
}

func seedServices() {
	var n int
	db.QueryRow("SELECT COUNT(*) FROM services").Scan(&n)
	if n > 0 {
		return
	}
	type svc struct {
		tag, iconName, title, description, whoEligible string
		benefits                                        []string
	}
	ss := []svc{
		{"Workers", "Shield", "Workers Compensation",
			"Financial support for workers who suffer work-related injuries or occupational diseases. OWC ensures eligible workers receive the compensation they are legally entitled to under the Workers Compensation Act 1978.",
			"Any worker employed under a contract of service in PNG who sustains a work-related injury or disease.",
			[]string{"Weekly compensation for temporary total incapacity", "Lump sum payment for permanent incapacity", "Medical and hospital expense reimbursement", "Funeral expenses in case of fatality", "Dependent benefits for fatal injuries"}},
		{"Rehabilitation", "Users", "Injury Rehabilitation",
			"Structured programs designed to support injured workers through their recovery journey and help them return to meaningful employment as safely and quickly as possible.",
			"Workers with accepted compensation claims who require medical or vocational rehabilitation.",
			[]string{"Occupational therapy and physiotherapy", "Vocational retraining programs", "Workplace modification assessments", "Return-to-work planning", "Psychological support services"}},
		{"Employers", "Building2", "Employer Registration",
			"All employers in PNG with one or more workers are legally required to register with OWC and maintain adequate workers compensation coverage for their workforce.",
			"All employers operating in Papua New Guinea with at least one employee.",
			[]string{"Simple online or in-person registration", "Compliance certificates issued", "Annual levy assessment", "Access to employer portal", "Regulatory guidance and support"}},
		{"Medical", "Stethoscope", "Medical Assessments",
			"Independent medical examinations conducted by OWC-accredited examiners to determine the nature, extent, and work-relatedness of injuries and disabilities.",
			"Workers and employers involved in active compensation claims requiring medical evidence.",
			[]string{"Panel of accredited medical examiners", "Impartial disability ratings", "Specialist referral coordination", "Medical report management", "Second opinion provisions"}},
		{"Disputes", "Scale", "Dispute Resolution",
			"A fair, structured, and timely process to resolve disagreements between workers, employers, and insurers regarding compensation entitlements and claim decisions.",
			"Workers or employers who disagree with a claim decision or compensation entitlement.",
			[]string{"Formal conciliation process", "Referral to Workers Compensation Tribunal", "Legal representation guidance", "Mediation services", "Appeals process management"}},
		{"Advisory", "HelpCircle", "Advisory Services",
			"Expert education, outreach, and guidance to help workers understand their rights and assist employers and medical providers in meeting their obligations under the Act.",
			"Workers, employers, medical providers, and legal professionals seeking guidance on workers compensation.",
			[]string{"Workplace safety consultations", "Employer obligations workshops", "Worker rights information sessions", "Legislative compliance guidance", "Industry outreach programs"}},
	}
	for i, s := range ss {
		b, _ := json.Marshal(s.benefits)
		db.Exec(`INSERT INTO services (position,tag,icon_name,title,description,who_eligible,benefits,published) VALUES (?,?,?,?,?,?,?,1)`,
			i+1, s.tag, s.iconName, s.title, s.description, s.whoEligible, string(b))
	}
	log.Println("Seeded 6 services")
}

func seedAboutSettings() {
	mandateJSON, _ := json.Marshal([]string{
		"Administer and enforce the Workers' Compensation Act 1978",
		"Investigate and process claims for compensation",
		"Issue compensation determinations and monitor employer compliance",
		"Register and regulate approved insurers",
		"Maintain records of occupational injuries, deaths, and related settlements",
		"Support development and amendment of compensation legislation and policy",
	})
	highlightsJSON, _ := json.Marshal([]map[string]string{
		{"value": "1,732", "label": "Compensation claims lodged nationwide"},
		{"value": "K3.2M+", "label": "In benefits paid to injured workers and dependents"},
		{"value": "Regional", "label": "Capacity building for Provincial Labour Office staff"},
		{"value": "Active", "label": "Ongoing consultations for amendments to the Workers' Compensation Act"},
	})
	prioritiesJSON, _ := json.Marshal([]map[string]string{
		{"title": "Modernise the Act", "desc": "Updating the Workers' Compensation Act 1978 to reflect current labour market needs and international best practices."},
		{"title": "Digitise Claims", "desc": "Digitizing claims management systems for efficiency and transparency across all offices."},
		{"title": "Decentralise Processing", "desc": "Empowering Provincial Labour Offices (PLOs) to handle claims regionally."},
		{"title": "Strengthen Insurer Regulation", "desc": "Improving collaboration with the financial sector and oversight of approved insurers."},
		{"title": "Improve Data Reporting", "desc": "Enhancing data collection and reporting on occupational injuries and claims outcomes."},
	})
	valuesJSON, _ := json.Marshal([]map[string]string{
		{"title": "Fairness", "desc": "Every claim is assessed objectively and equitably."},
		{"title": "Transparency", "desc": "We communicate openly about processes and decisions."},
		{"title": "Integrity", "desc": "We uphold the highest ethical standards in public service."},
		{"title": "Excellence", "desc": "We continuously improve to serve workers better."},
	})
	legislationJSON, _ := json.Marshal([]map[string]string{
		{"title": "Workers' Compensation Act 1978", "desc": "The primary legislation governing workers' compensation in PNG."},
		{"title": "Workers' Compensation Regulation", "desc": "Subsidiary regulations providing procedural and technical rules under the Act."},
		{"title": "Industrial Relations Act 1962", "desc": "Related provisions supporting employment and workplace dispute frameworks."},
		{"title": "Occupational Health & Safety Act 1993", "desc": "Workplace safety standards complementing compensation legislation."},
		{"title": "Employment Act (Chapter 373)", "desc": "Employment law framework including injury provisions."},
		{"title": "ILO Conventions on Social Protection", "desc": "International Labour Organization conventions on employment injury benefits and social protection ratified by PNG."},
	})
	defaults := map[string]string{
		"about_mission":     "To administer a fair, efficient, and accessible workers compensation system that protects the rights of workers injured in the course of employment, while promoting safe and healthy workplaces across Papua New Guinea.",
		"about_vision":      "A Papua New Guinea where every worker is protected, valued, and supported — where workplace injuries are prevented, and those affected receive timely and adequate compensation to restore their dignity and livelihood.",
		"about_mandate":     string(mandateJSON),
		"about_highlights":  string(highlightsJSON),
		"about_priorities":  string(prioritiesJSON),
		"about_values":      string(valuesJSON),
		"about_legislation": string(legislationJSON),
	}
	for k, v := range defaults {
		db.Exec("INSERT IGNORE INTO site_settings (`key`,value) VALUES (?,?)", k, v)
	}
	log.Println("About settings seeded")
}

func seedNewsArticles() {
	var n int
	db.QueryRow("SELECT COUNT(*) FROM news_articles").Scan(&n)
	if n > 0 {
		return
	}
	aa := []struct{ slug, date, month, year, cat, title, excerpt, img, author, rt, body string }{
		{"owc-launches-new-online-claims-portal-2026", "March 5, 2026", "March 2026", "2026", "Technology", "OWC Launches New Online Claims Portal for 2026", "The Office of Workers Compensation is pleased to announce the launch of our improved digital claims system.", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80", "OWC Communications", "3 min read", `[{"heading":"","text":"OWC is proud to announce the official launch of its redesigned online claims portal."},{"heading":"Key Features","text":"Streamlined claim submission, real-time status tracking, and secure document upload."},{"heading":"Improved Accessibility","text":"Designed for low-bandwidth connections and compatible with mobile devices."}]`},
		{"employer-awareness-workshop-port-moresby-2026", "February 18, 2026", "February 2026", "2026", "Workshop", "Employer Awareness Workshop — Port Moresby", "Join us for a free workshop on employer obligations under the Workers Compensation Act 1978.", "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80", "OWC Training Division", "4 min read", `[{"heading":"","text":"OWC will host a free Employer Awareness Workshop in Port Moresby on 18 February 2026."},{"heading":"Workshop Overview","text":"Registration, levy obligations, incident reporting, and claim management."},{"heading":"Event Details","text":"Airways Hotel, Port Moresby. 8:00 AM to 1:00 PM."}]`},
		{"updated-medical-assessment-fee-schedules-2026", "February 1, 2026", "February 2026", "2026", "Policy", "Updated Medical Assessment Fee Schedules for 2026", "New medical fee schedules have been gazetted and take effect from February 1, 2026.", "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80", "OWC Policy Unit", "3 min read", `[{"heading":"","text":"Updated medical assessment fee schedules take effect from 1 February 2026."},{"heading":"What Has Changed","text":"Revised rates for GP consultations, specialist assessments, physiotherapy, and imaging."}]`},
		{"owc-celebrates-48-years-of-service", "January 15, 2026", "January 2026", "2026", "Announcement", "OWC Celebrates 48 Years of Service", "Established in 1978, the Office of Workers Compensation marks 48 years of protecting PNG's workforce.", "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80", "OWC Communications", "5 min read", `[{"heading":"","text":"OWC marks its 48th anniversary reflecting on nearly five decades of service."},{"heading":"Key Milestones","text":"OWC has processed over 120,000 claims and established regional offices nationwide."}]`},
		{"employer-registration-deadline-december-2025", "December 10, 2025", "December 2025", "2025", "Compliance", "Employer Registration Deadline - December 31", "All employers must ensure their registration is current. Penalties apply for non-compliance.", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80", "OWC Compliance Unit", "3 min read", `[{"heading":"","text":"OWC reminds all employers that the annual registration renewal deadline is 31 December 2025."},{"heading":"Penalties","text":"Employers risk fines of up to K10,000 and personal liability."}]`},
		{"workers-rights-awareness-campaign-highlands-2025", "November 22, 2025", "November 2025", "2025", "Workshop", "Workers Rights Awareness Campaign - Highlands Region", "OWC conducted a series of awareness workshops across the Highlands provinces reaching over 3,000 workers.", "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80", "OWC Outreach Division", "4 min read", `[{"heading":"","text":"OWC completed a month-long awareness campaign across the Highlands region reaching 3,200 workers."},{"heading":"Industries Reached","text":"Agriculture, construction, mining, and hospitality sectors."}]`},
	}
	for _, a := range aa {
		db.Exec(`INSERT INTO news_articles (slug,date,month,year,category,title,excerpt,image,author,read_time,body) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, a.slug, a.date, a.month, a.year, a.cat, a.title, a.excerpt, a.img, a.author, a.rt, a.body)
	}
	log.Println("Seeded 6 news articles")
}

type BodyBlock struct {
	Heading string `json:"heading"`
	Text    string `json:"text"`
}
type Article struct {
	ID        int         `json:"id"`
	Slug      string      `json:"slug"`
	Date      string      `json:"date"`
	Month     string      `json:"month"`
	Year      string      `json:"year"`
	Category  string      `json:"category"`
	Title     string      `json:"title"`
	Excerpt   string      `json:"excerpt"`
	Image     string      `json:"image"`
	Author    string      `json:"author"`
	ReadTime  string      `json:"readTime"`
	Body      []BodyBlock `json:"body"`
	Published bool        `json:"published"`
	CreatedAt string      `json:"createdAt"`
	UpdatedAt string      `json:"updatedAt"`
}
type ArticleInput struct {
	Slug      string      `json:"slug"      binding:"required,max=200"`
	Date      string      `json:"date"      binding:"required,max=50"`
	Month     string      `json:"month"     binding:"required,max=30"`
	Year      string      `json:"year"      binding:"required,max=4"`
	Category  string      `json:"category"  binding:"required,max=50"`
	Title     string      `json:"title"     binding:"required,max=300"`
	Excerpt   string      `json:"excerpt"   binding:"required,max=500"`
	Image     string      `json:"image"`
	Author    string      `json:"author"`
	ReadTime  string      `json:"readTime"`
	Body      []BodyBlock `json:"body"`
	Published bool        `json:"published"`
}
type ContactMessage struct {
	ID         int    `json:"id"`
	Name       string `json:"name"    binding:"required,max=200"`
	Email      string `json:"email"   binding:"required,email,max=200"`
	Subject    string `json:"subject" binding:"required,max=300"`
	Message    string `json:"message" binding:"required,max=3000"`
	Read       bool   `json:"read"`
	ReceivedAt string `json:"receivedAt"`
}
type PageContent struct {
	ID        int    `json:"id"`
	Slug      string `json:"slug"`
	Badge     string `json:"badge"`
	Title     string `json:"title"`
	Subtitle  string `json:"subtitle"`
	HeroImage string `json:"heroImage"`
	UpdatedAt string `json:"updatedAt"`
}
type MenuItem struct {
	ID       int    `json:"id"`
	Label    string `json:"label"`
	Href     string `json:"href"`
	Position int    `json:"position"`
}
type Document struct {
	ID           int    `json:"id"`
	Title        string `json:"title"`
	Category     string `json:"category"`
	Filename     string `json:"filename"`
	OriginalName string `json:"originalName"`
	FileSize     int64  `json:"fileSize"`
	URL          string `json:"url"`
	UploadedAt   string `json:"uploadedAt"`
}
type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
}
type Office struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Address  string `json:"address"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
	Hours    string `json:"hours"`
	Position int    `json:"position"`
}
type OfficeInput struct {
	Name     string `json:"name"     binding:"required,max=200"`
	Address  string `json:"address"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
	Hours    string `json:"hours"`
	Position int    `json:"position"`
}
type LeadershipMember struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Title    string `json:"title"`
	Since    string `json:"since"`
	Photo    string `json:"photo"`
	Position int    `json:"position"`
}
type LeadershipInput struct {
	Name     string `json:"name"  binding:"required,max=200"`
	Title    string `json:"title" binding:"required,max=200"`
	Since    string `json:"since"`
	Photo    string `json:"photo"`
	Position int    `json:"position"`
}
type FAQ struct {
	ID        int    `json:"id"`
	Question  string `json:"question"`
	Answer    string `json:"answer"`
	Position  int    `json:"position"`
	Published bool   `json:"published"`
}
type FAQInput struct {
	Question  string `json:"question" binding:"required,max=500"`
	Answer    string `json:"answer"   binding:"required,max=2000"`
	Position  int    `json:"position"`
	Published bool   `json:"published"`
}
type HeroSlide struct {
	ID             int    `json:"id"`
	Badge          string `json:"badge"`
	Title          string `json:"title"`
	Subtitle       string `json:"subtitle"`
	Image          string `json:"image"`
	CTALabel       string `json:"ctaLabel"`
	CTAHref        string `json:"ctaHref"`
	CTAExternal    bool   `json:"ctaExternal"`
	SecondaryLabel string `json:"secondaryLabel"`
	SecondaryHref  string `json:"secondaryHref"`
	Position       int    `json:"position"`
	Published      bool   `json:"published"`
}
type HeroSlideInput struct {
	Badge          string `json:"badge"`
	Title          string `json:"title"          binding:"required,max=300"`
	Subtitle       string `json:"subtitle"`
	Image          string `json:"image"`
	CTALabel       string `json:"ctaLabel"`
	CTAHref        string `json:"ctaHref"`
	CTAExternal    bool   `json:"ctaExternal"`
	SecondaryLabel string `json:"secondaryLabel"`
	SecondaryHref  string `json:"secondaryHref"`
	Position       int    `json:"position"`
	Published      bool   `json:"published"`
}
type Service struct {
	ID          int      `json:"id"`
	Position    int      `json:"position"`
	Tag         string   `json:"tag"`
	IconName    string   `json:"iconName"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	WhoEligible string   `json:"whoEligible"`
	Benefits    []string `json:"benefits"`
	Published   bool     `json:"published"`
}
type ServiceInput struct {
	Tag         string   `json:"tag"`
	IconName    string   `json:"iconName"`
	Title       string   `json:"title"        binding:"required,max=300"`
	Description string   `json:"description"`
	WhoEligible string   `json:"whoEligible"`
	Benefits    []string `json:"benefits"`
	Published   bool     `json:"published"`
	Position    int      `json:"position"`
}

type Event struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	EventDate   string `json:"eventDate"`
	EventTime   string `json:"eventTime"`
	Location    string `json:"location"`
	Category    string `json:"category"`
	Image       string `json:"image"`
	Published   bool   `json:"published"`
	CreatedAt   string `json:"createdAt"`
}
type EventInput struct {
	Title       string `json:"title"       binding:"required,max=300"`
	Description string `json:"description"`
	EventDate   string `json:"eventDate"   binding:"required,max=30"`
	EventTime   string `json:"eventTime"`
	Location    string `json:"location"    binding:"required,max=300"`
	Category    string `json:"category"    binding:"required,max=100"`
	Image       string `json:"image"`
	Published   bool   `json:"published"`
}

var jwtSecret []byte
var secureCookies bool

func generateToken(u User) (string, error) {
	return jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": u.ID, "username": u.Username, "role": u.Role,
		"exp": time.Now().Add(8 * time.Hour).Unix(),
		"iat": time.Now().Unix(),
	}).SignedString(jwtSecret)
}

func parseToken(raw string) (jwt.MapClaims, error) {
	tok, err := jwt.Parse(raw, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return jwtSecret, nil
	})
	if err != nil || !tok.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	return tok.Claims.(jwt.MapClaims), nil
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Prefer httpOnly cookie; fall back to Bearer for API clients
		var raw string
		if cookie, err := c.Cookie("owc_token"); err == nil && cookie != "" {
			raw = cookie
		} else {
			h := c.GetHeader("Authorization")
			if strings.HasPrefix(h, "Bearer ") {
				raw = strings.TrimPrefix(h, "Bearer ")
			}
		}
		if raw == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
			return
		}
		cl, err := parseToken(raw)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authentication required"})
			return
		}
		c.Set("userID", int(cl["id"].(float64)))
		c.Set("username", cl["username"].(string))
		c.Set("role", cl["role"].(string))
		c.Next()
	}
}

// Simple per-IP rate limiter
type rateLimiter struct {
	mu      sync.Mutex
	entries map[string][]time.Time
}

func newRateLimiter() *rateLimiter {
	rl := &rateLimiter{entries: make(map[string][]time.Time)}
	// Periodically clean up old entries to prevent memory growth
	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		for range ticker.C {
			rl.mu.Lock()
			cutoff := time.Now().Add(-10 * time.Minute)
			for ip, times := range rl.entries {
				var recent []time.Time
				for _, t := range times {
					if t.After(cutoff) {
						recent = append(recent, t)
					}
				}
				if len(recent) == 0 {
					delete(rl.entries, ip)
				} else {
					rl.entries[ip] = recent
				}
			}
			rl.mu.Unlock()
		}
	}()
	return rl
}

func (rl *rateLimiter) allow(ip string, limit int, window time.Duration) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	now := time.Now()
	cutoff := now.Add(-window)
	times := rl.entries[ip]
	var recent []time.Time
	for _, t := range times {
		if t.After(cutoff) {
			recent = append(recent, t)
		}
	}
	if len(recent) >= limit {
		rl.entries[ip] = recent
		return false
	}
	rl.entries[ip] = append(recent, now)
	return true
}

func clientIP(c *gin.Context) string {
	if ip := c.GetHeader("X-Forwarded-For"); ip != "" {
		return strings.Split(ip, ",")[0]
	}
	return c.ClientIP()
}

func auditLog(username, action, detail, ip string) {
	db.Exec("INSERT INTO audit_log (username,action,detail,ip) VALUES (?,?,?,?)", username, action, detail, ip)
}

func scanArticle(row interface{ Scan(...any) error }) (*Article, error) {
	var a Article
	var body string
	var pub int
	err := row.Scan(&a.ID, &a.Slug, &a.Date, &a.Month, &a.Year, &a.Category, &a.Title, &a.Excerpt, &a.Image, &a.Author, &a.ReadTime, &body, &pub, &a.CreatedAt, &a.UpdatedAt)
	if err != nil {
		return nil, err
	}
	a.Published = pub == 1
	json.Unmarshal([]byte(body), &a.Body)
	if a.Body == nil {
		a.Body = []BodyBlock{}
	}
	return &a, nil
}

func scanPage(row interface{ Scan(...any) error }) (*PageContent, error) {
	var p PageContent
	return &p, row.Scan(&p.ID, &p.Slug, &p.Badge, &p.Title, &p.Subtitle, &p.HeroImage, &p.UpdatedAt)
}

func loadEnv(path string) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		if parts := strings.SplitN(line, "=", 2); len(parts) == 2 {
			k, v := strings.TrimSpace(parts[0]), strings.TrimSpace(parts[1])
			if os.Getenv(k) == "" {
				os.Setenv(k, v)
			}
		}
	}
}

func sendContactEmail(msg ContactMessage) {
	host, port, user, pass, to := os.Getenv("SMTP_HOST"), os.Getenv("SMTP_PORT"), os.Getenv("SMTP_USER"), os.Getenv("SMTP_PASS"), os.Getenv("MAIL_TO")
	if host == "" || user == "" || pass == "" || to == "" {
		return
	}
	auth := smtp.PlainAuth("", user, pass, host)
	addr := host + ":" + port
	var n bytes.Buffer
	fmt.Fprintf(&n, "From: OWC <%s>\r\nTo: %s\r\nReply-To: %s <%s>\r\nSubject: [OWC Contact] %s\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\nName: %s\r\nEmail: %s\r\n\r\n%s\r\n", user, to, msg.Name, msg.Email, msg.Subject, msg.Name, msg.Email, msg.Message)
	smtp.SendMail(addr, auth, user, []string{to}, n.Bytes())
	var rr bytes.Buffer
	fmt.Fprintf(&rr, "From: OWC <%s>\r\nTo: %s <%s>\r\nSubject: Re: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\nDear %s,\r\n\r\nThank you for contacting OWC. We will respond within 2 business days.\r\n\r\nRegards,\r\nOffice of Workers Compensation\r\n", user, msg.Name, msg.Email, msg.Subject, msg.Name)
	smtp.SendMail(addr, auth, user, []string{msg.Email}, rr.Bytes())
}

func securityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Header("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
		c.Header("Cache-Control", "no-store")
		c.Next()
	}
}

func main() {
	loadEnv(".env")

	sec := os.Getenv("JWT_SECRET")
	if sec == "" {
		log.Fatal("JWT_SECRET environment variable must be set")
	}
	jwtSecret = []byte(sec)
	secureCookies = os.Getenv("SECURE_COOKIES") == "true"

	initDB()

	// Parse allowed CORS origins from env
	originsEnv := os.Getenv("ALLOWED_ORIGINS")
	if originsEnv == "" {
		originsEnv = "http://localhost:5173,http://localhost:3000"
	}
	allowedOrigins := strings.Split(originsEnv, ",")

	loginLimiter := newRateLimiter()

	r := gin.Default()
	r.Use(securityHeaders())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	r.Static("/uploads", "./uploads")

	api := r.Group("/api")

	api.GET("/health", func(c *gin.Context) { c.JSON(200, gin.H{"status": "ok", "service": "OWC API"}) })
	api.GET("/stats", func(c *gin.Context) {
		c.JSON(200, gin.H{"settlementRate": 98, "registeredEmployers": 4200, "avgResponseHours": 48})
	})
	api.GET("/pages/:slug", func(c *gin.Context) {
		p, err := scanPage(db.QueryRow("SELECT id,slug,badge,title,subtitle,hero_image,updated_at FROM pages WHERE slug=?", c.Param("slug")))
		if err != nil {
			c.JSON(404, gin.H{"error": "not found"})
			return
		}
		c.JSON(200, p)
	})
	api.GET("/menus", func(c *gin.Context) {
		rows, err := db.Query("SELECT id,label,href,position FROM menu_items ORDER BY position ASC")
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var items []MenuItem
		for rows.Next() {
			var m MenuItem
			rows.Scan(&m.ID, &m.Label, &m.Href, &m.Position)
			items = append(items, m)
		}
		if items == nil {
			items = []MenuItem{}
		}
		c.JSON(200, gin.H{"items": items})
	})
	api.GET("/news", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,slug,date,month,year,category,title,excerpt,image,author,read_time,body,published,created_at,updated_at FROM news_articles WHERE published=1 ORDER BY id DESC`)
		if err != nil {
			c.JSON(500, gin.H{"error": "internal server error"})
			return
		}
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var aa []Article
		for rows.Next() {
			if a, err := scanArticle(rows); err == nil {
				aa = append(aa, *a)
			}
		}
		if aa == nil {
			aa = []Article{}
		}
		c.JSON(200, gin.H{"news": aa, "total": len(aa)})
	})
	api.GET("/news/:slug", func(c *gin.Context) {
		a, err := scanArticle(db.QueryRow(`SELECT id,slug,date,month,year,category,title,excerpt,image,author,read_time,body,published,created_at,updated_at FROM news_articles WHERE slug=? AND published=1`, c.Param("slug")))
		if err != nil {
			c.JSON(404, gin.H{"error": "not found"})
			return
		}
		c.JSON(200, a)
	})
	api.GET("/documents", func(c *gin.Context) {
		rows, err := db.Query("SELECT id,title,category,filename,original_name,file_size,uploaded_at FROM documents ORDER BY uploaded_at DESC")
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var docs []Document
		for rows.Next() {
			var d Document
			rows.Scan(&d.ID, &d.Title, &d.Category, &d.Filename, &d.OriginalName, &d.FileSize, &d.UploadedAt)
			d.URL = "/uploads/documents/" + d.Filename
			docs = append(docs, d)
		}
		if docs == nil {
			docs = []Document{}
		}
		c.JSON(200, gin.H{"documents": docs, "total": len(docs)})
	})
	api.GET("/events", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,title,description,event_date,event_time,location,category,image,published,created_at FROM events WHERE published=1 ORDER BY event_date ASC`)
		if err != nil {
			c.JSON(500, gin.H{"error": "internal server error"})
			return
		}
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var ee []Event
		for rows.Next() {
			if e, err := scanEvent(rows); err == nil {
				ee = append(ee, *e)
			}
		}
		if ee == nil {
			ee = []Event{}
		}
		c.JSON(200, gin.H{"events": ee, "total": len(ee)})
	})
	api.GET("/events/:id", func(c *gin.Context) {
		e, err := scanEvent(db.QueryRow(`SELECT id,title,description,event_date,event_time,location,category,image,published,created_at FROM events WHERE id=? AND published=1`, c.Param("id")))
		if err != nil {
			c.JSON(404, gin.H{"error": "not found"})
			return
		}
		c.JSON(200, e)
	})
	api.GET("/offices", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,name,address,phone,email,hours,position FROM offices ORDER BY position ASC`)
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var oo []Office
		for rows.Next() {
			if o, err := scanOffice(rows); err == nil {
				oo = append(oo, *o)
			}
		}
		if oo == nil {
			oo = []Office{}
		}
		c.JSON(200, gin.H{"offices": oo})
	})
	api.GET("/leadership", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,name,title,since,photo,position FROM leadership ORDER BY position ASC`)
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var ll []LeadershipMember
		for rows.Next() {
			if l, err := scanLeader(rows); err == nil {
				ll = append(ll, *l)
			}
		}
		if ll == nil {
			ll = []LeadershipMember{}
		}
		c.JSON(200, gin.H{"members": ll})
	})
	api.GET("/faqs", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,question,answer,position,published FROM faqs WHERE published=1 ORDER BY position ASC`)
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var ff []FAQ
		for rows.Next() {
			if f, err := scanFAQ(rows); err == nil {
				ff = append(ff, *f)
			}
		}
		if ff == nil {
			ff = []FAQ{}
		}
		c.JSON(200, gin.H{"faqs": ff})
	})
	api.GET("/hero-slides", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,badge,title,subtitle,image,cta_label,cta_href,cta_external,secondary_label,secondary_href,position,published FROM hero_slides WHERE published=1 ORDER BY position ASC`)
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var ss []HeroSlide
		for rows.Next() {
			if s, err := scanHeroSlide(rows); err == nil {
				ss = append(ss, *s)
			}
		}
		if ss == nil {
			ss = []HeroSlide{}
		}
		c.JSON(200, gin.H{"slides": ss})
	})
	api.GET("/services", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,position,tag,icon_name,title,description,who_eligible,benefits,published FROM services WHERE published=1 ORDER BY position ASC`)
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var ss []Service
		for rows.Next() {
			if s, err := scanService(rows); err == nil {
				ss = append(ss, *s)
			}
		}
		if ss == nil {
			ss = []Service{}
		}
		c.JSON(200, gin.H{"services": ss})
	})
	api.GET("/about", func(c *gin.Context) {
		rows, err := db.Query("SELECT `key`,value FROM site_settings WHERE `key` LIKE 'about_%'")
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		kv := map[string]string{}
		for rows.Next() {
			var k, v string
			rows.Scan(&k, &v)
			kv[k] = v
		}
		var mandate []string
		var highlights, priorities, values, legislation []map[string]string
		json.Unmarshal([]byte(kv["about_mandate"]), &mandate)
		json.Unmarshal([]byte(kv["about_highlights"]), &highlights)
		json.Unmarshal([]byte(kv["about_priorities"]), &priorities)
		json.Unmarshal([]byte(kv["about_values"]), &values)
		json.Unmarshal([]byte(kv["about_legislation"]), &legislation)
		if mandate == nil { mandate = []string{} }
		if highlights == nil { highlights = []map[string]string{} }
		if priorities == nil { priorities = []map[string]string{} }
		if values == nil { values = []map[string]string{} }
		if legislation == nil { legislation = []map[string]string{} }
		c.JSON(200, gin.H{
			"mission":     kv["about_mission"],
			"vision":      kv["about_vision"],
			"mandate":     mandate,
			"highlights":  highlights,
			"priorities":  priorities,
			"values":      values,
			"legislation": legislation,
		})
	})
	api.POST("/contact", func(c *gin.Context) {
		var msg ContactMessage
		if err := c.ShouldBindJSON(&msg); err != nil {
			c.JSON(400, gin.H{"error": "invalid request"})
			return
		}
		db.Exec(`INSERT INTO contact_messages (name,email,subject,message) VALUES (?,?,?,?)`, msg.Name, msg.Email, msg.Subject, msg.Message)
		go sendContactEmail(msg)
		c.JSON(201, gin.H{"message": "Message received. We will respond within 2 business days."})
	})

	// ── Public settings endpoint ────────────────────────────────────────────────
	api.GET("/settings", func(c *gin.Context) {
		rows, err := db.Query("SELECT `key`,value FROM site_settings")
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		out := make(map[string]string)
		for rows.Next() {
			var k, v string
			rows.Scan(&k, &v)
			out[k] = v
		}
		c.JSON(200, out)
	})

	// ── Auth endpoints ──────────────────────────────────────────────────────────
	api.POST("/admin/login", func(c *gin.Context) {
		ip := clientIP(c)
		// Rate limit: 10 attempts per 5 minutes per IP
		if !loginLimiter.allow(ip, 10, 5*time.Minute) {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "too many login attempts, please wait"})
			return
		}
		var b struct {
			Username string `json:"username" binding:"required,max=100"`
			Password string `json:"password" binding:"required,max=200"`
		}
		if err := c.ShouldBindJSON(&b); err != nil {
			c.JSON(400, gin.H{"error": "credentials required"})
			return
		}
		var u User
		var hash string
		if err := db.QueryRow("SELECT id,username,role,password_hash FROM users WHERE username=?", b.Username).Scan(&u.ID, &u.Username, &u.Role, &hash); err != nil || bcrypt.CompareHashAndPassword([]byte(hash), []byte(b.Password)) != nil {
			auditLog(b.Username, "login_failed", "", ip)
			// Generic message — do not reveal whether username exists
			c.JSON(401, gin.H{"error": "invalid credentials"})
			return
		}
		tok, err := generateToken(u)
		if err != nil {
			c.JSON(500, gin.H{"error": "internal server error"})
			return
		}
		// Set httpOnly cookie (8-hour session)
		c.SetCookie("owc_token", tok, 8*3600, "/", "", secureCookies, true)
		auditLog(u.Username, "login_success", "", ip)
		// Also return token in body so the frontend can use Bearer as fallback
		// (required for dev proxy environments where cookie forwarding may vary)
		c.JSON(200, gin.H{"user": u, "token": tok})
	})

	api.POST("/admin/logout", func(c *gin.Context) {
		// Clear the cookie by setting MaxAge to -1
		c.SetCookie("owc_token", "", -1, "/", "", secureCookies, true)
		c.JSON(200, gin.H{"message": "logged out"})
	})

	// ── Authenticated admin routes ──────────────────────────────────────────────
	adm := api.Group("/admin", authMiddleware())
	adm.GET("/me", func(c *gin.Context) {
		c.JSON(200, gin.H{"id": c.GetInt("userID"), "username": c.GetString("username"), "role": c.GetString("role")})
	})
	adm.GET("/stats", func(c *gin.Context) {
		var tn, pn, td int
		db.QueryRow("SELECT COUNT(*) FROM news_articles").Scan(&tn)
		db.QueryRow("SELECT COUNT(*) FROM news_articles WHERE published=1").Scan(&pn)
		db.QueryRow("SELECT COUNT(*) FROM documents").Scan(&td)
		c.JSON(200, gin.H{"totalNews": tn, "publishedNews": pn, "totalDocs": td})
	})
	adm.PUT("/change-password", func(c *gin.Context) {
		var b struct {
			Current string `json:"current" binding:"required"`
			New     string `json:"new"     binding:"required,min=12,max=200"`
		}
		if err := c.ShouldBindJSON(&b); err != nil {
			c.JSON(400, gin.H{"error": "new password must be at least 12 characters"})
			return
		}
		var hash string
		db.QueryRow("SELECT password_hash FROM users WHERE id=?", c.GetInt("userID")).Scan(&hash)
		if bcrypt.CompareHashAndPassword([]byte(hash), []byte(b.Current)) != nil {
			c.JSON(401, gin.H{"error": "current password incorrect"})
			return
		}
		nh, _ := bcrypt.GenerateFromPassword([]byte(b.New), bcrypt.DefaultCost)
		db.Exec("UPDATE users SET password_hash=? WHERE id=?", string(nh), c.GetInt("userID"))
		auditLog(c.GetString("username"), "password_changed", "", clientIP(c))
		c.JSON(200, gin.H{"message": "updated"})
	})

	adm.GET("/news", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,slug,date,month,year,category,title,excerpt,image,author,read_time,body,published,created_at,updated_at FROM news_articles ORDER BY id DESC`)
		if err != nil {
			c.JSON(500, gin.H{"error": "internal server error"})
			return
		}
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var aa []Article
		for rows.Next() {
			if a, e := scanArticle(rows); e == nil {
				aa = append(aa, *a)
			}
		}
		if aa == nil {
			aa = []Article{}
		}
		c.JSON(200, gin.H{"articles": aa, "total": len(aa)})
	})
	adm.GET("/news/:id", func(c *gin.Context) {
		a, err := scanArticle(db.QueryRow(`SELECT id,slug,date,month,year,category,title,excerpt,image,author,read_time,body,published,created_at,updated_at FROM news_articles WHERE id=?`, c.Param("id")))
		if err != nil {
			c.JSON(404, gin.H{"error": "not found"})
			return
		}
		c.JSON(200, a)
	})
	adm.POST("/news", func(c *gin.Context) {
		var in ArticleInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		bj, _ := json.Marshal(in.Body)
		pub := 0
		if in.Published {
			pub = 1
		}
		if in.Author == "" {
			in.Author = "OWC Communications"
		}
		if in.ReadTime == "" {
			in.ReadTime = "3 min read"
		}
		res, err := db.Exec(`INSERT INTO news_articles (slug,date,month,year,category,title,excerpt,image,author,read_time,body,published) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, in.Slug, in.Date, in.Month, in.Year, in.Category, in.Title, in.Excerpt, in.Image, in.Author, in.ReadTime, string(bj), pub)
		if err != nil {
			c.JSON(400, gin.H{"error": "slug may already exist"})
			return
		}
		id, _ := res.LastInsertId()
		auditLog(c.GetString("username"), "news_created", fmt.Sprintf("id=%d slug=%s", id, in.Slug), clientIP(c))
		c.JSON(201, gin.H{"message": "created", "id": id})
	})
	adm.PUT("/news/:id", func(c *gin.Context) {
		var in ArticleInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		bj, _ := json.Marshal(in.Body)
		pub := 0
		if in.Published {
			pub = 1
		}
		db.Exec(`UPDATE news_articles SET slug=?,date=?,month=?,year=?,category=?,title=?,excerpt=?,image=?,author=?,read_time=?,body=?,published=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`, in.Slug, in.Date, in.Month, in.Year, in.Category, in.Title, in.Excerpt, in.Image, in.Author, in.ReadTime, string(bj), pub, c.Param("id"))
		auditLog(c.GetString("username"), "news_updated", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "updated"})
	})
	adm.DELETE("/news/:id", func(c *gin.Context) {
		db.Exec("DELETE FROM news_articles WHERE id=?", c.Param("id"))
		auditLog(c.GetString("username"), "news_deleted", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "deleted"})
	})

	adm.GET("/pages", func(c *gin.Context) {
		rows, err := db.Query("SELECT id,slug,badge,title,subtitle,hero_image,updated_at FROM pages ORDER BY id ASC")
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var pp []PageContent
		for rows.Next() {
			if p, e := scanPage(rows); e == nil {
				pp = append(pp, *p)
			}
		}
		if pp == nil {
			pp = []PageContent{}
		}
		c.JSON(200, gin.H{"pages": pp})
	})
	adm.GET("/pages/:slug", func(c *gin.Context) {
		p, err := scanPage(db.QueryRow("SELECT id,slug,badge,title,subtitle,hero_image,updated_at FROM pages WHERE slug=?", c.Param("slug")))
		if err != nil {
			c.JSON(404, gin.H{"error": "not found"})
			return
		}
		c.JSON(200, p)
	})
	adm.PUT("/pages/:slug", func(c *gin.Context) {
		var in struct {
			Badge     string `json:"badge"`
			Title     string `json:"title"     binding:"required,max=300"`
			Subtitle  string `json:"subtitle"`
			HeroImage string `json:"heroImage"`
		}
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		db.Exec("UPDATE pages SET badge=?,title=?,subtitle=?,hero_image=?,updated_at=CURRENT_TIMESTAMP WHERE slug=?", in.Badge, in.Title, in.Subtitle, in.HeroImage, c.Param("slug"))
		auditLog(c.GetString("username"), "page_updated", "slug="+c.Param("slug"), clientIP(c))
		c.JSON(200, gin.H{"message": "page updated"})
	})

	adm.GET("/menus", func(c *gin.Context) {
		rows, err := db.Query("SELECT id,label,href,position FROM menu_items ORDER BY position ASC")
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var items []MenuItem
		for rows.Next() {
			var m MenuItem
			rows.Scan(&m.ID, &m.Label, &m.Href, &m.Position)
			items = append(items, m)
		}
		if items == nil {
			items = []MenuItem{}
		}
		c.JSON(200, gin.H{"items": items})
	})
	adm.PUT("/menus", func(c *gin.Context) {
		var b struct {
			Items []MenuItem `json:"items" binding:"required"`
		}
		if err := c.ShouldBindJSON(&b); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		db.Exec("DELETE FROM menu_items")
		for i, item := range b.Items {
			db.Exec("INSERT INTO menu_items (label,href,position) VALUES (?,?,?)", item.Label, item.Href, i)
		}
		auditLog(c.GetString("username"), "menu_updated", "", clientIP(c))
		c.JSON(200, gin.H{"message": "menu updated"})
	})

	adm.GET("/documents", func(c *gin.Context) {
		rows, err := db.Query("SELECT id,title,category,filename,original_name,file_size,uploaded_at FROM documents ORDER BY uploaded_at DESC")
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var docs []Document
		for rows.Next() {
			var d Document
			rows.Scan(&d.ID, &d.Title, &d.Category, &d.Filename, &d.OriginalName, &d.FileSize, &d.UploadedAt)
			d.URL = "/uploads/documents/" + d.Filename
			docs = append(docs, d)
		}
		if docs == nil {
			docs = []Document{}
		}
		c.JSON(200, gin.H{"documents": docs, "total": len(docs)})
	})
	adm.PUT("/documents/:id", func(c *gin.Context) {
		var in struct {
			Title    string `json:"title"    binding:"required,max=300"`
			Category string `json:"category" binding:"required,max=100"`
		}
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		db.Exec("UPDATE documents SET title=?,category=? WHERE id=?", in.Title, in.Category, c.Param("id"))
		c.JSON(200, gin.H{"message": "updated"})
	})
	adm.DELETE("/documents/:id", func(c *gin.Context) {
		var fn string
		db.QueryRow("SELECT filename FROM documents WHERE id=?", c.Param("id")).Scan(&fn)
		if fn != "" {
			os.Remove("./uploads/documents/" + fn)
		}
		db.Exec("DELETE FROM documents WHERE id=?", c.Param("id"))
		auditLog(c.GetString("username"), "document_deleted", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "deleted"})
	})

	adm.POST("/upload/image", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(400, gin.H{"error": "file required"})
			return
		}
		// Limit upload size to 10 MB
		if file.Size > 10*1024*1024 {
			c.JSON(400, gin.H{"error": "file too large (max 10 MB)"})
			return
		}
		ext := strings.ToLower(filepath.Ext(file.Filename))
		if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif" && ext != ".webp" {
			c.JSON(400, gin.H{"error": "only jpg, png, gif, webp allowed"})
			return
		}
		fn := fmt.Sprintf("%s%s", uuid.New().String(), ext)
		if err := c.SaveUploadedFile(file, "./uploads/images/"+fn); err != nil {
			c.JSON(500, gin.H{"error": "upload failed"})
			return
		}
		auditLog(c.GetString("username"), "image_uploaded", fn, clientIP(c))
		c.JSON(200, gin.H{"filename": fn, "url": "/uploads/images/" + fn, "size": file.Size})
	})
	adm.GET("/images", func(c *gin.Context) {
		entries, _ := os.ReadDir("./uploads/images")
		type Img struct {
			Filename string `json:"filename"`
			URL      string `json:"url"`
			Size     int64  `json:"size"`
		}
		var imgs []Img
		for _, e := range entries {
			if !e.IsDir() {
				sz := int64(0)
				if info, err := e.Info(); err == nil {
					sz = info.Size()
				}
				imgs = append(imgs, Img{e.Name(), "/uploads/images/" + e.Name(), sz})
			}
		}
		if imgs == nil {
			imgs = []Img{}
		}
		c.JSON(200, gin.H{"images": imgs, "total": len(imgs)})
	})
	adm.DELETE("/images/:filename", func(c *gin.Context) {
		fn := filepath.Base(c.Param("filename"))
		os.Remove("./uploads/images/" + fn)
		auditLog(c.GetString("username"), "image_deleted", fn, clientIP(c))
		c.JSON(200, gin.H{"message": "deleted"})
	})
	adm.POST("/upload/document", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(400, gin.H{"error": "file required"})
			return
		}
		// Limit upload size to 25 MB
		if file.Size > 25*1024*1024 {
			c.JSON(400, gin.H{"error": "file too large (max 25 MB)"})
			return
		}
		ext := strings.ToLower(filepath.Ext(file.Filename))
		if ext != ".pdf" {
			c.JSON(400, gin.H{"error": "only PDF files allowed"})
			return
		}
		title := c.PostForm("title")
		if title == "" {
			title = strings.TrimSuffix(file.Filename, ext)
		}
		if len(title) > 300 {
			title = title[:300]
		}
		cat := c.PostForm("category")
		if cat == "" {
			cat = "General"
		}
		fn := fmt.Sprintf("%s.pdf", uuid.New().String())
		dst := "./uploads/documents/" + fn
		if err := c.SaveUploadedFile(file, dst); err != nil {
			c.JSON(500, gin.H{"error": "upload failed"})
			return
		}
		sz := file.Size
		if f, e := os.Open(dst); e == nil {
			if st, e := f.Stat(); e == nil {
				sz = st.Size()
			}
			f.Close()
		}
		res, _ := db.Exec("INSERT INTO documents (title,category,filename,original_name,file_size) VALUES (?,?,?,?,?)", title, cat, fn, file.Filename, sz)
		id, _ := res.LastInsertId()
		auditLog(c.GetString("username"), "document_uploaded", fmt.Sprintf("id=%d file=%s", id, file.Filename), clientIP(c))
		c.JSON(200, gin.H{"id": id, "filename": fn, "url": "/uploads/documents/" + fn, "size": sz})
	})
	adm.GET("/download/:filename", func(c *gin.Context) {
		fn := filepath.Base(c.Param("filename"))
		f, err := os.Open("./uploads/documents/" + fn)
		if err != nil {
			c.JSON(404, gin.H{"error": "not found"})
			return
		}
		defer f.Close()
		c.Header("Content-Disposition", "attachment; filename=\""+fn+"\"")
		c.Header("Content-Type", "application/pdf")
		io.Copy(c.Writer, f)
	})

	adm.GET("/events", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,title,description,event_date,event_time,location,category,image,published,created_at FROM events ORDER BY event_date ASC`)
		if err != nil {
			c.JSON(500, gin.H{"error": "internal server error"})
			return
		}
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var ee []Event
		for rows.Next() {
			if e, err := scanEvent(rows); err == nil {
				ee = append(ee, *e)
			}
		}
		if ee == nil {
			ee = []Event{}
		}
		c.JSON(200, gin.H{"events": ee, "total": len(ee)})
	})
	adm.GET("/events/:id", func(c *gin.Context) {
		e, err := scanEvent(db.QueryRow(`SELECT id,title,description,event_date,event_time,location,category,image,published,created_at FROM events WHERE id=?`, c.Param("id")))
		if err != nil {
			c.JSON(404, gin.H{"error": "not found"})
			return
		}
		c.JSON(200, e)
	})
	adm.POST("/events", func(c *gin.Context) {
		var in EventInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		pub := 0
		if in.Published {
			pub = 1
		}
		res, err := db.Exec(`INSERT INTO events (title,description,event_date,event_time,location,category,image,published) VALUES (?,?,?,?,?,?,?,?)`,
			in.Title, in.Description, in.EventDate, in.EventTime, in.Location, in.Category, in.Image, pub)
		if err != nil {
			c.JSON(500, gin.H{"error": "internal server error"})
			return
		}
		id, _ := res.LastInsertId()
		auditLog(c.GetString("username"), "event_created", fmt.Sprintf("id=%d title=%s", id, in.Title), clientIP(c))
		c.JSON(201, gin.H{"message": "created", "id": id})
	})
	adm.PUT("/events/:id", func(c *gin.Context) {
		var in EventInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		pub := 0
		if in.Published {
			pub = 1
		}
		db.Exec(`UPDATE events SET title=?,description=?,event_date=?,event_time=?,location=?,category=?,image=?,published=? WHERE id=?`,
			in.Title, in.Description, in.EventDate, in.EventTime, in.Location, in.Category, in.Image, pub, c.Param("id"))
		auditLog(c.GetString("username"), "event_updated", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "updated"})
	})
	adm.DELETE("/events/:id", func(c *gin.Context) {
		db.Exec("DELETE FROM events WHERE id=?", c.Param("id"))
		auditLog(c.GetString("username"), "event_deleted", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "deleted"})
	})

	// ── Offices ─────────────────────────────────────────────────────────────────
	adm.GET("/offices", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,name,address,phone,email,hours,position FROM offices ORDER BY position ASC`)
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var oo []Office
		for rows.Next() {
			if o, err := scanOffice(rows); err == nil {
				oo = append(oo, *o)
			}
		}
		if oo == nil {
			oo = []Office{}
		}
		c.JSON(200, gin.H{"offices": oo})
	})
	adm.POST("/offices", func(c *gin.Context) {
		var in OfficeInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		res, _ := db.Exec(`INSERT INTO offices (name,address,phone,email,hours,position) VALUES (?,?,?,?,?,?)`, in.Name, in.Address, in.Phone, in.Email, in.Hours, in.Position)
		id, _ := res.LastInsertId()
		auditLog(c.GetString("username"), "office_created", fmt.Sprintf("id=%d", id), clientIP(c))
		c.JSON(201, gin.H{"message": "created", "id": id})
	})
	adm.PUT("/offices/reorder", func(c *gin.Context) {
		var b struct {
			IDs []int `json:"ids" binding:"required"`
		}
		if err := c.ShouldBindJSON(&b); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		for i, id := range b.IDs {
			db.Exec("UPDATE offices SET position=? WHERE id=?", i, id)
		}
		c.JSON(200, gin.H{"message": "reordered"})
	})
	adm.PUT("/offices/:id", func(c *gin.Context) {
		var in OfficeInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		db.Exec(`UPDATE offices SET name=?,address=?,phone=?,email=?,hours=?,position=? WHERE id=?`, in.Name, in.Address, in.Phone, in.Email, in.Hours, in.Position, c.Param("id"))
		auditLog(c.GetString("username"), "office_updated", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "updated"})
	})
	adm.DELETE("/offices/:id", func(c *gin.Context) {
		db.Exec("DELETE FROM offices WHERE id=?", c.Param("id"))
		auditLog(c.GetString("username"), "office_deleted", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "deleted"})
	})

	// ── Leadership ───────────────────────────────────────────────────────────────
	adm.GET("/leadership", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,name,title,since,photo,position FROM leadership ORDER BY position ASC`)
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var ll []LeadershipMember
		for rows.Next() {
			if l, err := scanLeader(rows); err == nil {
				ll = append(ll, *l)
			}
		}
		if ll == nil {
			ll = []LeadershipMember{}
		}
		c.JSON(200, gin.H{"members": ll})
	})
	adm.POST("/leadership", func(c *gin.Context) {
		var in LeadershipInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		res, _ := db.Exec(`INSERT INTO leadership (name,title,since,photo,position) VALUES (?,?,?,?,?)`, in.Name, in.Title, in.Since, in.Photo, in.Position)
		id, _ := res.LastInsertId()
		auditLog(c.GetString("username"), "leader_created", fmt.Sprintf("id=%d", id), clientIP(c))
		c.JSON(201, gin.H{"message": "created", "id": id})
	})
	adm.PUT("/leadership/reorder", func(c *gin.Context) {
		var b struct {
			IDs []int `json:"ids" binding:"required"`
		}
		if err := c.ShouldBindJSON(&b); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		for i, id := range b.IDs {
			db.Exec("UPDATE leadership SET position=? WHERE id=?", i, id)
		}
		c.JSON(200, gin.H{"message": "reordered"})
	})
	adm.PUT("/leadership/:id", func(c *gin.Context) {
		var in LeadershipInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		db.Exec(`UPDATE leadership SET name=?,title=?,since=?,photo=?,position=? WHERE id=?`, in.Name, in.Title, in.Since, in.Photo, in.Position, c.Param("id"))
		auditLog(c.GetString("username"), "leader_updated", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "updated"})
	})
	adm.DELETE("/leadership/:id", func(c *gin.Context) {
		db.Exec("DELETE FROM leadership WHERE id=?", c.Param("id"))
		auditLog(c.GetString("username"), "leader_deleted", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "deleted"})
	})

	// ── FAQs ─────────────────────────────────────────────────────────────────────
	adm.GET("/faqs", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,question,answer,position,published FROM faqs ORDER BY position ASC`)
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var ff []FAQ
		for rows.Next() {
			if f, err := scanFAQ(rows); err == nil {
				ff = append(ff, *f)
			}
		}
		if ff == nil {
			ff = []FAQ{}
		}
		c.JSON(200, gin.H{"faqs": ff})
	})
	adm.POST("/faqs", func(c *gin.Context) {
		var in FAQInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		pub := 0
		if in.Published {
			pub = 1
		}
		res, _ := db.Exec(`INSERT INTO faqs (question,answer,position,published) VALUES (?,?,?,?)`, in.Question, in.Answer, in.Position, pub)
		id, _ := res.LastInsertId()
		auditLog(c.GetString("username"), "faq_created", fmt.Sprintf("id=%d", id), clientIP(c))
		c.JSON(201, gin.H{"message": "created", "id": id})
	})
	adm.PUT("/faqs/reorder", func(c *gin.Context) {
		var b struct {
			IDs []int `json:"ids" binding:"required"`
		}
		if err := c.ShouldBindJSON(&b); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		for i, id := range b.IDs {
			db.Exec("UPDATE faqs SET position=? WHERE id=?", i, id)
		}
		c.JSON(200, gin.H{"message": "reordered"})
	})
	adm.PUT("/faqs/:id", func(c *gin.Context) {
		var in FAQInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		pub := 0
		if in.Published {
			pub = 1
		}
		db.Exec(`UPDATE faqs SET question=?,answer=?,position=?,published=? WHERE id=?`, in.Question, in.Answer, in.Position, pub, c.Param("id"))
		auditLog(c.GetString("username"), "faq_updated", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "updated"})
	})
	adm.DELETE("/faqs/:id", func(c *gin.Context) {
		db.Exec("DELETE FROM faqs WHERE id=?", c.Param("id"))
		auditLog(c.GetString("username"), "faq_deleted", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "deleted"})
	})

	// ── Hero Slides ───────────────────────────────────────────────────────────────
	adm.GET("/hero-slides", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,badge,title,subtitle,image,cta_label,cta_href,cta_external,secondary_label,secondary_href,position,published FROM hero_slides ORDER BY position ASC`)
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var ss []HeroSlide
		for rows.Next() {
			if s, err := scanHeroSlide(rows); err == nil {
				ss = append(ss, *s)
			}
		}
		if ss == nil {
			ss = []HeroSlide{}
		}
		c.JSON(200, gin.H{"slides": ss})
	})
	adm.POST("/hero-slides", func(c *gin.Context) {
		var in HeroSlideInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		ext, pub := 0, 0
		if in.CTAExternal {
			ext = 1
		}
		if in.Published {
			pub = 1
		}
		res, _ := db.Exec(`INSERT INTO hero_slides (badge,title,subtitle,image,cta_label,cta_href,cta_external,secondary_label,secondary_href,position,published) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
			in.Badge, in.Title, in.Subtitle, in.Image, in.CTALabel, in.CTAHref, ext, in.SecondaryLabel, in.SecondaryHref, in.Position, pub)
		id, _ := res.LastInsertId()
		auditLog(c.GetString("username"), "slide_created", fmt.Sprintf("id=%d", id), clientIP(c))
		c.JSON(201, gin.H{"message": "created", "id": id})
	})
	adm.PUT("/hero-slides/reorder", func(c *gin.Context) {
		var b struct {
			IDs []int `json:"ids" binding:"required"`
		}
		if err := c.ShouldBindJSON(&b); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		for i, id := range b.IDs {
			db.Exec("UPDATE hero_slides SET position=? WHERE id=?", i, id)
		}
		c.JSON(200, gin.H{"message": "reordered"})
	})
	adm.PUT("/hero-slides/:id", func(c *gin.Context) {
		var in HeroSlideInput
		if err := c.ShouldBindJSON(&in); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		ext, pub := 0, 0
		if in.CTAExternal {
			ext = 1
		}
		if in.Published {
			pub = 1
		}
		db.Exec(`UPDATE hero_slides SET badge=?,title=?,subtitle=?,image=?,cta_label=?,cta_href=?,cta_external=?,secondary_label=?,secondary_href=?,position=?,published=? WHERE id=?`,
			in.Badge, in.Title, in.Subtitle, in.Image, in.CTALabel, in.CTAHref, ext, in.SecondaryLabel, in.SecondaryHref, in.Position, pub, c.Param("id"))
		auditLog(c.GetString("username"), "slide_updated", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "updated"})
	})
	adm.DELETE("/hero-slides/:id", func(c *gin.Context) {
		db.Exec("DELETE FROM hero_slides WHERE id=?", c.Param("id"))
		auditLog(c.GetString("username"), "slide_deleted", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "deleted"})
	})

	adm.GET("/audit-log", func(c *gin.Context) {
		rows, err := db.Query("SELECT id,username,action,detail,ip,ts FROM audit_log ORDER BY ts DESC LIMIT 200")
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		type Entry struct {
			ID       int    `json:"id"`
			Username string `json:"username"`
			Action   string `json:"action"`
			Detail   string `json:"detail"`
			IP       string `json:"ip"`
			TS       string `json:"ts"`
		}
		var entries []Entry
		for rows.Next() {
			var e Entry
			rows.Scan(&e.ID, &e.Username, &e.Action, &e.Detail, &e.IP, &e.TS)
			entries = append(entries, e)
		}
		if entries == nil {
			entries = []Entry{}
		}
		c.JSON(200, gin.H{"log": entries, "total": len(entries)})
	})

	// ── Services ────────────────────────────────────────────────────────────────
	adm.GET("/services", func(c *gin.Context) {
		rows, err := db.Query(`SELECT id,position,tag,icon_name,title,description,who_eligible,benefits,published FROM services ORDER BY position ASC`)
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		var ss []Service
		for rows.Next() {
			if s, err := scanService(rows); err == nil {
				ss = append(ss, *s)
			}
		}
		if ss == nil {
			ss = []Service{}
		}
		c.JSON(200, gin.H{"services": ss})
	})
	adm.POST("/services", func(c *gin.Context) {
		var inp ServiceInput
		if err := c.ShouldBindJSON(&inp); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		if inp.Benefits == nil {
			inp.Benefits = []string{}
		}
		b, _ := json.Marshal(inp.Benefits)
		var maxPos int
		db.QueryRow("SELECT COALESCE(MAX(position),0) FROM services").Scan(&maxPos)
		pub := 0
		if inp.Published {
			pub = 1
		}
		res, err := db.Exec(`INSERT INTO services (position,tag,icon_name,title,description,who_eligible,benefits,published) VALUES (?,?,?,?,?,?,?,?)`,
			maxPos+1, inp.Tag, inp.IconName, inp.Title, inp.Description, inp.WhoEligible, string(b), pub)
		if err != nil {
			c.JSON(500, gin.H{"error": "failed to create service"})
			return
		}
		id, _ := res.LastInsertId()
		auditLog(c.GetString("username"), "service_created", fmt.Sprintf("id=%d title=%s", id, inp.Title), clientIP(c))
		c.JSON(201, gin.H{"id": id})
	})
	adm.PUT("/services/reorder", func(c *gin.Context) {
		var b struct{ IDs []int `json:"ids"` }
		if err := c.ShouldBindJSON(&b); err != nil {
			c.JSON(400, gin.H{"error": "invalid"})
			return
		}
		for i, id := range b.IDs {
			db.Exec("UPDATE services SET position=? WHERE id=?", i+1, id)
		}
		c.JSON(200, gin.H{"message": "reordered"})
	})
	adm.PUT("/services/:id", func(c *gin.Context) {
		var inp ServiceInput
		if err := c.ShouldBindJSON(&inp); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		if inp.Benefits == nil {
			inp.Benefits = []string{}
		}
		b, _ := json.Marshal(inp.Benefits)
		pub := 0
		if inp.Published {
			pub = 1
		}
		db.Exec(`UPDATE services SET tag=?,icon_name=?,title=?,description=?,who_eligible=?,benefits=?,published=? WHERE id=?`,
			inp.Tag, inp.IconName, inp.Title, inp.Description, inp.WhoEligible, string(b), pub, c.Param("id"))
		auditLog(c.GetString("username"), "service_updated", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "updated"})
	})
	adm.DELETE("/services/:id", func(c *gin.Context) {
		db.Exec("DELETE FROM services WHERE id=?", c.Param("id"))
		auditLog(c.GetString("username"), "service_deleted", "id="+c.Param("id"), clientIP(c))
		c.JSON(200, gin.H{"message": "deleted"})
	})

	// ── About page content ───────────────────────────────────────────────────────
	adm.GET("/about", func(c *gin.Context) {
		rows, err := db.Query("SELECT `key`,value FROM site_settings WHERE `key` LIKE 'about_%'")
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		kv := map[string]string{}
		for rows.Next() {
			var k, v string
			rows.Scan(&k, &v)
			kv[k] = v
		}
		var mandate []string
		var highlights, priorities, values, legislation []map[string]string
		json.Unmarshal([]byte(kv["about_mandate"]), &mandate)
		json.Unmarshal([]byte(kv["about_highlights"]), &highlights)
		json.Unmarshal([]byte(kv["about_priorities"]), &priorities)
		json.Unmarshal([]byte(kv["about_values"]), &values)
		json.Unmarshal([]byte(kv["about_legislation"]), &legislation)
		if mandate == nil { mandate = []string{} }
		if highlights == nil { highlights = []map[string]string{} }
		if priorities == nil { priorities = []map[string]string{} }
		if values == nil { values = []map[string]string{} }
		if legislation == nil { legislation = []map[string]string{} }
		c.JSON(200, gin.H{
			"mission": kv["about_mission"], "vision": kv["about_vision"],
			"mandate": mandate, "highlights": highlights,
			"priorities": priorities, "values": values, "legislation": legislation,
		})
	})
	adm.PUT("/about", func(c *gin.Context) {
		var b struct {
			Mission     string              `json:"mission"`
			Vision      string              `json:"vision"`
			Mandate     []string            `json:"mandate"`
			Highlights  []map[string]string `json:"highlights"`
			Priorities  []map[string]string `json:"priorities"`
			Values      []map[string]string `json:"values"`
			Legislation []map[string]string `json:"legislation"`
		}
		if err := c.ShouldBindJSON(&b); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		mandateJSON, _ := json.Marshal(b.Mandate)
		highlightsJSON, _ := json.Marshal(b.Highlights)
		prioritiesJSON, _ := json.Marshal(b.Priorities)
		valuesJSON, _ := json.Marshal(b.Values)
		legislationJSON, _ := json.Marshal(b.Legislation)
		for k, v := range map[string]string{
			"about_mission": b.Mission, "about_vision": b.Vision,
			"about_mandate": string(mandateJSON), "about_highlights": string(highlightsJSON),
			"about_priorities": string(prioritiesJSON), "about_values": string(valuesJSON),
			"about_legislation": string(legislationJSON),
		} {
			db.Exec("INSERT INTO site_settings (`key`,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=VALUES(value)", k, v)
		}
		auditLog(c.GetString("username"), "about_updated", "", clientIP(c))
		c.JSON(200, gin.H{"message": "saved"})
	})

	adm.GET("/settings", func(c *gin.Context) {
		rows, err := db.Query("SELECT `key`,value FROM site_settings")
		if err != nil { c.JSON(500, gin.H{"error": "db error"}); return }
		defer rows.Close()
		out := make(map[string]string)
		for rows.Next() {
			var k, v string
			rows.Scan(&k, &v)
			out[k] = v
		}
		c.JSON(200, out)
	})
	adm.PUT("/settings", func(c *gin.Context) {
		var body map[string]string
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(400, gin.H{"error": "invalid input"})
			return
		}
		for k, v := range body {
			if len(k) > 100 || len(v) > 10000 {
				continue
			}
			db.Exec("INSERT INTO site_settings (`key`,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=VALUES(value)", k, v)
		}
		auditLog(c.GetString("username"), "settings_updated", "", clientIP(c))
		c.JSON(200, gin.H{"message": "settings saved"})
	})

	log.Println("OWC API running on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
