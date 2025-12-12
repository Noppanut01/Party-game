// ตัวแปรเกม
let currentScreen = 'menu';
let pirateSlot = -1;
let usedSlots = [];
let badTooth = -1;
let usedTeeth = [];
let cardDeck = [];
let usedCards = 0;

// ฟังก์ชันเปลี่ยนหน้าจอ
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

// ========== เกมโจรสลัด ==========
function resetPirate() {
    pirateSlot = Math.floor(Math.random() * 8);
    usedSlots = [];

    document.getElementById('pirate').textContent = '😴';
    document.getElementById('pirate').classList.remove('pop');
    document.getElementById('pirate-message').textContent = 'เสียบดาบทีละอัน... ระวังโจรสลัดโผล่!';
    document.getElementById('pirate-message').classList.remove('warning');

    document.querySelectorAll('.slot').forEach((slot, index) => {
        slot.classList.remove('used');
        slot.disabled = false;
    });
}

function insertSword(slotIndex) {
    if (usedSlots.includes(slotIndex)) return;

    usedSlots.push(slotIndex);
    const slotButton = document.querySelectorAll('.slot')[slotIndex];
    slotButton.classList.add('used');
    slotButton.disabled = true;

    if (slotIndex === pirateSlot) {
        // โดนโจรสลัด!
        document.getElementById('pirate').textContent = '😱';
        document.getElementById('pirate').classList.add('pop');
        document.getElementById('pirate-message').textContent = '💥 โจรสลัดโผล่! ดื่ม! 🍺';
        document.getElementById('pirate-message').classList.add('warning');

        // ปิดปุ่มทั้งหมด
        document.querySelectorAll('.slot').forEach(slot => {
            slot.disabled = true;
        });
    } else {
        // ปลอดภัย
        document.getElementById('pirate-message').textContent = `✅ ปลอดภัย! (${usedSlots.length}/8)`;

        // ชนะถ้าเสียบครบ 7 อัน (เว้นอันที่เป็นโจร)
        if (usedSlots.length === 7) {
            document.getElementById('pirate').textContent = '😅';
            document.getElementById('pirate-message').textContent = '🎉 ปลอดภัยทั้งหมด! ไม่ต้องดื่ม!';
            document.getElementById('pirate-message').classList.add('warning');
        }
    }
}

// ========== เกมจระเข้ ==========
function resetCrocodile() {
    badTooth = Math.floor(Math.random() * 12);
    usedTeeth = [];

    document.querySelector('.croc-head').textContent = '🐊';
    document.querySelector('.croc-head').classList.remove('bite');
    document.getElementById('croc-message').textContent = 'กดฟันทีละอัน... อย่าให้ปากกัด!';
    document.getElementById('croc-message').classList.remove('warning');

    document.querySelectorAll('.tooth').forEach(tooth => {
        tooth.classList.remove('pressed');
        tooth.disabled = false;
    });
}

function pressTooth(toothIndex) {
    if (usedTeeth.includes(toothIndex)) return;

    usedTeeth.push(toothIndex);
    const toothButton = document.querySelectorAll('.tooth')[toothIndex];
    toothButton.classList.add('pressed');
    toothButton.disabled = true;

    if (toothIndex === badTooth) {
        // โดนกัด!
        document.querySelector('.croc-head').textContent = '😠';
        document.querySelector('.croc-head').classList.add('bite');
        document.getElementById('croc-message').textContent = '💥 ปากกัด! ดื่ม! 🍺';
        document.getElementById('croc-message').classList.add('warning');

        // ปิดปุ่มทั้งหมด
        document.querySelectorAll('.tooth').forEach(tooth => {
            tooth.disabled = true;
        });
    } else {
        // ปลอดภัย
        document.getElementById('croc-message').textContent = `✅ ปลอดภัย! (${usedTeeth.length}/12)`;

        // ชนะถ้ากดครบ 11 อัน
        if (usedTeeth.length === 11) {
            document.querySelector('.croc-head').textContent = '😴';
            document.getElementById('croc-message').textContent = '🎉 ปลอดภัยทั้งหมด! ไม่ต้องดื่ม!';
            document.getElementById('croc-message').classList.add('warning');
        }
    }
}

// ========== เกมไพ่ปาร์ตี้ ==========
const partyCards = {
    truth: [
        'เล่าความลับที่ไม่เคยบอกใคร',
        'บอกคนที่ชอบในวงนี้ (ถ้ามี)',
        'เรื่องอายที่สุดในชีวิตคืออะไร?',
        'เคยโกหกคนในวงนี้มั้ย? เรื่องอะไร?',
        'สิ่งที่กลัวที่สุดในชีวิตคืออะไร?',
        'เคยแอบชอบเพื่อนคนนี้มั้ย?',
        'โกหกครั้งสุดท้ายคือเมื่อไหร่?',
        'สิ่งที่เสียใจที่สุดในชีวิตคืออะไร?',
        'เคยทำอะไรที่ผิดกฎหมายมั้ย?',
        'เคยทำให้คนอื่นร้องไห้มั้ย?'
    ],
    dare: [
        'โทรหาคนที่กำลังคิดถึงตอนนี้',
        'ส่งข้อความหาแฟนเก่า',
        'เต้นในที่สาธารณะ 30 วินาที',
        'กินพริกดิบ 1 เม็ด',
        'ทำท่าตลก 5 ท่า',
        'ร้องเพลงดังๆ 1 เพลง',
        'แปรงฟันด้วยน้ำปลา',
        'ลบโพสต์ล่าสุดบน Instagram',
        'ส่งข้อความหาคนสุ่มในเบอร์ว่า "คิดถึง"',
        'ทำท่าโยคะ 3 ท่า'
    ],
    drink: [
        'ดื่ม 1 shot',
        'ดื่ม 2 shots',
        'ดื่ม 3 shots',
        'แจกให้คนอื่นดื่ม 2 shots',
        'เลือกคน 2 คนดื่มด้วยกัน',
        'ดื่มแก้วทั้งแก้ว',
        'ดื่มพร้อมกับคนทางซ้าย',
        'ดื่มพร้อมกับคนทางขวา',
        'ทุกคนในวงดื่ม!',
        'ดื่มแล้วจูบมือคนทางขวา'
    ],
    game: [
        'นับเลข 1-20 สลับกันทีละคน พูดพร้อมกันต้องดื่ม',
        'เล่นเกม ใครพูดช้าสุดดื่ม: ตั้งชื่อ 5 แบรนด์รถยนต์',
        'เล่นเกม ใครพูดช้าสุดดื่ม: ตั้งชื่อ 5 ประเทศในเอเชีย',
        'Rock Paper Scissors - คนแพ้ดื่ม',
        'เดาคำ: คนอื่นให้คำใบ้ 3 ข้อ ถ้าเดาถูกให้คนอื่นดื่ม',
        'เล่น Thumb Master: วางนิ้วหัวแม่มือบนโต๊ะ คนสุดท้ายดื่ม',
        'เล่นคีม้าคีมงู ใครแพ้ดื่ม',
        'ทุกคนเต้นตามเพลง คนเต้นแย่สุดดื่ม',
        'แข่งถอดเสื้อผ้า (ถุงเท้า รองเท้า) คนช้าสุดดื่ม',
        'เล่น 5 วินาทีชาเลนจ์ - ตั้งชื่อเพลงของ BTS 3 เพลง'
    ]
};

function resetCards() {
    cardDeck = [];
    usedCards = 0;

    // สร้างสำรับไพ่
    Object.keys(partyCards).forEach(type => {
        partyCards[type].forEach(text => {
            cardDeck.push({ type, text });
        });
    });

    // สับไพ่
    cardDeck = shuffleArray(cardDeck);

    document.getElementById('card-count').textContent = cardDeck.length;
    document.getElementById('drawn-card').innerHTML = `
        <div class="card-content">
            <div class="card-icon">👆</div>
            <div class="card-text">แตะกองไพ่เพื่อจั่ว!</div>
        </div>
    `;
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function drawCard() {
    if (usedCards >= cardDeck.length) {
        alert('ไพ่หมดแล้ว! กดปุ่มสับไพ่ใหม่');
        return;
    }

    const card = cardDeck[usedCards];
    usedCards++;

    document.getElementById('card-count').textContent = cardDeck.length - usedCards;

    const icons = {
        truth: '💭',
        dare: '🔥',
        drink: '🍺',
        game: '🎮'
    };

    const names = {
        truth: 'TRUTH',
        dare: 'DARE',
        drink: 'DRINK',
        game: 'MINI GAME'
    };

    document.getElementById('drawn-card').innerHTML = `
        <div class="card-content">
            <div class="card-icon">${icons[card.type]}</div>
            <div class="card-type ${card.type}">${names[card.type]}</div>
            <div class="card-text">${card.text}</div>
        </div>
    `;
}

// เริ่มต้น
window.addEventListener('load', () => {
    showScreen('menu');
});
