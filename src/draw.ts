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

export function drawBoard(canvas: HTMLCanvasElement, board: AutomataGrid): void {
    const canvasCtx = canvas.getContext('2d');
    assert(canvasCtx !== null);
    const n = board.gridSize;
    // reset canvas every time we update board
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.strokeStyle = 'grey';
    canvasCtx.lineWidth = 2;
    
}