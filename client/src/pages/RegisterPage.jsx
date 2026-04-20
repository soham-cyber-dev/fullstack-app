import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4" style={{background:'#0a0a0f'}}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{position:'absolute',top:'15%',right:'15%',width:'350px',height:'350px',background:'radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)',borderRadius:'50%'}}></div>
        <div style={{position:'absolute',bottom:'15%',left:'10%',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(236,72,153,0.05) 0%,transparent 70%)',borderRadius:'50%'}}></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-float" style={{background:'linear-gradient(135deg,#8b5cf6,#ec4899)'}}>
            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p style={{color:'rgba(148,163,184,0.7)',fontSize:'14px'}}>Get started for free today</p>
        </div>

        <div className="glass card-shine rounded-2xl p-8" style={{border:'1px solid rgba(139,92,246,0.2)'}}>
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Full Name</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} required
                className="input-field w-full rounded-xl px-4 py-3 text-sm"
                placeholder="Alice Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Email address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required
                className="input-field w-full rounded-xl px-4 py-3 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Password</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} required minLength={6}
                className="input-field w-full rounded-xl px-4 py-3 text-sm"
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-white font-semibold text-sm mt-2"
              style={{opacity: loading ? 0.7 : 1}}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Creating account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{color:'rgba(148,163,184,0.6)',fontSize:'14px'}}>
              Already have an account?{" "}
              <Link to="/login" style={{color:'#818cf8',fontWeight:'500'}} className="hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-xs" style={{color:'rgba(148,163,184,0.3)'}}>
          Secured with JWT Authentication
        </p>
      </div>
    </div>
  );
}
