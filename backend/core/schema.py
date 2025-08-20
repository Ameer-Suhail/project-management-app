import graphene
from graphene_django import DjangoObjectType
from .models import Organization, Project, Task, TaskComment


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = "__all__"


class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completion_rate = graphene.Float()

    class Meta:
        model = Project
        fields = "__all__"

    def resolve_task_count(self, info):
        return self.tasks.count()

    def resolve_completion_rate(self, info):
        total_tasks = self.tasks.count()
        if total_tasks == 0:
            return 0
        completed_tasks = self.tasks.filter(status='DONE').count()
        return (completed_tasks / total_tasks) * 100


class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = "__all__"


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = "__all__"


class Query(graphene.ObjectType):
    organizations = graphene.List(OrganizationType)
    organization = graphene.Field(OrganizationType)
    projects = graphene.List(ProjectType)
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))
    tasks = graphene.List(TaskType, project_id=graphene.ID(required=True))
    task = graphene.Field(TaskType, id=graphene.ID(required=True))

    def resolve_organizations(self, info):
        return Organization.objects.all()

    def resolve_organization(self, info):
        return info.context.organization

    def resolve_projects(self, info):
        if not info.context.organization:
            return Project.objects.none()
        return Project.objects.filter(organization=info.context.organization)

    def resolve_project(self, info, id):
        if not info.context.organization:
            return None
        return Project.objects.get(pk=id, organization=info.context.organization)

    def resolve_tasks(self, info, project_id):
        if not info.context.organization:
            return Task.objects.none()
        return Task.objects.filter(project_id=project_id, project__organization=info.context.organization)

    def resolve_task(self, info, id):
        if not info.context.organization:
            return None
        return Task.objects.get(pk=id, project__organization=info.context.organization)


# Mutations
class CreateOrganization(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)

    organization = graphene.Field(lambda: OrganizationType)

    def mutate(self, info, name, contact_email):
        organization = Organization(name=name, contact_email=contact_email)
        organization.save()
        return CreateOrganization(organization=organization)


class CreateProject(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(lambda: ProjectType)

    def mutate(self, info, name, description=None, due_date=None):
        organization = info.context.organization
        if not organization:
            raise Exception('Organization not found in context')

        project = Project(
            name=name,
            organization=organization,
            description=description,
            due_date=due_date
        )
        project.save()
        return CreateProject(project=project)


class CreateTask(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        assignee_email = graphene.String()
        project_id = graphene.ID(required=True)

    task = graphene.Field(lambda: TaskType)

    def mutate(self, info, title, project_id, description=None, assignee_email=None):
        organization = info.context.organization
        if not organization:
            raise Exception('Organization not found in context')

        project = Project.objects.get(pk=project_id, organization=organization)
        task = Task(
            title=title,
            project=project,
            description=description,
            assignee_email=assignee_email
        )
        task.save()
        return CreateTask(task=task)


class AddCommentToTask(graphene.Mutation):
    class Arguments:
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)
        task_id = graphene.ID(required=True)

    comment = graphene.Field(lambda: TaskCommentType)

    def mutate(self, info, content, author_email, task_id):
        organization = info.context.organization
        if not organization:
            raise Exception('Organization not found in context')

        task = Task.objects.get(pk=task_id, project__organization=organization)
        comment = TaskComment(
            content=content,
            author_email=author_email,
            task=task
        )
        comment.save()
        return AddCommentToTask(comment=comment)


class UpdateProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(lambda: ProjectType)

    def mutate(self, info, id, name=None, description=None, status=None, due_date=None):
        organization = info.context.organization
        if not organization:
            raise Exception('Organization not found in context')

        try:
            project = Project.objects.get(pk=id, organization=organization)
            
            if name is not None:
                project.name = name
            if description is not None:
                project.description = description
            if status is not None:
                project.status = status
            if due_date is not None:
                project.due_date = due_date
            
            project.save()
            return UpdateProject(project=project)
        except Project.DoesNotExist:
            raise Exception("Project not found")


class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()

    task = graphene.Field(lambda: TaskType)

    def mutate(self, info, id, title=None, description=None, status=None, assignee_email=None):
        organization = info.context.organization
        if not organization:
            raise Exception('Organization not found in context')

        try:
            task = Task.objects.get(pk=id, project__organization=organization)
            
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if status is not None:
                task.status = status
            if assignee_email is not None:
                task.assignee_email = assignee_email
            
            task.save()
            return UpdateTask(task=task)
        except Task.DoesNotExist:
            raise Exception("Task not found")


class DeleteProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        organization = info.context.organization
        if not organization:
            raise Exception('Organization not found in context')

        try:
            project = Project.objects.get(pk=id, organization=organization)
            project.delete()
            return DeleteProject(ok=True)
        except Project.DoesNotExist:
            raise Exception("Project not found")


class DeleteTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        organization = info.context.organization
        if not organization:
            raise Exception('Organization not found in context')

        try:
            task = Task.objects.get(pk=id, project__organization=organization)
            task.delete()
            return DeleteTask(ok=True)
        except Task.DoesNotExist:
            raise Exception("Task not found")


class Mutation(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    create_project = CreateProject.Field()
    create_task = CreateTask.Field()
    add_comment_to_task = AddCommentToTask.Field()
    update_project = UpdateProject.Field()
    update_task = UpdateTask.Field()
    delete_project = DeleteProject.Field()
    delete_task = DeleteTask.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
