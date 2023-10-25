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
    async createCourse(courseData) {
        try {
            // Add the courseData to the collection and get the reference
            const courseRef = await this.collectionRef.add(courseData);

            // Get the generated UID (courseID) from the course reference
            const courseID = courseRef.id;

            // Update the course with the assigned courseID
            await courseRef.update({ courseID, classID: courseData.classID });

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
    async createCourseSchem(classSchemData, Email) {
        try {
            // Convert created_At to a Firestore timestamp
            const currentDate = new Date();
            const firestoreTimestamp = admin.firestore.Timestamp.fromDate(currentDate);

            // Add the created_At field to classSchemData
            classSchemData.created_At = firestoreTimestamp;

            // Create a new courseScheme document
            const courseScheme = await this.collectionRefScheme.add(classSchemData);

            // Get the generated UID courseScheme from the reference
            const courseScheme_ID = courseScheme.id;

            // Update the course scheme with the assigned ccourseScheme.id and staff_email
            await courseScheme.update({ courseScheme_ID, staff_email: Email });

            // Get the created courseScheme document
            const createdScheme = await courseScheme.get();

            // Return the class scheme data with the assigned courseScheme.id
            return createdScheme.data();
        } catch (error) {
            console.error('Error creating class scheme:', error);
            throw new Error('Failed to create class scheme.');
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
                    name: courseSchemeData.name,
                    course_name: courseSchemeData.course_name,
                    staff_id: courseSchemeData.staff_id,
                    term_duration: courseSchemeData.term_duration,
                    end_of_term: courseSchemeData.end_of_term,
                    term_limit: courseSchemeData.term_limit,
                    description: courseSchemeData.description,
                    created_At: courseSchemeData.created_At,
                    courseScheme_ID: courseSchemeData.courseScheme_ID,
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

    // Update Course Schema  by courseScheme_ID

    updateCourseSchemeByID = async (courseScheme_ID, updatedData) => {
        try {
            const courseRef = this.collectionRefScheme.doc(courseScheme_ID);

            if (!courseRef) {
                throw new CustomError('Course not found.', 404);
            }
            const courseSnapshot = await courseRef.get();
            if (!courseSnapshot.exists) {
                throw new Error('Course not found.');
            }

            // Convert created_At to a Firestore timestamp
            const currentDate = new Date();
            const firestoreTimestamp = admin.firestore.Timestamp.fromDate(currentDate);

            await courseRef.update(updatedData);

            return {
                ...courseSnapshot.data(),
                ...updatedData,
                created_At: firestoreTimestamp
            };
        } catch (error) {
            console.error('Error updating course by courseID:', error);
            throw new Error('Failed to update course.', 500);
        }
    }



}

module.exports = Course;
