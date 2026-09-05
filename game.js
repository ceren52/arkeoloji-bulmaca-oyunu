const W = 880;
const H = 500;
const items = [];
const gameSection = document.querySelector('#game');
const miniMap = document.createElement('aside');
miniMap.id = 'mini-map';
miniMap.setAttribute('aria-label', 'Temple map');
miniMap.innerHTML = '<p class="mini-map-title">TEMPLE MAP</p><div class="mini-map-floor"><span class="map-exit map-exit-left"></span><span class="map-exit map-exit-middle"></span><span class="map-exit map-exit-right"></span><span class="map-room-marker">1</span></div><p class="mini-map-room">Entrance Hall <small>Current room · 1 / 4</small></p>';
gameSection?.append(miniMap);
const mapMeta = {
  entrance: { number: '1', label: 'Entrance Hall', detail: 'Current room · 1 / 4', exits: 'three' },
  maps: { number: '2', label: 'Chamber of Maps', detail: 'Current room · 2 / 4', exits: 'back' },
  seals: { number: '3', label: 'Chamber of Seals', detail: 'Current room · 3 / 4', exits: 'back' },
  archive: { number: '4', label: 'Excavation Archive', detail: 'Current room · 4 / 4', exits: 'back' }
};

function updateMiniMap(roomId) {
  const meta = mapMeta[roomId];
  if (!meta || !miniMap) return;
  const floor = miniMap.querySelector('.mini-map-floor');
  floor.innerHTML = meta.exits === 'three'
    ? '<span class="map-exit map-exit-left"></span><span class="map-exit map-exit-middle"></span><span class="map-exit map-exit-right"></span>'
    : '<span class="map-exit map-exit-middle"></span>';
  floor.insertAdjacentHTML('beforeend', '<span class="map-room-marker">' + meta.number + '</span>');
  miniMap.querySelector('.mini-map-room').innerHTML = meta.label + '<small>' + meta.detail + '</small>';
}

const clues = {
  guard: {
    atmosphere: 'A cold glint catches the torchlight.',
    detail: 'The sentinel holds the seal of the old passage. Its hands point toward a route hidden behind the stonework.'
  },
  pot: {
    atmosphere: 'Clay remembers what the room forgot.',
    detail: 'A star map is hidden inside the broken pot. The markings do not match the sky above the temple.'
  },
  shovel: {
    atmosphere: 'Fresh earth darkens the blade.',
    detail: 'The shovel is freshly used. Excavation marks lead behind the right door, where someone searched in a hurry.'
  },
  obsidian: {
    atmosphere: 'The stone drinks the light.',
    detail: 'This obsidian fragment has been cut with the same angular pattern found on the temple tablet.'
  },
  starMap: {
    atmosphere: 'The painted sky is missing one star.',
    detail: 'The mural is not a calendar. Its missing star marks a passage that only appears after the torchlight fades.'
  },
  astrolabe: {
    atmosphere: 'Bronze remembers a sky no one can see.',
    detail: 'The astrolabe is fixed to the position of a winter constellation, pointing toward the temple’s sealed route.'
  },
  sarcophagus: {
    atmosphere: 'Something shifted beneath the stone.',
    detail: 'The sarcophagus lid is not fully seated. Dust around its edge suggests it was opened recently, then closed in haste.'
  },
  ritualBowl: {
    atmosphere: 'Ash clings to the empty bowl.',
    detail: 'The bowl held resin or oil used in a sealing ritual. A faint black residue matches the marks on the central dais.'
  },
  sealCylinder: {
    atmosphere: 'A story waits inside the rolled clay.',
    detail: 'The cylinder seal shows three doors and a small figure carrying a tablet away from the sanctuary.'
  },
  tabletTray: {
    atmosphere: 'Wet clay holds a familiar handprint.',
    detail: 'The tray contains a copied tablet fragment. The brush marks belong to Uncle Elias, but the final line was deliberately erased.'
  },
  scrollCase: {
    atmosphere: 'The scroll case is warm to the touch.',
    detail: 'A half-open case contains a route ledger. One entry ends at the entrance hall, three weeks after Elias vanished.'
  },
  excavationLamp: {
    atmosphere: 'The flame bends toward the open ground.',
    detail: 'The bronze lamp is still oily. Its flame reveals a narrow trench leading under the archive’s eastern wall.'
  }
};

const rooms = {
  entrance: {
    number: 1,
    label: 'Entrance Hall',
    background: 'assets/temple-entrance.png',
    doors: [
      { x: 154, y: 272, w: 90, h: 175, label: 'Chamber of Maps', target: 'maps' },
      { x: 508, y: 270, w: 105, h: 160, label: 'Chamber of Seals', target: 'seals' },
      { x: 744, y: 285, w: 100, h: 170, label: 'Excavation Archive', target: 'archive' }
    ],
    objects: [
      { x: 323, y: 226, w: 62, h: 155, label: 'Sentinel statue', key: 'guard', icon: '🗿' },
      { x: 586, y: 330, w: 38, h: 72, label: 'Broken pot', key: 'pot', icon: '⚱' },
      { x: 825, y: 385, w: 80, h: 190, label: 'Shovel', key: 'shovel', icon: '🛠️' }
    ]
  },
  maps: {
    number: 2,
    label: 'Chamber of Maps',
    background: 'assets/chamber-maps.png',
    doors: [{ x: 76, y: 248, w: 84, h: 165, label: 'Return to Entrance Hall', target: 'entrance' }],
    objects: [
      { x: 430, y: 300, w: 72, h: 38, label: 'Obsidian fragment', key: 'obsidian', icon: '◆' },
      { x: 525, y: 145, w: 245, h: 150, label: 'Star map mural', key: 'starMap', icon: '✦' },
      { x: 760, y: 255, w: 92, h: 108, label: 'Bronze astrolabe', key: 'astrolabe', icon: '◎' }
    ]
  },
  seals: {
    number: 3,
    label: 'Chamber of Seals',
    background: 'assets/chamber-seals.png',
    doors: [{ x: 440, y: 190, w: 110, h: 150, label: 'Return to Entrance Hall', target: 'entrance' }],
    objects: [
      { x: 470, y: 282, w: 250, h: 120, label: 'Stone sarcophagus', key: 'sarcophagus', icon: '▣' },
      { x: 130, y: 335, w: 132, h: 92, label: 'Ritual bowl', key: 'ritualBowl', icon: '◉' },
      { x: 730, y: 345, w: 82, h: 105, label: 'Seal cylinder', key: 'sealCylinder', icon: '▤' }
    ]
  },
  archive: {
    number: 4,
    label: 'Excavation Archive',
    background: 'assets/excavation-archive.png',
    doors: [{ x: 835, y: 240, w: 75, h: 165, label: 'Return to Entrance Hall', target: 'entrance' }],
    objects: [
      { x: 175, y: 300, w: 190, h: 95, label: 'Tablet tray', key: 'tabletTray', icon: '▰' },
      { x: 600, y: 300, w: 140, h: 105, label: 'Scroll case', key: 'scrollCase', icon: '▱' },
      { x: 770, y: 410, w: 110, h: 80, label: 'Excavation lamp', key: 'excavationLamp', icon: '◌' }
    ]
  }
};

const tip = document.querySelector('#tip');
const cluePanel = document.querySelector('#clue-panel');
const clueAtmosphere = document.querySelector('#clue-atmosphere');
const clueDetail = document.querySelector('#clue-detail');
const clueMore = document.querySelector('#clue-more');
const clueClose = document.querySelector('#clue-close');
let clueHideTimer;
let cluePinned = false;

function showClue(label, key, savedItem) {
  if (!cluePanel) return;
  const clue = savedItem || clues[key];
  if (!clue) return;
  clearTimeout(clueHideTimer);
  cluePinned = false;
  cluePanel.hidden = false;
  cluePanel.dataset.label = label;
  clueAtmosphere.textContent = clue.atmosphere;
  clueDetail.textContent = clue.detail;
  clueDetail.hidden = true;
  clueMore.hidden = false;
}

function scheduleClueHide() {
  clearTimeout(clueHideTimer);
  clueHideTimer = setTimeout(() => {
    if (!cluePinned && cluePanel) cluePanel.hidden = true;
  }, 900);
}

clueMore?.addEventListener('click', () => {
  cluePinned = true;
  clueDetail.hidden = false;
  clueMore.hidden = true;
});
clueClose?.addEventListener('click', () => {
  cluePinned = false;
  if (cluePanel) cluePanel.hidden = true;
});
cluePanel?.addEventListener('mouseenter', () => clearTimeout(clueHideTimer));
cluePanel?.addEventListener('mouseleave', scheduleClueHide);

function addItem(name, key, icon) {
  if (items.some(item => item.name === name)) return;
  if (items.length >= 10) {
    tip.textContent = 'Your inventory is full (10/10).';
    return;
  }
  items.push({ name, key, icon, ...clues[key] });
  renderBag();
}

function renderBag() {
  document.querySelector('#bag-count').textContent = items.length + '/10';
  document.querySelector('#bag-title-count').textContent = items.length + '/10';
  const box = document.querySelector('#bag-items');
  box.innerHTML = '';
  document.querySelector('#bag-empty').hidden = items.length > 0;
  items.forEach(item => {
    const button = document.createElement('button');
    button.className = 'bag-item';
    button.textContent = item.icon + ' ' + item.name;
    button.title = item.atmosphere;
    button.onmouseenter = () => showClue(item.name, item.key, item);
    button.onmouseleave = scheduleClueHide;
    box.append(button);
  });
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  width: W,
  height: H,
  transparent: true,
  scene: {
    create() {
      const scene = this;
      const cursor = "url('assets/sword-cursor.svg') 4 4, crosshair";
      let renderRoom;
      const openRoom = roomId => {
        renderRoom(roomId);
        location.hash = 'room-' + rooms[roomId].number;
      };

      const zone = (x, y, w, h, label, key, doorTarget, icon) => {
        const door = Boolean(doorTarget);
        const highlight = scene.add.rectangle(x, y, w, h, 0xffd27a, 0);
        if (!door) {
          highlight.setAlpha(.025);
          scene.tweens.add({
            targets: highlight,
            alpha: { from: .018, to: .075 },
            duration: 1700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
          });
        }

        const markerY = y - h / 2 - 12;
        const marker = door ? null : scene.add.rectangle(x, markerY, 7, 7, 0xe7b866, .95)
          .setRotation(Math.PI / 4)
          .setAlpha(0)
          .setDepth(4);
        const markerHalo = door ? null : scene.add.circle(x, markerY, 11, 0xe7b866, 0)
          .setStrokeStyle(1, 0xf6d99d, .75)
          .setAlpha(0)
          .setDepth(4);
        const hitbox = scene.add.rectangle(x, y, w, h, 0xffffff, 0).setInteractive({ useHandCursor: false });
        let markerTween;

        hitbox.on('pointerover', () => {
          hitbox.setScale(1.08);
          highlight.setScale(1.08);
          if (!door) {
            marker.setAlpha(1);
            markerHalo.setAlpha(.75);
          }
          markerTween?.stop();
          if (!door) {
            markerTween = scene.tweens.add({
              targets: [marker, markerHalo],
              scale: { from: .82, to: 1.08 },
              alpha: { from: .6, to: 1 },
              duration: 520,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.inOut'
            });
          }
          document.body.style.cursor = cursor;
          if (door) {
            scene.tip.setText(doorTarget === 'entrance' ? 'Return to Entrance Hall' : 'Enter ' + rooms[doorTarget].label);
          } else {
            scene.tip.setText('');
            showClue(label, key);
            highlight.setAlpha(.14);
          }
        });

        hitbox.on('pointerout', () => {
          hitbox.setScale(1);
          highlight.setScale(1);
          if (!door) highlight.setAlpha(.025);
          markerTween?.stop();
          marker?.setAlpha(0);
          markerHalo?.setAlpha(0);
          scene.tip.setText('');
          document.body.style.cursor = '';
          if (!door) scheduleClueHide();
        });

        hitbox.on('pointerdown', () => {
          if (door) {
            openRoom(doorTarget);
            return;
          }
          addItem(label, key, icon || (key === 'guard' ? '🗿' : key === 'pot' ? '⚱' : '🛠️'));
          showClue(label, key);
        });
      };

      renderRoom = roomId => {
        const room = rooms[roomId] || rooms.entrance;
        scene.tweens.killAll();
        scene.children.removeAll(true);
        document.body.style.cursor = '';
        document.querySelector('#phaser-game').style.background = `url('${room.background}') 0 0 / 100% 100% no-repeat`;
        scene.tip = scene.add.text(W / 2, 468, '', {
          fontSize: '15px',
          color: '#ffe0a0',
          backgroundColor: '#1b120dcc',
          padding: { x: 12, y: 7 }
        }).setOrigin(.5);
        room.doors.forEach(door => zone(door.x, door.y, door.w, door.h, door.label, '', door.target));
        room.objects.forEach(object => zone(object.x, object.y, object.w, object.h, object.label, object.key, false, object.icon));
        updateMiniMap(roomId);
      };

      renderRoom('entrance');
    }
  }
};

new Phaser.Game(config);
document.querySelector('#bag-button').onclick = () => document.querySelector('#bag-panel').hidden = false;
document.querySelector('#bag-close').onclick = () => document.querySelector('#bag-panel').hidden = true;
