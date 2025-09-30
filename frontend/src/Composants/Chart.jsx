import React, { useMemo } from 'react';

// Composant GanttChart.jsx
// Utilisation :
// import GanttChart from './GanttChart';
// <GanttChart tasks={tasks} dayWidth={28} />

// Structure d'une tâche :
// { id, name, start: 'YYYY-MM-DD', end: 'YYYY-MM-DD', status: 'conge'|'mission'|'formation' }

function parseDate(s) {
    // Convertit une string 'YYYY-MM-DD' en objet Date (sans heures)
    if (!s) return null;
    if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate());
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d); // mois commence à 0 en JS
}

function daysBetween(a, b) {
    // Calcule le nombre de jours entiers entre 2 dates
    const ms = 24 * 60 * 60 * 1000; // millisecondes dans un jour
    return Math.round((b - a) / ms);
}

function addDays(d, n) {
    // Ajoute n jours à une date et retourne une nouvelle date
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
}

// Couleurs par défaut selon le statut de la tâche
const DEFAULT_COLORS = {
    conge: 'bg-blue-600',
    mission: 'bg-green-600',
    formation: 'bg-yellow-500',
    default: 'bg-slate-600'
};

export default function GanttChart({ tasks = [], dayWidth = 28 }) {
    // Normalisation des tâches : calcul des durées, index interne, dates formatées
    const normalized = useMemo(() => {
        return tasks.map((t, i) => {
            const start = parseDate(t.start);
            const end = parseDate(t.end);
            const duration = daysBetween(start, end) + 1; // +1 car inclusif
            return { ...t, _start: start, _end: end, _duration: duration, _idx: i };
        });
    }, [tasks]);

    // Calcul de la plage temporelle du diagramme (min et max date)
    const [minDate, maxDate] = useMemo(() => {
        if (!normalized.length) {
            // si aucune tâche, on prend aujourd'hui + 30 jours
            const today = new Date();
            return [today, addDays(today, 30)];
        }
        // trouver la date la plus petite et la plus grande
        const min = normalized.reduce((acc, t) => (t._start < acc ? t._start : acc), normalized[0]._start);
        const max = normalized.reduce((acc, t) => (t._end > acc ? t._end : acc), normalized[0]._end);
        // rajouter un peu de marge de chaque côté
        return [addDays(min, -3), addDays(max, 3)];
    }, [normalized]);

    // Nombre total de jours affichés
    const totalDays = useMemo(() => daysBetween(minDate, maxDate) + 1, [minDate, maxDate]);

    // Fonction pour convertir une date en position horizontale (x en pixels)
    const dateToX = (d) => daysBetween(minDate, d) * dayWidth;

    // Construction des entêtes (jours + mois regroupés)
    const headers = useMemo(() => {
        const days = [];
        for (let i = 0; i < totalDays; i++) {
            const dt = addDays(minDate, i);
            days.push({ date: dt, label: dt.getDate() }); // label = numéro du jour
        }

        // Regrouper par mois pour dessiner la ligne des mois
        const months = [];
        let cur = null;
        days.forEach((d, idx) => {
            const key = d.date.getFullYear() + '-' + (d.date.getMonth() + 1);
            if (!cur || cur.key !== key) {
                // nouveau mois
                cur = { key, month: d.date.toLocaleString(undefined, { month: 'short' }), startIdx: idx, span: 1 };
                months.push(cur);
            } else cur.span++; // même mois → augmenter sa largeur
        });
        return { days, months };
    }, [minDate, totalDays, dayWidth]);

    // Hauteur d'une tâche
    const TASK_HEIGHT = 48; // 12 * 4px = 48px (taille h-12)

// Nombre maximum de tâches visibles sans scroll
    const MAX_VISIBLE_TASKS = 7;

    return (
        <div className="w-full border rounded-md overflow-hidden bg-white shadow-sm">
            {/* Header avec légende */}
            <div className="flex items-center justify-between p-3 border-b">
                <h3 className="text-lg font-semibold">Planning (Gantt)</h3>
                <div className="flex items-center gap-3">
                    <Legend />
                </div>
            </div>

            <div className="flex">
                {/* Colonne gauche : noms des tâches */}
                <div className="w-64 min-w-[16rem] border-r">
                    <div className="h-16 flex items-center px-3 border-b">
                        <span className="text-sm text-slate-600">Noms / Tâches</span>
                    </div>
                    <div
                        className="overflow-y-auto"
                        style={{ maxHeight: TASK_HEIGHT * MAX_VISIBLE_TASKS }} // limite à 7 tâches visibles
                    >
                        {normalized.map((t) => (
                            <div
                                key={t.id ?? t._idx}
                                className="h-12 flex items-center px-3 border-b text-sm text-slate-700 truncate"
                                title={`${t.name} — ${t.start} → ${t.end}`}
                            >
                                {t.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Partie droite : calendrier + barres */}
                <div className="flex-1 overflow-auto">
                    <div style={{ width: totalDays * dayWidth }} className="min-w-[400px]">
                        {/* Ligne des mois */}
                        <div className="h-8 border-b flex">
                            {headers.months.map((m) => (
                                <div
                                    key={m.key}
                                    style={{ width: m.span * dayWidth }}
                                    className="flex items-center justify-center text-sm font-medium border-r"
                                >
                                    {m.month}
                                </div>
                            ))}
                        </div>

                        {/* Ligne des jours */}
                        <div className="h-8 border-b flex">
                            {headers.days.map((d, idx) => (
                                <div
                                    key={idx}
                                    style={{ width: dayWidth }}
                                    className="h-full flex items-center justify-center text-xs text-slate-500 border-r"
                                >
                                    {d.label}
                                </div>
                            ))}
                        </div>

                        {/* Grille + barres */}
                        <div
                            className="overflow-y-auto"
                            style={{ maxHeight: TASK_HEIGHT * MAX_VISIBLE_TASKS }}
                        >
                            {normalized.map((t) => (
                                <div key={t.id ?? t._idx} className="h-12 border-b relative">
                                    {/* grille verticale des jours */}
                                    <div className="absolute inset-0 flex">
                                        {headers.days.map((d, idx) => (
                                            <div
                                                key={idx}
                                                style={{ width: dayWidth }}
                                                className={`h-full border-r ${idx % 7 === 0 ? 'bg-slate-50' : ''}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Barre représentant la tâche */}
                                    <div
                                        className="absolute top-2 left-0 h-8"
                                        style={{ transform: `translateX(${dateToX(t._start)}px)` }}
                                    >
                                        <div
                                            className={`h-8 rounded-md flex items-center px-2 text-white text-sm ${
                                                DEFAULT_COLORS[t.status] || DEFAULT_COLORS.default
                                            }`}
                                            style={{ width: Math.max(8, t._duration * dayWidth - 6) }}
                                            title={`${t.name}: ${t.start} → ${t.end} (${t._duration} j)`} // tooltip
                                        >
                    <span
                        className="truncate"
                        style={{ maxWidth: Math.max(40, t._duration * dayWidth - 40) }}
                    >
                      {t.name}
                    </span>
                                        </div>
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

// Composant légende en haut à droite
function Legend() {
    return (
        <div className="flex items-center gap-3">
            <LegendItem colorClass={DEFAULT_COLORS.conge} label="Congé" />
            <LegendItem colorClass={DEFAULT_COLORS.mission} label="Mission" />
            <LegendItem colorClass={DEFAULT_COLORS.formation} label="Formation" />
        </div>
    );
}

// Élément individuel de la légende
function LegendItem({ colorClass, label }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className={`w-4 h-4 rounded ${colorClass}`} />
            <span className="text-slate-600">{label}</span>
        </div>
    );
}

