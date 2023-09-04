const admin = require('firebase-admin');
const db = admin.firestore();
const CustomError = require('../utils/CustomError');

class Class {
    constructor() {
        this.collectionRef = db.collection('class');
        this.collectionRefStaff = db.collection('staff')
        this.collectionRefSchem = db.collection('courseSchema')

    }

    // Create a class while referencing staff_id
    async createClass(classData, staffID) {
        try {
            // Create a new class document
            const classRef = await this.collectionRef.add(classData);

            // Get the generated UID (classID) from the class reference
            const classID = classRef.id;

            // Update the class with the assigned classID and staff_id
            await classRef.update({ classID, staff_id: staffID });

            // Get the created class document
            const createdClass = await classRef.get();

            // Return the class data with the assigned classID
            return createdClass.data();
        } catch (error) {
            console.error('Error creating class:', error);
            throw new Error('Failed to create class.');
        }
    }
    // get all classes 
    async getAllClasses() {
        try {
            const snapshot = await this.collectionRef.get();
            const classes = [];

            for (const doc of snapshot.docs) {
                const classData = doc.data();

                // Retrieve staff details based on staffID
                const staff_id = classData.staff_id;
                const staffDoc = await this.collectionRefStaff.doc(staff_id).get();
                const staffData = staffDoc.exists
                    ? {
                        first_name: staffDoc.get('first_name'),
                        role: staffDoc.get('role'),
                        last_name: staffDoc.get('last_name'),
                        email: staffDoc.get('email'),
                    }
                    : null;

                // Combine class data with staff details
                const combinedData = {
                    ...classData,
                    staffDetails: staffData, // Add staff details to the class data
                };

                classes.push(combinedData);
            }

            return classes;
        } catch (error) {
            console.error('Error getting all classes:', error);
            throw new Error('Failed to get classes.');
        }
    }


    // Get class By ID with staff details ( single)
    getClassById = async (classID) => {
        try {
            const classDoc = await this.collectionRef.doc(classID).get();
            if (classDoc.exists) {
                const classData = classDoc.data();

                // Retrieve staff details based on staff_id
                const staff_id = classData.staff_id;
                const staffDoc = await this.collectionRefStaff.doc(staff_id).get();
                const staffData = staffDoc.exists
                    ? {
                        first_name: staffDoc.get('first_name'),
                        role: staffDoc.get('role'),
                        last_name: staffDoc.get('last_name'),
                        email: staffDoc.get('email'),
                    }
                    : null;

                // Combine class data with staff details
                const combinedData = {
                    ...classData,
                    staffDetails: staffData, // Add staff details to the class data
                };

                return combinedData;
            } else {
                throw new CustomError('Class not found', 404);
            }
        } catch (error) {
            console.error(`Error getting class by ID ${classID}:`, error);
            throw new Error('Failed to get a class by id +.', 500);
        }
    }

    // delete class by id
    deleteClass = async (classID) => {
        try {
            await this.collectionRef.doc(classID).delete();
            return { message: 'Deleted successfully' };
        } catch (error) {
            console.error('Error deleting course by classID:', error);
            throw new Error('Failed to delete class.', 500);
        }
    };

    // update class by id 
    updateClass = async (classID, updatedData) => {
        try {
            const classRef = this.collectionRef.doc(classID);

            const classSnapshot = await classRef.get();
            if (!classSnapshot.exists) {
                throw new Error('Class not found.');
            }

            await classRef.update(updatedData);

            return {
                ...classSnapshot.data(),
                ...updatedData
            };
        } catch (error) {
            console.error('Error updating class by classID:', error);
            throw new Error('Failed to update class.', 500);
        }
    }

}

module.exports = Class;