import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function ProfilePage() {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setProfile({ name: res.data.data.name, email: res.data.data.email });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: "", type: "" });
    setProfileLoading(true);
    try {
      const res = await api.put("/profile", profile);
      login(token, res.data.data);
      setProfileMsg({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.error || "Failed to update profile.", type: "error" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: "", type: "" });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ text: "New passwords do not match.", type: "error" });
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put("/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg({ text: "Password updated successfully!", type: "success" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMsg({ text: err.response?.data?.error || "Failed to update password.", type: "error" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure? This will permanently delete your account and all data.")) return;
    if (!confirm("Last warning — this cannot be undone. Continue?")) return;
    try {
      await api.delete("/profile");
      logout();
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete account.");
    }
  };

  const tabs = [
    {
      id: "profile", label: "Profile Info",
      icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
    {
      id: "password", label: "Password",
      icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    },
    {
      id: "danger", label: "Danger Zone",
      icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    },
  ];

  const msgStyle = (type) => ({
    background: type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
    border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
    color: type === 'success' ? '#6ee7b7' : '#fca5a5'
  });

  return (
    <div className="min-h-screen grid-bg" style={{background:'#0a0a0f'}}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{position:'absolute',top:'0',left:'30%',width:'600px',height:'300px',background:'radial-gradient(ellipse,rgba(99,102,241,0.05) 0%,transparent 70%)'}}></div>
      </div>

      <nav className="glass sticky top-0 z-40 px-6 py-4" style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all duration-200"
              style={{color:'rgba(148,163,184,0.7)',border:'1px solid rgba(255,255,255,0.08)',background:'transparent'}}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}}>
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-lg gradient-text">MyApp</span>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all duration-200"
            style={{color:'rgba(248,113,113,0.8)',border:'1px solid rgba(239,68,68,0.2)',background:'transparent'}}
            onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 relative">
        <div className="glass rounded-2xl p-6 mb-6 flex items-center gap-5"
          style={{border:'1px solid rgba(255,255,255,0.06)'}}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',color:'white'}}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{color:'#e2e8f0'}}>{user?.name}</h1>
            <p className="text-sm mt-1" style={{color:'rgba(148,163,184,0.6)'}}>{user?.email}</p>
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full"
              style={{background:'rgba(99,102,241,0.15)',color:'#818cf8',border:'1px solid rgba(99,102,241,0.3)'}}>
              Active Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass rounded-2xl p-3 h-fit" style={{border:'1px solid rgba(255,255,255,0.06)'}}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1"
                style={activeTab === tab.id ? {
                  background:'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(139,92,246,0.2))',
                  color:'#818cf8', border:'1px solid rgba(99,102,241,0.3)'
                } : {
                  background:'transparent',
                  color:'rgba(148,163,184,0.6)',
                  border:'1px solid transparent'
                }}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="md:col-span-3">
            {activeTab === "profile" && (
              <div className="glass rounded-2xl p-6" style={{border:'1px solid rgba(255,255,255,0.06)'}}>
                <h2 className="text-lg font-semibold mb-6" style={{color:'#e2e8f0'}}>Profile Information</h2>
                {profileMsg.text && (
                  <div className="mb-4 p-3 rounded-xl text-sm" style={msgStyle(profileMsg.type)}>
                    {profileMsg.text}
                  </div>
                )}
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Full Name</label>
                    <input type="text" name="name" value={profile.name}
                      onChange={handleProfileChange} required
                      className="input-field w-full rounded-xl px-4 py-3 text-sm"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Email Address</label>
                    <input type="email" name="email" value={profile.email}
                      onChange={handleProfileChange} required
                      className="input-field w-full rounded-xl px-4 py-3 text-sm"
                      placeholder="your@email.com" />
                  </div>
                  <button type="submit" disabled={profileLoading}
                    className="btn-primary px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                    style={{opacity: profileLoading ? 0.7 : 1}}>
                    {profileLoading ? "Saving..." : "Save Changes →"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="glass rounded-2xl p-6" style={{border:'1px solid rgba(255,255,255,0.06)'}}>
                <h2 className="text-lg font-semibold mb-6" style={{color:'#e2e8f0'}}>Change Password</h2>
                {passwordMsg.text && (
                  <div className="mb-4 p-3 rounded-xl text-sm" style={msgStyle(passwordMsg.type)}>
                    {passwordMsg.text}
                  </div>
                )}
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Current Password</label>
                    <input type="password" name="currentPassword" value={passwordForm.currentPassword}
                      onChange={handlePasswordChange} required
                      className="input-field w-full rounded-xl px-4 py-3 text-sm"
                      placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>New Password</label>
                    <input type="password" name="newPassword" value={passwordForm.newPassword}
                      onChange={handlePasswordChange} required minLength={6}
                      className="input-field w-full rounded-xl px-4 py-3 text-sm"
                      placeholder="At least 6 characters" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color:'rgba(148,163,184,0.9)'}}>Confirm New Password</label>
                    <input type="password" name="confirmPassword" value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange} required
                      className="input-field w-full rounded-xl px-4 py-3 text-sm"
                      placeholder="••••••••" />
                  </div>
                  <button type="submit" disabled={passwordLoading}
                    className="btn-primary px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                    style={{opacity: passwordLoading ? 0.7 : 1}}>
                    {passwordLoading ? "Updating..." : "Update Password →"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "danger" && (
              <div className="glass rounded-2xl p-6" style={{border:'1px solid rgba(239,68,68,0.2)'}}>
                <h2 className="text-lg font-semibold mb-2" style={{color:'#f87171'}}>Danger Zone</h2>
                <p className="text-sm mb-6" style={{color:'rgba(148,163,184,0.5)'}}>
                  These actions are permanent and cannot be undone.
                </p>
                <div className="p-4 rounded-xl" style={{background:'rgba(239,68,68,0.05)',border:'1px solid rgba(239,68,68,0.15)'}}>
                  <h3 className="text-sm font-semibold mb-1" style={{color:'#f87171'}}>Delete Account</h3>
                  <p className="text-xs mb-4" style={{color:'rgba(148,163,184,0.5)'}}>
                    Permanently deletes your account and all your items. This cannot be undone.
                  </p>
                  <button onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{background:'rgba(239,68,68,0.15)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)'}}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.15)'}>
                    Delete My Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
