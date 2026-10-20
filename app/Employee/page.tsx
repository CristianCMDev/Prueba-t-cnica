"use client"

import { useEffect, useState } from "react";

export default function Employee() {
  const [orders, setOrders] = useState([])


  useEffect(() => {
    async function getProducts() {
      const response = await fetch("http://localhost:3001/api/orders");
      const data = await response.json();
      setOrders(data);
      console.log(data)
    }

    getProducts()
  })


  return (
    <div className="flex flex-1 px-20 pt-10 bg-gray-200 min-h-screen justify-center">
      <div className="">
        <h1 className="text-2xl font-semibold dark:text-white">Órdenes</h1>
        <p className="pb-10">Lista de órdenes</p>

        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre del cliente</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Fecha de creación</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.nameClient}</td>
                <td className="px-4 py-2">{order.sku}</td>
                <td className="px-4 py-2">{order.amount}</td>
                <td className="px-4 py-2">{order.state}</td>
                <td className="px-4 py-2">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}