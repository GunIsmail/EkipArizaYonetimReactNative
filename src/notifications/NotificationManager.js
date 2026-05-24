import { InAppBannerStrategy } from './strategies/InAppBannerStrategy';

// Singleton + Observer (Subject)
class NotificationManager {
  constructor() {
    if (NotificationManager._instance) {
      return NotificationManager._instance;
    }
    this.listeners = new Set();
    this.strategy = new InAppBannerStrategy(this);
    NotificationManager._instance = this;
  }

  static getInstance() {
    if (!NotificationManager._instance) {
      NotificationManager._instance = new NotificationManager();
    }
    return NotificationManager._instance;
  }

  // Strategy enjekte edilebilir (DI) — ileride toast, push vb. eklenebilir
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(notification) {
    this.strategy.show(notification);
  }

  dismiss(notificationId) {
    this.strategy.dismiss(notificationId);
  }

  // Strategy tarafından çağrılır — listenerları bilgilendirir
  _emit(notification) {
    this.listeners.forEach((cb) => cb({ action: 'show', notification }));
  }

  _dismiss(notificationId) {
    this.listeners.forEach((cb) => cb({ action: 'dismiss', notificationId }));
  }
}

export default NotificationManager.getInstance();
