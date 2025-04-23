// =======================공통코드============================
const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const router = express.Router();
// ==========================================================


router.post("/", async (req, res) => {
    // req.body
    let { userId, pwd } = req.body;

    try {
        let query = "SELECT userId, userName, addr, phone, cdatetime, status FROM TBL_USER WHERE userId = ? AND PWD =?"
        let [user] = await db.query(query, [userId, pwd]);
        // console.log("user ====> ", user);
        let result = {};
        if (user.length > 0) {
            // 세션 값 저장
            req.session.user = {
                sessionId : user[0].userId,
                sessionName : user[0].userName,
                sessionPhone : user[0].phone,
                sessionStatus : user[0].status,
            }
            console.log(req.session);
            result = {
                message: "로그인 성공!",
                pass: true,
                user: user[0]
            }
        } else {
            result = {
                message: "로그인 실패!",
                pass: false
            }
        }
        res.json(result);

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})

//클라이언트가 세션 정보 확인하는 주소
router.get("/info", (req, res) => {
    if(req.session.user){
        res.json({
            isLogin : true,
            user : req.session.user
        })
    } else {
        res.json({
            isLogin : false,
        })
    }
})

//로그아웃
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if(err){
            // 관리자가 보기위한
            console.log("세션 삭제 중 에러발생");
            // 사용자가 보기 위한
            res.status(500).send("로그아웃 실패!")
        } else {
            res.clearCookie("connect.sid");
            res.json({message : "로그아웃이 되었습니다."});
        }
    });
})

//회원가입
router.post("/join", async (req, res) => {
    // req.body
    let { userId, pwd, name, addr, phone } = req.body;

    try {
        let hashPwd = await bcrypt.hash(pwd, 10); //숫자(=라운드 숫자) => 10번 암호화 반복해서 규칙성 못찾도록
        let query = "INSERT INTO TBL_USER VALUES(?,?,?,?,?,NOW(),NOW(),'C')";
        let [user] = await db.query(query, [userId, hashPwd, name, addr, phone]);

        let result = {};
        if (user.length > 0) {
            // 세션 값 저장
            req.session.user = {
                sessionId : user[0].userId,
                sessionName : user[0].userName,
                sessionPhone : user[0].phone,
                sessionStatus : user[0].status,
            }
            console.log(req.session);
            result = {
                message: "로그인 성공!",
                pass: true,
                user: user[0]
            }
        } else {
            result = {
                message: "로그인 실패!",
                pass: false
            }
        }
        res.json(result);

    } catch (err) {
        console.log("에러 발생");
        res.status(500).send("Server Error");
    }
})


//내보내기
module.exports = router;