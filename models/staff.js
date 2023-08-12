const admin = require('firebase-admin');

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
}

module.exports = Staff;
