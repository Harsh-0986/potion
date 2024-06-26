import { Link } from "react-router-dom";

const Header = () => {
  return (
    <section className="z-[150] sticky top-0 right-0 left-0 bg-zinc-600 text-white font-sans">
      <header className="flex md:justify-start justify-center px-4 py-6 border-b border-black h-[10%]">
        <Link to="/">
          <span className="text-3xl font-extrabold">Potion</span>
        </Link>
      </header>
    </section>
  );
};

export default Header;
