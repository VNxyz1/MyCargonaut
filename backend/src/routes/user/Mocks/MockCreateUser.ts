export class MockCreateUser {
  eMail: string;

  firstName: string;

  lastName: string;

  password: string;

  birthday: Date;

  profilePicture?: string;

  phoneNumber?: string;

  description: string;

  entryDate: string;

  constructor(asProvider?: boolean, user?: User) {
    this.eMail = 'tester@test.com';
    if (user === User.first) {
      this.eMail = 'testerEins@test.com';
    } else if (user === User.second) {
      this.eMail = 'testerZwei@test.com';
    } else if (user === User.third) {
      this.eMail = 'testerDrei@test.com';
    }

    this.entryDate = '2021-02-18';
    this.firstName = 'Max';
    this.lastName = 'Mustermann';
    this.password = '1234';
    this.birthday = new Date('2002-02-18');
    this.description = 'Test';
    this.profilePicture = '';
    this.phoneNumber = '';

    if (asProvider) {
      this.profilePicture = '/profile-pictures/12341.png';
      this.phoneNumber = '+49 173 55555';
    }
  }
}

enum User {
  first,
  second,
  third,
}
