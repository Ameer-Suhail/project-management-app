from .models import Organization

class OrganizationMiddleware:
    def resolve(self, next, root, info, **kwargs):
        organization_slug = info.context.META.get('HTTP_X_ORGANIZATION_SLUG')
        if organization_slug:
            try:
                organization = Organization.objects.get(slug=organization_slug)
                info.context.organization = organization
            except Organization.DoesNotExist:
                info.context.organization = None
        else:
            info.context.organization = None
        return next(root, info, **kwargs)
