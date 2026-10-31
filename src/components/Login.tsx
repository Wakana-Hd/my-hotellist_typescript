import { useState } from "react";
import "./Login.css";
import LoginForm from "./LoginForm";
import ResetPasswordForm from "./ResetPasswordForm";
import UpdatePasswordForm from "./UpdatePasswordForm";

type LoginProps = {
	isPasswordRecovery: boolean;
	onPasswordUpdated: () => void;
};

function Login({ isPasswordRecovery, onPasswordUpdated }: LoginProps) {
	const [isResettingPassword, setIsResettingPassword] = useState(false);

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

				{isPasswordRecovery ? (
					<UpdatePasswordForm onPasswordUpdated={onPasswordUpdated} />
				) : isResettingPassword ? (
					<ResetPasswordForm onBack={() => setIsResettingPassword(false)} />
				) : (
					<LoginForm onForgotPassword={() => setIsResettingPassword(true)} />
				)}
			</div>
		</div>
	);
}

export default Login;
