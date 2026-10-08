import "./Login.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";

type LoginFormData = {
	email: string;
	password: string;
};

function Login() {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<LoginFormData>();
	const [message, setMessage] = useState("");

	//ログイン
	const handleLogin = async (data: LoginFormData) => {
		const { error } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		});
		if (error) {
			setMessage("メールアドレスまたはパスワードが違います");
		}
	};

	//新規登録
	const handleSignUp = async (data: LoginFormData) => {
		const { error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
		});
		if (error) {
			setMessage("新規登録に失敗しました");
			return;
		}

		setMessage("確認メールを送りました");
	};

	return (
		<div className="login-page">
			<div className="login-card">
				<div className="login-header">
					<h1>MY HOTEL LOG</h1>
					<p>
						泊まったホテルを記録して、
						<br />
						あなただけの旅の思い出を作ろう
					</p>
				</div>

				<h2>ログイン</h2>
				<form onSubmit={handleSubmit(handleLogin)}>
					{message && <p className="login-error">{message}</p>}

					<label htmlFor="email">メールアドレス</label>
					<input
						id="email"
						type="email"
						placeholder="example@email.com"
						{...register("email")}
					/>

					<label htmlFor="password">パスワード</label>
					<input
						id="password"
						type="password"
						placeholder="パスワードを入力"
						{...register("password")}
					/>

					<button
						type="submit"
						className="login-button"
						disabled={isSubmitting}
					>
						ログイン
					</button>

					<p className="signup-text">または</p>
					<button
						type="button"
						className="signup-button"
						onClick={handleSubmit(handleSignUp)}
						disabled={isSubmitting}
					>
						新規登録
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
