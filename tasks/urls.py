from django.urls import path
from .views import home_page, workspace_page


urlpatterns = [
    path('', home_page, name='home'),
    path('workspace/', workspace_page, name='workspace'),
]

