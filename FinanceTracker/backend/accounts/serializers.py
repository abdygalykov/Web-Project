from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, required=False)
    password_confirm = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'confirm_password',
            'password_confirm',
            'first_name',
            'last_name',
        ]

    def validate(self, data):
        confirm_password = data.get('password_confirm') or data.get('confirm_password')
        if not confirm_password:
            raise serializers.ValidationError('Confirm password is required')
        if data['password'] != confirm_password:
            raise serializers.ValidationError("Пароли не совпадают")
        data['confirm_password'] = confirm_password
        return data

    def create(self, validated_data):
        from transactions.default_categories import ensure_default_categories

        ensure_default_categories()
        validated_data.pop('password_confirm', None)
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)
