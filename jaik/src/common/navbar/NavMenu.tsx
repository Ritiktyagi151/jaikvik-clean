import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import type navmenuInterface from "../../interfaces/navmenuInterface";
import Link from "next/link";

const NavMenu: React.FC<navmenuInterface> = ({
  title = "",
  menu = [],
  href = "",
}) => {
  const items: MenuProps["items"] = menu.map((item, index) => ({
    key: index,
    label: (
      <Link
        href={item.href as string}
        className="container-img relative block group overflow-hidden"
      >
        <img
          src={item.img}
          alt={item.text}
          className="w-full rounded-md shadow-lg group-hover:scale-105 transition-transform duration-300"
        />
        <div className="image-text absolute top-0 left-0 right-0 text-white font-medium text-sm px-1 py-1 text-center transition-all duration-300">
          {item.text}
        </div>
      </Link>
    ),
  }));

  return (
    <Dropdown
      menu={{
        items,
        className:
          "custom-mega-menu !bg-main-secondary/20 backdrop-blur-md shadow-lg p-5 rounded-md",
        style: {
          width: "100vw",
          maxWidth: "calc(100vw - 32px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "8px",
          backdropFilter: "blur(12px)",
        },
      }}
      trigger={["hover"]}
      overlayClassName="mega-dropdown"
      placement="bottom"
      overlayStyle={{
        backgroundColor: "transparent",
        boxShadow: "none",
        backdropFilter: "blur(12px)",
      }}
    >
      <li className="text-uppercase group">
        <Link
          href={href}
          className="text-white uppercase font-semibold transition-all duration-300 px-2.5 py-2.5 hover:text-red-500 flex items-center"
        >
          {title}
        </Link>
      </li>
    </Dropdown>
  );
};

export default NavMenu;
