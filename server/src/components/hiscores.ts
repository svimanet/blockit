export interface Hiscore {
  id: string | number;
  name: string;
  score: string | number;
  datetime: string;
}

export const HiscoresModal = (hiscores: Hiscore[]) => {

  const tableRows = hiscores.map((row) => {
    return (`
      <tr>
          <td>${row.id}</td>
          <td>${row.name}</td>
          <td>${row.score}</td>
          <td>${row.datetime}</td>
      </tr>
    `);
  });

  // Assumes the existing of section
  // <section id="hiscores-section">

  const table = `
    <modal id="hiscores-modal-overlay">
      <modal id="hiscores-modal">
        <button hx-get="none" hx-swap="innerHTML" hx-target="#hiscores-section">Close</button>
        <table>
          ${ tableRows.join("") }
        </table>
      </modal> 
    </modal>
  `;

  return table;
}