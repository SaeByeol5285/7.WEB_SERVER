// =======================공통코드============================
const express = require('express');
const productRouter = require('./routes/product'); //라우터 참조, 확장자 js만 생략 가능
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const studentRouter = require('./routes/student');
const feedRouter = require('./routes/feed')


const path = require('path');
const cors = require('cors');
const session = require('express-session');

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uplads'))); //static 폴더로 만들기
//보안 정책, session 도메인 등록 필요
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true //위 도메인에 한해서 쿠키를 주고 받을게(default는 주고 받지 못함)
}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    secret: 'keyboard cat', //암호화키
    resave: false,
    saveUninitialized: false, //페이지 이동시 자동갱신
    cookie: {
        httpOnly : true, //클라이언트가 쿠키에서 확인할 수 있게 할것인가? (true이면 못하게)
        secure : false,
        maxAge : 1000 * 60 * 30 //ms기준
    }
}))

// product~주소로 들어갈 수 있음
// 대신 product.js /product/list에서 /product생략 가능함
app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/login", loginRouter);
app.use("/student", studentRouter);
app.use("/feed", feedRouter);



// ==========================================================





//listen 내부의 함수 실행 후 callback함수 실행
app.listen(3005, () => {
    console.log("서버 실행중!")
})