import arrayShuffle from 'array-shuffle';
import assert from 'assert';

export class AutomataGrid {
    private state: number[][];
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
                this.state.push(arrayShuffle(row.map(s => s)));
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
     * toMusic 
     * 
     */
    
}

function main(): void {
    console.log("Started Running Main");
    const outputArea: HTMLElement = document.getElementById('outputArea') ?? assert.fail('missing output area');
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement ?? assert.fail('missing drawing canvas');

}

