const STORAGE_KEY = "ai_cards";

// Obtener todas las AI cards
export function getCards() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Guardar una nueva card
export function saveCard(card) {
  const cards = getCards();
  cards.push(card);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

// Limpiar todo
export function clearCards() {
  localStorage.removeItem(STORAGE_KEY);
}