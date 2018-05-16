let shipRenderer = (attrString) => {
    let attrPossibilities = {
        wingShape: ['01', '02', '03', '04', '05'],
        wingColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'],
    
        tailShape: ['01', '02', '03', '04', '05'],
        tailColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'],
    
        cockpitShape: ['01', '02', '03', '04', '05'],
        cockpitColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'],
    
        speed: [0.15, 0.3, 0.4, 0.5],
        inertia: [0.99, 0.98, 0.97, 0.96],
        shootingSpeed: [300, 350, 400, 250, 200, 150, 100],
        smokeColor: ['#ff9999', '#b3ff99', '#ffffb3', '#80ffdf', '#99d6ff', '#c299ff', '#ff80df', '#ffffff'],
    }
    
    let shipArgs = {
        wingShape: attrPossibilities.wingShape[attrString[0] % 5],
        wingColor: attrPossibilities.wingColor[attrString[1] % 8],
        
        tailShape: attrPossibilities.tailShape[attrString[2] % 5],
        tailColor: attrPossibilities.tailColor[attrString[3] % 8],
        
        cockpitShape: attrPossibilities.cockpitShape[attrString[4] % 5],
        cockpitColor: attrPossibilities.cockpitColor[attrString[5] % 8],
        
        speed: attrPossibilities.speed[attrString[6] % 4],
        inertia: attrPossibilities.inertia[attrString[7] % 3],
        shootingSpeed: attrPossibilities.shootingSpeed[attrString[8] % 7],
        smokeColor: attrPossibilities.smokeColor[attrString[9] % 8],
        ingame: true
    };

    return new Ship(Object.assign({}, shipArgs, otherAttr));
}

export default shipRenderer;