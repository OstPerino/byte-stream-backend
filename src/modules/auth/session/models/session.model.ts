import type { DeviceInfo, LocationInfo, SessionMetadata } from '@/shared/types/session-meta.types';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LocationModel implements LocationInfo {
  @Field(() => String)
  country: string;

  @Field(() => String)
  city: string;

  @Field(() => Number)
  latitude: number;

  @Field(() => Number)
  longitude: number;
}

@ObjectType()
export class DeviceModel implements DeviceInfo {
  @Field(() => String)
  browser: string;

  @Field(() => String)
  os: string;

  @Field(() => String)
  type: string;
}

@ObjectType()
export class SessionMetadataModel implements SessionMetadata {
  @Field(() => String)
  ip: string | number;

  @Field(() => LocationModel)
  location: LocationModel;

  @Field(() => DeviceModel)
  device: DeviceModel;
}

@ObjectType()
export class SessionModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => SessionMetadataModel)
  metadata: SessionMetadataModel;
}