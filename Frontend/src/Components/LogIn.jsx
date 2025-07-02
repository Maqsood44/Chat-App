import axios from "axios";
import React, { useState } from "react";
import { addUserData } from "../Store/ReducSlice";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Login() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("dob", dob);
        formData.append("gender", gender);
        formData.append("profileImage", profileImage);
        const res = await axios.post("/api/v1/user/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res.data?.data);
        setEmail("");
        setPassword("");
        setIsSignup(false);
      } catch (error) {
        console.error("Registration Error:", error);
      }
    } else {
      try {
        const response = await axios.post("/api/v1/user/login", {
          email,
          password,
        });
        dispatch(addUserData(response.data.data.user));
        setEmail("");
        setPassword("");
      } catch (error) {
        console.error("Login Error:", error);
      }
    }
  };

  const toggleForm = () => {
    setIsSignup((prev) => !prev);
  };

  return (
    <>
      <section
        className="relative flex items-center justify-center bg-gray-50 dark:bg-gray-900 min-h-screen overflow-hidden
      before:content-[''] before:absolute before:top-0 before:left-0 before:w-full
      before:h-full before:bg-[url('/picture5.jpg')] before:bg-center before:bg-cover before:opacity-20"
      >
        <div className="relative z-10 flex flex-col items-center px-6 py-5 mx-auto w-full max-w-md bg-[rgba(50,53,56,0.5)] rounded-3xl shadow-2xl">
          <img src="./logo white.png" alt="logo" className="w-12 h-12 mb-2" />
          <h1 className="text-3xl font-bold text-blue-600 mb-4">C4CHAT</h1>

          <AnimatePresence mode="wait">
            {isSignup ? (
              <motion.form
                key="signup"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="w-full space-y-4"
              >
                <h2 className="text-2xl font-bold text-center text-blue-600">
                  Sign Up
                </h2>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border text-gray-200 border-gray-300 focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border  text-gray-200 border-gray-300 focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-full border text-gray-200 border-gray-300 focus:ring-2 focus:ring-blue-400"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3 right-4 text-xl text-gray-400 cursor-pointer"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-full border text-gray-200 border-gray-300 focus:ring-2 focus:ring-blue-400"
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute top-3 right-4 text-xl text-gray-400 cursor-pointer"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>

                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-50 px-4 py-3 rounded-full border text-gray-200 border-gray-300 focus:ring-2 focus:ring-blue-400"
                />

                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-50 px-4 py-3 rounded-full border text-gray-200 bg-tra border-gray-300 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="female">Other</option>
                </select>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="w-50 px-4 py-2 bg-gray-500 rounded-full border text-gray-200 border-gray-300 focus:ring-2 focus:ring-blue-400 cursor-pointer"
                />

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold hover:opacity-90 transition"
                >
                  Sign Up
                </button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <span
                    onClick={toggleForm}
                    className="text-blue-500 font-medium hover:underline cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="login"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="w-full space-y-4"
              >
                <h2 className="text-2xl font-bold text-center text-blue-600">
                  Login
                </h2>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border text-gray-200 border-gray-300 focus:ring-2 focus:ring-blue-400"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-full border text-gray-200 border-gray-300 focus:ring-2 focus:ring-blue-400"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 right-4 text-xl text-gray-400 cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
                <div className="text-right text-sm">
                  <a href="#" className="text-blue-400 hover:underline">
                    Forgot your password?
                  </a>
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  {isSignup ? "Sign Up" : "Login"}
                </motion.button>

                <p className="text-center text-sm text-gray-300">
                  Don’t have an account?{" "}
                  <span
                    onClick={toggleForm}
                    className="text-blue-500 font-medium hover:underline cursor-pointer"
                  >
                    Sign up
                  </span>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

export default Login;
