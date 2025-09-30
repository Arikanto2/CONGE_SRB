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

            <div className="flex-1 flex flex-col items-center justify-start p-4">
                <div className="card w-full h-full bg-base-100 shadow-xl">
                    <div className="overflow-x-auto">
                        <div className="max-h-80 overflow-y-auto">
                            <table className="table">
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
                                    <th>5</th>
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
        </div>
    );
}
