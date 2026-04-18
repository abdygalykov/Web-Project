"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import JsonResponse
from django.http import Http404
from django.urls import path, include
from django.views.generic import TemplateView


class FrontendAppView(TemplateView):
    template_name = 'index.html'

    def get_template_names(self):
        if not self.template_name:
            raise Http404
        return [self.template_name]


def healthcheck(_request):
    return JsonResponse({'status': 'ok'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', healthcheck),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('transactions.urls')),
    path('api/', include('budgets.urls')),
    path('', FrontendAppView.as_view()),
    path('<path:path>', FrontendAppView.as_view()),
]
