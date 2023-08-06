import React, { useEffect } from "react";

export const styles = {
  productSectionStyles: "text-4xl text-center text-primary font-semibold mb-6",
  legend: "text-lg font-medium text-primary",
  legend2: "text-base font-medium text-primary capitalize",
  select: "px-4 py-2 w-full text-sm border rounded",
  nav_link:
    "text-sm text-secondary font-semibold hover:text-accent transition-colors",
};

const CloseButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  ...props
}) => {
  return (
    <button {...props}>
      <span>close</span>
    </button>
  );
};

const Header = ({
  children,
  close,
}: {
  children?: React.ReactNode;
  close: () => void;
}) => {
  if (children) {
    return (
      <div className="bg-w sticky top-0 flex justify-between items-center px-4 pt-4">
        <legend
          className={styles.legend}
          style={{ textTransform: "capitalize" }}
        >
          {children}
        </legend>
        <CloseButton
          className="border border-[var(--text-secondary)] rounded-sm"
          onClick={close}
        />
      </div>
    );
  }
  return (
    <CloseButton
      className="absolute right-4 top-2 border border-[var(--text-secondary)] rounded-sm bg-w"
      onClick={close}
    />
  );
};

interface ModalInterface {
  children: React.ReactNode;
  innerref: React.RefObject<HTMLDialogElement>;
  onClosed?: () => void;
  title?: string;
}

const Modal: React.FC<ModalInterface> = ({
  children,
  innerref,
  title,
  onClosed,
}) => {
  useEffect(() => {
    if (!onClosed) return;
    if (innerref.current) innerref.current.addEventListener("close", onClosed);
    return () => {
      if (innerref.current)
        innerref.current.removeEventListener("close", onClosed);
    };
  }, []);

  return (
    <dialog
      className={`absolute z-[999] max-h-[90vh] w-[85%] sm:w-fit max-w-[90vw] rounded overflow-x-hidden overflow-y-auto shadow-2xl bg-w backdrop:bg-black/80w p-0`}
      ref={innerref}
    >
      <Header close={() => innerref.current?.close()}>{title}</Header>
      <div className="p-4">{children}</div>
    </dialog>
  );
};

export default Modal;
