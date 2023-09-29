const formatCurrentDate = () => {
    const currentDate = new Date();

    // Format the date as "4 September 2023 at 20:12:07 UTC"
    const formattedDate = currentDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
    });

    return formattedDate
}

module.exports = formatCurrentDate

