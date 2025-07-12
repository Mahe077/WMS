import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/app-context";
import { loginApi, resetPasswordApi } from "@/features/auth/api";

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const router = useRouter();
    const { addNotification } = useNotifications();
    const { dispatch } = context;

    const login = async (email: string, password: string) => {
        dispatch({ type: "AUTH_START" });

        try {
            const response = await loginApi(email, password);
            const { user, token } = response;
            localStorage.setItem("wms_token", token);
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { user, token },
            });
            addNotification({
                type: "success",
                message: `Welcome back, ${user.name}!`,
            });

            router.push("/");
        } catch (error) {
            dispatch({ 
                type: "AUTH_FAILURE", 
                payload: { error: error instanceof Error ? error.message : "Login failed. Please try again." } 
            });
            addNotification({
                type: "error",
                message: error instanceof Error ? error.message : "Login failed. Please try again.",
            });
        }
    };

    const resetPassword = async (email: string, password: string) => {
        dispatch({ type: "AUTH_START" });

        try {
            await resetPasswordApi(email, password);

            addNotification({
                type: "success",
                message: "Password reset successfully. You can now log in with your new password.",
            });
            dispatch({ type: "PASSWORD_RESET_SUCCESS" });
            router.push("/login");
        } catch (error) {
            dispatch({ 
                type: "PASSWORD_RESET_FAILURE", 
                payload: { error: error instanceof Error ? error.message : "Password reset failed. Please try again." } 
            });
            addNotification({
                type: "error",
                message: error instanceof Error ? error.message : "Password reset failed. Please try again.",
            });
        }
    };

    const logout = (reason?: string) => {
        localStorage.removeItem("wms_token");
        dispatch({ type: "LOGOUT", payload: { reason } });
        addNotification({
            type: "info",
            message: "You have been logged out.",
        });
        router.push("/login");
    };

    return { ...context, login, resetPassword, logout };
}
