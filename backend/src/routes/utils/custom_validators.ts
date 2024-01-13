import {
  isPhoneNumber,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export function IsPhoneNumberOrEmptyString(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPhoneNumberOrEmptyStringWithMessage',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value === 'string' && value.trim() === '') {
            return true;
          }

          const isPhoneNumberValid = isPhoneNumber(value);

          if (!isPhoneNumberValid) {
            throw new BadRequestException(
              'Please enter a valid phone number or an empty string',
            );
          }

          return isPhoneNumber(value);
        },
      },
    });
  };
}
