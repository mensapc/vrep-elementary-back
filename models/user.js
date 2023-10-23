const admin = require('firebase-admin');

class User {
  // Method to find user by email
  findUserByEmail = async (email) => {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return userRecord.email ? { id: userRecord.uid, email: userRecord.email } : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user.');
    }
  };

  // Method to find a user by id
  findUserByRegNumber = async (reg_number) => {
    try {
      const userRecord = await admin.auth().getUser(reg_number);
      return userRecord.email ? { id: userRecord.uid, email: userRecord.email } : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find student.', 401);
    }
  };
}

module.exports = User;
