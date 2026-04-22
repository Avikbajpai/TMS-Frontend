import React, { useState } from 'react';

export const LoginModal = ({ onLogin, onSwitch }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch('https://tms-nexus-api.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token); // 🔥 important
        onLogin(data);
      } else {
        alert("Invalid credentials");
      }
    } catch (e) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-900">

    {/* 🔥 Background Image */}
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1551434678-e076c223a692"
        className="w-full h-full object-cover opacity-30"
      />
    </div>

    {/* 🔥 Dark Blur Overlay */}
    <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/70" />

    {/* 🔥 Card */}
    <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-8 w-[320px]">

      <h2 className="text-lg font-bold text-white text-center">
        Welcome Back 👋
      </h2>

      <p className="text-xs text-slate-400 text-center mt-1">
        Login to continue to TMS
      </p>

      <input
        placeholder="Username"
        className="mt-4 w-full p-2 rounded-md bg-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="mt-3 w-full p-2 rounded-md bg-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="mt-5 w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p
        className="text-xs text-center mt-4 text-slate-400 cursor-pointer hover:text-white"
        onClick={onSwitch}
      >
        New user? Sign up
      </p>
    </div>
  </div>
);
}