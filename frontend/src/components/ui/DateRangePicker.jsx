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

function toISO(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISO(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const [y, m, d] = String(value).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isBetween(date, a, b) {
  if (!date || !a || !b) return false;
  const time = date.getTime();
  const [start, end] = a.getTime() <= b.getTime() ? [a, b] : [b, a];
  return time >= start.getTime() && time <= end.getTime();
}

function buildGrid(year, month) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first.getDay(); i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatShort(date) {
  if (!date) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
}

function summary(fromDate, toDate) {
  if (!fromDate && !toDate) return "";
  if (fromDate && toDate) {
    if (isSameDay(fromDate, toDate)) return fromDate.toLocaleDateString("pt-BR");
    return `${formatShort(fromDate)} – ${formatShort(toDate)}`;
  }
  return `A partir de ${formatShort(fromDate || toDate)}`;
}

function addDays(date, delta) {
  const next = new Date(date);
  next.setDate(next.getDate() + delta);
  return next;
}

/**
 * DateRangePicker: extends the DatePicker interaction to select an interval.
 * Emits `{ from, to }` as ISO strings via `onChange`. Presets on the footer
 * make the common ranges (últimos 7 / 30 / este mês / mês passado) one-tap.
 */
export function DateRangePicker({
  value = { from: "", to: "" },
  onChange,
  placeholder = "Filtrar período",
  testId = "date-range-picker",
  now = new Date(),
}) {
  const from = useMemo(() => parseISO(value?.from), [value?.from]);
  const to = useMemo(() => parseISO(value?.to), [value?.to]);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const base = from || now;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [draft, setDraft] = useState(null); // stores the anchor when picking second date
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

  const grid = useMemo(
    () => buildGrid(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate],
  );

  const emit = (nextFrom, nextTo) => {
    onChange?.({ from: toISO(nextFrom), to: toISO(nextTo) });
  };

  const pick = (date) => {
    if (!draft && !from) {
      setDraft(date);
      emit(date, null);
      return;
    }
    if (draft) {
      const [start, end] = draft.getTime() <= date.getTime() ? [draft, date] : [date, draft];
      emit(start, end);
      setDraft(null);
      setOpen(false);
      return;
    }
    // We already have from+to. New click restarts the range.
    setDraft(date);
    emit(date, null);
  };

  const applyPreset = (preset) => {
    let start;
    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch (preset) {
      case "7d":
        start = addDays(end, -6);
        break;
      case "30d":
        start = addDays(end, -29);
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "lastMonth":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      default:
        start = end;
    }
    setDraft(null);
    setViewDate(new Date(start.getFullYear(), start.getMonth(), 1));
    emit(start, end);
    setOpen(false);
  };

  const clear = () => {
    setDraft(null);
    emit(null, null);
    setOpen(false);
  };

  const isSelected = (date) => isSameDay(date, from) || isSameDay(date, to) || isSameDay(date, draft);
  const isInRange = (date) => {
    if (draft && !to) return false;
    return isBetween(date, from, to);
  };
  const label = summary(from, to);

  return (
    <div className="fox-datepicker" ref={containerRef} data-testid={testId}>
      <button
        type="button"
        className="fox-datepicker-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-testid={`${testId}-trigger`}
      >
        <CalendarDays size={16} />
        <span className={label ? "" : "is-placeholder"}>{label || placeholder}</span>
      </button>

      {open && (
        <div className="fox-datepicker-popover fox-daterange-popover" role="dialog">
          <div className="fox-datepicker-header">
            <button
              type="button"
              className="fox-datepicker-nav"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              aria-label="Mês anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <strong>
              {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </strong>
            <button
              type="button"
              className="fox-datepicker-nav"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              aria-label="Próximo mês"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="fox-datepicker-weekdays">
            {WEEK_DAYS.map((letter, idx) => (
              <span key={`${letter}-${idx}`}>{letter}</span>
            ))}
          </div>
          <div className="fox-datepicker-grid">
            {grid.map((date, idx) => {
              if (!date) return <span key={`empty-${idx}`} className="fox-datepicker-cell empty" />;
              const selected = isSelected(date);
              const inRange = isInRange(date);
              return (
                <button
                  type="button"
                  key={date.toISOString()}
                  className={`fox-datepicker-cell ${selected ? "is-selected" : ""} ${
                    inRange ? "is-in-range" : ""
                  }`}
                  onClick={() => pick(date)}
                  aria-pressed={selected}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <div className="fox-daterange-presets" data-testid={`${testId}-presets`}>
            <button type="button" onClick={() => applyPreset("7d")}>Últimos 7 dias</button>
            <button type="button" onClick={() => applyPreset("30d")}>Últimos 30 dias</button>
            <button type="button" onClick={() => applyPreset("month")}>Este mês</button>
            <button type="button" onClick={() => applyPreset("lastMonth")}>Mês passado</button>
          </div>
          <div className="fox-datepicker-footer">
            <button type="button" className="fox-datepicker-quick" onClick={() => setOpen(false)}>
              Aplicar
            </button>
            <button
              type="button"
              className="fox-datepicker-quick fox-datepicker-clear"
              onClick={clear}
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
