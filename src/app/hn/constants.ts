export const FUN_EMAIL_PLACEHOLDERS = [
  "mark@lumonindustries.com", // Severance
  "richard@piedpiper.com", // Silicon Valley
  "don@sterlingcooper.com", // Mad Men
  "carmy@thebeef.com", // The Bear
  "ted@afcrichmond.com", // Ted Lasso
  "michael@dundermifflin.com", // The Office
  "leslie@pawneecity.gov", // Parks and Rec
  "kendall@waystar.com", // Succession
  "neo@metacortex.com", // The Matrix
  "peter@initech.com", // Office Space
];

export function getRandomEmailPlaceholder(): string {
  const randomIndex = Math.floor(Math.random() * FUN_EMAIL_PLACEHOLDERS.length);
  return FUN_EMAIL_PLACEHOLDERS[randomIndex];
}
