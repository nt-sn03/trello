from django.db import models


class Task(models.Model):

    class StatusChoices(models.TextChoices):
        TODO = 'todo', 'To Do'
        DOING = 'doing', 'Doing'
        DONE = 'done', 'Done'

    class PriorityChoices(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    attechment = models.FileField(blank=True, null=True, upload_to='attechments/')
    status = models.CharField(
        max_length=5,
        choices=StatusChoices.choices,
        default=StatusChoices.TODO,
    )
    priority = models.CharField(
        max_length=6,
        choices=PriorityChoices.choices,
        default=PriorityChoices.LOW,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    def __repr__(self):
        return self.title
