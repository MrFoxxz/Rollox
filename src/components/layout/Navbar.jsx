import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dice5, House, Shield, Languages } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../features/language/languageSlice";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLang = "es";

  const toggleLanguage = () => {
    const newLang = currentLang === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
    dispatch(setLanguage(newLang));
  };

  const navItems = [
    { to: "/", icon: House, label: t("nav.home") },
    { to: "/dice", icon: Dice5, label: t("nav.dice") },
    { to: "/toolkit", icon: Shield, label: t("nav.toolkit") },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-xl italic uppercase tracking-tighter">
              Rx
            </span>
          </div>
          <span className="text-2xl font-black text-white italic tracking-tight hidden sm:block uppercase">
            Rollox
          </span>
        </NavLink>

        <div className="flex items-center space-x-1 sm:space-x-4">
          <div className="flex items-center sm:space-x-2 mr-2 border-r border-slate-800 pr-4">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary-500 bg-primary-500/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={18} />
                <span className="hidden md:block">{label}</span>
              </NavLink>
            ))}
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors uppercase"
            aria-label={t("common.language")}
          >
            <Languages size={18} className="text-primary-500" />
            <span>{currentLang}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
