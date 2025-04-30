const express = require('express');
const db = require('../db');
const router = express.Router();
const authMiddleware = require('./auth');

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


//api
router.get("/", async (req, res) => {
    let { userId } = req.query;
    console.log(userId);

    try {
        let query = "SELECT * FROM TBL_FEED"
        let imgQuery = "SELECT * FROM TBL_FEED F INNER JOIN TBL_FEED_IMG I ON F.ID = I.FEEDID"

        if(userId){
            query += " WHERE userId = '" + userId + "'"
            imgQuery += " WHERE userId = '" + userId + "'"
        }

        let [list] = await db.query(query);
        let [imgList] = await db.query(imgQuery);


        res.json({
            message: "result",
            list: list, 
            imgList : imgList
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.delete("/:id", authMiddleware, async (req, res) => {
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

router.post('/upload', upload.array('file'), async (req, res) => {
    let { feedId } = req.body;
    const files = req.files; // 단일파일은 req.file 복수파일을 req.files로 자동으로 바뀜

    // const filename = req.file.filename; 
    // const destination = req.file.destination; 
    try{
        let results = []; 
        for(let file of files){
            let filename = file.filename;
            let destination = file.destination;
            let query = "INSERT INTO TBL_FEED_IMG VALUES(NULL, ?, ?, ?)";
            let result = await db.query(query, [feedId, filename, destination]);
            results.push(result);
        }
    
        res.json({
            message : "result",
            result : results
        });
    } catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
});


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
    // console.log("id ==>" , id);
    // console.log("content ==>" , content);

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