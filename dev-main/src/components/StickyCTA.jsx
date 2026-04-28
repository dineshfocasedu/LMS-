import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
const logo = "/focas.jpeg";
const API_URL = "https://script.google.com/macros/s/AKfycbwWQKDML9WpcS--kxA2d9Y3l4ZbRTi7ARA5v5T6bYzllmr9MLptyPsEz30ZvCKoBZzCyg/exec";
// ✅ keep-alive + fire-and-forget helper (fastest UI)
function sendLeadFast(url, data) {
    // 1) Try sendBeacon (best for non-blocking + reliable on navigation)
    try {
        const params = new URLSearchParams(data);
        const ok = navigator.sendBeacon(url, params);
        if (ok)
            return; // sent
    }
    catch {
        // ignore
    }
    // 2) Fallback to fetch (do NOT await)
    try {
        const body = new FormData();
        Object.entries(data).forEach(([k, v]) => body.append(k, v));
        fetch(url, {
            method: "POST",
            mode: "no-cors",
            body,
            keepalive: true,
        }).catch(() => { });
    }
    catch {
        // ignore
    }
}
const StickyCTA = () => {
    const navigate = useNavigate();
    const [isCounselingOpen, setIsCounselingOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        studentName: "",
        whatsappNumber: "",
        email: "",
        isFirstTime: "",
        foundationAttempts: "",
        city: "",
        level: ""
    });
    const validate = (data) => {
        const { studentName, whatsappNumber, email, isFirstTime, foundationAttempts, city, level, } = data;
        if (!studentName ||
            !whatsappNumber ||
            !email ||
            !isFirstTime ||
            !foundationAttempts ||
            !city ||
            !level) {
            return "All fields are required!";
        }
        if (!/^[6-9]\d{9}$/.test(whatsappNumber)) {
            return "WhatsApp number must be a valid 10-digit Indian mobile number.";
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return "Invalid email address.";
        }
        return null;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting)
            return;
        const err = validate(formData);
        if (err) {
            alert(err);
            return;
        }
        setIsSubmitting(true);
        const payload = {
            student_name: formData.studentName.trim(),
            whatsapp_number: formData.whatsappNumber.trim(),
            email: formData.email.trim(),
            previous_attempt: formData.isFirstTime,
            attempts: formData.foundationAttempts.toString(),
            city: formData.city.trim(),
            level: formData.level,
        };
        // ✅ FASTEST: send in background
        sendLeadFast(API_URL, payload);
        // ✅ close modal + reset immediately
        setIsCounselingOpen(false);
        setFormData({
            studentName: "",
            whatsappNumber: "",
            email: "",
            isFirstTime: "",
            foundationAttempts: "",
            city: "",
            level: ""
        });
        // ✅ Show success message
        alert("Thank you! We'll contact you soon for your counseling session.");
        navigate("/success");
        // ✅ unlock button shortly after to prevent accidental double submits
        window.setTimeout(() => setIsSubmitting(false), 800);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    return (<>
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 1, ease: "easeOut" }} className="fixed bottom-0 left-0 right-0 z-50 bg-transparent border-t border-emerald-900/30 shadow-2xl backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6">
            
            {/* Left Side: Avatar + Text */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto">
              {/* Avatar with green ring border */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                {/* Green ring border */}
                <div className="absolute inset-0 rounded-full border-[2.5px] sm:border-[3px] border-emerald-500"/>
                {/* Avatar image container */}
                <div className="absolute inset-[3px] sm:inset-[4px] rounded-full bg-[#0a4743] overflow-hidden">
                  <img src={logo} alt="Mentor" className="w-full h-full object-cover"/>
                </div>
              </div>
              
              {/* Text - Responsive */}
              <div className="text-white flex-1 sm:flex-initial">
                <p className="font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-0.5 leading-tight">
                  1,000+ students already learning.
                </p>
                <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-tight">
                  Still Confused? Request a call back
                </p>
              </div>
            </div>

            {/* Right Side: CTA Button - Fully Responsive */}
            <motion.button onClick={() => setIsCounselingOpen(true)} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg sm:rounded-xl px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 text-sm sm:text-base md:text-lg shadow-lg shadow-emerald-500/20 transition-all duration-300 whitespace-nowrap" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
              Book 1 on 1 Counseling Session
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Counseling Form Modal - Mobile Responsive */}
      {isCounselingOpen && (<div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-3 sm:p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }} className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 rounded-2xl w-full max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto relative">
            <div className="p-5 sm:p-6 md:p-8">
              {/* Close Button */}
              <button onClick={() => setIsCounselingOpen(false)} className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10" aria-label="Close">
                <X className="w-5 h-5 text-gray-600"/>
              </button>

              {/* Header */}
              <div className="text-center mb-5 sm:mb-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white"/>
                </motion.div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-sora text-gray-900 mb-1 sm:mb-2">
                  Enter Details
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Book your 1-on-1 counseling session
                </p>
              </div>

              {/* Form - Mobile Optimized */}
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {/* Student Name */}
                <div>
                  <label htmlFor="studentName" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Student Name
                  </label>
                  <input type="text" id="studentName" name="studentName" value={formData.studentName} onChange={handleInputChange} required className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white hover:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400" placeholder="Enter Name"/>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label htmlFor="whatsappNumber" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    WhatsApp Number
                  </label>
                  <input type="tel" id="whatsappNumber" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} required pattern="[6-9][0-9]{9}" maxLength={10} inputMode="numeric" className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white hover:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400" placeholder="Enter WhatsApp Number"/>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Email
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white hover:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400" placeholder="Enter Email"/>
                </div>

                {/* Is this your first time with CA INTERMEDIATE? */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                    Is this your first time with CA INTERMEDIATE?
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 sm:gap-3 cursor-pointer p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-emerald-500/30 transition-all bg-white">
                      <input type="radio" name="isFirstTime" value="Yes" checked={formData.isFirstTime === "Yes"} onChange={handleInputChange} required className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 focus:ring-emerald-500 focus:ring-2 cursor-pointer"/>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">Yes</span>
                    </label>
                    <label className="flex items-center gap-2.5 sm:gap-3 cursor-pointer p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-emerald-500/30 transition-all bg-white">
                      <input type="radio" name="isFirstTime" value="No" checked={formData.isFirstTime === "No"} onChange={handleInputChange} required className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 focus:ring-emerald-500 focus:ring-2 cursor-pointer"/>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">No</span>
                    </label>
                  </div>
                </div>

                {/* How many times have you taken the CA Foundation? */}
                <div>
                  <label htmlFor="foundationAttempts" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    How many times have you taken the CA Foundation?
                  </label>
                  <input type="number" id="foundationAttempts" name="foundationAttempts" value={formData.foundationAttempts} onChange={handleInputChange} required min="0" max="10" inputMode="numeric" className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white hover:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400" placeholder="Enter number of attempts"/>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    City
                  </label>
                  <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white hover:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm sm:text-base text-gray-900 placeholder:text-gray-400" placeholder="Enter City"/>
                </div>

                {/* Level */}
                <div>
                  <label htmlFor="level" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Level
                  </label>
                  <select id="level" name="level" value={formData.level} onChange={handleInputChange} required className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white hover:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer text-sm sm:text-base text-gray-900" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
            }}>
                    <option value="" className="text-gray-400">Please select the level</option>
                    <option value="CA Foundation" className="text-gray-900">CA Foundation</option>
                    <option value="CA Inter" className="text-gray-900">CA Inter</option>
                    <option value="CA Final" className="text-gray-900">CA Final</option>
                  </select>
                </div>

                {/* Submit Button - Mobile Optimized */}
                <motion.button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm sm:text-base font-bold py-3 sm:py-3.5 rounded-lg sm:rounded-xl mt-4 sm:mt-6 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)" } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  {isSubmitting ? "Registering..." : "Register"}
                </motion.button>

                {/* Privacy Note */}
                <p className="text-[10px] sm:text-xs text-center text-gray-600 mt-3 sm:mt-4">
                  🔒 Your information is secure. We'll contact you within 24 hours.
                </p>
              </form>
            </div>
          </motion.div>
        </div>)}
    </>);
};
export default StickyCTA;
