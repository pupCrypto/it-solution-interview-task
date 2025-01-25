from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'cash-flow-records', views.CashFlowRecordViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'types', views.TypeViewSet)
router.register(r'statuses', views.StatusViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
