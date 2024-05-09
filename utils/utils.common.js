const sortActions = (sortby) => {
  switch (sortby) {
    case 'age':
      return { age: 1 };
    case 'date':
      return { created_at: -1 };
    case 'first_name':
      return { first_name: 1 };
    default:
      return { created_at: 1 };
  }
};

const convertSchoolTerms = (term) => {
  const numeric = term.split('term');
  const formattedTerm = numeric[0].concat(' ', 'Term');
  return formattedTerm;
};

module.exports = { sortActions, convertSchoolTerms };
