import json
from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Task
from .forms import TaskForm


def home_page(request: HttpRequest) -> HttpResponse:
    return render(request, 'home.html')


def workspace_page(request: HttpRequest) -> HttpResponse:
    return render(request, 'workspace.html')


def tasks_view(request: HttpRequest) -> HttpResponse:
    tasks = Task.objects.all()

    result = []
    for task in tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "attechment": task.attechment.url,
            "status": task.status,
            "priority": task.priority,
            "due_date": task.due_date.isoformat(),
        })

    return JsonResponse(result, safe=False)


@method_decorator(csrf_exempt, name='dispatch')
class TaksView(View):

    def get(self, request: HttpRequest) -> JsonResponse:
        tasks = Task.objects.all()

        result = []
        for task in tasks:
            result.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "attechment": task.attechment.url if task.attechment else None,
                "status": task.status,
                "priority": task.priority,
                "due_date": task.due_date.isoformat() if task.due_date else None,
            })

        return JsonResponse(result, safe=False)
    
    def post(self, request: HttpRequest) -> JsonResponse:
        form = TaskForm(request.POST)

        if form.is_valid():
            data = form.cleaned_data
            task = Task(
                title=data['title']
            )
            task.save()

            return JsonResponse({'message': 'ok'})

        return JsonResponse({'message': 'error'})

