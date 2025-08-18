const addInitialCrabs = async () => {
  const result = await fetch('http://localhost:3010/core/boxes');
  const boxes = await result.json();

  console.log(boxes.length);

  const initData = [
    {
      "weight": 262,
      "supplier": "J",
      "status": "in",
      "checkInDate": "2025-08-03",
      "boxId": "C5"
    },
    {
      "weight": 680,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-31",
      "boxId": "D7"
    },
    {
      "weight": 670,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-31",
      "boxId": "E7"
    },
    {
      "weight": 588,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-12",
      "boxId": "E6"
    },
    {
      "weight": 700,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-31",
      "boxId": "E5"
    },
    {
      "weight": 668,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-08-01",
      "boxId": "F7"
    },
    {
      "weight": 806,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-12",
      "boxId": "F5"
    },
    {
      "weight": 442,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-12",
      "boxId": "G6"
    },
    {
      "weight": 526,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-31",
      "boxId": "G5"
    },
    {
      "weight": 478,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-12",
      "boxId": "H6"
    },
    {
      "weight": 598,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-08-01",
      "boxId": "H5"
    },
    {
      "weight": 418,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-08-01",
      "boxId": "H4"
    },
    {
      "weight": 738,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-08-01",
      "boxId": "I7"
    },
    {
      "weight": 812,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-12",
      "boxId": "I5"
    },
    {
      "weight": 528,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-12",
      "boxId": "J7"
    },
    {
      "weight": 500,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-12",
      "boxId": "J5"
    },
    {
      "weight": 542,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-08-07",
      "boxId": "K2"
    },
    {
      "weight": 564,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-08-07",
      "boxId": "K1"
    },
    {
      "weight": 570,
      "supplier": "R",
      "status": "in",
      "checkInDate": "2025-07-12",
      "boxId": "L6"
    }
  ];

  for(let crab of initData) {
    console.log(crab.boxId);

    const box = boxes.find((box: any) => box.label === crab.boxId);
    if (!box) {
      console.log(`Box ${crab.boxId} not found`);
      continue;
    }

    await fetch('http://localhost:3010/core/crabs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...crab,
        boxId: box.id,
      })
    });
    console.log(`Crab ${crab.boxId} added`);
  }
}

addInitialCrabs();
