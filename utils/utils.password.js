const CustomError = require('./CustomError');

generateRandomPassword = (length) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

validatePassword = ({ currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new CustomError('Please provide current and new password', 400);
  }
  return;
};

module.exports = { generateRandomPassword, validatePassword };
