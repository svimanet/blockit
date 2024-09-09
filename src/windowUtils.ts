import { Application } from "pixi.js";

/**
 * To be used in HTML doc that imports game files.
 * Needs to be able to re-add app.view whenever this function is available.
 * 
 * @param app Pixi.JS application
 * @param document HTML Document
 * @param id Optiona HTML Element ID to append to
 */
export const addAppToDocument = (app: Application, document: Document, id?: string) => {
  if (id) {
    document.getElementById(id)?.appendChild(app.view as HTMLCanvasElement);
  } else {
    const gameDiv = new HTMLDivElement();
    gameDiv.id = 'game';
    document.body.appendChild(gameDiv)
    document.body.appendChild(app.view as HTMLCanvasElement);
  }
}
