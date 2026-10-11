import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

const rooms = new Map();

const BOT_NAMES = [
  { name: 'Dayı Osman', icon: '👴' },
  { name: 'Çaycı Rüstem', icon: '☕' },
  { name: 'Emekli Veli Bey', icon: '👓' },
  { name: 'Taksici Şaban', icon: '🚕' },
  { name: 'Muhtar Remzi', icon: '🎩' },
  { name: 'Öğrenci Barış', icon: '🎒' },
];

const AVATAR_ICONS = ['🧔', '👴', '☕', '👓', '🎩', '🎲', '📿', '🥐', '🚕', '🧿', '🥤', '🥪', '👑', '🦁', '🧢', '🥸', '🫖', '🏆'];

function generateRoomCode() {
  let code = '';
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (rooms.has(code));
  return code;
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCoffeehouseBill(room, loserName) {
  const playerCount = room.players.length;
  const turnsCount = room.guessHistory.length;
  const teaCount = Math.max(playerCount * 3 + Math.floor(turnsCount * 0.8), 8);
  const coffeeCount = Math.max(Math.floor(playerCount * 1.5), 3);
  const oraletCount = Math.floor(playerCount * 0.7) + 2;
  const sodaCount = Math.max(Math.floor(playerCount * 0.5), 2);
  const toastCount = Math.max(Math.floor(playerCount * 0.4), 1);

  const items = [
    { title: 'Tavşan Kanı Çay (Demli İnce Belli)', count: teaCount, price: 15, total: teaCount * 15 },
    { title: 'Bol Köpüklü Sade Türk Kahvesi', count: coffeeCount, price: 45, total: coffeeCount * 45 },
    { title: 'Kivi & Portakal Oralet Duble', count: oraletCount, price: 20, total: oraletCount * 20 },
    { title: 'Beypazarı Maden Suyu', count: sodaCount, price: 25, total: sodaCount * 25 },
    { title: 'Kaşarlı Sucuklu Tost (Kıraathane Usulü)', count: toastCount, price: 90, total: toastCount * 90 },
    { title: 'Tavla & Okey Masa Kirası', count: 1, price: 75, total: 75 },
    { title: 'Çaycı Bahşişi & Küllük Hizmeti', count: 1, price: 50, total: 50 },
  ];

  const totalAmount = items.reduce((acc, curr) => acc + curr.total, 0);
  const tip = 35;
  const grandTotal = totalAmount + tip;

  return {
    items,
    totalAmount,
    tip,
    grandTotal,
  };
}

const TURKISH_LOCATIONS = [
  'Kadıköy', 'Beşiktaş', 'Üsküdar', 'Beyoğlu', 'Fatih', 'Bakırköy', 'Şişli', 'Sarıyer',
  'Çorlu', 'Tekirdağ', 'Edirne', 'Kırklareli',
  'Bornova', 'Karşıyaka', 'Konak', 'Alsancak', 'Buca', 'Göztepe',
  'Çankaya', 'Kızılay', 'Keçiören', 'Yenimahalle', 'Mamak',
  'Bursa Nilüfer', 'Osmangazi', 'Yıldırım',
  'Antalya Muratpaşa', 'Konyaaltı', 'Alanya',
  'Eskişehir Tepebaşı', 'Odunpazarı',
  'Trabzon Ortahisar', 'Samsun Atakum', 'Gaziantep Şahinbey',
  'Adana Seyhan', 'Çukurova', 'Mersin Yenişehir', 'Kayseri Melikgazi',
  'Konya Selçuklu', 'Denizli Pamukkale', 'Muğla Bodrum'
];

const CAFE_SUFFIXES = [
  'Merkez Kıraathanesi',
  'Çınaraltı Çay Ocağı',
  'Dostlar Kıraathanesi',
  'Esnaf Çay Bahçesi',
  'Kardeşler Kahvehanesi',
  'Güven Aile Kıraathanesi',
  'Hilal Çay Ocağı',
  'Emekçiler Kahvesi',
  'Huzur Kıraathanesi',
  'Yıldız Çay Evi',
  'Bizim Kıraathane',
  'Tarihi Taş Mektep Kahvesi',
  'Müdavimler Çay Ocağı',
  'Şafak Kıraathanesi',
  'Gönüldaşlar Kahvehanesi'
];

function generateCafeInfo(customLocation) {
  const loc = (customLocation && customLocation.trim().length > 1)
    ? customLocation.trim()
    : getRandomItem(TURKISH_LOCATIONS);
  
  const suffix = getRandomItem(CAFE_SUFFIXES);
  const cafeName = `${loc.toLocaleUpperCase('tr-TR')} ${suffix.toLocaleUpperCase('tr-TR')}`;
  const tableNo = Math.floor(1 + Math.random() * 12);
  return { cafeName, locationName: loc, tableNo };
}

function sanitizeRoomForClient(room, clientPlayerId) {
  return {
    code: room.code,
    cafeName: room.cafeName,
    tableNo: room.tableNo,
    locationName: room.locationName,
    phase: room.phase,
    currentTurnIndex: room.currentTurnIndex,
    currentTurnPlayer: room.players[room.currentTurnIndex]
      ? {
          id: room.players[room.currentTurnIndex].id,
          name: room.players[room.currentTurnIndex].name,
          isBot: room.players[room.currentTurnIndex].isBot,
        }
      : null,
    pickedNumbers: room.pickedNumbers,
    guessHistory: room.guessHistory,
    loser: room.loser
      ? {
          id: room.loser.id,
          name: room.loser.name,
          isBot: room.loser.isBot,
          secretNumber: room.loser.secretNumber,
          avatarIcon: room.loser.avatarIcon,
        }
      : null,
    bill: room.bill,
    roundCount: room.roundCount,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      hasSelectedSecret: p.hasSelectedSecret,
      secretNumber:
        room.phase === 'GAME_OVER' || p.id === clientPlayerId || p.isSafe
          ? p.secretNumber
          : null,
      isSafe: p.isSafe,
      isBot: p.isBot,
      connected: p.connected,
      avatarIcon: p.avatarIcon,
    })),
  };
}

function broadcastRoom(room) {
  room.players.forEach((player) => {
    if (!player.isBot && player.connected) {
      io.to(player.id).emit('room_state', sanitizeRoomForClient(room, player.id));
    }
  });
}

function getNextActiveTurnIndex(room, startIndex) {
  const count = room.players.length;
  if (count === 0) return 0;
  for (let step = 1; step <= count; step++) {
    const nextIdx = (startIndex + step) % count;
    const player = room.players[nextIdx];
    if (player && !player.isSafe && player.connected) {
      return nextIdx;
    }
  }
  return startIndex;
}

function scheduleBotTurnIfNeeded(room) {
  if (room.phase !== 'PLAYING') return;

  const currentPlayer = room.players[room.currentTurnIndex];
  if (!currentPlayer || !currentPlayer.isBot || currentPlayer.isSafe) {
    return;
  }

  if (room.botTimeout) {
    clearTimeout(room.botTimeout);
  }

  const delay = Math.floor(1200 + Math.random() * 800);
  room.botTimeout = setTimeout(() => {
    executeBotGuess(room, currentPlayer);
  }, delay);
}

function executeBotGuess(room, botPlayer) {
  if (room.phase !== 'PLAYING') return;
  if (room.players[room.currentTurnIndex]?.id !== botPlayer.id) return;

  const availableNumbers = [];
  for (let n = 1; n <= 31; n++) {
    if (!room.pickedNumbers.includes(n)) {
      if (n !== botPlayer.secretNumber) {
        availableNumbers.push(n);
      }
    }
  }

  if (availableNumbers.length === 0) {
    for (let n = 1; n <= 31; n++) {
      if (!room.pickedNumbers.includes(n)) {
        availableNumbers.push(n);
      }
    }
  }

  if (availableNumbers.length === 0) return;

  const chosenNumber = getRandomItem(availableNumbers);
  processGuess(room, botPlayer, chosenNumber);
}

function processGuess(room, guessingPlayer, guessedNumber) {
  if (room.phase !== 'PLAYING') return;
  if (room.pickedNumbers.includes(guessedNumber)) return;

  room.pickedNumbers.push(guessedNumber);

  const savedPlayers = [];
  room.players.forEach((p) => {
    if (!p.isSafe && p.secretNumber === guessedNumber) {
      p.isSafe = true;
      savedPlayers.push(p);
    }
  });

  const record = {
    number: guessedNumber,
    guessedBy: guessingPlayer.name,
    savedPlayers: savedPlayers.map((p) => p.name),
    timestamp: Date.now(),
  };
  room.guessHistory.unshift(record);

  io.to(room.code).emit('guess_result', {
    number: guessedNumber,
    guessedBy: guessingPlayer.name,
    savedPlayers: savedPlayers.map((p) => ({ id: p.id, name: p.name })),
    isHit: savedPlayers.length > 0,
  });

  const remainingActivePlayers = room.players.filter((p) => !p.isSafe);

  if (remainingActivePlayers.length <= 1) {
    room.phase = 'GAME_OVER';
    if (remainingActivePlayers.length === 1) {
      room.loser = remainingActivePlayers[0];
    } else {
      room.loser = guessingPlayer;
    }

    room.bill = generateCoffeehouseBill(room, room.loser ? room.loser.name : 'Masa');

    io.to(room.code).emit('game_over', {
      loser: room.loser,
      bill: room.bill,
    });

    broadcastRoom(room);
    return;
  }

  room.currentTurnIndex = getNextActiveTurnIndex(room, room.currentTurnIndex);
  broadcastRoom(room);

  scheduleBotTurnIfNeeded(room);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size });
});

io.on('connection', (socket) => {
  let currentRoomCode = null;

  socket.on('create_room', ({ playerName, locationName, avatarIcon }) => {
    const trimmedName = (playerName || 'Misafir').trim().slice(0, 18);
    const roomCode = generateRoomCode();
    const cafeInfo = generateCafeInfo(locationName);
    const chosenAvatar = (avatarIcon && typeof avatarIcon === 'string' && avatarIcon.trim())
      ? avatarIcon.trim().slice(0, 4)
      : getRandomItem(AVATAR_ICONS);

    const hostPlayer = {
      id: socket.id,
      name: trimmedName,
      isHost: true,
      secretNumber: null,
      hasSelectedSecret: false,
      isSafe: false,
      isBot: false,
      connected: true,
      avatarIcon: chosenAvatar,
    };

    const room = {
      code: roomCode,
      cafeName: cafeInfo.cafeName,
      tableNo: cafeInfo.tableNo,
      locationName: cafeInfo.locationName,
      phase: 'LOBBY',
      players: [hostPlayer],
      currentTurnIndex: 0,
      pickedNumbers: [],
      guessHistory: [],
      loser: null,
      bill: null,
      roundCount: 1,
      createdAt: Date.now(),
    };

    rooms.set(roomCode, room);
    currentRoomCode = roomCode;
    socket.join(roomCode);

    socket.emit('room_created', {
      roomCode,
      playerId: socket.id,
      cafeName: room.cafeName,
      tableNo: room.tableNo,
      locationName: room.locationName,
    });

    broadcastRoom(room);
  });

  socket.on('change_cafe_name', ({ roomCode, locationName }) => {
    const room = rooms.get(roomCode);
    if (!room || room.phase !== 'LOBBY') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;
    const cafeInfo = generateCafeInfo(locationName);
    room.cafeName = cafeInfo.cafeName;
    room.locationName = cafeInfo.locationName;
    room.tableNo = cafeInfo.tableNo;
    broadcastRoom(room);
  });

  socket.on('change_avatar', ({ roomCode, avatarIcon }) => {
    const room = rooms.get(roomCode);
    if (!room || room.phase !== 'LOBBY') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;
    if (avatarIcon && typeof avatarIcon === 'string' && avatarIcon.trim()) {
      player.avatarIcon = avatarIcon.trim().slice(0, 4);
      broadcastRoom(room);
    }
  });

  socket.on('join_room', ({ playerName, roomCode, avatarIcon }) => {
    const trimmedCode = (roomCode || '').trim();
    const trimmedName = (playerName || 'Misafir').trim().slice(0, 18);

    const room = rooms.get(trimmedCode);
    if (!room) {
      socket.emit('error_message', 'Masa bulunamadı! 4 haneli masa kodunu kontrol ediniz.');
      return;
    }

    if (room.phase !== 'LOBBY') {
      const existing = room.players.find((p) => p.name.toLowerCase() === trimmedName.toLowerCase() && !p.connected);
      if (existing) {
        existing.id = socket.id;
        existing.connected = true;
        currentRoomCode = trimmedCode;
        socket.join(trimmedCode);
        socket.emit('room_joined', { roomCode: trimmedCode, playerId: socket.id });
        broadcastRoom(room);
        return;
      }

      socket.emit('error_message', 'Bu masada oyun halihazırda başlamış!');
      return;
    }

    if (room.players.length >= 10) {
      socket.emit('error_message', 'Masa dolu! (En fazla 10 kişi)');
      return;
    }

    const chosenAvatar = (avatarIcon && typeof avatarIcon === 'string' && avatarIcon.trim())
      ? avatarIcon.trim().slice(0, 4)
      : getRandomItem(AVATAR_ICONS);

    const newPlayer = {
      id: socket.id,
      name: trimmedName,
      isHost: false,
      secretNumber: null,
      hasSelectedSecret: false,
      isSafe: false,
      isBot: false,
      connected: true,
      avatarIcon: chosenAvatar,
    };

    room.players.push(newPlayer);
    currentRoomCode = trimmedCode;
    socket.join(trimmedCode);

    socket.emit('room_joined', {
      roomCode: trimmedCode,
      playerId: socket.id,
    });

    broadcastRoom(room);
  });

  socket.on('add_bot', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.phase !== 'LOBBY') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;
    if (room.players.length >= 10) return;

    const existingBotNames = new Set(room.players.filter((p) => p.isBot).map((p) => p.name));
    const availableBots = BOT_NAMES.filter((b) => !existingBotNames.has(b.name));
    const botTemplate = availableBots.length > 0 ? availableBots[0] : { name: `Müdavim ${room.players.length}`, icon: '🧔' };

    const botPlayer = {
      id: `bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: botTemplate.name,
      isHost: false,
      secretNumber: null,
      hasSelectedSecret: false,
      isSafe: false,
      isBot: true,
      connected: true,
      avatarIcon: botTemplate.icon,
    };

    room.players.push(botPlayer);
    broadcastRoom(room);
  });

  socket.on('remove_bot', ({ roomCode, botId }) => {
    const room = rooms.get(roomCode);
    if (!room || room.phase !== 'LOBBY') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;

    room.players = room.players.filter((p) => p.id !== botId);
    broadcastRoom(room);
  });

  socket.on('start_game', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.phase !== 'LOBBY') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.isHost) return;

    if (room.players.length < 2) {
      socket.emit('error_message', 'Oyunu başlatmak için en az 2 oyuncu gereklidir (Müdavim bot ekleyebilirsiniz).');
      return;
    }

    room.phase = 'SELECTING';
    room.pickedNumbers = [];
    room.guessHistory = [];
    room.loser = null;
    room.bill = null;

    room.players.forEach((p) => {
      p.isSafe = false;
      p.hasSelectedSecret = false;
      p.secretNumber = null;

      if (p.isBot) {
        p.secretNumber = Math.floor(1 + Math.random() * 31);
        p.hasSelectedSecret = true;
      }
    });

    broadcastRoom(room);
  });

  socket.on('pick_secret', ({ roomCode, number }) => {
    const room = rooms.get(roomCode);
    if (!room || room.phase !== 'SELECTING') return;

    const num = Math.floor(Number(number));
    if (isNaN(num) || num < 1 || num > 31) {
      socket.emit('error_message', 'Lütfen 1 ile 31 arasında geçerli bir numara seçiniz!');
      return;
    }

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    player.secretNumber = num;
    player.hasSelectedSecret = true;

    const allPicked = room.players.every((p) => p.hasSelectedSecret);

    if (allPicked) {
      room.phase = 'PLAYING';
      room.currentTurnIndex = Math.floor(Math.random() * room.players.length);
      room.currentTurnIndex = getNextActiveTurnIndex(room, room.currentTurnIndex - 1);

      broadcastRoom(room);
      scheduleBotTurnIfNeeded(room);
    } else {
      broadcastRoom(room);
    }
  });

  socket.on('guess_number', ({ roomCode, number }) => {
    const room = rooms.get(roomCode);
    if (!room || room.phase !== 'PLAYING') return;

    const currentPlayer = room.players[room.currentTurnIndex];
    if (!currentPlayer || currentPlayer.id !== socket.id) {
      socket.emit('error_message', 'Şu an sizin sıranız değil!');
      return;
    }

    const num = Math.floor(Number(number));
    if (isNaN(num) || num < 1 || num > 31) {
      socket.emit('error_message', '1-31 arası geçerli bir sayı giriniz!');
      return;
    }

    if (room.pickedNumbers.includes(num)) {
      socket.emit('error_message', 'Bu numara zaten söylendi!');
      return;
    }

    if (currentPlayer.secretNumber === num) {
      socket.emit('error_message', 'Kendi numaranızı söyleyemezsiniz! Başkalarının sizi kurtarması lazım.');
      return;
    }

    processGuess(room, currentPlayer, num);
  });

  socket.on('rematch', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.phase = 'SELECTING';
    room.roundCount += 1;
    room.pickedNumbers = [];
    room.guessHistory = [];
    room.loser = null;
    room.bill = null;

    room.players.forEach((p) => {
      p.isSafe = false;
      p.hasSelectedSecret = false;
      p.secretNumber = null;

      if (p.isBot) {
        p.secretNumber = Math.floor(1 + Math.random() * 31);
        p.hasSelectedSecret = true;
      }
    });

    broadcastRoom(room);
  });

  socket.on('send_chat', ({ roomCode, text }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    const cleanText = (text || '').trim().slice(0, 80);
    if (!cleanText) return;

    io.to(roomCode).emit('chat_broadcast', {
      senderName: player.name,
      avatarIcon: player.avatarIcon,
      text: cleanText,
      timestamp: Date.now(),
    });
  });

  socket.on('disconnect', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (player) {
      player.connected = false;

      if (room.phase === 'LOBBY') {
        if (player.isHost) {
          const nextHuman = room.players.find((p) => p.id !== player.id && !p.isBot && p.connected);
          if (nextHuman) {
            nextHuman.isHost = true;
          }
        }
        room.players = room.players.filter((p) => p.id !== socket.id);
      } else if (room.phase === 'PLAYING') {
        if (room.players[room.currentTurnIndex]?.id === socket.id) {
          room.currentTurnIndex = getNextActiveTurnIndex(room, room.currentTurnIndex);
          scheduleBotTurnIfNeeded(room);
        }
      }

      const anyHumansLeft = room.players.some((p) => !p.isBot && p.connected);
      if (!anyHumansLeft) {
        if (room.botTimeout) clearTimeout(room.botTimeout);
        rooms.delete(currentRoomCode);
      } else {
        broadcastRoom(room);
      }
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Kahvehane 31 Oyunu Sunucusu ${PORT} portunda çalışıyor.`);
});
