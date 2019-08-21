from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm


class LoginForm(forms.Form):
    username = forms.CharField(label='Email')
    password = forms.CharField(widget=forms.PasswordInput, label='hasło')
