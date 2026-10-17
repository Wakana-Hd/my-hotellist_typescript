import "./Login.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";

type LoginFormData = {
	email: string;
	password: string;
};

type LoginProps = {
	isPasswordRecovery: boolean;
	onPasswordUpdated: () => void;
};

function Login({ isPasswordRecovery, onPasswordUpdated }: LoginProps) {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<LoginFormData>();
	const [message, setMessage] = useState<{
		type: "error" | "success";
		text: string;
	} | null>(null);
	const [isResettingPassword, setIsResettingPassword] = useState(false);
	const [isUpdatingPassword, setIsUpdatingPassword] =
		useState(isPasswordRecovery);

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY") {
				setIsUpdatingPassword(true);
			}
		});

		return () => {
			data.subscription.unsubscribe();
		};
	}, []);

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

	const handleResetPassword = async (data: LoginFormData) => {
		setMessage(null);

		const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
			redirectTo: window.location.origin,
		});

		if (error) {
			setMessage({
				type: "error",
				text: "メールの送信に失敗しました",
			});
			return;
		}

		setMessage({
			type: "success",
			text: "パスワード再設定用のメールを送信しました",
		});
	};

	const handleUpdatePassword = async (data: LoginFormData) => {
		setMessage(null);

		const { error } = await supabase.auth.updateUser({
			password: data.password,
		});

		if (error) {
			setMessage({
				type: "error",
				text: "パスワードの変更に失敗しました",
			});
			return;
		}

		setMessage({
			type: "success",
			text: "パスワードを変更しました",
		});
		setIsUpdatingPassword(false);
		setIsResettingPassword(false);
		onPasswordUpdated();
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

				{isUpdatingPassword ? (
					<div>
						<h2>新しいパスワードを設定</h2>

						<form onSubmit={handleSubmit(handleUpdatePassword)}>
							<label htmlFor="new-password">新しいパスワード</label>
							<input
								id="new-password"
								type="password"
								{...register("password", {
									required: "新しいパスワードを入力してください",
									minLength: {
										value: 6,
										message: "6文字以上で入力してください",
									},
								})}
							/>

							{message && (
								<p
									className={
										message.type === "success" ? "login-success" : "login-error"
									}
								>
									{message.text}
								</p>
							)}

							<button type="submit" disabled={isSubmitting}>
								パスワードを変更
							</button>
						</form>
					</div>
				) : isResettingPassword ? (
					<div>
						<h2>パスワード再設定</h2>
						<p>登録したメールアドレスを入力してください</p>

						<form onSubmit={handleSubmit(handleResetPassword)}>
							<label htmlFor="reset-email">メールアドレス</label>
							<input
								id="reset-email"
								type="email"
								placeholder="example@email.com"
								{...register("email", {
									required: "メールアドレスを入力してください",
								})}
							/>
							{message && (
								<p
									className={
										message.type === "success" ? "login-success" : "login-error"
									}
								>
									{message.text}
								</p>
							)}

							<button type="submit" disabled={isSubmitting}>
								再設定メールを送信
							</button>
						</form>

						<button
							type="button"
							onClick={() => {
								setMessage(null);
								setIsResettingPassword(false);
							}}
						>
							ログイン画面に戻る
						</button>
					</div>
				) : (
					<>
						<h2>ログイン</h2>
						<form onSubmit={handleSubmit(handleLogin)}>
							{message && (
								<p
									className={
										message.type === "success" ? "login-success" : "login-error"
									}
								>
									{message.text}
								</p>
							)}

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
								onClick={() => setIsResettingPassword(true)}
							>
								パスワードを忘れた方はこちら
							</button>

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
					</>
				)}
			</div>
		</div>
	);
}

export default Login;
