"use client"

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("")
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    async function getProducts() {
      const response = await fetch("http://localhost:3001/api/products");
      const data = await response.json();
      setProducts(data);
    }

    getProducts()
  })


  const buy = async (selected, amount) => {
    console.log(JSON.stringify(selected) + " " + amount)

    try {
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameClient: "Cristian Miranda",
          sku: selected.sku,
          amount: amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear el pedido");
      }

      alert("Pedido creado correctamente")
      console.log("Pedido creado:", data);
    } catch (error) {
      console.log( error);
      alert(error)
    }
  }


  return (
    <div className="flex flex-1 bg-gray-200 justify-center p-10">
      <div className="grid grid-cols-4 gap-x-8 gap-y-8 2-300">
        {products.map((product, index) => (
          <div key={index} className="max-w-sm bg-gray-100 rounded overflow-hidden shadow-lg">
            <img className="w-100 h-60" src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" alt="celular" />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{product.name}</div>
              <p className="text-gray-700 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
              </p>
            </div>
            <div className="px-6 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#mobile</span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#sales</span>
            </div>
            <div className="flex flex-1 justify-end pr-8 pb-4">
              <button
                onClick={() => { setIsOpen(true), setSelected(product) }}
                className="rounded-lg bg-gray-700 cursor-pointer px-4 py-2 text-white hover:bg-gray-600"
              >
                Comprar
              </button>
            </div>

          </div>
        ))
        }
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              {selected.name}
            </h2>

            <p className="mb-6 text-gray-600">
              Selecciona la cantidad de productos {selected.name} que quieras comprar
            </p>

            <div className="max-w-sm mx-auto mb-6">
              <label className="block mb-2.5 text-sm font-medium text-heading">
                Select un número:
              </label>

              <input
                type="number"
                id="number-input"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
                className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg cursor-pointer bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              >
                Cerrar
              </button>

              <button
                onClick={() => { setIsOpen(false), buy(selected, amount), setAmount(1) }}
                className="rounded-lg cursor-pointer bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
