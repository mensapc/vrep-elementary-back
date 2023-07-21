class UtilsQueries {

    studentUpdate = (studentData) => {
        const fieldsToUpdate = Object.keys(studentData);
        const setClauses = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`);

        const queryParams = fieldsToUpdate.map((field) => studentData[field]);
        const setClauseString = setClauses.join(', ');

        return { queryParams, setClauseString };


    }

}

module.exports = UtilsQueries;