const express = require('express')
const db = require('./db')
const cors = require('cors')

const app = express()
//서버에서 가지고 올 때 json형태로 파싱해줌
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get("/board/list", async (req, res) => {
    try{
        let [list] = await db.query("SELECT * FROM BOARD");
        console.log(list);
        res.json({
            message : "result",
            list : list
        });

    }catch(err){
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

app.get("/board/view", async (req, res) => {
    let { boardNo : boardNo } = req.query;
    try{
        console.log("req ===> " , req.query);
        let [list] = await db.query(`SELECT * FROM BOARD WHERE BOARDNO = ${boardNo}`);

        res.json({
            message : "result",
            info : list[0]
        });

    }catch(err){
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

app.get("/board/remove", async (req, res) => {
    let { boardNo : boardNo } = req.query;
    try{
        await db.query(`DELETE FROM BOARD WHERE BOARDNO = ${boardNo}`);

        res.json({
            result : "success",
            message : "삭제되었습니다."
        });

    }catch(err){
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})


//listen 내부의 함수 실행 후 callback함수 실행
app.listen(3000, ()=>{
    console.log("서버 실행중!")
})