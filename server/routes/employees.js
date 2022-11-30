// Carlos Arellano - 101339585

const express = require('express');
const EmployeeModel = require('../models/Employee');
const router = express.Router();



// Get All employees
router.get('/', async (req, res) => {
    try {
        const employee = await EmployeeModel.find();
        res.status(200).send(employee)
    } catch (error) {
        res.status(500).json({message: 'No Employees Found'})
        
    }
});

//Create New Employee
router.post("/add", async (req, res) => {
    const { firstName, lastName, phoneNumber, email } = req.body;

    if (typeof firstName === 'undefined' || lastName === 'undefined' || phoneNumber === 'undefined' || email === 'undefined') {
       // res.status(422).send("please fill out the form");
       res.status(422).send("please fill out the form");
    }


    try {
        
        const preuser = await EmployeeModel.findOne({ email: email });
        console.log(preuser);

        if (preuser) {
            res.status(422).send({message: 'This employee has already been added'});
        } else {
            const addEmployee = new EmployeeModel({
                firstName, lastName, phoneNumber, email
            });

            await addEmployee.save();
            res.status(201).send(addEmployee);
            console.log(addEmployee);
        }

    } catch (error) {
        res.status(422).send(error);
    }
});

// Get Employee By Id
router.get('/:eid', async (req, res) => {
    try {
        console.log(req.body);
        const employeeById = await EmployeeModel.findById(req.params.eid);
        res.status(200).send(employeeById);       
    } catch (error) {
        res.status(500).send({ message: error.message })
    } 
});

//Update Employee By Id
router.put('/edit/:eid', async (req, res) => {
    try {
        console.log(req.body);
        const { eid } = req.params;
        const updateEmployee = await EmployeeModel.findByIdAndUpdate(eid,req.body);
        const ne = await updateEmployee.save()
        res.status(202).send(ne);        
    } catch (error) {
        res.status(500).send(error);
    }    
});

//Delete Employee By Id
router.delete('/delete/:eid', async (req, res) => {
    try {
        const employee = await EmployeeModel.findByIdAndDelete(req.params.eid);
        if (!employee) {
            res.status(404).send("No employee found");
        }
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send("Employee was not removed");
    }
}
);

module.exports = router;

