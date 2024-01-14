import { User } from '../../database/User';
import { ForbiddenException } from '@nestjs/common';

export function userIsValidToBeProvider(user: User) {
  let bothExisting: boolean;
  if (user.profilePicture && user.phoneNumber) {
    bothExisting = user.profilePicture !== '' && user.phoneNumber !== '';
  }

  if (!bothExisting) {
    throw new ForbiddenException(
      'Add a profile picture and phone number to your profile to proceed.',
    );
  }

  return bothExisting;
}
