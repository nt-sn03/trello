from django.shortcuts import render
from django.http import HttpRequest, HttpResponse


def home_page(request: HttpRequest) -> HttpResponse:
    return render(request, 'home.html')


def workspace_page(request: HttpRequest) -> HttpResponse:
    return render(request, 'workspace.html')
