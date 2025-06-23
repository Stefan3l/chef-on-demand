export default function Button({
  children,
  isMobile = false,
  variant = "white", // "white" sau "yellow"
  className = "",
  ...props
}) {
  const baseStyles = "px-7 py-2 text-md font-bold rounded-4xl cursor-pointer";

  const variants = {
    white: "bg-[#F0EFEF] text-black",
    yellow: "bg-[#F4C858] text-black",
  };

  const mobilePadding = isMobile ? "py-4" : "";

  return (
    <button
      className={`${variants[variant]} ${baseStyles} ${mobilePadding} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
