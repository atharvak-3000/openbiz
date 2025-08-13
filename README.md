# Openbiz Assignment - Udyam Registration Form

A complete full-stack application that scrapes form fields from the Udyam registration website and provides a dynamic form interface with validation.

## 📁 Project Structure

```
openbiz-assignment/
├── scraper/           # Puppeteer web scraper
├── backend/           # Express.js API server
├── frontend/          # React + TypeScript + TailwindCSS
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Install Scraper Dependencies**
   ```bash
   cd scraper
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## 🏃‍♂️ Running the Application

### Step 1: Run the Scraper
```bash
cd scraper
npm run scrape
```
This will:
- Navigate to https://udyamregistration.gov.in/UdyamRegistration.aspx
- Extract form fields from Step 1 (Aadhaar + OTP) and Step 2 (Business details)
- Save the schema to `../backend/formSchema.json`

### Step 2: Start the Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:3001` and provide:
- `GET /schema` - Returns the form schema
- `POST /submit` - Validates and processes form submissions
- `GET /health` - Health check endpoint

### Step 3: Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000` and provide:
- Dynamic form rendering based on the scraped schema
- Two-step form interface (Aadhaar verification → Business details)
- Real-time validation
- Mobile-responsive design

## 🛠️ Features

### Scraper
- **Puppeteer-based web scraping** of Udyam registration form
- **Automatic field detection** with labels, types, and validation patterns
- **Fallback schema** if scraping fails
- **Idempotent operation** - overwrites existing schema

### Backend
- **Express.js API** with CORS support
- **Dynamic form validation** using regex patterns from schema
- **Error handling** with detailed validation messages
- **Health check endpoints**

### Frontend
- **React + TypeScript** for type safety
- **Vite** for fast development and building
- **TailwindCSS** for modern, responsive styling
- **Dynamic form rendering** from JSON schema
- **Two-step form** with progress indicator
- **Real-time validation** and error handling
- **Mobile-first responsive design**

## 📋 Form Fields

### Step 1: Aadhaar Verification
- Aadhaar Number (12 digits)
- OTP (6 digits)

### Step 2: Business Details
- PAN Number (format: ABCDE1234F)
- Business Name
- Business Type (dropdown)
- Mobile Number (10 digits)
- Email Address
- Business Address
- Pincode (6 digits)

## 🔧 Configuration

### Backend Port
The backend runs on port 3001 by default. You can change it by setting the `PORT` environment variable:
```bash
PORT=3002 npm start
```

### Frontend Backend URL
The frontend connects to the backend at `http://localhost:3001`. To change this, modify the `BACKEND_URL` constant in `frontend/src/App.tsx`.

## 🐛 Troubleshooting

### Scraper Issues
- Ensure you have a stable internet connection
- The scraper runs in non-headless mode by default for debugging
- If scraping fails, the backend will create a default schema

### Backend Issues
- Check if port 3001 is available
- Ensure the `formSchema.json` file exists in the backend directory
- Check console logs for detailed error messages

### Frontend Issues
- Ensure the backend is running on the correct port
- Check browser console for network errors
- Verify CORS is properly configured

## 📝 API Endpoints

### GET /schema
Returns the form schema in JSON format.

**Response:**
```json
{
  "step1": [
    {
      "name": "aadhaarNumber",
      "label": "Aadhaar Number",
      "type": "text",
      "validation": "^[0-9]{12}$"
    }
  ],
  "step2": [...]
}
```

### POST /submit
Validates and processes form submissions.

**Request Body:**
```json
{
  "aadhaarNumber": "123456789012",
  "otp": "123456",
  "panNumber": "ABCDE1234F",
  ...
}
```

**Success Response (200):**
```json
{
  "message": "Form submitted successfully",
  "data": {...}
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "details": ["Invalid Aadhaar Number", "Invalid PAN Number"]
}
```

## 🎨 Styling

The application uses TailwindCSS with custom components:
- `.form-input` - Styled form inputs
- `.form-button` - Primary action buttons
- `.form-button-secondary` - Secondary action buttons

## 🔒 Security Notes

- The scraper runs in non-headless mode for debugging
- CORS is enabled for local development
- Form validation is performed on both client and server side
- No sensitive data is stored permanently

## 📄 License

MIT License - feel free to use this project for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note:** This is a demonstration project. The actual Udyam registration process may have additional security measures and requirements.
