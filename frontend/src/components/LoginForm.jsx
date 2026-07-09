import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../Context/GlobalContext";

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
            const LoginResponse = await axios.post("http://localhost:3000/api/v1/users/login",{
                email,
                password
            },{
                withCredentials: true
            })
            if(LoginResponse.data.status == "success" && LoginResponse.data.data.user){
                setUser(LoginResponse.data.data.user);
                connectSocket(LoginResponse.data.data.user._id);
                navigate("/dashboard")
            }
            else{
                alert("Login failed please try after some times")
            }
            
        }
        catch(err){
            console.log(err);
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

//  <form onSubmit={handleSubmit} noValidate className={shake ? 'shake' : ''}>
//                 <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Welcome back</h1>
//                 <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', margin: '0 0 26px' }}>
//                     Sign in to manage your WhatsApp campaigns.
//                 </p>
 
//                 {formError && (
//                     <div className="fade-up" style={{
//                     display: 'flex', gap: 9, alignItems: 'flex-start', background: 'var(--coral-tint)', border: '1px solid #F3C4BA',
//                     color: '#9B3A28', borderRadius: 10, padding: '11px 13px', fontSize: 12.5, lineHeight: 1.45, marginBottom: 18,
//                     }}>
//                     <span style={{ fontWeight: 700 }}>⚠</span>
//                     <span>{formError}</span>
//                     </div>
//                 )}
 
//                 <div style={{ marginBottom: 16 }}>
//                     <label style={labelStyle} htmlFor="email">Email</label>
//                     <input
//                         id="email"
//                         ref={emailRef}
//                         className="field"
//                         type="email"
//                         autoComplete="email"
//                         placeholder="you@company.com"
//                         value={email}
//                         onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(er => ({ ...er, email: null })); }}
//                         style={{ ...inputStyle, borderColor: errors.email ? 'var(--coral)' : 'var(--line)' }}
//                     />
//                     {errors.email && <div style={errorStyle}>⚠ {errors.email}</div>}
//                 </div>
            
//                 <div style={{ marginBottom: 10 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <label style={{ ...labelStyle, marginBottom: 6 }} htmlFor="password">Password</label>
//                     <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>
//                         Forgot password?
//                     </a>
//                     </div>
//                     <div style={{ position: 'relative' }}>
//                     <input
//                         id="password"
//                         className="field"
//                         type={showPassword ? 'text' : 'password'}
//                         autoComplete="current-password"
//                         placeholder="••••••••"
//                         value={password}
//                         onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(er => ({ ...er, password: null })); }}
//                         style={{ ...inputStyle, borderColor: errors.password ? 'var(--coral)' : 'var(--line)', paddingRight: 44 }}
//                     />
//                     <button
//                         type="button"
//                         onClick={() => setShowPassword(s => !s)}
//                         aria-label={showPassword ? 'Hide password' : 'Show password'}
//                         style={{
//                         position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
//                         background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: 12, fontWeight: 600, padding: '6px 8px',
//                         }}
//                     >
//                         {showPassword ? 'Hide' : 'Show'}
//                     </button>
//                     </div>
//                     {errors.password && <div style={errorStyle}>⚠ {errors.password}</div>}
//                 </div>
            
//                 <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--ink-soft)', margin: '14px 0 22px', cursor: 'pointer' }}>
//                     <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: 15, height: 15, accentColor: 'var(--teal)' }} />
//                     Keep me signed in on this device
//                 </label>
            
//                 <button type="submit" disabled={submitting} style={btnPrimary}>
//                     {submitting ? <><Spinner size={14} color="#fff" /> Signing in…</> : 'Sign in'}
//                 </button>
            
//                 <button
//                     type="button"
//                     onClick={fillDemo}
//                     style={{
//                     width: '100%', marginTop: 10, background: 'transparent', border: '1px dashed var(--line)',
//                     borderRadius: 9, padding: '9px 14px', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600,
//                     }}
//                 >
//                     Use demo credentials
//                 </button>
            
//                 <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 22 }}>
//                     Don't have an account? <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}>Request access</a>
//                 </p>
//             </form> 

