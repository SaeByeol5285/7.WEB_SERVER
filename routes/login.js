// =======================공통코드============================
const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ==========================================================


// 로그인
const JWT_KEY = "secret_key_newstar"; // 해시 함수 실행 위해 사용할 키로 아주 긴 랜덤한 문자를 사용하길 권장하며, 노출되면 안됨.
router.post("/", async (req, res) => {
    let { userId, pwd } = req.body;
    try {
        let query = "SELECT * FROM TBL_USER WHERE userId = ?"
        let [user] = await db.query(query, [userId]);
        let isMatch = await bcrypt.compare(pwd, user[0].pwd);
        if (isMatch) {
            //jwt 토큰 생성
            let payload = {
                userId: user[0].userId,
                userName: user[0].userName,
                userPhone: user[0].phone,
                userStatus: user[0].status,
            }
            const token = jwt.sign(payload, JWT_KEY, {expiresIn : '1h'});
            console.log(token);

            result = {
                message: "로그인 성공!",
                pass: true,
                //토큰 리턴
                token: token,
            }
        }
        else {
            result = {
                message: "비밀번호를 확인하세요.",
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