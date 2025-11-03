import { RefreshCcw } from "lucide-react";
import React, { useMemo, useState } from "react";

function parseDate(s) {
  if (!s) return null;
  if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate());
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysBetween(a, b) {
  const ms = 24 * 60 * 60 * 1000;
  return Math.round((b - a) / ms);
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

const DEFAULT_COLORS = {
  conge: "bg-blue-600",
  mission: "bg-green-600",
  formation: "bg-yellow-500",
  default: "bg-slate-600",
};

export default function GanttChart({ tasks = [], dayWidth = 28 }) {
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [maxVisibleTasks, setMaxVisibleTasks] = useState(12); //nombre de tâches

  const normalized = useMemo(() => {
    return tasks.map((t, i) => {
      const start = parseDate(t.start);
      const end = parseDate(t.end);
      const duration = daysBetween(start, end) + 1;
      return { ...t, _start: start, _end: end, _duration: duration, _idx: i };
    });
  }, [tasks]);

  const [minDate, maxDate] = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return [start, end];
  }, []);

  const [filteredMin, filteredMax] = useMemo(() => {
    const start = filterStart ? parseDate(filterStart) : minDate;
    const end = filterEnd ? parseDate(filterEnd) : maxDate;
    return [start, end];
  }, [filterStart, filterEnd, minDate, maxDate]);

  const visibleTasks = useMemo(() => {
    return normalized.filter((t) => t._end >= filteredMin && t._start <= filteredMax);
  }, [normalized, filteredMin, filteredMax]);

  const totalDays = useMemo(
    () => daysBetween(filteredMin, filteredMax) + 1,
    [filteredMin, filteredMax]
  );
  const dateToX = (d) => daysBetween(filteredMin, d) * dayWidth;

  const headers = useMemo(() => {
    const days = [];
    for (let i = 0; i < totalDays; i++) {
      const dt = addDays(filteredMin, i);
      days.push({ date: dt, label: dt.getDate() });
    }

    const months = [];
    let cur = null;
    days.forEach((d, idx) => {
      const key = d.date.getFullYear() + "-" + (d.date.getMonth() + 1);
      if (!cur || cur.key !== key) {
        cur = {
          key,
          month: d.date.toLocaleString(undefined, { month: "short" }),
          startIdx: idx,
          span: 1,
        };
        months.push(cur);
      } else cur.span++;
    });
    return { days, months };
  }, [filteredMin, totalDays]);

  const TASK_HEIGHT = 32;
  const BAR_HEIGHT = 20;

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop > 0 && maxVisibleTasks === 8) {
      setMaxVisibleTasks(12);
    }
  };
  const [spinning, setSpinning] = useState(false);

  return (
    <div className="w-full overflow-hidden rounded-md border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSpinning(true);
              setFilterStart("");
              setFilterEnd("");
              setTimeout(() => setSpinning(false), 500);
            }}
            className="rounded-md bg-blue-600 p-2 text-white transition hover:bg-blue-700"
            title="Actualiser"
          >
            <RefreshCcw size={18} className={spinning ? "animate-spin" : ""} />
          </button>

          <label className="text-sm text-slate-600">Du :</label>
          <input
            type="date"
            className="rounded border px-2 py-1 text-sm"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
          />
          <label className="text-sm text-slate-600">Au :</label>
          <input
            type="date"
            className="rounded border px-2 py-1 text-sm"
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
          />
        </div>
        <Legend />
      </div>

      <div
        className="flex overflow-auto"
        style={{ maxHeight: TASK_HEIGHT * maxVisibleTasks + 80 }}
        onScroll={handleScroll}
      >
        <div className="w-64 min-w-[16rem] border-r py-4">
          <div className="sticky top-0 z-10 flex h-12 items-center border-b bg-slate-50 px-3">
            <span className="text-sm text-slate-600">Noms / Tâches</span>
          </div>
          <div>
            {visibleTasks.map((t) => (
              <div
                key={t.id ?? t._idx}
                className="flex h-8 items-center truncate border-b bg-white px-3 text-sm text-slate-700"
                title={`${t.name} — ${t.start} → ${t.end}`}
              >
                {t.name}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white">
          <div style={{ width: totalDays * dayWidth }} className="min-w-[400px]">
            {/* Mois */}
            <div className="sticky top-0 z-10 flex h-8 border-b bg-slate-50">
              {headers.months.map((m) => (
                <div
                  key={m.key}
                  style={{ width: m.span * dayWidth }}
                  className="flex items-center justify-center border-r text-sm font-medium"
                >
                  {m.month}
                </div>
              ))}
            </div>

            {/* Jours */}
            <div className="sticky top-8 z-10 flex h-8 border-b bg-slate-50">
              {headers.days.map((d, idx) => (
                <div
                  key={idx}
                  style={{ width: dayWidth }}
                  className="flex h-full items-center justify-center border-r text-xs text-slate-500"
                >
                  {d.label}
                </div>
              ))}
            </div>

            {/* Grille + barres */}
            <div>
              {visibleTasks.map((t) => (
                <div key={t.id ?? t._idx} className="relative h-8 border-b">
                  <div className="absolute inset-0 flex">
                    {headers.days.map((_, idx) => (
                      <div
                        key={idx}
                        style={{ width: dayWidth }}
                        className={`h-full border-r ${idx % 7 === 0 ? "bg-slate-50" : ""}`}
                      />
                    ))}
                  </div>
                  <div
                    className="absolute left-0 top-1"
                    style={{ transform: `translateX(${dateToX(t._start)}px)` }}
                  >
                    <div
                      className={`rounded-md ${DEFAULT_COLORS[t.status] || DEFAULT_COLORS.default}`}
                      style={{
                        width: Math.max(8, t._duration * dayWidth - 6),
                        height: BAR_HEIGHT,
                      }}
                      title={`${t.name}: ${t.start} → ${t.end}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Légende ---
function Legend() {
  return (
    <div className="flex items-center gap-3">
      <LegendItem colorClass={DEFAULT_COLORS.conge} label="Congé" />
      <LegendItem colorClass={DEFAULT_COLORS.mission} label="Mission" />
      <LegendItem colorClass={DEFAULT_COLORS.formation} label="Formation" />
    </div>
  );
}

function LegendItem({ colorClass, label }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`h-4 w-4 rounded ${colorClass}`} />
      <span className="text-slate-600">{label}</span>
    </div>
  );
}
