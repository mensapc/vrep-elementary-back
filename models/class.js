const admin = require('firebase-admin');
const db = admin.firestore();
const CustomError = require('../utils/CustomError');

class Class {
    constructor() {
        this.collectionRef = db.collection('class');
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
            snapshot.forEach(doc => {
                classes.push(doc.data());
            });
            return classes;
        } catch (error) {
            console.error('Error getting all classes:', error);
            throw new Error('Failed to get classes.');
        }
    }

    getClassById = async (classID) => {
        try {
            const classDoc = await this.collectionRef.doc(classID).get();
            if (classDoc.exists) {
                return classDoc.data();
            } else {
                throw new CustomError('Class not found', 404);
            }
        } catch (error) {
            console.error(`Error getting class by ID ${classID}:`, error);
            throw new Error('Failed to get a class.');
        }
    }


    deleteClass = async (classID) => {
        try {
            const docSnapshot = await this.collectionRef.doc(classID).delete();
            if (docSnapshot.exists) {
                const courseData = docSnapshot.data();
                return courseData;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error deleting course by classID number:', error);
            throw new Error('Failed to delete course.', 500);
        }
    };


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