const getRandomElementFromArray = (arr) => {
  if (!arr) {
    return null;
  }
  return arr[Math.round(Math.random() * (arr.length - 1))];
};

exports.getRandomElementFromArray = getRandomElementFromArray;
