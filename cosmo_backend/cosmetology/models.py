# models.py
from django.utils import timezone
from datetime import timedelta,datetime
from django.db import models


class Register(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    name = models.CharField(max_length=500)
    role = models.CharField(max_length=500)
    email = models.EmailField(max_length=500, unique=True)
    password = models.CharField(max_length=500)
    confirmPassword = models.CharField(max_length=500)


class Login(models.Model):
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=120)


class Pharmacy(models.Model):
    medicine_name = models.CharField(max_length=255, unique=True)
    company_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    GST = models.CharField(max_length=200)
    new_stock = models.IntegerField()
    old_stock = models.IntegerField()
    received_date = models.DateField()
    expiry_date = models.DateField()
    batch_number = models.CharField(max_length=255)

    def __str__(self):
        return self.medicine_name

    def is_quantity_low(self):
        return self.old_stock <= 15

    def is_expiry_near(self):
        return (self.expiry_date - timezone.now().date()) <= timedelta(days=10)


class Patient(models.Model):
    patientName = models.CharField(max_length=255)
    mobileNumber = models.CharField(max_length=11,primary_key=True)
    dateOfBirth = models.DateField()
    gender = models.CharField(max_length=10)
    patientId = models.CharField(max_length=10, unique=True, blank=True, editable=False)
    email = models.EmailField()
    bloodGroup = models.CharField(max_length=3)
    language = models.CharField(max_length=10)
    purposeOfVisit = models.CharField(max_length=500)
    address = models.TextField()

    def save(self, *args, **kwargs):
        if not self.patientId:
            self.patientId = f'{Patient.objects.count() + 1}'  # Padded to 10 digits
        super(Patient, self).save(*args, **kwargs)

    def __str__(self):
        return self.patientName
    

class Appointment(models.Model):
    patientId = models.CharField(max_length=10)
    patientName = models.CharField(max_length=255)
    mobileNumber = models.CharField(max_length=11)
    appointmentTime = models.CharField(max_length=1000)
    appointmentDate = models.DateField()
    purposeOfVisit = models.CharField(max_length=500)
    gender = models.CharField(max_length=10)

    def __str__(self):
        return self.patientName


class SummaryDetail(models.Model):
    patient_name = models.CharField(max_length=100)
    diagnosis = models.TextField(blank=True)
    complaints = models.TextField(blank=True)
    findings = models.TextField(blank=True)
    prescription = models.TextField(blank=True)
    plans = models.TextField(blank=True)
    tests = models.TextField(blank=True)
    procedures = models.TextField(blank=True)
    uploadedImages = models.JSONField(default=list, blank=True)  # Store images as JSON
    nextVisit = models.TextField(blank=True)  # Assuming this is for next visit details
    date = models.DateField(auto_now_add=True)  # Automatically set the date when the object is created
    time = models.CharField(max_length=8, blank=True)  # Custom field to store current time in HH:MM:SS format
    def save(self, *args, **kwargs):
        # Set current Indian Standard Time (IST)
        tz = timezone.get_current_timezone()
        current_time = timezone.localtime(timezone.now(), tz).strftime('%H:%M:%S')
        self.time = current_time
        super().save(*args, **kwargs)
    def __str__(self):
        return self.diagnosis


class Visit(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    visit_date = models.DateTimeField(auto_now_add=True)


class Vital(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    height = models.CharField(max_length=10)
    weight = models.CharField(max_length=10)
    pulseRate = models.CharField(max_length=10)
    bloodPressure = models.CharField(max_length=10)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.patientName} - {self.recorded_at}"