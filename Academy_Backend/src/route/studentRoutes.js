const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/students/count', studentController.getStudentCounts);

// CREATE student
router.post('/students', studentController.createStudent);

// GET all active students
router.get('/students', studentController.getAllStudents);


// GET student by ID
router.get('/students/:id', studentController.getStudentById);

// UPDATE student
router.put('/students/:id', studentController.updateStudent);

router.get('/instructors/:id/students', studentController.getStudentsByInstructor);

router.post('/students/:id/enable', studentController.enableStudent);

router.post('/students/:id/disable', studentController.disableStudent);

router.delete('/students/:id', studentController.deleteStudent);




module.exports = router;
