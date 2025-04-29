const express = require('express');
const db = require('../db');
const router = express.Router();

//api
router.get("/", async (req, res) => {
    try {
        let [list] = await db.query("SELECT * FROM TBL_FEED");

        res.json({
            message: "result",
            list: list
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.delete("/:id", async (req, res) => {
    let { id } = req.params;

    try {
        let result = await db.query("DELETE FROM TBL_FEED WHERE id = " + id);

        res.json({
            message: "삭제되었습니다.",
            result: result,
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.post("/", async (req, res) => {
    let { userId, content } = req.body;

    try {
        let query = "INSERT INTO TBL_FEED VALUES (NULL,?,?,NOW())"
        let result = await db.query(query, [userId, content]);
        // console.log("result ====> ", result);
        res.json({
            message: "게시글이 등록되었습니다.",
            result: result[0]
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
}) 


router.get("/:id", async (req, res) => {
    let { id } = req.params;

    try {
        let [list] = await db.query("SELECT * FROM TBL_FEED WHERE id = " + id);
        // console.log(list);

        res.json({
            message: "result",
            info: list[0]
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.put("/:id", async (req, res) => {
    // req.body
    let { id } = req.params;
    let { content } = req.body;
    console.log("id ==>" , id);
    console.log("content ==>" , content);

    try {
        let query = "UPDATE TBL_FEED SET content = ? WHERE id= " + id;
        await db.query(query, [content]);
        res.json({
            message: "수정되었습니다.",
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})
module.exports = router;