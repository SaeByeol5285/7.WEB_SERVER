// =======================공통코드============================
const express = require('express');
const db = require('../db');
const router = express.Router();
// ==========================================================

router.get("/", async (req, res) => {
    let { listOption } = req.query;
    let query = "SELECT B.boardNo, B.title, B.contents, B.userId, B.cnt, DATE_FORMAT(B.cdatetime,'%y-%m-%d') AS cdatetime , U.userName AS userName FROM TBL_BOARD B INNER JOIN tbl_user U ON B.userId = U.userId"
    try {
        if (listOption == "popular") {
            query += " WHERE B.cnt >= 20";
        }
        let [list] = await db.query(query);

        res.json({
            message: "success",
            list: list,
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.get("/:boardNo", async (req, res) => {
    let { boardNo } = req.params;

    try {
        let [list] = await db.query("SELECT B.*, U.userName AS userName FROM TBL_BOARD B INNER JOIN tbl_user U ON B.userId = U.userId WHERE B.boardNo = " + boardNo);
        await db.query("UPDATE TBL_BOARD SET cnt=cnt+1 WHERE boardNo=" + boardNo);
        res.json({
            message: "result",
            info: list[0]
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.delete("/:boardNo", async (req, res) => {
    let { boardNo } = req.params;

    try {
        let result = await db.query("DELETE FROM TBL_BOARD WHERE boardNo = " + boardNo);

        res.json({
            message: "삭제되었습니다.",
            result: result,
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.put("/:boardNo", async (req, res) => {
    let { title, contents } = req.body;
    let { boardNo } = req.params;
    try {
        let query = "UPDATE TBL_BOARD SET title = ?, contents =?, udatetime = NOW() WHERE boardNo= ?";
        await db.query(query, [title, contents, boardNo]);
        res.json({
            message: "게시글이 수정되었습니다.",
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.post("/", async (req, res) => {
    let { title, contents } = req.body;

    try {
        let query = "INSERT INTO TBL_BOARD VALUES (NULL,?,?,'user001',0,NOW(),NOW())"
        let result = await db.query(query, [title, contents]);
        console.log("result ====> ", result);
        res.json({
            message: "게시글이 등록되었습니다.",
            result: result[0]
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})



module.exports = router;