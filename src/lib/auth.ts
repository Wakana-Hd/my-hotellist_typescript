// src/lib/auth.ts

import type { Session } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";

type AuthState = { session: Session | null; loading: boolean };
let state: AuthState = { session: null, loading: true };
const listeners = new Set<() => void>();

// onAuthStateChange は登録直後に INITIAL_SESSION が来るので getSession() は不要
supabase.auth.onAuthStateChange((_event, session) => {
	state = { session, loading: false };
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
