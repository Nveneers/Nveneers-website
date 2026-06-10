"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Option<T extends string> = { value: T; label: string };

type StatusDropdownProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  /** Trigger pill colour classes (bg/text/border). */
  colourClass?: string;
  /** Optional per-value accent dot colour class, e.g. { new: "bg-amber-400" }. */
  optionDot?: Record<string, string>;
  /** Trigger size: "sm" (row pickers) or "md" (filter bar). */
  size?: "sm" | "md";
  ariaLabel?: string;
};

// Custom, site-styled dropdown that replaces the native <select> so the open
// option list can be styled. The menu is rendered through a portal with fixed
// positioning so it is never clipped by an `overflow-hidden` ancestor (e.g. the
// rounded table card on desktop).
export default function StatusDropdown<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
  colourClass = "bg-white text-gray-700 border-gray-200",
  optionDot,
  size = "sm",
  ariaLabel
}: StatusDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  const selected = options.find((o) => o.value === value);

  const updateRect = () => {
    if (triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    }
  };

  // Measure the trigger before paint when opening.
  useLayoutEffect(() => {
    if (open) {
      updateRect();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inMenu = menuRef.current?.contains(target);
      if (!inTrigger && !inMenu) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    function onReposition() {
      updateRect();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open]);

  const triggerSize =
    size === "md" ? "rounded-xl px-4 py-2.5 text-sm" : "rounded-lg pl-3 pr-2 py-1 text-xs";

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-1.5 border font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-yellow-100 disabled:opacity-50 ${triggerSize} ${colourClass}`}
      >
        <span className="whitespace-nowrap">{selected?.label ?? value}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && rect && typeof document !== "undefined"
        ? createPortal(
            <ul
              ref={menuRef}
              role="listbox"
              style={{
                position: "fixed",
                top: rect.bottom + 4,
                left: rect.left,
                minWidth: rect.width
              }}
              className="z-50 w-max overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li key={opt.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => {
                        if (opt.value !== value) {
                          onChange(opt.value);
                        }
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 pr-8 text-left text-xs transition hover:bg-gray-50 ${
                        isSelected ? "bg-gray-50 font-semibold text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {optionDot ? (
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${optionDot[opt.value] ?? "bg-gray-300"}`}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className="whitespace-nowrap">{opt.label}</span>
                      {isSelected ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-auto shrink-0 text-yellow-500"
                          aria-hidden="true"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body
          )
        : null}
    </div>
  );
}
