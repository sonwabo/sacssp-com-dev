
export class Document {
  id: number;
  reference: string;
  name: string;
  size: number;
  content: string;
  contentType: string;
  documentType: string;
  // tslint:disable-next-line:max-line-length
  constructor(id: number, reference: string, name: string, size: number, content: string, contentType: string, documentType: string) {
    this.id = id;
    this.reference = reference;
    this.name = name;
    this.size = size;
    this.content = content;
    this.contentType = contentType;
    this.documentType = documentType;
  }
}
