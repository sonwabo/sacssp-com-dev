
export class Document {
  identifier: string;
  name: string;
  link: string;
  size: number;
  lastModified: any;
  content: string;
  // tslint:disable-next-line:max-line-length
  constructor(identifier: string, name: string, link: string, size: number, lastModified: any, content: string) {
    this.identifier = identifier;
    this.name = name;
    this.link = link;
    this.size = size;
    this.lastModified = lastModified;
    this.content = content;
  }
}
