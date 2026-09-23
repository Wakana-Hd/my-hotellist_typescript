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
        <div>
            <h2>ログイン</h2>

            {message && <p>{message}</p>}

            <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>ログイン</button>
            <button onClick={handleSignUp}>新規登録</button>
        </div>
    );
}

export default Login;