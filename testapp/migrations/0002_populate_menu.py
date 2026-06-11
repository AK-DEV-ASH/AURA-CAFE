from django.db import migrations

def populate_cafe_data(apps, schema_editor):
    Category = apps.get_model('testapp', 'Category')
    MenuItem = apps.get_model('testapp', 'MenuItem')
    
    # Create Categories
    coffee, _ = Category.objects.get_or_create(name='Coffee', slug='coffee')
    bakery, _ = Category.objects.get_or_create(name='Bakery', slug='bakery')
    desserts, _ = Category.objects.get_or_create(name='Desserts', slug='desserts')
    
    # Create Menu Items
    MenuItem.objects.get_or_create(
        name='Aura Cappuccino',
        defaults={
            'description': 'Velvety double espresso shot blended with steamed microfoam milk and finished with premium caramel latte art.',
            'price': 4.50,
            'image_url': '/static/testapp/images/cappuccino.png',
            'category': coffee,
            'is_available': True
        }
    )
    
    MenuItem.objects.get_or_create(
        name='Chocolate Croissant',
        defaults={
            'description': 'Freshly baked, warm flaky golden pastry filled with layers of premium melted dark chocolate.',
            'price': 3.75,
            'image_url': '/static/testapp/images/croissant.png',
            'category': bakery,
            'is_available': True
        }
    )
    
    MenuItem.objects.get_or_create(
        name='Raspberry Cheesecake',
        defaults={
            'description': 'Gourmet slice of rich vanilla bean cheesecake topped with signature fresh raspberry coulis and a mint leaf garnish.',
            'price': 6.50,
            'image_url': '/static/testapp/images/cheesecake.png',
            'category': desserts,
            'is_available': True
        }
    )

def reverse_cafe_data(apps, schema_editor):
    Category = apps.get_model('testapp', 'Category')
    MenuItem = apps.get_model('testapp', 'MenuItem')
    
    MenuItem.objects.all().delete()
    Category.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('testapp', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(populate_cafe_data, reverse_code=reverse_cafe_data),
    ]
