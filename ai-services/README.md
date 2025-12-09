# AI Services - Python

Services d'Intelligence Artificielle pour Project Manager AI

## 🚀 Technologies

- **FastAPI** - Framework API moderne
- **Transformers** - Modèles NLP
- **PyTorch** - Deep Learning
- **Scikit-learn** - Machine Learning
- **NLTK/spaCy** - Traitement du langage naturel

## 📦 Installation

```bash
pip install -r requirements.txt
```

## 🏃 Développement

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📁 Structure

```
ai-services/
├── main.py                 # Point d'entrée FastAPI
├── requirements.txt        # Dépendances Python
├── models/                 # Modèles ML
│   ├── task_generator.py
│   ├── sentiment.py
│   └── prediction.py
├── services/               # Services IA
│   ├── nlp_service.py
│   └── ml_service.py
└── utils/                  # Utilitaires
    ├── data_processor.py
    └── model_loader.py
```

## 🤖 API Endpoints

### Génération de Tâches
```http
POST /api/ai/generate-tasks
```
Génère automatiquement des tâches pour un projet

### Analyse de Sentiment
```http
POST /api/ai/sentiment-analysis
```
Analyse le sentiment des commentaires et feedbacks

### Prédiction de Délais
```http
POST /api/ai/predict-timeline
```
Prédit les délais de réalisation du projet

### Optimisation d'Allocation
```http
POST /api/ai/optimize-allocation
```
Recommande l'allocation optimale des tâches

## 🎯 Fonctionnalités IA

- ✅ Génération automatique de tâches
- ✅ Analyse de sentiment dans les commentaires
- ✅ Prédiction des délais de projet
- ✅ Recommandations d'allocation
- ✅ Détection des risques
- ✅ Optimisation de la productivité

## 🧪 Tests

```bash
pytest tests/
```

## 📊 Modèles Utilisés

- **GPT/BERT** pour la génération de texte
- **VADER/RoBERTa** pour l'analyse de sentiment
- **Random Forest** pour les prédictions
- **Algorithmes d'optimisation** pour l'allocation
