import re
from typing import Dict, Optional, List

class InfoExtractor:
    def __init__(self):
        self.company_patterns = [
            r'(?:at|with|join)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'company\s*[:：]\s*([A-Za-z\s]+)',
            r'(?:internship|job|position|role)\s+(?:at|with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:is\s+hiring|is\s+looking\s+for)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:internship|intern|program)',
            r'(?:from|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'\b(Google|Microsoft|Amazon|Apple|Facebook|Meta|Netflix|Uber|Airbnb|Salesforce|Oracle|IBM|Cisco|Adobe|Intel|NVIDIA|AMD|Spotify|Twitter|LinkedIn|GitHub|Stripe|Square|Zoom|Slack|Atlassian|TCS|Infosys|Wipro|HCL|Tech Mahindra|Accenture|Deloitte|PwC|EY|KPMG|Capgemini|Cognizant|TechSpark)\b',
        ]
        
        self.role_patterns = [
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:intern|internship|developer|engineer|analyst|associate|manager|consultant|designer|architect|scientist)',
            r'role\s*[:：]\s*([A-Za-z\s]+)',
            r'position\s*[:：]\s*([A-Za-z\s]+)',
            r'hiring\s+([A-Za-z\s]+)',
            r'for\s+the\s+role\s+of\s+([A-Za-z\s]+)',
            r'(?:internship|position)\s+as\s+([A-Za-z\s]+)',
            r'([A-Za-z\s]+)\s+(?:internship|intern)',
        ]
        
        self.location_patterns = [
            r'location\s*[:：]\s*([A-Za-z\s,]+)',
            r'based\s+in\s+([A-Za-z\s,]+)',
            r'work\s+from\s+([A-Za-z\s,]+)',
            r'office\s+[:：]\s*([A-Za-z\s,]+)',
            r'(?:Remote|Hybrid|On-site|Work from home)',
        ]
        
        self.salary_patterns = [
            r'[₹$€£]?\s*([0-9,]+(?:\s*[-–]\s*[0-9,]+)?)\s*(?:per\s*(?:month|year|annum))',
            r'salary\s*[:：]\s*([₹$€£0-9,\s]+)',
            r'stipend\s*[:：]\s*([₹$€£0-9,\s]+)',
            r'compensation\s*[:：]\s*([₹$€£0-9,\s]+)',
            r'([0-9,]+)\s*(?:per\s*(?:month|year))',
        ]
        
        self.contact_patterns = [
            r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            r'contact\s*[:：]\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})',
            r'phone\s*[:：]\s*([+\d\s-]{10,})',
        ]
        
        self.website_patterns = [
            r'https?://(?:www\.)?([a-zA-Z0-9-]+)\.(?:com|org|in|io|ai|dev|co)',
            r'(?:website|site|portal)\s*[:：]\s*([a-zA-Z0-9-]+)\.(?:com|org|in)',
            r'careers\.[a-zA-Z0-9-]+\.(?:com|org|in)',
        ]
        
        self.source_patterns = [
            r'from\s+(WhatsApp|Email|LinkedIn|Instagram|Telegram)',
            r'source\s*[:：]\s*(WhatsApp|Email|LinkedIn|Instagram|Telegram)',
            r'via\s+(WhatsApp|Email|LinkedIn|Instagram|Telegram)',
        ]

    def extract(self, text: str) -> Dict[str, Optional[str]]:
        """Extract information from text"""
        result = {
            'company': None,
            'role': None,
            'location': None,
            'salary': None,
            'source': None,
            'contact': None,
            'website': None,
        }
        
        # Clean text
        text = text.replace('\n', ' ').replace('\r', ' ')
        
        # Extract company - try multiple patterns
        for pattern in self.company_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                # Get the first match that's not too short
                for match in matches:
                    if isinstance(match, tuple):
                        match = match[0] if match else ''
                    if match and len(match) > 2 and not match.lower() in ['for', 'our', 'the', 'from']:
                        result['company'] = match.strip()
                        break
                if result['company']:
                    break
        
        # If no company found, try to find any capitalized word that might be a company
        if not result['company']:
            words = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b', text)
            # Filter out common words that aren't company names
            common_words = ['Internship', 'Program', 'Position', 'Role', 'Job', 'Opportunity', 
                           'Congratulations', 'Welcome', 'Thank', 'Please', 'Contact', 'Limited']
            for word in words:
                if len(word) > 2 and word not in common_words:
                    result['company'] = word
                    break
        
        # Extract role
        for pattern in self.role_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                role = match.group(1).strip()
                # Clean up role text
                role = re.sub(r'\s+', ' ', role)
                if len(role) > 2 and not role.lower() in ['for', 'our', 'the']:
                    result['role'] = role
                    break
        
        # If role has "You have been selected" or similar, try to extract actual role
        if result['role'] and ('selected' in result['role'].lower() or 'congratulation' in result['role'].lower()):
            # Try to find role after "for" or "as"
            role_match = re.search(r'(?:for|as)\s+([A-Za-z\s]+?)(?:\s+program|\s+internship|\s+position|$)', text, re.IGNORECASE)
            if role_match:
                result['role'] = role_match.group(1).strip()
            else:
                result['role'] = None
        
        # Extract location
        for pattern in self.location_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if pattern == r'(?:Remote|Hybrid|On-site|Work from home)':
                    result['location'] = match.group(0)
                else:
                    result['location'] = match.group(1).strip()
                break
        
        # Extract salary
        for pattern in self.salary_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if len(match.groups()) > 0:
                    salary = match.group(1).strip() if match.group(1) else match.group(0)
                    # Clean up salary
                    salary = re.sub(r'\s+', ' ', salary)
                    if salary and len(salary) > 1:
                        result['salary'] = salary
                        break
        
        # Extract contact
        for pattern in self.contact_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if '@' in match.group(0):
                    result['contact'] = match.group(0)
                elif len(match.groups()) > 0:
                    result['contact'] = match.group(1).strip() if match.group(1) else match.group(0)
                else:
                    result['contact'] = match.group(0)
                break
        
        # Extract website
        for pattern in self.website_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                if 'http' in match.group(0):
                    result['website'] = match.group(0)
                elif match.groups():
                    domain = match.group(1) if match.group(1) else match.group(0)
                    result['website'] = f"https://{domain}.com" if '.' not in domain else f"https://{domain}"
                else:
                    result['website'] = match.group(0)
                break
        
        # Extract source
        for pattern in self.source_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                result['source'] = match.group(1).strip() if match.group(1) else match.group(0)
                break
        
        return result