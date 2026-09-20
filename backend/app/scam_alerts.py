from typing import List, Dict
import json
from datetime import datetime

class ScamAlertSystem:
    """Real-time scam alert database"""
    
    def __init__(self):
        self.alerts = []
        self.load_alerts()
    
    def load_alerts(self):
        """Load alerts from database or file"""
        # In production, this would load from a database
        self.alerts = [
            {
                "id": 1,
                "title": "Fake Google Internship Scam",
                "description": "Scammers posing as Google recruiters asking for payment",
                "date": "2026-08-20",
                "severity": "HIGH",
                "tags": ["Google", "payment", "internship"]
            },
            {
                "id": 2,
                "title": "WhatsApp Job Offer Scam",
                "description": "Fake job offers sent via WhatsApp with registration fees",
                "date": "2026-08-18",
                "severity": "CRITICAL",
                "tags": ["WhatsApp", "fee", "job"]
            }
        ]
    
    def get_alerts(self, limit: int = 10) -> List[Dict]:
        """Get recent scam alerts"""
        return sorted(self.alerts, key=lambda x: x['date'], reverse=True)[:limit]
    
    def add_alert(self, alert: Dict):
        """Add a new scam alert"""
        alert['id'] = len(self.alerts) + 1
        alert['date'] = datetime.now().strftime("%Y-%m-%d")
        self.alerts.append(alert)
        return alert
    
    def search_alerts(self, query: str) -> List[Dict]:
        """Search alerts by keyword"""
        query = query.lower()
        results = []
        for alert in self.alerts:
            if (query in alert['title'].lower() or 
                query in alert['description'].lower() or
                any(query in tag.lower() for tag in alert['tags'])):
                results.append(alert)
        return results