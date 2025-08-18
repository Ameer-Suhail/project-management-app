from django.contrib import admin
from .models import Organization, Project, Task, TaskComment


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'contact_email', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'contact_email']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'status', 'due_date', 'task_count', 'completion_rate', 'created_at']
    list_filter = ['status', 'organization', 'created_at']
    search_fields = ['name', 'description']
    raw_id_fields = ['organization']

    def task_count(self, obj):
        return obj.task_count
    task_count.short_description = 'Tasks'

    def completion_rate(self, obj):
        return f"{obj.completion_rate:.1f}%"
    completion_rate.short_description = 'Completion'


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'status', 'assignee_email', 'due_date', 'created_at']
    list_filter = ['status', 'project__organization', 'created_at']
    search_fields = ['title', 'description', 'assignee_email']
    raw_id_fields = ['project']


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['task', 'author_email', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'author_email']
    raw_id_fields = ['task']
