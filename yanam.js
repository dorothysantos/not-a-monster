let cards = [];

function checkOverflow(el) {
  var curOverflow = el.style.overflow;

  if (!curOverflow || curOverflow === "visible")
    el.style.overflow = "hidden";

  var isOverflowing = el.clientWidth < el.scrollWidth
    || el.clientHeight < el.scrollHeight;

  el.style.overflow = curOverflow;

  return isOverflowing;
}

let bx = document.querySelector("div.box");

let fixSize = async function (el) {
  console.log("ok");
  let lastsize = parseFloat(window.getComputedStyle(el).fontSize);
  console.log(lastsize);
  el.style.fontSize = lastsize + "px";
  while (!checkOverflow(el)) {
    let nu = parseFloat(el.style.fontSize) + 0.3 + "px";
    console.log(nu);
    el.style.fontSize = nu;
  }
  //now too big;
  while (checkOverflow(el)) {
    let nu = parseFloat(el.style.fontSize) - 0.3 + "px";
    console.log(nu);
    el.style.fontSize = nu;
  }
  await sleep(2200);
  document.querySelector("#Front").style.opacity = 1;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let flowers = [];
for (let i = 1; i < 29; i++) {

  flowers.push(`images/drs-flower${("" + i).padStart(2, "0")}.png`);
}
flowers = shuffleArray(flowers);


function randomFlower() {
  let num = Math.floor(Math.random() * (27 - 0 + 1)) + 1;
  num = ("" + num).padStart(2, "0");
  return `images/drs-flower${num}.png`;
}

function shuffleArray(array) {
  // Iterate over the array from the last element down to the second
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index 'j' between 0 and 'i' (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices 'i' and 'j'
    // This can be done using array destructuring for conciseness
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function getCards() {
  let res = await fetch("deck.json");
  res = await res.json();
  return res;
}

async function showEndMessage() {
  let cont = document.querySelector(".endText");
  cont.style.display = "flex";
  cont.style.opacity = 1;
  await sleep(16000);
  window.location.reload();
}

async function getCard(cards) {
  if (!cards.length || !flowers.length) {
    console.log("used all the cards");
    bx.style.opacity = 0;
    showEndMessage();
  }
  let card = cards.pop();
  let front = document.querySelector("#Front");
  //front.style.transition = "none";
  front.style.transition = "opacity 1s ease-out";
  front.style.opacity = 0;
  await sleep(1000);
  front.textContent = "";
  front.style.transition = "none";

  front.style.transition = "opacity 3s ease-out";

  front.textContent = (card.text);
  let flower = flowers.pop();
  const image = `${flower}`;
  await load(image);
  bx.setAttribute("style", `background: url('${flower}'); background-repeat: no-repeat; background-position: center; background-size: 1000px; text-shadow: 2px 2px 2px #000; box-shadow: inset 0 0 0 1000px rgba(0,0,0,.7);`);

  fixSize(bx);
}



function load(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', resolve);
    image.addEventListener('error', reject);
    image.src = src;
  });
}

let resettime = false;
let limit = 120;

let updateTime = function () {
  let now = Temporal.Now.instant();
  resettime = now;
}

window.setInterval(async function () {
  if (!resettime) {
    return false;
  }
  let now = Temporal.Now.instant();
  let dif = now.since(resettime).seconds;
  console.log(dif);
  if (dif > limit) {
    bx.style.opacity = 0;
    await sleep(5000);
    window.location.reload();
  }
}, 5000);

let intro = true;

let doTheThing = async function () {
  let front = document.querySelector("#Front");
  await sleep(1500);
  fixSize(bx);
  front.style.opacity = 1;

  cards = await getCards();
  cards = shuffleArray(cards.deck.cards);

  bx.addEventListener("click", async function () {
    if (intro){
      intro = false;
      bx.style.opacity = 0;
      await sleep(1500);
    }
    getCard(cards);
    updateTime();
    /*
    bx.setAttribute("style", `background: url('${flower()}'); background-repeat: no-repeat; background-position: center; background-size: 1000px; text-shadow: 2px 2px 2px #000; box-shadow: inset 0 0 0 1000px rgba(0,0,0,.7);`);
    //fixSize(bx);
    currentCard++;
    showText(cards, currentCard);*/
  });

}

doTheThing();

