const Instructor = require('../models/instructorModel');
const pool = require('../config/db');


const instructorService = {

    createInstructor: async (data) => {
        return await Instructor.create(data);
    },


    getInstructorById: async (id) => {
        return await Instructor.getById(id);
    },

    updateInstructor: async (id, data) => {
        return await Instructor.update(id, data);
    },

    disableInstructor: async (id) => {
        return await Instructor.disable(id);
    },
    enableInstructor: async (id) => {
        return await Instructor.enable(id);
    },

    deleteInstructor: async (id) => {
        return await Instructor.delete(id);
    },


    getAllInstructors: async () => {
        return await Instructor.getAll();
    },

    getPaginatedInstructors: async (page = 1, limit = 5) => {
        const validPage = Math.max(1, parseInt(page));
        const validLimit = Math.min(20, Math.max(1, parseInt(limit)));

        return await Instructor.getPaginated(validPage, validLimit);
    },

    getInstructorCount: async () => {
        return await Instructor.getCounts();
    },

};

module.exports = instructorService;
