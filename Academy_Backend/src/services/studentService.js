const Student = require('../models/studentModel');

const studentService = {
    createStudent: async (data) => {
        if (!data) {
            throw new Error('Student data is required');
        }
        return await Student.create(data);
    },

    getStudentById: async (id) => {
        if (!id) {
            throw new Error('Student ID is required');
        }
        return await Student.getById(id);
    },
    updateStudent: async (id, data) => {
        if (!id) {
            throw new Error('Student ID is required');
        }
        return await Student.update(id, data);
    },
    disableStudent: async (id) => {
        return await Student.disable(id);
    },
    enableStudent: async (id) => {
        return await Student.enable(id);
    },
    getStudentsByInstructor: async (instructorId) => {
        if (!instructorId) {
            throw new Error('Instructor ID is required');
        }
        return await Student.getByInstructorId(instructorId);
    },

    getAllStudents: async (filters) => {
        return await Student.getAll(filters);
    },

    getStudentCounts: async () => {
        return await Student.getCounts();
    },

    deleteStudent: async (id) => {
        if (!id) {
            throw new Error('Student ID is required');
        }
        return await Student.delete(id);
    }

};

module.exports = studentService;
