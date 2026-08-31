import { useEffect, useRef, useState } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { suggestBanks } from "@/lib/banks";
import { BankLogo } from "@/components/ui/BankLogo";

/**
 * Autocomplete de bancos. Sugere fragmentos do catálogo estático em
 * `/lib/banks.js`, com pré-visualização de cor. Mantém input controlado por
 * fora — apenas emite o valor completo do banco quando o usuário escolhe.
 */
export function BankAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Ex.: Nubank, Banco Inter, Itaú",
  testId = "bank-autocomplete",
  autoFocus = false,
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const suggestions = suggestBanks(value, 6);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    setFocusedIndex(-1);
  }, [value, open]);

  const chooseBank = (bank) => {
    onChange?.(bank.nome);
    onSelect?.(bank);
    setOpen(false);
  };

  const handleKey = (event) => {
    if (!open && ["ArrowDown", "Enter"].includes(event.key) && suggestions.length) {
      setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((current) => Math.min(current + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && focusedIndex >= 0) {
      event.preventDefault();
      chooseBank(suggestions[focusedIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="fox-bank-autocomplete" ref={containerRef} data-testid={testId}>
      <div className="fox-bank-autocomplete-input">
        <Building2 size={16} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => {
            onChange?.(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          required={required}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          data-testid={`${testId}-input`}
        />
        <ChevronDown
          size={14}
          className={`fox-bank-caret ${open ? "is-open" : ""}`}
          onClick={() => setOpen((current) => !current)}
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul
          className="fox-bank-suggestions"
          role="listbox"
          data-testid={`${testId}-suggestions`}
        >
          {suggestions.map((bank, index) => (
            <li key={bank.id}>
              <button
                type="button"
                className={`fox-bank-suggestion ${focusedIndex === index ? "is-focused" : ""}`}
                onClick={() => chooseBank(bank)}
                onMouseEnter={() => setFocusedIndex(index)}
                data-testid={`${testId}-option-${bank.id}`}
                aria-selected={focusedIndex === index}
              >
                <span className="fox-bank-swatch" aria-hidden="true">
                  <BankLogo bank={bank} size={26} radius={7} />
                </span>
                <span className="fox-bank-name">{bank.nome}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
