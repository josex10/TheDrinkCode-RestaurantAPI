export class AuthHelper {
  static generateUsername(name: string, companyId: number): string {
    const number = Math.floor(Math.random() * 99);
    const firstname = name.split(' ');
    return `${firstname[0]}${number}${companyId}`.toLowerCase();
  }
}
