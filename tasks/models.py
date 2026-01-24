from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='categery_images/%Y/%m/%d/', blank=True, null=True)
    is_active = models.BooleanField(default=False, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

            counter = 1
            while Category.objects.filter(slug=self.slug).exists():
                self.slug = slugify(f"{self.name}-{counter}")
                counter += 1

        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    def __repr__(self):
        return self.name


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
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(
        max_length=5,
        choices=StatusChoices.choices,
        default=StatusChoices.TODO,
        blank=True,
    )
    priority = models.CharField(
        max_length=6,
        choices=PriorityChoices.choices,
        default=PriorityChoices.LOW,
        blank=True,
    )

    user = models.ForeignKey(User, related_name='tasks', on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

            counter = 1
            while Category.objects.filter(slug=self.slug).exists():
                self.slug = slugify(f"{self.name}-{counter}")
                counter += 1

        return super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    def __repr__(self):
        return self.title


class Attechment(models.Model):
    attechment_file = models.FileField(blank=True, null=True, upload_to='attechments/%Y/%m/%d/')
    task = models.ForeignKey(Task, related_name='attechments', on_delete=models.CASCADE)

    def __str__(self):
        return self.task.title
    
    def __repr__(self):
        return self.task.title 


class SubTask(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    task = models.ForeignKey(Task, related_name='subtasks', on_delete=models.CASCADE)

    def __str__(self):
        return self.task.title
    
    def __repr__(self):
        return self.task.title 
