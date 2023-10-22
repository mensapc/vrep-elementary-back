const admin = require("firebase-admin");
const CustomError = require("../utils/CustomError");

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
        .collection("staff")
        .doc(userRecord.uid)
        .set({ staff_id: userRecord.uid, ...data });
      return data;
    } catch (error) {
      console.error("Error register staff:", error);
      if (error.code === "auth/uid-already-exists")
        throw new CustomError("Student with registration number already exists.", 409);
      if (error.code === "auth/email-already-exists")
        throw new CustomError("The email address is already in use by another account.", 409);
      throw new Error("Failed to register staff.");
    }
  };
  // find staff by email
  findStaffByEmail = async (email) => {
    try {
      const querySnapshot = await db.collection("staff").where("email", "==", email).get();
      const staffDoc = querySnapshot.docs[0];
      const staff = staffDoc ? staffDoc.data() : null;
      return staff;
    } catch (error) {
      console.error("Error finding staff by email:", error);
      throw new Error("Failed to find staff.");
    }
  };

  //Get all Staff
  getAllStaff = async () => {
    try {
      const querySnapshot = await db.collection("staff").get();
      const staff = [];
      querySnapshot.forEach((doc) => {
        const staffData = doc.data();
        delete staffData.password;
        staff.push(staffData);
      });

      return staff;
    } catch (error) {
      console.error("Error finding all staff:", error);
      throw new Error("Failed to retrieve staff.", 404);
    }
  };
  // get single staff
  getStaffById = async (staffId) => {
    try {
      const staffSnapshot = await db.collection("staff").doc(staffId).get();
      if (!staffSnapshot.exists) {
        throw CustomError(`Staff with ID ${staffId} not found.`);
      }

      return staffSnapshot.data();
    } catch (error) {
      console.error("Error getting staff by ID:", error);
      throw CustomError("Failed to retrieve staff by ID.", 404);
    }
  };

  // updating staff details
  updateStaffById = async (staff_id, newData) => {
    try {
      const docRef = db.collection("staff").doc(staff_id);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        await docRef.update(newData);
        return newData; // Returns the updated data
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error updating staff by ID:", error);
      throw new Error("Failed to update staff.", 500);
    }
  };
  // delete staff by id
  deleteStaffById = async (staff_id) => {
    try {
      const staffRef = db.collection("staff").doc(staff_id);
      await staffRef.delete();
    } catch (error) {
      if (error.code === "staff/uid-deleted") throw new CustomError("staff ID deleted", 404);
      throw new Error("Failed to delete staff.");
    }
  };
}

module.exports = Staff;
