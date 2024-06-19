export enum TripPermissionEnum {
  Admin = 1,
  EditBasic = 2,
  ViewFullTrip = 3,
  ViewHotels = 4,
  ViewBasic = 5,
}

export enum LocationPermissionEnum {
  view = 8,
  edit = 7,
  admin = 6,
}

export enum OperationType {
  GET = 'GET',
  UPDATE = 'UPDATE',
  CREATE = 'CREATE',
  DELETE = 'DELETE',
}

export enum EntityType {
  Trip = 'Trip',
  Location = 'Location',
}
