import {Inject, Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root',
})
export class DataShareService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService,
  ) { }

  public changeMessage(message: any) {
    this.messageSource.next(message);
  }

  public setValueOnLocalStorage(key: string, value: any): void {
     this.storage.set(key, value);
  }

  public getValueFromLocalStorage(key: string): any {
    return this.storage.get(key) || null ;
  }

  public clearStorageForKey(key: string): void {
    this.storage.remove(key);
  }
}
