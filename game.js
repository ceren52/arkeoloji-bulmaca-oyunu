const W = 880;
const H = 500;
const items = [];
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
      document.querySelector('#phaser-game').style.background = "url('assets/temple-entrance.png') 0 0 / 100% 100% no-repeat";
      const cursor = "url('assets/sword-cursor.svg') 4 4, crosshair";
      scene.tip = scene.add.text(W / 2, 468, '', {
        fontSize: '15px',
        color: '#ffe0a0',
        backgroundColor: '#1b120dcc',
        padding: { x: 12, y: 7 }
      }).setOrigin(.5);

      const zone = (x, y, w, h, label, key, door) => {
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

        const marker = scene.add.text(x + w / 2, y - h / 2 - 14, '🔎', {
          fontSize: '19px',
          stroke: '#271508',
          strokeThickness: 3
        }).setOrigin(.5).setAlpha(0).setDepth(4);
        const hitbox = scene.add.rectangle(x, y, w, h, 0xffffff, 0).setInteractive({ useHandCursor: false });
        let markerTween;

        hitbox.on('pointerover', () => {
          hitbox.setScale(1.08);
          highlight.setScale(1.08);
          marker.setAlpha(1);
          markerTween?.stop();
          markerTween = scene.tweens.add({
            targets: marker,
            scale: { from: .82, to: 1.08 },
            alpha: { from: .6, to: 1 },
            duration: 520,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
          });
          document.body.style.cursor = cursor;
          if (door) {
            scene.tip.setText('Continue through this door');
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
          marker.setAlpha(0);
          scene.tip.setText('');
          document.body.style.cursor = '';
          if (!door) scheduleClueHide();
        });

        hitbox.on('pointerdown', () => {
          if (door) {
            scene.tip.setText(label + ' selected.');
            return;
          }
          addItem(label, key, key === 'guard' ? '🗿' : key === 'pot' ? '⚱' : '🛠️');
          showClue(label, key);
        });
      };

      zone(154, 272, 90, 175, 'Left door', '', true);
      zone(508, 270, 105, 160, 'Middle door', '', true);
      zone(744, 285, 100, 170, 'Right door', '', true);
      zone(323, 226, 62, 155, 'Sentinel statue', 'guard', false);
      zone(586, 330, 38, 72, 'Broken pot', 'pot', false);
      zone(825, 385, 80, 190, 'Shovel', 'shovel', false);
    }
  }
};

new Phaser.Game(config);
document.querySelector('#bag-button').onclick = () => document.querySelector('#bag-panel').hidden = false;
document.querySelector('#bag-close').onclick = () => document.querySelector('#bag-panel').hidden = true;
