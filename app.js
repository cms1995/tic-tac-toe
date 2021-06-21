const X_CLASS = 'X'; //6°
const O_CLASS = 'O'; //6°
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]; //14°:ahora debemos chequear las combinaciones posibles para ganar en el juego y llevarlas a la función handleClick() para cuando chequeemos cuando haya una victoria
const cellElements = document.querySelectorAll('[data-cell]')//1°
const board = document.getElementById('board')//11°
let circleTurn //5°
const winningMessageTextElement = document.querySelector('[winning-message-text]')//17°
const winningMessageElement = document.getElementById('winningMessage')//18°
const restartButton = document.getElementById('restartButton')//22°: por último, escribimos como reiniciar el juego una vez finalizado

startGame()//13°
//13°: trasladamos el loop q hicimos al principio para adentro de esta función. Tambien queremos instalar aquí setBoardHoverClass

restartButton.addEventListener('click', startGame)//23°

function startGame(){
    //2°:loopeamos todos los elementos
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)//26°: una vez removida la clase show, procedemos a remover X_class y O_CLASS respectivamente para q las celdas ya queden vacías y podamos volver a jugar de nuevo. Tambien removemos el eventListener
        cell.classList.remove(O_CLASS)//26°:
        cell.removeEventListener('click', handleClick)//26°:
        //3°:cada vez q clickeemos en la celda agregaremos el handleClick. Le diremos q solo haga funcionar el addEventListener UNA SOLA VEZ. Si lo hacemos de vuelta no funcionará de nuevo
        cell.addEventListener('click', handleClick, {once: true})
    })
    setBoardHoverClass()//13°

    //24°:en este punto todavia no se resetea el juego. Esto es xq nuestra funcion startGame() no está revirtiendo el estado de lo q paso.Arriba seteamos todo para jugar cuando empiece, pero ahora tenemos q resetearlo todo nuevamente:
    winningMessageElement.classList.remove('show');//25
}


//4: En esta funcion tenemos q hacer varias cosas: a)primero tenemos ubicar las marcas. b) luego tenemos q chequear si hubo victoria. c) chequear si hubo empate. d) si no pasó ninguna de las anteriores, tenemos q cambiar el turno al otro jugador
function handleClick(e){
    const cell = e.target
    
    //7:si es el turno del circulo, entonces queremos q retorne la O_CLASS. Caso contrario q retorne X_CLASS
    const currentClass = circleTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);//8°
    if (checkWin(currentClass)){//16°
        endGame(false);
    } else if (isDraw()) { //19: para ir finalizando, creamos la funcion en caso q haya empate
        endGame(true)
    } else{
        SwapTurns()//9°: cambiamos de turno cuando aun no hay ganador
        setBoardHoverClass()//10°: con esto aplicaremos el hover en las celdas en las q nos posicionemos con el índice, antes de cliquearlas. Lo hacemos luego de aplicar la opcion SwapTurns para que aparezca el hover de una X o O según cual sea el turno actual. Para eso tenemos q obtener el tablero: nos vamos a la línea 5 y creamos...
    }
}

//16°:
function endGame(draw){
    if(draw){//20°. Posteriormente procedemos a crear la función isDraw
        winningMessageTextElement.innerText = 'Draw!'
    }else{
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`  //17: procedemos a crear la const para el mensaje en caso de que haya un ganador
    }
    winningMessageElement.classList.add('show')//18:esto funciona así: tenemos q tomar el winning mesage element q creamos en 18°, cuyo id es winningMesage. Ahora cuando alguien gane el juego, va a imprimir el texto, y va a mostrarnos wl winning mesage element
}

//21: aqui haremos algo similar a lo q hicimos con las combinaciones ganadoras. chequearemos si cada una de las celdas haya sido llenadas. Chequeremos si contiene alguna de las clases X u O. Entonces, si cada una de las 9 celda tiene una X_CLASS u O_CLASS, entonces queremos que retorne true porque es un empate 38:50.
function isDraw(){
    return [...cellElements].every(cell =>{
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    })
}

//8°
function placeMark(cell, currentClass){
    cell.classList.add(currentClass)
}

//9°:cambio de turnos
function SwapTurns(){
    //esta funcion lo q va a hacer es agarrar circleTurn y cambiarlo al opuesto para cambiar el turno de X a O y viceversa
    circleTurn = !circleTurn;
}

//12°: ahora ya aparecerá el hover según sea el turno de cada jugador. Sin embargo, en el primer movimiento del juego, no aparecerá... Para solucionarlo creamos la función startGame
function setBoardHoverClass(){
    board.classList.remove(X_CLASS)
    board.classList.remove(O_CLASS)
    if (circleTurn){
        board.classList.add(O_CLASS)
    } else{
        board.classList.add(X_CLASS)

    }
}


//15°: una vez creada esta afunción vamos a chequear todas las combinaciones ganadoras para ver si alguna coincide con la combinación actual
function checkWin(currentClass){
    //retornará true si cualquiera de los valores jugados coincide con las combinaciones. Esto va a loopear  todas las combinaciones disponibles y para cada combinación tenemos q chequear cada uno de los indices. Todos los valores en nuestros elementos celdas, tienen q tener la misma clase. Por ello usamos .every porque queremos asegurarnos q cada elemento  tiene la misma clase. Lo q escribimos  es: si la clase actual está en los 3 elementos posibles de una combinación ganadora, entonces ganamos. Si cada celda particular dentro de la combinación es correcta para al menos una de las combinaciones ganadoras, hay victoria
    return WINNING_COMBINATIONS.some(combination =>{
        return combination.every(index =>{
            return cellElements[index].classList.contains(currentClass)
        })
    })
}