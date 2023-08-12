const admin = require('firebase-admin');
const CustomError = require('../utils/CustomError');

class Student {
  createStudent = async (data) => {
    try {
      const userRecord = await admin.auth().createUser({
        uid: data.reg_number,
        email: data.email,
        password: data.password,
      });
      await admin
        .firestore()
        .collection('students')
        .doc(userRecord.uid)
        .set({ student_id: userRecord.uid, data });

      return data;
    } catch (error) {
      console.error('Error register student:', error);
      if (error.code === 'auth/uid-already-exists')
        throw new CustomError('Student with registration number already exists.', 409);
      if (error.code === 'auth/email-already-exists')
        throw new CustomError('The email address is already in use by another account.', 409);
      throw new Error('Failed to register student.');
    }
  };
}

module.exports = Student;
