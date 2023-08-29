const admin = require('firebase-admin');
const db = admin.firestore();
const CustomError = require('../utils/CustomError');


class Course {
    constructor() {
        this.collectionRef = db.collection('courses');
    }
    // Create Courses
    async createCourse(courseData) {
        try {
            // Add the courseData to the collection and get the reference
            const courseRef = await this.collectionRef.add(courseData);

            // Get the generated UID (courseID) from the course reference
            const courseID = courseRef.id;

            // Update the course with the assigned courseID
            await courseRef.update({ courseID });

            // Get the created course document
            const createdCourse = await courseRef.get();

            // Return the course data with the assigned courseID
            return createdCourse.data();
        } catch (error) {
            console.error('Error creating course:', error);
            throw new CustomError('Failed to create course.');
        }
    }

    // Get all courses
    async getAllCourses() {
        try {
            const snapshot = await this.collectionRef.get();
            const courses = snapshot.docs.map(doc => doc.data());
            return courses;
        } catch (error) {
            console.error('Error getting all courses:', error);
            throw new Error('Failed to get courses.');
        }
    }
    // Get course By ID
    getCourseById = async (courseID) => {
        try {
            const courseDoc = await db.collection('courses').doc(courseID).get();
            if (courseDoc.exists) {
                return courseDoc.data();
            } else {
                throw new CustomError('Course not found', 404);
            }
        } catch (error) {
            console.error(`Error getting course by ID ${courseID}:`, error);
            throw new Error('Failed to get a course.');
        }
    }



    deleteCourse = async (courseID) => {
        try {
            const docSnapshot = await db.collection('courses').doc(courseID).delete();
            if (docSnapshot.exists) {
                const courseData = docSnapshot.data();
                return courseData;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error deleting course by courseID number:', error);
            throw new Error('Failed to delete course.', 500);
        }
    };

    updateCourseByID = async (courseID, updatedData) => {
        try {
            const courseRef = db.collection('courses').doc(courseID);
            if (!courseRef) {
                throw new CustomError('Course not found.', 404);
            }
            const courseSnapshot = await courseRef.get();
            if (!courseSnapshot.exists) {
                throw new Error('Course not found.');
            }

            await courseRef.update(updatedData);

            return {
                ...courseSnapshot.data(),
                ...updatedData
            };
        } catch (error) {
            console.error('Error updating course by courseID:', error);
            throw new Error('Failed to update course.', 500);
        }
    }


}

module.exports = Course;
