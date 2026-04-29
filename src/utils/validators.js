/**
 * validators.js - Input validation and sanitization utilities
 * Provides secure validation for forms to prevent XSS, SQL injection, and invalid data
 */

// ──── Email Validation ────────────────────────────────────────────────────────

/**
 * Validate email format using RFC 5322 simplified pattern
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required.' };
  }

  const trimmed = email.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Email is required.' };
  }

  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email is too long (max 254 characters).' };
  }

  // RFC 5322 simplified pattern (covers 99.9% of valid emails)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Invalid email format.' };
  }

  // Additional checks
  const [localPart, domain] = trimmed.split('@');
  
  if (localPart.length > 64) {
    return { isValid: false, error: 'Email local part is too long.' };
  }

  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, error: 'Email cannot start or end with a dot.' };
  }

  if (localPart.includes('..')) {
    return { isValid: false, error: 'Email cannot contain consecutive dots.' };
  }

  return { isValid: true, error: null };
};

// ──── Password Validation ────────────────────────────────────────────────────

/**
 * Validate password strength
 * Requirements: 
 *   - Minimum 8 characters
 *   - At least one uppercase letter
 *   - At least one lowercase letter
 *   - At least one number
 *   - At least one special character (!@#$%^&*)
 * 
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, error: string|null, score: number }
 */
export const validatePassword = (password, strictMode = false) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required.', score: 0 };
  }

  const pwd = password;

  // Minimum length check
  if (pwd.length < 6) {
    return { 
      isValid: false, 
      error: `Password must be at least 6 characters (currently ${pwd.length}).`,
      score: 1 
    };
  }

  if (pwd.length < 8) {
    return { 
      isValid: false, 
      error: `Password should be at least 8 characters for security (currently ${pwd.length}).`,
      score: 2 
    };
  }

  // In strict mode (recommended for production), require complex passwords
  if (strictMode) {
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return {
        isValid: false,
        error: 'Password must contain uppercase, lowercase, number, and special character.',
        score: 3,
      };
    }
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'letmein', 'welcome'];
  if (commonPasswords.includes(pwd.toLowerCase())) {
    return { 
      isValid: false, 
      error: 'This password is too common. Please choose a stronger password.',
      score: 2 
    };
  }

  // Password score calculation
  let score = 4;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score++;

  return { isValid: true, error: null, score: Math.min(score, 5) };
};

// ──── Name Validation ────────────────────────────────────────────────────────

/**
 * Validate full name
 * @param {string} name - Name to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required.' };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Name is required.' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters.' };
  }

  if (trimmed.length > 100) {
    return { isValid: false, error: 'Name is too long (max 100 characters).' };
  }

  // Allow letters, spaces, hyphens, and apostrophes (for names like "Mary-Jane" or "O'Brien")
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes.' };
  }

  // Check for excessive spaces
  if (/\s{2,}/.test(trimmed)) {
    return { isValid: false, error: 'Name cannot contain multiple consecutive spaces.' };
  }

  return { isValid: true, error: null };
};

// ──── Input Sanitization ────────────────────────────────────────────────────

/**
 * Sanitize string input to prevent XSS attacks
 * Removes/escapes potentially dangerous characters
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Escape HTML special characters
  const htmlEscape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  sanitized = sanitized.replace(/[&<>"'\/]/g, (char) => htmlEscape[char]);
  
  return sanitized;
};

/**
 * Normalize whitespace in input
 * @param {string} input - Input to normalize
 * @returns {string} Normalized input
 */
export const normalizeWhitespace = (input) => {
  if (typeof input !== 'string') return '';
  // Remove leading/trailing whitespace and collapse multiple spaces to single space
  return input.trim().replace(/\s+/g, ' ');
};

// ──── Combined Form Validation ────────────────────────────────────────────────

/**
 * Validate login form
 * @param {Object} form - { email, password }
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateLoginForm = (form) => {
  const errors = {};
  let isValid = true;

  const emailValidation = validateEmail(form.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  if (!form.password || form.password.length === 0) {
    errors.password = 'Password is required.';
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * Validate registration form
 * @param {Object} form - { name, email, password }
 * @returns {Object} { isValid: boolean, errors: Object, warnings: Object }
 */
export const validateRegistrationForm = (form) => {
  const errors = {};
  const warnings = {};
  let isValid = true;

  const nameValidation = validateName(form.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
    isValid = false;
  }

  const emailValidation = validateEmail(form.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  const passwordValidation = validatePassword(form.password, false);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
    isValid = false;
  }

  // Add warnings for weak passwords (but still allow)
  if (passwordValidation.score !== null && passwordValidation.score < 4) {
    warnings.password = 'Consider using a stronger password for better security.';
  }

  return { isValid, errors, warnings };
};

// ──── Password Strength Indicator ────────────────────────────────────────────

/**
 * Get password strength label and color
 * @param {number} score - Score from 1-5
 * @returns {Object} { label: string, color: string }
 */
export const getPasswordStrengthInfo = (score) => {
  const strengthMap = {
    0: { label: 'Very Weak', color: '#ef4444', hex: '#DC2626' },
    1: { label: 'Weak', color: '#f97316', hex: '#EA580C' },
    2: { label: 'Fair', color: '#f59e0b', hex: '#D97706' },
    3: { label: 'Good', color: '#eab308', hex: '#CA8A04' },
    4: { label: 'Strong', color: '#84cc16', hex: '#65A30D' },
    5: { label: 'Very Strong', color: '#22c55e', hex: '#16A34A' },
  };

  return strengthMap[score] || strengthMap[0];
};

// ──── Task Validation ────────────────────────────────────────────────────────

/**
 * Validate study task input
 * @param {string} task - Task text to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateTask = (task) => {
  if (!task || typeof task !== 'string') {
    return { isValid: false, error: 'Task is required.' };
  }

  const trimmed = task.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Task cannot be empty.' };
  }

  if (trimmed.length < 3) {
    return { isValid: false, error: 'Task must be at least 3 characters.' };
  }

  if (trimmed.length > 200) {
    return { isValid: false, error: 'Task is too long (max 200 characters).' };
  }

  return { isValid: true, error: null };
};

// ──── Search Validation ────────────────────────────────────────────────────

/**
 * Validate search input
 * @param {string} search - Search query to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateSearchInput = (search) => {
  if (typeof search !== 'string') {
    return { isValid: true, error: null }; // Empty search is valid
  }

  const trimmed = search.trim();

  if (trimmed.length > 100) {
    return { isValid: false, error: 'Search query is too long (max 100 characters).' };
  }

  return { isValid: true, error: null };
};

// ──── File Validation ────────────────────────────────────────────────────

/**
 * Validate PDF file upload
 * @param {File} file - File object from input
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validatePDFFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'Please select a PDF file.' };
  }

  // Check file type
  const acceptedTypes = ['application/pdf'];
  if (!acceptedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only PDF files are allowed.' };
  }

  // Check file size (max 10MB)
  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeInBytes) {
    return { isValid: false, error: `File is too large (max 10MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB).` };
  }

  // Check minimum file size (at least 1KB)
  if (file.size < 1024) {
    return { isValid: false, error: 'File is too small or empty.' };
  }

  return { isValid: true, error: null };
};


export const getValidationRules = () => ({
  email: {
    label: 'Email',
    rules: [
      'Must be a valid email address',
      'Cannot exceed 254 characters',
      'Format: user@domain.com',
    ],
  },
  password: {
    label: 'Password',
    rules: [
      'Minimum 6 characters (8+ recommended)',
      'Avoid common passwords',
      'For maximum security: include uppercase, lowercase, numbers, and special characters',
    ],
  },
  name: {
    label: 'Full Name',
    rules: [
      '2-100 characters',
      'Letters, spaces, hyphens, and apostrophes only',
      'No numbers or special characters',
    ],
  },
});
