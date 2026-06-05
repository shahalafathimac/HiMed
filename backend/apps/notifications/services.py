import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification


def create_notification(user, title, message, notification_type):
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
    )

    channel_layer = get_channel_layer()
    group_name = f'notifications_{user.id}'
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'notify',
            'id': notification.id,
            'title': notification.title,
            'message': notification.message,
            'type': notification.notification_type,
            'created_at': notification.created_at.isoformat(),
        }
    )
