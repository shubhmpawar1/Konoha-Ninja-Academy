const pool = require('../config/db');

const Student = {

    // CREATE student
    create: async (data) => {
        const {
            name,
            jutsu_type,
            chakra_type,
            signature_jutsu,
            summon_type,
            instructor_id
        } = data;

        const result = await pool.query(
            `
            INSERT INTO students
            (name, jutsu_type, chakra_type, signature_jutsu, summon_type, instructor_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                name,
                jutsu_type,
                chakra_type,
                signature_jutsu,
                summon_type,
                instructor_id
            ]
        );

        return result.rows[0];
    },



    // GET student by ID
    getById: async (id) => {
        const result = await pool.query(
            `
            SELECT *
            FROM students
            WHERE id = $1 AND is_active = true
            `,
            [id]
        );

        return result.rows[0];
    },

    // UPDATE student
    update: async (id, data) => {
        const {
            name,
            jutsu_type,
            chakra_type,
            signature_jutsu,
            summon_type,
            instructor_id
        } = data;

        const result = await pool.query(
            `
            UPDATE students
            SET
                name = COALESCE($1, name),
                jutsu_type = COALESCE($2, jutsu_type),
                chakra_type = COALESCE($3, chakra_type),
                signature_jutsu = COALESCE($4, signature_jutsu),
                summon_type = COALESCE($5, summon_type),
                instructor_id = COALESCE($6, instructor_id),
                updated_at = NOW()
            WHERE id = $7 AND is_active = true
            RETURNING *
            `,
            [
                name,
                jutsu_type,
                chakra_type,
                signature_jutsu,
                summon_type,
                instructor_id,
                id
            ]
        );

        return result.rows[0];
    },

    delete: async (id) => {
        const result = await pool.query(
            `
            DELETE FROM students
            WHERE id = $1
            `,
            [id]
        );

        return result.rowCount > 0;
    },

    softDelete: async (id) => {
        const result = await pool.query(
            `
            UPDATE students
            SET is_active = false,
                updated_at = NOW()
            WHERE id = $1 AND is_active = true
            RETURNING id
            `,
            [id]
        );

        return result.rowCount > 0;
    },

    getByInstructorId: async (instructorId) => {
        const result = await pool.query(
            'SELECT * FROM students WHERE instructor_id = $1 AND is_active = true',
            [instructorId]
        );
        return result.rows;
    },

    getAll: async (filters = {}) => {
        let query = 'SELECT * FROM students WHERE 1=1';
        const values = [];
        let counter = 1;

        if (filters.name) {
            query += ` AND name ILIKE $${counter}`;
            values.push(`%${filters.name}%`);
            counter++;
        }
        if (filters.jutsu_type) {
            query += ` AND jutsu_type ILIKE $${counter}`;
            values.push(`%${filters.jutsu_type}%`);
            counter++;
        }
        if (filters.chakra_type) {
            query += ` AND chakra_type ILIKE $${counter}`;
            values.push(`%${filters.chakra_type}%`);
            counter++;
        }

        const result = await pool.query(query, values);
        return result.rows;
    },

    enable: async (id) => {
        const result = await pool.query(
            `UPDATE students
             SET is_active=true, updated_at=NOW()
             WHERE id=$1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    },

    disable: async (id) => {
        const result = await pool.query(
            `UPDATE students
             SET is_active=false, updated_at=NOW()
             WHERE id=$1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    },

    countAll: async () => {
        const result = await pool.query(
            `SELECT COUNT(*) FROM students`
        );
        return parseInt(result.rows[0].count);
    },

    countActive: async () => {
        const result = await pool.query(
            `SELECT COUNT(*) FROM students WHERE is_active = true`
        );
        return parseInt(result.rows[0].count);
    },

    countDisabled: async () => {
        const result = await pool.query(
            `SELECT COUNT(*) FROM students WHERE is_active = false`
        );
        return parseInt(result.rows[0].count);
    },

    getCounts: async () => {
        const query = `
            SELECT 
                COUNT(*)::int AS total_students,
                COUNT(*) FILTER (WHERE is_active = true)::int AS active_students,
                COUNT(*) FILTER (WHERE is_active = false)::int AS disabled_students
            FROM students
        `;

        const result = await pool.query(query);
        return result.rows[0];
    }


};

module.exports = Student;
