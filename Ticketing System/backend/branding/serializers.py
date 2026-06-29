from rest_framework import serializers
from .models import SystemSettings


class SystemSettingsSerializer(serializers.ModelSerializer):
    ticket_number_preview = serializers.ReadOnlyField()
    company_logo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()

    class Meta:
        model = SystemSettings
        exclude = ['_ticket_counter', '_ticket_counter_year']
        read_only_fields = ['id']

    def get_company_logo_url(self, obj):
        if obj.company_logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.company_logo.url)
            return obj.company_logo.url
        return None

    def get_favicon_url(self, obj):
        if obj.favicon:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.favicon.url)
            return obj.favicon.url
        return None
