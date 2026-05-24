import { NotificationType } from './NotificationTypes';

// Soyut taban sınıf (Template Method): tüm bildirimler ortak alanlara sahip
export class Notification {
  constructor({ title, message, duration = 3500 }) {
    if (new.target === Notification) {
      throw new Error('Notification soyut sınıftır, doğrudan örneklenemez.');
    }
    this.id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.title = title;
    this.message = message;
    this.duration = duration;
    this.createdAt = new Date();
  }

  // Alt sınıflar override eder
  getType() {
    throw new Error('getType() alt sınıfta tanımlanmalı.');
  }

  // Alt sınıflar override eder (renk için)
  getAccentKey() {
    return 'primary';
  }

  getIcon() {
    return 'ℹ️';
  }
}

export class SuccessNotification extends Notification {
  getType() { return NotificationType.SUCCESS; }
  getAccentKey() { return 'success'; }
  getIcon() { return '✅'; }
}

export class ErrorNotification extends Notification {
  getType() { return NotificationType.ERROR; }
  getAccentKey() { return 'error'; }
  getIcon() { return '⛔'; }
}

export class InfoNotification extends Notification {
  getType() { return NotificationType.INFO; }
  getAccentKey() { return 'primary'; }
  getIcon() { return 'ℹ️'; }
}

export class WarningNotification extends Notification {
  getType() { return NotificationType.WARNING; }
  getAccentKey() { return 'warning'; }
  getIcon() { return '⚠️'; }
}
