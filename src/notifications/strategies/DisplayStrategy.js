// Strategy Pattern: bildirimleri farklı kanallarda göstermek için arayüz
export class DisplayStrategy {
  // eslint-disable-next-line no-unused-vars
  show(notification) {
    throw new Error('show() alt sınıfta tanımlanmalı.');
  }

  // eslint-disable-next-line no-unused-vars
  dismiss(notificationId) {
    throw new Error('dismiss() alt sınıfta tanımlanmalı.');
  }
}
