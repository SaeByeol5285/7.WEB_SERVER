//jwt 토큰을 검증하는 페이지

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret_key_newstar';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer[공백으로 구분함]TOKEN

    if (!token) {
        return res.status(401).json({ message: '인증 토큰 없음', isLogin: false });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // 이후 라우터에서 req.user로 사용자 정보 사용 가능
        // 인증에 문제가 없다면 콜백함수인 next()를 실행한다.
        // product.js의 async 함수 부분
        next();
    } catch (err) {
        return res.status(403).json({ message: '유효하지 않은 토큰', isLogin: false });
    }
};
