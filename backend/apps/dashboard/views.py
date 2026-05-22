from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_data(request):

    user = request.user

    response = {
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

    if user.role == "admin":

        response["dashboard"] = {

            "pending_users": True,

            "approve_users": True,

            "reject_users": True,

            "all_medicines": True,

            "all_orders": True,

            "contact_messages": True,

            "analytics": True
        }

    elif user.role == "supplier":

        response["dashboard"] = {

            "add_medicine": True,

            "update_medicine": True,

            "delete_medicine": True,

            "medicine_list": True,

            "low_stock": True,

            "supplier_orders": True
        }

    elif user.role == "buyer":

        response["dashboard"] = {

            "medicine_list": True,

            "place_order": True,

            "order_history": True,

            "cancel_order": True
        }

    return Response(response)