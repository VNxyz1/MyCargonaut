export class MockCreateUser {
  eMail: string;

  firstName: string;

  lastName: string;

  password: string;

  birthday: Date;

  profilePicture?: string;

  phoneNumber?: string;

  description: string;

  entryDate: Date;

  constructor(asProvider?: boolean) {
    this.eMail = 'tester@test.com';
    this.entryDate = new Date('2021-02-18');
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
