
class AutomataGrid:
    def __init__(self, gridSize, initialState = None):
        self.size = gridSize
        if initialState is None:
            pass
        else:
            self.initialState = list(map(lambda s: s.copy(), initialState))
            