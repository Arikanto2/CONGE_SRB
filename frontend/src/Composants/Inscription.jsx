import React, { Component } from "react";

export default class Inscription extends Component {
  render() {
    return (
      <>
        <div className="flex-1">
          <form>
            <div>
              <h5> Inscription!</h5>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-left block mb-1">Identifiant:</label>
                  <input
                    type="text"
                    placeholder=""
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-left block mb-1">Nom:</label>
                  <input
                    type="text"
                    placeholder=""
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-left block mb-1">Prénom:</label>
                  <input
                    type="text"
                    placeholder=""
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-left block mb-1">Corps:</label>
                  <input
                    type="text"
                    placeholder=""
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-left block mb-1">Grade:</label>
                  <input
                    type="text"
                    placeholder=""
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-left block mb-1">fonction:</label>
                  <input
                    type="text"
                    placeholder=""
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-left block mb-1">Division:</label>
                  <input
                    type="text"
                    placeholder=""
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-left block mb-1">E-mail:</label>
                  <input
                    type="text"
                    placeholder=""
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-left block mb-1">Mot de passe:</label>
                  <input
                    type="text"
                    placeholder=""
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-left block mb-1">
                    Confirmer le mot de passe:
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button>s'inscrir</button>
            </div>
          </form>
        </div>
      </>
    );
  }
}
