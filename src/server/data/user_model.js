export class User extends Object {}

// Mock authenticated ID.
const VIEWER_ID = 'me';

// Mock user data.
const viewer = new User();
viewer.id = VIEWER_ID;
const usersById = {
  [VIEWER_ID]: viewer
};

export function getUser() {
  return usersById[VIEWER_ID];
}

export function getViewer() {
  return getUser(VIEWER_ID);
}
