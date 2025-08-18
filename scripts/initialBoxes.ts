const createBoxes = async () => {
  const letters = 'ABCDEFGHIJKL';
  for(let i = 0; i < letters.length; i++) {
    for(let j = 1; j <= 10; j++){
      await fetch('http://localhost:3010/core/boxes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: `${letters[i]}${j}`,
          status: 'empty',
          maxFill: 1,
        })
      });
      console.log(`Box ${letters[i]}${j} created`);
    }
  }
}

createBoxes();