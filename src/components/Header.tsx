import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-start px-4 py-6 border-b border-black">
      <Link to="/">
        <span className="text-3xl font-extrabold">Potion</span>
      </Link>
    </header>
  );
};

export default Header;
