const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(0, 0, -10));
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    const gridSize = 50;
    const cellSize = 0.2;
    const grid = [];
    const cells = [];

    // Initialize grid and cells
    for (let x = 0; x < gridSize; x++) {
        grid[x] = [];
        cells[x] = [];
        for (let y = 0; y < gridSize; y++) {
            grid[x][y] = Math.random() > 0.8 ? 1 : 0; // Randomly alive or dead
            const cell = BABYLON.MeshBuilder.CreatePlane(`cell_${x}_${y}`, {size: cellSize}, scene);
            cell.position.x = x * cellSize - gridSize * cellSize / 2;
            cell.position.y = y * cellSize - gridSize * cellSize / 2;
            cell.isVisible = grid[x][y] === 1;
            cells[x][y] = cell;
        }
    }

    const updateGrid = () => {
        const newGrid = grid.map(arr => arr.slice());

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                const neighbors = countNeighbors(x, y);
                if (grid[x][y] === 1) {
                    if (neighbors < 2 || neighbors > 3) {
                        newGrid[x][y] = 0;
                    }
                } else {
                    if (neighbors === 3) {
                        newGrid[x][y] = 1;
                    }
                }
            }
        }

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                grid[x][y] = newGrid[x][y];
                cells[x][y].isVisible = grid[x][y] === 1;
            }
        }
    };

    const countNeighbors = (x, y) => {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const nx = (x + i + gridSize) % gridSize;
                const ny = (y + j + gridSize) % gridSize;
                count += grid[nx][ny];
            }
        }
        return count;
    };

    scene.onBeforeRenderObservable.add(() => {
        updateGrid();
    });

    return scene;
};

const scene = createScene();
engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener('resize', function () {
    engine.resize();
});
