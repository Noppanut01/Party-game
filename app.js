// ========== GAME STATE ==========
let currentScreen = 'menu';
let pirateSlot = -1;
let usedSlots = [];
let badTooth = -1;
let usedTeeth = [];
let cardDeck = [];
let usedCards = 0;

// ========== NAVIGATION ==========
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenName + '-screen').classList.add('active');
    currentScreen = screenName;
}

function startGame(gameType) {
    showScreen(gameType);

    if (gameType === 'pirate') {
        initPirateGame();
    } else if (gameType === 'crocodile') {
        resetCrocodile();
    } else if (gameType === 'cards') {
        initCardGame();
    }
}

function backToMenu() {
    showScreen('menu');
}

// ========== CONFETTI EFFECT ==========
function createConfetti(isSafe = false) {
    const emojis = isSafe ? ['🎉', '✨', '🎊', '⭐'] : ['💀', '🏴‍☠️', '💥', '😱'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-50px';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// ========== PIRATE GAME ==========
function initPirateGame() {
    pirateSlot = Math.floor(Math.random() * 8);
    usedSlots = [];

    const pirateFace = document.getElementById('pirate-face');
    pirateFace.textContent = '😴';
    pirateFace.classList.remove('scared');

    const message = document.getElementById('pirate-message');
    message.textContent = 'ลากดาบไปวางบนถัง!';
    message.className = 'game-message';

    // Reset slots
    document.querySelectorAll('.barrel-slot').forEach(slot => {
        slot.classList.remove('filled');
    });

    // Reset swords
    document.querySelectorAll('.sword').forEach(sword => {
        sword.classList.remove('used');
        sword.style.display = 'block';
    });

    // Setup drag and drop for swords
    setupSwordDragDrop();
}

function setupSwordDragDrop() {
    const swords = document.querySelectorAll('.sword');
    const barrel = document.getElementById('barrel');
    const slots = document.querySelectorAll('.barrel-slot');

    let draggedSword = null;

    swords.forEach(sword => {
        // Desktop drag events
        sword.addEventListener('dragstart', (e) => {
            draggedSword = sword;
            sword.style.opacity = '0.5';
        });

        sword.addEventListener('dragend', (e) => {
            sword.style.opacity = '1';
        });

        // Touch events for mobile/iPad
        sword.addEventListener('touchstart', handleTouchStart, { passive: false });
        sword.addEventListener('touchmove', handleTouchMove, { passive: false });
        sword.addEventListener('touchend', handleTouchEnd, { passive: false });
    });

    // Make barrel and slots drop targets
    [barrel, ...slots].forEach(element => {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedSword) {
                handleSwordDrop(draggedSword);
                draggedSword = null;
            }
        });
    });

    // Touch drag state
    let touchDragElement = null;
    let touchClone = null;

    function handleTouchStart(e) {
        e.preventDefault();
        touchDragElement = e.target.closest('.sword');

        // Create clone for visual feedback
        touchClone = touchDragElement.cloneNode(true);
        touchClone.style.position = 'fixed';
        touchClone.style.zIndex = '10000';
        touchClone.style.pointerEvents = 'none';
        touchClone.style.opacity = '0.8';
        document.body.appendChild(touchClone);

        moveTouchClone(e.touches[0]);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (touchClone) {
            moveTouchClone(e.touches[0]);
        }
    }

    function moveTouchClone(touch) {
        if (touchClone) {
            touchClone.style.left = (touch.clientX - 40) + 'px';
            touchClone.style.top = (touch.clientY - 40) + 'px';
        }
    }

    function handleTouchEnd(e) {
        e.preventDefault();

        if (touchClone) {
            touchClone.remove();
            touchClone = null;
        }

        if (touchDragElement) {
            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

            if (dropTarget && (dropTarget.closest('.barrel') || dropTarget.closest('.barrel-slot'))) {
                handleSwordDrop(touchDragElement);
            }

            touchDragElement = null;
        }
    }
}

function handleSwordDrop(sword) {
    const swordIndex = parseInt(sword.dataset.sword);

    if (usedSlots.includes(swordIndex)) return;

    usedSlots.push(swordIndex);

    // Hide sword
    sword.classList.add('used');

    // Find empty slot and fill it
    const slot = document.querySelector(`.barrel-slot[data-slot="${swordIndex}"]`);
    if (slot) {
        slot.classList.add('filled');
    }

    // Check if hit pirate
    if (swordIndex === pirateSlot) {
        // HIT!
        setTimeout(() => {
            const pirateFace = document.getElementById('pirate-face');
            pirateFace.textContent = '😱';
            pirateFace.classList.add('scared');

            const message = document.getElementById('pirate-message');
            message.textContent = '💥 โจรสลัดโผล่! ดื่ม! 🍺';
            message.className = 'game-message error';

            createConfetti(false);
        }, 300);
    } else if (usedSlots.length === 7) {
        // WIN!
        setTimeout(() => {
            const pirateFace = document.getElementById('pirate-face');
            pirateFace.textContent = '😅';

            const message = document.getElementById('pirate-message');
            message.textContent = '🎉 ปลอดภัยทั้งหมด! ไม่ต้องดื่ม!';
            message.className = 'game-message success';

            createConfetti(true);
        }, 300);
    } else {
        // Safe
        const message = document.getElementById('pirate-message');
        message.textContent = `✅ ปลอดภัย! (${usedSlots.length}/8)`;
        message.className = 'game-message';
    }
}

function resetPirate() {
    initPirateGame();
}

// ========== CROCODILE GAME ==========
function resetCrocodile() {
    badTooth = Math.floor(Math.random() * 12);
    usedTeeth = [];

    const crocHead = document.getElementById('croc-head');
    crocHead.classList.remove('biting');

    const message = document.getElementById('croc-message');
    message.textContent = 'กดฟันทีละอัน!';
    message.className = 'game-message';

    document.querySelectorAll('.tooth').forEach(tooth => {
        tooth.classList.remove('pressed');
        tooth.disabled = false;
    });
}

function pressTooth(index) {
    if (usedTeeth.includes(index)) return;

    usedTeeth.push(index);

    const tooth = document.querySelectorAll('.tooth')[index];
    tooth.classList.add('pressed');
    tooth.disabled = true;

    if (index === badTooth) {
        // BITE!
        const crocHead = document.getElementById('croc-head');
        crocHead.classList.add('biting');

        const message = document.getElementById('croc-message');
        message.textContent = '💥 ปากกัด! ดื่ม! 🍺';
        message.className = 'game-message error';

        // Disable all teeth
        document.querySelectorAll('.tooth').forEach(t => {
            t.disabled = true;
        });

        createConfetti(false);
    } else if (usedTeeth.length === 11) {
        // WIN!
        const message = document.getElementById('croc-message');
        message.textContent = '🎉 ปลอดภัยทั้งหมด! ไม่ต้องดื่ม!';
        message.className = 'game-message success';

        createConfetti(true);
    } else {
        // Safe
        const message = document.getElementById('croc-message');
        message.textContent = `✅ ปลอดภัย! (${usedTeeth.length}/12)`;
        message.className = 'game-message';
    }
}

// ========== CARD GAME ==========
const suits = {
    hearts: { symbol: '♥', color: 'red-card' },
    diamonds: { symbol: '♦', color: 'red-card' },
    clubs: { symbol: '♣', color: 'black-card' },
    spades: { symbol: '♠', color: 'black-card' }
};

const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const cardActions = {
    'A': ['ดื่ม 1 shot', 'แจกให้คนอื่น 2 shots', 'เล่นเกมนับเลข 1-21'],
    '2': ['ดื่ม 2 shots', 'ให้คนทางซ้ายดื่ม 2 shots', 'คนที่อายุน้อยสุดดื่ม'],
    '3': ['ดื่ม 3 shots', 'แจกให้ 3 คนดื่มคนละ 1 shot', 'ทุกคนดื่ม 1 shot'],
    '4': ['ตอบคำถาม Truth', 'ทำท่า 4 ท่า', 'เล่น Rock Paper Scissors'],
    '5': ['ให้คนทางขวาดื่ม 2 shots', 'โทรหาคนที่กำลังคิดถึง', 'ร้องเพลง 1 เพลง'],
    '6': ['ผู้ชายทุกคนดื่ม', 'กำหนดกฎใหม่ 1 ข้อ', 'Thumb Master'],
    '7': ['คนที่สูงที่สุดดื่ม', 'ชี้ท้องฟ้า คนสุดท้ายดื่ม', 'เลือก 2 คนจูบแก้ม'],
    '8': ['เลือก Drinking Buddy', 'ส่งข้อความหาแฟนเก่า', 'เต้นให้ทุกคนดู 30 วินาที'],
    '9': ['ผู้หญิงทุกคนดื่ม', 'Rhyme Time - พูดคำสัมผัส', 'Categories - บอกชื่อสัตว์'],
    '10': ['Master - คุณเป็นนาย', 'Never Have I Ever', 'ทำท่าโยคะ 3 ท่า'],
    'J': ['Question Master', 'เลือก 3 คนดื่ม', 'กำหนดท่าเต้น'],
    'Q': ['ทำให้ทุกคนหัวเราะได้', 'ลบโพสต์ล่าสุด Instagram', 'เล่นเกม "กษัตริย์บอก"'],
    'K': ['King\'s Cup - เทเหล้าลงแก้วกลาง', 'Make a Rule!', 'คนที่จั่ว K ใบสุดท้ายดื่มแก้วกลาง!']
};

function createDeck() {
    const deck = [];
    Object.entries(suits).forEach(([suitKey, suit]) => {
        values.forEach(value => {
            deck.push({
                suit: suitKey,
                value: value,
                symbol: suit.symbol,
                color: suit.color
            });
        });
    });

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

function initCardGame() {
    cardDeck = createDeck();
    usedCards = 0;

    document.getElementById('deck-count').textContent = cardDeck.length;
    document.getElementById('card-message').textContent = '';

    // Clear drop zone
    const dropZone = document.getElementById('card-drop-zone');
    dropZone.innerHTML = '<div class="drop-zone-text">ลากไพ่มาวางที่นี่</div>';

    setupCardDragDrop();
}

function setupCardDragDrop() {
    const topCard = document.getElementById('top-card');
    const dropZone = document.getElementById('card-drop-zone');

    if (!topCard) return;

    let draggedCard = null;
    let touchCard = null;

    // Desktop drag
    topCard.addEventListener('dragstart', (e) => {
        draggedCard = topCard;
        e.dataTransfer.effectAllowed = 'move';
    });

    // Touch drag
    topCard.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchCard = e.target.closest('.card');
    }, { passive: false });

    topCard.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (touchCard) {
            const touch = e.touches[0];
            touchCard.style.position = 'fixed';
            touchCard.style.left = (touch.clientX - 75) + 'px';
            touchCard.style.top = (touch.clientY - 110) + 'px';
            touchCard.style.zIndex = '10000';
        }
    }, { passive: false });

    topCard.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (touchCard) {
            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

            if (dropTarget && dropTarget.closest('#card-drop-zone')) {
                drawCard();
            }

            touchCard.style.position = '';
            touchCard.style.left = '';
            touchCard.style.top = '';
            touchCard.style.zIndex = '';
            touchCard = null;
        }
    }, { passive: false });

    // Drop zone
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (draggedCard) {
            drawCard();
            draggedCard = null;
        }
    });
}

function drawCard() {
    if (usedCards >= cardDeck.length) {
        const message = document.getElementById('card-message');
        message.textContent = 'ไพ่หมดแล้ว! กดปุ่มสับไพ่ใหม่';
        message.className = 'game-message error';
        return;
    }

    const card = cardDeck[usedCards];
    usedCards++;

    document.getElementById('deck-count').textContent = cardDeck.length - usedCards;

    // Get random action
    const actions = cardActions[card.value];
    const action = actions[Math.floor(Math.random() * actions.length)];

    // Display card in drop zone
    const dropZone = document.getElementById('card-drop-zone');
    dropZone.innerHTML = `
        <div class="drawn-card">
            <div class="card-value ${card.color}">${card.value}</div>
            <div class="card-suit ${card.color}">${card.symbol}</div>
        </div>
    `;

    // Display action
    const message = document.getElementById('card-message');
    message.innerHTML = `
        <div><strong>${card.value}${card.symbol}</strong></div>
        <div style="margin-top: 10px;">${action}</div>
    `;
    message.className = 'game-message success';

    // Update top card if more cards left
    if (usedCards < cardDeck.length) {
        setTimeout(() => {
            setupCardDragDrop();
        }, 100);
    } else {
        document.getElementById('top-card').style.display = 'none';
    }
}

function resetCards() {
    initCardGame();
}

// ========== INITIALIZATION ==========
window.addEventListener('load', () => {
    showScreen('menu');
});
