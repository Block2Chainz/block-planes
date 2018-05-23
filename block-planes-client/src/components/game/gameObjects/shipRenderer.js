
let shipRenderer = (attrString) => {
    attrString = JSON.stringify(attrString);
    let attrPossibilities = {
        bodyColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'],
        wingShape: ['01', '02', '03', '04', '05'], 
        wingColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'], 
        tailShape: ['01', '02', '03', '04', '05'], 
        tailColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'], 
        cockpitShape: ['01', '02', '03', '04', '05'], 
        cockpitColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'], 
        speed: [0.15, 0.18, 0.21, 0.24], // how much movement it travels after each frame with a keydown,  
        inertia: [.975, .98, .985, .99], // how quickly it slows down after releasing a key: 0.5 = immediately, 1 = never; 
        shootingSpeed: [180, 200, 220, 240, 260, 280, 300], 
        smokeColor: ['#ff9999', '#b3ff99', '#ffffb3', '#80ffdf', '#99d6ff', '#c299ff', '#ff80df', '#ffffff'], 
    }

    let shipArgs = {
        bodyColor: attrPossibilities.bodyColor[parseInt(attrString[0]) % attrPossibilities.bodyColor.length],
        wingShape: attrPossibilities.wingShape[parseInt(attrString[1]) % attrPossibilities.wingShape.length],
        wingColor: attrPossibilities.wingColor[parseInt(attrString[2]) % attrPossibilities.wingColor.length], 
        tailShape: attrPossibilities.tailShape[parseInt(attrString[3]) % attrPossibilities.tailShape.length],
        tailColor: attrPossibilities.tailColor[parseInt(attrString[4]) % attrPossibilities.tailColor.length],
        cockpitShape: attrPossibilities.cockpitShape[parseInt(attrString[5]) % attrPossibilities.cockpitShape.length],
        cockpitColor: attrPossibilities.cockpitColor[parseInt(attrString[6]) % attrPossibilities.cockpitColor.length],
        speed: attrPossibilities.speed[parseInt(attrString[7]) % attrPossibilities.speed.length],
        inertia: attrPossibilities.inertia[parseInt(attrString[8]) % attrPossibilities.inertia.length],
        shootingSpeed: attrPossibilities.shootingSpeed[parseInt(attrString[9]) % attrPossibilities.shootingSpeed.length],
        smokeColor: attrPossibilities.smokeColor[parseInt(attrString[10]) % attrPossibilities.smokeColor.length],
    };

    return shipArgs;
}

export default shipRenderer;