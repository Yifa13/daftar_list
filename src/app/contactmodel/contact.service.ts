import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [
    { id: 1, name: 'Alice', online: true },
    { id: 2, name: 'Bob', online: false },
    { id: 3, name: 'Charlie', online: true },
    { id: 4, name: 'Diana', online: false },
    { id: 5, name: 'Eve', online: true }
  ];

  private contactsSubject = new BehaviorSubject<Contact[]>(this.contacts);
  private showOnlineSubject = new BehaviorSubject<boolean>(true);
  private showOfflineSubject = new BehaviorSubject<boolean>(true);

  contacts$ = this.contactsSubject.asObservable();
  showOnline$ = this.showOnlineSubject.asObservable();
  showOffline$ = this.showOfflineSubject.asObservable();

  filteredContacts$: Observable<Contact[]> = combineLatest([
    this.contacts$,
    this.showOnline$,
    this.showOffline$
  ]).pipe(
    map(([contacts, showOnline, showOffline]) => {
      return contacts.filter(contact => {
        if (contact.online && !showOnline) return false;
        if (!contact.online && !showOffline) return false;
        return true;
      });
    })
  );

  toggleOnlineFilter(): void {
    this.showOnlineSubject.next(!this.showOnlineSubject.value);
  }

  toggleOfflineFilter(): void {
    this.showOfflineSubject.next(!this.showOfflineSubject.value);
  }

  updateContactStatus(id: number, online: boolean): void {
    const updatedContacts = this.contacts.map(contact =>
      contact.id === id ? { ...contact, online } : contact
    );
    this.contacts = updatedContacts;
    this.contactsSubject.next(updatedContacts);
  }
}
