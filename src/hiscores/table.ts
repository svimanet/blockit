import { getHiscoresFromLocalStorage } from './localstorage.utils.ts';

export const renderHiscoresTable = () => {
  // Append new div on Document to contain hiscores
  const gameContainer = document.getElementById('game-container') as HTMLDivElement;
  const hiscoresHtmlContainer = document.createElement('div', { });
  hiscoresHtmlContainer.id = 'hiscores-container';
  gameContainer.appendChild(hiscoresHtmlContainer);

  const hiscores = getHiscoresFromLocalStorage();

  // Append new table to container
  const table = document.createElement('table');
  hiscoresHtmlContainer.appendChild(table);

  const tableHeaderRow = document.createElement('tr');
  table.appendChild(tableHeaderRow)

  const thDate = document.createElement('th');
  thDate.innerText = 'Date';
  tableHeaderRow.appendChild(thDate);

  const thScore = document.createElement('th');
  thScore.innerText = 'Score';
  tableHeaderRow.appendChild(thScore);
  thScore.addEventListener('click', sortByScoreDescending);
  thScore.role = 'button';

  // For each row in Hiscores local storage list,
  // create a html-table-row, with two table-cells, and append to table.
  hiscores.forEach((row) => {
    const tableRow = document.createElement('tr');
    table.appendChild(tableRow);

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

const sortByScoreDescending = () => {
  const scores = getHiscoresFromLocalStorage();
  const table = document.getElementsByTagName('table')[0];
  const tableRows = Array.from(document.getElementsByTagName('tr'));

  // Remove table header from elements-to-be-remove, and remove the current onclick
  const tableHeader = tableRows.shift();
  tableHeader?.removeEventListener('click', () => '');

  // Remove existing table data rows
  tableRows.forEach((row) => row.remove());

  // sort hiscores by score, descending only for now. I Don't think ascending is interesting.
  scores.sort((a: Hiscore, b: Hiscore) => (b.score < a.score ? -1 : b.score > a.score ? 1 : 0));

  // Re-populate table rows from sorted data
  scores.forEach((row) => {
    const tableRow = document.createElement('tr');
    table.appendChild(tableRow);

    const tdDate = document.createElement('td');
    tdDate.innerText = `${new Date(row.date).toLocaleDateString()}`;
    tableRow.appendChild(tdDate)

    const tdScore = document.createElement('td');
    tdScore.innerText = `${row.score}`;
    tableRow.appendChild(tdScore);
  });
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
