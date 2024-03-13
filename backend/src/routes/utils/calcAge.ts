export function calcAge(birthdate: Date) {
  const aktuellesDatum = new Date();

  const differenzInMillisekunden = aktuellesDatum.getTime() - birthdate.getTime();

  return Math.floor(differenzInMillisekunden / (1000 * 60 * 60 * 24 * 365.25));
}
