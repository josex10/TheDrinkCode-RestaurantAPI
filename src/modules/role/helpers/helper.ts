export class RoleHelper {
  static transformRoleKey(key: string): string {
    return key.split(/\s/).join('').toUpperCase();
  }
}
