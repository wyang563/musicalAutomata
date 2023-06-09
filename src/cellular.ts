import assert from 'assert';
import { drawBoard } from './draw';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export class AutomataGrid {
    private state: number[][];

    /**
     * it's annoying that I had to copy paste this here to resolve bugs
     * @param array to shuffle
     * @returns shuffled array
     */
    private arrayShuffle(array: number[]): number[] {
        if (!Array.isArray(array)) {
            throw new TypeError(`Expected an array, got ${typeof array}`);
        }
    
        array = [...array];
    
        for (let index = array.length - 1; index > 0; index--) {
            const newIndex = Math.floor(Math.random() * (index + 1));
            [array[index], array[newIndex]] = [array[newIndex], array[index]];
        }
        return array;
    }

    public constructor(
        public readonly gridSize: number,
        private initBoard: number[][] | undefined
    ) {
        if (this.initBoard === undefined) {
            this.state = [];
            const numFillCells = Math.max(1, Math.floor(this.gridSize / 2));
            const ones: Array<number> = Array(numFillCells).fill(1);
            const zeros: Array<number> = Array(this.gridSize - numFillCells).fill(0);
            const row = ones.concat(zeros);
            for (let i = 0; i < this.gridSize; i++) {
                this.state.push(this.arrayShuffle(row.map(s => s)));
            }
        }
        else {
            // defensive copy
            this.state = this.initBoard.map(s => s.map(t => t));
        }
    }

    /**
     * 
     * @param x coord
     * @param y coord
     * @returns number of neighbors cell (x, y) has
     */
    private countNeighbors(x: number, y: number): number {
        let numNeighbors = 0;
        const increments = [-1, 0, 1];
        for (const dx of increments) {
            for (const dy of increments) {
                if (! (dx === 0 && dy === 0) &&
                     x + dx >= 0 && y + dy >= 0 &&
                     x + dx < this.gridSize && 
                     y + dy < this.gridSize && 
                     this.state[x + dx][y + dy] === 1) {
                        numNeighbors++;
                     }
            }
        }
        return numNeighbors;
    }

    /**
     * toString
     * @returns string representation of board state
     */
    public toString(): string {
        let resultString = "";
        for (const row of this.state) {
            resultString = resultString + row.join() + '\n';
        }
        return resultString;
    }

    /**
     * getBoard
     * @returns deep copy of this.board
     */
    public getBoard(): number[][] {
        return this.state.map(s => s.map(t => t));
    }

    /**
     * Step function
     * 
     * mutates board according to the rules of the cellular automata specified
     */
    public step(): void {
        const coordChanges: {x: number, y: number}[] = [];
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                let cellState = this.state[x][y];
                const neighbors = this.countNeighbors(x, y);
                // if the cell is alive
                if (cellState === 1) {
                    if (neighbors < 2 || neighbors > 3) {
                        coordChanges.push({x: x, y: y});
                    }
                }
                // cell is dead
                else {
                    if (neighbors === 3) {
                        coordChanges.push({x: x, y: y});
                    }
                } 
            }
        }
        for (const change of coordChanges) {
            this.state[change.x][change.y] = (this.state[change.x][change.y] + 1) % 2;
        
        }
    }

    /**
     * findScale
     * 
     * given board state, calculates what base note musical scale to use
     * by finding number of filled cells and dividing by 12
     */
    public findScale(): string {
        const index = this.state.flatMap(s => s)
                                .filter(t => t === 1)
                                .length;
        return NOTES[index % 12];
    }

    /**
     * toMusic 
     * 
     * calculates 
     */

    public toMusic(scale: number | 7): number {
        return 0;
    }      
}

async function main(): Promise<void> {
    console.log("Started Running Main");
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement 
                                      ?? assert.fail('missing drawing canvas');
    const startButton: HTMLButtonElement = document.getElementById('start_button') as HTMLButtonElement 
                                           ?? assert.fail('button missing');
    const submitButton: HTMLButtonElement = document.getElementById('submit_button') as HTMLButtonElement
                                            ?? assert.fail('button missing');
    const resetButton: HTMLButtonElement = document.getElementById('reset_button') as HTMLButtonElement
                                           ?? assert.fail('button missing');                            
    let DEFAULT_SIZE = 56;
    let DEFAULT_ITERS = 1000;
    let client = new AutomataGrid(DEFAULT_SIZE, undefined);
    drawBoard(canvas, client);
    // submit button

    submitButton.addEventListener('click', (event: MouseEvent) => {
        console.log("submit button clicked");
        const iters = parseInt((<HTMLInputElement>document.getElementById('text_box') ?? assert.fail("missing")).value);
        if (iters <= 0) {
            throw new Error("expected iters to be a positive integer");
        }
        else {
            DEFAULT_ITERS = iters;
        }
    });

    // start button
    startButton.addEventListener('click', (event: MouseEvent) => {
        console.log("start button clicked");
        let count = 0;
        let note = 0;
        const id = setInterval(function () {
            client.step();
            note = client.toMusic(7);
            drawBoard(canvas, client);
            console.log(client.toMusic(7));
            count++;
        }, 100);

        if (count > DEFAULT_ITERS) {
            clearInterval(id);
        }
        // reset button
        resetButton.addEventListener('click', (event: MouseEvent) => {
            clearInterval(id);
            client = new AutomataGrid(DEFAULT_SIZE, undefined);
            drawBoard(canvas, client);
        });
    });

}

main();