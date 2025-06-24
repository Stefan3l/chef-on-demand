// import components
import LanguageSelect from "./LaguageSelect";
import Button from "../buttons/Button";

export default function AccessPanel({ isMobile = false, onLoginClick }) {
  return (
    <div
      className={`${
        isMobile
          ? "flex flex-col gap-4 w-full"
          : "hidden lg:flex items-center gap-4"
      }`}
    >
      <Button
        isMobile={isMobile}
        onClick={onLoginClick}
        className="bg-[#F0EFEF] text-black"
      >
        Login
      </Button>
      <Button
        isMobile={isMobile}
        className="bg-[#F0EFEF] text-black"
        variant="yellow"
      >
        Find a Chef
      </Button>
      <div>
        <LanguageSelect />
      </div>
    </div>
  );
}
