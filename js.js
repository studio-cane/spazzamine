const cellSize = 30
let cells = []


const colors = ['blue', 'green', 'red', 'navy', 'black', 'orange']

document.addEventListener("DOMContentLoaded", (event) => {

    const game = document.querySelector(".game")
    const w = game.offsetWidth
    const h = game.offsetHeight
    const cols = ~~(w / cellSize)
    const rows = ~~(h / cellSize)

    const NUM_BOMBS = 100;

    iterate = callback => {
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                callback(x, y)
            }
        }
    }
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }




    initCells = () => {

        iterate((x, y) => {
            let c = document.createElement("button")
            c.className = "cella"
            game.appendChild(c)
            if (!cells[x]) cells[x] = [];
            cells[x][y] = {
                x,
                y,
                node: c,

            }

        })

    }


    restart = () => {


        iterate((x, y) => {
            const cell = cells[x][y];
            cell.node.textContent = ""
            cell.visited = false;
            cell.isBomb = false;
        })

        for (let i = 0; i < NUM_BOMBS; i++) {
            const element = NUM_BOMBS[i];
            const bombCell = cells[~~(Math.random() * rows)][~~(Math.random() * cols)]
            bombCell.isBomb = true;
        }

        iterate((x, y) => {
            const cell = cells[x][y];
            if (x > 0 && y > 0) cell.nw = cells[x - 1][y - 1]
            if (x > 0) cell.n = cells[x - 1][y]
            if (x > 0 && y < cols - 1) cell.ne = cells[x - 1][y + 1]
            if (y > 0) cell.w = cells[x][y - 1]
            if (y < cols - 1) cell.e = cells[x][y + 1]
            if (x < rows - 1 && y > 0) cell.sw = cells[x + 1][y - 1]
            if (x < rows - 1) cell.s = cells[x + 1][y]
            if (x < rows - 1 && y < cols - 1) cell.se = cells[x + 1][y + 1]

            let count = 0;
            if (cell.n && cell.n.isBomb) count++
            if (cell.e && cell.e.isBomb) count++
            if (cell.s && cell.s.isBomb) count++
            if (cell.w && cell.w.isBomb) count++
            if (cell.nw && cell.nw.isBomb) count++
            if (cell.ne && cell.ne.isBomb) count++
            if (cell.sw && cell.sw.isBomb) count++
            if (cell.se && cell.se.isBomb) count++

            cell.count = count;
            cell.node.onclick = () => discover(cell);
            cell.node.oncontextmenu = (e) => { e.preventDefault(); flag(cell) };

            // cell.node.oncontextmenu = (() => { return () => flag(cell) })(cell);

        })



        render()
    }

    flag = (cell) => {
        cell.node.textContent = '🎅🏿'
    }

    render = () => {
        iterate((x, y) => {
            const cell = cells[x][y]
            cell.node.style.background = "#333"
        })
    }


    discover = (cell, color) => {
        let currentCell = cell


        if (currentCell.isBomb) {
            iterate((x, y) => {
                let c = cells[x][y]
                if (c.isBomb) {
                    c.node.style.backgroundColor = "green"
                    c.node.textContent = "💣"
                }
            })
            console.log('😿')
            setTimeout(() => {
                restart()
                render()
            }, 3000)
            return
        }


        if (currentCell.visited) return

        currentCell.node.style.background = "#ddd"

        if (currentCell.count != 0) {
            currentCell.node.textContent = currentCell.count
            currentCell.node.style.color = colors[currentCell.count - 1]
            return;
        }

        currentCell.visited = true;
        if (currentCell.n) discover(currentCell.n, "green")
        if (currentCell.e) discover(currentCell.e, "gold")
        if (currentCell.s) discover(currentCell.s, "aquamarine")
        if (currentCell.w) discover(currentCell.w, "purple")

        if (currentCell.ne) discover(currentCell.ne, "green")
        if (currentCell.nw) discover(currentCell.nw, "green")
        if (currentCell.sw) discover(currentCell.sw, "aquamarine")
        if (currentCell.se) discover(currentCell.se, "aquamarine")

    }

    

    initCells();
    restart()
    render();



});