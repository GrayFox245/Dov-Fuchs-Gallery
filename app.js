import * as THREE from "three";

const container = document.querySelector("#gallery");
const intro = document.querySelector("#intro");
const infoPanel = document.querySelector("#info-panel");
const infoTitle = document.querySelector("#info-title");
const infoDescription = document.querySelector("#info-description");
const infoSeries = document.querySelector("#info-series");
const imageModal = document.querySelector("#image-modal");
const imageModalImg = document.querySelector("#image-modal-img");
const imageModalTitle = document.querySelector("#image-modal-title");
const seriesModal = document.querySelector("#series-modal");
const seriesModalImg = document.querySelector("#series-modal-img");
const seriesModalTitle = document.querySelector("#series-modal-title");
const seriesModalDescription = document.querySelector("#series-modal-description");
const seriesModalCount = document.querySelector("#series-modal-count");
const pdfModal = document.querySelector("#pdf-modal");
const pdfModalFrame = document.querySelector("#pdf-modal-frame");
const pdfModalTitle = document.querySelector("#pdf-modal-title");
const visitorCount = document.querySelector("#visitor-count");
const ownerMode = document.querySelector("#owner-mode");
const resetVisitors = document.querySelector("#reset-visitors");
const miniMap = document.querySelector("#mini-map");
const miniMapContext = miniMap.getContext("2d");
const soundToggle = document.querySelector("[data-sound]");
const keys = new Set();
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const viewDirection = new THREE.Vector3();

let dragging = false;
let lastX = 0;
let pointerDownX = 0;
let pointerDownY = 0;
let yaw = 0;
let pitch = 0;
let moveTarget = null;
let officeDoorLeaf = null;
let officeDoorOpen = false;
let soundtrackOn = false;
let soundtrackTrackIndex = 0;
let activeSeries = null;
let activeSeriesIndex = 0;
const startingPoint = {
  x: 14.8,
  y: 1.75,
  z: -16.0,
  yaw: 2.19,
};
const soundtrack = new Audio();
soundtrack.preload = "auto";
soundtrack.volume = 0.42;
const soundtrackTracks = [
  "./assets/audio/atlasaudio-nature-piano-519619.mp3",
  "./assets/audio/leberch-piano-516448.mp3",
];
const seriesOpenNote = "Please double click on image to see the entire series.";

const timeTravelerDiaryImages = [
  {
    title: "Ceci nest pas toi",
    description: "A Magritte-like encounter with identity, image, and the strange refusal of resemblance.",
    image: "./assets/time-travelers-diary/ceci-nest-pas-toi.jpg",
  },
  {
    title: "Galileo's Secret",
    description: "The time traveler witnesses discovery as both revelation and danger.",
    image: "./assets/time-travelers-diary/galileos-secret.jpg",
  },
  {
    title: "Golaith's Last Battle",
    description: "A legendary confrontation seen from the impossible angle of a visitor from another age.",
    image: "./assets/time-travelers-diary/golaiths-last-battle.jpg",
  },
  {
    title: "King David's Paparazzo",
    description: "History becomes spectacle when the camera arrives before its time.",
    image: "./assets/time-travelers-diary/king-davids-paparazzo.jpg",
  },
  {
    title: "Kitty Hawk December 1903",
    description: "The first flight is interrupted by a traveler who already knows what aviation will become.",
    image: "./assets/time-travelers-diary/kitty-hawk-december-1903.jpg",
  },
  {
    title: "Lakehurst, May 1937",
    description: "A catastrophe witnessed at the edge between documentation and helpless foreknowledge.",
    image: "./assets/time-travelers-diary/lakehurst-may-1937.jpg",
  },
  {
    title: "North Atlantic, April 1912",
    description: "The time traveler arrives at a disaster that history has already made unavoidable.",
    image: "./assets/time-travelers-diary/north-atlantic-april-1912.jpg",
  },
  {
    title: "Photographing Leo",
    description: "An impossible studio visit with Leonardo, where image-making folds across centuries.",
    image: "./assets/time-travelers-diary/photographing-leo.jpg",
  },
  {
    title: "The Day the Stone Spoke",
    description: "Ancient inscription meets modern decoding in a compressed moment of discovery.",
    image: "./assets/time-travelers-diary/the-day-the-stone-spoke.jpg",
  },
  {
    title: "The Day the Train Came Twice",
    description: "Cinema, memory, and arrival repeat themselves in the machinery of time.",
    image: "./assets/time-travelers-diary/the-day-the-train-came-twice.jpg",
  },
  {
    title: "The Persistence of Melting",
    description: "A visit to Dali's elastic time, where clocks and certainty both lose their shape.",
    image: "./assets/time-travelers-diary/the-persistence-of-melting.jpg",
  },
  {
    title: "Thinking about thinking",
    description: "The traveler meets the mind at work, caught between observation and creation.",
    image: "./assets/time-travelers-diary/thinking-about-thinking.jpg",
  },
];

const echoesBehindMirrorImages = [
  {
    title: "Genesis 1:26",
    description: "A mirror-world creation scene where image, likeness, and self-recognition begin to blur.",
    image: "./assets/echoes-behind-the-mirror/genesis-1-26.jpg",
  },
  {
    title: "Head-First Jump into the Mirror World",
    description: "A plunge through reflection into a space where the familiar becomes unstable.",
    image: "./assets/echoes-behind-the-mirror/head-first-jump-into-the-mirror-world.jpg",
  },
  {
    title: "In Deep Waters",
    description: "Reflection becomes immersion, turning the mirror into a place of depth and uncertainty.",
    image: "./assets/echoes-behind-the-mirror/in-deep-waters.jpg",
  },
  {
    title: "Inside the Mirror World",
    description: "The viewer crosses into the reflected realm and finds it has its own architecture.",
    image: "./assets/echoes-behind-the-mirror/inside-the-mirror-world.jpg",
  },
  {
    title: "Meeting Young Me",
    description: "An encounter with an earlier self, held in the fragile logic of memory and reflection.",
    image: "./assets/echoes-behind-the-mirror/meeting-young-me.jpg",
  },
  {
    title: "Peeking",
    description: "A cautious look into the hidden side of the image, where curiosity and unease meet.",
    image: "./assets/echoes-behind-the-mirror/peeking.jpg",
  },
  {
    title: "The Man with No Reflections",
    description: "A figure stands before a world that refuses to return his image.",
    image: "./assets/echoes-behind-the-mirror/the-man-with-no-reflections.jpg",
  },
  {
    title: "The Man with the Wrong Reflection",
    description: "Identity slips when the mirror answers with someone other than the self.",
    image: "./assets/echoes-behind-the-mirror/the-man-with-the-wrong-reflection.jpg",
  },
  {
    title: "The Shatterer",
    description: "The mirror is broken as an act of defiance, release, or self-defense.",
    image: "./assets/echoes-behind-the-mirror/the-shatterer.jpg",
  },
  {
    title: "The Slap",
    description: "A confrontation with the reflected self becomes physical, theatrical, and unresolved.",
    image: "./assets/echoes-behind-the-mirror/the-slap.jpg",
  },
  {
    title: "Welcome to the Mirror World",
    description: "An invitation into the threshold where reflection becomes a parallel reality.",
    image: "./assets/echoes-behind-the-mirror/welcome-to-the-mirror-world.jpg",
  },
];

const absentImages = [
  {
    title: "A Moment of Relaxation",
    description: "A suspended pause where absence feels almost weightless.",
    image: "./assets/absent/a-moment-of-relaxation.jpg",
  },
  {
    title: "Awaiting Nothing",
    description: "A waiting state emptied of promise, answer, or arrival.",
    image: "./assets/absent/awaiting-nothing.jpg",
  },
  {
    title: "Error 404 Gravity Not Found",
    description: "A body slips out of ordinary laws, turning disappearance into comic impossibility.",
    image: "./assets/absent/error-404-gravity-not-found.jpg",
  },
  {
    title: "Farewell to Gravity",
    description: "Departure becomes literal as the figure releases the pull of the ground.",
    image: "./assets/absent/farewell-to-gravity.jpg",
  },
  {
    title: "Head in the Clouds",
    description: "The self drifts upward, half present and half dissolved into thought.",
    image: "./assets/absent/head-in-the-clouds.jpg",
  },
  {
    title: "The Gap",
    description: "A missing interval opens between presence and what should have been there.",
    image: "./assets/absent/the-gap.jpg",
  },
  {
    title: "The Headless Majority",
    description: "An unsettling crowd portrait where identity is removed but the body remains.",
    image: "./assets/absent/the-headless-majority.jpg",
  },
  {
    title: "The House of What Remains",
    description: "A corridor of memory, shadow, and self-recognition, where absence leaves its architecture behind.",
    image: "./assets/absent/the-house-of-what-remains.jpg",
  },
  {
    title: "The Missing Part",
    description: "A visual meditation on incompleteness, vacancy, and the shape of what is gone.",
    image: "./assets/absent/the-missing-part.jpg",
  },
  {
    title: "The Persistence of Old Habits",
    description: "Even when the self disappears, its old patterns remain stubbornly visible.",
    image: "./assets/absent/the-persistence-of-old-habits.jpg",
  },
  {
    title: "This is not an email",
    description: "A playful refusal of message, sender, and expected communication.",
    image: "./assets/absent/this-is-not-an-email.jpg",
  },
];

const fictionalRealitiesImages = [
  {
    title: "Achilles and the Tortoise",
    description: "Zeno's paradox becomes a visual reality where pursuit and arrival can never quite meet.",
    image: "./assets/fictional-realities/achilles-and-the-tortoise.jpg",
  },
  {
    title: "Atlas",
    description: "The mythic burden of holding the world is staged as an impossible, bodily task.",
    image: "./assets/fictional-realities/atlas.jpg",
  },
  {
    title: "King Midas Nightmare",
    description: "The golden gift turns into a curse, where desire transforms the world into loss.",
    image: "./assets/fictional-realities/king-midas-nightmare.jpg",
  },
  {
    title: "Room 101",
    description: "Orwell's private chamber of fear becomes a psychological room one cannot simply leave.",
    image: "./assets/fictional-realities/room-101.jpg",
  },
  {
    title: "Sisyphus",
    description: "The myth of endless repetition is recast as a human reality of effort, futility, and persistence.",
    image: "./assets/fictional-realities/sisyphus.jpg",
  },
  {
    title: "The Amazing Ascent of Remedios the Beautiful",
    description: "A magical-realist departure inspired by Garcia Marquez, where the ordinary world opens upward.",
    image: "./assets/fictional-realities/the-amazing-ascent-of-remedios-the-beautiful.jpg",
  },
  {
    title: "The Escape from King Minos's Labyrinth",
    description: "The mythic maze becomes a lived architecture of danger, invention, and escape.",
    image: "./assets/fictional-realities/the-escape-from-king-minoss-labyrinth.jpg",
  },
  {
    title: "The Master and Margarita",
    description: "Bulgakov's fantastic world enters the room with irony, darkness, and theatrical mischief.",
    image: "./assets/fictional-realities/the-master-and-margarita.jpg",
  },
  {
    title: "The Old Library",
    description: "A quiet threshold into the accumulated realities stored inside books.",
    image: "./assets/fictional-realities/the-old-library.jpg",
  },
  {
    title: "The Raven and the Poet",
    description: "Poe's raven returns as an atmosphere of grief, repetition, and unanswered speech.",
    image: "./assets/fictional-realities/the-raven-and-the-poet.jpg",
  },
  {
    title: "The Road Not Taken",
    description: "Frost's forked path becomes an image of choice, regret, and imagined alternatives.",
    image: "./assets/fictional-realities/the-road-not-taken.jpg",
  },
  {
    title: "The Well",
    description: "The well becomes a literary descent into memory, depth, and the hidden underground of the self.",
    image: "./assets/fictional-realities/the-well.jpg",
  },
];

const fadingHorizonsImages = [
  {
    title: "As Time Flies By",
    description: "Time becomes a visible current, moving faster than memory can hold.",
    image: "./assets/fading-horizons/as-time-flies-by.jpg",
  },
  {
    title: "Fluid Time",
    description: "Time loses its solid form and becomes something unstable, reflective, and difficult to grasp.",
    image: "./assets/fading-horizons/fluid-time.jpg",
  },
  {
    title: "Internal Clock",
    description: "The body carries its own clock, counting in silence beneath ordinary life.",
    image: "./assets/fading-horizons/internal-clock.jpg",
  },
  {
    title: "Ozymandias",
    description: "Power and monument collapse into the long perspective of time.",
    image: "./assets/fading-horizons/ozymandias.jpg",
  },
  {
    title: "The Clock Tower Prisoner",
    description: "A figure is held inside the machinery of time, watched by the hours themselves.",
    image: "./assets/fading-horizons/the-clock-tower-prisoner.jpg",
  },
  {
    title: "The Cog Wheels of Time",
    description: "Time appears as a mechanism that turns whether we consent to it or not.",
    image: "./assets/fading-horizons/the-cog-wheels-of-time.jpg",
  },
  {
    title: "The Hand of Time",
    description: "Time reaches into the scene as an active force rather than an abstract idea.",
    image: "./assets/fading-horizons/the-hand-of-time.jpg",
  },
  {
    title: "The Hourglass",
    description: "Mortality is measured grain by grain, beautiful and merciless.",
    image: "./assets/fading-horizons/the-hourglass.jpg",
  },
  {
    title: "The Spiral Staircase of Memories",
    description: "Memory rises and descends in loops, returning to what it cannot fully recover.",
    image: "./assets/fading-horizons/the-spiral-staircase-of-memories.jpg",
  },
  {
    title: "The Time of Long Shadows",
    description: "Late light stretches the world into an image of aging, distance, and farewell.",
    image: "./assets/fading-horizons/the-time-of-long-shadows.jpg",
  },
  {
    title: "The Valley of Shadow of Death",
    description: "Mortality becomes a landscape that must be crossed rather than merely contemplated.",
    image: "./assets/fading-horizons/the-valley-of-shadow-of-death.jpg",
  },
  {
    title: "Your Time Is Up",
    description: "The final summons arrives with the bluntness of a clock that has stopped negotiating.",
    image: "./assets/fading-horizons/your-time-is-up.jpg",
  },
];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6f91a6);
scene.fog = new THREE.Fog(0x6f91a6, 42, 95);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(startingPoint.x, startingPoint.y, startingPoint.z);
camera.rotation.order = "YXZ";
yaw = startingPoint.yaw;

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const room = {
  halfWidth: 16,
  depth: 36,
  height: 5.2,
};

const colliders = [];
const floorArrows = [];
const arrowTargets = [];
const infoButtons = [];
const artworkMeshes = [];
const officeDocMeshes = [];
const doorTargets = [];
const galleryVisitors = [];

const visitorCounterKey = "dfdgVisitorCount";
const ownerModeKey = "dfdgOwnerMode";
const sessionCountedKey = "dfdgSessionCounted";

const todaysExhibition = [
  {
    title: "A Painter Painting a Painter",
    description: "A layered self-portrait where artist, subject, and observer fold into one another.",
    image: "./assets/inner-world/a-painter-painting-a-painter.jpg",
  },
  {
    title: "Down into the Subconscious",
    description: "A descent into the hidden rooms beneath ordinary awareness.",
    image: "./assets/inner-world/down-into-the-subconscious.jpg",
  },
  {
    title: "Inner Conflict",
    description: "A silent war rages where no one else can see.",
    image: "./assets/inner-world/inner-conflict.jpg",
  },
  {
    title: "The Inner Child",
    description: "The child within appears as witness, memory, and unresolved question.",
    image: "./assets/inner-world/the-inner-child.jpg",
  },
  {
    title: "Volcanic Eruption",
    description: "Beneath the surface, a lifetime of silence ignites.",
    image: "./assets/inner-world/volcanic-eruption.jpg",
  },
  {
    title: "The Omen",
    description: "A sign appears before meaning has fully arrived.",
    image: "./assets/inner-world/the-omen.jpg",
  },
  {
    title: "The Frames Smasher",
    description: "Sometimes the only way out is to break everything.",
    image: "./assets/inner-world/the-frames-smasher.jpg",
  },
  {
    title: "The Inner Stalker",
    description: "The self follows itself through a private, uneasy landscape.",
    image: "./assets/inner-world/the-inner-stalker.jpg",
  },
  {
    title: "Fake Memories",
    description: "Not all that we remember ever happened.",
    image: "./assets/inner-world/fake-memories.jpg",
  },
  {
    title: "The Internal Tribunal",
    description: "A private court convenes where judgment and defense share the same face.",
    image: "./assets/inner-world/the-internal-tribunal.jpg",
  },
  {
    title: "The Winds of Forgetting",
    description: "Everything fades, even the things we swore we'd never forget.",
    image: "./assets/inner-world/the-winds-of-forgetting.jpg",
  },
  {
    title: "Labyrinth of The Mind",
    description: "Inside my head, a maze I can't map.",
    image: "./assets/inner-world/labyrinth-of-the-mind.jpg",
  },
];

const otherSeries = [
  {
    title: "Absent",
    description: "A series about disappearance, missing parts, suspended bodies, and the strange presence left behind by what is no longer there.",
    image: "./assets/absent/the-missing-part.jpg",
    images: absentImages,
    isSeries: true,
  },
  {
    title: "Fictional Realities",
    description: "Literature, myth, and poetry are re-entered as visual worlds, where the artist inhabits stories rather than merely illustrating them.",
    image: "./assets/fictional-realities/the-raven-and-the-poet.jpg",
    images: fictionalRealitiesImages,
    isSeries: true,
  },
  {
    title: "The Time Traveler's Diary",
    description: "A journey through impossible encounters with history, art, memory, invention, and the strange privilege of arriving too early or too late.",
    image: "./assets/time-travelers-diary/galileos-secret.jpg",
    images: timeTravelerDiaryImages,
    isSeries: true,
  },
  {
    title: "Echoes Behind the Mirror",
    description: "Mirrors become portals, traps, and stages for altered selves, unstable identities, and confrontations with reflection.",
    image: "./assets/echoes-behind-the-mirror/welcome-to-the-mirror-world.jpg",
    images: echoesBehindMirrorImages,
    isSeries: true,
  },
  {
    title: "Fading Horizons",
    description: "A series about time, mortality, memory, erosion, and the long shadows that gather at the edge of what remains.",
    image: "./assets/fading-horizons/the-hourglass.jpg",
    images: fadingHorizonsImages,
    isSeries: true,
  },
];

const imageOfTheMonth = {
  title: "The House of What Remains",
  description: "Image of the Month. A corridor of memory, shadow, and self-recognition, where the portrait on the wall and the figure entering the room seem to belong to the same unresolved story.",
  image: "./assets/featured/image-of-the-month.jpg",
};

const artistBio = {
  title: "Dov Fuchs",
  description: "Dov Fuchs is a digital artist whose work builds imaginary rooms, emotional landscapes, altered self-portraits, and narrative scenes that move between memory, irony, anxiety, and wonder. For further info on the artist, please visit our Office.",
  image: "./assets/profile/dov-fuchs.jpg",
};

function makeWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  context.fillStyle = "#b8783d";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const plankW = 96;
  const plankH = 250;
  for (let y = 0; y < canvas.height; y += plankH) {
    for (let x = 0; x < canvas.width; x += plankW) {
      const offset = ((y / plankH) % 2) * (plankW / 2);
      const px = x - offset;
      const tone = 120 + Math.random() * 54;
      context.fillStyle = `rgb(${tone + 50}, ${tone * 0.74}, ${tone * 0.42})`;
      context.fillRect(px + 2, y + 2, plankW - 4, plankH - 4);
      context.strokeStyle = "rgba(40, 20, 8, .5)";
      context.lineWidth = 2;
      context.strokeRect(px + 2, y + 2, plankW - 4, plankH - 4);
      for (let g = 0; g < 8; g += 1) {
        context.strokeStyle = `rgba(255, 224, 160, ${0.04 + Math.random() * 0.08})`;
        context.beginPath();
        context.moveTo(px + 12 + Math.random() * 14, y + 20 + g * 28);
        context.lineTo(px + plankW - 12, y + 24 + g * 28 + Math.random() * 12);
        context.stroke();
      }
    }
  }

  for (let i = 0; i < 2200; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    context.fillStyle = `rgba(255, 223, 160, ${Math.random() * 0.08})`;
    context.fillRect(x, y, Math.random() * 28 + 5, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5.5, 7);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeHaifaPanoramaTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 768;
  const context = canvas.getContext("2d");

  const sky = context.createLinearGradient(0, 0, 0, 290);
  sky.addColorStop(0, "#5f87bd");
  sky.addColorStop(0.58, "#a6c3da");
  sky.addColorStop(1, "#d7e1df");
  context.fillStyle = sky;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const sea = context.createLinearGradient(0, 190, 0, 465);
  sea.addColorStop(0, "#1e5e9b");
  sea.addColorStop(0.5, "#2f86ad");
  sea.addColorStop(1, "#68a9bd");
  context.fillStyle = sea;
  context.fillRect(0, 190, canvas.width, 275);

  context.fillStyle = "rgba(255,255,255,.38)";
  context.fillRect(980, 270, 360, 5);
  context.fillRect(1250, 302, 260, 4);
  context.fillStyle = "#e6d19d";
  context.beginPath();
  context.moveTo(1160, 438);
  context.bezierCurveTo(1330, 390, 1510, 385, 1770, 410);
  context.lineTo(2048, 455);
  context.lineTo(2048, 510);
  context.lineTo(1120, 510);
  context.closePath();
  context.fill();

  const hill = context.createLinearGradient(0, 360, 0, canvas.height);
  hill.addColorStop(0, "#6c8c5a");
  hill.addColorStop(0.42, "#456b3e");
  hill.addColorStop(1, "#2f552d");
  context.fillStyle = hill;
  context.beginPath();
  context.moveTo(0, 440);
  context.bezierCurveTo(280, 388, 450, 420, 690, 452);
  context.bezierCurveTo(970, 492, 1240, 455, 1580, 490);
  context.bezierCurveTo(1780, 512, 1920, 548, 2048, 570);
  context.lineTo(2048, 768);
  context.lineTo(0, 768);
  context.closePath();
  context.fill();

  context.fillStyle = "#e1d6c2";
  for (let i = 0; i < 520; i += 1) {
    const x = 360 + Math.random() * 1250;
    const y = 385 + Math.random() * 150;
    const w = 8 + Math.random() * 18;
    const h = 6 + Math.random() * 26;
    context.globalAlpha = 0.45 + Math.random() * 0.38;
    context.fillRect(x, y, w, h);
  }
  context.globalAlpha = 1;

  context.fillStyle = "#48614a";
  for (let i = 0; i < 90; i += 1) {
    const x = Math.random() * canvas.width;
    const y = 455 + Math.random() * 210;
    context.beginPath();
    context.ellipse(x, y, 8 + Math.random() * 18, 18 + Math.random() * 38, 0, 0, Math.PI * 2);
    context.fill();
  }

  const centerX = 1040;
  context.strokeStyle = "#e8c98d";
  context.lineWidth = 16;
  for (let i = 0; i < 7; i += 1) {
    const y = 540 + i * 28;
    context.beginPath();
    context.moveTo(centerX - 290 + i * 26, y);
    context.lineTo(centerX + 290 - i * 26, y);
    context.stroke();
  }

  context.strokeStyle = "#d9b170";
  context.lineWidth = 10;
  context.beginPath();
  context.moveTo(centerX, 488);
  context.lineTo(centerX, 738);
  context.stroke();

  context.fillStyle = "#d7bc78";
  context.beginPath();
  context.arc(centerX, 480, 26, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#a67a3f";
  context.fillRect(centerX - 18, 500, 36, 34);

  context.strokeStyle = "#333337";
  context.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const x = 1620 + i * 42;
    context.beginPath();
    context.moveTo(x, 380);
    context.lineTo(x + 16, 314);
    context.lineTo(x + 44, 380);
    context.stroke();
  }

  context.fillStyle = "rgba(255,255,255,.32)";
  for (let i = 0; i < 16; i += 1) {
    const x = 740 + Math.random() * 760;
    const y = 210 + Math.random() * 140;
    context.fillRect(x, y, 42 + Math.random() * 70, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeTextTexture(text, options = {}) {
  const {
    width = 512,
    height = 160,
    background = "#12130f",
    color = "#f4efe4",
    accent = "#a9bd73",
    font = "700 54px Sora, Arial, sans-serif",
    subtext = "",
  } = options;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(244,239,228,.32)";
  context.lineWidth = 6;
  context.strokeRect(8, 8, width - 16, height - 16);
  context.fillStyle = accent;
  context.fillRect(0, 0, width, 12);
  context.fillStyle = color;
  context.font = font;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, width / 2, subtext ? height / 2 - 14 : height / 2 + 4);
  if (subtext) {
    context.fillStyle = "rgba(244,239,228,.72)";
    context.font = "500 24px Sora, Arial, sans-serif";
    context.fillText(subtext, width / 2, height / 2 + 42);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeLargeWallSignTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  function drawRaisedText(text, y, font, fill, shadow, highlight, depth) {
    context.font = font;
    context.textAlign = "center";
    context.textBaseline = "middle";
    const x = canvas.width / 2;

    for (let i = depth; i > 0; i -= 1) {
      context.fillStyle = shadow;
      context.fillText(text, x + i * 2.4, y + i * 2.1);
    }

    context.lineJoin = "round";
    context.strokeStyle = "rgba(28,23,18,.72)";
    context.lineWidth = depth > 8 ? 12 : 7;
    context.strokeText(text, x, y);

    context.fillStyle = fill;
    context.fillText(text, x, y);

    context.strokeStyle = highlight;
    context.lineWidth = depth > 8 ? 3.8 : 2.4;
    context.strokeText(text, x - 2, y - 3);

    context.fillStyle = "rgba(255,255,255,.18)";
    context.fillText(text, x - 4, y - 5);
  }

  drawRaisedText(
    "Dov Fuchs",
    190,
    "900 190px Arial, sans-serif",
    "#cec5b7",
    "rgba(68,52,38,.9)",
    "rgba(255,244,220,.82)",
    14
  );

  drawRaisedText(
    "Digital Art Gallery",
    352,
    "800 92px Arial, sans-serif",
    "#b6aa9a",
    "rgba(56,43,32,.88)",
    "rgba(255,240,214,.68)",
    8
  );

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeExhibitionBoardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 700;
  const context = canvas.getContext("2d");

  const bg = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, "#111827");
  bg.addColorStop(0.55, "#17231e");
  bg.addColorStop(1, "#0b0f12");
  context.fillStyle = bg;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(169,189,115,.82)";
  context.lineWidth = 8;
  context.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  context.fillStyle = "#a9bd73";
  context.font = "800 46px Sora, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("TODAY'S EXHIBITION", canvas.width / 2, 118);

  context.fillStyle = "#f4efe4";
  context.font = "900 88px Arial, sans-serif";
  context.fillText("Portraits of the", canvas.width / 2, 300);
  context.fillText("Inner World", canvas.width / 2, 402);

  context.fillStyle = "rgba(244,239,228,.72)";
  context.font = "500 34px Sora, Arial, sans-serif";
  context.fillText("A temporary focus wall for the current featured series", canvas.width / 2, 535);

  context.fillStyle = "rgba(169,189,115,.18)";
  for (let i = 0; i < 22; i += 1) {
    const y = 76 + i * 24;
    context.fillRect(80, y, canvas.width - 160, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeSmallLabelTexture(text, options = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  context.fillStyle = options.background || "#11120f";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = options.border || "rgba(244,239,228,.28)";
  context.lineWidth = 5;
  context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
  context.fillStyle = options.color || "#f4efe4";
  context.font = options.font || "700 34px Sora, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > 430 && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  lines.push(line);
  lines.slice(0, 2).forEach((item, index) => {
    context.fillText(item, canvas.width / 2, lines.length > 1 ? 48 + index * 36 : 64);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeContactInfoSheetTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1250;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#11120f");
  gradient.addColorStop(0.55, "#1c1a14");
  gradient.addColorStop(1, "#090a08");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(214,179,109,.9)";
  context.lineWidth = 12;
  context.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);
  context.strokeStyle = "rgba(169,189,115,.48)";
  context.lineWidth = 4;
  context.strokeRect(58, 58, canvas.width - 116, canvas.height - 116);

  context.fillStyle = "rgba(214,179,109,.14)";
  context.fillRect(92, 104, canvas.width - 184, 4);
  context.fillRect(92, 1028, canvas.width - 184, 4);

  context.fillStyle = "#a9bd73";
  context.font = "900 48px Sora, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("CONTACT INFO", canvas.width / 2, 160);

  context.fillStyle = "#f4efe4";
  context.font = "400 86px Kaushan Script, Georgia, serif";
  context.fillText("Dov Fuchs", canvas.width / 2, 270);

  const rows = [
    ["EMAIL", "fuchsd@netvision.net.il"],
    ["WEBSITE", "dovfuchs.art"],
    ["INSTAGRAM", "@dovfuchs"],
    ["1X", "1x.com/DovFuchs"],
  ];

  rows.forEach(([label, value], index) => {
    const y = 430 + index * 150;
    context.fillStyle = "rgba(169,189,115,.18)";
    context.fillRect(128, y - 54, canvas.width - 256, 104);
    context.strokeStyle = "rgba(214,179,109,.38)";
    context.lineWidth = 3;
    context.strokeRect(128, y - 54, canvas.width - 256, 104);
    context.fillStyle = "#d6b36d";
    context.font = "900 30px Sora, Arial, sans-serif";
    context.textAlign = "left";
    context.fillText(label, 164, y - 18);
    context.fillStyle = "#f4efe4";
    context.font = value.length > 18 ? "700 34px Sora, Arial, sans-serif" : "800 42px Sora, Arial, sans-serif";
    context.fillText(value, 164, y + 27);
  });

  context.textAlign = "center";
  context.fillStyle = "rgba(244,239,228,.72)";
  context.font = "600 28px Sora, Arial, sans-serif";
  context.fillText("For inquiries, commissions, prints, and exhibition contact", canvas.width / 2, 1112);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines = 10) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((item, index) => {
    context.fillText(item, x, y + index * lineHeight);
  });
}

function makeOfficeDocumentSheetTexture(documentInfo) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1250;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#11120f");
  gradient.addColorStop(0.58, "#1c1a14");
  gradient.addColorStop(1, "#090a08");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(214,179,109,.88)";
  context.lineWidth = 12;
  context.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);
  context.strokeStyle = "rgba(169,189,115,.44)";
  context.lineWidth = 4;
  context.strokeRect(58, 58, canvas.width - 116, canvas.height - 116);

  context.fillStyle = "#a9bd73";
  context.font = "900 42px Sora, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(documentInfo.sheetEyebrow || "ARTIST INFO", canvas.width / 2, 132);

  context.fillStyle = "#f4efe4";
  context.font = documentInfo.sheetTitle.length > 16 ? "900 70px Bebas Neue, Arial, sans-serif" : "900 88px Bebas Neue, Arial, sans-serif";
  const titleLines = documentInfo.sheetTitle.split("|");
  titleLines.forEach((line, index) => context.fillText(line.trim(), canvas.width / 2, 238 + index * 78));

  context.fillStyle = "rgba(214,179,109,.18)";
  context.fillRect(104, 342, canvas.width - 208, 4);

  context.textAlign = "left";
  context.fillStyle = "#d6b36d";
  context.font = "900 31px Sora, Arial, sans-serif";
  context.fillText(documentInfo.sheetSubhead || "Dov Fuchs", 116, 416);

  context.fillStyle = "rgba(244,239,228,.88)";
  context.font = "600 30px Sora, Arial, sans-serif";
  wrapCanvasText(context, documentInfo.sheetBody, 116, 482, canvas.width - 232, 44, 11);

  if (documentInfo.sheetHighlights?.length) {
    context.fillStyle = "rgba(169,189,115,.15)";
    context.fillRect(104, 958, canvas.width - 208, 148);
    context.strokeStyle = "rgba(214,179,109,.32)";
    context.lineWidth = 3;
    context.strokeRect(104, 958, canvas.width - 208, 148);
    context.fillStyle = "#a9bd73";
    context.font = "900 26px Sora, Arial, sans-serif";
    context.fillText("HIGHLIGHTS", 132, 1004);
    context.fillStyle = "#f4efe4";
    context.font = "700 25px Sora, Arial, sans-serif";
    documentInfo.sheetHighlights.slice(0, 3).forEach((item, index) => {
      context.fillText(item, 132, 1048 + index * 34);
    });
  }

  context.textAlign = "center";
  context.fillStyle = "rgba(244,239,228,.56)";
  context.font = "600 24px Sora, Arial, sans-serif";
  if (documentInfo.sheetSource) {
    context.fillText(documentInfo.sheetSource, canvas.width / 2, 1164);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeWayfindingTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 420;
  const context = canvas.getContext("2d");
  context.fillStyle = "#171814";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(169,189,115,.72)";
  context.lineWidth = 10;
  context.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);

  context.fillStyle = "#a9bd73";
  context.font = "900 44px Sora, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("ARTIST INFO", canvas.width / 2, 86);

  context.fillStyle = "#f4efe4";
  context.font = "900 66px Sora, Arial, sans-serif";
  context.fillText("Please visit", canvas.width / 2, 182);
  context.font = "900 88px Sora, Arial, sans-serif";
  context.fillText("THE OFFICE", canvas.width / 2, 285);

  context.fillStyle = "rgba(244,239,228,.68)";
  context.font = "700 34px Sora, Arial, sans-serif";
  context.fillText("CV / Statement / About / Contact / Prices", canvas.width / 2, 354);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeOtherSeriesSignTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 220;
  const context = canvas.getContext("2d");
  context.fillStyle = "#10110f";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(169,189,115,.72)";
  context.lineWidth = 8;
  context.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);

  context.fillStyle = "#f4efe4";
  context.font = "900 74px Sora, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("DOV'S OTHER SERIES", canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeBulletinBoardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 820;
  const context = canvas.getContext("2d");

  const screenGradient = context.createRadialGradient(600, 360, 40, 600, 360, 720);
  screenGradient.addColorStop(0, "#202617");
  screenGradient.addColorStop(0.55, "#0f120d");
  screenGradient.addColorStop(1, "#040504");
  context.fillStyle = screenGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 8) {
    context.fillStyle = `rgba(169,189,115,${y % 16 === 0 ? 0.035 : 0.018})`;
    context.fillRect(0, y, canvas.width, 1);
  }

  context.strokeStyle = "rgba(169,189,115,.82)";
  context.lineWidth = 8;
  context.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);
  context.strokeStyle = "rgba(214,179,109,.32)";
  context.lineWidth = 3;
  context.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

  context.fillStyle = "#a9bd73";
  context.font = "900 40px Sora, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("GALLERY BULLETIN", canvas.width / 2, 88);

  context.fillStyle = "#f4efe4";
  context.font = "900 92px Sora, Arial, sans-serif";
  context.fillText("ANNOUNCEMENTS", canvas.width / 2, 174);

  const cards = [
    {
      title: "Limited Editions",
      body: "All images are available on Dibond - standard sizes: 60 x 60 cm and 80 x 80 cm.",
    },
    {
      title: "Sales Notices",
      body: "Future announcements for special offers and available works.",
    },
    {
      title: "Gallery Rotation",
      body: "Weekly series rotations and image-of-the-month updates will appear here.",
    },
    {
      title: "Office",
      body: "Artist info, contact, CV, statement, and price list are inside.",
    },
    {
      title: "Visitor Notes",
      body: "Leave comments and impressions in the Visitor's Book.",
    },
  ];

  cards.forEach((card, index) => {
    const x = 106;
    const y = 258 + index * 100;
    context.fillStyle = index % 2 === 0 ? "rgba(244,239,228,.055)" : "rgba(169,189,115,.06)";
    context.fillRect(x, y, canvas.width - x * 2, 76);
    context.strokeStyle = "rgba(214,179,109,.22)";
    context.lineWidth = 2;
    context.strokeRect(x, y, canvas.width - x * 2, 76);
    context.fillStyle = "#d6b36d";
    context.font = "900 28px Sora, Arial, sans-serif";
    context.textAlign = "left";
    context.fillText(card.title.toUpperCase(), x + 34, y + 30);
    context.fillStyle = "rgba(244,239,228,.86)";
    context.font = index === 0 ? "700 21px Sora, Arial, sans-serif" : "700 24px Sora, Arial, sans-serif";
    context.fillText(card.body, x + 34, y + 58);
  });

  context.fillStyle = "rgba(169,189,115,.82)";
  context.font = "900 28px Sora, Arial, sans-serif";
  context.textAlign = "center";
  context.fillText("UPDATES / SALES / EXHIBITIONS", canvas.width / 2, 760);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeBioPanelTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 900;
  const context = canvas.getContext("2d");
  context.fillStyle = "#11120f";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(169,189,115,.72)";
  context.lineWidth = 10;
  context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  context.fillStyle = "#a9bd73";
  context.font = "900 62px Sora, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("DOV FUCHS", canvas.width / 2, 100);

  context.fillStyle = "#f4efe4";
  context.font = "700 42px Sora, Arial, sans-serif";
  const lines = [
    "Digital artist working with",
    "imaginary rooms, altered",
    "self-portraits, narrative",
    "scenes, memory, irony,",
    "anxiety, and wonder.",
    "",
    "For further info",
    "on the artist,",
    "please visit our Office.",
  ];
  lines.forEach((line, index) => {
    context.fillText(line, canvas.width / 2, 220 + index * 62);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeInfoIconTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#6e7f45";
  context.beginPath();
  context.arc(128, 128, 112, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "rgba(255,255,255,.52)";
  context.lineWidth = 10;
  context.stroke();
  context.fillStyle = "#10110f";
  context.font = "900 154px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("i", 128, 138);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}


function makeBrickTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  context.fillStyle = "#4b291f";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const brickW = 96;
  const brickH = 42;
  for (let y = 0; y < canvas.height; y += brickH) {
    const offset = (y / brickH) % 2 ? brickW / 2 : 0;
    for (let x = -offset; x < canvas.width; x += brickW) {
      const r = 92 + Math.random() * 55;
      context.fillStyle = `rgb(${r}, ${42 + Math.random() * 20}, ${28 + Math.random() * 16})`;
      context.fillRect(x + 2, y + 2, brickW - 4, brickH - 4);
      context.fillStyle = "rgba(255,255,255,.05)";
      context.fillRect(x + 6, y + 5, brickW - 12, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.2, 1.5);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function addBox(name, size, position, material, cast = true, receive = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), material);
  mesh.name = name;
  mesh.position.copy(position);
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  scene.add(mesh);
  return mesh;
}

function addOrientationLabel({ text, x, y, z, rotationY = 0, width = 1.12, height = 0.42 }) {
  const group = new THREE.Group();
  group.name = `orientation-label-${text.toLowerCase()}`;
  group.position.set(x, y, z);
  group.rotation.y = rotationY;

  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.08, height + 0.08, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x0f100e, roughness: 0.55, metalness: 0.08 })
  );
  backing.castShadow = true;
  backing.receiveShadow = true;
  group.add(backing);

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: makeSmallLabelTexture(text, {
        background: "#10110f",
        color: "#d6b36d",
        border: "rgba(214,179,109,.72)",
        font: "900 50px Sora, Arial, sans-serif",
      }),
      side: THREE.DoubleSide,
    })
  );
  face.position.z = 0.031;
  group.add(face);
  scene.add(group);
  return group;
}

function addFloorArrow(x, z, rotationY, scale = 1, target = null) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1);
  shape.lineTo(0.62, 0.24);
  shape.lineTo(0.25, 0.24);
  shape.lineTo(0.25, -0.82);
  shape.lineTo(-0.25, -0.82);
  shape.lineTo(-0.25, 0.24);
  shape.lineTo(-0.62, 0.24);
  shape.lineTo(0, 1);

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshStandardMaterial({
    color: 0xb8c96e,
    emissive: 0x788a35,
    emissiveIntensity: 0.55,
    roughness: 0.42,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
  });

  const arrow = new THREE.Mesh(geometry, material);
  arrow.name = "floor-wayfinding-arrow";
  arrow.rotation.x = -Math.PI / 2;
  arrow.rotation.z = rotationY;
  arrow.scale.setScalar(scale);
  arrow.position.set(x, 0.035, z);
  arrow.userData.target = target;
  arrow.receiveShadow = false;
  scene.add(arrow);
  floorArrows.push(arrow);

  const hit = new THREE.Mesh(
    new THREE.CircleGeometry(1.25 * scale, 24),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  hit.name = "floor-arrow-hit-target";
  hit.rotation.x = -Math.PI / 2;
  hit.position.set(x, 0.08, z);
  hit.userData.target = target;
  scene.add(hit);
  arrowTargets.push(hit);
}

function addCollider(x, z, halfX, halfZ, options = {}) {
  const collider = { x, z, halfX, halfZ, ...options };
  colliders.push(collider);
  return collider;
}

const floorMaterial = new THREE.MeshStandardMaterial({
  map: makeWoodTexture(),
  roughness: 0.36,
  metalness: 0.03,
});
const blackWall = new THREE.MeshStandardMaterial({ color: 0x070807, roughness: 0.7 });
const galleryWall = new THREE.MeshStandardMaterial({ color: 0x0b0c0a, roughness: 0.74 });
const warmCeiling = new THREE.MeshStandardMaterial({ color: 0x76533c, roughness: 0.78 });
const brickWall = new THREE.MeshStandardMaterial({ map: makeBrickTexture(), roughness: 0.82 });
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x9ec7d1,
  transmission: 0.35,
  roughness: 0.05,
  metalness: 0,
  transparent: true,
  opacity: 0.38,
});
const balconyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a4a43, roughness: 0.72 });
const railMaterial = new THREE.MeshStandardMaterial({ color: 0xc4c0ad, roughness: 0.42, metalness: 0.25 });
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x6b4a2d, roughness: 0.62 });
const doorTrimMaterial = new THREE.MeshStandardMaterial({ color: 0xc79b5d, roughness: 0.42, metalness: 0.08 });
const galleryLabelStyle = {
  background: "#10110f",
  color: "#d6b36d",
  border: "rgba(214,179,109,.64)",
};

addBox("floor", new THREE.Vector3(room.halfWidth * 2, 0.18, room.depth), new THREE.Vector3(0, -0.09, 0), floorMaterial, false);
addBox("rear-gallery-floor-extension", new THREE.Vector3(13.2, 0.08, 9.4), new THREE.Vector3(8.8, 0.005, 11.9), floorMaterial, false);
addBox("ceiling", new THREE.Vector3(room.halfWidth * 2, 0.22, room.depth), new THREE.Vector3(0, room.height, 0), warmCeiling, false);
addBox("left-wall-front", new THREE.Vector3(0.28, room.height, 8), new THREE.Vector3(-room.halfWidth, room.height / 2, -14), galleryWall);
addBox("left-wall-back", new THREE.Vector3(0.28, room.height, 7), new THREE.Vector3(-room.halfWidth, room.height / 2, 14.5), galleryWall);
addBox("left-window-header", new THREE.Vector3(0.3, 0.65, 21), new THREE.Vector3(-room.halfWidth, room.height - 0.32, 0.8), galleryWall);
addBox("left-window-base", new THREE.Vector3(0.3, 0.55, 21), new THREE.Vector3(-room.halfWidth, 0.28, 0.8), galleryWall);
addBox("right-wall", new THREE.Vector3(0.28, room.height, room.depth), new THREE.Vector3(room.halfWidth, room.height / 2, 0), galleryWall);
addBox("front-wall", new THREE.Vector3(room.halfWidth * 2, room.height, 0.28), new THREE.Vector3(0, room.height / 2, -room.depth / 2), galleryWall);
addBox("back-wall-left-segment", new THREE.Vector3(21.6, room.height, 0.28), new THREE.Vector3(-5.2, room.height / 2, room.depth / 2), galleryWall);
addBox("back-wall-between-doors", new THREE.Vector3(3.4, room.height, 0.28), new THREE.Vector3(9.9, room.height / 2, room.depth / 2), galleryWall);
addBox("back-wall-right-segment", new THREE.Vector3(1.8, room.height, 0.28), new THREE.Vector3(15.1, room.height / 2, room.depth / 2), galleryWall);

addBox("central-partition", new THREE.Vector3(1.2, room.height, 12.4), new THREE.Vector3(1.2, room.height / 2, 0.4), blackWall);
addBox("side-partition", new THREE.Vector3(7.4, room.height, 1.1), new THREE.Vector3(9.2, room.height / 2, 8.6), blackWall);
addBox("short-partition", new THREE.Vector3(1.1, room.height, 8), new THREE.Vector3(-7.6, room.height / 2, -4.5), blackWall);

addOrientationLabel({ text: "W1", x: 0, y: 4.86, z: -17.56, rotationY: 0 });
addOrientationLabel({ text: "W2", x: -5.2, y: 4.86, z: 17.56, rotationY: Math.PI });
addOrientationLabel({ text: "W3", x: 15.56, y: 4.86, z: 0, rotationY: -Math.PI / 2 });
addOrientationLabel({ text: "P1", x: 0.56, y: 4.86, z: 0.4, rotationY: -Math.PI / 2 });
addOrientationLabel({ text: "P1", x: 1.84, y: 4.86, z: 0.4, rotationY: Math.PI / 2 });
addOrientationLabel({ text: "P2", x: 9.2, y: 4.86, z: 8.0, rotationY: Math.PI });
addOrientationLabel({ text: "P2", x: 9.2, y: 4.86, z: 9.2, rotationY: 0 });
addOrientationLabel({ text: "P3", x: -8.18, y: 4.86, z: -4.5, rotationY: -Math.PI / 2 });
addOrientationLabel({ text: "P3", x: -7.02, y: 4.86, z: -4.5, rotationY: Math.PI / 2 });

addCollider(1.2, 0.4, 0.8, 6.45);
addCollider(9.2, 8.6, 3.9, 0.75);
addCollider(-7.6, -4.5, 0.75, 4.3);

const windowGroup = new THREE.Group();
for (let i = 0; i < 7; i += 1) {
  const pane = addBox(
    "window-pane",
    new THREE.Vector3(0.07, 4.05, 2.7),
    new THREE.Vector3(-15.82, 2.7, -7.6 + i * 2.75),
    glassMaterial,
    false,
    false
  );
  windowGroup.add(pane);
  const mullion = addBox(
    "window-mullion",
    new THREE.Vector3(0.18, 4.25, 0.06),
    new THREE.Vector3(-15.72, 2.78, -8.98 + i * 2.75),
    blackWall,
    true,
    true
  );
  windowGroup.add(mullion);
}
scene.add(windowGroup);

function addBalconyAndLandscape() {
  addBox("balcony-floor", new THREE.Vector3(6.8, 0.22, 21), new THREE.Vector3(-19.45, -0.03, 0.8), balconyMaterial, true, true);
  addBox("balcony-front-rail", new THREE.Vector3(0.18, 1.05, 21), new THREE.Vector3(-22.8, 0.72, 0.8), railMaterial, true, true);
  addBox("balcony-left-rail", new THREE.Vector3(6.8, 1.05, 0.18), new THREE.Vector3(-19.45, 0.72, -9.7), railMaterial, true, true);
  addBox("balcony-right-rail", new THREE.Vector3(6.8, 1.05, 0.18), new THREE.Vector3(-19.45, 0.72, 11.3), railMaterial, true, true);

  for (let z = -8.4; z <= 10.2; z += 3.1) {
    addBox("balcony-post", new THREE.Vector3(0.16, 1.25, 0.16), new THREE.Vector3(-22.75, 0.86, z), railMaterial, true, true);
  }

  const panorama = new THREE.Mesh(
    new THREE.PlaneGeometry(52, 19),
    new THREE.MeshBasicMaterial({ map: makeHaifaPanoramaTexture() })
  );
  panorama.rotation.y = Math.PI / 2;
  panorama.position.set(-47, 6.5, 0.8);
  scene.add(panorama);

  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(72, 46, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x4e95ad, roughness: 0.5, metalness: 0.02 })
  );
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(-52, -0.38, 5);
  sea.receiveShadow = true;
  scene.add(sea);

  const coast = new THREE.Mesh(
    new THREE.PlaneGeometry(58, 18, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xd7c59a, roughness: 0.86 })
  );
  coast.rotation.x = -Math.PI / 2;
  coast.rotation.z = -0.12;
  coast.position.set(-36, -0.22, -16);
  scene.add(coast);

  const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0xd4cec0, roughness: 0.65 });
  for (let i = 0; i < 22; i += 1) {
    const height = 0.45 + Math.random() * 1.2;
    const building = new THREE.Mesh(new THREE.BoxGeometry(0.7, height, 0.55), buildingMaterial);
    building.position.set(-28 - Math.random() * 20, height / 2 - 0.15, -8 + Math.random() * 22);
    scene.add(building);
  }

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(86, 32, 16),
    new THREE.MeshBasicMaterial({ color: 0x88a9bd, side: THREE.BackSide })
  );
  sky.position.set(0, 10, 0);
  scene.add(sky);
}

addBalconyAndLandscape();

function addCeilingLight(x, z) {
  const ring = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.08, 36),
    new THREE.MeshStandardMaterial({ color: 0x1e1d1a, roughness: 0.34 })
  );
  ring.position.set(x, room.height - 0.14, z);
  ring.castShadow = true;
  scene.add(ring);

  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.09, 36),
    new THREE.MeshStandardMaterial({ color: 0xfff1c5, emissive: 0xffdf9a, emissiveIntensity: 1.2 })
  );
  disc.position.set(x, room.height - 0.2, z);
  scene.add(disc);

  const light = new THREE.PointLight(0xffdfaa, 1.75, 15, 1.7);
  light.position.set(x, room.height - 0.45, z);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  scene.add(light);
}

function addPlant(x, z, scale = 1) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06 * scale, 0.1 * scale, 0.75 * scale, 10),
    new THREE.MeshStandardMaterial({ color: 0x6c4222, roughness: 0.8 })
  );
  trunk.position.set(x, 0.38 * scale, z);
  trunk.castShadow = true;
  scene.add(trunk);

  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x5f8b48, roughness: 0.75 });
  for (let i = 0; i < 9; i += 1) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.18 * scale, 0.85 * scale, 8), leafMaterial);
    leaf.position.set(x, 0.98 * scale, z);
    leaf.rotation.z = Math.PI / 2.7;
    leaf.rotation.y = (i / 9) * Math.PI * 2;
    leaf.castShadow = true;
    scene.add(leaf);
  }

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32 * scale, 0.24 * scale, 0.42 * scale, 18),
    new THREE.MeshStandardMaterial({ color: 0xb56f3d, roughness: 0.68 })
  );
  pot.position.set(x, 0.21 * scale, z);
  pot.castShadow = true;
  pot.receiveShadow = true;
  scene.add(pot);
}

function addSoftSeating() {
  const cushion = new THREE.MeshStandardMaterial({ color: 0xd49a3d, roughness: 0.82 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a4d27, roughness: 0.7 });
  addBox("window-bench-seat", new THREE.Vector3(4.4, 0.38, 1.05), new THREE.Vector3(-12.7, 0.42, 9.8), cushion, true, true);
  addBox("window-bench-base", new THREE.Vector3(4.6, 0.2, 1.15), new THREE.Vector3(-12.7, 0.18, 9.8), wood, true, true);
  addBox("window-bench-back", new THREE.Vector3(4.6, 1.0, 0.18), new THREE.Vector3(-12.7, 0.88, 10.38), cushion, true, true);
  addPlant(-13.8, -9.8, 1.2);
  addPlant(-13.6, 13.7, 1.1);
  addPlant(14.4, 7.2, 1.1);
}

addSoftSeating();

function makeVisitorMaterial(color) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

function makeVisitorSilhouetteTexture({ coat = "#171513", accent = "#2a2420", skin = "#b89976", style = "coat" }) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(0,0,0,.18)";
  context.beginPath();
  context.ellipse(256, 480, 118, 22, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = skin;
  context.beginPath();
  context.arc(256, style === "child" ? 122 : 104, style === "child" ? 34 : 31, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#11100e";
  context.beginPath();
  if (style === "coat") {
    context.ellipse(256, 76, 62, 13, 0, 0, Math.PI * 2);
    context.rect(229, 54, 54, 28);
  } else {
    context.arc(256, style === "child" ? 101 : 84, style === "child" ? 39 : 34, Math.PI, 0);
  }
  context.fill();

  const torsoTop = style === "child" ? 158 : 145;
  const torsoBottom = style === "child" ? 342 : 372;
  context.fillStyle = coat;
  context.beginPath();
  context.moveTo(205, torsoTop);
  context.lineTo(307, torsoTop);
  context.lineTo(332, torsoBottom);
  context.lineTo(286, torsoBottom);
  context.lineTo(273, 438);
  context.lineTo(238, 438);
  context.lineTo(226, torsoBottom);
  context.lineTo(180, torsoBottom);
  context.closePath();
  context.fill();

  context.fillStyle = accent;
  context.beginPath();
  context.moveTo(211, torsoTop + 22);
  context.lineTo(174, torsoTop + 112);
  context.lineTo(188, torsoTop + 128);
  context.lineTo(222, torsoTop + 58);
  context.closePath();
  context.moveTo(301, torsoTop + 22);
  context.lineTo(338, torsoTop + 112);
  context.lineTo(324, torsoTop + 128);
  context.lineTo(290, torsoTop + 58);
  context.closePath();
  context.fill();

  context.strokeStyle = "rgba(230,214,184,.22)";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(256, torsoTop + 12);
  context.lineTo(256, torsoBottom - 12);
  context.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function addGalleryVisitor({ name, color, accent = 0x1a1714, scale = 1, path, speed = 0.52, phase = 0, style = "coat" }) {
  const group = new THREE.Group();
  group.name = name;
  group.userData.path = path;
  group.userData.speed = speed;
  group.userData.phase = phase;
  group.userData.progress = phase;
  group.userData.collider = addCollider(path[0].x, path[0].z, 0.55 * scale, 0.55 * scale, {
    kind: "visitor",
    avoidRadius: 1.45 * scale,
  });

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.6 * scale, 28),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.025;
  group.add(shadow);

  const silhouetteTexture = makeVisitorSilhouetteTexture({
    coat: `#${color.toString(16).padStart(6, "0")}`,
    accent: `#${accent.toString(16).padStart(6, "0")}`,
    style,
  });
  const silhouetteMaterial = new THREE.MeshBasicMaterial({
    map: silhouetteTexture,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const height = style === "child" ? 1.28 * scale : 1.82 * scale;
  const width = style === "child" ? 0.72 * scale : 0.88 * scale;
  const front = new THREE.Mesh(new THREE.PlaneGeometry(width, height), silhouetteMaterial);
  front.position.y = height / 2;
  group.add(front);

  const side = front.clone();
  side.rotation.y = Math.PI / 2;
  group.add(side);

  group.position.set(path[0].x, 0, path[0].z);
  scene.add(group);
  galleryVisitors.push(group);
  return group;
}

function interpolateVisitorPath(path, progress) {
  const wrapped = ((progress % 1) + 1) % 1;
  const scaled = wrapped * path.length;
  const index = Math.floor(scaled) % path.length;
  const nextIndex = (index + 1) % path.length;
  const local = scaled - index;
  const from = path[index];
  const to = path[nextIndex];
  return {
    x: THREE.MathUtils.lerp(from.x, to.x, local),
    z: THREE.MathUtils.lerp(from.z, to.z, local),
    angle: Math.atan2(to.x - from.x, to.z - from.z),
  };
}

function updateGalleryVisitors(delta) {
  galleryVisitors.forEach((visitor, index) => {
    const path = visitor.userData.path;
    visitor.userData.progress += delta * visitor.userData.speed * 0.025;
    const pose = interpolateVisitorPath(path, visitor.userData.progress);
    visitor.position.set(pose.x, 0, pose.z);
    visitor.rotation.y = pose.angle;
    visitor.userData.collider.x = pose.x;
    visitor.userData.collider.z = pose.z;

    const breathingScale = 1 + Math.sin(performance.now() * 0.0018 + index) * 0.012;
    visitor.scale.setScalar(breathingScale);
  });
}

function addGalleryVisitors() {
  addGalleryVisitor({
    name: "gallery-visitor-woman",
    color: 0x26384c,
    accent: 0x111821,
    scale: 0.92,
    speed: 0.38,
    phase: 0.12,
    style: "jacket",
    path: [
      { x: -9.5, z: -13.0 },
      { x: -4.2, z: -13.7 },
      { x: -2.8, z: -7.4 },
      { x: -8.6, z: -6.2 },
    ],
  });
  addGalleryVisitor({
    name: "gallery-visitor-man",
    color: 0x332a24,
    accent: 0x14100e,
    scale: 1.06,
    speed: 0.3,
    phase: 0.44,
    style: "coat",
    path: [
      { x: 4.4, z: 12.2 },
      { x: 12.2, z: 12.2 },
      { x: 12.0, z: 4.0 },
      { x: 5.0, z: 5.2 },
    ],
  });
  addGalleryVisitor({
    name: "gallery-visitor-child",
    color: 0x5b613d,
    accent: 0x242716,
    scale: 0.66,
    speed: 0.46,
    phase: 0.7,
    style: "child",
    path: [
      { x: -11.4, z: 6.7 },
      { x: -7.2, z: 8.0 },
      { x: -8.2, z: 13.0 },
      { x: -12.2, z: 11.8 },
    ],
  });
}

addGalleryVisitors();

function addDoor({ name, x, z, rotationY = 0, target = null }) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(x, 0, z);
  group.rotation.y = rotationY;

  const leafGroup = new THREE.Group();
  leafGroup.position.set(-1.025, 1.62, 0);
  group.add(leafGroup);

  const door = new THREE.Mesh(new THREE.BoxGeometry(2.05, 3.25, 0.16), doorMaterial);
  door.position.set(1.025, 0, 0);
  door.castShadow = true;
  door.receiveShadow = true;
  leafGroup.add(door);
  if (target) {
    door.userData.target = target;
    door.userData.openableDoor = name;
    doorTargets.push(door);
  }
  if (name === "office-door") officeDoorLeaf = leafGroup;

  const trimTop = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.18, 0.22), doorTrimMaterial);
  trimTop.position.set(0, 3.34, 0.02);
  trimTop.castShadow = true;
  group.add(trimTop);

  const trimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.55, 0.22), doorTrimMaterial);
  trimLeft.position.set(-1.17, 1.75, 0.02);
  trimLeft.castShadow = true;
  group.add(trimLeft);

  const trimRight = trimLeft.clone();
  trimRight.position.x = 1.17;
  group.add(trimRight);

  const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xd6b36d, roughness: 0.28, metalness: 0.45 })
  );
  handle.position.set(1.75, -0.07, -0.12);
  leafGroup.add(handle);

  if (target) {
    const hit = new THREE.Mesh(
      new THREE.PlaneGeometry(3.05, 4.15),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide })
    );
    hit.position.set(0, 1.95, -0.22);
    hit.userData.target = target;
    hit.userData.openableDoor = name;
    group.add(hit);
    doorTargets.push(hit);
  }

  scene.add(group);
  return group;
}

addDoor({
  name: "office-door",
  x: 7.0,
  z: room.depth / 2 - 0.19,
  rotationY: 0,
  target: { x: 7.0, z: 21.5, yaw: 0 },
});

function addDoorSign({ text, x, z, rotationY = 0, y = 3.72, width = 1.8, height = 0.46, font = "900 58px Arial, sans-serif" }) {
  const signGroup = new THREE.Group();
  signGroup.position.set(x, y, z);
  signGroup.rotation.y = rotationY;

  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x171814, roughness: 0.48, metalness: 0.12 })
  );
  backing.castShadow = true;
  signGroup.add(backing);

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(width - 0.16, height - 0.12),
    new THREE.MeshBasicMaterial({
      map: makeSmallLabelTexture(text, {
        width: 512,
        height: 144,
        font,
        background: "#171814",
        color: "#e8dfcc",
      }),
      transparent: true,
      side: THREE.DoubleSide,
    })
  );
  face.position.set(0, 0, -0.052);
  face.scale.x = -1;
  signGroup.add(face);
  scene.add(signGroup);
}

addDoorSign({
  text: "OFFICE",
  x: 7.0,
  z: room.depth / 2 - 0.5,
  rotationY: 0,
});

addDoorSign({
  text: "TO ENTER CLICK ON THE DOOR",
  x: 7.0,
  z: room.depth / 2 - 0.54,
  rotationY: 0,
  y: 2.02,
  width: 1.34,
  height: 0.4,
  font: "900 24px Arial, sans-serif",
});

function addWayfindingSign() {
  const group = new THREE.Group();
  group.position.set(3.85, 2.75, room.depth / 2 - 0.42);
  group.rotation.y = 0;

  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.15, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x171814, roughness: 0.5, metalness: 0.1 })
  );
  backing.castShadow = true;
  backing.receiveShadow = true;
  group.add(backing);

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(2.22, 0.98),
    new THREE.MeshBasicMaterial({
      map: makeWayfindingTexture(),
      side: THREE.DoubleSide,
    })
  );
  face.position.set(0, 0, -0.061);
  face.scale.x = -1;
  group.add(face);

  scene.add(group);
}

addWayfindingSign();

addDoor({
  name: "toilet-door",
  x: 12.8,
  z: room.depth / 2 - 0.19,
  rotationY: 0,
});

function addOfficeRoom() {
  const officeWall = new THREE.MeshStandardMaterial({ color: 0x1c1e18, roughness: 0.76 });
  const shelfWood = new THREE.MeshStandardMaterial({ color: 0x6f4728, roughness: 0.62 });
  const paper = new THREE.MeshStandardMaterial({ color: 0xe8dfcc, roughness: 0.72 });

  addBox("office-floor", new THREE.Vector3(8.6, 0.14, 10.5), new THREE.Vector3(7.6, -0.05, 23.3), floorMaterial, false, true);
  addBox("office-back-wall", new THREE.Vector3(8.6, room.height, 0.22), new THREE.Vector3(7.6, room.height / 2, 28.55), officeWall);
  addBox("office-left-wall", new THREE.Vector3(0.22, room.height, 10.5), new THREE.Vector3(3.3, room.height / 2, 23.3), officeWall);
  addBox("office-right-wall", new THREE.Vector3(0.22, room.height, 10.5), new THREE.Vector3(11.9, room.height / 2, 23.3), officeWall);
  addBox("office-ceiling", new THREE.Vector3(8.6, 0.18, 10.5), new THREE.Vector3(7.6, room.height, 23.3), warmCeiling, false);

  addBox("office-desk", new THREE.Vector3(3.4, 0.18, 1.35), new THREE.Vector3(7.2, 0.84, 25.7), shelfWood, true, true);
  addBox("office-desk-leg-a", new THREE.Vector3(0.16, 0.76, 0.16), new THREE.Vector3(5.75, 0.42, 25.15), shelfWood, true, true);
  addBox("office-desk-leg-b", new THREE.Vector3(0.16, 0.76, 0.16), new THREE.Vector3(8.65, 0.42, 25.15), shelfWood, true, true);
  addBox("office-desk-leg-c", new THREE.Vector3(0.16, 0.76, 0.16), new THREE.Vector3(5.75, 0.42, 26.25), shelfWood, true, true);
  addBox("office-desk-leg-d", new THREE.Vector3(0.16, 0.76, 0.16), new THREE.Vector3(8.65, 0.42, 26.25), shelfWood, true, true);

  const officeDocs = [
    {
      title: "CV",
      pdf: "./assets/docs/cv.pdf?v=20260519-1",
      description: "CV\n\nDov Fuchs is a digital artist from Haifa, Israel. His work and biography are presented through his digital art practice, public exhibitions, and selected series.",
      sheetType: "cv",
      sheetEyebrow: "ARTISTIC CV",
      sheetTitle: "DOV FUCHS",
      sheetSubhead: "Digital artist | Haifa, Israel",
      sheetBody: "Digital artist working with staged imagination, altered portraiture, symbolic rooms, and psychological narrative. The CV connects the gallery to Dov Fuchs's public artistic profile, exhibition activity, online portfolio, and selected series.",
      sheetHighlights: ["Digital art and photo-manipulation", "Surreal self-portraiture", "Selected series and exhibitions"],
    },
    {
      title: "Artist Statement",
      pdf: "./assets/docs/artist-statement.pdf?v=20260518-3",
      description: "Artist Statement\n\nThe work moves through imaginary rooms, self-portraits, visual metaphors, altered realities, memory, humor, anxiety, and wonder. It treats digital construction as a way to stage inner experience rather than merely decorate an image.",
      sheetType: "statement",
      sheetEyebrow: "ARTIST STATEMENT",
      sheetTitle: "INNER|WORLD",
      sheetSubhead: "Images as rooms of thought",
      sheetBody: "The work builds scenes in which the psychological becomes visible: rooms, doubles, fragile bodies, walls, masks, and absurd events. Digital art becomes a theatre for memory, irony, anxiety, curiosity, and the unstable border between reality and invention.",
      sheetHighlights: ["Psychological narrative", "Constructed reality", "Digital visual theatre"],
    },
    {
      title: "About",
      pdf: "./assets/docs/about.pdf?v=20260518-3",
      description: "About\n\nDov Fuchs is a digital artist based in Haifa, Israel. His images combine photography, digital manipulation, staged spaces, self-portraiture, and narrative imagination.",
      sheetType: "about",
      sheetEyebrow: "ABOUT THE ARTIST",
      sheetTitle: "DOV|FUCHS",
      sheetSubhead: "Haifa-based digital artist",
      sheetBody: "Dov Fuchs creates digital images that mix personal mythology, theatrical scenes, altered interiors, and symbolic self-portraiture. The work often turns ordinary human states into strange rooms, impossible encounters, and visual stories.",
      sheetHighlights: ["Based in Haifa", "Digital art and image-making", "Narrative, memory, identity"],
    },
    {
      title: "Contact Information",
      label: "Contact",
      pdf: "./assets/docs/contact.html?v=20260518",
      description: "Contact Info\n\nDov Fuchs\nfuchsd@netvision.net.il\nhttps://dovfuchs.art/\nhttps://www.instagram.com/dovfuchs/\nhttps://1x.com/DovFuchs",
      contactSheet: true,
    },
    {
      title: "Price List",
      pdf: "./assets/docs/price-list.pdf?v=20260518-3",
      description: "Price List\n\nThe images are Photoshop compositions combining self-photographs and graphic elements created by the artist, after complex digital processing.\n\nEach work is printed on high-quality photographic paper and mounted on 3 mm Dibond, an aluminum-based display panel made of two thin aluminum sheets with a thermoplastic core. A hanging fixture is attached to the back.\n\nMain exhibition sizes:\n60 x 60 cm: limited edition of 7. Price: NIS 1,500.\n80 x 80 cm: limited edition of 3. Price: NIS 2,500.\n\nOther sizes may be possible by request. Each limited-edition work includes a numbered Certificate of Authenticity signed by the artist.",
      sheetType: "price",
      sheetEyebrow: "PRICE LIST",
      sheetTitle: "LIMITED|EDITIONS",
      sheetSubhead: "Printed works on Dibond",
      sheetBody: "Photoshop compositions combining self-photographs and artist-created graphic elements. Each work is printed on high-quality photographic paper and mounted on 3 mm Dibond, with a hanging fixture attached to the back.",
      sheetHighlights: ["60 x 60 cm: edition of 7 - NIS 1,500", "80 x 80 cm: edition of 3 - NIS 2,500", "Signed numbered CoA included"],
    },
    {
      title: "Visitor's Book",
      label: "Visitor Book",
      pdf: "./assets/docs/visitor-book.html?v=20260518",
      description: "Visitor's Book\n\nA place for gallery visitors to leave comments, impressions, and short notes from their visit.",
    },
  ];

  officeDocs.forEach((documentInfo, index) => {
    const docX = 5.7 + index * 0.58;
    const docRotation = -0.18 + index * 0.065;
    const doc = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.03, 0.82),
      paper
    );
    doc.position.set(docX, 0.96, 25.7);
    doc.rotation.y = docRotation;
    doc.castShadow = true;
    doc.userData.art = documentInfo;
    doc.userData.pdf = documentInfo.pdf;
    infoButtons.push(doc);
    officeDocMeshes.push(doc);
    scene.add(doc);

    const labelBacking = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.24, 0.035),
      new THREE.MeshStandardMaterial({ color: 0x10110f, roughness: 0.48, metalness: 0.08 })
    );
    labelBacking.position.set(docX, 1.15, 25.03);
    labelBacking.rotation.x = -0.42;
    labelBacking.castShadow = true;
    scene.add(labelBacking);

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.53, 0.18),
      new THREE.MeshBasicMaterial({
        map: makeSmallLabelTexture(documentInfo.label || documentInfo.title, {
          ...galleryLabelStyle,
          font: "900 34px Arial, sans-serif",
        }),
        side: THREE.DoubleSide,
      })
    );
    label.position.set(docX, 1.15, 24.995);
    label.rotation.x = -0.42;
    label.scale.x = -1;
    label.userData.art = documentInfo;
    label.userData.pdf = documentInfo.pdf;
    infoButtons.push(label);
    officeDocMeshes.push(label);
    scene.add(label);
  });

  addBox("office-shelf", new THREE.Vector3(3.3, 0.16, 0.42), new THREE.Vector3(10.2, 2.4, 27.95), shelfWood, true, true);
  addBox("office-shelf-2", new THREE.Vector3(3.3, 0.16, 0.42), new THREE.Vector3(10.2, 3.1, 27.95), shelfWood, true, true);

  const officeLight = new THREE.PointLight(0xffdfaa, 1.15, 10, 1.8);
  officeLight.position.set(7.6, 4.6, 23.6);
  scene.add(officeLight);
}

addOfficeRoom();

function addGallerySign() {
  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(10.8, 2.35, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x0c0d0b, roughness: 0.58 })
  );
  backing.position.set(0, 3.42, -17.74);
  backing.castShadow = true;
  backing.receiveShadow = true;
  scene.add(backing);

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(10.2, 2.05),
    new THREE.MeshBasicMaterial({
      map: makeLargeWallSignTexture(),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  face.position.set(0, 3.43, -17.62);
  scene.add(face);

  const rimMaterial = new THREE.MeshStandardMaterial({ color: 0x987546, roughness: 0.42, metalness: 0.12 });
  addBox("large-sign-top-rim", new THREE.Vector3(10.9, 0.08, 0.12), new THREE.Vector3(0, 4.62, -17.54), rimMaterial, true, true);
  addBox("large-sign-bottom-rim", new THREE.Vector3(10.9, 0.08, 0.12), new THREE.Vector3(0, 2.22, -17.54), rimMaterial, true, true);

  const signLight = new THREE.PointLight(0xffdfaa, 1.2, 12, 1.8);
  signLight.position.set(0, 4.3, -13.2);
  scene.add(signLight);
}

function addElectronicBoard() {
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x10110f, roughness: 0.38, metalness: 0.18 });
  const seriesReview = {
    title: "Portraits of the Inner World",
    description: "This series treats the self as a place of fragments, echoes, false memories, pressure, escape, and reconstruction. The images do not describe a single portrait subject; they stage inner states as rooms, ruptures, masks, and emotional weather.",
  };
  const frame = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.85, 0.2), frameMaterial);
  frame.position.set(9.2, 2.85, 7.92);
  frame.rotation.y = 0;
  frame.castShadow = true;
  frame.receiveShadow = true;
  scene.add(frame);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(4.35, 2.42),
    new THREE.MeshBasicMaterial({ map: makeExhibitionBoardTexture(), side: THREE.DoubleSide })
  );
  screen.position.set(9.2, 2.85, 7.78);
  screen.rotation.y = 0;
  screen.scale.x = -1;
  scene.add(screen);

  const infoButton = new THREE.Mesh(
    new THREE.CircleGeometry(0.18, 32),
    new THREE.MeshBasicMaterial({ map: makeInfoIconTexture(), transparent: true, side: THREE.DoubleSide })
  );
  infoButton.position.set(11.02, 1.82, 7.76);
  infoButton.userData.art = seriesReview;
  scene.add(infoButton);
  infoButtons.push(infoButton);

  const glow = new THREE.PointLight(0xa9bd73, 0.7, 8, 2.1);
  glow.position.set(9.2, 2.9, 5.1);
  scene.add(glow);
}

addGallerySign();
addElectronicBoard();

function addBulletinBoard() {
  const group = new THREE.Group();
  group.position.set(9.2, 2.9, 9.18);
  group.rotation.y = Math.PI;

  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x10110f, roughness: 0.38, metalness: 0.2 });
  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(5.25, 3.18, 0.16),
    frameMaterial
  );
  backing.castShadow = true;
  backing.receiveShadow = true;
  group.add(backing);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(4.85, 2.78),
    new THREE.MeshBasicMaterial({
      map: makeBulletinBoardTexture(),
      side: THREE.DoubleSide,
    })
  );
  screen.position.set(0, 0, -0.092);
  screen.scale.x = -1;
  group.add(screen);

  const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xb68a52, roughness: 0.42, metalness: 0.14 });
  const topRim = new THREE.Mesh(new THREE.BoxGeometry(5.42, 0.1, 0.22), rimMaterial);
  topRim.position.set(0, 1.62, -0.03);
  const bottomRim = topRim.clone();
  bottomRim.position.set(0, -1.62, -0.03);
  const leftRim = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.28, 0.22), rimMaterial);
  leftRim.position.set(-2.72, 0, -0.03);
  const rightRim = leftRim.clone();
  rightRim.position.set(2.72, 0, -0.03);
  [topRim, bottomRim, leftRim, rightRim].forEach((rim) => {
    rim.castShadow = true;
    group.add(rim);
  });

  scene.add(group);

  const boardLight = new THREE.PointLight(0xa9bd73, 0.52, 7, 2.2);
  boardLight.position.set(9.2, 3.6, 12.1);
  scene.add(boardLight);
}

addBulletinBoard();

function addOtherSeriesWall() {
  const loader = new THREE.TextureLoader();
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xb68a52, roughness: 0.44, metalness: 0.08 });
  const matBoardMaterial = new THREE.MeshStandardMaterial({ color: 0x171814, roughness: 0.7 });
  const infoIconTexture = makeInfoIconTexture();

  const sign = new THREE.Group();
  sign.position.set(0.53, 4.05, 0.4);
  sign.rotation.y = Math.PI / 2;
  const signBack = new THREE.Mesh(
    new THREE.BoxGeometry(4.45, 0.76, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x10110f, roughness: 0.48, metalness: 0.12 })
  );
  signBack.castShadow = true;
  sign.add(signBack);
  const signFace = new THREE.Mesh(
    new THREE.PlaneGeometry(4.22, 0.56),
    new THREE.MeshBasicMaterial({
      map: makeOtherSeriesSignTexture(),
      side: THREE.DoubleSide,
    })
  );
  signFace.position.set(0, 0, -0.052);
  signFace.scale.x = -1;
  sign.add(signFace);
  scene.add(sign);

  otherSeries.forEach((series, index) => {
    const group = new THREE.Group();
    group.name = `series-index-${index + 1}`;
    group.position.set(0.53, 2.78, -4.7 + index * 2.55);
    group.rotation.y = Math.PI / 2;

    const back = new THREE.Mesh(new THREE.BoxGeometry(1.32, 1.32, 0.08), matBoardMaterial);
    back.castShadow = true;
    back.receiveShadow = true;
    group.add(back);

    const imageTexture = loader.load(series.image);
    imageTexture.colorSpace = THREE.SRGBColorSpace;
    imageTexture.minFilter = THREE.LinearFilter;
    imageTexture.magFilter = THREE.LinearFilter;
    const image = new THREE.Mesh(
      new THREE.PlaneGeometry(1.06, 1.06),
      new THREE.MeshBasicMaterial({ map: imageTexture, side: THREE.DoubleSide })
    );
    image.position.set(0, 0.08, -0.052);
    image.userData.art = series;
    group.add(image);
    artworkMeshes.push(image);

    const top = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.07, 0.13), frameMaterial);
    top.position.set(0, 0.7, -0.02);
    group.add(top);
    const bottom = top.clone();
    bottom.position.y = -0.62;
    group.add(bottom);
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.44, 0.13), frameMaterial);
    left.position.set(-0.72, 0.04, -0.02);
    group.add(left);
    const right = left.clone();
    right.position.x = 0.72;
    group.add(right);

    const titleLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.42, 0.26),
      new THREE.MeshBasicMaterial({
        map: makeSmallLabelTexture(series.title, {
          ...galleryLabelStyle,
          width: 512,
          height: 128,
          font: "900 28px Sora, Arial, sans-serif",
        }),
        side: THREE.DoubleSide,
      })
    );
    titleLabel.position.set(0, -0.88, -0.06);
    titleLabel.scale.x = -1;
    group.add(titleLabel);

    const infoButton = new THREE.Mesh(
      new THREE.CircleGeometry(0.11, 32),
      new THREE.MeshBasicMaterial({ map: infoIconTexture, transparent: true, side: THREE.DoubleSide })
    );
    infoButton.position.set(0.62, -0.88, -0.085);
    infoButton.userData.art = series;
    group.add(infoButton);
    infoButtons.push(infoButton);

    scene.add(group);
  });
}

addOtherSeriesWall();

function addTodayExhibitionFrames() {
  const loader = new THREE.TextureLoader();
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xb68a52, roughness: 0.44, metalness: 0.08 });
  const matBoardMaterial = new THREE.MeshStandardMaterial({ color: 0x171814, roughness: 0.7 });
  const infoIconTexture = makeInfoIconTexture();
  const positions = [
    ...Array.from({ length: 6 }, (_, index) => ({
      x: 1.87,
      z: -5.1 + index * 2.05,
      y: 2.9,
      rotationY: -Math.PI / 2,
      surfaceOffset: -0.052,
    })),
    ...Array.from({ length: 6 }, (_, index) => ({
      x: 15.78,
      z: -5.0 + index * 2.05,
      y: 2.9,
      rotationY: -Math.PI / 2,
      surfaceOffset: 0.052,
    })),
  ];

  positions.forEach((spot, index) => {
    const art = todaysExhibition[index % todaysExhibition.length];

    const group = new THREE.Group();
    group.name = `today-frame-${index + 1}`;
    group.position.set(spot.x, spot.y, spot.z);
    group.rotation.y = spot.rotationY;

    const back = new THREE.Mesh(new THREE.BoxGeometry(1.72, 1.72, 0.08), matBoardMaterial);
    back.position.set(0, 0, 0);
    back.castShadow = true;
    back.receiveShadow = true;
    group.add(back);

    const imageTexture = loader.load(art.image);
    imageTexture.colorSpace = THREE.SRGBColorSpace;
    imageTexture.minFilter = THREE.LinearFilter;
    imageTexture.magFilter = THREE.LinearFilter;
    const image = new THREE.Mesh(
      new THREE.PlaneGeometry(1.38, 1.38),
      new THREE.MeshBasicMaterial({ map: imageTexture, side: THREE.DoubleSide })
    );
    image.position.set(0, 0.1, spot.surfaceOffset);
    image.userData.art = art;
    group.add(image);
    artworkMeshes.push(image);

    const top = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.09, 0.14), frameMaterial);
    top.position.set(0, 0.91, -0.02);
    group.add(top);
    const bottom = top.clone();
    bottom.position.y = -0.81;
    group.add(bottom);
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.86, 0.14), frameMaterial);
    left.position.set(-0.93, 0.04, -0.02);
    group.add(left);
    const right = left.clone();
    right.position.x = 0.93;
    group.add(right);

    const infoButton = new THREE.Mesh(
      new THREE.CircleGeometry(0.125, 32),
      new THREE.MeshBasicMaterial({ map: infoIconTexture, transparent: true, side: THREE.DoubleSide })
    );
    infoButton.position.set(0, -1.08, spot.surfaceOffset * 1.7);
    infoButton.userData.art = art;
    group.add(infoButton);
    infoButtons.push(infoButton);

    scene.add(group);
  });
}

addTodayExhibitionFrames();

function addP3FeatureAndBio() {
  const loader = new THREE.TextureLoader();
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xb68a52, roughness: 0.44, metalness: 0.08 });
  const matBoardMaterial = new THREE.MeshStandardMaterial({ color: 0x171814, roughness: 0.7 });
  const infoIconTexture = makeInfoIconTexture();

  const monthGroup = new THREE.Group();
  monthGroup.name = "p3-image-of-the-month";
  monthGroup.position.set(-7.02, 2.68, -4.5);
  monthGroup.rotation.y = -Math.PI / 2;

  const monthSign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.7, 0.42),
    new THREE.MeshBasicMaterial({
      map: makeSmallLabelTexture("IMAGE OF THE MONTH", {
        width: 768,
        height: 128,
        font: "900 38px Sora, Arial, sans-serif",
        background: "#10110f",
        color: "#e8dfcc",
        border: "rgba(169,189,115,.68)",
      }),
      side: THREE.DoubleSide,
    })
  );
  monthSign.position.set(0, 2.18, -0.06);
  monthSign.scale.x = -1;
  monthGroup.add(monthSign);

  const monthBack = new THREE.Mesh(new THREE.BoxGeometry(3.56, 3.56, 0.08), matBoardMaterial);
  monthBack.castShadow = true;
  monthBack.receiveShadow = true;
  monthGroup.add(monthBack);

  const monthTexture = loader.load(imageOfTheMonth.image);
  monthTexture.colorSpace = THREE.SRGBColorSpace;
  monthTexture.minFilter = THREE.LinearFilter;
  monthTexture.magFilter = THREE.LinearFilter;
  const monthImage = new THREE.Mesh(
    new THREE.PlaneGeometry(2.84, 2.84),
    new THREE.MeshBasicMaterial({ map: monthTexture, side: THREE.DoubleSide })
  );
  monthImage.position.set(0, 0.08, -0.052);
  monthImage.scale.x = -1;
  monthImage.userData.art = imageOfTheMonth;
  monthGroup.add(monthImage);
  artworkMeshes.push(monthImage);

  const monthTop = new THREE.Mesh(new THREE.BoxGeometry(3.84, 0.12, 0.16), frameMaterial);
  monthTop.position.set(0, 1.84, -0.02);
  monthGroup.add(monthTop);
  const monthBottom = monthTop.clone();
  monthBottom.position.y = -1.74;
  monthGroup.add(monthBottom);
  const monthLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.84, 0.16), frameMaterial);
  monthLeft.position.set(-1.92, 0.04, -0.02);
  monthGroup.add(monthLeft);
  const monthRight = monthLeft.clone();
  monthRight.position.x = 1.92;
  monthGroup.add(monthRight);

  const monthLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(3.28, 0.3),
    new THREE.MeshBasicMaterial({
      map: makeSmallLabelTexture(imageOfTheMonth.title, {
        ...galleryLabelStyle,
        width: 768,
        height: 128,
        font: "900 28px Sora, Arial, sans-serif",
      }),
      side: THREE.DoubleSide,
    })
  );
  monthLabel.position.set(0, -2.08, -0.06);
  monthLabel.scale.x = -1;
  monthGroup.add(monthLabel);

  const monthInfo = new THREE.Mesh(
    new THREE.CircleGeometry(0.12, 32),
    new THREE.MeshBasicMaterial({ map: infoIconTexture, transparent: true, side: THREE.DoubleSide })
  );
  monthInfo.position.set(1.58, -2.08, -0.09);
  monthInfo.userData.art = imageOfTheMonth;
  monthGroup.add(monthInfo);
  infoButtons.push(monthInfo);
  scene.add(monthGroup);

  const bioGroup = new THREE.Group();
  bioGroup.name = "p3-dov-fuchs-bio";
  bioGroup.position.set(-8.18, 2.85, -4.5);
  bioGroup.rotation.y = Math.PI / 2;

  const portraitTexture = loader.load(artistBio.image);
  portraitTexture.colorSpace = THREE.SRGBColorSpace;
  portraitTexture.minFilter = THREE.LinearFilter;
  portraitTexture.magFilter = THREE.LinearFilter;
  const portraitBack = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 0.08), matBoardMaterial);
  portraitBack.position.set(-1.42, 0.1, 0);
  bioGroup.add(portraitBack);
  const portrait = new THREE.Mesh(
    new THREE.PlaneGeometry(2.04, 2.04),
    new THREE.MeshBasicMaterial({ map: portraitTexture, side: THREE.DoubleSide })
  );
  portrait.position.set(-1.42, 0.18, -0.052);
  portrait.userData.art = artistBio;
  bioGroup.add(portrait);
  artworkMeshes.push(portrait);

  const portraitInfo = new THREE.Mesh(
    new THREE.CircleGeometry(0.12, 32),
    new THREE.MeshBasicMaterial({ map: infoIconTexture, transparent: true, side: THREE.DoubleSide })
  );
  portraitInfo.position.set(-0.46, -1.17, -0.08);
  portraitInfo.userData.art = {
    title: "The Fall",
    description: "Artist image for this wall. This piece will serve here as the visual introduction to Dov Fuchs; the final interpretive note can be added later.",
    image: artistBio.image,
  };
  bioGroup.add(portraitInfo);
  infoButtons.push(portraitInfo);

  const bioPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.95, 1.95),
    new THREE.MeshBasicMaterial({ map: makeBioPanelTexture(), side: THREE.DoubleSide })
  );
  bioPanel.position.set(1.24, 0.12, -0.052);
  bioPanel.scale.x = -1;
  bioGroup.add(bioPanel);

  const bioInfo = new THREE.Mesh(
    new THREE.CircleGeometry(0.12, 32),
    new THREE.MeshBasicMaterial({ map: infoIconTexture, transparent: true, side: THREE.DoubleSide })
  );
  bioInfo.position.set(2.08, -1.08, -0.08);
  bioInfo.userData.art = artistBio;
  bioGroup.add(bioInfo);
  infoButtons.push(bioInfo);
  scene.add(bioGroup);
}

addP3FeatureAndBio();

function addFallingFigureSculpture() {
  const group = new THREE.Group();
  group.name = "the-fall-sculpture-study";
  group.position.set(-11.15, 0.02, -10.1);
  group.rotation.y = -0.42;

  const bronze = new THREE.MeshStandardMaterial({
    color: 0x8b6238,
    roughness: 0.36,
    metalness: 0.78,
  });
  const bronzeDark = new THREE.MeshStandardMaterial({ color: 0x403021, roughness: 0.48, metalness: 0.72 });
  const bronzeLight = new THREE.MeshStandardMaterial({ color: 0xb48a54, roughness: 0.32, metalness: 0.74 });
  const darkBronze = new THREE.MeshStandardMaterial({
    color: 0x1d1813,
    roughness: 0.56,
    metalness: 0.76,
    side: THREE.DoubleSide,
  });
  const clockMetal = new THREE.MeshStandardMaterial({
    color: 0xc09a5f,
    roughness: 0.3,
    metalness: 0.82,
  });
  const stone = new THREE.MeshStandardMaterial({ color: 0x12120f, roughness: 0.84, metalness: 0.08 });
  const supportMaterial = new THREE.MeshStandardMaterial({
    color: 0x9a8d74,
    roughness: 0.3,
    metalness: 0.42,
    transparent: true,
    opacity: 0.42,
  });

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.18, 1.55), stone);
  plinth.position.y = 0.09;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.92, 0.58, 44), stone);
  pedestal.position.y = 0.47;
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  group.add(pedestal);

  const support = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.7, 14), supportMaterial);
  support.position.set(-0.18, 1.48, 0.08);
  support.rotation.z = -0.26;
  support.castShadow = true;
  group.add(support);

  const figure = new THREE.Group();
  figure.position.set(0.08, 2.05, -0.12);
  figure.rotation.set(-0.22, 0.1, -0.46);
  group.add(figure);

  const capsuleGeometry = (radius, length) => {
    if (THREE.CapsuleGeometry) return new THREE.CapsuleGeometry(radius, Math.max(length - radius * 2, 0.02), 8, 22);
    return new THREE.CylinderGeometry(radius * 0.72, radius, length, 20);
  };

  const addLimb = (parent, start, end, radius, material) => {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const mesh = new THREE.Mesh(capsuleGeometry(radius, length), material);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  addLimb(figure, new THREE.Vector3(-0.1, -0.42, 0.02), new THREE.Vector3(0.56, 0.34, -0.22), 0.2, bronze);

  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 20), bronze);
  chest.position.set(0.42, 0.2, -0.16);
  chest.scale.set(1.1, 1.36, 0.74);
  chest.rotation.z = -0.62;
  chest.castShadow = true;
  figure.add(chest);

  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.24, 26, 16), bronzeDark);
  pelvis.position.set(-0.22, -0.52, 0.02);
  pelvis.scale.set(1.25, 0.74, 0.88);
  pelvis.rotation.z = -0.4;
  pelvis.castShadow = true;
  figure.add(pelvis);

  addLimb(figure, new THREE.Vector3(0.52, 0.26, -0.14), new THREE.Vector3(-1.02, 0.64, 0.02), 0.07, bronzeLight);
  addLimb(figure, new THREE.Vector3(-1.02, 0.64, 0.02), new THREE.Vector3(-1.56, 0.34, -0.06), 0.055, bronzeLight);
  addLimb(figure, new THREE.Vector3(0.54, 0.22, -0.16), new THREE.Vector3(1.3, -0.08, 0.18), 0.075, bronzeLight);
  addLimb(figure, new THREE.Vector3(1.3, -0.08, 0.18), new THREE.Vector3(1.72, -0.5, 0.38), 0.055, bronzeLight);
  addLimb(figure, new THREE.Vector3(-0.22, -0.54, 0.0), new THREE.Vector3(-0.94, -1.07, -0.32), 0.09, bronzeDark);
  addLimb(figure, new THREE.Vector3(-0.94, -1.07, -0.32), new THREE.Vector3(-1.22, -1.66, -0.08), 0.075, bronzeDark);
  addLimb(figure, new THREE.Vector3(-0.04, -0.54, -0.02), new THREE.Vector3(0.68, -1.04, 0.28), 0.095, bronzeDark);
  addLimb(figure, new THREE.Vector3(0.68, -1.04, 0.28), new THREE.Vector3(1.22, -1.36, 0.02), 0.075, bronzeDark);

  [
    [-1.62, 0.3, -0.06, 0.09],
    [1.76, -0.53, 0.38, 0.09],
    [-1.24, -1.72, -0.08, 0.12],
    [1.28, -1.4, 0.02, 0.12],
  ].forEach(([x, y, z, radius]) => {
    const end = new THREE.Mesh(new THREE.SphereGeometry(radius, 18, 12), bronzeLight);
    end.position.set(x, y, z);
    end.scale.z = 0.7;
    end.castShadow = true;
    figure.add(end);
  });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 28, 18), bronze);
  head.position.set(0.76, 0.58, -0.3);
  head.scale.set(0.82, 1.08, 0.86);
  head.rotation.z = 0.16;
  head.castShadow = true;
  figure.add(head);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 12), bronzeLight);
  nose.position.set(0.9, 0.58, -0.34);
  nose.rotation.z = -Math.PI / 2;
  nose.castShadow = true;
  figure.add(nose);

  const cloakShape = new THREE.Shape();
  cloakShape.moveTo(-0.2, 0.55);
  cloakShape.bezierCurveTo(-1.1, 0.58, -1.65, 0.18, -1.92, -0.24);
  cloakShape.bezierCurveTo(-1.18, -0.46, -0.74, -1.04, -0.34, -1.58);
  cloakShape.bezierCurveTo(0.3, -1.22, 0.96, -0.76, 1.34, -0.18);
  cloakShape.bezierCurveTo(0.92, 0.14, 0.42, 0.46, -0.2, 0.55);
  cloakShape.closePath();
  const cloak = new THREE.Mesh(
    new THREE.ExtrudeGeometry(cloakShape, { depth: 0.045, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025 }),
    darkBronze
  );
  cloak.position.set(-0.08, 0.06, 0.13);
  cloak.rotation.set(-0.72, 0.12, -0.08);
  cloak.scale.set(1.02, 0.98, 1);
  cloak.castShadow = true;
  figure.add(cloak);

  const scarf = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.035, 10, 48, Math.PI * 1.45),
    darkBronze
  );
  scarf.position.set(0.53, 0.41, -0.18);
  scarf.rotation.set(0.6, 0.2, -0.7);
  scarf.castShadow = true;
  figure.add(scarf);

  const clockRing = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.035, 12, 96), clockMetal);
  clockRing.position.set(0.08, 2.18, -0.9);
  clockRing.rotation.set(0.28, 0.26, 0.2);
  clockRing.castShadow = true;
  group.add(clockRing);

  for (let i = 0; i < 12; i += 1) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.04, i % 3 === 0 ? 0.2 : 0.12, 0.025), clockMetal);
    const angle = (i / 12) * Math.PI * 2;
    tick.position.set(0.08 + Math.cos(angle) * 0.86, 2.18 + Math.sin(angle) * 0.86, -0.9);
    tick.rotation.z = angle;
    tick.castShadow = true;
    group.add(tick);
  }

  const secondaryRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.025, 10, 64, Math.PI * 1.35), clockMetal);
  secondaryRing.position.set(-0.96, 2.82, -0.66);
  secondaryRing.rotation.set(0.84, -0.42, 0.75);
  secondaryRing.castShadow = true;
  group.add(secondaryRing);

  const fragmentPositions = [
    [-1.18, 2.66, -0.72, 0.22],
    [1.28, 2.48, -0.82, 0.18],
    [1.48, 1.42, -0.58, 0.16],
    [-0.55, 3.08, -0.92, 0.14],
    [0.82, 3.0, -1.2, 0.12],
  ];
  fragmentPositions.forEach(([x, y, z, size], index) => {
    const fragment = new THREE.Mesh(new THREE.TorusGeometry(size, 0.015, 8, 36, Math.PI * 1.35), clockMetal);
    fragment.position.set(x, y, z);
    fragment.rotation.set(index * 0.5, index * 0.36, index * 0.42);
    fragment.castShadow = true;
    group.add(fragment);
  });

  const chainMaterial = new THREE.MeshStandardMaterial({ color: 0x26150d, roughness: 0.5, metalness: 0.7 });
  for (let i = 0; i < 7; i += 1) {
    const link = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.016, 8, 24), chainMaterial);
    link.position.set(-1.54, 2.72 - i * 0.18, -0.22);
    link.rotation.set(Math.PI / 2, 0, i % 2 ? Math.PI / 2 : 0);
    link.castShadow = true;
    group.add(link);
  }

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(2.05, 0.34),
    new THREE.MeshBasicMaterial({
      map: makeSmallLabelTexture("THE FALL - SCULPTURE STUDY", {
        ...galleryLabelStyle,
        width: 900,
        height: 160,
        font: "900 34px Sora, Arial, sans-serif",
      }),
      side: THREE.DoubleSide,
    })
  );
  label.position.set(0, 0.88, 1.02);
  label.rotation.x = -0.18;
  group.add(label);

  const infoButton = new THREE.Mesh(
    new THREE.CircleGeometry(0.13, 32),
    new THREE.MeshBasicMaterial({ map: makeInfoIconTexture(), transparent: true, side: THREE.DoubleSide })
  );
  infoButton.position.set(1.15, 0.88, 1.03);
  infoButton.userData.art = {
    title: "The Fall - Sculpture Study",
    description:
      "A procedural 3D sculpture study based on The Fall: a suspended bronze body, a dark coat caught in motion, and clock fragments collapsing around the figure. It is still a code-built prototype, but closer to the intended statue before moving to a dedicated 3D model.",
  };
  group.add(infoButton);
  infoButtons.push(infoButton);

  const sculptureLight = new THREE.PointLight(0xffd39b, 1.75, 9, 1.7);
  sculptureLight.position.set(-1.15, 3.8, 1.45);
  group.add(sculptureLight);

  scene.add(group);
}

[
  [-10, -12],
  [-3, -12],
  [4, -12],
  [11, -12],
  [-10, -4],
  [-2, -3],
  [7, -2],
  [13, 3],
  [-10, 7],
  [-2, 9],
  [8, 12],
].forEach(([x, z]) => addCeilingLight(x, z));

const ambient = new THREE.HemisphereLight(0xf8ead6, 0x6b3d21, 0.58);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffd49a, 1.65);
sun.position.set(-16, 8, -9);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -20;
sun.shadow.camera.right = 20;
sun.shadow.camera.top = 20;
sun.shadow.camera.bottom = -20;
scene.add(sun);

async function toggleSoundtrack() {
  soundtrackOn = !soundtrackOn;
  if (!soundtrackOn) {
    soundtrack.pause();
    soundToggle.textContent = "Sound Off";
    soundToggle.classList.remove("is-on");
    return;
  }

  soundtrack.src = soundtrackTracks[soundtrackTrackIndex];
  try {
    await soundtrack.play();
    soundToggle.textContent = "Sound On";
    soundToggle.classList.add("is-on");
  } catch {
    soundtrackOn = false;
    soundToggle.textContent = "Sound blocked";
    soundToggle.classList.remove("is-on");
  }
}

function resetCamera() {
  camera.position.set(startingPoint.x, startingPoint.y, startingPoint.z);
  yaw = startingPoint.yaw;
  pitch = 0;
  moveTarget = null;
  officeDoorOpen = false;
}

function goToBeginning() {
  resetCamera();
  intro.classList.add("hidden");
  closeArtworkInfo();
  closeLargeImage();
}

function goToOffice() {
  intro.classList.add("hidden");
  closeArtworkInfo();
  closeLargeImage();
  officeDoorOpen = true;
  moveTarget = { x: 7.0, z: 21.5, yaw: 0 };
}

function goToBulletinBoard() {
  intro.classList.add("hidden");
  closeArtworkInfo();
  closeLargeImage();
  moveTarget = { x: 9.2, z: 12.5, yaw: 0 };
}

function drawMiniMap() {
  const width = miniMap.width;
  const height = miniMap.height;
  const margin = 16;
  const world = {
    minX: -17.2,
    maxX: 17.2,
    minZ: -19.2,
    maxZ: 29.2,
  };
  const mapWidth = width - margin * 2;
  const mapHeight = height - margin * 2;
  const toMapX = (x) => margin + ((x - world.minX) / (world.maxX - world.minX)) * mapWidth;
  const toMapY = (z) => margin + ((world.maxZ - z) / (world.maxZ - world.minZ)) * mapHeight;

  const drawWorldRect = (x, z, rectWidth, rectDepth, fill, stroke = "rgba(244,239,228,.16)") => {
    const x1 = toMapX(x - rectWidth / 2);
    const x2 = toMapX(x + rectWidth / 2);
    const y1 = toMapY(z + rectDepth / 2);
    const y2 = toMapY(z - rectDepth / 2);
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    const top = Math.min(y1, y2);
    const bottom = Math.max(y1, y2);
    miniMapContext.fillStyle = fill;
    miniMapContext.fillRect(left, top, right - left, bottom - top);
    miniMapContext.strokeStyle = stroke;
    miniMapContext.lineWidth = 1;
    miniMapContext.strokeRect(left, top, right - left, bottom - top);
  };

  const drawPartition = (number, x, z, rectWidth, rectDepth) => {
    drawWorldRect(x, z, rectWidth, rectDepth, "rgba(244,239,228,.22)");
    const labelX = toMapX(x);
    const labelY = toMapY(z);
    miniMapContext.fillStyle = "#a9bd73";
    miniMapContext.beginPath();
    miniMapContext.arc(labelX, labelY, 9, 0, Math.PI * 2);
    miniMapContext.fill();
    miniMapContext.fillStyle = "#10110f";
    miniMapContext.font = "900 12px Sora, Arial, sans-serif";
    miniMapContext.textAlign = "center";
    miniMapContext.textBaseline = "middle";
    miniMapContext.fillText(number, labelX, labelY + 0.5);
    miniMapContext.textBaseline = "alphabetic";
  };

  const drawWallLabel = (label, x, z) => {
    const labelX = toMapX(x);
    const labelY = toMapY(z);
    miniMapContext.fillStyle = "#d6b36d";
    miniMapContext.fillRect(labelX - 11, labelY - 7, 22, 14);
    miniMapContext.fillStyle = "#10110f";
    miniMapContext.font = "900 8px Sora, Arial, sans-serif";
    miniMapContext.textAlign = "center";
    miniMapContext.textBaseline = "middle";
    miniMapContext.fillText(label, labelX, labelY + 0.5);
    miniMapContext.textBaseline = "alphabetic";
  };

  miniMapContext.clearRect(0, 0, width, height);
  miniMapContext.fillStyle = "rgba(10, 10, 9, .82)";
  miniMapContext.fillRect(0, 0, width, height);

  drawWorldRect(0, 0, room.halfWidth * 2, room.depth, "rgba(244,239,228,.07)", "rgba(244,239,228,.35)");
  drawWorldRect(7.6, 23.3, 8.6, 10.5, "rgba(169,189,115,.09)", "rgba(169,189,115,.35)");
  drawPartition("1", 1.2, 0.4, 1.2, 12.4);
  drawPartition("2", 9.2, 8.6, 7.4, 1.1);
  drawPartition("3", -7.6, -4.5, 1.1, 8);
  drawWorldRect(7.6, 18.0, 2.35, 0.26, "rgba(169,189,115,.35)", "rgba(169,189,115,.55)");
  drawWallLabel("W1", 0, -17.9);
  drawWallLabel("W2", -5.2, 17.9);
  drawWallLabel("W3", 15.8, 0);

  miniMapContext.fillStyle = "rgba(244,239,228,.62)";
  miniMapContext.font = "700 9px Sora, Arial, sans-serif";
  miniMapContext.textAlign = "center";
  miniMapContext.fillText("Starting Point", toMapX(startingPoint.x) - 25, toMapY(startingPoint.z) - 10);
  miniMapContext.fillText("Office", toMapX(7.6), toMapY(25.8));

  const viewerX = toMapX(camera.position.x);
  const viewerY = toMapY(camera.position.z);
  camera.getWorldDirection(viewDirection);
  const mapDirectionX = toMapX(camera.position.x + viewDirection.x) - viewerX;
  const mapDirectionY = toMapY(camera.position.z + viewDirection.z) - viewerY;
  miniMapContext.save();
  miniMapContext.translate(viewerX, viewerY);
  miniMapContext.rotate(Math.atan2(mapDirectionY, mapDirectionX) + Math.PI / 2);

  miniMapContext.strokeStyle = "rgba(255, 235, 214, .92)";
  miniMapContext.lineWidth = 2.2;
  miniMapContext.beginPath();
  miniMapContext.moveTo(-12, -10);
  miniMapContext.lineTo(12, 10);
  miniMapContext.moveTo(12, -10);
  miniMapContext.lineTo(-12, 10);
  miniMapContext.stroke();

  miniMapContext.fillStyle = "rgba(190, 32, 38, .96)";
  miniMapContext.strokeStyle = "rgba(30, 8, 8, .9)";
  miniMapContext.lineWidth = 2;
  [
    [-14, -12],
    [14, -12],
    [-14, 12],
    [14, 12],
  ].forEach(([x, y]) => {
    miniMapContext.beginPath();
    miniMapContext.arc(x, y, 5.2, 0, Math.PI * 2);
    miniMapContext.fill();
    miniMapContext.stroke();
  });

  miniMapContext.fillStyle = "#d92632";
  miniMapContext.beginPath();
  miniMapContext.roundRect(-8, -8, 16, 16, 4);
  miniMapContext.fill();
  miniMapContext.stroke();

  miniMapContext.fillStyle = "#12110f";
  miniMapContext.beginPath();
  miniMapContext.arc(0, -3.2, 3.2, 0, Math.PI * 2);
  miniMapContext.fill();

  miniMapContext.fillStyle = "#f4efe4";
  miniMapContext.beginPath();
  miniMapContext.arc(0, -3.2, 1.4, 0, Math.PI * 2);
  miniMapContext.fill();

  miniMapContext.fillStyle = "rgba(217, 38, 50, .36)";
  miniMapContext.strokeStyle = "rgba(255, 235, 214, .9)";
  miniMapContext.lineWidth = 1.5;
  miniMapContext.beginPath();
  miniMapContext.moveTo(0, -8);
  miniMapContext.lineTo(7, -24);
  miniMapContext.lineTo(-7, -24);
  miniMapContext.closePath();
  miniMapContext.fill();
  miniMapContext.stroke();
  miniMapContext.restore();
}

function isVisitorCollisionDanger(nextX, nextZ) {
  return colliders.some((box) => {
    if (box.kind !== "visitor") return false;
    return Math.hypot(nextX - box.x, nextZ - box.z) < box.avoidRadius;
  });
}

function collides(nextX, nextZ, nextY = camera.position.y) {
  const inOffice = nextX > 3.7 && nextX < 11.4 && nextZ > room.depth / 2 - 0.6 && nextZ < 28.0;
  const inOfficeDoorway = nextX > 5.75 && nextX < 8.25 && nextZ > room.depth / 2 - 1.1 && nextZ < room.depth / 2 + 1.1;
  if (inOffice || inOfficeDoorway) return false;
  if (nextX < -room.halfWidth + 0.7 || nextX > room.halfWidth - 0.7) return true;
  if (nextZ < -room.depth / 2 + 0.8 || nextZ > room.depth / 2 - 0.8) return true;
  return colliders.some((box) => {
    if (box.kind === "visitor" && nextY > 2.35) return false;
    return Math.abs(nextX - box.x) < box.halfX && Math.abs(nextZ - box.z) < box.halfZ;
  });
}

function updateMovement(delta) {
  if (moveTarget) {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, moveTarget.x, Math.min(1, delta * 3.6));
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, moveTarget.z, Math.min(1, delta * 3.6));
    yaw = THREE.MathUtils.lerp(yaw, moveTarget.yaw, Math.min(1, delta * 3.2));
    if (isVisitorCollisionDanger(camera.position.x, camera.position.z)) {
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.85, Math.min(1, delta * 3.8));
    }
    if (Math.hypot(camera.position.x - moveTarget.x, camera.position.z - moveTarget.z) < 0.08) {
      camera.position.x = moveTarget.x;
      camera.position.z = moveTarget.z;
      yaw = moveTarget.yaw;
      moveTarget = null;
    }
  }

  const speed = (keys.has("Shift") ? 7 : 4.2) * delta;
  const turnSpeed = 1.8 * delta;
  const verticalSpeed = 2.5 * delta;
  if (keys.has("ArrowLeft")) yaw += turnSpeed;
  if (keys.has("ArrowRight")) yaw -= turnSpeed;

  const forward = Number(keys.has("w") || keys.has("ArrowUp")) - Number(keys.has("s") || keys.has("ArrowDown"));
  const strafe = Number(keys.has("d")) - Number(keys.has("a"));
  const vertical = Number(keys.has("e") || keys.has("PageUp")) - Number(keys.has("q") || keys.has("PageDown"));
  if (forward || strafe || vertical || keys.has("ArrowLeft") || keys.has("ArrowRight")) moveTarget = null;
  const forwardVector = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const rightVector = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  const next = camera.position.clone();
  next.addScaledVector(forwardVector, forward * speed);
  next.addScaledVector(rightVector, strafe * speed);
  next.y = THREE.MathUtils.clamp(next.y + vertical * verticalSpeed, 0.72, room.height - 0.62);
  if (isVisitorCollisionDanger(next.x, next.z) && next.y < 2.85) {
    next.y = THREE.MathUtils.clamp(camera.position.y + 3.2 * delta, 0.72, 2.85);
  }

  if (!collides(next.x, camera.position.z, next.y)) camera.position.x = next.x;
  if (!collides(camera.position.x, next.z, next.y)) camera.position.z = next.z;
  camera.position.y = next.y;

  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
}

function handleArrowClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const doorHits = raycaster.intersectObjects(doorTargets, false);
  if (doorHits.length) {
    if (doorHits[0].object.userData.openableDoor === "office-door") officeDoorOpen = true;
    moveTarget = doorHits[0].object.userData.target;
    intro.classList.add("hidden");
    return true;
  }

  const infoHits = raycaster.intersectObjects(infoButtons, false);
  if (infoHits.length) {
    if (infoHits[0].object.userData.pdf) return false;
    showArtworkInfo(infoHits[0].object.userData.art);
    return true;
  }

  const hits = raycaster.intersectObjects([...arrowTargets, ...floorArrows], false);
  let target = hits[0]?.object.userData.target;

  if (!target) {
    let closest = null;
    arrowTargets.forEach((arrow) => {
      const projected = arrow.position.clone().project(camera);
      if (projected.z < -1 || projected.z > 1) return;
      const screenX = (projected.x * 0.5 + 0.5) * rect.width + rect.left;
      const screenY = (-projected.y * 0.5 + 0.5) * rect.height + rect.top;
      const distance = Math.hypot(event.clientX - screenX, event.clientY - screenY);
      if (!closest || distance < closest.distance) closest = { distance, arrow };
    });
    if (closest && closest.distance < 90) target = closest.arrow.userData.target;
  }

  if (!target) return false;
  moveTarget = target;
  intro.classList.add("hidden");
  return true;
}

function handleImageDoubleClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const officeHits = raycaster.intersectObjects(officeDocMeshes, false);
  if (officeHits.length) {
    closeArtworkInfo();
    showPdfDocument(officeHits[0].object.userData.art);
    return true;
  }
  const imageHits = raycaster.intersectObjects(artworkMeshes, false);
  if (!imageHits.length) return false;
  const art = imageHits[0].object.userData.art;
  if (art.images?.length) {
    showSeriesViewer(art, 0);
    return true;
  }
  showLargeImage(art);
  return true;
}

function showArtworkInfo(art) {
  infoSeries.hidden = true;
  infoSeries.textContent = "";
  infoTitle.textContent = art.title;
  infoDescription.textContent = art.isSeries
    ? `${art.description} ${seriesOpenNote}`
    : art.description;
  infoPanel.classList.add("open");
  infoPanel.setAttribute("aria-hidden", "false");
}

function closeArtworkInfo() {
  infoPanel.classList.remove("open");
  infoPanel.setAttribute("aria-hidden", "true");
}

function showLargeImage(art) {
  imageModalImg.src = art.image;
  imageModalImg.alt = art.title;
  imageModalTitle.textContent = art.title;
  imageModal.classList.add("open");
  imageModal.setAttribute("aria-hidden", "false");
}

function closeLargeImage() {
  imageModal.classList.remove("open");
  imageModal.setAttribute("aria-hidden", "true");
}

function renderSeriesViewer() {
  if (!activeSeries) return;
  const item = activeSeries.images[activeSeriesIndex];
  seriesModalImg.src = item.image;
  seriesModalImg.alt = item.title;
  seriesModalTitle.textContent = item.title;
  seriesModalDescription.textContent = item.description || "";
  seriesModalCount.textContent = `${activeSeriesIndex + 1} / ${activeSeries.images.length} · ${activeSeries.title}`;
}

function showSeriesViewer(series, index = 0) {
  closeArtworkInfo();
  closeLargeImage();
  closePdfDocument();
  activeSeries = series;
  activeSeriesIndex = THREE.MathUtils.euclideanModulo(index, series.images.length);
  renderSeriesViewer();
  seriesModal.classList.add("open");
  seriesModal.setAttribute("aria-hidden", "false");
}

function closeSeriesViewer() {
  seriesModal.classList.remove("open");
  seriesModal.setAttribute("aria-hidden", "true");
  activeSeries = null;
}

function stepSeries(direction) {
  if (!activeSeries) return;
  activeSeriesIndex = THREE.MathUtils.euclideanModulo(activeSeriesIndex + direction, activeSeries.images.length);
  renderSeriesViewer();
}

function setupMobileSeriesLibrary() {
  document.querySelectorAll("[data-mobile-series]").forEach((link) => {
    const series = otherSeries.find((item) => item.title === link.dataset.mobileSeries);
    if (!series) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      showSeriesViewer(series, 0);
    });

    link.addEventListener("dblclick", (event) => {
      event.preventDefault();
      showSeriesViewer(series, 0);
    });
  });
}

function showPdfDocument(documentInfo) {
  if (!documentInfo.pdf) return;
  closeArtworkInfo();
  closeLargeImage();
  closePdfDocument();
  window.open(documentInfo.pdf, "_blank", "noopener");
}

function closePdfDocument() {
  pdfModal.classList.remove("open");
  pdfModal.setAttribute("aria-hidden", "true");
  pdfModalFrame.src = "";
}

function getVisitorTotal() {
  return Number(localStorage.getItem(visitorCounterKey) || "0");
}

function setVisitorTotal(total) {
  localStorage.setItem(visitorCounterKey, String(Math.max(0, total)));
  visitorCount.textContent = String(Math.max(0, total));
}

function setupVisitorCounter() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("owner") === "1") localStorage.setItem(ownerModeKey, "true");
  ownerMode.checked = localStorage.getItem(ownerModeKey) === "true";
  const isOwner = ownerMode.checked;
  const hasCountedThisSession = sessionStorage.getItem(sessionCountedKey) === "true";
  let total = getVisitorTotal();
  if (!isOwner && !hasCountedThisSession) {
    total += 1;
    localStorage.setItem(visitorCounterKey, String(total));
    sessionStorage.setItem(sessionCountedKey, "true");
  }
  visitorCount.textContent = String(total);
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  updateMovement(delta);
  updateGalleryVisitors(delta);
  if (officeDoorLeaf) {
    const openAngle = officeDoorOpen ? -1.18 : 0;
    officeDoorLeaf.rotation.y = THREE.MathUtils.lerp(officeDoorLeaf.rotation.y, openAngle, Math.min(1, delta * 4.5));
  }
  const pulse = 0.68 + Math.sin(performance.now() * 0.004) * 0.18;
  floorArrows.forEach((arrow, index) => {
    arrow.material.opacity = 0.68 + Math.sin(performance.now() * 0.003 + index) * 0.12;
    arrow.material.emissiveIntensity = pulse;
  });
  drawMiniMap();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeArtworkInfo();
    closeLargeImage();
    closeSeriesViewer();
    closePdfDocument();
    return;
  }
  if (activeSeries && event.key === "ArrowLeft") {
    stepSeries(-1);
    return;
  }
  if (activeSeries && event.key === "ArrowRight") {
    stepSeries(1);
    return;
  }
  keys.add(event.key);
});
window.addEventListener("keyup", (event) => keys.delete(event.key));

renderer.domElement.addEventListener("pointerdown", (event) => {
  dragging = true;
  lastX = event.clientX;
  pointerDownX = event.clientX;
  pointerDownY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  const deltaX = event.clientX - lastX;
  lastX = event.clientX;
  yaw -= deltaX * 0.004;
});

renderer.domElement.addEventListener("pointerup", (event) => {
  const moved = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY);
  dragging = false;
  if (moved < 6) handleArrowClick(event);
});

renderer.domElement.addEventListener("dblclick", (event) => {
  handleImageDoubleClick(event);
});

document.querySelector("[data-start]").addEventListener("click", goToBeginning);
document.querySelector("[data-reset]").addEventListener("click", resetCamera);
const zeroButton = document.querySelector("[data-zero]");
zeroButton.addEventListener("pointerdown", (event) => event.stopPropagation());
zeroButton.addEventListener("click", (event) => {
  event.stopPropagation();
  goToBeginning();
});
const officeButton = document.querySelector("[data-office]");
officeButton.addEventListener("pointerdown", (event) => event.stopPropagation());
officeButton.addEventListener("click", (event) => {
  event.stopPropagation();
  goToOffice();
});
const bulletinButton = document.querySelector("[data-bulletin]");
bulletinButton.addEventListener("pointerdown", (event) => event.stopPropagation());
bulletinButton.addEventListener("click", (event) => {
  event.stopPropagation();
  goToBulletinBoard();
});
soundToggle.addEventListener("pointerdown", (event) => event.stopPropagation());
soundToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleSoundtrack();
});
soundtrack.addEventListener("ended", () => {
  soundtrackTrackIndex = (soundtrackTrackIndex + 1) % soundtrackTracks.length;
  soundtrack.src = soundtrackTracks[soundtrackTrackIndex];
  if (soundtrackOn) soundtrack.play().catch(() => {
    soundtrackOn = false;
    soundToggle.textContent = "Sound blocked";
    soundToggle.classList.remove("is-on");
  });
});
document.querySelector("[data-close-info]").addEventListener("click", closeArtworkInfo);
document.querySelector("[data-close-image]").addEventListener("click", closeLargeImage);
document.querySelector("[data-close-pdf]").addEventListener("click", closePdfDocument);
document.querySelector("[data-close-series]").addEventListener("click", closeSeriesViewer);
document.querySelector("[data-series-prev]").addEventListener("click", () => stepSeries(-1));
document.querySelector("[data-series-next]").addEventListener("click", () => stepSeries(1));
setupMobileSeriesLibrary();
ownerMode.addEventListener("change", () => {
  localStorage.setItem(ownerModeKey, ownerMode.checked ? "true" : "false");
});
resetVisitors.addEventListener("click", () => {
  setVisitorTotal(0);
  sessionStorage.removeItem(sessionCountedKey);
});

document.querySelectorAll("[data-control]").forEach((button) => {
  button.addEventListener("pointerdown", () => {
    const control = button.dataset.control;
    if (control === "forward-left") {
      keys.add("w");
      keys.add("a");
    }
    if (control === "forward-right") {
      keys.add("w");
      keys.add("d");
    }
    if (control === "forward") keys.add("w");
    if (control === "back") keys.add("s");
    if (control === "left") keys.add("ArrowLeft");
    if (control === "right") keys.add("ArrowRight");
    if (control === "up") keys.add("e");
    if (control === "down") keys.add("q");
  });
  button.addEventListener("pointerup", () => keys.clear());
  button.addEventListener("pointerleave", () => keys.clear());
});

setupVisitorCounter();
resetCamera();
animate();
