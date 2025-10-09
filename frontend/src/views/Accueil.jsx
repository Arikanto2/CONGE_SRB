// --- Importation des modules nécessaires de Chart.js --- //
import {
    Chart as ChartJS,         // le cœur de Chart.js
    CategoryScale,            // axe des catégories (x)
    LinearScale,              // axe linéaire (y)
    PointElement,             // points du graphique
    LineElement,              // lignes reliant les points
    Title, Tooltip, Legend,   // options d’affichage
    Filler,                   // remplissage sous la ligne
} from "chart.js";

// Composant React pour Chart.js
import { Line } from "react-chartjs-2";
import { useEffect } from "react";

// --- Enregistrement des éléments utilisés par Chart.js --- //
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// --- Plugin personnalisé : ajoute des flèches à la fin de la ligne --- //
const arrowPlugin = {
    id: "arrowPlugin",
    afterDatasetsDraw(chart) {
        const { ctx } = chart; // contexte de dessin du canvas
        chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            const points = meta.data;
            if (points.length < 2) return;

            // On récupère les deux derniers points du tracé
            const lastPoint = points[points.length - 1];
            const prevPoint = points[points.length - 2];

            // Calcule la direction de la flèche
            const xDiff = lastPoint.x - prevPoint.x;
            const yDiff = lastPoint.y - prevPoint.y;
            const angle = Math.atan2(yDiff, xDiff);
            const arrowLength = 10; // taille de la flèche

            // Dessine les deux segments de la flèche
            ctx.save();
            ctx.strokeStyle = dataset.borderColor;
            ctx.fillStyle = dataset.borderColor;
            ctx.beginPath();
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(
                lastPoint.x - arrowLength * Math.cos(angle - Math.PI / 6),
                lastPoint.y - arrowLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(
                lastPoint.x - arrowLength * Math.cos(angle + Math.PI / 6),
                lastPoint.y - arrowLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
            ctx.restore();
        });
    },
};

// --- Composant principal Accueil --- //
export default function Accueil() {
    const count = 50; // nombre de jours restants

    // Enregistre le plugin de flèches une seule fois
    useEffect(() => {
        ChartJS.register(arrowPlugin);
    }, []);

    // --- Données du graphique --- //
    const data = {
        // 12 mois de l’année
        labels: [
            "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
            "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc",
        ],
        datasets: [
            {
                label: "Congés pris",               // titre de la courbe
                data: [5, 8, 12, 10, 15, 20, 25, 30, 28, 35, 40, 45], // données
                borderColor: "rgba(37, 99, 235, 0.9)",   // couleur de la ligne
                backgroundColor: "rgba(37, 99, 235, 0.2)", // couleur sous la ligne
                fill: true,                          // active le remplissage
                pointRadius: 5,                      // taille des points
                pointBackgroundColor: "#2563eb",     // couleur des points
                pointBorderColor: "#fff",            // bordure blanche
                pointHoverRadius: 7,                 // effet hover
                tension: 0.35,                       // courbe lissée (arrondie)
            },
        ],
    };

    // --- Options d’affichage du graphique --- //
    const options = {
        responsive: true,              // s’adapte à la taille du conteneur
        maintainAspectRatio: false,    // permet d’utiliser toute la hauteur du card
        plugins: {
            legend: { display: false }, // cache la légende pour un rendu plus propre
        },
        scales: {
            y: { beginAtZero: true },   // démarre l’axe Y à 0
        },
    };

    return (
        <div className="flex flex-col bg-base-200 min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-6 pl-2">Bienvenue, RAZAFINDRAINIBE</h1>

            {/* --- Première section : graphique + compteur de jours --- */}
            <div className="flex w-full gap-6 mb-6">
                {/* --- Carte contenant le graphique (2/3 de la largeur totale) --- */}
                <div className="card bg-base-100 shadow-xl h-64 w-2/3">
                    <div className="card-body p-4 h-full">
                        {/* --- Conteneur du graphique --- */}
                        <div className="h-full w-full">
                            {/* --- Rendu du graphique Chart.js --- */}
                            <Line data={data} options={options} />
                        </div>
                    </div>
                </div>

                {/* --- Cercle d’affichage du nombre de jours restants --- */}
                <div className="flex justify-center items-center w-1/3">
                    <div
                        className="radial-progress text-primary text-xl font-semibold flex justify-center items-center"
                        style={{
                            "--value": 80,       // pourcentage de remplissage (visuel)
                            "--size": "8rem",    // taille du cercle
                            "--thickness": "10px", // épaisseur du cercle
                        }}
                    >
                        {count} jrs
                    </div>
                </div>
            </div>

            {/* --- Bloc : Prochains congés --- */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h2 className="card-title">Prochains congés</h2>
                    <ul className="list-disc ml-6 mt-2">
                        <li>Du 12 au 16 Octobre 2025 — <span className="text-warning">En attente</span></li>
                        <li>Du 4 au 8 Novembre 2025 — <span className="text-success">Validé</span></li>
                    </ul>
                </div>
            </div>

            {/* --- Tableau des congés à valider --- */}
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <div className="mb-5 flex items-center justify-between">
                        <label className="input input-info h-10 w-64">
                            <svg
                                className="h-[1em] opacity-50"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input type="search" required placeholder="Recherche..." />
                        </label>
                        <p className="labelTitre text-center font-semibold">
                            Les congés à valider
                        </p>
                        <a href="" className="text-primary hover:underline">Afficher tous</a>
                    </div>

                    <div className="conteneurTab border-base-content/5 max-h-80 overflow-x-auto overflow-y-auto rounded-box border bg-base-100">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>IM</th>
                                    <th>Motif</th>
                                    <th>Durée</th>
                                    <th>Validation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>1</th>
                                    <td>Cy Ganderton</td>
                                    <td>Voyage</td>
                                    <td>3 jours</td>
                                    <td>
                                        <div className="flex gap-4">
                                            <button className="btn btn-success btn-circle">✔</button>
                                            <button className="btn btn-error btn-circle">✖</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2</th>
                                    <td>Hart Hagerty</td>
                                    <td>Maladie</td>
                                    <td>2 jours</td>
                                    <td>
                                        <div className="flex gap-4">
                                            <button className="btn btn-success btn-circle">✔</button>
                                            <button className="btn btn-error btn-circle">✖</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>3</th>
                                    <td>Brice Swyre</td>
                                    <td>Formation</td>
                                    <td>5 jours</td>
                                    <td>
                                        <div className="flex gap-4">
                                            <button className="btn btn-success btn-circle">✔</button>
                                            <button className="btn btn-error btn-circle">✖</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- Boutons d’action --- */}
            <div className="flex justify-center gap-6 mb-8">
                <button className="btn btn-outline btn-primary">Faire une demande</button>
                <button className="btn btn-outline">Voir mon historique</button>
            </div>
        </div>
    );
}
