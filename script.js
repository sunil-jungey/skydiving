'use strict';

/**
 * OPTIONAL AUTOMATIC REPLY DELIVERY
 *
 * Create a free form at https://formspree.io/ and paste its full endpoint below.
 * Example: formspreeEndpoint: 'https://formspree.io/f/abcdefgh'
 *
 * With no endpoint configured, replies are only saved in the visitor's browser
 * and she can share/copy/open Instagram herself. Nothing is secretly sent.
 */
const SETTINGS = {
  formspreeEndpoint: '',
  instagramInbox: 'https://www.instagram.com/direct/inbox/'
};

const scenes = {
  apology: document.getElementById('scene-apology'),
  invitation: document.getElementById('scene-invitation'),
  yes: document.getElementById('scene-yes'),
  no: document.getElementById('scene-no')
};

const noButton = document.getElementById('noButton');
const choiceHint = document.getElementById('choiceHint');
const toast = document.getElementById('toast');
const progressBars = [...document.querySelectorAll('.progress-line')];
let noDodges = 0;
let toastTimer;

const replyMessages = {
  yes: 'Hey Sunil! It’s Indu 🌸 My answer is YES — let’s go skydiving! 🪂😄',
  no: 'Hey Sunil! It’s Indu 🌼 My answer is no for now, but thank you for asking. 😊'
};

function showScene(name) {
  Object.entries(scenes).forEach(([key, section]) => {
    section.hidden = key !== name;
  });
  const completed = name === 'apology' ? 1 : name === 'invitation' ? 2 : 3;
  progressBars.forEach((bar, index) => bar.classList.toggle('active', index < completed));
  window.scrollTo({ top: 0, behavior: 'instant' });
  const title = scenes[name].querySelector('h1');
  title.setAttribute('tabindex', '-1');
  title.focus({ preventScroll: true });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

function updatePrivacyNote() {
  if (SETTINGS.formspreeEndpoint.trim()) {
    document.getElementById('choicePrivacy').textContent = 'When you choose, your answer will be sent to Sunil and saved on this device.';
  }
}

function dodgeNoButton() {
  if (noDodges >= 2) return false;
  const shifts = [
    { x: 23, y: -18, r: 7 },
    { x: -19, y: 15, r: -6 }
  ];
  const shift = shifts[noDodges];
  noDodges += 1;
  noButton.style.transform = `translate(${shift.x}px, ${shift.y}px) rotate(${shift.r}deg)`;
  choiceHint.textContent = noDodges === 1
    ? 'Haha, that button is being silly 😄 You can still choose No!'
    : 'Okay, okay — no more tricks. Either answer is absolutely fine. 💛';
  return true;
}

async function deliverAnswer(responseRecord) {
  const endpoint = SETTINGS.formspreeEndpoint.trim();
  const statusEl = document.getElementById(`${responseRecord.answer}Delivery`);
  if (!endpoint) {
    statusEl.textContent = 'Answer saved on this device. Please share it below to let Sunil know.';
    return;
  }
  statusEl.textContent = 'Sending your answer to Sunil…';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: 'Indu',
        answer: responseRecord.answer.toUpperCase(),
        message: responseRecord.message,
        submitted_at: responseRecord.timestamp,
        _subject: `Indu answered ${responseRecord.answer.toUpperCase()} to skydiving!`
      })
    });
    if (!response.ok) throw new Error('Delivery not confirmed');
    statusEl.textContent = 'Your answer has been sent to Sunil! ✅';
  } catch (error) {
    console.warn('Reply delivery failed:', error);
    statusEl.textContent = 'Could not send automatically. Please use Share my answer below.';
  }
}

function chooseAnswer(answer) {
  if (answer !== 'yes' && answer !== 'no') return;
  const record = {
    friend: 'Indu',
    answer,
    message: replyMessages[answer],
    timestamp: new Date().toISOString()
  };
  try {
    localStorage.setItem('indu_skydiving_reply_v1', JSON.stringify(record));
  } catch (error) {
    console.warn('Local storage unavailable:', error);
  }
  showScene(answer);
  if (answer === 'yes') addCelebration();
  void deliverAnswer(record);
}

async function copyText(text) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // A compatible fallback for older browsers and local file previews.
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let success = false;
    try { success = document.execCommand('copy'); } catch { /* ignore */ }
    textarea.remove();
    return success;
  }
}

async function shareAnswer(answer) {
  const message = replyMessages[answer];
  if (navigator.share) {
    try {
      await navigator.share({ title: 'My skydiving answer for Sunil', text: message });
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }
  const copied = await copyText(message);
  showToast(copied ? 'Reply copied! Paste it into a message to Sunil. 💬' : 'Please copy your reply manually from the page.');
}

async function openInstagram(answer) {
  // Instagram doesn't offer a dependable public way to prefill a private DM.
  // Copy the text, then let Indu choose Sunil's chat herself.
  const tab = window.open(SETTINGS.instagramInbox, '_blank', 'noopener,noreferrer');
  const copied = await copyText(replyMessages[answer]);
  if (tab === null) {
    showToast('Open Instagram yourself and paste the reply into Sunil’s chat.');
  } else {
    showToast(copied ? 'Reply copied! Select Sunil’s chat and paste it there. 💬' : 'Instagram opened. Please send Sunil your answer in the chat.');
  }
}

function addCelebration() {
  // A little extra burst of flowers when she says yes.
  const flowerLayer = document.getElementById('floatingFlowers');
  const blooms = ['🌸', '🌼', '✨', '🌷', '🌺', '🎉'];
  for (let i = 0; i < 18; i++) {
    const bloom = document.createElement('span');
    bloom.className = 'flower-particle';
    bloom.textContent = blooms[i % blooms.length];
    bloom.style.setProperty('--left', `${(i * 17 + 11) % 100}%`);
    bloom.style.setProperty('--font-size', `${22 + (i % 4) * 5}px`);
    bloom.style.setProperty('--opacity', '.9');
    bloom.style.setProperty('--duration', `${6 + (i % 4)}s`);
    bloom.style.setProperty('--delay', `${-(i % 4)}s`);
    bloom.style.setProperty('--drift', `${(i % 2 ? 1 : -1) * 60}px`);
    flowerLayer.appendChild(bloom);
    setTimeout(() => bloom.remove(), 11000);
  }
}

function createFloatingFlowers() {
  const flowerLayer = document.getElementById('floatingFlowers');
  const count = window.innerWidth < 600 ? 15 : 28;
  const blooms = ['🌸', '🌷', '🌼', '🌺', '✿', '❀', '🌸', '🍃'];
  for (let i = 0; i < count; i++) {
    const flower = document.createElement('span');
    flower.className = 'flower-particle';
    flower.textContent = blooms[i % blooms.length];
    const x = (i * 37.7 + 11) % 98;
    const opacity = .22 + ((i * 7) % 6) / 17;
    flower.style.setProperty('--left', `${x}%`);
    flower.style.setProperty('--font-size', `${15 + ((i * 7) % 12)}px`);
    flower.style.setProperty('--opacity', opacity.toFixed(2));
    flower.style.setProperty('--duration', `${15 + (i % 9) * 1.4}s`);
    flower.style.setProperty('--delay', `${-((i * 5.3) % 22)}s`);
    flower.style.setProperty('--drift', `${((i * 13) % 160) - 80}px`);
    flowerLayer.appendChild(flower);
  }
}

// Navigation and answer selection.
document.getElementById('goInvitation').addEventListener('click', () => showScene('invitation'));
document.getElementById('yesButton').addEventListener('click', () => chooseAnswer('yes'));
noButton.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse') dodgeNoButton();
});
noButton.addEventListener('click', (event) => {
  // Keyboard/screen-reader users can always choose No immediately.
  if (event.detail !== 0 && dodgeNoButton()) return;
  chooseAnswer('no');
});

document.querySelectorAll('[data-share]').forEach(button => {
  button.addEventListener('click', () => void shareAnswer(button.dataset.share));
});
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const copied = await copyText(replyMessages[button.dataset.copy]);
    showToast(copied ? 'Reply copied! Paste it into a message to Sunil. 💬' : 'Could not copy automatically.');
  });
});
document.querySelectorAll('[data-instagram]').forEach(button => {
  button.addEventListener('click', () => void openInstagram(button.dataset.instagram));
});
document.querySelectorAll('[data-restart]').forEach(button => {
  button.addEventListener('click', () => {
    noDodges = 0;
    noButton.style.transform = '';
    choiceHint.textContent = 'Your choice, no pressure. Even if the No button gets a little cheeky. 😉';
    showScene('apology');
  });
});
document.getElementById('homeLink').addEventListener('click', (event) => {
  event.preventDefault();
  showScene('apology');
});

updatePrivacyNote();
createFloatingFlowers();
