const BrochureButton = () => {
  return (
    <a
      href="/JaikvikTechnologyBroucher.pdf"
      target="_blank"
      className="fixed  right-[-46px] top-1/2 
        -translate-y-1/2 rotate-90 text-white bg-main-secondary px-4 py-2 font-light tracking-wide z-[999] flex items-center gap-2"
    >
      <span aria-hidden="true" className="text-main-red text-xs font-bold">
        PDF
      </span>
      Brochure
    </a>
  );
};

export default BrochureButton;
