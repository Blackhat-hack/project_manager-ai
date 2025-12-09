from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Project Manager AI Services",
    description="Intelligence Artificielle pour la gestion de projets",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class TaskGenerationRequest(BaseModel):
    project_name: str
    project_description: str
    num_tasks: Optional[int] = 5

class Task(BaseModel):
    title: str
    description: str
    priority: str
    estimated_hours: Optional[int] = None

class SentimentAnalysisRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str
    score: float
    confidence: float

class PredictionRequest(BaseModel):
    tasks: List[dict]
    project_data: dict

class PredictionResponse(BaseModel):
    estimated_completion_days: int
    risk_level: str
    recommendations: List[str]

# Routes
@app.get("/")
async def root():
    return {
        "message": "Project Manager AI Services API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-services"}

@app.post("/api/ai/generate-tasks", response_model=List[Task])
async def generate_tasks(request: TaskGenerationRequest):
    """
    Génère automatiquement des tâches pour un projet en utilisant l'IA
    """
    try:
        # TODO: Implémenter la génération de tâches avec un modèle ML
        # Pour l'instant, retourne des tâches d'exemple
        tasks = [
            Task(
                title=f"Tâche {i+1} pour {request.project_name}",
                description=f"Description générée automatiquement pour la tâche {i+1}",
                priority="medium" if i % 2 == 0 else "high",
                estimated_hours=8
            )
            for i in range(request.num_tasks)
        ]
        
        logger.info(f"Generated {len(tasks)} tasks for project: {request.project_name}")
        return tasks
    
    except Exception as e:
        logger.error(f"Error generating tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/sentiment-analysis", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentAnalysisRequest):
    """
    Analyse le sentiment d'un texte (commentaire, feedback, etc.)
    """
    try:
        # TODO: Implémenter l'analyse de sentiment avec transformers
        # Pour l'instant, retourne un résultat d'exemple
        
        text_lower = request.text.lower()
        
        # Simple heuristique pour la démo
        positive_words = ['bon', 'excellent', 'super', 'génial', 'parfait', 'great', 'good']
        negative_words = ['mauvais', 'problème', 'erreur', 'bug', 'lent', 'bad', 'error']
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            sentiment = "positive"
            score = 0.7 + (positive_count * 0.1)
        elif negative_count > positive_count:
            sentiment = "negative"
            score = 0.3 - (negative_count * 0.1)
        else:
            sentiment = "neutral"
            score = 0.5
        
        return SentimentResponse(
            sentiment=sentiment,
            score=max(0.0, min(1.0, score)),
            confidence=0.85
        )
    
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/predict-timeline", response_model=PredictionResponse)
async def predict_timeline(request: PredictionRequest):
    """
    Prédit le délai de réalisation et identifie les risques
    """
    try:
        # TODO: Implémenter la prédiction avec un modèle ML
        # Pour l'instant, retourne une prédiction d'exemple
        
        num_tasks = len(request.tasks)
        avg_estimated_days = num_tasks * 2  # Estimation simple
        
        # Calcul du niveau de risque basé sur le nombre de tâches
        if num_tasks < 5:
            risk_level = "low"
        elif num_tasks < 15:
            risk_level = "medium"
        else:
            risk_level = "high"
        
        recommendations = [
            "Prioriser les tâches critiques",
            "Allouer plus de ressources aux tâches complexes",
            "Prévoir des points de contrôle hebdomadaires"
        ]
        
        if risk_level == "high":
            recommendations.append("Considérer la division du projet en phases")
        
        return PredictionResponse(
            estimated_completion_days=avg_estimated_days,
            risk_level=risk_level,
            recommendations=recommendations
        )
    
    except Exception as e:
        logger.error(f"Error predicting timeline: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/optimize-allocation")
async def optimize_task_allocation(project_data: dict):
    """
    Recommande l'allocation optimale des tâches aux membres de l'équipe
    """
    try:
        # TODO: Implémenter l'optimisation avec un algorithme ML
        return {
            "message": "Task allocation optimization",
            "recommendations": [
                {
                    "task_id": 1,
                    "recommended_user_id": 2,
                    "confidence": 0.85,
                    "reason": "Compétences correspondantes"
                }
            ]
        }
    
    except Exception as e:
        logger.error(f"Error optimizing allocation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
