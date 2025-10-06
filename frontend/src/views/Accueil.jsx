export default function Accueil() {
  const count = 50;

  return (
    <div className="flex flex-col bg-base-200">
      <div className="flex w-full gap-4 p-4">
        <div className="card flex-1 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Petite Carte 1</h2>
            <p>Contenu de la première petite carte.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Clique-moi</button>
            </div>
          </div>
        </div>

        <div className="card flex-row flex-1">
          <div className="card flex-1 m-5 bg-base-100 justify-center items-center shadow-xl">
            <button className="btn btn-primary">Demande</button>
          </div>
          <div className="card flex-1 m-5 bg-base-100 justify-center items-center shadow-xl">
            <h1>Nombre de congés restants : {count} jours</h1>
          </div>
        </div>
      </div>

      <div className="card ml-3 mr-3 mt-7 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="mb-4 flex items-center justify-between">
            <label className="input input-info left-0 h-10 w-60">
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

            <p className="labelTitre absolute left-1/2 -translate-x-1/2 transform text-center">
              Les congés à valider
            </p>

            <a href="">Afficher tous</a>
          </div>

          <div className="conteneurTab border-base-content/5 max-h-60 overflow-x-auto overflow-y-auto rounded-box border bg-base-100">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>IM</th>
                  <th>Motif</th>
                  <th>Favorite Color</th>
                  <th>Validation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>Blue</td>
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
                  <td>Desktop Support Technician</td>
                  <td>Purple</td>
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
                  <td>Tax Accountant</td>
                  <td>Red</td>
                  <td>
                    <div className="flex gap-4">
                      <button className="btn btn-success btn-circle">✔</button>
                      <button className="btn btn-error btn-circle">✖</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>4</th>
                  <td>Autre Personne</td>
                  <td>Dev Web</td>
                  <td>Green</td>
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
    </div>
  );
}
