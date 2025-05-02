const express = require('express');
const db = require('../../db');
const router = express.Router();
const authMiddleware = require('../auth');

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post("/", async (req, res) => {
    let { email, title, content } = req.body;

    try {
        let query = "INSERT INTO TBL_FEED VALUES (NULL,?,?,?,NOW())"
        let result = await db.query(query, [email, title, content]);
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

    try{
        let results = []; 
        let thumbnail = "Y";
        for(let file of files){
            let filename = file.filename;
            let destination = file.destination;
            let query = "INSERT INTO TBL_FEED_IMG VALUES(NULL, ?, ?, ?, ?)";
            let result = await db.query(query, [feedId, filename, destination, thumbnail]);
            results.push(result);
            thumbnail = "N";
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

router.get("/", async (req, res) => {

    try {
        let query = "SELECT * FROM TBL_FEED F INNER JOIN TBL_FEED_IMG I ON F.ID = I.FEEDID WHERE THUMBNAILYN = 'Y'"
        let [list] = await db.query(query);

        res.json({
            message: "result",
            list: list, 
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

router.get("/:id", async (req, res) => {
    let { id } = req.params;

    try {
        let query = "SELECT * FROM TBL_FEED WHERE ID = " + id;
        let imgQuery = "SELECT * FROM TBL_FEED_IMG WHERE FEEDID = " + id;

        let [list] = await db.query(query);
        let [imgList] = await db.query(imgQuery);

        res.json({
            message: "result",
            feed: list[0], 
            imgList : imgList
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;