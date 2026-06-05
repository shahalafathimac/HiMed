import os
import sys
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

# Windows requires solo pool (prefork pool crashes on Windows)
if sys.platform == 'win32':
    app.conf.worker_pool = 'solo'
