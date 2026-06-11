from django.db import migrations


def add_more_menu_items(apps, schema_editor):
    Category = apps.get_model('testapp', 'Category')
    MenuItem = apps.get_model('testapp', 'MenuItem')

    # Get existing categories
    coffee = Category.objects.get(slug='coffee')
    bakery = Category.objects.get(slug='bakery')
    desserts = Category.objects.get(slug='desserts')

    # New Coffee Items
    MenuItem.objects.get_or_create(
        name='Iced Caramel Latte',
        defaults={
            'description': 'Smooth cold-brewed espresso poured over crushed ice, swirled with house-made caramel and velvety oat milk.',
            'price': 5.25,
            'image_url': '/static/testapp/images/iced_latte.png',
            'category': coffee,
            'is_available': True,
        }
    )

    MenuItem.objects.get_or_create(
        name='Ceremonial Matcha Latte',
        defaults={
            'description': 'Premium stone-ground Japanese matcha whisked to perfection with steamed milk and a touch of vanilla.',
            'price': 5.75,
            'image_url': '/static/testapp/images/matcha_latte.png',
            'category': coffee,
            'is_available': True,
        }
    )

    # New Bakery Items
    MenuItem.objects.get_or_create(
        name='Wild Blueberry Muffin',
        defaults={
            'description': 'Fluffy golden muffin bursting with wild blueberries, topped with a crunchy streusel and dusted with powdered sugar.',
            'price': 3.50,
            'image_url': '/static/testapp/images/blueberry_muffin.png',
            'category': bakery,
            'is_available': True,
        }
    )

    MenuItem.objects.get_or_create(
        name='Walnut Banana Bread',
        defaults={
            'description': 'Thick-cut slice of moist banana bread studded with toasted walnuts, made with ripe organic bananas and brown butter.',
            'price': 4.00,
            'image_url': '/static/testapp/images/banana_bread.png',
            'category': bakery,
            'is_available': True,
        }
    )

    # New Dessert Items
    MenuItem.objects.get_or_create(
        name='Classic Tiramisu',
        defaults={
            'description': 'Layers of espresso-soaked ladyfingers and whipped mascarpone cream, finished with a dusting of premium cocoa.',
            'price': 7.50,
            'image_url': '/static/testapp/images/tiramisu.png',
            'category': desserts,
            'is_available': True,
        }
    )

    MenuItem.objects.get_or_create(
        name='Crème Brûlée',
        defaults={
            'description': 'Silky vanilla bean custard topped with a perfectly torched caramelized sugar crust. Served in a classic ramekin.',
            'price': 6.75,
            'image_url': '/static/testapp/images/creme_brulee.png',
            'category': desserts,
            'is_available': True,
        }
    )


def remove_new_menu_items(apps, schema_editor):
    MenuItem = apps.get_model('testapp', 'MenuItem')
    MenuItem.objects.filter(name__in=[
        'Iced Caramel Latte',
        'Ceremonial Matcha Latte',
        'Wild Blueberry Muffin',
        'Walnut Banana Bread',
        'Classic Tiramisu',
        'Crème Brûlée',
    ]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('testapp', '0002_populate_menu'),
    ]

    operations = [
        migrations.RunPython(add_more_menu_items, reverse_code=remove_new_menu_items),
    ]
