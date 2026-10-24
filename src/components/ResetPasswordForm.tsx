import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";

type ResetPasswordFormData = {
	email: string;
};

type ResetPasswordFormProps = {
	onBack: () => void;
};

function ResetPasswordForm({ onBack }: ResetPasswordFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordFormData>();

	const [message, setMessage] = useState<{
		type: "error" | "success";
		text: string;
	} | null>(null);

	const handleResetPassword = async (data: ResetPasswordFormData) => {
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

	return (
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

				{errors.email && <p className="login-error">{errors.email.message}</p>}

				<button type="submit" disabled={isSubmitting}>
					再設定メールを送信
				</button>

				{message && (
					<p
						className={
							message.type === "success" ? "login-success" : "login-error"
						}
					>
						{message.text}
					</p>
				)}
			</form>

			<button type="button" onClick={onBack}>
				ログイン画面に戻る
			</button>
		</div>
	);
}

export default ResetPasswordForm;
