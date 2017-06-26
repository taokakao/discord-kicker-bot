const getRandomElementFromArray = (arr) => {
  if (!arr) {
    return null;
  }
  return arr[Math.round(Math.random() * (arr.length - 1))];
};

const shuffleArray = (arr) => {
  if (!arr) {
    return null;
  }
  const source = [];
  for (let i = 0; i < arr.length; i++) {
    source.push(arr[i]);
  }
  const out = [];
  while (source.length > 0) {
    const randomIndex = Math.round(Math.random() * (source.length - 1));
    out.push(source[randomIndex]);
    source.splice(randomIndex, 1);
  }
  return out;
};

exports.getRandomElementFromArray = getRandomElementFromArray;
exports.shuffleArray = shuffleArray;
