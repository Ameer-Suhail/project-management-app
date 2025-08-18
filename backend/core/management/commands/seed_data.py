from django.core.management.base import BaseCommand
from core.models import Organization

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        if not Organization.objects.filter(slug='default-organization').exists():
            Organization.objects.create(
                name='Default Organization',
                contact_email='contact@default.com',
                slug='default-organization'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created default organization'))
        else:
            self.stdout.write(self.style.WARNING('Default organization already exists'))
