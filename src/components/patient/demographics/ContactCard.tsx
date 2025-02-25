import React from 'react';
import { Phone } from 'lucide-react';
import { Card } from '../../ui/Card';

interface ContactCardProps {
  phone: string;
  email: string;
  onUpdateContact?: (phone: string, email: string) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  phone,
  email,
  onUpdateContact
}) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editedPhone, setEditedPhone] = React.useState(phone);
  const [editedEmail, setEditedEmail] = React.useState(email);
  const [phoneError, setPhoneError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    setEditedPhone(phone);
    setEditedEmail(email);
  }, [phone, email]);

  const handlePhoneValidation = (input: HTMLInputElement) => {
    if (!input.validity.valid && input.value) {
      setPhoneError(input.validationMessage || 'Please enter a valid phone number');
      return false;
    } else {
      setPhoneError('');
      return true;
    }
  };

  const handleEmailValidation = (input: HTMLInputElement) => {
    if (!input.validity.valid && input.value) {
      setEmailError(input.validationMessage || 'Please enter a valid email address');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const handleSave = () => {
    if (!formRef.current) return;

    const phoneInput = formRef.current.querySelector('input[type="tel"]') as HTMLInputElement;
    const emailInput = formRef.current.querySelector('input[type="email"]') as HTMLInputElement;

    const isPhoneValid = handlePhoneValidation(phoneInput);
    const isEmailValid = handleEmailValidation(emailInput);

    if (isPhoneValid && isEmailValid) {
      onUpdateContact?.(editedPhone, editedEmail);
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    setEditedPhone(phone);
    setEditedEmail(email);
    setPhoneError('');
    setEmailError('');
    setIsEditMode(false);
  };

  return (
    <Card 
      title="Contact" 
      icon={<Phone size={16} />} 
      variant="purple"
      headerContent={
        onUpdateContact && (
          isEditMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Save changes"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Cancel editing"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsEditMode(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          )
        )
      }
    >
      <div className="grid gap-2 text-sm">
        {isEditMode ? (
          <form ref={formRef} onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="grid gap-2">
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Phone:</span>
                <div className="flex-1">
                  <input
                    type="tel"
                    value={editedPhone}
                    onChange={(e) => {
                      setEditedPhone(e.target.value);
                      if (!e.target.value) {
                        setPhoneError('');
                      }
                    }}
                    onBlur={(e) => handlePhoneValidation(e.target)}
                    className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                      phoneError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                    pattern="[0-9+\-\s()]{6,}"
                    title="Please enter a valid phone number (minimum 6 digits, can contain +, -, spaces, and parentheses)"
                  />
                  {phoneError && (
                    <p className="mt-1 text-xs text-red-500">{phoneError}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Email:</span>
                <div className="flex-1">
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => {
                      setEditedEmail(e.target.value);
                      if (!e.target.value) {
                        setEmailError('');
                      }
                    }}
                    onBlur={(e) => handleEmailValidation(e.target)}
                    className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                    required={editedEmail.length > 0}
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-500">{emailError}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        ) : (
          <>
            {phone && (
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Phone:</span>
                <span>{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex gap-4">
                <span className="text-gray-500 w-20">Email:</span>
                <span>{email}</span>
              </div>
            )}
            {!phone && !email && (
              <div className="text-gray-500 italic">No contact information available</div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
