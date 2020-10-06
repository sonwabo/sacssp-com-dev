export class UserDetails {
  grant_type: string;
  username: string;
  password: string;
  client_secret: string;
  client_id: string;

  static delegateUser: string = null;
  static hideMenu: boolean = false;
  static tokenObject: any;

  static getRoles(): Array<string> {
    return this.tokenObject?.realm_access?.roles;
  }

  static getUserName(): string {
    return this.tokenObject?.preferred_username;
  }

  static empty(): void {
    this.delegateUser = null;
    this.hideMenu = null;
    this.tokenObject = null;
  }

  // tslint:disable-next-line:max-line-length
  constructor(username: string, password: string, grant_type: string, client_id: string, client_secret?: string) {
    this.grant_type = grant_type;
    this.username = username;
    this.password = password;
    this.client_secret = client_secret;
    this.client_id = client_id;
  }

}

