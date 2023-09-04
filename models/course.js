const admin = require('firebase-admin');
const db = admin.firestore();
const CustomError = require('../utils/CustomError');


class Course {
    constructor() {
        this.collectionRef = db.collection('courses');
        this.collectionClassRef = db.collection('class')
        this.collectionRefScheme = db.collection('courseSchema')
        this.collectionRefStaff = db.collection('staff')
    }
    // Create Courses
    async createCourse(courseData, classID) {
        try {
            // Add the courseData to the collection and get the reference
            const courseRef = await this.collectionRef.add(courseData);

            // Get the generated UID (courseID) from the course reference
            const courseID = courseRef.id;

            // Update the course with the assigned courseID
            await courseRef.update({ courseID, classID: classID });

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
            const courses = [];

            for (const doc of snapshot.docs) {
                const courseData = doc.data();
                const classID = courseData.classID;

                // Retrieve class details based on classID
                const classDoc = await this.collectionClassRef.doc(classID).get();
                const classDetails = classDoc.exists ? classDoc.data() : null;

                // Combine course data with class details
                const combinedData = {
                    ...courseData,
                    classDetails, // Add class details to the course data
                };

                courses.push(combinedData);
            }

            return courses;
        } catch (error) {
            console.error('Error getting all courses:', error);
            throw new Error('Failed to get courses.');
        }
    }

    // Get course By ID with class details
    getCourseById = async (courseID) => {
        try {
            const courseDoc = await this.collectionRef.doc(courseID).get();
            if (courseDoc.exists) {
                const courseData = courseDoc.data();
                const classID = courseData.classID;

                // Retrieve class details based on classID
                const classDoc = await this.collectionClassRef.doc(classID).get();
                const classDetails = classDoc.exists ? classDoc.data() : null;

                // Combine course data with class details
                const combinedData = {
                    ...courseData,
                    classDetails, // Add class details to the course data
                };

                return combinedData;
            } else {
                throw new CustomError('Course not found', 404);
            }
        } catch (error) {
            console.error(`Error getting course by ID ${courseID}:`, error);
            throw new Error('Failed to get a course.');
        }
    }



    // Delete course by id 
    deleteCourse = async (courseID) => {
        try {
            await db.collection('courses').doc(courseID).delete();
            return { message: 'Deleted successfully' };
        } catch (error) {
            console.error('Error deleting course by courseID:', error);
            throw new Error('Failed to delete course.', 500);
        }
    };

    // update course by Id

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

    // Create a course scheme
    async createCourseSchem(classSchemData, staffID) {
        try {
            // Create a new courseSchem document
            const courseScheme = await this.collectionRefScheme.add(classSchemData);

            // Get the generated UID (classID) from the c reference
            const courseSchemID = courseScheme.id;

            // Update the course with the assigned classID and staff_id
            await courseScheme.update({ courseSchemID, staff_id: staffID });

            // Get the created class document
            const createdScheme = await courseScheme.get();

            // Return the class data with the assigned classID
            return createdScheme.data();
        } catch (error) {
            console.error('Error creating class:', error);
            throw new Error('Failed to create class.');
        }
    }


    // Get all course schemes with staff details
    async getAllCourseSchemes() {
        try {
            const snapshot = await this.collectionRefScheme.get();
            const courseSchemes = [];

            for (const doc of snapshot.docs) {
                const courseSchemeData = doc.data();
                const staffID = courseSchemeData.staff_id;

                // Retrieve staff details based on staffID
                const staffDoc = await this.collectionRefStaff.doc(staffID).get();
                const staffDetails = staffDoc.exists
                    ? {
                        first_name: staffDoc.get('first_name'),
                        role: staffDoc.get('role'),
                        last_name: staffDoc.get('last_name'),
                        email: staffDoc.get('email'),
                    }
                    : null;

                // Combine course scheme data with staff details
                const combinedData = {
                    ...courseSchemeData,
                    staffDetails, // Add staff details to the course scheme data
                };

                courseSchemes.push(combinedData);
            }

            return courseSchemes;
        } catch (error) {
            console.error('Error getting all course schemes:', error);
            throw new Error('Failed to get course schemes.');
        }
    }


}

module.exports = Course;
