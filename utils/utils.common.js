const sortActions = (sortby) => {
  switch (sortby) {
    case 'age':
      return { age: 1 };
    case 'date':
      return { created_at: -1 };
    case 'name':
      return { first_name: 1 };
    default:
      return { created_at: 1 };
  }
};

module.exports = { sortActions };
