import type { Hiscore } from './hiscores.types';
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
  thScore.innerText = 'Score-';
  thScore.id = 'thscore'
  tableHeaderRow.appendChild(thScore);
  thScore.addEventListener('click', () => sortByScore());
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

const sortByScore = () => {
  const scores = getHiscoresFromLocalStorage();
  const table = document.getElementsByTagName('table')[0];
  const tableRows = Array.from(document.getElementsByTagName('tr'));
  tableRows.shift();
  tableRows.forEach((row) => row.remove());

  const up = '↑';
  const dn = '↓';
  let asc = false;

  const thScore = document.getElementById('thscore');
  if (thScore) {
    asc = !thScore.innerText.includes(dn);
    if (asc) {
      thScore.innerText = 'Score'+dn;
    } else {
      thScore.innerText = 'Score'+up;
    }
  }

  if (asc) {
    scores.sort(
      (a: Hiscore, b: Hiscore) =>
        (a.score < b.score ? -1 : a.score > b.score ? 1 : 0)
    );
  } else {
    scores.sort(
      (a: Hiscore, b: Hiscore) =>
        (b.score < a.score ? -1 : b.score > a.score ? 1 : 0)
    );
  }

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
  const body = document.body;
  setTimeout(() => {
    body.addEventListener('click', bodyListenerCloseHiscores);
  }, 0);
}

const closeHiscoresEvent = () => {
  const body = document.body;
  body.removeEventListener('click', bodyListenerCloseHiscores);
  removeHiscoresTable();
}

const bodyListenerCloseHiscores = (e: MouseEvent) => {
  const modal = document.getElementById('hiscores-container');
  if (modal && modal.contains(e.target as Node)) {
    return;
  }
  closeHiscoresEvent();
};

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
