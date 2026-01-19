import React from 'react';
const SignIn = ({ formData, handleInputChange, handleSubmit, onForgotPassword }) => {

    return (
        <div className="space-y-5">
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

            <div className="flex items-center justify-between text-sm">
                {/* <label className="flex items-center text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        className="mr-2 rounded border-gray-300 text-teal-800 focus:ring-teal-500 cursor-pointer"
                    />
                    Remember me
                </label> */}
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-teal-800 hover:text-teal-900 font-medium"
                >
                    Forgot Password?
                </button>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-teal-800 text-white py-3 rounded-xl font-semibold transform transition-all duration-200 shadow-lg hover:bg-teal-900 hover:scale-[1.02] hover:shadow-xl"
            >
                Sign In
            </button>
        </div>
    );
};

export default SignIn;
