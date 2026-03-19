<div align="center">

# 🛡️ AI-Powered OSINT Dashboard

### Discover Everything Publicly Exposed About Any Organization

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

<img src="https://img.shields.io/badge/⚠️_For_Authorized_Security_Testing_Only-red?style=for-the-badge" />

<br/><br/>

**Input a domain → Get a full intelligence report with AI-powered risk analysis**

[Features](#features) •
[Quick Start](#quick-start) •
[Screenshots](#screenshots) •
[API Keys](#api-keys) •
[Tech Stack](#tech-stack) •
[Contributing](#contributing)

</div>

---

## 🎯 What It Does

```
🔍 Input:  company domain (e.g., example.com)
📊 Output: Complete OSINT intelligence report
```

The dashboard performs **6 parallel reconnaissance modules** and generates
an **AI-powered risk assessment** — all from a single domain input.

| Module | Description | Source |
|--------|-------------|--------|
| 🌐 **Subdomain Enumeration** | Discovers all subdomains via Certificate Transparency logs | crt.sh, SecurityTrails |
| 📡 **DNS Analysis** | Maps complete DNS records (A, AAAA, MX, NS, TXT, CNAME, SOA) | DNS resolver |
| 🔓 **Port Scanning** | Identifies open ports and running services | Shodan / Socket scan |
| 📧 **Email Discovery** | Finds publicly exposed email addresses | Website scraping, Hunter.io |
| 💀 **Breach Detection** | Checks for known data breaches involving the domain | HaveIBeenPwned |
| 🔧 **Tech Stack Detection** | Fingerprints web technologies, frameworks, and security headers | HTTP analysis |
| 🤖 **AI Risk Summary** | Generates executive risk assessment with prioritized findings | OpenAI GPT-4o-mini |

---

## ✨ Features

- ⚡ **Parallel Scanning** — All 6 modules run simultaneously for speed
- 🤖 **AI-Powered Analysis** — GPT generates executive risk summaries (with local fallback)
- 🎨 **Cyberpunk Dashboard** — Beautiful dark UI with glowing accents and animations
- 📊 **Interactive Charts** — Visual port distribution and risk gauge
- 📥 **Export Reports** — Download as JSON or CSV
- 🔑 **Works Without API Keys** — Free fallbacks for every module
- 🐳 **Docker Ready** — One command deployment
- 📱 **Responsive** — Works on desktop and mobile

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/osint-dashboard.git
cd osint-dashboard
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Add your API keys (optional)
uvicorn app.main:app --reload --port 8000
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

### 4. Open Dashboard

```
Frontend:  http://localhost:3000
Backend:   http://localhost:8000
API Docs:  http://localhost:8000/docs
```

### Docker (Alternative)

```bash
docker-compose up --build
```

---

## 🔑 API Keys

All keys are **optional**. The tool works without any keys using free alternatives.

| Service | Free Tier | Get Key | What It Unlocks |
|---------|-----------|---------|-----------------|
| Shodan | ✅ Free plan | [shodan.io](https://shodan.io) | Better port/service detection |
| HaveIBeenPwned | 💰 Paid API | [haveibeenpwned.com](https://haveibeenpwned.com/API/Key) | Domain breach search |
| SecurityTrails | ✅ Free plan | [securitytrails.com](https://securitytrails.com) | More subdomain results |
| Hunter.io | ✅ Free plan | [hunter.io](https://hunter.io) | Professional email finding |
| OpenAI | 💰 Pay-per-use | [platform.openai.com](https://platform.openai.com) | AI narrative risk reports |

Add keys to `backend/.env`:

```env
SHODAN_API_KEY=your_key_here
HIBP_API_KEY=your_key_here
SECURITYTRAILS_API_KEY=your_key_here
HUNTER_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

---

## 🏗️ Tech Stack

```
Frontend:   React 18 + Tailwind CSS + Framer Motion + Recharts
Backend:    Python + FastAPI + asyncio
APIs:       Shodan, HaveIBeenPwned, SecurityTrails, Hunter.io
AI:         OpenAI GPT-4o-mini (with rule-based fallback)
DNS:        dnspython
Deploy:     Docker / Vercel + Railway
```

---

## 📁 Project Structure

```
osint-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Settings & environment
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic data models
│   │   ├── services/
│   │   │   ├── subdomain_scanner.py
│   │   │   ├── dns_analyzer.py
│   │   │   ├── port_scanner.py
│   │   │   ├── email_finder.py
│   │   │   ├── breach_checker.py
│   │   │   ├── tech_detector.py
│   │   │   └── ai_summarizer.py
│   │   └── routers/
│   │       └── scan.py          # API endpoints
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.js               # Main application
│   │   ├── components/          # React components
│   │   │   ├── Header.jsx
│   │   │   ├── ScanForm.jsx
│   │   │   ├── ScanProgress.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SubdomainPanel.jsx
│   │   │   ├── DnsPanel.jsx
│   │   │   ├── PortPanel.jsx
│   │   │   ├── EmailPanel.jsx
│   │   │   ├── BreachPanel.jsx
│   │   │   ├── TechPanel.jsx
│   │   │   ├── RiskSummary.jsx
│   │   │   └── ExportButton.jsx
│   │   └── services/
│   │       └── api.js           # API client
│   ├── package.json
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/scan/subdomains` | Enumerate subdomains |
| `POST` | `/api/scan/dns` | Analyze DNS records |
| `POST` | `/api/scan/ports` | Scan open ports |
| `POST` | `/api/scan/emails` | Find email addresses |
| `POST` | `/api/scan/breaches` | Check data breaches |
| `POST` | `/api/scan/tech` | Detect technologies |
| `POST` | `/api/scan/summary` | Generate AI risk summary |
| `POST` | `/api/scan/full` | Run all modules at once |

All endpoints accept: `{ "domain": "example.com" }`

---

## ⚠️ Legal Disclaimer

This tool is designed for **authorized security assessments only**.

- ✅ Scan domains you own
- ✅ Scan domains you have written authorization to test
- ✅ Use for educational purposes
- ❌ Do NOT scan domains without permission
- ❌ Do NOT use for malicious purposes

The author is not responsible for misuse of this tool. Always ensure
you have proper authorization before performing any security assessment.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file.

---

<div align="center">

**Built for cybersecurity professionals and ethical hackers**

⭐ Star this repo if you find it useful!Thank You.

</div>
