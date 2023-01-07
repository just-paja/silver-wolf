from django.db.models.constants import LOOKUP_SEP
from django.contrib.admin.filters import SimpleListFilter
from django.core.exceptions import FieldDoesNotExist
from django.db import models
from django.utils.encoding import force_str
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _


def flatten(ls):
    return [item.year for sublist in ls for item in sublist]


def unique(ls):
    unique_list = []
    for x in ls:
        if x not in unique_list:
            unique_list.append(x)
    return unique_list


def lookups_to_choices(ls):
    return [(item, item) for item in ls]


class DefaultListFilter(SimpleListFilter):
    all_value = 'all'

    def default_value(self):
        raise NotImplementedError()

    def queryset(self, request, queryset):
        value = self.value()
        if value == self.all_value:
            return queryset

        return queryset.filter(**{self.parameter_name: value})

    def value(self):
        if self.parameter_name in self.used_parameters:
            return super().value()
        return self.default_value()

    def choices(self, cl):
        yield {
            'selected':
            self.value() == self.all_value,
            'query_string':
            cl.get_query_string({self.parameter_name: self.all_value}, []),
            'display':
            _('All'),
        }
        for lookup, title in self.lookup_choices:
            selected = self.value() == force_str(lookup) or (
                self.value() is None
                and force_str(self.default_value()) == force_str(lookup))
            yield {
                'selected':
                selected,
                'query_string':
                cl.get_query_string({
                    self.parameter_name: lookup,
                }, []),
                'display':
                title,
            }


class YearFilter(DefaultListFilter):
    accept_null = True
    filter_fields = []
    fields = []
    current = False
    parameter_name = 'year'
    title = _('Year')

    def __init__(self, request, params, model, model_admin):
        self.model = model
        self.fields = {}
        for lookup in self.filter_fields:
            self.fields[lookup] = self.get_field(model, lookup)
        super().__init__(request, params, model, model_admin)

    def get_field(self, qmodel, lookup):
        model = qmodel
        for name in lookup.split(LOOKUP_SEP):
            try:
                f = model._meta.get_field(name)
            except FieldDoesNotExist:
                for f in model._meta.related_objects:
                    if f.get_accessor_name() == name:
                        break
                else:
                    raise ValueError(f"Invalid lookup string: {lookup}")
            if f.is_relation:
                model = f.related_model
                continue
            return f

    def default_value(self):
        return str(next(iter(self.get_lookup_values()), self.all_value))

    def get_lookup_values(self):
        qs = self.model.objects
        db_values = [qs.dates(field, 'year') for field in self.filter_fields]
        default = []
        if self.current:
            default.append(now().year)
        lookups = unique(default + flatten(db_values))
        lookups.sort(reverse=True)
        return lookups

    def lookups(self, request, model_admin):
        return lookups_to_choices(self.get_lookup_values())

    def parse_value(self):
        value = self.value()
        try:
            return int(value) if value else None
        except (ValueError):
            return None

    def format_date(self, field, year):
        if isinstance(field, models.DateTimeField):
            return f"{year}-01-01T00:00:00"
        return f"{year}-01-01"

    def queryset(self, request, queryset):
        year = self.parse_value()
        qs = queryset
        if year:
            qs = queryset.distinct()
            next_year = year + 1
            for [lookup, field] in self.fields.items():
                range_values = {
                    f"{lookup}__gte": self.format_date(field, year),
                    f"{lookup}__lt": self.format_date(field, next_year),
                }
                if self.accept_null:
                    qs = qs.filter(
                        models.Q(**range_values)
                        | models.Q(**{f"{lookup}__isnull": True}))
                else:
                    qs = qs.filter(models.Q(**range_values))
        return qs
