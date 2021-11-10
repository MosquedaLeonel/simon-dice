let machineSequence = [];
let playerSequence = [];
let round = 0;
const colors = ['red', 'blue', 'green', 'yellow'];

document.querySelector(`.btn`).onclick = startGame;

ledHandle('red');

function startGame (){
    resetGame();
    enableDashboard();
    roundHandle();
}

function resetGame (){
    machineSequence = [];
    playerSequence = [];
    round = 0;
    document.querySelector('.box-state').classList.remove('lose');
    buttonHandle('play_circle_filled');
}

function stateHandle(text) {
    document.querySelector('.state').textContent = text;

}

function ledHandle (color) {
    const led = document.querySelector('#led');
    
    const ledColors = ['yellow', 'red', 'green'];

    for (let ledColor of ledColors) {
        led.classList.remove(`led-${ledColor}`);
    }
    
    led.classList.add(`led-${color}`);
}

function buttonHandle(value){
    const $button = document.querySelector('.btn span');
    $button.textContent = value;
}

function enableDashboard() {
    for (let color of colors) {
        document.querySelector(`#${color}`).classList.add(`enabled`, `${color}`);
        document.querySelector(`#${color}`).classList.remove(`disabled`, `${color}-disabled`);
    }
}

function disableDashboard(color, class1, class2) {
    document.querySelector(`#${color}`).classList.remove(`enabled`, 'disabled', `${color}-disabled`, `${color}`)
    document.querySelector(`#${color}`).classList.add(class1, class2);
}

function roundHandle() {
    stateHandle('Wait your turn!');
    ledHandle('yellow');
    blockPlayerInput();
    
    generateRandomColor()

    const DELAY_PLAYER_TURN = (machineSequence.length + 1) * 1000;

    machineSequence.forEach(function($color, index) {
        for (let color of colors){
            disableDashboard(`${color}`, 'disabled', `${color}-disabled`);
        }
        const DELAY_MS = (index + 1) * 1000;
        setTimeout(function(){
            highlightColor($color);
        }, DELAY_MS);
    });

    setTimeout(function(){
        stateHandle('Your turn!');
        ledHandle('green');
        enableDashboard();
        unlockPlayerInput();
    }, DELAY_PLAYER_TURN);

    playerSequence = [];
    round++;
    upgradeRounds(round);
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
    let index = Math.floor(Math.random() * 4);
    return machineSequence.push(colors[index]);
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
        lose();
        return;
    }

    if (playerSequence.length === machineSequence.length) {
        blockPlayerInput();
        setTimeout(roundHandle, 1000);
    }
}

function upgradeRounds(round){
    if (round < 10) {
    document.querySelector(".rounds").textContent = `0${round}`;
    } else{
        document.querySelector(".rounds").textContent = `${round}`;
    }
}

function lose(){
    blockPlayerInput();
    buttonHandle('replay');
    colors.forEach(function(color){
        disableDashboard(`${color}`, `disabled`, `${color}-disabled`);
    });
    stateHandle(`You lost! Try again.`);
    ledHandle('red');
}

