import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-10">
        <Link to="/" className="text-xl font-bold tracking-wider text-white">
          Skill<span className="text-primary">Map</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-300">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <Link to="/about" className="hover:text-white transition">О нас</Link>
          <Link to="/roadmap" className="hover:text-white transition">Карта навыков</Link>
        </nav>
      </div>
      <div>
        <Link 
          to="/profile" 
          className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-5 py-2 rounded-full transition shadow-lg shadow-primary/20"
        >
          Личный кабинет
        </Link>
      </div>
    </header>
  );
};