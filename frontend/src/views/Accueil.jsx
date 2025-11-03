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


import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useAuth } from "../hooks/useAuth";

import Swal from "sweetalert2";
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
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      const points = meta.data;
      if (points.length < 2) return;

      const lastPoint = points[points.length - 1];
      const prevPoint = points[points.length - 2];

      const xDiff = lastPoint.x - prevPoint.x;
      const yDiff = lastPoint.y - prevPoint.y;
      const angle = Math.atan2(yDiff, xDiff);
      const arrowLength = 10;

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

  const { user } = useAuth();

  console.log("Fonction de l'utilisateur :", user?.FONCTION);

  const isChefDivision = user?.FONCTION === "Chef de division";
  const isChefService = user?.FONCTION === "Chef de service";

  const [dernieresDemandes, setDernieresDemandes] = useState([]);
  const [count, setCount] = useState(0);
  const [ValidationDiv, setValidationDiv] = useState([]);
  const [ValidationChef, setValidationChef] = useState([]);
  const [CongeParMois, setCongeParMois] = useState([]);

  useEffect(() => {
    ChartJS.register(arrowPlugin);

    if (!user?.IM) return;
    if (!user?.FONCTION) return;

    const params = new URLSearchParams({
      im: user.IM,
      division: user.DIVISION,
    });

    fetch(`http://127.0.0.1:8000/api/Accueil?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.dernieres_demandes) setDernieresDemandes(data.dernieres_demandes);
        if (data.nbr_Conge) setCount(data.nbr_Conge);
        if (data.validation_div) setValidationDiv(data.validation_div);
        if (data.validation_chef) setValidationChef(data.validation_chef);
        if (data.conges_par_mois) setCongeParMois(data.conges_par_mois);
      })
      .catch((error) => console.error("Erreur:", error));
  }, [user]);

  const Validation = isChefDivision ? ValidationDiv : isChefService ? ValidationChef : [];

  const congesMensuels = Array(12).fill(0);

  CongeParMois.forEach((item) => {
    const moisIndex = item.mois - 1; // janvier = 0
    congesMensuels[moisIndex] = Number(item.total_conges);
  });

  const moisLabels = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];


  const data = {
    labels: moisLabels,
    datasets: [
      {
        label: "Total des congés validés (tous services)",
        data: congesMensuels,
        borderColor: "rgba(37, 99, 235, 0.9)",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        fill: true,
        pointRadius: 5,
        tension: 0.35,
      },
    ],
  };

  const teste = () => {
    Swal.fire({
      icon: "success",
      title: "Message clique !",
      text: "Merci pour votre message, je vous répondrai bientôt.",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
        suggestedMax: Math.ceil(Math.max(...data.datasets[0].data) / 5) * 5,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-base-200">

      <h1 className="mb-4 text-2xl font-bold">Bienvenue, {user?.NOM} </h1>

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
              "--thickness": "10px",
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
            {dernieresDemandes.length > 0 ? (
              dernieresDemandes.map((demande, index) => (
                <li key={index}>
                  Du {new Date(demande.DATEDEBUT).toLocaleDateString()} au{" "}

                  {new Date(demande.DATEFIN).toLocaleDateString()} —{" "}
                  <span
                    className={`${
                      demande.VALIDCHEF === "En attente"
                        ? "text-warning"
                        : demande.VALIDCHEF === "Validé"
                          ? "text-success"
                          : "text-error"
                    }`}

                  >
                    {demande.VALIDCHEF}
                  </span>
                </li>
              ))
            ) : (
              <li>Aucune demande</li>
            )}
          </ul>
        </div>
      </div>

      {(isChefDivision || isChefService) && (
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
              <a onClick={teste} href="" className="text-primary hover:underline">
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
                  {Validation.length > 0 ? (
                    Validation.map((item, index) => (
                      <tr key={index}>
                        <th>{item.IM}</th>
                        <td>{item.NOM}</td>
                        <td>{item.MOTIF}</td>
                        <td>{item.duree} jours</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => document.getElementById(`modal_${index}`).showModal()}
                          >
                            👁️
                          </button>

                          <dialog id={`modal_${index}`} className="modal">
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-gray-500">
                        Aucune demande à valider
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div className="mb-12 mt-6 flex justify-center gap-6">
        <button className="btn btn-primary btn-outline">Faire une demande</button>
        <button className="btn btn-outline">Voir mon historique</button>
      </div>
    </div>
  );
}
