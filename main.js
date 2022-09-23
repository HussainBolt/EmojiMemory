const state = {  
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    gameRestart: false,
}

const selectors = {
    boardContainer: document.getElementById('board-container'),
    gameBoard: document.getElementById('board'), 
    timer: document.getElementById('timer-count'),
    numMoves: document.getElementById('num-moves'),
    win: document.getElementById('win'),
    restart: document.getElementById('restart'),
}

const randomizeCards = (array, items) => {
    const arrayClone = [...array]
    const randoPicks = []

    for (let index = 0; index < items; index++) {
        const randoIndex = Math.floor(Math.random() * arrayClone.length)
        
        randoPicks.push(arrayClone[randoIndex])
        arrayClone.splice(randoIndex, 1)
    }
    return randoPicks
}

const shuffle = array => {
    const arrayClone = [...array]
    
    for (let index = arrayClone.length - 1; index > 0; index--) {
        const randoIndex = Math.floor(Math.random() * (index + 1))
        const original = arrayClone[index]
        arrayClone[index] = arrayClone[randoIndex]
        arrayClone[randoIndex] = original
    }
    return arrayClone
}

const renderGame = () => {
    const dimension = selectors.gameBoard.getAttribute('data-dimension')
    const emojis = ["😀", "😈", "😅", "😂", "🙃", "😍", "🤩", "😡", "🤪", "🤑", "🥲", "🤐", "🤔", "😎", "💀", "🤧", "🥶", "🥵"]
    const choice = randomizeCards(emojis, (dimension * dimension) / 2) 
    const allCards = shuffle([...choice, ...choice])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimension}, auto)">
            ${allCards.map(card => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${card}</div>
                </div>
            `).join('')}
       </div>
`
    
    const parse = new DOMParser().parseFromString(cards, 'text/html')
    selectors.gameBoard.replaceWith(parse.querySelector('.board'))
}

const restartGame = () => {
    state.gameRestart = true
    selectors.restart.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.numMoves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `time: ${state.totalTime} sec`
    }, 1000)
}

const flipCardBack = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })
    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameRestart) {
        restartGame()
    }
    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }
    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipCardBack()
        }, 800)
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-end">
                    You won!<br />
                    You made <span>${state.totalFlips}</span> moves<br />
                    in <span>${state.totalTime}</span> seconds
                </span>
            `

            clearInterval(state.loop)
        }, 1000)
    }
}

const attachEvListen= () => {
    document.addEventListener('click', evt => {
        const eventTarget = evt.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.node === 'button' && !eventTarget.className.includes('restart')) {
            restartGame()
        }
    })
}

renderGame()
attachEvListen()