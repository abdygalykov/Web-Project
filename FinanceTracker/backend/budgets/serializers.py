from rest_framework import serializers
from django.db.models import Sum
from transactions.models import Transaction
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    spent = serializers.SerializerMethodField()
    amount = serializers.DecimalField(source='amount_limit', max_digits=10, decimal_places=2)
    month = serializers.SerializerMethodField()
    year = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = ['id', 'category_id', 'category_name', 'amount', 'spent', 'month', 'year']

    def get_spent(self, obj):
        total = Transaction.objects.filter(
            user=obj.user,
            category=obj.category,
            type='expense',
            date__year=obj.month.year,
            date__month=obj.month.month
        ).aggregate(total=Sum('amount'))['total']
        return total or 0

    def get_month(self, obj):
        return obj.month.month - 1

    def get_year(self, obj):
        return obj.month.year
