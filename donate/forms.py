from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


class LoginForm(forms.Form):

    email = forms.CharField(label='Email', widget=forms.TextInput(attrs={'placeholder': 'Email'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Hasło'}), label='hasło')


class CustomUserCreationForm(forms.Form):
    email = forms.CharField(label='Email')
    password = forms.CharField(widget=forms.PasswordInput, label='hasło')


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = User
        fields = ('username', 'email')