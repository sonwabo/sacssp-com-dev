export class UserDetails {
  grant_type: string;
  username: string;
  password: string;
  client_secret: string;
  client_id: string;
  static owner: string;
  static hideMenu: boolean = false;

  // tslint:disable-next-line:max-line-length
  constructor(username: string, password: string, grant_type: string, client_id: string, client_secret?: string) {
    this.grant_type = grant_type;
    this.username = username;
    this.password = password;
    this.client_secret = client_secret;
    this.client_id = client_id;
  }
}
