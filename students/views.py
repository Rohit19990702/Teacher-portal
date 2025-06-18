from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .models import Student
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.db.models import Avg, Count

def dashboard_view(request):
    students = Student.objects.all()
    subject_avg = (
        Student.objects.values('subject')
        .annotate(avg_marks=Avg('marks'))
        .order_by('subject')
    )
    top_performers = Student.objects.filter(marks__gte=90).count()
    low_performers = Student.objects.filter(marks__lt=40).count()
    total_students = students.count()

    context = {
        "subject_avg": list(subject_avg),
        "top_performers": top_performers,
        "low_performers": low_performers,
        "total_students": total_students,
    }
    return render(request, "students/dashboard.html", context)
def teacher_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'students/login.html', {'error': 'Invalid credentials'})
    return render(request, 'students/login.html')
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'students/login.html', {'error': 'Invalid credentials'})
    return render(request, 'students/login.html')

@login_required
def home_view(request):
    students = Student.objects.all()
    return render(request, 'students/home.html', {'students': students})
@login_required
def intro_view(request):
    return render(request, 'students/intro.html')
def logout_view(request):
    logout(request)
    return redirect('intro')

@csrf_exempt
def add_student(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        subject = data.get('subject')
        marks = int(data.get('marks'))

        try:
            student = Student.objects.get(name=name, subject=subject)
            student.marks += marks
            student.save()
            return JsonResponse({'message': 'Marks updated successfully.'})
        except Student.DoesNotExist:
            Student.objects.create(name=name, subject=subject, marks=marks)
            return JsonResponse({'message': 'New student added successfully.'})
    
    return JsonResponse({'message': 'Invalid request'}, status=400)
@csrf_exempt
def update_student(request, pk):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            student = Student.objects.get(id=pk)
            student.name = data['name']
            student.subject = data['subject']
            student.marks = int(data['marks'])
            student.save()
            return JsonResponse({"message": "Student updated"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def delete_student(request, pk):
    if request.method == "POST":
        try:
            student = Student.objects.get(id=pk)
            student.delete()
            return JsonResponse({"message": "Student deleted"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

