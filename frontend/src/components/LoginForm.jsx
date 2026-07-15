import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

import api from "../api/axios";

const LoginForm =()=>{
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [shake, setShake] = useState(false);
    const [formError, setFormError] = useState(null);
    const [errors, setErrors] = useState({});
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { setUser, connectSocket } = useGlobalContext();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailRef = useRef(null);

    const labelStyle = { fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, display: 'block' };
    const inputStyle = {
        width: '100%', padding: '11px 12px', borderRadius: 9, border: '1px solid var(--line)',
        fontSize: 13.5, background: '#fff', color: 'var(--ink)', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
    };
    const btnPrimary = {
        background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 9,
        padding: '12px 18px', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'background 0.15s, transform 0.1s', minWidth: 40, justifyContent: 'center', width: '100%',
    };


    const handleSubmit =async(e)=>{
        e.preventDefault();
        if(!emailRegex.test(email) && password.length < 6){
            alert("Please provide proper credentials...")
            return;
        }

        try{
            const LoginResponse = await api.post("/users/login",{
                email,
                password
            })
            if(LoginResponse.data.status == "success" && LoginResponse.data.data.user){
                setUser(LoginResponse.data.data.user);
                connectSocket(LoginResponse.data.data.user._id);
                navigate("/dashboard")
            }
            
        }
        catch(error){
            if (error.response) {
                if (error.response.status === 401) {
                    alert("Incorrect Email or Password");
                } else if (error.response.status === 500) {
                    alert("Server error. Please try again later.");
                } else {
                    alert(error.response.data.message || "Something went wrong.");
                }
            } else if (error.request) {
                alert("Unable to connect to the server.");
            } else {
                alert("An unexpected error occurred.");
            }
        }
    }


    return(
        <>
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
                {/* Card */}
                <div className="rise-in relative z-10 w-full max-w-lg rounded-2xl border border-[var(--line)] bg-[var(--paper-raised)] p-9 shadow-[0_30px_80px_-30px_rgba(18,24,43,0.28)]">
                    <div className="mb-7 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-sm font-extrabold text-white">
                        H
                    </div>

                    <span className="text-[20px] font-bold tracking-[-0.01em]">
                        Hellofy
                    </span>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className={shake ? "shake space-y-4" : "space-y-4"}
                        >
                        {/* Header */}
                        <div>
                            <h1 className="mb-1 text-3xl font-extrabold tracking-tight">
                            Welcome
                            </h1>
                            <p className="text-sm text-[var(--ink-soft)]">
                            Sign in to manage your Campaigns.
                            </p>
                        </div>

                        {/* Error Alert */}
                        {formError && (
                            <div className="fade-up flex items-start gap-2 rounded-lg border border-[#F3C4BA] bg-[var(--coral-tint)] px-3 py-2.5 text-sm leading-relaxed text-[#9B3A28]">
                            <span className="font-bold">⚠</span>
                            <span>{formError}</span>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
                            >
                            Email
                            </label>

                            <input
                                ref={emailRef}
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                className={`field w-full rounded-lg border px-4 py-3 outline-none transition
                                ${
                                    errors.email
                                    ? "border-[var(--coral)]"
                                    : "border-[var(--line)] focus:border-[var(--teal)]"
                                }`}
                            />

                        </div>

                        {/* Password */}
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-[var(--ink)]"
                            >
                                Password
                            </label>

                            <button
                                type="button"
                                className="text-xs font-semibold text-[var(--teal)] hover:underline"
                            >
                                Forgot password?
                            </button>
                            </div>

                            <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                className={`field w-full rounded-lg border px-4 py-3 pr-14 outline-none transition
                                ${
                                errors.password
                                    ? "border-[var(--coral)]"
                                    : "border-[var(--line)] focus:border-[var(--teal)]"
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--ink-soft)]"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                            </div>

                        </div>

                        {/* Remember Me */}
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--ink-soft)]">
                            <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="h-4 w-4 accent-[var(--teal)]"
                            />
                            Keep me signed in on this device
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ink)] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                            <>
                                <Spinner size={14} color="#fff" />
                                Signing in...
                            </>
                            ) : (
                            "Sign in"
                            )}
                        </button>

                        {/* Footer */}
                        <p className="pt-2 text-center text-sm text-[var(--ink-soft)]">
                            Don't have an account?{" "}
                            <button
                            type="button"
                            className="font-semibold text-[var(--teal)] hover:underline"
                            >
                            Request access
                            </button>
                        </p>
                    </form>
                    
                </div>
            </div>
            
        </>
    )
}

export default LoginForm;
