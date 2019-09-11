from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.views import View, generic
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from .forms import LoginForm, CustomUserCreationForm
from django.contrib import messages
from django.urls import reverse_lazy
from donate.models import User, ProductType, Location, Cause, Organization
from django.core import serializers


class MainPageView(View):
    def get(self, request):
        if request.user.is_authenticated:
            product_types = ProductType.objects.all()
            locations = Location.objects.all()
            causes = Cause.objects.all()
            ctx = {  # TODO to chyba wyrzucić do context processora
                'product_types': product_types,
                'locations': locations,
                'causes': causes,
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
            return HttpResponse('błędy w formularzu')  # TODO zrobić ładniej


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


class SendOrganizationsJSONView(View):
    def get(self, request):
        product = request.GET.get('product')
        cause = request.GET.get('cause')
        location = request.GET.get('location')

        organizations = Organization.objects.all()
        if location:
            organizations = organizations.filter(location__id=location)
        if product:
            organizations = organizations.filter(preferred_product__id=product)
        if cause:
            organizations = organizations.filter(cause__id=cause)
        data = serializers.serialize('json', organizations)

        return HttpResponse(data)


class GetOrganizationNameView(View):
    def get(self, request, id):
        organization = Organization.objects.get(id=id)
        return HttpResponse(organization.name)
