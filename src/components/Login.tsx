import "./Login.css";
import { useState } from "react";
import { supabase } from "../lib/supabase";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    //ログイン
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) {
            setMessage("メールアドレスまたはパスワードが違います");
        }
    };

    //新規登録
    const handleSignUp = async () => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        console.log("signup data:", data);
        console.log("signup error:", error);
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <h1>MY HOTEL LOG</h1>
                    <p>泊まったホテルを記録して、<br />
                        あなただけの旅の思い出を作ろう
                    </p>
                </div>

                <h2>ログイン</h2>

                {message && <p className="login-error">{message}</p>}

                <label>メールアドレス</label>
                <input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>パスワード</label>
                <input
                    type="password"
                    placeholder="パスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                className="login-button"
                onClick={handleLogin}
                >
                    ログイン
                </button>

                <p className="siginup-text">または</p>
                <button
                className="signup-button"
                onClick={handleSignUp}
                >
                    新規登録
                </button>
            </div>
        </div>
    );
}

export default Login;