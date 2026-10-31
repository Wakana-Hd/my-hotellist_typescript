// src/lib/auth.ts

import type { Session } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";

type AuthState = {
	session: Session | null;
	loading: boolean;
	isPasswordRecovery: boolean;
};
let state: AuthState = {
	session: null,
	loading: true,
	isPasswordRecovery: false,
};
const listeners = new Set<() => void>();

supabase.auth.onAuthStateChange((event, session) => {
	state = {
		...state,
		session,
		loading: false,
		isPasswordRecovery:
			event === "PASSWORD_RECOVERY" ? true : state.isPasswordRecovery,
	};

	listeners.forEach((listener) => {
		listener();
	});
});

export const useAuth = () =>
	useSyncExternalStore(
		(cb) => {
			listeners.add(cb);
			return () => listeners.delete(cb);
		},
		() => state,
	);

export const finishPasswordRecovery = () => {
	state = {
		...state,
		isPasswordRecovery: false,
	};

	listeners.forEach((listener) => {
		listener();
	});
};
