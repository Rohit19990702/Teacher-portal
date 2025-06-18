# Teacher Portal Django App

## Setup

1. Create virtual environment
```bash
python -m venv venv
venv\Scripts\activate
```

2. Install requirements
```bash
pip install -r requirements.txt
```

3. Apply migrations
```bash
python manage.py migrate
```

4. Create a superuser
```bash
python manage.py createsuperuser
```

5. Run the server
```bash
python manage.py runserver
```

Visit http://127.0.0.1:8000/
