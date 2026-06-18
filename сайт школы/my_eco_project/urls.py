from django.contrib import admin
from django.urls import path
from eco_school_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('eco-patrol/', views.eco_patrol, name='eco_patrol'),
    path('tree-map/', views.tree_map, name='tree_map'),
    path('monitoring/', views.monitoring, name='monitoring'),
    path('news/', views.news, name='news'),
    path('gallery/', views.gallery, name='gallery'),
    path('participants/', views.participants, name='participants'),
    path('documents/', views.documents, name='documents'),
    path('achievements/', views.achievements, name='achievements'),
    path('contacts/', views.contacts, name='contacts'),
]