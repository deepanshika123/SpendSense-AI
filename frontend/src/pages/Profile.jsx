import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Wallet, ShieldCheck, CalendarDays, User } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const API = import.meta.env.VITE_API_URL;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user);
    } catch (error) {
      console.log("Profile Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-orange-400">
          Loading Profile...
        </h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-red-500 text-2xl">Failed to load profile</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-[#111111] border border-[#222] rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-3">
        {/* LEFT SIDE */}
        <div className="bg-linear-to-b from-orange-600 to-orange-800 p-8 flex flex-col items-center justify-center">
          <img
            src={
              user.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-xl"
          />

          <h2 className="mt-5 text-3xl font-bold">{user.name}</h2>

          <p className="text-orange-100 mt-2 break-all text-center">
            {user.email}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:col-span-2 p-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-white">My Profile</h1>

            <p className="text-gray-400 mt-2">
              Manage your personal account details
            </p>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl hover:border-orange-500 transition duration-300">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-orange-400" />
                <h3 className="font-semibold text-lg">Full Name</h3>
              </div>

              <p className="text-gray-300 text-lg">{user.name}</p>
            </div>

            {/* Email */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl hover:border-pink-500 transition duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-pink-400" />
                <h3 className="font-semibold text-lg">Email Address</h3>
              </div>

              <p className="text-gray-300 break-all">{user.email}</p>
            </div>

            {/* Currency */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl hover:border-green-500 transition duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="text-green-400" />
                <h3 className="font-semibold text-lg">Currency</h3>
              </div>

              <p className="text-gray-300 text-lg">{user.currency}</p>
            </div>

            {/* Login Method */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl hover:border-blue-500 transition duration-300">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-blue-400" />
                <h3 className="font-semibold text-lg">Login Method</h3>
              </div>

              <p className="text-gray-300 capitalize text-lg">
                {user.authProvider}
              </p>
            </div>

            {/* Joined Date */}
            <div className="sm:col-span-2 bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl hover:border-orange-500 transition duration-300">
              <div className="flex items-center gap-3 mb-4">
                <CalendarDays className="text-orange-400" />
                <h3 className="font-semibold text-lg">Joined On</h3>
              </div>

              <p className="text-gray-300 text-lg">
                {new Date(user.createdAt).toDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
