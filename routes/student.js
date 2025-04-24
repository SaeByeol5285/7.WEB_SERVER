// =======================공통코드============================
const express = require('express');
const db = require('../db');
const router = express.Router();
// ==========================================================

router.get("/", async (req, res) => {
    let { searchOption, keyword, orderOption, orderColumn } = req.query;

    try {
        let query = `SELECT * FROM STUDENT WHERE 1=1`;
        const params = [];
        if (searchOption == 'all'){
            query += ` AND (stu_name LIKE ? OR stu_dept LIKE ?)`;
            params.push(`%${keyword}%`, `%${keyword}%`);
        } else if (searchOption == 'name'){
            query += ` AND stu_name LIKE ?`;
            params.push(`%${keyword}%`);
        } else if (searchOption == 'dept'){
            query += ` AND stu_dept LIKE ?`;
            params.push(`%${keyword}%`);
        }

        // query += ` ORDER BY B.CDATETIME DESC LIMIT ? OFFSET ?`;
        // params.push(Number(pageSize), Number(page));
        query += ` ORDER BY ${orderColumn} ${orderOption}`;

        let [list] = await db.query(query, params);

        res.json({
            message : "result",
            list : list,
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})




module.exports = router;