import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


def dashboard(request):
    return render(request, 'stroke_app/index.html')


@csrf_exempt  # for now; in production you should enable proper CSRF handling
def stroke_risk_predict(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    # --- Placeholder risk logic (replace with your trained model later) ---
    age = data.get('age', 0)
    bmi = float(data.get('bmi', 0) or 0)
    hypertension = int(data.get('hypertension', 0) or 0)
    heart = int(data.get('heart_disease', 0) or 0)
    glucose = float(data.get('avg_glucose_level', 0) or 0)
    smoking_status = data.get('smoking_status', 'Unknown')

    base = 0.05
    base += 0.01 * max(age - 45, 0) / 10
    base += 0.02 * hypertension
    base += 0.02 * heart
    base += 0.01 * max(bmi - 25, 0) / 5
    base += 0.01 * max(glucose - 110, 0) / 20
    if smoking_status == 'smokes':
        base += 0.03
    elif smoking_status == 'formerly smoked':
        base += 0.01

    risk_score = max(0.0, min(0.99, base))

    if risk_score < 0.33:
        risk_level = 'low'
    elif risk_score < 0.66:
        risk_level = 'medium'
    else:
        risk_level = 'high'

    aggravating_factors = []
    if hypertension:
        aggravating_factors.append('History of hypertension')
    if heart:
        aggravating_factors.append('Existing heart disease')
    if bmi >= 30:
        aggravating_factors.append('Obese body mass index')
    elif bmi >= 25:
        aggravating_factors.append('Overweight body mass index')
    if glucose >= 126:
        aggravating_factors.append('Elevated average glucose level')
    if smoking_status == 'smokes':
        aggravating_factors.append('Active smoking')
    elif smoking_status == 'formerly smoked':
        aggravating_factors.append('Past smoking history')

    if not aggravating_factors:
        aggravating_factors.append('No major aggravating factors identified from the provided data.')

    suggestions = [
        'Review blood pressure control and antihypertensive therapy.',
        'Assess glycemic control and lifestyle factors.',
        'Encourage regular physical activity and weight management.',
        'Consider comprehensive cardiovascular risk assessment.',
    ]

    return JsonResponse({
        'risk_level': risk_level,
        'risk_score': float(risk_score),
        'aggravating_factors': aggravating_factors,
        'suggestions': suggestions,
    })
