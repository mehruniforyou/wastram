"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  desc?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  disabled?: boolean;
}

export interface AdminCustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  label?: string;
  variant?: "pill" | "form" | "compact" | "badge" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  icon?: React.ReactNode;
  align?: "left" | "right" | "full";
  prefix?: string;
}

export default function AdminCustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Option auswählen...",
  label,
  variant = "form",
  size = "md",
  searchable = false,
  disabled = false,
  className = "",
  triggerClassName = "",
  dropdownClassName = "",
  icon,
  align = "left",
  prefix
}: AdminCustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to SelectOption[]
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => String(opt.value) === String(value)) || null;
  }, [normalizedOptions, value]);

  // Filter options if searchable
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        String(opt.value).toLowerCase().includes(q) ||
        (opt.desc && opt.desc.toLowerCase().includes(q))
    );
  }, [normalizedOptions, searchQuery]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && (searchable || normalizedOptions.length > 7)) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable, normalizedOptions.length]);

  // Dynamic Trigger styling based on variant & size
  const getTriggerStyle = () => {
    let base = "relative flex items-center justify-between transition-all cursor-pointer select-none font-sans outline-none ";

    if (disabled) {
      return base + "opacity-50 cursor-not-allowed bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-4 py-2 text-xs";
    }

    switch (variant) {
      case "pill":
        base += "bg-card text-foreground border border-border hover:bg-muted hover:text-foreground rounded-full font-bold uppercase tracking-wider ";
        if (size === "xs") base += "px-3 py-1 text-[10px] gap-1.5 ";
        else if (size === "sm") base += "px-3.5 py-1.5 text-xs gap-2 ";
        else if (size === "lg") base += "px-5 py-2.5 text-sm gap-2.5 ";
        else base += "px-4 py-2 text-xs gap-2 ";
        break;

      case "outline":
        base += "bg-card text-foreground border border-border hover:border-blue-500/60 rounded-full font-bold transition-all ";
        if (size === "xs") base += "px-3 py-1 text-[10px] gap-1.5 ";
        else if (size === "sm") base += "px-3.5 py-1.5 text-xs gap-2 ";
        else if (size === "lg") base += "px-5 py-2.5 text-sm gap-2.5 ";
        else base += "px-4 py-2 text-xs gap-2 ";
        break;

      case "compact":
      case "badge":
        base += "bg-card border border-border hover:border-blue-500/60 rounded-full px-2.5 py-1 text-[11px] font-bold text-foreground gap-1.5 ";
        break;

      case "form":
      default:
        base += "w-full bg-card text-foreground border border-border focus:border-blue-600 hover:border-blue-500/60 rounded-full px-4 py-2 text-xs font-bold placeholder:text-muted-foreground ";
        if (size === "xs") base += "py-1 px-3 text-[10px] ";
        else if (size === "sm") base += "py-1.5 px-3.5 text-xs ";
        else if (size === "lg") base += "py-3 px-5 text-sm ";
        else base += "py-2 px-4 text-xs ";
        break;
    }

    return base + triggerClassName;
  };

  const isLongList = searchable || normalizedOptions.length > 7;

  return (
    <div ref={containerRef} className={`relative inline-block ${variant === "form" ? "w-full" : ""} ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={getTriggerStyle()}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate text-left min-w-0 flex-1">
          {icon && <span className="shrink-0">{icon}</span>}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          {prefix && <span className="text-slate-700 font-normal shrink-0">{prefix}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
              selectedOption.badgeColor || "bg-muted text-foreground border border-border"
            }`}>
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ml-1.5 ${
            isOpen ? "rotate-180 text-blue-600" : "text-muted-foreground group-hover:text-foreground"
          }`}
        />
      </button>

      {/* Dropdown Flyout Menu */}
      {isOpen && (
        <div
          className={`absolute mt-1.5 bg-card border border-border rounded-2xl z-[100] shadow-xl p-1.5 text-foreground animate-fade-in ${
            align === "right"
              ? "right-0 min-w-[200px]"
              : align === "full" || variant === "form"
              ? "left-0 w-full min-w-[220px]"
              : "left-0 min-w-[220px]"
          } ${dropdownClassName}`}
          role="listbox"
        >
          {/* Optional Search Box */}
          {isLongList && (
            <div className="p-1.5 pb-2 border-b border-border mb-1">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted-foreground pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search options..."
                  className="w-full bg-muted/40 border border-input focus:border-blue-600 focus:ring-1 focus:ring-blue-500/25 rounded-xl pl-8 pr-7 py-1.5 text-xs font-medium text-foreground placeholder:text-muted-foreground outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-[260px] overflow-y-auto space-y-0.5 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-3 text-center text-xs text-muted-foreground font-medium">
                Keine passenden Optionen
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => {
                      if (!opt.disabled) {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearchQuery("");
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-blue-600 text-white font-bold"
                        : opt.disabled
                        ? "opacity-40 cursor-not-allowed text-muted-foreground"
                        : "text-foreground hover:bg-muted hover:text-foreground font-semibold"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{opt.label}</span>
                        {opt.desc && (
                          <span
                            className={`text-[10px] font-normal truncate ${
                              isSelected ? "text-slate-200" : "text-slate-700"
                            }`}
                          >
                            {opt.desc}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {opt.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : opt.badgeColor || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
