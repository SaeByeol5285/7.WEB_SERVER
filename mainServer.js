// =======================공통코드============================
const express = require('express');
const boardRouter = require('./routes/board.js'); //라우터 참조, 확장자 js만 생략 가능
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5501"
}))
app.use("/board", boardRouter);


// ==========================================================

app.listen(3000, () => {
    console.log("서버 실행중!")
})