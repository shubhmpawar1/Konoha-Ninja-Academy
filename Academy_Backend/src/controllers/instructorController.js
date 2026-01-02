const { paginategetAll } = require('../models/instructorModel');
const instructorService = require('../services/instructorService');

const instructorController = {
    createInstructor: async (req, res) => {
        try {
            const instructor = await instructorService.createInstructor(req.body);
            res.status(201).json(instructor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getInstructorById: async (req, res) => {
        try {
            const instructor = await instructorService.getInstructorById(req.params.id);
            if (!instructor) {
                return res.status(404).json({ message: 'Instructor not found' });
            }
            res.json(instructor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateInstructor: async (req, res) => {
        try {
            const updatedInstructor = await instructorService.updateInstructor(
                req.params.id,
                req.body
            );
            res.json(updatedInstructor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    disableInstructor: async (req, res) => {
        try {
            const disabledInstructor = await instructorService.disableInstructor(req.params.id);
            res.json(disabledInstructor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    enableInstructor: async (req, res) => {
        try {
            const enabledInstructor = await instructorService.enableInstructor(req.params.id);
            res.json(enabledInstructor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteInstructor: async (req, res) => {
        try {
            const deletedInstructor = await instructorService.deleteInstructor(req.params.id);

            if (!deletedInstructor) {
                return res.status(404).json({ message: 'Instructor not found' });
            }

            return res.status(200).json({ message: 'Instructor deleted successfully' });

        } catch (error) {
            console.error('Delete Instructor Error:', error);

            // PostgreSQL FK constraint violation
            if (error.code === '23001') {
                return res.status(409).json({
                    message: 'Cannot delete instructor because students are assigned to them'
                });
            }

            return res.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    getAllInstructors: async (req, res) => {
        try {
            const instructors = await instructorService.getAllInstructors();
            return res.status(200).json(instructors);
        }
        catch (error) {
            console.error('Get Instructors Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    getPaginated: async (req, res) => {
        try {

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            const result = await instructorService.getPaginatedInstructors(page, limit);

            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    getInstructorCount: async (req, res) => {
        try {
            const counts = await instructorService.getInstructorCount();
            return res.status(200).json(counts);
        } catch (error) {
            console.error('Get Instructor Counts Error:', error);
            return res.status(500).json({
                error: 'Failed to fetch instructor counts'
            });
        }
    }
};

module.exports = instructorController;
