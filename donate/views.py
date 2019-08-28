from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views import View, generic
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from .forms import LoginForm, CustomUserCreationForm
from django.contrib import messages
from django.urls import reverse_lazy
from donate.models import User, ProductType


class MainPageView(View):
    def get(self, request):
        if request.user.is_authenticated:
            product_types = ProductType.objects.all()
            ctx = {
                'product_types': product_types,
                   }
            return render(request, 'form.html', ctx)
        else:
            return render(request, 'index.html')


class RegisterView(View):
    def get(self, request):
        form = LoginForm()
        return render(request, 'register.html', {'form': form})

    def post(self, request):
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            new_user = User.objects.create_user(email=email, password=password)
            return redirect('/login')
        else:
            return HttpResponse('błędy w formularzu')  #TODO zrobić ładniej


class LoginView(View):
    def get(self, request):
        form = LoginForm()
        return render(request, 'login.html', {'form': form})

    def post(self, request):
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(username=email, password=password)
        if user is not None:
            login(request, user)
            if request.user.is_superuser:
                return redirect('/admin')
            else:
                return redirect('/')
        else:
            return HttpResponse('bledne dane logowania')
