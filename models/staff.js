const admin = require('firebase-admin');
const CustomError = require('../utils/CustomError');

const db = admin.firestore();

class Staff {
  createStaff = async (data) => {
    try {
      const userRecord = await admin.auth().createUser({
        email: data.email,
        password: data.password,
      });
      await admin
        .firestore()
        .collection('staff')
        .doc(userRecord.uid)
        .set({ staff_id: userRecord.uid, ...data });
      return data;
    } catch (error) {
      console.error('Error register staff:', error);
      if (error.code === 'auth/uid-already-exists')
        throw new CustomError('Student with registration number already exists.', 409);
      if (error.code === 'auth/email-already-exists')
        throw new CustomError('The email address is already in use by another account.', 409);
      throw new Error('Failed to register staff.');
    }
  };

  findStaffByEmail = async (email) => {
    try {
      const querySnapshot = await db.collection('staff').where('email', '==', email).get();
      const staffDoc = querySnapshot.docs[0];
      const staff = staffDoc ? staffDoc.data() : null;
      return staff;
    } catch (error) {
      console.error('Error finding staff by email:', error);
      throw new Error('Failed to find staff.');
    }
  };
}

module.exports = Staff;