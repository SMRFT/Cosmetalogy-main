from django.urls import path
from .views import registration,login,pharmacy_data,check_medicine_status,pharmacy_upload,delete_medicine
from .views import Patients_data,PatientView,Appointmentpost,AppointmentView,SummaryDetailCreate,get_summary_by_interval

urlpatterns = [
    path('registration/', registration, name='registration'),
    path('login/', login, name='login'),
    path('pharmacy/data/', pharmacy_data, name='pharmacy_data'),
    path('pharmacy/data/<str:medicine_name>/', delete_medicine, name='delete_medicine'),
    path('pharmacy/upload/', pharmacy_upload, name='pharmacy_upload'),
    path('check_medicine_status/', check_medicine_status, name='check_medicine_status'),
    path('Patients_data/', Patients_data, name='Patients_data'),
    path('patients/', PatientView, name='PatientView'),
    path('Appointmentpost/', Appointmentpost, name='Appointmentpost'),
    path('AppointmentView/', AppointmentView, name='AppointmentView'),
    path('summary/post/', SummaryDetailCreate, name='summary-create'),
    path('summary/<str:interval>/', get_summary_by_interval, name='summary-by-interval'),
]
