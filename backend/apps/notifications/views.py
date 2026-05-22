from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

# Create your views here.


class NotificationListView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        notifications = (
            Notification.objects.filter(
                user=request.user
            )
        )

        serializer = (
            NotificationSerializer(
                notifications,
                many=True
            )
        )

        return Response(
            serializer.data
        )



class MarkReadView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def put(self, request, pk):

        notification = (
            Notification.objects.get(
                id=pk,
                user=request.user
            )
        )

        notification.is_read = True

        notification.save()

        return Response({

            "message":
            "Notification marked as read"
        })