// Carlos Arellano - 101339585

const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        maxlength: 50

    },
    lastName: {
        type: String,
        require: true,
        maxlength: 50

    },
    phoneNumber: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        maxlength: 50
    }
})
const Employees = mongoose.model("Employees", EmployeeSchema)
module.exports = Employees;






