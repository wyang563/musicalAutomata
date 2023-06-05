import assert from 'assert';
import { Canvas } from 'canvas';
import { AutomataGrid } from './cellular.js';

/**
 * Draws a line on the provided canvas. For now, assumes the stroke info has
 *   already been configured.
 *
 * @param canvas the canvas object to draw on
 * @param x1 the x-coordinate of the first endpoint
 * @param y1 the y-coordinate of the first endpoint
 * @param x2 the x-coordinate of the second endpoint
 * @param y2 the y-coordinate of the second endpoint
 * @throws Error if one of (x1, y1) or (x2, y2) is not visible on the current canvas
 */
function drawCanvasLine(canvas: HTMLCanvasElement, x1: number, y1: number, x2: number, y2: number): void {
    const ctx = canvas.getContext('2d');
    assert(ctx !== null);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

/**
 * For the given puzzle, get the top-left corner of the indicated cell
 *
 * @param puzzleCtx the drawing context
 * @param row the cell's row
 * @param col the cell's column
 * @returns a tuple consisting of the x,y coordinates of the cell's top-left
 *   corner
 */
function getCellCoords(board: AutomataGrid, canvas: HTMLCanvasElement, row: number, col: number): [number, number] {
    // we don't check that the row and col are inbounds for utility purposes
    const x = 0 + col * canvas.width / board.gridSize;
    const y = 0 + row * canvas.height / board.gridSize;
    return [x, y];
}

function fillCell(board: AutomataGrid, canvas: HTMLCanvasElement, row: number, col: number): void {
    const [x, y] = getCellCoords(board, canvas, row, col);
    const ctx = canvas.getContext('2d');
    assert(ctx !== null);
    ctx.rect(x, y, canvas.width / board.gridSize, canvas.height / board.gridSize);
    ctx.fillStyle = "black";
    ctx.fill();
}

export function drawBoard(canvas: HTMLCanvasElement, board: AutomataGrid): void {
    const canvasCtx = canvas.getContext('2d');
    assert(canvasCtx !== null);
    const n = board.gridSize;
    // reset canvas every time we update board
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.strokeStyle = 'grey';
    canvasCtx.lineWidth = 2;
    // draw horizontal grid lines
    for (let i = 1; i < n; i++) {
        const [x, y] = getCellCoords(board, canvas, i, 0);
        drawCanvasLine(canvas, x, y, x + canvas.width, y);
    }
    // draw vertical grid lines
    for (let i = 1; i < n; i++) {
        const [x, y] = getCellCoords(board, canvas, 0, i);
        drawCanvasLine(canvas, x, y, x, y + canvas.height);
    }
    const boardState = board.getBoard();
    // color in cells that are alive
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (boardState[row][col] === 1) {
                fillCell(board, canvas, row, col);
            }
        }
    }

}