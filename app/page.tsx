"use client"

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      const response = await fetch("http://localhost:3001/api/products");
      const data = await response.json();
      setProducts(data);
    }

    getProducts()
  })




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
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#mobile</span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#sales</span>
            </div>
          </div>
        ))
        }
      </div>
    </div>
  );
}
