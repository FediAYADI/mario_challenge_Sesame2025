from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='stroke_dashboard'),
    path('api/predict-stroke/', views.stroke_risk_predict, name='predict_stroke'),
]
