// =======================공통코드============================
const express = require('express')
const db = require('./db')
const cors = require('cors')

const app = express()
app.use(express.json());
app.use(cors())
// ==========================================================


app.get("/product", async (req, res) => {
    console.log(req.query)
    // 선생님 방법
    // let { offset, pageSize } = req.query;

    let offset = req.query.offset;
    let pageSize = req.query.pageSize;

    console.log("page ===> " + offset);
    console.log("pageSize ====> " + pageSize);

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

app.get("/product/:productId", async (req, res) => {
    let { productId } = req.params;
    console.log(productId);

    try {
        let [list] = await db.query("SELECT * FROM TBL_PRODUCT WHERE PRODUCTID = " + productId);

        console.log(list);
        res.json({
            message: "result",
            info: list[0]
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

app.post("/product", async (req, res) => {
    // req.body
    let { productName, description, price, stock, category } = req.body;

    try {
        let query = "INSERT INTO TBL_PRODUCT VALUES (NULL,?,?,?,?,?,'Y',NOW(),NOW())"
        await db.query(query, [productName, description, price, stock, category]);
        res.json({
            message: "상품이 추가되었습니다.",
        });

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

app.delete("/product/:productId", async (req, res) => {
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

app.put("/product/:productId", async (req, res) => {
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



//listen 내부의 함수 실행 후 callback함수 실행
app.listen(3000, () => {
    console.log("서버 실행중!")
})