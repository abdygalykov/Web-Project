from rest_framework import serializers
from .models import Transaction, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type', 'icon', 'color']


class UserCategorySerializer(CategorySerializer):
    class Meta(CategorySerializer.Meta):
        read_only_fields = ['id']


class TransactionSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
    )
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id',
            'amount',
            'type',
            'category_id',
            'category_name',
            'category_icon',
            'category_color',
            'description',
            'date',
            'created_at',
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Сумма должна быть больше 0")
        return value

    def validate_category_id(self, value):
        user = self.context['request'].user
        if value.user_id not in (None, user.id):
            raise serializers.ValidationError('Category is not available for this user')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
