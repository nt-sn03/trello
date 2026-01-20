from django.urls import path
from .views import home_page, workspace_page, TaksView


urlpatterns = [
    path('', home_page, name='home'),
    path('workspace/', workspace_page, name='workspace'),

    # apis
    path('tasks/', TaksView.as_view(), name='tasks'),
]

