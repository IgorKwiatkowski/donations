from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class Organization(models.Model):
    name = models.CharField(max_length=128)


class ProductType(models.Model):
    name = models.CharField(max_length=128)


class Donation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    beneficiary = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True)
    content = models.ManyToManyField(ProductType)
    number_of_bags = models.IntegerField()
    pickup_address = models.CharField(max_length=128)
    complete = models.BooleanField(default=False)