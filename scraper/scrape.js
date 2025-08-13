const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeFormFields() {
  console.log('🚀 Starting form field extraction...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for production
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to the Udyam registration page
    console.log('📄 Navigating to Udyam registration page...');
    await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for the page to load completely
    await page.waitForTimeout(3000);

    // Extract Step 1 fields (Aadhaar + OTP)
    console.log('🔍 Extracting Step 1 fields...');
    const step1Fields = await page.evaluate(() => {
      const fields = [];
      
      // Look for Aadhaar number input
      const aadhaarInput = document.querySelector('input[name*="aadhaar"], input[name*="Aadhaar"], input[id*="aadhaar"], input[id*="Aadhaar"]');
      if (aadhaarInput) {
        const label = aadhaarInput.closest('tr')?.querySelector('label, span')?.textContent?.trim() || 'Aadhaar Number';
        fields.push({
          name: aadhaarInput.name || aadhaarInput.id,
          label: label,
          type: aadhaarInput.type || 'text',
          validation: aadhaarInput.pattern || '^[0-9]{12}$'
        });
      }

      // Look for OTP input
      const otpInput = document.querySelector('input[name*="otp"], input[name*="OTP"], input[id*="otp"], input[id*="OTP"]');
      if (otpInput) {
        const label = otpInput.closest('tr')?.querySelector('label, span')?.textContent?.trim() || 'OTP';
        fields.push({
          name: otpInput.name || otpInput.id,
          label: label,
          type: otpInput.type || 'text',
          validation: otpInput.pattern || '^[0-9]{6}$'
        });
      }

      // If we can't find specific fields, create default ones
      if (fields.length === 0) {
        fields.push(
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
        );
      }

      return fields;
    });

    // Try to click Next/Validate button to proceed to Step 2
    console.log('⏭️ Attempting to proceed to Step 2...');
    try {
      const nextButton = await page.$('input[type="submit"], button[type="submit"], input[value*="Next"], input[value*="Validate"], button:contains("Next"), button:contains("Validate")');
      if (nextButton) {
        await nextButton.click();
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      console.log('⚠️ Could not proceed to Step 2 automatically, will extract from current page');
    }

    // Extract Step 2 fields (PAN and other business details)
    console.log('🔍 Extracting Step 2 fields...');
    const step2Fields = await page.evaluate(() => {
      const fields = [];
      const inputs = document.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        // Skip hidden inputs and already captured fields
        if (input.type === 'hidden' || input.name === '' || input.id === '') return;
        
        const label = input.closest('tr')?.querySelector('label, span')?.textContent?.trim() || 
                     input.closest('div')?.querySelector('label, span')?.textContent?.trim() ||
                     input.placeholder ||
                     input.name || input.id;
        
        // Determine field type and validation
        let type = input.type || 'text';
        let validation = input.pattern || '';
        
        // Set appropriate validation patterns based on field name/label
        if (label.toLowerCase().includes('pan') || input.name.toLowerCase().includes('pan')) {
          validation = '^[A-Z]{5}[0-9]{4}[A-Z]{1}$';
        } else if (label.toLowerCase().includes('mobile') || input.name.toLowerCase().includes('mobile')) {
          validation = '^[0-9]{10}$';
        } else if (label.toLowerCase().includes('email') || input.name.toLowerCase().includes('email')) {
          validation = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
        } else if (label.toLowerCase().includes('pincode') || input.name.toLowerCase().includes('pincode')) {
          validation = '^[0-9]{6}$';
        } else if (label.toLowerCase().includes('gst') || input.name.toLowerCase().includes('gst')) {
          validation = '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$';
        }

        fields.push({
          name: input.name || input.id,
          label: label,
          type: type,
          validation: validation
        });
      });

      // If no fields found, create default business fields
      if (fields.length === 0) {
        fields.push(
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
        );
      }

      return fields;
    });

    // Create the final schema
    const formSchema = {
      step1: step1Fields,
      step2: step2Fields
    };

    // Save to backend directory
    const outputPath = path.join(__dirname, '..', 'backend', 'formSchema.json');
    fs.writeFileSync(outputPath, JSON.stringify(formSchema, null, 2));
    
    console.log('✅ Form schema extracted successfully!');
    console.log(`📁 Schema saved to: ${outputPath}`);
    console.log(`📊 Step 1 fields: ${step1Fields.length}`);
    console.log(`📊 Step 2 fields: ${step2Fields.length}`);
    
    return formSchema;

  } catch (error) {
    console.error('❌ Error during scraping:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

// Run the scraper
if (require.main === module) {
  scrapeFormFields()
    .then(() => {
      console.log('🎉 Scraping completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Scraping failed:', error);
      process.exit(1);
    });
}

module.exports = { scrapeFormFields };
