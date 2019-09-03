from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class Location(models.Model):
    name = models.CharField(max_length=128)


class OrganizationType(models.Model):
    name = models.CharField(max_length=128)


class ProductType(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField()


class Cause(models.Model):
    name = models.CharField(max_length=256)
    language_dependent_description = models.CharField(max_length=256)  # możliwe że można tu dać null=True
                                                                    # lub default taki sam jak name, ponieważ niektóre
                                                                    # języki nie potrzebują tego pola


class Organization(models.Model):
    name = models.CharField(max_length=128)
    location = models.ManyToManyField(Location)
    type = models.ForeignKey(OrganizationType, on_delete=models.SET_NULL, null=True)
    preferred_product = models.ManyToManyField(ProductType)
    cause = models.ManyToManyField(Cause)


class Donation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    beneficiary = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True)
    content = models.ManyToManyField(ProductType)
    number_of_bags = models.IntegerField()
    pickup_address = models.CharField(max_length=128)
    complete = models.BooleanField(default=False)
