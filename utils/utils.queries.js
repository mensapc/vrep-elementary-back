class UtilsQueries {

    filterUpdates = (data) => {
        const fieldsToUpdate = Object.keys(data);
        const setClauses = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`);

        const queryParams = fieldsToUpdate.map((field) => data[field]);
        const setClauseString = setClauses.join(', ');

        return { queryParams, setClauseString };


    }

}

module.exports = UtilsQueries;