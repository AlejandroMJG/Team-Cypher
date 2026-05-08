const cardProgress = document.getElementById("cardProgress");
const flashcard = document.getElementById("flashcard");
const flashcardText = document.getElementById("flashcardText");
const sideLabel = document.getElementById("sideLabel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const emptyState = document.getElementById("emptyState");

let cards = [];
let currentIndex = 0;
let showingAnswer = false;

function loadCards() {
  try {
    cards = JSON.parse(localStorage.getItem("teamCipherFlashcards")) || [];
  } catch {
    cards = [];
  }
}

function updateCard() {
  if (cards.length === 0) {
    emptyState.hidden = false;
    flashcard.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    cardProgress.textContent = "0 / 0";
    return;
  }

  emptyState.hidden = true;
  flashcard.disabled = false;
  prevBtn.disabled = cards.length <= 1;
  nextBtn.disabled = cards.length <= 1;

  const card = cards[currentIndex];
  sideLabel.textContent = showingAnswer ? "Answer" : "Question";
  flashcardText.textContent = showingAnswer ? card.answer : card.question;
  flashcard.classList.toggle("is-flipped", showingAnswer);
  cardProgress.textContent = `${currentIndex + 1} / ${cards.length}`;
}

function flipCard() {
  if (cards.length === 0) {
    return;
  }

  showingAnswer = !showingAnswer;
  flashcard.classList.toggle("is-flipped", showingAnswer);
  updateCard();
}

function moveCard(direction) {
  if (cards.length === 0) {
    return;
  }

  currentIndex = (currentIndex + direction + cards.length) % cards.length;
  showingAnswer = false;
  flashcard.classList.remove("is-flipped");
  updateCard();
}

flashcard.addEventListener("click", flipCard);
prevBtn.addEventListener("click", () => moveCard(-1));
nextBtn.addEventListener("click", () => moveCard(1));

loadCards();
updateCard();
