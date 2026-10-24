import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";

type LoginFormData = {
	email: string;
	password: string;
};

type LoginFormProps = {
	onForgotPassword: () => void;
};

function LoginForm({ onForgotPassword }: LoginFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>();

	const [message, setMessage] = useState<{
		type: "error" | "success";
		text: string;
	} | null>(null);

	//ログイン
	const handleLogin = async (data: LoginFormData) => {
		setMessage(null);

		const { error } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		});

		if (error) {
			if (error.code === "invalid_credentials") {
				setMessage({
					type: "error",
					text: "メールアドレスまたはパスワードが違います",
				});
			} else {
				setMessage({
					type: "error",
					text: "ログインに失敗しました。時間をおいて再度お試しください",
				});
			}
		}
	};

	//新規登録
	const handleSignUp = async (data: LoginFormData) => {
		if (data.password.length < 6) {
			setMessage({
				type: "error",
				text: "パスワードは6文字以上で入力してください",
			});
			return;
		}

		const { error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
		});

		if (error) {
			setMessage({
				type: "error",
				text: "新規登録に失敗しました",
			});
			return;
		}

		setMessage({
			type: "success",
			text: "確認メールを送りました",
		});
	};

	return (
		<>
			<h2>ログイン</h2>
			<form onSubmit={handleSubmit(handleLogin)}>
				<label htmlFor="email">メールアドレス</label>
				<input
					id="email"
					type="email"
					placeholder="example@email.com"
					{...register("email", {
						required: "メールアドレスを入力してください",
					})}
				/>

				{errors.email && <p className="login-error">{errors.email.message}</p>}

				<label htmlFor="password">パスワード</label>
				<input
					id="password"
					type="password"
					placeholder="パスワードを入力"
					{...register("password", {
						required: "パスワードを入力してください",
					})}
				/>

				<p className="password-hint">
					※新規登録時のパスワードは6文字以上で設定してください
				</p>

				{errors.password && (
					<p className="login-error">{errors.password.message}</p>
				)}

				<button
					type="button"
					className="forgot-password-button"
					onClick={onForgotPassword}
				>
					パスワードを忘れた方はこちら
				</button>

				<button type="submit" className="login-button" disabled={isSubmitting}>
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
			{message && (
				<p
					className={message.type === "error" ? "login-error" : "login-success"}
				>
					{message.text}
				</p>
			)}
		</>
	);
}

export default LoginForm;
