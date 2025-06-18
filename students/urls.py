from django.urls import path
from . import views

urlpatterns = [
    path('', views.intro_view, name='intro'),
    path('login/', views.login_view, name='login'),
    
    path('home/', views.home_view, name='home'),
    path('logout/', views.logout_view, name='logout'),
    path('add_student/', views.add_student, name='add_student'),
    path('update_student/<int:pk>/', views.update_student, name='update_student'),
    path('delete_student/<int:pk>/', views.delete_student, name='delete_student'),
    path("dashboard/", views.dashboard_view, name="dashboard"),
]
