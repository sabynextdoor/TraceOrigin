import os
import json
from typing import Dict, List, Optional
import httpx

class AIAnalyzer:
    """AI-powered analysis using OpenAI or Claude"""
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.use_ai = bool(self.api_key)
        
    async def analyze_with_ai(self, text: str) -> Dict:
        """Use AI to analyze opportunity text"""
        if not self.use_ai:
            return {"ai_enabled": False}
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [
                            {
                                "role": "system",
                                "content": """You are a scam detection expert. Analyze the following job/internship opportunity and return a JSON response with:
                                1. risk_score (0-100)
                                2. risk_level (CRITICAL/HIGH/MEDIUM/LOW)
                                3. indicators (list of warning signs found)
                                4. verification (checklist of verification points)
                                5. recommendation (actionable advice)
                                6. extracted_info (company, role, location, salary)
                                
                                Be strict and conservative. Flag any payment requests, urgency, personal emails, or missing information."""
                            },
                            {
                                "role": "user",
                                "content": text
                            }
                        ],
                        "temperature": 0.3
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    content = data['choices'][0]['message']['content']
                    return json.loads(content)
                else:
                    return {"ai_enabled": False, "error": "AI API error"}
                    
        except Exception as e:
            print(f"AI Analysis Error: {e}")
            return {"ai_enabled": False, "error": str(e)}