export default class CellularAutomaton {
    constructor() {
        this.cellsMap = {}
    }

    evolutionRule(cellType, neighbours) {
        switch (cellType) {
            case "black":
                if ([2,3].includes(neighbours)) return "black"
                else return undefined
            default:
                if ([3].includes(neighbours)) return "black"
                else return undefined
        }
    }

    addCell(x, y, c) {
        if (x in this.cellsMap) {
            this.cellsMap[x][y] = c
        } else {
            this.cellsMap[x] = {[y]: c}
        }
    }

    deleteCell(x, y) {
        const isEmpty = (obj) => {
            for (const p in obj) return false
            return true
        }
        delete this.cellsMap?.[x]?.[y]
        if (isEmpty(this.cellsMap[x])) {
            delete this.cellsMap[x]
        }
    }

    cellVicinity(x, y) {
        let vicinity = 0
        for (const i of [x-1, x, x+1]) {
            for (const j of [y-1, y, y+1]) {
                if (i === x && j === y) continue
                if (this.cellsMap[i]) {
                    if (this.cellsMap[i][j]) {
                        vicinity +=1
                    }
                }
            }
        }

        return vicinity
    }

    gridVicinity() {
        const vicinity = {}

        for (const cell of this.cells) {
            for (const x of [cell.x-1, cell.x, cell.x+1]) {
                for (const y of [cell.y-1, cell.y, cell.y+1]) {
                    if (vicinity[x] === undefined) {
                        vicinity[x] = {}
                    }

                    if (vicinity[x][y] === undefined) {
                        vicinity[x][y] = this.cellVicinity(x, y)
                    }
                }
            }
        }

        return vicinity
    }

    evolute() {
        const vicinity = this.gridVicinity()

        for (const x in vicinity) {
            for (const y in vicinity[x]) {
                const next_gen = this.evolutionRule(this.cellsMap?.[x]?.[y], vicinity[x][y])
                if (next_gen) {
                    this.addCell(x, y, next_gen)
                } else {
                    this.deleteCell(x, y)
                }
            }
        }
    }

    get cells() {
        function* genCells(cells) {
            for (const x in cells) {
                for (const y in cells[x]) {
                    yield {x: +x, y: +y, c: cells[x][y]}
                }
            }
        }

        return genCells(this.cellsMap)
    }
}