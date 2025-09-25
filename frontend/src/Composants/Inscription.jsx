import React, { Component } from "react";

export default class Inscription extends Component {
  render() {
    return (
      <>
        <div className="blocks-center">
          <form>
            <div>
              <p className="labeConnex1 text-center">Inscription</p>
              <div className="mb-2 flex gap-10">
                <div className="flex-1">
                  <label className="block text-left font-serif text-sm ">Identifiant :</label>
                  <input type="text" placeholder="" className="inputConnexion bg-gray-50 input input-info" />
                </div>
                <div className="flex-1">
                  <label className="block text-left font-serif text-sm">Nom :</label>
                  <input type="text" placeholder="" className="inputConnexion bg-gray-50  input input-info" />
                </div>
              </div>
              <div className="mb-2 flex gap-10">
                <div className="flex-1">
                  <label className="block text-left font-serif text-sm">Prénom :</label>
                  <input type="text" placeholder="" className="inputConnexion bg-gray-50 input input-info" />
                </div>
                <div className="flex-1">
                  <label className="block text-left font-serif text-sm">Corps :</label>
                  <input type="text" placeholder="" className="inputConnexion bg-gray-50 input input-info" />
                </div>
              </div>
              <div className="mb-2 flex gap-10">
                <div className="flex-1">
                  <label className="block text-left font-serif text-sm">Grade :</label>
                  <select className="inputConnexion select select-info bg-gray-50">
                    <option value=""></option>
                    <option>L1</option>
                    <option>L2</option>
                    <option>L3</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-left font-serif text-sm">Fonction :</label>
                  <select className="inputConnexion select select-info bg-gray-50">
                    <option value=""></option>
                    <option>L1</option>
                    <option>L2</option>
                    <option>L3</option>
                  </select>
                </div>
              </div>
              <div className="mb-3 flex gap-10">
                <div className="flex-1">
                  <label className="block text-left font-serif text-sm">Division :</label>
                  <select className="inputConnexion select select-info bg-gray-50">
                    <option value=""></option>
                    <option>L1</option>
                    <option>L2</option>
                    <option>L3</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-left font-serif text-sm">E-mail :</label>
                  <input type="email" placeholder="" className="inputConnexion bg-gray-50 input input-info" />
                </div>
              </div>
              <div className="mb-1 flex gap-10">
                <div className="flex-1">
                  <label className="block text-left font-serif text-sm">Mot de passe :</label>
                  <input type="password" placeholder="" className="inputConnexion bg-gray-50 input input-info" />
                </div>
                <div className="flex-1">
                  <label className="block text-left font-serif text-sm">
                    Confirmer le mot de passe :
                  </label>
                  <input type="password" placeholder="" className="inputConnexion bg-gray-50 input input-info" />
                </div>
              </div>
              <button className="btnConnexion mx-auto block">s'inscrire</button>
              <button className="retourConnexion mx-auto mt-1 block font-serif transition duration-1000 hover:underline">
                j'ai déja un compte
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
}
