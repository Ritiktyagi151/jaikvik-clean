import { FaDownload } from "react-icons/fa";
const BrochureButton = () => {
  return (
    <a
      href="/brochure"
      className="fixed  right-[-46px] top-1/2 
        -translate-y-1/2 rotate-90 text-white bg-main-secondary px-4 py-2 font-light tracking-wide z-[999] flex items-center gap-2"
    >
      <FaDownload className="text-main-red" />
      Brochure
    </a>
  );
};

export default BrochureButton;
