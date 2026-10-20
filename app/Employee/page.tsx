export default function Employee() {
  return (
    <div className="px-20 pt-10">
      <h1 className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Ordenes</h1>
      <p>Lista de ordenes</p>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>eventId</th>
            <th>Artist</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td>Malcolm Lockyer</td>
            <td>1961</td>
          </tr>
          <tr>
            <td>Witchy Woman</td>
            <td>The Eagles</td>
            <td>1972</td>
          </tr>
          <tr>
            <td>Shining Star</td>
            <td>Earth, Wind, and Fire</td>
            <td>1975</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}