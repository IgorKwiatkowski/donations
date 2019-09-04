from django.core.serializers.json import DjangoJSONEncoder
from .models import Organization


class OrganizationSerializer(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, Organization):
            pass

