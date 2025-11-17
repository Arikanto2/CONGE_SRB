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
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PDF from "../Composants/ViewConge.jsx";
import { useAuth } from "../hooks/useAuth";

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
  const navigate = useNavigate();
  const { user } = useAuth();

  const isChefDivision = user?.FONCTION === "Chef de division";
  const isChefService = user?.FONCTION === "Chef de service";

  const [dernieresDemandes, setDernieresDemandes] = useState([]);
  const [count, setCount] = useState(0);
  const [ValidationDiv, setValidationDiv] = useState([]);
  const [ValidationChef, setValidationChef] = useState([]);
  const [CongeParMois, setCongeParMois] = useState([]);
  const [joursADebiter, setJoursADebiter] = useState({});

  useEffect(() => {
    ChartJS.register(arrowPlugin);

    if (!user?.IM || !user?.FONCTION) return;

    const params = new URLSearchParams({
      user_im: user.IM,
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
        if (data.joursADebiter) setJoursADebiter(data.joursADebiter);
      })
      .catch((error) => console.error("Erreur:", error));
  }, [user]);

  const Validation = isChefDivision ? ValidationDiv : isChefService ? ValidationChef : [];

  const congesMensuels = Array(12).fill(0);

  CongeParMois.forEach((item) => {
    const moisIndex = item.mois - 1;
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 },
        suggestedMax: Math.ceil(Math.max(...data.datasets[0].data) / 5) * 5,
      },
    },
  };

  const handleViewConge = (item, index) => {
    const params = new URLSearchParams({
      item_im: item.IM,
      item_ref: item.Ref,
    });

    fetch(`http://127.0.0.1:8000/api/Accueil?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.joursADebiter) setJoursADebiter(data.joursADebiter);
        document.getElementById(`modal_${index}`).showModal();
      })
      .catch((error) => console.error("Erreur:", error));
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

      <div className="card mb-6 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Les 3 dernières demandes</h2>
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
        <div className="card mx-3 mt-7 bg-base-100 shadow-xl">
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
                        <td>
                          {item.NOM} {item.PRENOM}
                        </td>
                        <td>{item.MOTIF}</td>
                        <td>{item.duree} jours</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleViewConge(item, index)}
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

                              <div className="mx-auto my-auto">
                                <div className="mx-14 mb-5 mt-14">
                                  <PDF
                                    IM={item.IM}
                                    NOM={item.NOM}
                                    PRENOM={item.PRENOM}
                                    DATEDEBUT={item.DATEDEBUT}
                                    DATEFIN={item.DATEFIN}
                                    motif={item.MOTIF}
                                    lieu={item.LIEU}
                                    ref={item.Ref}
                                    joursADebiter={joursADebiter || []}
                                    decision="accueil"
                                    date={new Date().toLocaleDateString("fr-FR")}
                                  />
                                </div>

                                <div className="absolute right-0 mr-14 flex gap-3">
                                  <button
                                    className="btn btn-success btn-circle"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      const modal = document.getElementById(`modal_${index}`);
                                      modal.close();

                                      const { isConfirmed } = await Swal.fire({
                                        title: "Voulez-vous valider cette demande ?",
                                        icon: "question",
                                        showCancelButton: true,
                                        confirmButtonText: "Oui",
                                        cancelButtonText: "Non",
                                        confirmButtonColor: "#22c55e",
                                        cancelButtonColor: "#ef4444",
                                        background: "#f9fafb",
                                      });

                                      if (isConfirmed) {
                                        try {
                                          const response = await fetch(
                                            `http://127.0.0.1:8000/api/Accueil/${item.id}?fonction=${user.FONCTION}&IM=${item.IM}&action=valider`,
                                            {
                                              method: "PUT",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify({ joursADebiter }),
                                            }
                                          );

                                          const result = await response.json();

                                          if (response.ok) {
                                            toast.success(result.message || "Demande validée !");
                                            setValidationDiv((prev) =>
                                              prev.filter((d) => d.id !== item.id)
                                            );
                                            setValidationChef((prev) =>
                                              prev.filter((d) => d.id !== item.id)
                                            );
                                          } else {
                                            toast.error(
                                              result.message || "Erreur lors de la validation"
                                            );
                                          }
                                        } catch (error) {
                                          console.error("Erreur:", error);
                                          toast.error("Erreur de connexion au serveur");
                                        }
                                      } else {
                                        modal.showModal();
                                      }
                                    }}
                                  >
                                    ✔
                                  </button>

                                  <button
                                    className="btn btn-error btn-circle"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      const modal = document.getElementById(`modal_${index}`);
                                      modal.close();

                                      const { isConfirmed } = await Swal.fire({
                                        title: "Voulez-vous vraiment refuser cette demande ?",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: "Oui",
                                        cancelButtonText: "Non",
                                        confirmButtonColor: "#ef4444",
                                        cancelButtonColor: "#22c55e",
                                        background: "#f9fafb",
                                      });

                                      if (isConfirmed) {
                                        try {
                                          const response = await fetch(
                                            `http://127.0.0.1:8000/api/Accueil/${item.id}?fonction=${user.FONCTION}&action=rejeter`,
                                            {
                                              method: "PUT",
                                              headers: { "Content-Type": "application/json" },
                                            }
                                          );

                                          const data = await response.json();

                                          if (response.ok) {
                                            toast.success(data.message || "Demande refusée !");
                                            setValidationDiv((prev) =>
                                              prev.filter((d) => d.id !== item.id)
                                            );
                                            setValidationChef((prev) =>
                                              prev.filter((d) => d.id !== item.id)
                                            );
                                          } else {
                                            toast.error(data.message || "Une erreur est survenue.");
                                          }
                                        } catch (error) {
                                          console.error("Erreur:", error);
                                          toast.error("Erreur de connexion au serveur.");
                                        }
                                      } else {
                                        modal.showModal();
                                      }
                                    }}
                                  >
                                    ✖
                                  </button>
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
        <button
          className="btn btn-primary btn-outline"
          onClick={() => navigate("/demande?openModal=true")}
        >
          Faire une demande
        </button>
        <button className="btn btn-outline" onClick={() => navigate("/Statistique")}>
          Vue globale des congés
        </button>
      </div>
    </div>
  );
}
