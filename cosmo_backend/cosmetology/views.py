from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework import status
import json

from .serializers import RegisterSerializer
@api_view(['POST'])
@csrf_exempt
def registration(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from .models import Register
@api_view(['POST'])
@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        endpoint = request.data.get('endpoint')

        try:
            user = Register.objects.get(email=username, password=password)

            # Check if the user is a doctor
            if user.role == 'Doctor':
                return Response({'message': 'Login successful', 'role': user.role, 'id': user.id, 'name': user.name, 'email': user.email}, status=status.HTTP_200_OK)

            # Check if the role matches the endpoint
            if endpoint == 'DoctorLogin' and user.role != 'Doctor':
                return Response('Access denied', status=status.HTTP_403_FORBIDDEN)
            elif endpoint == 'PharmacistLogin' and user.role != 'Pharmacist':
                return Response('Access denied', status=status.HTTP_403_FORBIDDEN)
            elif endpoint == 'ReceptionistLogin' and user.role != 'Receptionist':
                return Response('Access denied', status=status.HTTP_403_FORBIDDEN)

            return Response({'message': 'Login successful', 'role': user.role, 'id': user.id, 'name': user.name, 'email': user.email}, status=status.HTTP_200_OK)
        except Register.DoesNotExist:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        

from .serializers import PharmacySerializer
import logging
logger = logging.getLogger(__name__)
@api_view(['GET', 'POST', 'PUT'])
def pharmacy_data(request):
    if request.method == 'GET':
        medicines = Pharmacy.objects.all()
        serializer = PharmacySerializer(medicines, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = PharmacySerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        response_data = []
        for data in request.data:
            medicine_name = data.get('medicine_name')
            new_stock = data.get('new_stock')
            try:
                pharmacy_obj = Pharmacy.objects.get(medicine_name=medicine_name)
                pharmacy_obj.old_stock += int(new_stock)
                serializer = PharmacySerializer(instance=pharmacy_obj, data=data)
                if serializer.is_valid():
                    serializer.save()
                    response_data.append(serializer.data)
                else:
                    logger.error(f"Validation error for {medicine_name}: {serializer.errors}")
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Pharmacy.DoesNotExist:
                serializer = PharmacySerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    response_data.append(serializer.data)
                else:
                    logger.error(f"Validation error for new entry {medicine_name}: {serializer.errors}")
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error(f"Unexpected error for {medicine_name}: {e}")
                return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(response_data, status=status.HTTP_200_OK)


from django.views.decorators.http import require_http_methods
@require_http_methods(["DELETE"])
@csrf_exempt
def delete_medicine(request, medicine_name):
    try:
        medicine = Pharmacy.objects.get(medicine_name=medicine_name)
        medicine.delete()
        return JsonResponse({"message": "Medicine deleted successfully."}, status=200)
    except Pharmacy.DoesNotExist:
        return JsonResponse({"error": "Medicine not found."}, status=404)


@api_view(['POST'])
def pharmacy_upload(request):
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        # Handle file upload logic here
        return Response({'message': 'File uploaded successfully'}, status=status.HTTP_201_CREATED)
    return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)


from .models import Pharmacy
@api_view(['GET'])
def check_medicine_status(request):
    low_quantity_medicines = []
    near_expiry_medicines = []

    medicines = Pharmacy.objects.all()

    for medicine in medicines:
        if medicine.is_quantity_low():
            low_quantity_medicines.append(medicine)
        if medicine.is_expiry_near():
            near_expiry_medicines.append(medicine)

    response_data = {
        'low_quantity_medicines': PharmacySerializer(low_quantity_medicines, many=True).data,
        'near_expiry_medicines': PharmacySerializer(near_expiry_medicines, many=True).data,
    }

    return Response(response_data, status=status.HTTP_200_OK)



from .serializers import PatientSerializer
@api_view(['POST'])
def Patients_data(request):
    if request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from .models import Patient
@api_view(['GET'])
def PatientView(request):
    if request.method == 'GET':
        medicines = Patient.objects.all()
        serializer = PatientSerializer(medicines, many=True)
        return Response(serializer.data)
    

from .serializers import AppointmentSerializer
@api_view(['POST'])
@csrf_exempt
def Appointmentpost(request):
    if request.method == 'POST':
        patient_id = request.data.get('patientId')
        try:
            patient = Patient.objects.get(patientId=patient_id)
            request.data['purposeOfVisit'] = patient.purposeOfVisit
            request.data['gender'] = patient.gender
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from .models import Appointment    
@api_view(['GET'])
def AppointmentView(request):
    if request.method == 'GET':
        data = Appointment.objects.all()
        serializer = AppointmentSerializer(data, many=True)
        return Response(serializer.data)
    

from rest_framework import generics
from .models import SummaryDetail
from .serializers import SummaryDetailSerializer
@api_view(['POST'])
def SummaryDetailCreate(request):
    if request.method == 'POST':
        serializer = SummaryDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


from datetime import datetime, timedelta
@api_view(['GET'])
def get_summary_by_interval(request, interval):
    date_str = request.GET.get('date')
    try:
        selected_date = datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        return JsonResponse({'error': 'Invalid date format'}, status=400)

    if interval == 'day':
        start_date = selected_date
        end_date = selected_date
    elif interval == 'week':
        start_date = selected_date
        end_date = start_date + timedelta(days=6)
    elif interval == 'month':
        start_date = selected_date.replace(day=1)
        next_month = start_date.replace(month=start_date.month % 12 + 1, day=1)
        end_date = next_month - timedelta(days=1)
    else:
        return JsonResponse({'error': 'Invalid interval'}, status=400)

    summaries = SummaryDetail.objects.filter(date__gte=start_date, date__lte=end_date)
    serializer = SummaryDetailSerializer(summaries, many=True)
    return JsonResponse(serializer.data, safe=False)

    