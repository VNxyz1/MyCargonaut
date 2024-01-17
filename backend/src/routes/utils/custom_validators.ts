import {
  isPhoneNumber,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { VehicleService } from '../vehicle.service/vehicle.service';

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

@ValidatorConstraint({ name: 'VehicleExists', async: true })
@Injectable()
export class VehicleExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly vehicleService: VehicleService) {}

  async validate(value: number) {
    return await this.vehicleService.getExixtsVehicle(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `Vehicle doesn't exist`;
  }
}
