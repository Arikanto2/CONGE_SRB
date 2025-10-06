export default function Accueil() {
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
        <div className="card flex-1 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Petite Carte 2</h2>
            <p>Contenu de la deuxième petite carte.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-secondary">Clique-moi</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card ml-3 mr-3 mt-5 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="conteneurTab border-base-content/5 max-h-60 overflow-x-auto overflow-y-auto rounded-box border bg-base-100">
            <table className="table table-zebra">
              {/* head */}
              <thead>
                <tr>
                  <th>IM</th>
                  <th>Motif</th>
                  <th>Favorite Color</th>
                  <th>Validation</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>
                    <div className="flex gap-4">
                      <button className="btn btn-success btn-circle">✔</button>
                      <button className="btn btn-error btn-circle">✖</button>
                    </div>
                  </td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>
                    <div className="flex gap-4">
                      <button className="btn btn-success btn-circle">✔</button>
                      <button className="btn btn-error btn-circle">✖</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>
                    <div className="flex gap-4">
                      <button className="btn btn-success btn-circle">✔</button>
                      <button className="btn btn-error btn-circle">✖</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>
                    <div className="flex gap-4">
                      <button className="btn btn-success btn-circle">✔</button>
                      <button className="btn btn-error btn-circle">✖</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>
                    <div className="flex gap-4">
                      <button className="btn btn-success btn-circle">✔</button>
                      <button className="btn btn-error btn-circle">✖</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
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
