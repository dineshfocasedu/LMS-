import { Play, X, Users, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, } from "@/components/ui/dialog";
import thumnail from "../../public/thumnail.jpeg";
import { useNavigate } from "react-router-dom";
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
const HeroSection = () => {
    const navigate = useNavigate();
    const [isVideoOpen, setIsVideoOpen] = useState(false);
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
    const availableSeats = 6; // Change this number dynamically
    const totalSeats = 20;
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
      <section className="pt-24 pb-12">
        <div className="container mx-auto max-w-7xl">
          {/* Enhanced Badge with Animation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex justify-center mb-4 sm:mb-6">
            <motion.div className="relative mt-16 sm:mt-6" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              {/* Animated Background Glow */}
              <motion.div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-full blur-xl" animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
        }} transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        }}/>
              
              {/* Main Badge */}
              <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full shadow-lg border-2 border-red-400/50">
                <div className="flex items-center gap-3">
                  {/* Pulsing Dot */}
                  <motion.div className="relative" animate={{
            scale: [1, 1.2, 1],
        }} transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
        }}>
                    <div className="w-2 h-2 bg-white rounded-full"/>
                    <motion.div className="absolute inset-0 bg-white rounded-full" animate={{
            scale: [1, 2.5],
            opacity: [0.8, 0],
        }} transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
        }}/>
                  </motion.div>

                  {/* Badge Text */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4"/>
                    <span className="font-bold text-sm sm:text-base">
                      Only {availableSeats}/{totalSeats} Seats Left
                    </span>
                    <Zap className="w-4 h-4 animate-pulse"/>
                  </div>
                </div>

                {/* Urgency Indicator */}
                <motion.div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <div className="flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full border border-red-200">
                    <Clock className="w-3 h-3"/>
                    <span>Filling Fast!</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Title - Fully Responsive */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }} className="text-center mb-3 sm:mb-10 md:mb-12 mt-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-sora leading-tight tracking-tight px-2 pt-5">
              1 Tutor for Every 10 Students
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-4xl font-bold font-sora mt-2 sm:mt-3 px-2">
              <span className="text-primary tracking-wide">FOCAS</span>{" "}
              <span className="text-foreground">Personalised Classes for May 2026!</span>
            </p>
          </motion.div>

          {/* Content Grid - Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
            
            {/* Video Card - Clean Thumbnail */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-card border border-border cursor-pointer group shadow-lg hover:shadow-xl transition-shadow" onClick={() => setIsVideoOpen(true)}>
              {/* Video Thumbnail */}
              <div className="relative aspect-video">
                <img src={thumnail} alt="Course preview" className="absolute inset-0 h-full w-full object-cover"/>
                
                {/* Play Button with hover effect */}
                <motion.div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.button className="play-button z-20 group-hover:scale-110 transition-transform ml-32 mt-20" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} aria-label="Play video">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white ml-0.5" fill="currentColor"/>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* Info Cards Grid */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }} className="space-y-3 sm:space-y-4">
              {/* Row 1: Mode & Study Method */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <motion.div className="info-card p-3 sm:p-4 md:p-5" whileHover={{ scale: 1.02, borderColor: "hsl(163 82% 32% / 0.5)" }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <p className="text-muted-foreground text-[10px] xs:text-xs mb-1 sm:mb-1.5">Mode</p>
                  <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-sora text-foreground leading-tight">
                    Online Live
                  </p>
                </motion.div>
                
                <motion.div className="info-card p-3 sm:p-4 md:p-5" whileHover={{ scale: 1.02, borderColor: "hsl(163 82% 32% / 0.5)" }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <p className="text-muted-foreground text-[10px] xs:text-xs mb-1 sm:mb-1.5">Study Method</p>
                  <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-sora text-primary leading-tight">
                    Study with Tutor
                  </p>
                </motion.div>
              </div>
              
              {/* Row 2: Timings & Language */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <motion.div className="info-card p-3 sm:p-4 md:p-5" whileHover={{ scale: 1.02, borderColor: "hsl(163 82% 32% / 0.5)" }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <p className="text-muted-foreground text-[10px] xs:text-xs mb-1 sm:mb-1.5">Flexible Timings</p>
                  <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-sora text-foreground leading-tight">
                    6AM-10PM
                  </p>
                </motion.div>
                
                <motion.div className="info-card p-3 sm:p-4 md:p-5" whileHover={{ scale: 1.02, borderColor: "hsl(163 82% 32% / 0.5)" }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <p className="text-muted-foreground text-[10px] xs:text-xs mb-1 sm:mb-1.5">Language</p>
                  <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-sora text-foreground leading-tight">
                    English & தமிழ்
                  </p>
                </motion.div>
              </div>

              {/* CTA Button - Fully Responsive */}
              <motion.button className="w-full gradient-teal-button text-sm sm:text-base md:text-lg py-3 sm:py-3.5 md:py-4 mt-2 sm:mt-3 px-4 rounded-xl font-semibold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} onClick={() => setIsCounselingOpen(true)}>
                Book 1 on 1 Counseling Session
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal - Responsive */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-0 bg-black border-none overflow-hidden z-[100]">
          <div className="relative aspect-video w-full">
            <video src="https://focasedu-cdn.b-cdn.net/videos/audit.mp4" className="w-full h-full" controls autoPlay playsInline/>
          </div>
        </DialogContent>
      </Dialog>

      {/* Counseling Form Modal */}
      <Dialog open={isCounselingOpen} onOpenChange={setIsCounselingOpen}>
        <DialogOverlay className="z-[100] bg-black/60"/>
        <DialogContent className="max-w-[95vw] sm:max-w-lg p-0 overflow-hidden z-[101] border-none max-h-[90vh] overflow-y-auto rounded-2xl">
          <div className="bg-gradient-to-br from-teal-50 via-white to-primary/5 p-6 sm:p-8 relative">
            {/* Close Button */}
            <button onClick={() => setIsCounselingOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10" aria-label="Close">
              <X className="w-5 h-5 text-gray-600"/>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="w-16 h-16 bg-gradient-to-br from-primary to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white"/>
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold font-sora text-gray-900 mb-2">
                Enter Details
              </h2>
              <p className="text-sm text-gray-600">
                Book your 1-on-1 counseling session
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Name */}
              <div>
                <label htmlFor="studentName" className="block text-sm font-semibold text-gray-900 mb-2">
                  Student Name
                </label>
                <input type="text" id="studentName" name="studentName" value={formData.studentName} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder:text-gray-400" placeholder="Enter Name"/>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-semibold text-gray-900 mb-2">
                  WhatsApp Number
                </label>
                <input type="tel" id="whatsappNumber" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} required pattern="[6-9][0-9]{9}" maxLength={10} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder:text-gray-400" placeholder="Enter WhatsApp Number"/>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder:text-gray-400" placeholder="Enter Email"/>
              </div>

              {/* Is this your first time with CA INTERMEDIATE? */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Is this your first time with CA INTERMEDIATE?
                </label>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-200 hover:border-primary/30 transition-all bg-white">
                    <input type="radio" name="isFirstTime" value="Yes" checked={formData.isFirstTime === "Yes"} onChange={handleInputChange} required className="w-5 h-5 text-primary focus:ring-primary focus:ring-2"/>
                    <span className="text-sm font-medium text-gray-900">Yes</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-200 hover:border-primary/30 transition-all bg-white">
                    <input type="radio" name="isFirstTime" value="No" checked={formData.isFirstTime === "No"} onChange={handleInputChange} required className="w-5 h-5 text-primary focus:ring-primary focus:ring-2"/>
                    <span className="text-sm font-medium text-gray-900">No</span>
                  </label>
                </div>
              </div>

              {/* How many times have you taken the CA Foundation? */}
              <div>
                <label htmlFor="foundationAttempts" className="block text-sm font-semibold text-gray-900 mb-2">
                  How many times have you taken the CA Foundation?
                </label>
                <input type="number" id="foundationAttempts" name="foundationAttempts" value={formData.foundationAttempts} onChange={handleInputChange} required min="0" max="10" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder:text-gray-400" placeholder="Enter number of attempts"/>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                  City
                </label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder:text-gray-400" placeholder="Enter City"/>
              </div>

              {/* Level */}
              <div>
                <label htmlFor="level" className="block text-sm font-semibold text-gray-900 mb-2">
                  Level
                </label>
                <select id="level" name="level" value={formData.level} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-gray-900" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2300a77d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 1rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '3rem'
        }}>
                  <option value="" className="text-gray-400">Please select the level</option>
                  <option value="CA Foundation" className="text-gray-900">CA Foundation</option>
                  <option value="CA Inter" className="text-gray-900">CA Inter</option>
                  <option value="CA Final" className="text-gray-900">CA Final</option>
                </select>
              </div>

              {/* Submit Button */}
              <motion.button type="submit" disabled={isSubmitting} className="w-full gradient-teal-button text-white text-base font-bold py-3.5 rounded-xl mt-6 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 10px 30px rgba(0, 167, 125, 0.3)" } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                {isSubmitting ? "Registering..." : "Register"}
              </motion.button>

              {/* Privacy Note */}
              <p className="text-xs text-center text-gray-600 mt-4">
                🔒 Your information is secure. We'll contact you within 24 hours.
              </p>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>);
};
export default HeroSection;
