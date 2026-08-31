import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function isSameDay(a, b) {
  return (
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

function parseISO(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toISO(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatLabel(date) {
  if (!date) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function buildGrid(viewYear, viewMonth) {
  const firstDay = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startWeekDay = firstDay.getDay();
  const cells = [];
  for (let i = 0; i < startWeekDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(viewYear, viewMonth, day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/**
 * DatePicker: dark themed calendar with neon-green accent. Accepts either a
 * `Date` or an ISO string via `value`, emits ISO string via `onChange` so it
 * plugs straight into forms already storing dates as strings.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Selecionar data",
  testId,
  disabled = false,
  ariaLabel,
}) {
  const selected = useMemo(() => parseISO(value), [value]);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const base = selected || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && selected) setViewDate(new Date(selected.getFullYear(), selected.getMonth(), 1));
  }, [open, selected]);

  const grid = useMemo(
    () => buildGrid(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate],
  );
  const today = new Date();

  const goMonth = (delta) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const pick = (date) => {
    onChange?.(toISO(date));
    setOpen(false);
  };

  return (
    <div className="fox-datepicker" ref={containerRef} data-testid={testId}>
      <button
        type="button"
        className="fox-datepicker-trigger"
        onClick={() => !disabled && setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
        data-testid={testId ? `${testId}-trigger` : undefined}
      >
        <CalendarDays size={16} />
        <span className={selected ? "" : "is-placeholder"}>
          {selected ? formatLabel(selected) : placeholder}
        </span>
      </button>

      {open && (
        <div
          className="fox-datepicker-popover"
          role="dialog"
          aria-modal="false"
          data-testid={testId ? `${testId}-popover` : undefined}
        >
          <div className="fox-datepicker-header">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              aria-label="Mês anterior"
              className="fox-datepicker-nav"
            >
              <ChevronLeft size={16} />
            </button>
            <strong>
              {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </strong>
            <button
              type="button"
              onClick={() => goMonth(1)}
              aria-label="Próximo mês"
              className="fox-datepicker-nav"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="fox-datepicker-weekdays">
            {WEEK_DAYS.map((letter, index) => (
              <span key={`${letter}-${index}`}>{letter}</span>
            ))}
          </div>
          <div className="fox-datepicker-grid">
            {grid.map((date, index) => {
              if (!date) return <span key={`empty-${index}`} className="fox-datepicker-cell empty" />;
              const isSelected = isSameDay(date, selected);
              const isToday = isSameDay(date, today);
              return (
                <button
                  type="button"
                  key={date.toISOString()}
                  className={`fox-datepicker-cell ${isSelected ? "is-selected" : ""} ${
                    isToday ? "is-today" : ""
                  }`}
                  onClick={() => pick(date)}
                  aria-pressed={isSelected}
                  aria-current={isToday ? "date" : undefined}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <div className="fox-datepicker-footer">
            <button
              type="button"
              className="fox-datepicker-quick"
              onClick={() => pick(new Date())}
            >
              Hoje
            </button>
            <button
              type="button"
              className="fox-datepicker-quick fox-datepicker-clear"
              onClick={() => {
                onChange?.("");
                setOpen(false);
              }}
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
