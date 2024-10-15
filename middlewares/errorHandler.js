const errorMessages = {
    400: '잘못된 요청입니다',
    401: '인증이 필요합니다',
    402: '결제가 필요합니다',
    403: '비밀번호가 틀렸습니다',
    404: '존재하지 않습니다',
    500: '서버 오류가 발생했습니다'
}

export const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.customMessage || errorMessages[statusCode];
    
    // 응답할 에러 메시지와 상태 코드 설정
    res.status(err.statusCode || 500).json({
        message: message,
        // 개발 환경일 때만 에러 스택을 응답에 포함
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};