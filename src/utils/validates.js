export const validateEmail = (email) => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regex.test(email);
};

export const isPasswordValid = (password) => {
  // Check password length from 8 to 50 characters
  if (password.length < 8 || password.length > 50) {
    return false;
  }

  // Check password contains special characters
  if (!/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password)) {
    return false;
  }

  // Check password contains at least one uppercase character
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Check password contains at least one lowercase character
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check password contains at least one number
  if (!/[0-9]/.test(password)) {
    return false;
  }

  return true;
};

export const isFullNameValid = (fullName) => {
  const fullNameRegex = /^[a-zA-ZÀ-ỹ ]+$/;
  return (
    fullNameRegex.test(fullName) &&
    fullName.length >= 3 &&
    fullName.length <= 100
  );
};
