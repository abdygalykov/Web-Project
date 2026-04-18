from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from django.db import models as m
from .models import Transaction, Category
from .serializers import TransactionSerializer, CategorySerializer, UserCategorySerializer
from .default_categories import ensure_default_categories

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    filterset_fields = ['type']

    def get_queryset(self):
        ensure_default_categories()
        return Transaction.objects.filter(user=self.request.user)

class CategoryViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        ensure_default_categories()
        return Category.objects.filter(
            m.Q(user=self.request.user) | m.Q(is_default=True)
        )

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserCategorySerializer
        return CategorySerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        if instance.is_default or instance.user_id != self.request.user.id:
            raise PermissionDenied('Default categories cannot be deleted')
        instance.delete()
