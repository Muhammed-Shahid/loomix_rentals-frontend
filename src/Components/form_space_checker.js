export function containsMoreThanTwoConsecutiveSpaces(str) {
  // if the string contains more than 2 consecutive spaces
  return /\s{3,}/.test(str);
}
