git clone https://github.com/Rohit19990702/Teacher-portal.git
cd teacher-portal
python -m venv env
source env/bin/activate  # or env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
