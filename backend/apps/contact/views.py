from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ContactMessage
from .serializers import ContactSerializer
from apps.accounts.permissions import IsAdmin

# Create your views here.

class ContactCreateView(APIView):

    def post(self, request):

        serializer = ContactSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response({
                "message": "Message sent successfully"
            })

        return Response(serializer.errors)



class ContactListView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def get(self, request):

        messages = ContactMessage.objects.all()

        serializer = ContactSerializer(
            messages,
            many=True
        )

        return Response(serializer.data)


class ReplyMessageView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def put(self, request, pk):

        try:
            message = ContactMessage.objects.get(
                id=pk
            )

        except ContactMessage.DoesNotExist:

            return Response({
                "error": "Message not found"
            })

        message.admin_reply = request.data.get(
            "reply"
        )

        message.save()

        return Response({
            "message": "Reply added"
        })


class ResolveMessageView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin
    ]

    def put(self, request, pk):

        try:
            message = ContactMessage.objects.get(
                id=pk
            )

        except ContactMessage.DoesNotExist:

            return Response({
                "error": "Message not found"
            })

        message.status = "resolved"

        message.save()

        return Response({
            "message": "Marked as resolved"
        })
