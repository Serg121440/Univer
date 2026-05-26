class AISEOService:
    def __init__(self, api_key: str | None = None):
        self.api_key = api_key

    async def analyze_keywords(self, text: str):
        """
        Mock SEO analysis. In production, this would call OpenAI/YandexGPT.
        """
        # Simulated analysis
        keywords = ["маркетплейс", "менеджер", "обучение", "2026"]
        found = [k for k in keywords if k in text.lower()]

        return {
            "score": len(found) / len(keywords) * 100,
            "found_keywords": found,
            "missing_keywords": [k for k in keywords if k not in found],
            "recommendations": "Добавьте больше ключевых слов, связанных с логистикой и финансами."
        }

seo_service = AISEOService()
