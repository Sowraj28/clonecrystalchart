from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True,min_length=8,style={'input_type':'password'})

    class Meta:
        model=User
        fields=['username','email','password']
        
    def create(self,validated_data):
        
       # user=User.objects.create_user(**validated_data)
       # if use User.objects.create_user will automatically hash the password
       #where use User.objects.create will not hash the password save as plain text
        user=User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
       )
       # user=User.objects.create_user(**validated_data)
        return user
    
    