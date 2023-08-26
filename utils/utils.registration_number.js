
// checks if the generated registration number already exists in a set or an array.
// If it exists, generate a new one until you find a unique registration number. 
const usedRegistrationNumbers = new Set();

function generateUniqueRegNumber() {
  const min = 10000000000;
  const max = 99999999999;

  let registrationNumber;
  do {
    registrationNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (
    usedRegistrationNumbers.has(registrationNumber.toString()) ||
    !/^(?!0)[1-9][0-9]{9}$/.test(registrationNumber.toString())
  );

  usedRegistrationNumbers.add(registrationNumber.toString());
  return registrationNumber.toString();
}

module.exports = generateUniqueRegNumber;

