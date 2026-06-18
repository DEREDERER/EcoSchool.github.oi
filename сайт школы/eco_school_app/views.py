from django.shortcuts import render, redirect
import urllib.parse  # Добавили для кодирования ссылки

def home(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def eco_patrol(request):
    return render(request, 'eco-patrol.html')

def tree_map(request):
    return render(request, 'tree-map.html')

def monitoring(request):
    return render(request, 'monitoring.html')

def news(request):
    return render(request, 'news.html')

def gallery(request):
    return render(request, 'gallery.html')

def participants(request):
    return render(request, 'participants.html')

def documents(request):
    return render(request, 'documents.html')

def achievements(request):
    return render(request, 'achievements.html')

def contacts(request):
    # Если пользователь отправил форму (нажал на кнопку)
    if request.method == 'POST':
        # 1. Получаем данные из формы (по атрибутам name)
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        # 2. Формируем текст сообщения для WhatsApp
        text = f"Здравствуйте! Меня зовут {name}.\nМоя почта: {email}\nМое сообщение: {message}"
        
        # Кодируем текст в безопасный для ссылки формат
        encoded_text = urllib.parse.quote(text)

        # 3. Ваш номер в международном формате (996 + 501502214)
        phone_number = "996501502214"

        # 4. Генерируем ссылку
        whatsapp_url = f"https://api.whatsapp.com/send?phone={phone_number}&text={encoded_text}"

        # 5. Перенаправляем пользователя сразу в WhatsApp
        return redirect(whatsapp_url)

    # Если пользователь просто зашел на страницу (GET-запрос)
    return render(request, 'contacts.html')