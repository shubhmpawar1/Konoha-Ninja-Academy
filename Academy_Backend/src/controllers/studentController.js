const { enable } = require('../models/studentModel');
const studentService = require('../services/studentService');

const studentController = {

    // CREATE student
    createStudent: async (req, res) => {
        try {
            const {
                name,
                jutsu_type,
                chakra_type,
                signature_jutsu,
                summon_type,
                instructor_id
            } = req.body;

            if (!name || !instructor_id) {
                return res.status(400).json({
                    error: 'name and instructor_id are required'
                });
            }

            const newStudent = await studentService.createStudent({
                name,
                jutsu_type,
                chakra_type,
                signature_jutsu,
                summon_type,
                instructor_id
            });

            return res.status(201).json(newStudent);

        } catch (error) {
            console.error('Create Student Error:', error.message);
            return res.status(500).json({ error: error.message });
        }
    },

   

    // GET student by ID
    getStudentById: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    error: 'Student ID must be a number'
                });
            }

            const student = await studentService.getStudentById(id);

            if (!student) {
                return res.status(404).json({
                    error: 'Student not found'
                });
            }

            return res.status(200).json(student);

        } catch (error) {
            console.error('Get Student By ID Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // UPDATE student
    updateStudent: async (req, res) => {
        try {
            const { id } = req.params;

            const updatedStudent = await studentService.updateStudent(id, req.body);

            if (!updatedStudent) {
                return res.status(404).json({ error: 'Student not found' });
            }

            return res.status(200).json(updatedStudent);

        } catch (error) {
            console.error('Update Student Error:', error.message);
            return res.status(500).json({ error: error.message });
        }
    },



    getStudentsByInstructor: async (req, res) => {
        try {
            const { id } = req.params; // instructor_id

            const students = await studentService.getStudentsByInstructor(id);

            return res.status(200).json(students);

        } catch (error) {
            console.error('Get Students By Instructor Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getAllStudents: async (req, res) => {
        try {
            const filters = {
                name: req.query.name,
                jutsu_type: req.query.jutsu_type,
                chakra_type: req.query.chakra_type
            };

            const students = await studentService.getAllStudents(filters);

            return res.status(200).json(students);

        } catch (error) {
            console.error('Get Students Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getStudentCounts: async (req, res) => {
        try {
            const counts = await studentService.getStudentCounts();
            return res.status(200).json(counts);
        } catch (error) {
            console.error('Get Student Counts Error:', error);
            return res.status(500).json({
                error: 'Failed to fetch student counts'
            });
        }
    },

    enableStudent: async (req, res) => {
        try {
            const enabledStudent = await studentService.enableStudent(req.params.id);
            res.json(enabledStudent);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }  
    },

    disableStudent: async (req, res) => {
        try {
            const disabledStudent = await studentService.disableStudent(req.params.id);
            res.json(disabledStudent);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteStudent: async (req, res) => {
        try {
            const { id } = req.params;  

            const deletedStudent = await studentService.deleteStudent(id);

            if (!deletedStudent) {
                return res.status(404).json({ error: 'Student not found' });
            }

            return res.status(200).json({ message: 'Student deleted successfully' });

        } catch (error) {
            console.error('Delete Student Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = studentController;
