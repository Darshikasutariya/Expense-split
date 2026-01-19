import React from 'react'
const ForgotPassword = ({ onBack, onSendOTP, email, setEmail }) => {
    return (
        <div>
            <button
                onClick={onBack}
                className="flex items-center text-teal-800 hover:text-teal-900 mb-6 font-medium"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Sign In
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600 mb-6">
                Enter your email address and we'll send you a verification code to reset your password.
            </p>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter your email"
                    />
                </div>

                <button
                    onClick={onSendOTP}
                    className="w-full bg-teal-800 text-white py-3 rounded-xl font-semibold hover:bg-teal-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Send Verification Code
                </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <button
                    onClick={onBack}
                    className="text-teal-800 font-semibold hover:text-teal-900 transition-colors"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;