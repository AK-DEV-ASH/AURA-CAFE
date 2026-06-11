from django.urls import path
from . import views

urlpatterns = [
    path('', views.menu_view, name='menu'),
    path('checkout/', views.checkout_view, name='checkout'),
    path('order-success/<int:order_id>/', views.order_success_view, name='order_success'),
]
