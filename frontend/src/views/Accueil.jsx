import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import { useEffect } from "react";
import { Line } from "react-chartjs-2";

import PDF from "../Composants/ViewConge.jsx";

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

export default function Accueil() {
  const count = 50;

  // Enregistre le plugin de flèches une seule fois
  useEffect(() => {
    ChartJS.register(arrowPlugin);
  }, []);

  const data = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Congés pris",
        data: [5, 8, 12, 10, 15, 20, 25, 30, 28, 35, 40, 45],
        borderColor: "rgba(37, 99, 235, 0.9)",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        fill: true, // active le remplissage
        pointRadius: 5,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#fff",
        pointHoverRadius: 7,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <h1 className="mb-4 text-2xl font-bold">Bienvenue, RAZAFINDRAINIBE</h1>
      <div className="flex w-full items-center gap-4 p-4">
        <div className="card h-60 w-2/3 bg-base-100 shadow-xl">
          <div className="card-body h-full p-2">
            <div className="h-full w-full">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>

        <div className="flex w-1/3 items-center justify-center">
          <div
            className="radial-progress flex items-center justify-center text-xl font-semibold text-primary"
            style={{
              "--value": 80,
              "--size": "8rem",
              "--thickness": "10px", // épaisseur du cercle
            }}
          >
            {count} jrs
          </div>
        </div>
      </div>

      {/* --- Bloc : Prochains congés --- */}
      <div className="card mb-6 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Les 3 derniers demandes</h2>
          <ul className="ml-5 list-disc">
            <li>
              Du 12 au 16 Octobre 2025 — <span className="text-warning">En attente</span>
            </li>
            <li>
              Du 4 au 8 Novembre 2025 — <span className="text-success">Validé</span>
            </li>
            <li>
              Du 4 au 8 Novembre 2025 — <span className="text-error">Refusé</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="card ml-3 mr-3 mt-7 bg-base-100 shadow-xl">
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
            <p className="labelTitre text-center font-semibold">Les congés à valider</p>
            <a href="" className="text-primary hover:underline">
              Afficher tous
            </a>
          </div>

          <div className="conteneurTab border-base-content/5 max-h-80 overflow-x-auto overflow-y-auto rounded-box border bg-base-100">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>IM</th>
                  <th>Nom</th>
                  <th>Motif</th>
                  <th>Durée</th>
                  <th>Aperçu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Voyage</td>
                  <td>3 jours</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => document.getElementById("my_modal_3").showModal()}
                    >
                      👁️
                    </button>

                    <dialog id="my_modal_3" className="modal">
                      <div className="modal-box relative h-[85vh] max-w-full overflow-y-auto p-0">
                        <form method="dialog">
                          <button className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">
                            ✕
                          </button>
                        </form>

                        <button
                          className="btn btn-primary btn-sm absolute left-14 top-3"
                          onClick={() => window.print()}
                        >
                          🖨️
                        </button>

                        <div className="mx-auto my-auto">
                          <div className="mx-14 mb-5 mt-14">
                            <PDF />
                          </div>
                          <div className="absolute right-0 mr-14 flex gap-3">
                            <button className="btn btn-success btn-circle">✔</button>
                            <button className="btn btn-error btn-circle">✖</button>
                          </div>
                        </div>
                      </div>
                    </dialog>
                  </td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>Hart Hagerty</td>
                  <td>Maladie</td>
                  <td>2 jours</td>
                  <td>
                    <button className="btn btn-info btn-sm">👁️</button>
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Formation</td>
                  <td>5 jours</td>
                  <td>
                    <button className="btn btn-info btn-sm">👁️</button>
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Formation</td>
                  <td>5 jours</td>
                  <td>
                    <button className="btn btn-info btn-sm">👁️</button>
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Formation</td>
                  <td>5 jours</td>
                  <td>
                    <button className="btn btn-info btn-sm">👁️</button>
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Formation</td>
                  <td>5 jours</td>
                  <td>
                    <button className="btn btn-info btn-sm">👁️</button>
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Formation</td>
                  <td>5 jours</td>
                  <td>
                    <button className="btn btn-info btn-sm">👁️</button>
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Formation</td>
                  <td>5 jours</td>
                  <td>
                    <button className="btn btn-info btn-sm">👁️</button>
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Formation</td>
                  <td>5 jours</td>
                  <td>
                    <button className="btn btn-info btn-sm">👁️</button>
                  </td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Formation</td>
                  <td>5 jours</td>
                  <td>
                    <button className="btn btn-info btn-sm">👁️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-12 mt-6 flex justify-center gap-6">
        <button className="btn btn-primary btn-outline">Faire une demande</button>
        <button className="btn btn-outline">Voir mon historique</button>
      </div>
    </div>
  );
}
