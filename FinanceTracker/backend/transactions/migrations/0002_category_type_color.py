from django.db import migrations, models


def seed_category_fields(apps, schema_editor):
    Category = apps.get_model('transactions', 'Category')

    defaults = {
        'Salary': ('income', '#22c55e'),
        'Freelance': ('income', '#06b6d4'),
        'Investments': ('income', '#8b5cf6'),
        'Gifts': ('income', '#f59e0b'),
        'Products': ('expense', '#ef4444'),
        'Transport': ('expense', '#f97316'),
        'Entertainment': ('expense', '#ec4899'),
        'Utility bills': ('expense', '#64748b'),
        'Health': ('expense', '#14b8a6'),
        'Clothes': ('expense', '#a855f7'),
        'Education': ('expense', '#3b82f6'),
        'Restaurants': ('expense', '#e11d48'),
        'Еда': ('expense', '#ef4444'),
        'Транспорт': ('expense', '#f97316'),
        'Зарплата': ('income', '#22c55e'),
        'Развлечения': ('expense', '#ec4899'),
        'Здоровье': ('expense', '#14b8a6'),
        'Шоппинг': ('expense', '#a855f7'),
        'Коммуналка': ('expense', '#64748b'),
        'Другое': ('expense', '#6366f1'),
    }

    for category in Category.objects.all():
        category_type, color = defaults.get(category.name, ('expense', '#6366f1'))
        category.type = category_type
        category.color = color
        category.save(update_fields=['type', 'color'])


class Migration(migrations.Migration):
    dependencies = [
        ('transactions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='color',
            field=models.CharField(default='#6366f1', max_length=20),
        ),
        migrations.AddField(
            model_name='category',
            name='type',
            field=models.CharField(
                choices=[('income', 'Income'), ('expense', 'Expense')],
                default='expense',
                max_length=10,
            ),
        ),
        migrations.RunPython(seed_category_fields, migrations.RunPython.noop),
    ]
