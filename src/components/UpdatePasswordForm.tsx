import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";

type UpdatePasswordFormData = {
	password: string;
};

type UpdatePasswordFormProps = {
	onPasswordUpdated: () => void;
};

function UpdatePasswordForm({ onPasswordUpdated }: UpdatePasswordFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<UpdatePasswordFormData>();

	const [message, setMessage] = useState<{
		type: "error" | "success";
		text: string;
	} | null>(null);

	const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
		const { error } = await supabase.auth.updateUser({
			password: data.password,
		});

		if (error) {
			console.error("パスワード変更エラー:", error);

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

		onPasswordUpdated();
	};

	return (
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

			{errors.password && (
				<p className="login-error">{errors.password.message}</p>
			)}

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
	);
}

export default UpdatePasswordForm;
