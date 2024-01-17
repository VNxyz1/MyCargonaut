export class MockPostOffer {
  route = [
    {
      plz: '63679',
      location: 'Schotten',
      position: 1,
    },
    {
      plz: '64002',
      location: 'Nidda',
      position: 2,
    },
    {
      plz: '35390',
      location: 'Gießen',
      position: 3,
    },
  ];
  vehicleId = 1;
  description = 'Das ist ein Test!';
  startDate = '2024-02-18';
  bookedSeats = 1;

  constructor(vehicleId: number,alt?: boolean,) {
    if (alt) {
      this.route = [
        {
          plz: '63679',
          location: 'Schotten',
          position: 3,
        },
        {
          plz: '64002',
          location: 'Nidda',
          position: 1,
        },
        {
          plz: '35390',
          location: 'Gießen',
          position: 2,
        },
      ];
      this.startDate = '2024-02-17';
    }
    this.vehicleId = vehicleId;
  }
}
