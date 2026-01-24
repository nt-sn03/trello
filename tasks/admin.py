from django.contrib import admin, messages
from django.utils.html import format_html
from django.http import HttpRequest
from django.db.models import QuerySet

from .models import Task, Attechment, SubTask, Category


class IsActiveFilter(admin.SimpleListFilter):
    title = 'Holati'
    parameter_name = 'is_active'

    def lookups(self, request, model_admin):
        return (
            ('1', 'Ha'),
            ('0', 'Yo\'q'),
        )
    
    def choices(self, changelist):
        yield {
            'selected': self.value() is None,
            'query_string': changelist.get_query_string(
                remove=[self.parameter_name]
            ),
            'display': 'Hammasi',
        }
        for lookup, title in self.lookup_choices:
            yield {
                'selected': self.value() == lookup,
                'query_string': changelist.get_query_string(
                    {self.parameter_name: lookup}
                ),
                'display': title,
            }

    def queryset(self, request, queryset):
        if self.value() == '1':
            return queryset.filter(is_active=True)
        if self.value() == '0':
            return queryset.filter(is_active=False)
        return queryset


@admin.register(Category)
class CategoryModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'colored_slug', 'display_description', 'display_image', 'is_active')
    empty_value_display = 'No'
    list_display_links = ('name', 'colored_slug', 'display_description', 'display_image')
    list_filter = (IsActiveFilter, )
    search_fields = ('name', 'description')
    fieldsets = [
        (
            'Main Information',
            {
                "fields": ["name", "is_active"],
            },
        ),
        (
            "Advanced Options",
            {
                "classes": ["collapse"],
                "fields": ["image", "description"],
            },
        ),
    ]
    actions = ('mark_as_active', 'mark_as_inactive')
    list_per_page = 10
    ordering = ('is_active',)

    @admin.display(description='Description')
    def display_description(self, obj):
        return f'{obj.description}'[:50]
    
    @admin.display(description='Colored Slug')
    def colored_slug(self, obj):
        return format_html(
            '<span style="color: red;">{}</span>',
            obj.slug
        )
    
    @admin.display(description='Image')
    def display_image(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 4px;">',
                obj.image.url
            )
        else:
            return self.empty_value_display

    @admin.action(description='Mark as active action')
    def mark_as_active(self, request: HttpRequest, queryset: QuerySet):
        updated = queryset.update(is_active=True)
        self.message_user(
            request,
            f"{updated} ta obyekt aktiv qilindi",
            messages.SUCCESS
        )

    @admin.action(description='Mark as inactive action')
    def mark_as_inactive(self, request: HttpRequest, queryset: QuerySet):
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            f"{updated} ta obyekt deaktiv qilindi",
            messages.SUCCESS
        )


@admin.register(Task)
class TaskModelAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug')
