from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = (
            Notification.objects.filter(
                user=request.user
            ).order_by('-created_at')
        )

        serializer = NotificationSerializer(
            notifications,
            many=True
        )

        return Response(
            serializer.data
        )


class MarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        notification = Notification.objects.get(
            id=pk,
            user=request.user
        )

        notification.is_read = True
        notification.save()

        return Response({
            "message": "Notification marked as read"
        })


class UnreadCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        return Response({"unread_count": count})
