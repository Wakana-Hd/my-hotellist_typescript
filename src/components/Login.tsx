import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
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
