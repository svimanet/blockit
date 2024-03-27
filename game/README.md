# Tech stack

Game made with `Bun (with NPM)`, `Vite`, `Typescript`, `Pixi.js`. Creates a WebGL canvas, and attaches to a HTMLSection element. Uses `Bun` to build `TS` into production friendly `JS` build. Said build is delivered to a client through a `Bun HTTP server`.

`Bun HTTP server` delivers everything to the webclient. Includes a `HTMX` frontend that fetches the game bundle

Used technologies: `Bun`, `HTMX`, `Typescript`, `HTML`, `css`, `Vite`, `Pixi.js`

TODO: Get rid of Vite. Only using for typed client api intellisense.


Bundled to JS using Bun. JS game bundle delivered through Bun HTTP server in sibling workspace.

# Game
A lightweight JS web-browser game. Inspired by Tetris, 1010, Trigon, ... probably not a unique concept.

## Gameplay
Place figures on a grid. Complete rows/cols disapear. Goes on as long as possible.

## Points
- 1 point per placed figure
- 1 point per deleted figure node (figures have 4 nodes)
- 1 point per deleted figure (4 nodes + 1 = 5 points total for a full figure removal)
