export function ratingToStars(n: number) {
  return "★".repeat(Math.floor(n)) + "½".repeat(Math.round(n % 1));
}
