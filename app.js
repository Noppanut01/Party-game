// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBvH8Y_Xm5fZ0qGxKj8dKp4Qq4uQ5x5Y5Y",
    authDomain: "party-poker-game.firebaseapp.com",
    projectId: "party-poker-game",
    storageBucket: "party-poker-game.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Note: ใช้ Firebase ของคุณเองได้ที่ https://console.firebase.google.com

// Initialize Firebase
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
} catch (error) {
    console.log("Firebase initialization error:", error);
}

// Game State
let currentRoomCode = null;
let currentPlayerId = null;
let currentPlayerName = null;
let roomListener = null;
let currentDeck = [];

// Card Data
const suits = {
    hearts: { symbol: '♥', color: 'red-card' },
    diamonds: { symbol: '♦', color: 'red-card' },
    clubs: { symbol: '♣', color: 'black-card' },
    spades: { symbol: '♠', color: 'black-card' }
};

const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const cardActions = {
    'A': ['ดื่ม 1 shot', 'แจกให้คนอื่น 2 shots', 'เล่นเกมนับเลข 1-21'],
    '2': ['ดื่ม 2 shots', 'คนทางซ้ายดื่ม 2 shots', 'คนอายุน้อยสุดดื่ม'],
    '3': ['ดื่ม 3 shots', 'แจกให้ 3 คนดื่มคนละ shot', 'ทุกคนดื่ม 1 shot'],
    '4': ['ตอบคำถาม Truth', 'ทำท่า 4 ท่า', 'Rock Paper Scissors'],
    '5': ['คนทางขวาดื่ม 2 shots', 'โทรหาคนที่คิดถึง', 'ร้องเพลง 1 เพลง'],
    '6': ['ผู้ชายทุกคนดื่ม', 'กำหนดกฎใหม่', 'Thumb Master'],
    '7': ['คนสูงสุดดื่ม', 'ชี้ท้องฟ้า คนสุดท้ายดื่ม', 'เลือก 2 คนจูบแก้ม'],
    '8': ['เลือก Drinking Buddy', 'ส่งข้อความแฟนเก่า', 'เต้น 30 วินาที'],
    '9': ['ผู้หญิงทุกคนดื่ม', 'Rhyme Time', 'Categories'],
    '10': ['Master - คุณเป็นนาย', 'Never Have I Ever', 'ท่าโยคะ 3 ท่า'],
    'J': ['Question Master', 'เลือก 3 คนดื่ม', 'กำหนดท่าเต้น'],
    'Q': ['ทำให้ทุกคนหัวเราะ', 'ลบโพสต์ Instagram', 'กษัตริย์บอก'],
    'K': ['King\'s Cup - เทลงแก้วกลาง!', 'Make a Rule!', 'K สุดท้ายดื่มแก้วกลาง!']
};

// ========== NAVIGATION ==========
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenName + '-screen').classList.add('active');
}

function showHome() {
    if (roomListener) {
        roomListener();
        roomListener = null;
    }
    currentRoomCode = null;
    currentPlayerId = null;
    showScreen('home');
}

function showCreateRoom() {
    showScreen('create-room');
}

function showJoinRoom() {
    showScreen('join-room');
}

// ========== ROOM FUNCTIONS ==========
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

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

async function createRoom() {
    const nameInput = document.getElementById('create-name-input');
    const playerName = nameInput.value.trim();

    if (!playerName) {
        alert('กรุณาใส่ชื่อของคุณ');
        return;
    }

    if (!db) {
        alert('ไม่สามารถเชื่อมต่อกับ Firebase ได้\nกรุณาตรวจสอบการตั้งค่า Firebase');
        return;
    }

    const roomCode = generateRoomCode();
    const playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    currentRoomCode = roomCode;
    currentPlayerId = playerId;
    currentPlayerName = playerName;

    const roomData = {
        code: roomCode,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        players: {
            [playerId]: {
                name: playerName,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                isHost: true
            }
        },
        deck: createDeck(),
        cardsDrawn: 0,
        gameLog: [{
            type: 'system',
            message: `${playerName} สร้างห้องเกม`,
            timestamp: Date.now()
        }],
        currentCard: null
    };

    try {
        await db.collection('rooms').doc(roomCode).set(roomData);
        enterGameRoom();
    } catch (error) {
        console.error('Error creating room:', error);
        alert('เกิดข้อผิดพลาดในการสร้างห้อง');
    }
}

async function joinRoom() {
    const nameInput = document.getElementById('join-name-input');
    const codeInput = document.getElementById('room-code-input');

    const playerName = nameInput.value.trim();
    const roomCode = codeInput.value.trim().toUpperCase();

    if (!playerName) {
        alert('กรุณาใส่ชื่อของคุณ');
        return;
    }

    if (!roomCode || roomCode.length !== 6) {
        alert('กรุณาใส่รหัสห้อง 6 หลัก');
        return;
    }

    if (!db) {
        alert('ไม่สามารถเชื่อมต่อกับ Firebase ได้');
        return;
    }

    const playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    try {
        const roomRef = db.collection('rooms').doc(roomCode);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
            alert('ไม่พบห้องนี้\nกรุณาตรวจสอบรหัสห้อง');
            return;
        }

        currentRoomCode = roomCode;
        currentPlayerId = playerId;
        currentPlayerName = playerName;

        await roomRef.update({
            [`players.${playerId}`]: {
                name: playerName,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                isHost: false
            },
            gameLog: firebase.firestore.FieldValue.arrayUnion({
                type: 'system',
                message: `${playerName} เข้าร่วมห้อง`,
                timestamp: Date.now()
            })
        });

        enterGameRoom();
    } catch (error) {
        console.error('Error joining room:', error);
        alert('เกิดข้อผิดพลาดในการเข้าร่วมห้อง');
    }
}

function enterGameRoom() {
    showScreen('game');
    document.getElementById('display-room-code').textContent = currentRoomCode;
    listenToRoomUpdates();
}

function listenToRoomUpdates() {
    if (!db || !currentRoomCode) return;

    roomListener = db.collection('rooms').doc(currentRoomCode)
        .onSnapshot((doc) => {
            if (!doc.exists) {
                alert('ห้องถูกลบแล้ว');
                showHome();
                return;
            }

            const data = doc.data();
            updatePlayersDisplay(data.players);
            updateDeckDisplay(data.deck, data.cardsDrawn);
            updateGameLog(data.gameLog);

            if (data.currentCard) {
                displayCurrentCard(data.currentCard);
            }

            currentDeck = data.deck || [];
        });
}

function updatePlayersDisplay(players) {
    const playersList = document.getElementById('players-list');
    const playerCount = document.getElementById('player-count');

    const playerArray = Object.entries(players).map(([id, data]) => ({
        id,
        ...data
    }));

    playerCount.textContent = `👥 ${playerArray.length}`;

    playersList.innerHTML = playerArray.map(player => `
        <div class="player-item ${player.id === currentPlayerId ? 'active' : ''}">
            <div class="player-name">
                ${player.isHost ? '👑 ' : ''}${player.name}
                ${player.id === currentPlayerId ? ' (คุณ)' : ''}
            </div>
        </div>
    `).join('');
}

function updateDeckDisplay(deck, cardsDrawn) {
    const cardsLeft = (deck?.length || 52) - (cardsDrawn || 0);
    document.getElementById('cards-left').textContent = `${cardsLeft} ใบ`;

    if (cardsLeft <= 0) {
        document.getElementById('card-deck').style.opacity = '0.5';
        document.getElementById('card-deck').style.cursor = 'not-allowed';
    } else {
        document.getElementById('card-deck').style.opacity = '1';
        document.getElementById('card-deck').style.cursor = 'pointer';
    }
}

function updateGameLog(gameLog) {
    const logContainer = document.getElementById('game-log');

    if (!gameLog || gameLog.length === 0) {
        logContainer.innerHTML = '<div class="log-item system">เริ่มเกมใหม่! 🎉</div>';
        return;
    }

    const sortedLog = [...gameLog].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    logContainer.innerHTML = sortedLog.slice(0, 50).map(log => {
        const className = log.type === 'system' ? 'log-item system' : 'log-item player';
        return `<div class="${className}">${log.message}</div>`;
    }).join('');

    logContainer.scrollTop = 0;
}

async function drawCard() {
    if (!db || !currentRoomCode || !currentPlayerId) return;

    try {
        const roomRef = db.collection('rooms').doc(currentRoomCode);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) return;

        const data = roomDoc.data();
        const deck = data.deck || [];
        const cardsDrawn = data.cardsDrawn || 0;

        if (cardsDrawn >= deck.length) {
            alert('ไพ่หมดแล้ว!');
            return;
        }

        const card = deck[cardsDrawn];
        const actions = cardActions[card.value];
        const action = actions[Math.floor(Math.random() * actions.length)];

        const cardData = {
            ...card,
            action,
            drawnBy: currentPlayerName,
            timestamp: Date.now()
        };

        await roomRef.update({
            cardsDrawn: cardsDrawn + 1,
            currentCard: cardData,
            gameLog: firebase.firestore.FieldValue.arrayUnion({
                type: 'player',
                message: `<span class="player-name-log">${currentPlayerName}</span> จั่วได้ ${card.value}${card.symbol} - ${action}`,
                timestamp: Date.now()
            })
        });

    } catch (error) {
        console.error('Error drawing card:', error);
        alert('เกิดข้อผิดพลาดในการจั่วไพ่');
    }
}

function displayCurrentCard(cardData) {
    const display = document.getElementById('current-card-display');

    if (!cardData) {
        display.style.display = 'none';
        return;
    }

    display.style.display = 'block';
    display.innerHTML = `
        <div class="drawn-card">
            <div class="card-value-display ${cardData.color}">
                ${cardData.value}
            </div>
            <div class="card-suit-display ${cardData.color}">
                ${cardData.symbol}
            </div>
            <div class="card-action">
                <div class="action-label">คำสั่ง:</div>
                <div class="action-text">${cardData.action}</div>
            </div>
        </div>
    `;
}

async function leaveRoom() {
    if (!db || !currentRoomCode || !currentPlayerId) {
        showHome();
        return;
    }

    const confirmed = confirm('คุณต้องการออกจากห้องหรือไม่?');
    if (!confirmed) return;

    try {
        const roomRef = db.collection('rooms').doc(currentRoomCode);
        const roomDoc = await roomRef.get();

        if (roomDoc.exists) {
            const data = roomDoc.data();
            const players = data.players || {};

            await roomRef.update({
                [`players.${currentPlayerId}`]: firebase.firestore.FieldValue.delete(),
                gameLog: firebase.firestore.FieldValue.arrayUnion({
                    type: 'system',
                    message: `${currentPlayerName} ออกจากห้อง`,
                    timestamp: Date.now()
                })
            });

            // If last player, delete room
            if (Object.keys(players).length <= 1) {
                await roomRef.delete();
            }
        }
    } catch (error) {
        console.error('Error leaving room:', error);
    }

    showHome();
}

function copyRoomCode() {
    const code = currentRoomCode;
    if (!code) return;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            alert(`คัดลอกรหัสห้องแล้ว: ${code}`);
        });
    } else {
        // Fallback
        const input = document.createElement('input');
        input.value = code;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert(`คัดลอกรหัสห้องแล้ว: ${code}`);
    }
}

// ========== INITIALIZATION ==========
window.addEventListener('load', () => {
    showScreen('home');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (currentRoomCode && currentPlayerId) {
        leaveRoom();
    }
});
