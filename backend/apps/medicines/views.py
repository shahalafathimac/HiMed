from django.shortcuts import render
from apps.accounts.permissions import IsSupplier
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Medicine
from .serializers import MedicineSerializer
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes

# Create your views here.
class CreateMedicineView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]

    def post(self, request):

        serializer = MedicineSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(
                supplier=request.user
            )

            return Response(
                serializer.data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )


class MedicineListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        medicines = Medicine.objects.all()

        serializer = MedicineSerializer(
            medicines,
            many=True
        )

        return Response(
            serializer.data
        )




class UpdateMedicineView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]

    def put(self, request, pk):

        try:

            medicine = Medicine.objects.get(
                id=pk,
                supplier=request.user
            )

        except Medicine.DoesNotExist:

            return Response({
                "message":
                "Medicine not found"
            })

        serializer = MedicineSerializer(
            medicine,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors
        )



class DeleteMedicineView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsSupplier
    ]

    def delete(self, request, pk):

        try:

            medicine = Medicine.objects.get(
                id=pk,
                supplier=request.user
            )

        except Medicine.DoesNotExist:

            return Response({
                "message":
                "Medicine not found"
            })

        medicine.delete()

        return Response({
            "message":
            "Medicine deleted"
        })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def low_stock_medicines(request):

    medicines = Medicine.objects.filter(
        stock__lt=10
    )

    serializer = MedicineSerializer(
        medicines,
        many=True
    )

    return Response(
        serializer.data
    )



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def medicine_analytics(request):

    total_medicines = Medicine.objects.count()

    low_stock = Medicine.objects.filter(
        stock__lt=10
    ).count()

    return Response({

        "total_medicines":
        total_medicines,

        "low_stock":
        low_stock

    })