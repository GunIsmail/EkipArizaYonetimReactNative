import {
  SuccessNotification,
  ErrorNotification,
  InfoNotification,
  WarningNotification,
} from './Notification';
import { NotificationType } from './NotificationTypes';

// Factory Pattern: tip bazlı doğru Notification alt sınıfını üretir
export class NotificationFactory {
  static create(type, payload) {
    switch (type) {
      case NotificationType.SUCCESS:
        return new SuccessNotification(payload);
      case NotificationType.ERROR:
        return new ErrorNotification(payload);
      case NotificationType.WARNING:
        return new WarningNotification(payload);
      case NotificationType.INFO:
      default:
        return new InfoNotification(payload);
    }
  }

  // Domain'e özel kısayollar — çağıran kodun temiz kalması için
  static jobAccepted(taskTitle) {
    return NotificationFactory.create(NotificationType.SUCCESS, {
      title: 'Yeni İş Kabul Edildi',
      message: taskTitle
        ? `"${taskTitle}" işi üzerinize alındı.`
        : 'İş talebiniz başarıyla alındı.',
    });
  }

  static jobRequestFailed(reason) {
    return NotificationFactory.create(NotificationType.ERROR, {
      title: 'İş Talebi Başarısız',
      message: reason || 'İş talebi sırasında bir hata oluştu.',
    });
  }

  static budgetUpdated({ workerName, newBudget, delta }) {
    const formatted = Number(newBudget).toLocaleString('tr-TR', { minimumFractionDigits: 2 });
    let detail = '';
    if (typeof delta === 'number' && !isNaN(delta) && delta !== 0) {
      const sign = delta > 0 ? '+' : '−';
      const abs = Math.abs(delta).toLocaleString('tr-TR', { minimumFractionDigits: 2 });
      detail = ` (${sign}${abs} ₺)`;
    }
    return NotificationFactory.create(NotificationType.SUCCESS, {
      title: 'Bütçe Güncellendi',
      message: workerName
        ? `${workerName}: ${formatted} ₺${detail}`
        : `Yeni bakiye: ${formatted} ₺${detail}`,
    });
  }

  static budgetUpdateFailed(reason) {
    return NotificationFactory.create(NotificationType.ERROR, {
      title: 'Bütçe Güncellenemedi',
      message: reason || 'İşlem sırasında bir hata oluştu.',
    });
  }
}
