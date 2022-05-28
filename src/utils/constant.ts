export type Role = "USER" | "ADMIN";

enum Gender {
  male = "MALE",
  female = "FEMALE",
  other = "OTHER",
}

enum RoleType {
  user = "USER",
  admin = "ADMIN",
}

enum Disclosure {
  open = "OPEN",
  close = "CLOSE",
}

enum HostType {
  local = "LOCAL",
  traveler = "TRAVELER",
}

enum HostingStatus {
  ongoing = "ONGOING",
  complete = "COMPLETE",
  upcoming = "UPCOMING",
}

enum ItineraryCreator {
  host = "Host",
  compastrips = "Compastrips",
}

export {
  RoleType,
  Disclosure,
  Gender,
  HostType,
  HostingStatus,
  ItineraryCreator,
};
