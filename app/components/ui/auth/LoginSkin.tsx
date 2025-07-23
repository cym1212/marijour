import React, { useState } from 'react';

// 스타일 import
import './login-skin-scoped.css';

/**
 * LoginSkin 컴포넌트 - 로그인 페이지 UMD 버전
 */
export function Login() {
    const [formData, setFormData] = useState({
        user_id: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('로그인 시도:', formData);
        alert('로그인 폼이 제출되었습니다.');
    };

    return (
        <div className="login-skin-container">
            <section className="login-skin-wrapper">
                <div className="login-skin-title">
                    <h2>로그인</h2>
                </div>
                <form className="login-skin-form" onSubmit={handleSubmit}>
                    <div className="login-skin-input-group">
                        <input
                            type="text"
                            id="user_id"
                            name="user_id"
                            className="login-skin-input"
                            placeholder="이메일을 입력하세요"
                            value={formData.user_id}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="login-skin-input"
                            placeholder="비밀번호를 입력하세요"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="login-skin-button-group">
                        <button type="submit" className="login-skin-button login-skin-button-primary">
                            로그인
                        </button>
                        <button type="button" className="login-skin-button login-skin-button-white">
                            회원가입
                        </button>
                    </div>
                    <div className="login-skin-links">
                        <a href="/find-password" className="login-skin-link">
                            비밀번호 찾기
                        </a>
                        <span className="login-skin-divider"></span>
                        <a href="/guest-order-lookup" className="login-skin-link">
                            비회원 주문 조회
                        </a>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default Login;