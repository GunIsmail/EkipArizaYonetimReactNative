import { DisplayStrategy } from './DisplayStrategy';

// Observer üzerinden UI'a bildirim ileten somut strateji
export class InAppBannerStrategy extends DisplayStrategy {
  constructor(manager) {
    super();
    this.manager = manager;
  }

  show(notification) {
    this.manager._emit(notification);
  }

  dismiss(notificationId) {
    this.manager._dismiss(notificationId);
  }
}
