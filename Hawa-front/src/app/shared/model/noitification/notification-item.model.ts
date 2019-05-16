export class NotificationItem {
    id: number;
    notificationContent: string;
    notificationType: string;
    createdDate: number;
    notificationObjectID: number;
    arNotificationRead: boolean;
    notificationObjectType: string;
    notificationPriority: number;
    notificationSystemType: {
        key: string;
        code: string;
        text: string
    }
}