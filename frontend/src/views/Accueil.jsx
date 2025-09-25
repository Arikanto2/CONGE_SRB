export default function Accueil() {
    return (
        <div className="flex flex-col min-h-screen bg-base-200 overflow-hidden">
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

            <div className="flex-1 p-4 ">
                <div className="card h-full w-full bg-base-100 shadow-xl">
                    <div className="card-body flex flex-col">
                        <h2 className="card-title">Grande Carte</h2>
                        <p className="flex-grow">Cette carte occupe tout l’espace restant jusqu’au bas de l’écran.</p>
                        <div className="card-actions justify-end mt-auto">
                            <button className="btn btn-accent">Clique-moi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}