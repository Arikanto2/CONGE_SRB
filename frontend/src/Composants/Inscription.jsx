import React, { Component } from "react";

export default class Inscription extends Component {
  render() {
    return (
      <>
        <div className="blocks-center">
          <form>
            <div>
              <p className="labeConnex1 text-center ">Inscription</p>
              <div className="flex gap-10 mb-2">
                <div className="flex-1 ">
                  <label className="text-left block text-sm font-serif">
                    Identifiant :
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    className="inputConnexion bg-gray-50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-left block text-sm font-serif">
                    Nom :
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    className="inputConnexion bg-gray-50"
                  />
                </div>
              </div>
              <div className="flex gap-10 mb-2">
                <div className="flex-1">
                  <label className="text-left block text-sm font-serif">
                    Prénom :
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    className="inputConnexion bg-gray-50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-left block text-sm font-serif">
                    Corps :
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    className="inputConnexion bg-gray-50"
                  />
                </div>
              </div>
              <div className="flex gap-10 mb-2">
                <div className="flex-1">
                  <label className="text-left block text-sm font-serif">
                    Grade :
                  </label>
                  <select className="inputConnexion bg-gray-50">
                    <option value=""></option>
                    <option>L1</option>
                    <option>L2</option>
                    <option>L3</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-left block text-sm font-serif">
                    Fonction :
                  </label>
                  <select className="inputConnexion bg-gray-50">
                <option value=""></option>
                <option>L1</option>
                <option>L2</option>
                <option>L3</option>
              </select>
                </div>
              </div>
              <div className="flex gap-10 mb-3">
                <div className="flex-1">
                  <label className="text-left block text-sm font-serif">
                    Division :
                  </label>
                  <select className="inputConnexion bg-gray-50">
                <option value=""></option>
                <option>L1</option>
                <option>L2</option>
                <option>L3</option>
              </select>
                </div>
                <div className="flex-1">
                  <label className="text-left block text-sm font-serif">
                    E-mail :
                  </label>
                  <input
                    type="email"
                    placeholder=""
                    className="inputConnexion bg-gray-50"
                  />
                </div>
              </div>
              <div className="flex gap-10 mb-1">
                <div className="flex-1">
                  <label className="text-left block text-sm font-serif">
                    Mot de passe :
                  </label>
                  <input
                    type="password"
                    placeholder=""
                    className="inputConnexion bg-gray-50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-left block text-sm font-serif">
                    Confirmer le mot de passe :
                  </label>
                  <input
                    type="password"
                    placeholder=""
                    className="inputConnexion bg-gray-50"
                  />
                </div>
              </div>
              <button className="btnConnexion mx-auto block">s'inscrire</button>
              <button className=" mx-auto block mt-1 font-serif retourConnexion hover:underline transition duration-1000">
                j'ai déja un compte
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
}
