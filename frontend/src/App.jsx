
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';

const App = () => {
  const [showToast, setShowToast] = useState(false);

  // useEffect(() => {
  //   const observerOptions = { threshold: 0.1 };
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         entry.target.classList.add('opacity-100', 'translate-y-0');
  //         entry.target.classList.remove('opacity-0', 'translate-y-10');
  //       }
  //     });
  //   }, observerOptions);

  // const animatedElements = document.querySelectorAll('.animate-on-scroll');
  // animatedElements.forEach(el => {
  //   el.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-10');
  //   observer.observe(el);
  // });

  // Demo notification
  //   const timer = setTimeout(() => setShowToast(true), 3000);

  //   return () => {
  //     observer.disconnect();
  //     clearTimeout(timer);
  //   };
  // }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* <NotificationToast show={showToast} onClose={() => setShowToast(false)} /> */}
      <Routes>
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/auth" element={<><Navbar /><Auth /><Footer /></>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
