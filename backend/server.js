const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load form schema
function loadFormSchema() {
  try {
    const schemaPath = path.join(__dirname, 'formSchema.json');
    if (fs.existsSync(schemaPath)) {
      const schemaData = fs.readFileSync(schemaPath, 'utf8');
      return JSON.parse(schemaData);
    } else {
      console.warn('⚠️ formSchema.json not found. Creating default schema...');
      return createDefaultSchema();
    }
  } catch (error) {
    console.error('❌ Error loading form schema:', error);
    return createDefaultSchema();
  }
}

// Create default schema if file doesn't exist
function createDefaultSchema() {
  const defaultSchema = {
    step1: [
      {
        name: 'aadhaarNumber',
        label: 'Aadhaar Number',
        type: 'text',
        validation: '^[0-9]{12}$'
      },
      {
        name: 'otp',
        label: 'OTP',
        type: 'text',
        validation: '^[0-9]{6}$'
      }
    ],
    step2: [
      {
        name: 'panNumber',
        label: 'PAN Number',
        type: 'text',
        validation: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
      },
      {
        name: 'businessName',
        label: 'Business Name',
        type: 'text',
        validation: '^[a-zA-Z0-9\\s]{2,50}$'
      },
      {
        name: 'businessType',
        label: 'Business Type',
        type: 'select',
        validation: ''
      },
      {
        name: 'mobileNumber',
        label: 'Mobile Number',
        type: 'text',
        validation: '^[0-9]{10}$'
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        validation: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
      },
      {
        name: 'address',
        label: 'Business Address',
        type: 'textarea',
        validation: '^[a-zA-Z0-9\\s,.-]{10,200}$'
      },
      {
        name: 'pincode',
        label: 'Pincode',
        type: 'text',
        validation: '^[0-9]{6}$'
      }
    ]
  };

  // Save default schema
  const schemaPath = path.join(__dirname, 'formSchema.json');
  fs.writeFileSync(schemaPath, JSON.stringify(defaultSchema, null, 2));
  console.log('✅ Default schema created and saved');
  
  return defaultSchema;
}

// Validation function
function validateField(value, validation) {
  if (!validation) return true; // No validation required
  
  try {
    const regex = new RegExp(validation);
    return regex.test(value);
  } catch (error) {
    console.error('❌ Invalid regex pattern:', validation);
    return true; // Skip validation if regex is invalid
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/schema', (req, res) => {
  try {
    const schema = loadFormSchema();
    res.json(schema);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load form schema' });
  }
});

app.post('/submit', (req, res) => {
  try {
    const formData = req.body;
    const schema = loadFormSchema();
    
    console.log('📝 Received form submission:', formData);
    
    // Validate all fields from both steps
    const allFields = [...schema.step1, ...schema.step2];
    const validationErrors = [];
    
    for (const field of allFields) {
      const value = formData[field.name];
      
      // Skip validation for empty optional fields
      if (!value && field.validation) continue;
      
      // Validate field if value is provided
      if (value && !validateField(value, field.validation)) {
        validationErrors.push(`Invalid ${field.label}`);
      }
    }
    
    if (validationErrors.length > 0) {
      console.log('❌ Validation failed:', validationErrors);
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    // Simulate database save
    console.log('💾 Saving form data to database (simulated)...');
    console.log('✅ Form data saved successfully');
    
    res.status(200).json({
      message: 'Form submitted successfully',
      data: formData
    });
    
  } catch (error) {
    console.error('❌ Error processing form submission:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process form submission'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource was not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Schema endpoint: http://localhost:${PORT}/schema`);
  console.log(`📋 Submit endpoint: http://localhost:${PORT}/submit`);
});

module.exports = app;
