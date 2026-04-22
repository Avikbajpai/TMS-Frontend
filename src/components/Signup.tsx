import React, { useState } from "react";

export default function Signup({ onSwitch }: { onSwitch: () => void }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        "http://localhost:8080/api/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            role: "CUSTOMER",
          }),
        }
      );

      if (!res.ok) throw new Error("Signup failed");

      // ✅ SUCCESS UI
      setSuccess("Account created successfully 🚀");

      setTimeout(() => {
        onSwitch(); // login screen
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/70" />

      {/* Card */}
      <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl w-[320px]">

        {/*{ ✅ TOAST INSIDE MODAL }
          {success && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-xs shadow-md animate-slide-in-toast whitespace-nowrap">
              {success}
            </div>
        )} */}

        <h2 className="text-lg font-bold text-white text-center">
          Create Account ✨
        </h2>

        <input
          name="name"
          placeholder="Name"
          className="mt-3 w-full p-2 rounded-md bg-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />

        <input
          name="username"
          placeholder="Username"
          className="mt-3 w-full p-2 rounded-md bg-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="mt-3 w-full p-2 rounded-md bg-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />

        {/* ❌ Error */}
        {error && (
          <p className="text-red-400 text-xs mt-2">{error}</p>
        )}

        {/* ✅ Success */}
        {success && (
          <p className="text-green-400 text-xs mt-2 text-center animate-pulse">
            {success}
          </p>
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="mt-5 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : success ? "Created ✅" : "Sign Up"}
        </button>

        <p
          className="text-xs text-center mt-4 text-slate-400 cursor-pointer hover:text-white"
          onClick={onSwitch}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}