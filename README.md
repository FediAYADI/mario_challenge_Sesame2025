# Mario Challenge – Intelligent Stroke Prediction Platform

## Technologies Used

- **Backend**
  - Django (Python web framework)

- **Frontend**
  - HTML5 templates (Django templates)
  - CSS3 (custom styling, Mario-inspired UI)
  - Vanilla JavaScript (form handling, API calls, animations)

- **Assets**
  - Static CSS under `static/css`
  - Static JavaScript under `static/js`
  - Images under `static/image`
  - Background video under `static/video`

- **Environment / Dependencies**
  - Python (see `requirements.txt` for exact dependencies)

## Project Structure

```text
mario_challenge/
├─ manage.py                # Django management script
├─ requirements.txt         # Python dependencies
├─ README.md                # Project documentation (this file)
├─ stroke_platform/         # Django project configuration (settings, URLs, WSGI/ASGI)
│  ├─ __init__.py
│  ├─ settings.py
│  ├─ urls.py
│  ├─ wsgi.py
│  └─ asgi.py
├─ stroke_app/              # Main application for stroke prediction
│  ├─ __init__.py
│  ├─ admin.py
│  ├─ apps.py
│  ├─ models.py             # Data models (if used)
│  ├─ views.py              # View functions / API endpoints
│  ├─ urls.py               # App-specific URL routes
│  ├─ forms.py              # Django forms (if used)
│  └─ ...                   # Other app modules (serializers, utils, etc.)
├─ templates/
│  └─ stroke_app/
│     └─ index.html         # Main UI: hero section, Mario ladder, form, results
└─ static/
   ├─ css/
   │  └─ styles.css         # Global styles and Mario-themed UI
   ├─ js/
   │  └─ app.js             # Frontend logic, API calls, Mario climber behavior
   ├─ image/
   │  └─ ...                # Image assets (e.g., Mario sprite, icons)
   └─ video/
      └─ videoplayback.mp4  # Background hero video
```

## High-Level Flow

1. User lands on the **hero section** with a background video and an entry button.
2. Clicking the hero button scrolls smoothly to the **stroke prediction platform**.
3. User fills in demographic, physiological, and medical history data.
4. Frontend JavaScript sends the data to the backend `/api/predict-stroke/` endpoint.
5. Backend returns a prediction (risk level, score, factors, suggestions).
6. UI updates the **risk badge, progress bar, factors, and history**.

## Running the Project (Summary)

1. Create & activate a Python virtual environment.
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Apply migrations:

   ```bash
   python manage.py migrate
   ```

4. Run the development server:

   ```bash
   python manage.py runserver
   ```

5. Open the app in your browser (usually `http://127.0.0.1:8000/`).
