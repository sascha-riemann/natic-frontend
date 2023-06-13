export class BusinessUtils {
  static GET_ID(): number | null {
    return Number(localStorage.getItem('businessId'));
  }
  static SET_ID(id: number): void {
    localStorage.setItem('businessId', id.toString());
  }
}
