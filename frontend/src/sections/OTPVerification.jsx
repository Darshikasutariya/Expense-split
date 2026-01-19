import React from 'react'
const OTPVerification = ({ email, otp, setOtp, onVerify, onBack, onResendOTP }) => {
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-teal-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                <p className="text-gray-600">
                    We've sent a 6-digit verification code to<br />
                    <span className="font-semibold text-gray-900">{email}</span>
                </p>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter OTP Code
                    </label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest font-semibold"
                        placeholder="000000"
                    />
                </div>

                <button
                    onClick={onVerify}
                    className="w-full bg-teal-800 text-white py-3 rounded-xl font-semibold hover:bg-teal-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Verify Code
                </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                    onClick={onResendOTP}
                    className="text-teal-800 font-semibold hover:text-teal-900 transition-colors"
                >
                    Resend OTP
                </button>
            </div>
        </div>
    );
}

export default OTPVerification;
