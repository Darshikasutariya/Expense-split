import React from 'react';

const SignUp = ({ formData, handleInputChange, handleSubmit }) => {
    return (
        <div className="space-y-5">
            <div className="transform transition-all duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your full name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your password"
                />
            </div>

            <div className="transform transition-all duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="Confirm your password"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-teal-800 text-white py-3 rounded-xl font-semibold transform transition-all duration-200 shadow-lg hover:bg-teal-900 hover:scale-[1.02] hover:shadow-xl"
            >
                Create Account
            </button>
        </div>
    );
};

export default SignUp;
