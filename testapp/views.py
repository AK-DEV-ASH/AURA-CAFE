import json
import re
from django.shortcuts import render, redirect, get_object_or_404
from django.db import transaction
from django.http import HttpResponse
from .models import Category, MenuItem, Order, OrderItem

def menu_view(request):
    categories = Category.objects.all()
    items = MenuItem.objects.filter(is_available=True)
    return render(request, 'testapp/menu.html', {
        'categories': categories,
        'items': items
    })

def checkout_view(request):
    if request.method == 'POST':
        customer_name = request.POST.get('customer_name', '').strip()
        customer_email = request.POST.get('customer_email', '').strip()
        customer_phone = request.POST.get('customer_phone', '').strip()
        address_or_notes = request.POST.get('address_or_notes', '').strip()
        cart_data = request.POST.get('cart_data', '[]')
        
        errors = {}
        
        # Server-side validation
        if not customer_name:
            errors['customer_name'] = 'Full Name is required.'
        elif len(customer_name) < 2:
            errors['customer_name'] = 'Full Name must be at least 2 characters.'
            
        if not customer_email:
            errors['customer_email'] = 'Email Address is required.'
        elif not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', customer_email):
            errors['customer_email'] = 'Please enter a valid email address.'
            
        if not customer_phone:
            errors['customer_phone'] = 'Phone Number is required.'
        elif not re.match(r'^[\+]?[\d\s\-\(\)]{7,}$', customer_phone):
            errors['customer_phone'] = 'Please enter a valid phone number.'
            
        try:
            cart = json.loads(cart_data)
        except json.JSONDecodeError:
            cart = []
            
        if not cart:
            errors['cart'] = 'Your cart is empty.'
            
        # Parse and validate cart items
        valid_items = []
        total_price = 0
        
        for item in cart:
            try:
                item_id = item.get('id')
                qty = int(item.get('quantity', 1))
                if qty <= 0:
                    continue
                    
                menu_item = MenuItem.objects.get(id=item_id)
                item_total = menu_item.price * qty
                valid_items.append((menu_item, qty))
                total_price += item_total
            except (MenuItem.DoesNotExist, ValueError, TypeError):
                continue
                
        if not valid_items and not errors.get('cart'):
            errors['cart'] = 'Your order must contain at least one valid item with positive quantity.'
            
        if errors:
            return render(request, 'testapp/checkout.html', {
                'errors': errors,
                'customer_name': customer_name,
                'customer_email': customer_email,
                'customer_phone': customer_phone,
                'address_or_notes': address_or_notes,
            })
            
        # Create order and order items atomically
        with transaction.atomic():
            order = Order.objects.create(
                customer_name=customer_name,
                customer_email=customer_email,
                customer_phone=customer_phone,
                address_or_notes=address_or_notes,
                total_price=total_price
            )
            for menu_item, qty in valid_items:
                OrderItem.objects.create(
                    order=order,
                    menu_item=menu_item,
                    quantity=qty,
                    price=menu_item.price
                )
                
        return redirect('order_success', order_id=order.id)
        
    return render(request, 'testapp/checkout.html')

def order_success_view(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(request, 'testapp/order_success.html', {'order': order})

