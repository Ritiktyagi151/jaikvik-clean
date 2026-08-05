import type navmenuInterface from "../../interfaces/navmenuInterface";
import Link from "next/link";

const NavMenu: React.FC<navmenuInterface> = ({
  title = "",
  menu = [],
  href = "",
}) => {
  return (
    <li className="group text-uppercase">
      <Link
        href={href}
        className="flex items-center px-2.5 py-2.5 font-semibold uppercase text-white transition-colors duration-300 hover:text-red-500"
      >
        {title}
      </Link>
      {menu.length > 0 && (
        <div className="pointer-events-none absolute left-4 right-4 top-full z-[100] opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 rounded-md bg-main-secondary/85 p-5 shadow-lg backdrop-blur-md">
            {menu.map((item, index) => (
              <Link
                key={`${item.href}-${index}`}
                href={item.href as string}
                className="container-img group/item relative block overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={item.text}
                  className="w-full rounded-md shadow-lg transition-transform duration-300 group-hover/item:scale-105"
                  loading="lazy"
                />
                <div className="image-text absolute left-0 right-0 top-0 px-1 py-1 text-center text-sm font-medium text-white transition-all duration-300">
                  {item.text}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </li>
  );
};

export default NavMenu;
