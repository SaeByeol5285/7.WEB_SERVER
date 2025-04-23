// =======================공통코드============================
const express = require('express');
const db = require('../db');
const router = express.Router();

const multer  = require('multer');
// 3. 설정 - 파일 경로 및 파일 명(시간)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ==========================================================

router.get("/", async (req, res) => {
    console.log(req.query)
    // 선생님 방법
    // let { offset, pageSize } = req.query;

    let offset = req.query.offset;
    let pageSize = req.query.pageSize;

    // console.log("page ===> " + offset);
    // console.log("pageSize ====> " + pageSize);

    try {
        // 선생님 방법
        // let sql = "SELECT * FROM TBL_PRODUCT LIMIT ? OFFSET ?";
        // let [list] = await db.query(sql, [parseInt(pageSize), parseInt(offset)])

        // 아래의 경우, 문자열이더라도 숫자 형식으로 넣는 형태
        // 만약 문자열을 넣고 싶으면 "'" + pageSize + "'"
        let [list] = await db.query("SELECT * FROM TBL_PRODUCT LIMIT " + pageSize + " OFFSET " + offset);
        let [count] = await db.query("SELECT COUNT(*) AS cnt FROM TBL_PRODUCT")

        res.json({
            message: "result",
            list: list,
            count: count[0].cnt
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.get("/:productId", async (req, res) => {
    let { productId } = req.params;
    // console.log(productId);

    try {
        let [list] = await db.query("SELECT * FROM TBL_PRODUCT WHERE PRODUCTID = " + productId);

        res.json({
            message: "result",
            info: list[0]
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.post("/", async (req, res) => {
    // req.body
    let { productName, description, price, stock, category } = req.body;

    try {
        let query = "INSERT INTO TBL_PRODUCT VALUES (NULL,?,?,?,?,?,'Y',NOW(),NOW())"
        let result = await db.query(query, [productName, description, price, stock, category]);
        console.log("result ====> ", result);
        res.json({
            message: "상품이 추가되었습니다.",
            result : result[0]
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.post('/upload', upload.single('file'), async (req, res) => {
    let { productId } = req.body;
    const filename = req.file.filename; 
    const destination = req.file.destination; 
    try{
        let query = "INSERT INTO TBL_PRODUCT_FILE VALUES(NULL, ?, ?, ?)";
        let result = await db.query(query, [productId, filename, destination]);
        res.json({
            message : "result",
            result : result
        });
    } catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
});


router.delete("/:productId", async (req, res) => {
    let { productId } = req.params;

    try {
        let result = await db.query("DELETE FROM TBL_PRODUCT WHERE PRODUCTID = " + productId);
        console.log("result ===> ", result)

        res.json({
            message: "삭제되었습니다.",
            result: result,
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

router.put("/:productId", async (req, res) => {
    // req.body
    let { productName, description, price, stock, category } = req.body;
    let { productId } = req.params;
    try {
        let query = "UPDATE TBL_PRODUCT SET productName = ?, description =?, price =?, stock =?, category =? WHERE productId= " + productId;
        await db.query(query, [productName, description, price, stock, category]);
        res.json({
            message: "상품이 수정되었습니다.",
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

//내보내기
module.exports = router;