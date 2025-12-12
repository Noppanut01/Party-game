// ========== GAME STATE ==========
let currentScreen = 'menu';
let pirateSlot = -1;
let usedSlots = [];
let badTooth = -1;
let usedTeeth = [];
let cardDeck = [];
let usedCards = 0;

// ========== PLAYING CARDS ==========
const suits = {
    hearts: { symbol: '♥', color: 'red-suit', name: 'Hearts' },
    diamonds: { symbol: '♦', color: 'red-suit', name: 'Diamonds' },
    clubs: { symbol: '♣', color: 'black-suit', name: 'Clubs' },
    spades: { symbol: '♠', color: 'black-suit', name: 'Spades' }
};

const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const cardActions = {
    'A': ['ดื่ม 1 shot', 'แจกให้คนอื่น 2 shots', 'เล่นเกมนับเลข 1-21'],
    '2': ['ดื่ม 2 shots', 'ให้คนทางซ้ายดื่ม 2 shots', 'คนที่อายุน้อยสุดดื่ม'],
    '3': ['ดื่ม 3 shots', 'แจกให้ 3 คนดื่มคนละ 1 shot', 'ทุกคนดื่ม 1 shot'],
    '4': ['ตอบคำถาม Truth', 'ทำท่า 4 ท่า', 'เล่น Rock Paper Scissors'],
    '5': ['ให้คนทางขวาดื่ม 2 shots', 'Dare: โทรหาคนที่กำลังคิดถึง', 'ร้องเพลง 1 เพลง'],
    '6': ['ผู้ชายทุกคนดื่ม', 'กำหนดกฎใหม่ 1 ข้อ', 'Thumb Master - ได้สิทธิ์วางนิ้วบนโต๊ะ'],
    '7': ['คนที่สูงที่สุดดื่ม', 'ชี้ท้องฟ้า คนสุดท้ายดื่ม', 'เลือก 2 คนจูบแก้ม'],
    '8': ['เลือก Drinking Buddy', 'Dare: ส่งข้อความหาแฟนเก่า', 'เต้นให้ทุกคนดู 30 วินาที'],
    '9': ['ผู้หญิงทุกคนดื่ม', 'Rhyme Time - พูดคำสัมผัส', 'Categories - บอกชื่อสัตว์'],
    '10': ['Master - คุณเป็นนาย', 'ตอบคำถาม "Never Have I Ever"', 'ทำท่าโยคะ 3 ท่า'],
    'J': ['Jack - Question Master', 'เลือก 3 คนดื่ม', 'กำหนดท่าเต้น ทุกคนต้องทำตาม'],
    'Q': ['Queen - ทำให้ทุกคนหัวเราะได้', 'Dare: ลบโพสต์ล่าสุด Instagram', 'เล่นเกม "กษัตริย์บอก"'],
    'K': ['King\'s Cup - เทเหล้าลงแก้วกลาง', 'Make a Rule!', 'คนที่จั่ว K ใบสุดท้ายดื่มแก้วกลาง!']
};

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
        resetPirate();
    } else if (gameType === 'crocodile') {
        resetCrocodile();
    } else if (gameType === 'cards') {
        resetCards();
    }
}

function backToMenu() {
    showScreen('menu');
}

// ========== PIRATE GAME ==========
function resetPirate() {
    pirateSlot = Math.floor(Math.random() * 8);
    usedSlots = [];

    document.getElementById('pirate').textContent = '😴';
    document.getElementById('pirate').classList.remove('scale-150', 'rotate-12');
    document.getElementById('pirate-message').innerHTML = '<i class="fas fa-skull-crossbones mr-2"></i>เสียบดาบทีละอัน... ระวังโจรสลัดโผล่!';
    document.getElementById('pirate-message').className = 'text-center text-2xl text-white mb-6 min-h-16 flex items-center justify-center';

    document.querySelectorAll('.slot-hole').forEach((slot) => {
        slot.classList.remove('used');
        slot.disabled = false;
    });
}

function insertSword(slotIndex) {
    if (usedSlots.includes(slotIndex)) return;

    usedSlots.push(slotIndex);
    const slotButton = document.querySelectorAll('.slot-hole')[slotIndex];
    slotButton.classList.add('used');
    slotButton.disabled = true;

    // Sound effect simulation
    const pirate = document.getElementById('pirate');

    if (slotIndex === pirateSlot) {
        // Hit the pirate!
        pirate.textContent = '😱';
        pirate.classList.add('scale-150', 'rotate-12');
        document.getElementById('pirate-message').innerHTML = `
            <div class="text-red-500 font-bold text-3xl animate-pulse">
                💥 โจรสลัดโผล่! ดื่ม! 🍺
            </div>
        `;
        document.getElementById('pirate-message').className = 'text-center text-2xl mb-6 min-h-16 flex items-center justify-center glow';

        // Disable all slots
        document.querySelectorAll('.slot-hole').forEach(slot => {
            slot.disabled = true;
        });

        // Confetti effect
        createConfetti('💀', '🏴‍☠️', '💥');
    } else {
        // Safe!
        document.getElementById('pirate-message').innerHTML = `
            <div class="text-green-400 font-bold">
                ✅ ปลอดภัย! (${usedSlots.length}/8)
            </div>
        `;

        // Win if all safe slots are used
        if (usedSlots.length === 7) {
            pirate.textContent = '😅';
            document.getElementById('pirate-message').innerHTML = `
                <div class="text-yellow-400 font-bold text-3xl">
                    🎉 ปลอดภัยทั้งหมด! ไม่ต้องดื่ม!
                </div>
            `;
            createConfetti('🎊', '🎉', '✨');
        }
    }
}

// ========== CROCODILE GAME ==========
function resetCrocodile() {
    badTooth = Math.floor(Math.random() * 12);
    usedTeeth = [];

    document.getElementById('crocodile').textContent = '🐊';
    document.getElementById('crocodile').classList.remove('bite');
    document.getElementById('croc-message').innerHTML = '<i class="fas fa-tooth mr-2"></i>กดฟันทีละอัน... อย่าให้ปากกัด!';
    document.getElementById('croc-message').className = 'text-center text-2xl text-white mb-6 min-h-16 flex items-center justify-center';

    document.querySelectorAll('.tooth-btn').forEach(tooth => {
        tooth.classList.remove('pressed');
        tooth.disabled = false;
    });
}

function pressTooth(toothIndex) {
    if (usedTeeth.includes(toothIndex)) return;

    usedTeeth.push(toothIndex);
    const toothButton = document.querySelectorAll('.tooth-btn')[toothIndex];
    toothButton.classList.add('pressed');
    toothButton.disabled = true;

    const croc = document.getElementById('crocodile');

    if (toothIndex === badTooth) {
        // Bite!
        croc.textContent = '😠';
        croc.classList.add('bite');
        document.getElementById('croc-message').innerHTML = `
            <div class="text-red-500 font-bold text-3xl animate-pulse">
                💥 ปากกัด! ดื่ม! 🍺
            </div>
        `;
        document.getElementById('croc-message').className = 'text-center text-2xl mb-6 min-h-16 flex items-center justify-center glow';

        // Disable all teeth
        document.querySelectorAll('.tooth-btn').forEach(tooth => {
            tooth.disabled = true;
        });

        createConfetti('🐊', '💥', '😱');
    } else {
        // Safe!
        document.getElementById('croc-message').innerHTML = `
            <div class="text-green-400 font-bold">
                ✅ ปลอดภัย! (${usedTeeth.length}/12)
            </div>
        `;

        // Win if all safe teeth are pressed
        if (usedTeeth.length === 11) {
            croc.textContent = '😴';
            document.getElementById('croc-message').innerHTML = `
                <div class="text-yellow-400 font-bold text-3xl">
                    🎉 ปลอดภัยทั้งหมด! ไม่ต้องดื่ม!
                </div>
            `;
            createConfetti('🎊', '🎉', '✨');
        }
    }
}

// ========== CARD GAME ==========
function createDeck() {
    const deck = [];
    for (const [suitKey, suit] of Object.entries(suits)) {
        for (const value of values) {
            deck.push({
                suit: suitKey,
                value: value,
                symbol: suit.symbol,
                color: suit.color
            });
        }
    }
    return deck;
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function resetCards() {
    cardDeck = shuffleArray(createDeck());
    usedCards = 0;

    document.getElementById('card-count').textContent = cardDeck.length;
    document.getElementById('drawn-card-container').innerHTML = `
        <div class="text-white/60 text-2xl text-center">
            <i class="fas fa-hand-pointer text-4xl mb-4"></i>
            <p>👆 แตะกองไพ่เพื่อจั่วการ์ด</p>
        </div>
    `;
}

function drawCard() {
    if (usedCards >= cardDeck.length) {
        alert('ไพ่หมดแล้ว! กดปุ่มสับไพ่ใหม่');
        return;
    }

    const card = cardDeck[usedCards];
    usedCards++;

    document.getElementById('card-count').textContent = cardDeck.length - usedCards;

    // Get random action for this card
    const actions = cardActions[card.value];
    const action = actions[Math.floor(Math.random() * actions.length)];

    // Animate card flip
    const container = document.getElementById('drawn-card-container');
    container.innerHTML = `
        <div class="card-flip flipped">
            <div class="card-flip-inner">
                <!-- Card Front (back design) -->
                <div class="card-front">
                    <div class="playing-card bg-gradient-to-br from-red-900 to-red-700">
                        <div class="text-white text-6xl">🃏</div>
                    </div>
                </div>

                <!-- Card Back (actual card) -->
                <div class="card-back">
                    <div class="playing-card transform hover:scale-105 transition-transform">
                        <!-- Top left corner -->
                        <div class="${card.color}">
                            <div class="card-value">${card.value}</div>
                            <div class="text-4xl">${card.symbol}</div>
                        </div>

                        <!-- Center suit symbol -->
                        <div class="card-suit ${card.color}">
                            ${card.symbol}
                        </div>

                        <!-- Bottom right corner (rotated) -->
                        <div class="${card.color} transform rotate-180">
                            <div class="card-value">${card.value}</div>
                            <div class="text-4xl">${card.symbol}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Display -->
        <div class="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto">
            <div class="text-yellow-400 font-bold text-2xl mb-4">
                ${getCardName(card.value)}
            </div>
            <div class="text-white text-xl mb-4">
                ${action}
            </div>
            <div class="text-white/60 text-sm">
                <i class="fas fa-info-circle mr-2"></i>
                ${card.value} of ${suits[card.suit].name}
            </div>
        </div>
    `;

    // Play flip animation
    setTimeout(() => {
        const flipCard = container.querySelector('.card-flip');
        if (flipCard) {
            flipCard.classList.add('flipped');
        }
    }, 100);
}

function getCardName(value) {
    const names = {
        'A': 'ACE - เอซ',
        'J': 'JACK - แจ็ค',
        'Q': 'QUEEN - ควีน',
        'K': 'KING - คิง'
    };
    return names[value] || value;
}

// ========== CONFETTI EFFECT ==========
function createConfetti(...emojis) {
    const container = document.body;

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-50px';
        confetti.style.fontSize = (Math.random() * 30 + 20) + 'px';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.transition = 'all 3s ease-out';

        container.appendChild(confetti);

        setTimeout(() => {
            confetti.style.top = '100vh';
            confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
            confetti.style.opacity = '0';
        }, 100);

        setTimeout(() => {
            confetti.remove();
        }, 3100);
    }
}

// ========== INITIALIZATION ==========
window.addEventListener('load', () => {
    showScreen('menu');
    resetCards();
});
