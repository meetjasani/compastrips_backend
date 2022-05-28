const getRandomNumber = (): string => {
  return (Math.floor(Math.random() * 9) + 1).toString();
};

const generateRandomNumber = (): any => {
  let str =
    getRandomNumber() +
    getRandomNumber() +
    getRandomNumber() +
    getRandomNumber() +
    getRandomNumber() +
    getRandomNumber();
  return parseInt(str);
};

export { generateRandomNumber }
