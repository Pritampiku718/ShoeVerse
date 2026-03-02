import { FiFacebook, FiTwitter, FiYoutube, FiInstagram } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0b1220] to-[#0f172a] text-gray-300 text-xs xs:text-sm border-t border-gray-800/50">
      
      {/*TOP GRID*/}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-8 xs:py-10 sm:py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10">
        
        {/* ABOUT */}
        <div>
          <h4 className="text-gray-400 text-[9px] xs:text-[10px] sm:text-xs uppercase mb-2 xs:mb-3 sm:mb-4 tracking-wider font-semibold">
            About
          </h4>
          <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2">
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Contact Us
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              About Us
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Careers
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Press
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Corporate Information
            </li>
          </ul>
        </div>

        {/* GROUP COMPANIES */}
        <div>
          <h4 className="text-gray-400 text-[9px] xs:text-[10px] sm:text-xs uppercase mb-2 xs:mb-3 sm:mb-4 tracking-wider font-semibold">
            Group Companies
          </h4>
          <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2">
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              SneakerHub
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              StreetWear Co.
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              KickSupply
            </li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h4 className="text-gray-400 text-[9px] xs:text-[10px] sm:text-xs uppercase mb-2 xs:mb-3 sm:mb-4 tracking-wider font-semibold">
            Help
          </h4>
          <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2">
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Payments
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Shipping
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Cancellation & Returns
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              FAQ
            </li>
          </ul>
        </div>

        {/* CONSUMER POLICY */}
        <div>
          <h4 className="text-gray-400 text-[9px] xs:text-[10px] sm:text-xs uppercase mb-2 xs:mb-3 sm:mb-4 tracking-wider font-semibold">
            Consumer Policy
          </h4>
          <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2">
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Terms Of Use
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Security
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Privacy
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Sitemap
            </li>
            <li className="hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer text-[10px] xs:text-xs sm:text-sm text-gray-400">
              Grievance Redressal
            </li>
          </ul>
        </div>

        {/* MAIL US */}
        <div className="lg:border-l border-gray-700/50 lg:pl-6">
          <h4 className="text-gray-400 text-[9px] xs:text-[10px] sm:text-xs uppercase mb-2 xs:mb-3 sm:mb-4 tracking-wider font-semibold">
            Mail Us:
          </h4>
          <p className="text-gray-400 leading-relaxed text-[8px] xs:text-[9px] sm:text-xs">
            ShoeVerse Internet Private Limited,
            <br />
            123 Mercer Street,
            <br />
            New York, NY 10012,
            <br />
            United States
          </p>

          <div className="flex gap-2 xs:gap-3 sm:gap-4 mt-2 xs:mt-3 sm:mt-4">
            <FiFacebook className="cursor-pointer text-gray-400 hover:text-[#1877F2] hover:scale-110 transition-all duration-300 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <FiTwitter className="cursor-pointer text-gray-400 hover:text-[#1DA1F2] hover:scale-110 transition-all duration-300 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <FiYoutube className="cursor-pointer text-gray-400 hover:text-[#FF0000] hover:scale-110 transition-all duration-300 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <FiInstagram className="cursor-pointer text-gray-400 hover:text-[#E4405F] hover:scale-110 transition-all duration-300 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </div>
        </div>

        {/* REGISTERED OFFICE */}
        <div>
          <h4 className="text-gray-400 text-[9px] xs:text-[10px] sm:text-xs uppercase mb-2 xs:mb-3 sm:mb-4 tracking-wider font-semibold">
            Registered Office Address:
          </h4>
          <p className="text-gray-400 leading-relaxed text-[8px] xs:text-[9px] sm:text-xs">
            ShoeVerse Internet Private Limited,
            <br />
            123 Mercer Street,
            <br />
            New York, NY 10012,
            <br />
            United States
            <br />
            CIN: U12345NY2026PTC000001
            <br />
            Telephone: +1 (212) 555-7890
          </p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-800/70"></div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-3 xs:py-3.5 sm:py-4 overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 xs:gap-3.5 sm:gap-4 md:gap-6 whitespace-normal sm:whitespace-nowrap min-w-full">
          {/* LEFT LINKS */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 text-[9px] xs:text-[10px] sm:text-xs md:text-sm">
            <span className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer text-gray-400">
              Become a Seller
            </span>
            <span className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer text-gray-400">
              Advertise
            </span>
            <span className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer text-gray-400">
              Gift Cards
            </span>
            <span className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 cursor-pointer text-gray-400">
              Help Center
            </span>
          </div>

          {/* COPYRIGHT */}
          <div className="text-center sm:text-left text-[8px] xs:text-[9px] sm:text-xs md:text-sm text-gray-400 order-first sm:order-none font-medium">
            © 2026 ShoeVerse.com
          </div>

          {/* PAYMENT STRIP */}
          <div className="flex flex-wrap justify-center items-center gap-1 xs:gap-1.5 sm:gap-2">
            {/* VISA */}
            <div className="bg-white border border-gray-300 rounded-sm px-1 xs:px-1.5 sm:px-2 h-[20px] xs:h-[22px] sm:h-[24px] md:h-[26px] lg:h-[28px] flex items-center hover:shadow-md hover:scale-105 transition-all duration-300">
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#1A1F71]">
                VISA
              </span>
            </div>

            {/* MASTERCARD */}
            <div className="bg-white border border-gray-300 rounded-sm px-1 xs:px-1.5 sm:px-2 h-[20px] xs:h-[22px] sm:h-[24px] md:h-[26px] lg:h-[28px] flex items-center hover:shadow-md hover:scale-105 transition-all duration-300">
              <div className="relative w-3 h-2 xs:w-4 xs:h-3 sm:w-5 sm:h-3 md:w-5.5 md:h-3.5 lg:w-6 lg:h-4">
                <div className="absolute w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 bg-red-600 rounded-full"></div>
                <div className="absolute left-1 xs:left-1.5 sm:left-2 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 bg-yellow-500 rounded-full opacity-90"></div>
              </div>
            </div>

            {/* AMEX */}
            <div className="bg-white border border-gray-300 rounded-sm px-1 xs:px-1.5 sm:px-2 h-[20px] xs:h-[22px] sm:h-[24px] md:h-[26px] lg:h-[28px] flex items-center hover:shadow-md hover:scale-105 transition-all duration-300">
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-bold text-blue-700">
                AMEX
              </span>
            </div>

            {/* DISCOVER */}
            <div className="bg-white border border-gray-300 rounded-sm px-1 xs:px-1.5 sm:px-2 h-[20px] xs:h-[22px] sm:h-[24px] md:h-[26px] lg:h-[28px] flex items-center hover:shadow-md hover:scale-105 transition-all duration-300">
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-bold text-orange-600">
                DISCOVER
              </span>
            </div>

            {/* RUPAY */}
            <div className="bg-white border border-gray-300 rounded-sm px-1 xs:px-1.5 sm:px-2 h-[20px] xs:h-[22px] sm:h-[24px] md:h-[26px] lg:h-[28px] flex items-center hover:shadow-md hover:scale-105 transition-all duration-300">
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-bold text-blue-800">
                RuPay
              </span>
            </div>

            {/* NET BANKING */}
            <div className="bg-white border border-gray-300 rounded-sm px-1 xs:px-1.5 sm:px-2 h-[20px] xs:h-[22px] sm:h-[24px] md:h-[26px] lg:h-[28px] flex items-center text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-semibold text-gray-800 hover:shadow-md hover:scale-105 transition-all duration-300">
              NET BANKING
            </div>

            {/* CASH ON DELIVERY */}
            <div className="bg-white border border-gray-300 rounded-sm px-1 xs:px-1.5 sm:px-2 h-[20px] xs:h-[22px] sm:h-[24px] md:h-[26px] lg:h-[28px] flex items-center text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-semibold text-gray-800 hover:shadow-md hover:scale-105 transition-all duration-300">
              CASH ON DELIVERY
            </div>

            {/* EASY EMI */}
            <div className="bg-white border border-gray-300 rounded-sm px-1 xs:px-1.5 sm:px-2 h-[20px] xs:h-[22px] sm:h-[24px] md:h-[26px] lg:h-[28px] flex items-center text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-semibold text-gray-800 hover:shadow-md hover:scale-105 transition-all duration-300">
              EASY EMI
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
