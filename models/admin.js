const admin = require('firebase-admin');
const CustomError = require('../utils/CustomError');

const db = admin.firestore();

class Admin {
  createAdmin = async (data) => {
    try {
      const userRecord = await admin.auth().createUser({
        uid: data.reg_number,
        email: data.email,
        password: data.password,
      });
      await admin
        .firestore()
        .collection('admins')
        .doc(userRecord.uid)
        .set({ admin_id: userRecord.uid, ...data });
      return data;
    } catch (error) {
      console.error('Error register admin:', error);
      if (error.code === 'auth/uid-already-exists')
        throw new CustomError('Student with registration number already exists.', 409);
      if (error.code === 'auth/email-already-exists')
        throw new CustomError('The email address is already in use by another account.', 409);
      throw new Error('Failed to register admin.');
    }
  };

  findAdminByEmail = async (email) => {
    try {
      const querySnapshot = await db.collection('admins').where('email', '==', email).get();
      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc ? adminDoc.data() : null;
      return adminData;
    } catch (error) {
      console.error('Error finding admin by email:', error);
      throw new Error('Failed to find admin.');
    }
  };
}

module.exports = Admin;