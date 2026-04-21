import React, { useState } from 'react';

export const LoginModal = ({ onLogin }: any) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">

        {/* Background */}
  <div className="absolute inset-0">
    <img 
      src="https://images.unsplash.com/photo-1551434678-e076c223a692"
      className="w-full h-full object-cover blur-sm opacity-40"
    />
  </div>
  {/* Overlay */}
  <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
      
        <div className="relative bg-white rounded-xl shadow-2xl p-6 w-[320px]">

        {/* Header */}
        <h2 className="text-lg font-bold text-slate-900 mb-1 text-center">
          Welcome Back 👋
        </h2>

        <p className="text-xs text-slate-500 mb-5 text-center">
          Login to continue to TMS
        </p>

        {/* Inputs */}
        <input
          placeholder="Username"
          className="w-full mb-3 p-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 p-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
};