import { useState, useEffect } from 'react';
import { FormSchema, FormData, ValidationError } from './types';

const BACKEND_URL = import.meta.env.PROD 
  ? 'https://openbiz-backend-production.up.railway.app'
  : 'http://localhost:3001';

function App() {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load form schema from backend
  useEffect(() => {
    const loadSchema = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/schema`);
        if (!response.ok) {
          throw new Error('Failed to load form schema');
        }
        const data = await response.json();
        setSchema(data);
      } catch (err) {
        setError('Failed to load form schema. Please ensure the backend is running.');
        console.error('Error loading schema:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSchema();
  }, []);

  // Handle form field changes
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${BACKEND_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        const validationError = result as ValidationError;
        setError(validationError.details?.join(', ') || 'Form submission failed');
      } else {
        setSuccess('Form submitted successfully!');
        setFormData({});
        setCurrentStep(1);
      }
    } catch (err) {
      setError('Failed to submit form. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Render form field
  const renderField = (field: any) => {
    const { name, label, type, validation } = field;
    const value = formData[name] || '';

    if (type === 'select') {
      return (
        <select
          key={name}
          name={name}
          value={value}
          onChange={(e) => handleFieldChange(name, e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select {label}</option>
          <option value="proprietorship">Proprietorship</option>
          <option value="partnership">Partnership</option>
          <option value="llp">LLP</option>
          <option value="private-limited">Private Limited</option>
          <option value="public-limited">Public Limited</option>
        </select>
      );
    }

         if (type === 'textarea') {
       return (
         <textarea
           key={name}
           name={name}
           value={value}
           onChange={(e) => handleFieldChange(name, e.target.value)}
           placeholder={label}
           className="form-input min-h-[100px] resize-none"
           required
         />
       );
     }

    return (
      <input
        key={name}
        type={type}
        name={name}
        value={value}
        onChange={(e) => handleFieldChange(name, e.target.value)}
        placeholder={label}
        className="form-input"
        pattern={validation}
        required
      />
    );
  };

  // Render current step
  const renderStep = () => {
    if (!schema) return null;

    const currentFields = currentStep === 1 ? schema.step1 : schema.step2;

    return (
      <div className="space-y-6">
        {currentFields.map(renderField)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error && !schema) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 form-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Udyam Registration
          </h1>
          <p className="text-gray-600">
            Complete your business registration in two simple steps
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`ml-2 text-sm font-medium ${
                currentStep >= 1 ? 'text-primary-600' : 'text-gray-500'
              }`}>
                Aadhaar Verification
              </div>
            </div>
            <div className="flex-1 mx-4">
              <div className={`h-1 rounded-full ${
                currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'
              }`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`ml-2 text-sm font-medium ${
                currentStep >= 2 ? 'text-primary-600' : 'text-gray-500'
              }`}>
                Business Details
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={(e) => e.preventDefault()}>
            {renderStep()}

            {/* Error/Success Messages */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="form-button"
                  disabled={submitting}
                >
                  Next
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="form-button"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="form-button-secondary"
                    disabled={submitting}
                  >
                    Previous
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Step {currentStep} of 2</p>
        </div>
      </div>
    </div>
  );
}

export default App;
