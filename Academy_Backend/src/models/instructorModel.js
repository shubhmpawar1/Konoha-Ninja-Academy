const pool = require('../config/db');

const Instructor = {
    create: async (data) => {
        const { name, jutsu_type, chakra_type, signature_jutsu, summon_type } = data;
        const result = await pool.query(
            `INSERT INTO instructors (name, jutsu_type, chakra_type, signature_jutsu, summon_type)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, jutsu_type, chakra_type, signature_jutsu, summon_type]
        );
        return result.rows[0];
    },
    getById: async (id) => {
        const result = await pool.query(
            `SELECT * FROM instructors WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },
    update: async (id, data) => {
        const { name, jutsu_type, chakra_type, signature_jutsu, summon_type } = data;
        const result = await pool.query(
            `UPDATE instructors
             SET name=$1, jutsu_type=$2, chakra_type=$3, signature_jutsu=$4, summon_type=$5, updated_at=NOW()
             WHERE id=$6 RETURNING *`,
            [name, jutsu_type, chakra_type, signature_jutsu, summon_type, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await pool.query(
            `DELETE FROM instructors WHERE id=$1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    },

    disable: async (id) => {
        const result = await pool.query(
            `UPDATE instructors SET is_active=false, updated_at=NOW() WHERE id=$1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    },

    enable: async (id) => {
        const result = await pool.query(
            `UPDATE instructors SET is_active=true, updated_at=NOW() WHERE id=$1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    },

    getAll: async () => {
        const result = await pool.query('SELECT * FROM instructors ORDER BY id ASC ',);

        return result.rows
    },

    getPaginated: async (page = 1, limit = 5) => {
        const offset = (page - 1) * limit;


        const countResult = await pool.query(
            `SELECT COUNT(*)::int AS total FROM instructors`
        );
        const total = countResult.rows[0].total;


        const dataResult = await pool.query(
            `SELECT * FROM instructors ORDER BY id ASC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        return {
            data: dataResult.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        };
    },

    getCounts: async () => {
        const query = `
            SELECT 
                COUNT(*)::int AS total_instructors,
                COUNT(*) FILTER (WHERE is_active = true)::int AS active_instructors,
                COUNT(*) FILTER (WHERE is_active = false)::int AS disabled_instructors
            FROM instructors
        `;

        const result = await pool.query(query);
        return result.rows[0];
    }


};

module.exports = Instructor;
