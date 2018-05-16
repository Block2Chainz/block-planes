
let shipRenderer = (attrString) => {
    console.log(attrString, typeof(attrString), 'in ship renderer');
    attrString = JSON.stringify(attrString);
    let attrPossibilities = {
        bodyColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'],
        wingShape: ['01', '02', '03', '04', '05'], 
        wingColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'], 
        tailShape: ['01', '02', '03', '04', '05'], 
        tailColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'], 
        cockpitShape: ['01', '02', '03', '04', '05'], 
        cockpitColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'], 
        speed: [0.8, 1, 1.5, 2], // how much movement it travels after each frame with a keydown,  
        inertia: [.88, .93, .97, .99], // how quickly it slows down after releasing a key: 0.5 = immediately, 1 = never; 
        shootingSpeed: [300, 35, 100, 250, 200, 75, 150], 
        smokeColor: ['#ff9999', '#b3ff99', '#ffffb3', '#80ffdf', '#99d6ff', '#c299ff', '#ff80df', '#ffffff'], 
    }

    let shipArgs = {
        bodyColor: attrPossibilities.bodyColor[parseInt(attrString[0]) % 8],
        wingShape: attrPossibilities.wingShape[parseInt(attrString[1]) % 5],
        wingColor: attrPossibilities.wingColor[parseInt(attrString[2]) % 8], 
        tailShape: attrPossibilities.tailShape[parseInt(attrString[3]) % 5],
        tailColor: attrPossibilities.tailColor[parseInt(attrString[4]) % 8],
        cockpitShape: attrPossibilities.cockpitShape[parseInt(attrString[5]) % 5],
        cockpitColor: attrPossibilities.cockpitColor[parseInt(attrString[6]) % 8],
        speed: attrPossibilities.speed[parseInt(attrString[7]) % 4],
        inertia: attrPossibilities.inertia[parseInt(attrString[8]) % 3],
        shootingSpeed: attrPossibilities.shootingSpeed[parseInt(attrString[9]) % 7],
        smokeColor: attrPossibilities.smokeColor[parseInt(attrString[10]) % 8],
        ingame: true,
    };

    return shipArgs;
}

export default shipRenderer;