import random

class AutomataGrid:
    def __init__(self, gridSize, initialState = None):
        self.size = gridSize
        if initialState is None:
            numFillCells = int(gridSize / 4)
            self.state = [[1 for _ in range(numFillCells)] + 
                                 [0 for _ in range(gridSize - numFillCells)] for _ in range(gridSize)]
            self.state = list(map(lambda s: random.shuffle(s), self.state))
        else:
            self.state = list(map(lambda s: s.copy(), initialState))
    

g = AutomataGrid(10)
print(g.state)