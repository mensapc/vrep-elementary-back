
function generateUniqueRegNumber() {
  const min = 10000000000;
  const max = 99999999999;


  const registrationNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return registrationNumber.toString();
}

module.exports = generateUniqueRegNumber;

