let machineSequence = [];
let playerSequence = [];
let round = 0;
const colors = ['red', 'blue', 'green', 'yellow'];

document.querySelector('#startBtn').onclick = startGame;

setHandleColor('red');

function startGame (){
    resetGame();
    enableDashboard();
    handleRound();
}

function resetGame (){
    machineSequence = [];
    playerSequence = [];
    round = 0;
    setButton('icons/play-solid.svg');
}

function setState(text) {
    document.querySelector('.state').textContent = text;

}

function setHandleColor(color) {
    const led = document.querySelector('#led');
    
    const ledColors = ['yellow', 'red', 'green'];

    for (let ledColor of ledColors) {
        led.classList.remove(`led-${ledColor}`);
    }
    
    led.classList.add(`led-${color}`);
}

function setButton(value){
    const $button = document.querySelector('.btn img');
    $button.src = value;
}

function enableDashboard() {
    for (let color of colors) {
        document.querySelector(`#${color}`).classList.add(`enabled`, `${color}`);
        document.querySelector(`#${color}`).classList.remove(`disabled`, `${color}-disabled`);
    }
}

function disableDashboardColor(color, class1, class2) {
    document.querySelector(`#${color}`).classList.remove(`enabled`, 'disabled', `${color}-disabled`, `${color}`)
    document.querySelector(`#${color}`).classList.add(class1, class2);
}

function handleRound() {
    setState('Wait your turn!');
    setHandleColor('yellow');
    blockPlayerInput();

    const randomColor = generateRandomColor()
    machineSequence.push(randomColor);

    const DELAY_PLAYER_TURN = (machineSequence.length + 1) * 1000;

    machineSequence.forEach(function($color, index) {
        for (let color of colors){
            disableDashboardColor(`${color}`, 'disabled', `${color}-disabled`);
        }
        const DELAY_MS = (index + 1) * 1000;
        setTimeout(function(){
            highlightColor($color);
        }, DELAY_MS);
    });

    setTimeout(function(){
        setState('Your turn!');
        setHandleColor('green');
        enableDashboard();
        unlockPlayerInput();
    }, DELAY_PLAYER_TURN);

    playerSequence = [];
    round++;
    incrementRounds(round.toString());
}

function blockPlayerInput(){
    document.querySelectorAll('.dashboard').forEach(function($color) {
        $color.onclick = function(){
        };
    });
}

function unlockPlayerInput(){
    document.querySelectorAll('.dashboard').forEach(function($color) {
        $color.onclick = playerInputHandle;
    })
}

function generateRandomColor() {
    let index = Math.floor(Math.random() * colors.length);
    return colors[index];
}

function highlightColor(color) {
    let $color = document.querySelector(`#${color}`);
    $color.style.opacity = 1;
    setTimeout(function() {
        $color.removeAttribute('style');
      }, 500);
}

function playerInputHandle(e){
    let $color = e.target;
    highlightColor($color.id);
    playerSequence.push($color.id);

    const $machineColor = machineSequence[playerSequence.length - 1];

    if ($color.id !== $machineColor) {
        handleLose();
        return;
    }

    if (playerSequence.length === machineSequence.length) {
        blockPlayerInput();
        setTimeout(handleRound, 1000);
    }
}

function incrementRounds(round){
    document.querySelector(".rounds").textContent = `${round.padStart(2, 0)}`;
}

function handleLose(){
    blockPlayerInput();
    setButton('icons/undo-alt-solid.svg');
    colors.forEach(function(color){
        disableDashboardColor(`${color}`, `disabled`, `${color}-disabled`);
    });
    setState(`You lost! Try again.`);
    setHandleColor('red');
}

