import classNames from "classnames";

export function ModalImage({ open, onClose, children }) {
  return (
    <div
      className={classNames(
        "fixed inset-0 bg-black/50 z-50 flex items-center justify-center",
        { hidden: !open }
      )}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-lg max-w-[90vw] w-full mx-4">
        <div className="p-4">{children}</div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ×
        </button>
      </div>
    </div>
  );
}
