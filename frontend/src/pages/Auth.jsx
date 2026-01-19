import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import SignIn from '../sections/SignIn';
import SignUp from '../sections/SignUp';
import ForgotPassword from '../sections/ForgotPassword';
import OTPVerification from '../sections/OTPVerification';
import ResetPassword from '../sections/ResetPassword';
import { useUser } from '../context/UserContext';
const AuthPage = () => {
    const [currentView, setCurrentView] = useState('signIn');
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: ''
    });
    const { setUser } = useUser();
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {

        if (isSignIn) {
            try {
                const res = await authAPI.login(formData);
                if (res.data.user) {
                    console.log('Login successful:', res);
                    setUser(res?.data?.user);
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error('Login error:', err);
                const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
                alert(errorMessage);
            }
        } else {
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            try {
                const registerRes = await authAPI.register(formData);
                console.log('Registration successful:', registerRes);

                setIsSignIn(true);
                setCurrentView('signIn');
                setFormData({
                    name: '',
                    email: formData.email,
                    password: '',
                    confirmPassword: ''
                });
            } catch (err) {
                console.error('Signup error:', err);
                const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
                alert(errorMessage);
            }
        }
    };

    // Password Reset 
    const handleSendOTP = async () => {
        try {
            await authAPI.forgotPassword({ email: formData.email });
            setCurrentView('otpVerification');
        } catch (err) {
            console.error('Send OTP error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            alert(errorMessage);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await authAPI.verifyOTP({ email: formData.email, otp: formData.otp });
            setCurrentView('resetPassword');
        } catch (err) {
            console.error('Verify OTP error:', err);
            const errorMessage = err.response?.data?.message || 'Invalid OTP. Please try again.';
            alert(errorMessage);
        }
    };

    const handleResetPassword = async () => {
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            await authAPI.resetPassword({
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.password,
                confirmPassword: formData.confirmPassword
            });
            setCurrentView('signIn');
            setIsSignIn(true);
            setFormData({
                name: '',
                email: formData.email,
                password: '',
                confirmPassword: '',
                otp: ''
            });
        } catch (err) {
            console.error('Reset password error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to reset password. Please try again.';
            alert(errorMessage);
        }
    };

    const toggleMode = () => {
        setIsSignIn(!isSignIn);
        setCurrentView(isSignIn ? 'signUp' : 'signIn');
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    {(currentView === 'signIn' || currentView === 'signUp') && (
                        <div className="flex gap-2 mb-8 bg-gray-100 rounded-full p-1">
                            <button
                                onClick={() => {
                                    setIsSignIn(true);
                                    setCurrentView('signIn');
                                }}
                                className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all duration-300 ${currentView === 'signIn'
                                    ? 'bg-teal-800 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => {
                                    setIsSignIn(false);
                                    setCurrentView('signUp');
                                }}
                                className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all duration-300 ${currentView === 'signUp'
                                    ? 'bg-teal-800 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    {currentView === 'signIn' && (
                        <SignIn
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            onForgotPassword={() => setCurrentView('forgotPassword')}
                        />
                    )}

                    {currentView === 'signUp' && (
                        <SignUp
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                        />
                    )}

                    {currentView === 'forgotPassword' && (
                        <ForgotPassword
                            email={formData.email}
                            setEmail={(email) => setFormData({ ...formData, email })}
                            onSendOTP={handleSendOTP}
                            onBack={() => setCurrentView('signIn')}
                        />
                    )}

                    {currentView === 'otpVerification' && (
                        <OTPVerification
                            email={formData.email}
                            otp={formData.otp}
                            setOtp={(otp) => setFormData({ ...formData, otp })}
                            onVerify={handleVerifyOTP}
                            onBack={() => setCurrentView('forgotPassword')}
                            onResendOTP={handleSendOTP}
                        />
                    )}

                    {currentView === 'resetPassword' && (
                        <ResetPassword
                            password={formData.password}
                            setPassword={(password) => setFormData({ ...formData, password })}
                            confirmPassword={formData.confirmPassword}
                            setConfirmPassword={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
                            onReset={handleResetPassword}
                            onBack={() => setCurrentView('otpVerification')}
                        />
                    )}


                    {(currentView === 'signIn' || currentView === 'signUp') && (
                        <div className="mt-6 text-center text-sm text-gray-600">
                            {currentView === 'signIn' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={toggleMode}
                                className="text-teal-800 font-semibold hover:text-teal-900 transition-colors"
                            >
                                {currentView === 'signIn' ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                    By continuing, you agree to our{' '}
                    <button className="text-teal-800 hover:underline">Terms of Service</button>
                    {' '}and{' '}
                    <button className="text-teal-800 hover:underline">Privacy Policy</button>
                </p>
            </div>
        </div>
    );
}

export default AuthPage;
