const Student = require('../models/student');

const RegistrationUtils = require('../utils/utils.addStudent');
const generateRegNumber = require('../utils/utils.registration_number');
const generateToken = require('../utils/utils.token')

class StudentAuthController {
    constructor() {
        this.student = new Student();
        this.registrationUtils = new RegistrationUtils();
    }

    addStudent = async (req, res, next) => {
        const userType = req.params.userType;
        const userData = req.body;

        let newUser;
        let regNumber;

        try {

            this.registrationUtils.validateStudentInfo(userData, userType,);
            const { email, parents_name, parents_occupation, role, } = await this.registrationUtils.prepareData(userData);
            switch (userType) {
                case 'student':
                    regNumber = generateRegNumber();
                    newUser = await this.student.AddSingleStudent({
                        ...userData,
                        email,
                        parents_name,
                        parents_occupation,
                        reg_number: regNumber,
                        role,
                    });
                    if (!newUser.reg_number) {
                        throw new CustomError(`Route: not able to get /${regNumber}`, 404)
                    }
                    break;

                default:
                    throw new CustomError(`Route: register/${userType} not found`, 404);


            }
            const token = generateToken(newUser);
            res.status(201).json({ student: newUser, token });
        } catch (error) {
            console.error(`Error registering ${userType}: ${error}`);
            next(error);
        }
    };
}
module.exports = StudentAuthController;
