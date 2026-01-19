import React from 'react'
const ResetPassword = ({ password, setPassword, confirmPassword, setConfirmPassword, onReset, onBack }) => {
    return (
        <div>
            <button
                onClick={onBack}
                className="flex items-center text-teal-800 hover:text-teal-900 mb-6 font-medium"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
            </button>

            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h2>
                <p className="text-gray-600">
                    Your new password must be different from previously used passwords
                </p>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter new password"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="Confirm new password"
                    />
                </div>

                <button
                    onClick={onReset}
                    className="w-full bg-teal-800 text-white py-3 rounded-xl font-semibold hover:bg-teal-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
}

export default ResetPassword;
