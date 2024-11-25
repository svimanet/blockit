import type { Hiscore } from "../types";

export const renderHiscoresTable = () => {
  // Append new div on Document to contain hiscores
  const gameContainer = document.getElementById('game-container') as HTMLDivElement;
  const hiscoresHtmlContainer = document.createElement('div', { });
  hiscoresHtmlContainer.id = 'hiscores-container';
  gameContainer.appendChild(hiscoresHtmlContainer);

  // Get hiscores from local storage, assume it to exist
  const hiscoresStorage = window.localStorage.getItem('hiscores');
  const hiscores = JSON.parse(hiscoresStorage as string) as unknown as Array<Hiscore>;
  hiscores.sort((a: Hiscore, b: Hiscore) => (b.date < a.date ? -1 : b.date > a.date ? 1 : 0));

  // Append new table to container
  const tableBody = document.createElement('table');
  hiscoresHtmlContainer.appendChild(tableBody);

  const tableHeaderRow = document.createElement('tr');
  tableBody.appendChild(tableHeaderRow)

  const thDate = document.createElement('th');
  thDate.innerText = 'Date';
  tableHeaderRow.appendChild(thDate);

  const thScore = document.createElement('th');
  thScore.innerText = 'Score';
  tableHeaderRow.appendChild(thScore);

  // For each row in Hiscores local storage list, 
  hiscores.forEach((row) => {
    console.log('row', row);
    const tableRow = document.createElement('tr');
    tableBody.appendChild(tableRow);

    const tdDate = document.createElement('td');
    tdDate.innerText = `${new Date(row.date).toLocaleDateString()}`;
    tableRow.appendChild(tdDate)

    const tdScore = document.createElement('td');
    tdScore.innerText = `${row.score}`;
    tableRow.appendChild(tdScore);
  });

  const hiscoresBtn = document.getElementById('hiscores-btn') as HTMLButtonElement;
  hiscoresBtn.removeEventListener('click', openHiscoresEvent);
  hiscoresBtn.addEventListener('click', closeHiscoresEvent);
}

const openHiscoresEvent = () => {
  renderHiscoresTable();
}

const closeHiscoresEvent = () => {
  removeHiscoresTable();
}

export const removeHiscoresTable = () => {
  const hiscoresHtmlContainer = document.getElementById('hiscores-container') as HTMLDivElement;
  hiscoresHtmlContainer.remove();
  const hiscoresBtn = document.getElementById('hiscores-btn') as HTMLButtonElement;
  hiscoresBtn.removeEventListener('click', closeHiscoresEvent);
  hiscoresBtn.addEventListener('click', openHiscoresEvent);
}

export const hiscoresStorageSetup = () => {

  const hiscoresBtn = document.getElementById('hiscores-btn') as HTMLButtonElement;
  hiscoresBtn.addEventListener('click', openHiscoresEvent);

  // get or set the initial hiscores table in local storage
  let hiscoresStorage = window.localStorage.getItem('hiscores');
  if (!hiscoresStorage) {
    const emptyHiscores = new Array<Hiscore>();
    window.localStorage.setItem('hiscores', JSON.stringify(emptyHiscores));
  }
}