const admin = require('firebase-admin');
const CustomError = require('../utils/CustomError');
const generateRegNumber = require('../utils/utils.registration_number');
const db = admin.firestore();

class Student {
  // For Authentication
  createStudent = async (data) => {
    try {
      console.log(data)
      const userRecord = await admin.auth().createUser({
        uid: data.reg_number,
        email: data.email,
        password: data.password,
      });
      await admin
        .firestore()
        .collection('students')
        .doc(userRecord.uid)
        .set({ student_id: userRecord.uid, ...data });
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

  // Finding student by regnumber
  findStudentByRegNumber = async (reg_number) => {
    try {
      const docSnapshot = await db.collection('students').doc(reg_number).get();
      if (docSnapshot.exists) {
        const studentData = docSnapshot.data();
        return studentData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error finding student by registration number:', error);
      throw new Error('Failed to find student.', 500);
    }
  };
  // adding a single student 
  AddSingleStudent = async (data) => {
    try {
      const userRecord = await admin.auth().createUser({
        uid: data.reg_number,
        email: data.email,
        password: data.password,
      })
      await db
        .collection('students')
        .doc(userRecord.uid)
        .set(data)
      return data;
    } catch (error) {
      console.error('Error registering student failed:', error);
      if (error.code === 'auth/credentials-exists')
        throw new CustomError('Student with registration number already exists.', 409);
      if (error.code === 'auth/email-already-exists')
        throw new CustomError('The email address is already in use by another account.', 409);
      throw new Error('Failed to register student.');
    }
  }


  //Finding all students
  findAllStudents = async () => {
    try {
      const querySnapshot = await db.collection('students').get();
      const students = [];
      querySnapshot.forEach((doc) => {
        const studentData = doc.data();
        students.push(studentData);
      });

      return students;
    } catch (error) {
      console.error('Error finding all students:', error);
      throw new Error('Failed to retrieve students.', 404);
    }
  };

  // Updating student details

  updateStudentByRegNumber = async (reg_number, newData) => {
    try {
      const docRef = db.collection('students').doc(reg_number);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        await docRef.update(newData);
        return newData; // Returns the updated data
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error updating student by registration number:', error);
      throw new Error('Failed to update student.', 500);
    }
  };



  // deleting student details 
  deleteStudentByRegNumber = async (reg_number) => {
    try {
      const docSnapshot = await db.collection('students').doc(reg_number).delete();
      if (docSnapshot.exists) {
        const studentData = docSnapshot.data();
        return studentData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error deleting student by registration number:', error);
      throw new Error('Failed to delete student.', 500);
    }
  };

}

module.exports = Student
