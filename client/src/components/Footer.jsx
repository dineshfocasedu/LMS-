export default function Footer() {
  return (
    <footer className="py-14 px-6" style={{ background: '#0f172a' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">F</div>
              <span className="text-white font-black text-lg">FOCAS Edu</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              India's trusted CA education platform. Courses, kit books, and combo bundles designed to help you crack the exam.
            </p>
            <div className="flex gap-3 mt-4">
              {['📘', '📸', '▶️'].map((icon, i) => {
                return (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm transition-colors">
                    {icon}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Quick Links</p>
            <ul className="flex flex-col gap-3">
              {['All Courses', 'Kit Books', 'Combo Bundles', 'CA Foundation', 'CA Inter', 'CA Final'].map((label) => {
                return (
                  <li key={label}>
                    <a href="#" className="text-sm text-slate-300 hover:text-blue-400 transition-colors">{label}</a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Contact Us</p>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <span>📞</span>
                <a href="tel:+916383514285" className="hover:text-blue-400 transition-colors">+91 63835 14285</a>
              </li>
              <li className="flex gap-3">
                <span>🌐</span>
                <a href="https://www.focasedu.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">www.focasedu.com</a>
              </li>
              <li className="flex gap-3">
                <span>📍</span>
                <span>Nava India Rd, near Radisson Blu, Coimbatore, Tamil Nadu 641004</span>
              </li>
              <li className="flex gap-3">
                <span>📧</span>
                <a href="mailto:kvr@focasedu.com" className="hover:text-blue-400 transition-colors">kvr@focasedu.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-6">
          <span className="text-xs text-slate-500">© 2026 FOCAS Edu. All rights reserved.</span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>🔒</span>
            <span>Payments secured by Razorpay</span>
          </div>
          <div className="flex gap-5">
            <a href="/pdf/privacy.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="/pdf/terms.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="/pdf/terms.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}