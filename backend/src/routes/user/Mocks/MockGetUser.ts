export class MockGetUser {
  id: number;

  eMail: string;

  firstName: string;

  lastName: string;

  password: string;

  birthday: Date;

  profilePicture?: string;

  phoneNumber?: string;

  description: string;

  entryDate: Date;

  coins: number;

  constructor(asProvider?: boolean) {
    this.id = 1;
    this.entryDate = new Date('2021-02-18');
    this.eMail = 'tester@test.com';
    this.firstName = 'Max';
    this.lastName = 'Mustermann';
    this.birthday = new Date('2002-02-18');
    this.description = 'Test';
    this.profilePicture = '';
    this.phoneNumber = '';
    this.coins = 0;

    if (asProvider) {
      this.profilePicture = '/profile-pictures/12341.png';
      this.phoneNumber = '+49 173 55555';
    }
  }
}
